#!/usr/bin/env node
// One-shot (rerunnable) image optimizer for public/assets.
// Resizes any webp/jpg wider than --max-width and re-encodes at --quality,
// skipping files that are already small enough. Run: node scripts/optimize-images.mjs

import { readdirSync, statSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'public', 'assets');
const MAX_WIDTH = Number(process.argv[2] ?? 1600);
const QUALITY = Number(process.argv[3] ?? 75);
const SKIP_BELOW = 60 * 1024; // bytes; don't bother re-encoding tiny files

async function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(webp|jpe?g)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const files = await walk(root);
let saved = 0;

for (const file of files) {
  const before = statSync(file).size;
  if (before < SKIP_BELOW) continue;

  // Read fully into memory so sharp never holds the source file open
  // while we write back over it (Windows refuses concurrent open/write).
  const input = Buffer.from(await readFile(file));
  const image = sharp(input);
  const { width } = await image.metadata();
  const resized = width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image;

  const buffer = await (file.endsWith('.webp')
    ? resized.webp({ quality: QUALITY, effort: 5 })
    : resized.jpeg({ quality: QUALITY, mozjpeg: true })
  ).toBuffer();

  if (buffer.length < before) {
    await writeFile(file, buffer);
    saved += before - buffer.length;
    console.log(`${(before / 1024).toFixed(0)} KB -> ${(buffer.length / 1024).toFixed(0)} KB  ${file}`);
  }
}

console.log(`\nDone. Saved ${(saved / 1024).toFixed(0)} KB.`);
