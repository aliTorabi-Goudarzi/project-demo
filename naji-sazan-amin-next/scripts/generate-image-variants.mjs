#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'public', 'assets');
const outputRoot = join(root, 'generated');
const widths = [290, 300, 400, 580, 600, 800];
const formats = [
  { ext: 'webp', encode: (image) => image.webp({ quality: 74, effort: 4 }) },
  { ext: 'avif', encode: (image) => image.avif({ quality: 50, effort: 2 }) },
];

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'generated') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(webp|jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const files = walk(root);
let generated = 0;
let skipped = 0;

for (const file of files) {
  const metadata = await sharp(file).metadata();
  if (!metadata.width) continue;

  for (const width of widths) {
    if (width > metadata.width) continue;

    for (const format of formats) {
      const sourceRelative = relative(root, file);
      const parsed = sourceRelative.match(/^(.*?)([^\\/]+)(\.[^.]+)$/);
      if (!parsed) continue;
      const output = join(outputRoot, parsed[1], `${parsed[2]}-${width}.${format.ext}`);

      if (existsSync(output) && statSync(output).mtimeMs >= statSync(file).mtimeMs) {
        skipped += 1;
        continue;
      }

      mkdirSync(dirname(output), { recursive: true });
      await format.encode(sharp(file).resize({ width })).toFile(output);
      generated += 1;
    }
  }
}

console.log(`image variants: generated ${generated}, reused ${skipped}`);
