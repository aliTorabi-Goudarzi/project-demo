import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

test('home page content is server-rendered into the static export', () => {
  const html = fs.readFileSync(path.resolve(process.cwd(), 'out/index.html'), 'utf8');

  expect(html).toContain('شریک مهندسی مطمئن شما');
  expect(html).toContain('از سال ۱۳۸۳ تا امروز');
  expect(html).toContain('چهار حوزه تخصصی، یک تیم یکپارچه');
  expect(html).toContain('برگزیده‌ای از پروژه‌ها و آمار عملکرد');
  expect(html).toContain('سه اصل بنیادین ما');
  expect(html).toContain('مجوزها، گواهینامه‌ها و عضویت‌ها');
  expect(html).toContain('سرمایه انسانی شرکت');
  expect(html).toContain('پروژه بعدی شما');
  expect(html.match(/data-project="/g)).toHaveLength(12);
});

test.describe('hero', () => {
  test('renders the exact copy, actions and background video', async ({ page }) => {
    await page.goto('/');

    const title = page.locator('h1.hero__title');
    await expect(title).toContainText('شریک مهندسی مطمئن شما');
    await expect(title.locator('.text-gradient')).toHaveText('از سال ۱۳۸۳ تا امروز');

    await expect(page.locator('.hero__lead')).toHaveText(
      'شرکت مهندسین مشاور ناجی سازان امین با تکیه بر دانش فنی روز و سرمایه انسانی متخصص، پیشرو در خدمات جامع طراحی، نظارت عالیه، مدیریت طرح و کنترل کیفیت پروژه‌های عمرانی کشور.',
    );

    await expect(page.getByRole('link', { name: 'مشاهده پروژه‌ها' })).toHaveAttribute('href', /^\/projects\/?$/);
    await expect(page.getByRole('link', { name: 'آشنایی با شرکت' })).toHaveAttribute('href', /^\/about\/?$/);

    const video = page.locator('video#heroBgVideo');
    await expect(video).toHaveClass(/hero__bg-video/);
    await expect(video).toHaveAttribute('poster', '/assets/hero-poster.webp');
    await expect(video).toHaveAttribute('preload', 'auto');
    expect(await video.evaluate((element) => (element as HTMLVideoElement).autoplay)).toBe(true);
    expect(await video.evaluate((element) => (element as HTMLVideoElement).loop)).toBe(true);
    expect(await video.evaluate((element) => (element as HTMLVideoElement).muted)).toBe(true);
    expect(await video.evaluate((element) => (element as HTMLVideoElement).playsInline)).toBe(true);

    const sources = video.locator('source');
    await expect(sources).toHaveCount(2);
    await expect(sources.nth(0)).toHaveAttribute('src', '/assets/hero-building-loop.webm');
    await expect(sources.nth(0)).toHaveAttribute('type', 'video/webm');
    await expect(sources.nth(1)).toHaveAttribute('src', '/assets/hero-building-loop.mp4');
    await expect(sources.nth(1)).toHaveAttribute('type', 'video/mp4');

    await expect(page.locator('.hero__bg-overlay')).toHaveCount(1);
    await expect(page.locator('.hero__ambient')).toHaveCount(1);
    await expect(page.locator('.hero__grid')).toHaveCount(1);
  });
});

test.describe('services', () => {
  test('renders four services with the first one active', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section#services');
    await expect(section).toBeVisible();
    await expect(section.locator('.svc21__head h2')).toHaveText('چهار حوزه تخصصی، یک تیم یکپارچه');
    await expect(section.locator('.svc21__head p')).toHaveText(
      'از مطالعات اولیه تا تحویل نهایی در کنار شما هستیم. خدمات ما بر پایه استانداردهای ملی و بین‌المللی ارائه می‌شود.',
    );

    const items = section.locator('.svc21__item');
    await expect(items).toHaveCount(4);
    await expect(items.locator('.svc21__item-title')).toHaveText([
      'طراحی معماری و سازه',
      'نظارت عالیه و اجرا',
      'مدیریت طرح و کنترل پروژه',
      'مشاوره مهندسی و مطالعات',
    ]);

    await expect(section.locator('.svc21__item.is-active')).toHaveCount(1);
    await expect(section.locator('.svc21__item.is-active')).toContainText('طراحی معماری و سازه');
    await expect(section.locator('#svc21Title')).toHaveText('طراحی معماری و سازه');
    await expect(section.locator('#svc21Img')).toHaveAttribute('src', '/assets/projects/parsa-tower.webp');
    await expect(section.locator('#svc21Link')).toHaveAttribute('href', /^\/projects\/?$/);
    await expect(section.locator('#svc21Link')).toHaveText('نمونه پروژه‌ها');
  });

  test('clicking a service updates the preview, link and active state', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section#services');
    const items = section.locator('.svc21__item');

    await items.nth(1).click();
    await expect(section.locator('#svc21Title')).toHaveText('نظارت عالیه و اجرا');
    await expect(section.locator('#svc21Desc')).toHaveText(
      'نظارت دقیق بر اجرا با استقرار دفاتر فنی در محل پروژه و کنترل کیفیت، زمان و هزینه.',
    );
    await expect(section.locator('#svc21Img')).toHaveAttribute('src', '/assets/projects/supervision-real.webp');
    await expect(section.locator('#svc21Link')).toHaveAttribute('href', /^\/projects\/?$/);
    await expect(items.nth(1)).toHaveClass(/is-active/);

    await items.nth(3).click();
    await expect(section.locator('#svc21Title')).toHaveText('مشاوره مهندسی و مطالعات');
    await expect(section.locator('#svc21Img')).toHaveAttribute('src', '/assets/projects/consulting-real.webp');
    await expect(section.locator('#svc21Link')).toHaveAttribute('href', /^\/contact\/?$/);
    await expect(section.locator('#svc21Link')).toHaveText('درخواست مشاوره');
    await expect(items.nth(3)).toHaveClass(/is-active/);
  });

  test('autoplay advances the active service after five seconds', async ({ page }) => {
    await page.clock.install();
    await page.goto('/');

    await expect(page.locator('.hero__title')).toHaveClass(/is-visible/);
    const section = page.locator('section#services');
    await expect(section.locator('#svc21Title')).toHaveText('طراحی معماری و سازه');

    await page.clock.runFor(5500);
    await expect(section.locator('#svc21Title')).toHaveText('نظارت عالیه و اجرا');
    await expect(section.locator('.svc21__item.is-active')).toContainText('نظارت عالیه و اجرا');
  });
});

