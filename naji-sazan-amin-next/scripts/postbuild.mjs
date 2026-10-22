import { copyFileSync, existsSync, lstatSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(appRoot, 'out');
const pagePayloadName = '__PAGE__.txt';
const nestedSegmentDirPattern = /^__next\..+/;

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

      walk(absolutePath, relativePath, copied);
    }
  }
}

const copied = [];

try {
  walk(outDir, '', copied);
} catch (error) {
  console.error(`postbuild: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

copied.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
console.log(`postbuild: copied ${copied.length} RSC page payload(s)`);
for (const target of copied) {
  console.log(`  ${target}`);
}
