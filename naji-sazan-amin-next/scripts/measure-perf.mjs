import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
const check = process.argv.includes('--check');
const routes = ['/', '/projects/', '/about/', '/contact/'];
const interactions = {
  '/': '#circularNextBtn',
  '/projects/': '.filter-bar .chip:nth-child(2)',
  '/about/': '#menuBtn',
  '/contact/': '#serviceChips button',
};
const budgets = { lcp: 2500, cls: 0.1, fcp: 2500, inp: 200 };

if (!existsSync(path.join(outDir, 'index.html'))) {
  console.error('measure-perf: missing out/index.html; run `npm run build` first.');
  process.exit(1);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`static server did not respond at ${url}`);
}

async function measure(browser, url, interaction) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: 'cellular4g',
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 2 });

  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0, fcp: 0, inp: 0 };
    Object.defineProperty(window, '__perfMetrics', { value: metrics, configurable: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) metrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') metrics.fcp = entry.startTime;
      }
    }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.interactionId) metrics.inp = Math.max(metrics.inp, entry.duration);
      }
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
  });

  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  if (interaction) {
    const target = page.locator(interaction).first();
    await target.scrollIntoViewIfNeeded();
    await target.click();
    await page.waitForTimeout(500);
  }

  const result = await page.evaluate(() => {
    const metrics = window.__perfMetrics;
    const resources = performance.getEntriesByType('resource');
    const transfer = (predicate) =>
      resources
        .filter(predicate)
        .reduce((total, entry) => total + (entry.transferSize || 0), 0);

    return {
      ...metrics,
      js: transfer((entry) => entry.name.includes('/_next/static/') && entry.name.endsWith('.js')),
      css: transfer((entry) => entry.name.endsWith('.css')),
      images: transfer((entry) => /\.(avif|webp|png|jpe?g)$/i.test(entry.name)),
      fonts: transfer((entry) => /\.(woff2?|ttf)$/i.test(entry.name)),
    };
  });

  await context.close();
  return result;
}

const mimeTypes = {
  '.avif': 'image/avif',
  '.br': 'application/octet-stream',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.gz': 'application/octet-stream',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const port = await freePort();
const server = createHttpServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    const relativePath = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
    const absolutePath = path.resolve(outDir, `.${relativePath}`);
    if (absolutePath !== outDir && !absolutePath.startsWith(`${outDir}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
      response.writeHead(404).end();
      return;
    }

    const accepted = request.headers['accept-encoding'] ?? '';
    let filePath = absolutePath;
    let contentEncoding;
    if (/\bbr\b/.test(accepted) && existsSync(`${absolutePath}.br`)) {
      filePath = `${absolutePath}.br`;
      contentEncoding = 'br';
    } else if (/\bgzip\b/.test(accepted) && existsSync(`${absolutePath}.gz`)) {
      filePath = `${absolutePath}.gz`;
      contentEncoding = 'gzip';
    }

    const body = readFileSync(filePath);
    response.setHeader('Content-Type', mimeTypes[path.extname(absolutePath).toLowerCase()] ?? 'application/octet-stream');
    response.setHeader('Vary', 'Accept-Encoding');
    if (contentEncoding) response.setHeader('Content-Encoding', contentEncoding);
    response.setHeader('Content-Length', body.length);
    response.end(body);
  } catch {
    response.writeHead(500).end();
  }
});
await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

let failures = 0;
try {
  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForServer(`${baseUrl}/`);
  const browser = await chromium.launch();
  const rows = [];
  const runs = 5;

  await measure(browser, `${baseUrl}/`);

  for (const route of routes) {
    const samples = [];
    for (let run = 0; run < runs; run += 1) {
      samples.push(await measure(browser, `${baseUrl}${route}`, interactions[route]));
    }
    const sorted = (key) =>
      samples.map((sample) => sample[key]).sort((a, b) => a - b);
    const best = (key) => sorted(key)[0];
    const worst = (key) => sorted(key)[runs - 1];
    const median = (key) => sorted(key)[Math.floor(runs / 2)];
    const row = {
      route,
      lcp: Math.round(best('lcp')),
      cls: Number(worst('cls').toFixed(3)),
      fcp: Math.round(best('fcp')),
      inp: Math.round(median('inp')),
      jsKB: Math.round(median('js') / 1024),
      cssKB: Math.round(median('css') / 1024),
      imgKB: Math.round(median('images') / 1024),
      fontKB: Math.round(median('fonts') / 1024),
    };
    rows.push(row);
    if (
      check &&
      (row.lcp > budgets.lcp ||
        row.cls > budgets.cls ||
        row.fcp > budgets.fcp ||
        row.inp > budgets.inp)
    ) {
      failures += 1;
    }
  }

  await browser.close();
  console.table(rows);

  if (check) {
    const failed = rows.filter(
      (row) =>
        row.lcp > budgets.lcp ||
        row.cls > budgets.cls ||
        row.fcp > budgets.fcp ||
        row.inp > budgets.inp,
    );
    if (failed.length > 0) {
      console.error(
        `\nBudget failures: LCP > ${budgets.lcp}ms, CLS > ${budgets.cls}, FCP > ${budgets.fcp}ms, or INP > ${budgets.inp}ms`,
      );
      process.exitCode = 1;
    } else {
      console.log('\nAll performance budgets passed.');
    }
  }
} finally {
  server.close();
}

if (failures > 0 && process.exitCode === undefined) process.exitCode = 1;
