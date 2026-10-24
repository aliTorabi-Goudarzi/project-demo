import { readFileSync } from 'node:fs';
import path from 'node:path';

// postbuild.mjs content-hashes everything under out/assets and out/icons and
// rewrites the build's references. Tests resolve original public paths to
// their hashed URL through the emitted manifest.
let cached: Record<string, string> | null = null;

function manifest(): Record<string, string> {
  if (!cached) {
    const raw = readFileSync(path.resolve(process.cwd(), 'out', 'assets-manifest.json'), 'utf8');
    cached = JSON.parse(raw) as Record<string, string>;
  }
  return cached;
}

export function assetUrl(publicPath: string): string {
  const hashed = manifest()[publicPath];
  if (!hashed) throw new Error(`asset ${publicPath} not found in out/assets-manifest.json`);
  return hashed;
}
