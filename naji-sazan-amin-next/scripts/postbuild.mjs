import { copyFileSync, existsSync, lstatSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(appRoot, 'out');
const pagePayloadName = '__PAGE__.txt';
const nestedSegmentDirPattern = /^__next\..+/;
// Text assets served precompressed (.gz/.br) by nginx gzip_static/brotli_static.
const precompressExtensions = /\.(html|js|css|txt|svg|xml|json|webmanifest)$/;

if (!existsSync(outDir) || !statSync(outDir).isDirectory()) {
  console.error('postbuild: missing out/ directory; run `next build` first.');
  process.exit(1);
}

function isNestedPagePayloadDir(dir) {
  let stats;
  try {
    stats = lstatSync(path.join(dir, pagePayloadName));
  } catch {
    return false;
  }
  return stats.isFile() && !stats.isSymbolicLink();
}

function walk(dir, relativeDir, copied) {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  );

  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;

    const absolutePath = path.join(dir, entry.name);
    const relativePath = relativeDir === '' ? entry.name : path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === '_next') continue;

      if (nestedSegmentDirPattern.test(entry.name) && isNestedPagePayloadDir(absolutePath)) {
        const targetName = `${entry.name}.${pagePayloadName}`;
        const targetPath = path.join(dir, targetName);
        copyFileSync(path.join(absolutePath, pagePayloadName), targetPath);
        copied.push(path.relative(outDir, targetPath).split(path.sep).join('/'));
      }

      walk(absolutePath, relativeDir === '' ? entry.name : `${relativeDir}/${entry.name}`, copied);
    }
  }
}

// Content-hash every binary asset under out/assets and out/icons so they can
// be cached immutable for a year, and rewrite every reference to them in the
// text build output (HTML/JS/CSS/RSC payloads/manifest/sitemap).
function fingerprintAssets(replacements) {
  const assetRoots = ['assets', 'icons'].map((dir) => path.join(outDir, dir));

  const manifest = {};
  for (const assetRoot of assetRoots) {
    if (!existsSync(assetRoot)) continue;

    const files = [];
    collectFiles(assetRoot, files);

    for (const file of files) {
      if (/-[a-f0-9]{8}\.[^.]+$/.test(file.name)) continue; // already hashed

      const body = readFileSync(file.absolutePath);
      const hash = createHash('md5').update(body).digest('hex').slice(0, 8);
      const hashedName = `${file.base}-${hash}${file.ext}`;
      copyFileSync(file.absolutePath, path.join(file.dir, hashedName));

      const publicPath = `/${path.relative(outDir, file.absolutePath).split(path.sep).join('/')}`;
      const hashedPath = publicPath.replace(`${file.base}${file.ext}`, hashedName);
      manifest[publicPath] = hashedPath;

      // Keep the unhashed original next to the hashed copy: browsers holding
      // a pre-rebuild page in memory (open tab) or cache still request the
      // old paths, and a visible stale image beats a 404. Hashed names remain
      // the canonical cache-busting URLs written into the build output.
      copyFileSync(file.absolutePath, path.join(file.dir, hashedName));

      // Names may contain spaces: the raw form lives in inline styles/HTML,
      // the URL-encoded form in JS string literals.
      for (const variant of new Set([publicPath, encodeURI(publicPath)])) {
        replacements.set(variant, hashedPath);
      }
    }
  }

  // Rewrite references everywhere text is emitted.
  const referencedExtensions = /\.(html|js|css|txt|webmanifest|xml)$/;
  rewriteReferences(outDir, referencedExtensions, replacements);

  dedupePreloads(outDir);
  return manifest;
}

function collectFiles(dir, files) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(absolutePath, files);
    else files.push({ absolutePath, dir, name: entry.name, base: entry.name.replace(/\.[^.]+$/, ''), ext: entry.name.slice(entry.name.lastIndexOf('.')) });
  }
}

function rewriteReferences(dir, extensions, replacements) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteReferences(absolutePath, extensions, replacements);
    } else if (extensions.test(entry.name)) {
      let body = readFileSync(absolutePath, 'utf8');
      let changed = false;
      for (const [from, to] of replacements) {
        if (body.includes(from)) {
          body = body.split(from).join(to);
          changed = true;
        }
      }
      if (changed) writeFileSync(absolutePath, body);
    }
  }
}

// Next may emit a font preload twice (manual + automatic injection can agree
// after hashing); collapse preload <link> tags that share the same href.
function dedupePreloads(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      dedupePreloads(absolutePath);
    } else if (entry.name.endsWith('.html')) {
      const body = readFileSync(absolutePath, 'utf8');
      const seenHrefs = new Set();
      const deduped = body.replace(/<link [^>]*rel="preload"[^>]*\/>/g, (tag) => {
        const href = /href="([^"]*)"/.exec(tag)?.[1];
        if (href === undefined) return tag;
        if (seenHrefs.has(href)) return '';
        seenHrefs.add(href);
        return tag;
      });
      if (deduped !== body) writeFileSync(absolutePath, deduped);
    }
  }
}

// Write .gz/.br siblings for every text asset anywhere under out/ (including
// _next/static), so nginx brotli_static/gzip_static can serve them.
function precompress(dir, compressed) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;

    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      precompress(absolutePath, compressed);
    } else if (precompressExtensions.test(entry.name) && statSync(absolutePath).size > 1024) {
      const body = readFileSync(absolutePath);
      writeFileSync(`${absolutePath}.gz`, gzipSync(body, { level: 9 }));
      writeFileSync(`${absolutePath}.br`, brotliCompressSync(body));
      compressed.push(path.relative(outDir, absolutePath).split(path.sep).join('/'));
    }
  }
}

const copied = [];

try {
  walk(outDir, '', copied);
  const replacements = new Map();
  const manifest = fingerprintAssets(replacements);
  writeFileSync(path.join(outDir, 'assets-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`postbuild: fingerprinted ${Object.keys(manifest).length} asset(s) -> assets-manifest.json`);
  const compressed = [];
  precompress(outDir, compressed);
  console.log(`postbuild: precompressed ${compressed.length} text asset(s) with .gz and .br`);
} catch (error) {
  console.error(`postbuild: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

copied.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
console.log(`postbuild: copied ${copied.length} RSC page payload(s)`);
for (const target of copied) {
  console.log(`  ${target}`);
}
