import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';
const npm = isWin ? 'npm.cmd' : 'npm';
const npx = isWin ? 'npx.cmd' : 'npx';

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: isWin,
  });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

fs.rmSync(path.join(root, 'out'), { recursive: true, force: true });
fs.rmSync(path.join(root, 'out-endpoint'), { recursive: true, force: true });

run(npm, ['run', 'build'], { NEXT_PUBLIC_CONTACT_ENDPOINT: '/api/contact' });
fs.cpSync(path.join(root, 'out'), path.join(root, 'out-endpoint'), { recursive: true });

run(npm, ['run', 'build'], { NEXT_PUBLIC_CONTACT_ENDPOINT: '' });
run(npx, ['playwright', 'test']);