test.describe('circular gallery', () => {
  test('renders all twelve projects server-side at their 3d angles', async ({ page }) => {
    await page.goto('/');

    const items = page.locator('.circular-gallery-item');
    await expect(items).toHaveCount(12);

    const cards = page.locator('.circular-gallery-card');
    await expect(cards).toHaveCount(12);
    await expect(cards.first()).toHaveAttribute('data-project', 'cg-1');
    await expect(cards.first()).toHaveAttribute('role', 'button');
    await expect(cards.first()).toHaveAttribute('tabindex', '0');
    await expect(cards.first()).toHaveAttribute('aria-label', 'برج مسکونی لوکس پارسا');
    await expect(cards.last()).toHaveAttribute('data-project', 'cg-12');

    const firstTransform = await items.nth(0).evaluate((element) => (element as HTMLElement).style.transform);
    expect(firstTransform).toContain('rotateY(0deg) translateZ(var(--radius))');
    const secondTransform = await items.nth(1).evaluate((element) => (element as HTMLElement).style.transform);
    expect(secondTransform).toContain('rotateY(30deg) translateZ(var(--radius))');

    const firstOpacity = Number(await items.nth(0).evaluate((element) => getComputedStyle(element).opacity));
    const secondOpacity = Number(await items.nth(1).evaluate((element) => getComputedStyle(element).opacity));
    expect(firstOpacity).toBeCloseTo(1, 2);
    expect(secondOpacity).toBeCloseTo(0.82, 2);

    await expect(page.locator('.circular-gallery-stage')).toHaveAttribute('role', 'region');
    await expect(page.locator('.circular-gallery-stage')).toHaveAttribute('aria-label', 'گالری سه‌بعدی پروژه‌ها');
    await expect(page.getByRole('button', { name: 'پروژه قبلی' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'پروژه بعدی' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'مشاهده مشخصات و آرشیو کامل پروژه‌ها' })).toHaveAttribute(
      'href',
      /^\/projects\/?$/,
    );
  });

  test('hover pauses auto-rotation and prev/next rotate the stage', async ({ page }) => {
    await page.goto('/');

    const stage = page.locator('.circular-gallery-stage');
    const rotator = page.locator('#circularGalleryRotator');
    const readAngle = async () => {
      const transform = await rotator.evaluate((element) => (element as HTMLElement).style.transform);
      const match = /rotateY\((-?[\d.]+)deg\)/.exec(transform);
      return match ? Number(match[1]) : Number.NaN;
    };

    await stage.scrollIntoViewIfNeeded();
    await stage.hover();
    await expect.poll(readAngle).not.toBeNaN();

    await page.waitForTimeout(1500);
    const pausedAngle = await readAngle();
    await page.waitForTimeout(800);
    expect(Math.abs((await readAngle()) - pausedAngle)).toBeLessThan(1);

    await page.getByRole('button', { name: 'پروژه بعدی' }).dispatchEvent('click');
    await expect.poll(readAngle).toBeLessThan(pausedAngle - 20);

    const afterNext = await readAngle();
    await page.getByRole('button', { name: 'پروژه قبلی' }).dispatchEvent('click');
    await expect.poll(readAngle).toBeGreaterThan(afterNext + 10);
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('auto-rotation is disabled but manual controls and card activation still work', async ({ page }) => {
      await page.goto('/');

      const stage = page.locator('.circular-gallery-stage');
      const rotator = page.locator('#circularGalleryRotator');
      await stage.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      expect(await rotator.evaluate((element) => (element as HTMLElement).style.transform)).toBe('rotateY(0deg)');

      await page.getByRole('button', { name: 'پروژه بعدی' }).click();
      await expect
        .poll(async () => rotator.evaluate((element) => (element as HTMLElement).style.transform))
        .toBe('rotateY(-30deg)');

      const card = page.locator('.circular-gallery-card[data-project="cg-1"]');
      await card.click();
      await expect(page.locator('#projectModal')).toHaveClass(/is-open/);
      await expect(page.locator('#modalTitle')).toHaveText('برج مسکونی لوکس پارسا');
      await page.keyboard.press('Escape');
      await expect(page.locator('#projectModal')).not.toHaveClass(/is-open/);

      await card.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#projectModal')).toHaveClass(/is-open/);
      await page.keyboard.press('Escape');

      await card.focus();
      await page.keyboard.press('Space');
      await expect(page.locator('#projectModal')).toHaveClass(/is-open/);
      await page.keyboard.press('Escape');
      await expect(page.locator('#projectModal')).not.toHaveClass(/is-open/);
    });
  });
});

