import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['run', 'build'], {
  env: { ...process.env, ANALYZE: 'true', NEXT_TELEMETRY_DISABLED: '1' },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
