import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';

import { PROJECTS, PROJECT_CATEGORIES, getProjectById } from '../../src/lib/projects';
import { SERVICES } from '../../src/lib/services';

test.use({ viewport: { width: 390, height: 844 } });

test('data contracts match the current site', () => {
  expect(PROJECTS).toHaveLength(36);
  expect(SERVICES).toHaveLength(4);
  expect(PROJECT_CATEGORIES.map((category) => category.slug)).toEqual([
    'all',
    'design',
    'supervision',
  ]);
  expect(new Set(PROJECTS.map((project) => project.id)).size).toBe(PROJECTS.length);
  expect(getProjectById('france-market-kish')?.title).toBe('بازار فرانسه کیش');
  expect(getProjectById('missing')).toBeUndefined();
});

test('static export emits index.html and 404.html', () => {
  expect(fs.existsSync(path.resolve(process.cwd(), 'out/index.html'))).toBe(true);
  expect(fs.existsSync(path.resolve(process.cwd(), 'out/404.html'))).toBe(true);
});

test('non-hero navigation keeps App Router prefetch enabled', () => {
  const componentDir = path.resolve(process.cwd(), 'src/components');
  const files = [
    'layout/SiteHeader.tsx',
    'layout/Drawer.tsx',
    'layout/SiteFooter.tsx',
    'home/Team.tsx',
    'home/CircularGallery.tsx',
    'home/Services21.tsx',
  ];

  for (const file of files) {
    const source = fs.readFileSync(path.join(componentDir, file), 'utf8');
    expect(source, `${file} must not disable Link prefetch`).not.toContain('prefetch={false}');
  }

  const hero = fs.readFileSync(path.join(componentDir, 'home/HomeHero.tsx'), 'utf8');
  expect(hero).toContain('prefetch={false}');
});

test('static export ships styles, the service worker and speculation rules', () => {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'out/index.html'), 'utf8');
  expect(html).toMatch(/<link[^>]+rel="stylesheet"/);
  expect(html).toContain('speculationrules');
  expect(fs.existsSync(path.resolve(process.cwd(), 'out/sw.js'))).toBe(true);
});

test('home renders the shared shell without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', 'fa');
  await expect(html).toHaveAttribute('dir', 'rtl');
  await expect(html).toHaveAttribute('data-theme', /light|dark/);

  await expect(page.locator('#siteHeader')).toBeVisible();
  await expect(page.locator('#siteFooter')).toBeVisible();
  await expect(page.locator('#themeToggle')).toBeVisible();
  await expect(page.locator('#menuBtn')).toBeVisible();

  expect(errors).toEqual([]);
});

test('Vazirmatn is loaded and applied', async ({ page }) => {
  await page.goto('/');

  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    await document.fonts.load('16px Vazirmatn', 'ABC');
    return document.fonts.check('16px Vazirmatn');
  });
  expect(loaded).toBe(true);

  const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(fontFamily).toContain('Vazirmatn');
});

test('theme persists across reloads and toggles', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('nsa-theme', 'dark'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.locator('#themeToggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('nsa-theme'))).toBe('light');
});

test('mobile drawer opens and closes with Escape', async ({ page }) => {
  await page.goto('/');

  await page.locator('#menuBtn').click();
  await expect(page.locator('#drawer')).toHaveClass(/is-open/);
  await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(page.locator('#drawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#menuBtn')).toHaveAttribute('aria-expanded', 'false');
});

test('404 page is exported and styled', async ({ page }) => {
  const response = await page.goto('/404.html');
  expect(response?.status()).toBe(200);
  await expect(page.locator('main')).toContainText('صفحه یافت نشد');
  await expect(page.getByRole('link', { name: 'بازگشت به خانه' })).toBeVisible();
});