test('pillars, credentials and team match the legacy content', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('.cad-card')).toHaveCount(3);
  await expect(page.locator('.cad-card__title')).toHaveText(['دانش فنی روز', 'تعهد به کیفیت', 'تیم متخصص']);
  await expect(page.locator('.cad-card__coord')).toHaveText(['۲۲ سال سابقه', 'ISO 9001:2015', 'کادر مهندسی ارشد']);
  await expect(page.locator('.cad-card__num')).toHaveText(['۰۱', '۰۲', '۰۳']);

  await expect(page.locator('.tl-h__item')).toHaveCount(5);
  await expect(page.locator('.tl-h__item .seal-title')).toHaveText([
    'پروانه حقوقی پایه یک',
    'گواهینامه ISO 9001',
    'مدال برنزین جایزه ملی بقراط',
    'عضویت در انجمن بتن ایران',
    'گواهینامه سمتا',
  ]);
  await expect(page.locator('.tl-h__item .seal-year')).toHaveText(['۱۳۸۳', '۱۳۸۹', '۱۳۹۲', '۱۳۹۰', '۱۳۹۴']);

  await expect(page.locator('.teamshowcase__intro h2')).toHaveText('سرمایه انسانی شرکت');
  await expect(page.getByRole('link', { name: 'درخواست مشاوره' }).last()).toHaveAttribute('href', /^\/contact\/?$/);
  await expect(page.locator('.tmember')).toHaveCount(7);
  await expect(page.locator('.tmember__name')).toHaveText([
    'سعید رفیعی',
    'حامد یزدان پناه',
    'محمد منزوی',
    'امیر ربیعی فر',
    'وحید جمالی',
    'احمد نادری',
    'مهدی نوری',
  ]);
  await expect(page.locator('.tmember__role')).toHaveText([
    'مدیر نظارت',
    'مدیر طرح و برنامه',
    'مدیر عامل',
    'مدیر آزمایشگاه',
    'مدیر امور قراردادها',
    'معاونت فنی و نظارت',
    'مدیر مطالعات و طراحی',
  ]);

  const leadImage = page.locator('.tmember img').first();
  await expect(leadImage).toHaveAttribute('src', '/assets/team/lead-structure.jpg');
  await expect(leadImage).toHaveAttribute('width', '600');
  await expect(leadImage).toHaveAttribute('height', '800');

  const cta = page.locator('.cta');
  await expect(cta.locator('h2')).toHaveText('پروژه بعدی شما');
  await expect(cta.locator('p')).toHaveText(
    'برای دریافت مشاوره تخصصی و برآورد اولیه با ما در تماس باشید. تیم ما آماده پاسخگویی به نیازهای پروژه شماست.',
  );
  await expect(cta.getByRole('link', { name: 'تماس با ما' })).toHaveAttribute('href', /^\/contact\/?$/);
  await expect(cta.getByRole('link', { name: 'درباره شرکت' })).toHaveAttribute('href', /^\/about\/?$/);
});
