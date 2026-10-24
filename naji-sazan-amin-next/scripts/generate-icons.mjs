#!/usr/bin/env node
// One-shot PWA icon generator from the company logo (rerunnable).
// Run: node scripts/generate-icons.mjs

import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const publicDir = join(fileURLToPath(new URL('..', import.meta.url)), 'public');
const logo = join(publicDir, 'assets', 'logo.png');
mkdirSync(join(publicDir, 'icons'), { recursive: true });

const jobs = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

for (const { size, name } of jobs) {
  await sharp(logo)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(join(publicDir, 'icons', name));
  console.log(`icons/${name} (${size}x${size})`);
}
