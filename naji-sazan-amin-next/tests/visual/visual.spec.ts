import fs from 'node:fs';
import path from 'node:path';

import { expect, test, type Browser, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
// @ts-expect-error pixelmatch 5 does not ship type declarations.
import pixelmatch from 'pixelmatch';

type Theme = 'light' | 'dark';

type Pixelmatch = (
  img1: Buffer,
  img2: Buffer,
  output: Buffer,
  width: number,
  height: number,
  options?: { threshold?: number; includeAA?: boolean },
) => number;

const comparePixels = pixelmatch as Pixelmatch;

const LEGACY_ORIGIN = 'http://127.0.0.1:4173';
const NEXT_ORIGIN = 'http://127.0.0.1:4174';
const FIXED_TIME = new Date('2026-10-21T06:30:00.000Z');
const PAUSED_TIME = new Date(FIXED_TIME.getTime() + 1000);
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results/visual');

const ROUTES = [
  { name: 'home', legacy: '/index.html', next: '/' },
  { name: 'about', legacy: '/about.html', next: '/about/' },
  { name: 'projects', legacy: '/projects.html', next: '/projects/' },
  { name: 'contact', legacy: '/contact.html', next: '/contact/' },
] as const;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const THEMES: Theme[] = ['light', 'dark'];

// The hero video is time-based; hiding it makes the comparison deterministic.
// The footer colours are compiled from oklch() to lab(), which leaves a few
// sub-pixel text antialiasing differences (well below the thresholds below).
const STABILITY_CSS = `
*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
html, body { scroll-behavior: auto !important; }
.reveal, .reveal.is-visible { opacity: 1 !important; transform: none !important; visibility: visible !important; }
video { visibility: hidden !important; }
`;

const MOBILE_MAX_WIDTH = 600;

// The Next mobile header intentionally hides the header CTA below 600px so the menu and
// theme toggle stay reachable; navigation.spec.ts covers that divergence. The legacy
// header still overflows by 150px, which makes the whole RTL document horizontally
// scrollable and shifts every element, so the legacy header's own overflow is clipped to
// keep the rest of the page aligned. The differing header itself is masked in capture().
const MOBILE_HEADER_CSS = '.site-header { overflow-x: clip; }';

async function stabilize(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));

    document.querySelectorAll('video').forEach((element) => {
      const video = element as HTMLVideoElement;
      video.pause();
      video.removeAttribute('autoplay');
      video.loop = false;
      video.muted = true;
      try {
        video.currentTime = 0;
      } catch {
        // The video may not be seekable yet; visibility is hidden by CSS anyway.
      }
    });

    const rotator = document.getElementById('circularGalleryRotator');
    if (rotator) rotator.style.transform = 'rotateY(0deg)';

    document.querySelectorAll<HTMLElement>('.circular-gallery-item').forEach((item, index) => {
      const base = index * 30;
      let difference = base % 360;
      if (difference < 0) difference += 360;
      const distance = Math.abs(difference <= 180 ? difference : 360 - difference);
      item.style.opacity = Math.max(0.18, 1 - (distance / 180) * 1.08).toFixed(3);
      item.style.pointerEvents = distance < 65 ? 'auto' : 'none';
    });

    document.getElementById('svc21List')?.classList.remove('is-paused');
    document.getElementById('siteHeader')?.classList.remove('is-scrolled');
    window.scrollTo(0, 0);
  });

  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(400, viewportHeight / 2);
  for (let top = 0; top < totalHeight; top += step) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await page.waitForTimeout(25);
  }

  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            }),
      ),
    );
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
  });

  await page.waitForTimeout(300);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.getElementById('siteHeader')?.classList.remove('is-scrolled');
  });
  await page.waitForTimeout(100);
}

async function capture(
  browser: Browser,
  url: string,
  options: { width: number; height: number; theme: Theme; fullPage: boolean },
) {
  const context = await browser.newContext({
    viewport: { width: options.width, height: options.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: 'fa-IR',
    timezoneId: 'Asia/Tehran',
  });

  await context.addInitScript((theme) => {
    try {
      localStorage.setItem('nsa-theme', theme);
    } catch {
      // about:blank has no storage.
    }
  }, options.theme);

  const page = await context.newPage();
  await page.clock.install({ time: FIXED_TIME });
  await page.clock.pauseAt(PAUSED_TIME);
  await page.goto(url, { waitUntil: 'load' });
  await page.addStyleTag({ content: STABILITY_CSS });
  if (options.width <= MOBILE_MAX_WIDTH) {
    await page.addStyleTag({ content: MOBILE_HEADER_CSS });
  }
  await stabilize(page);

  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const mask = options.width <= MOBILE_MAX_WIDTH ? [page.locator('.site-header')] : undefined;
  const buffer = await page.screenshot({
    fullPage: options.fullPage,
    animations: 'disabled',
    mask,
  });
  await context.close();
  return { buffer, theme };
}

for (const route of ROUTES) {
  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      for (const fullPage of [false, true]) {
        const mode = fullPage ? 'full-page' : 'viewport';

        test(`${route.name} ${viewport.name} ${theme} ${mode} matches the legacy render`, async ({ browser }, testInfo) => {
          const label = `${route.name}-${viewport.name}-${theme}-${mode}`;
          const legacy = await capture(browser, `${LEGACY_ORIGIN}${route.legacy}`, {
            width: viewport.width,
            height: viewport.height,
            theme,
            fullPage,
          });
          const next = await capture(browser, `${NEXT_ORIGIN}${route.next}`, {
            width: viewport.width,
            height: viewport.height,
            theme,
            fullPage,
          });

          expect(legacy.theme, `${label}: legacy theme`).toBe(theme);
          expect(next.theme, `${label}: next theme`).toBe(theme);

          const legacyPng = PNG.sync.read(legacy.buffer);
          const nextPng = PNG.sync.read(next.buffer);
          const dimensionsMatch =
            legacyPng.width === nextPng.width && legacyPng.height === nextPng.height;
          const threshold = fullPage ? 0.03 : 0.02;

          if (!dimensionsMatch) {
            fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
            fs.writeFileSync(path.join(SCREENSHOT_DIR, `${label}-legacy.png`), legacy.buffer);
            fs.writeFileSync(path.join(SCREENSHOT_DIR, `${label}-next.png`), next.buffer);
            expect(
              dimensionsMatch,
              `${label}: legacy ${legacyPng.width}x${legacyPng.height}, next ${nextPng.width}x${nextPng.height}`,
            ).toBe(true);
            return;
          }

          const diff = new PNG({ width: legacyPng.width, height: legacyPng.height });
          const diffPixels = comparePixels(
            legacyPng.data,
            nextPng.data,
            diff.data,
            legacyPng.width,
            legacyPng.height,
            { threshold: 0.1, includeAA: false },
          );
          const ratio = diffPixels / (legacyPng.width * legacyPng.height);

          if (ratio > threshold) {
            fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
            fs.writeFileSync(path.join(SCREENSHOT_DIR, `${label}-legacy.png`), legacy.buffer);
            fs.writeFileSync(path.join(SCREENSHOT_DIR, `${label}-next.png`), next.buffer);
            const diffPath = path.join(SCREENSHOT_DIR, `${label}-diff.png`);
            fs.writeFileSync(diffPath, PNG.sync.write(diff));
            await testInfo.attach(`${label}-diff`, { path: diffPath, contentType: 'image/png' });
          }

          expect(
            ratio,
            `${label}: ${(ratio * 100).toFixed(3)}% of pixels differ (limit ${threshold * 100}%)`,
          ).toBeLessThanOrEqual(threshold);
        });
      }
    }
  }
}
