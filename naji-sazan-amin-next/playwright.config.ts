import fs from 'node:fs';
import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

const outEndpoint = path.resolve(__dirname, 'out-endpoint');

const webServer = [
  {
    command: 'python -m http.server 4174 --bind 127.0.0.1 --directory out',
    url: 'http://127.0.0.1:4174/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  ...(fs.existsSync(outEndpoint)
    ? [
        {
          command: 'python -m http.server 4175 --bind 127.0.0.1 --directory out-endpoint',
          url: 'http://127.0.0.1:4175/',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      ]
    : []),
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer,
});
