import { expect, test } from '@playwright/test';

import { imageVariant } from '../../src/components/shared/ResponsiveImage';
import { PROJECTS, PROJECT_CATEGORIES } from '../../src/lib/projects';

import { assetUrl } from './assets';

const expectedCounts: Record<string, number> = { all: PROJECTS.length };
for (const project of PROJECTS) {
  expectedCounts[project.serviceSlug] = (expectedCounts[project.serviceSlug] ?? 0) + 1;
}

test('projects page renders head, metadata, chips and server-rendered cards', async ({ page }) => {
  await page.goto('/projects/');

  await expect(page).toHaveTitle('پروژه‌ها | مهندسین مشاور ناجی سازان امین');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'نمونه پروژه‌های شرکت مهندسین مشاور ناجی سازان امین.',
  );

  await expect(page.locator('main [data-cat-head]:visible .page-head__title')).toHaveText('پروژه‌های طراحی');
  await expect(page.locator('main [data-cat-head]:visible .page-head .lead')).toHaveText(
    'گزیده‌ای از پروژه‌های طراحی معماری و سازه؛ از مطالعات فاز صفر و یک تا مدلسازی سه‌بعدی، نقشه‌های اجرایی و هماهنگی تأسیسات.',
  );

  const heads = page.locator('main [data-cat-head]');
  await expect(heads).toHaveCount(PROJECT_CATEGORIES.length);
  for (const [index, category] of PROJECT_CATEGORIES.entries()) {
    await expect(heads.nth(index).locator('.page-head__title')).toHaveText(category.title);
    await expect(heads.nth(index).locator('.page-head .lead')).toHaveText(category.lead);
  }
  await expect(heads.nth(0).locator('.page-head')).toBeVisible();
  await expect(heads.nth(1).locator('.page-head')).toBeHidden();

  const cards = page.locator('#projectGrid.grid.grid-2 .project.spotlight-card.reveal');
  await expect(cards).toHaveCount(PROJECTS.length);
  for (const [index, project] of PROJECTS.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('data-project', project.id);
    await expect(card).toHaveAttribute('data-cat', project.serviceSlug);
    if (index % 3) {
      await expect(card).toHaveAttribute('data-delay', String(index % 3));
    } else {
      await expect(card).not.toHaveAttribute('data-delay');
    }
    await expect(card.locator('.project__cat')).toHaveText(`${project.service} · ${project.type}`);
    await expect(card.locator('.project__title')).toHaveText(project.title);
    await expect(card.locator('.project__summary')).toHaveText(project.summary);
    await expect(card.locator('.project__media img')).toHaveAttribute(
      'src',
      imageVariant(project.image, 600, 'webp'),
    );
    await expect(card.locator('.project__media img')).toHaveAttribute('alt', project.title);
  }

  const response = await page.request.get('/projects/');
  const html = await response.text();
  for (const project of PROJECTS) {
    expect(html).toContain(`data-project="${project.id}"`);
  }
  expect(html.match(/data-project="/g)).toHaveLength(PROJECTS.length);
});

test('the ?cat param selects the category, its cards and its page head', async ({ page }) => {
  const cards = page.locator('#projectGrid .project');

  await page.goto('/projects/');
  await expect(page.locator('main [data-cat-head]:visible .page-head__title')).toHaveText('پروژه‌های طراحی');
  await expect(page.locator('.project:visible')).toHaveCount(expectedCounts.design);
  await expect(page.locator('[data-project="france-market-kish"]')).toBeVisible();
  await expect(page.locator('[data-project="arg-kish"]')).toBeHidden();
  await expect(cards).toHaveCount(PROJECTS.length);

  await page.goto('/projects/?cat=supervision');
  await expect(page.locator('main [data-cat-head]:visible .page-head__title')).toHaveText('پروژه‌های نظارت');
  await expect(page.locator('.project:visible')).toHaveCount(expectedCounts.supervision);
  await expect(page.locator('[data-project="arg-kish"]')).toBeVisible();
  await expect(page.locator('[data-project="france-market-kish"]')).toBeHidden();

  await page.goto('/projects/?cat=lab');
  await expect(page.locator('main [data-cat-head]:visible .page-head__title')).toHaveText('خدمات آزمایشگاهی');
  await expect(page.locator('.project:visible')).toHaveCount(expectedCounts.lab);
  await expect(page.locator('[data-project="lab-consolidation"]')).toBeVisible();
  await expect(page.locator('[data-project="arg-kish"]')).toBeHidden();
  await expect(cards).toHaveCount(PROJECTS.length);
});

test('project card click opens the gallery modal and Escape restores scrolling', async ({ page }) => {
  await page.goto('/projects/');

  await page.locator('[data-project="france-market-kish"]').click();

  const modal = page.locator('#projectModal');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('بازار فرانسه کیش');
  await expect(page.locator('#modalService')).toHaveText('طراحی');
  await expect(page.locator('#modalType')).toHaveText('تجاری، رفاهی');
  await expect(page.locator('#modalLocation')).toHaveText('کیش');
  await expect(page.locator('.modal__scope')).toHaveText('زیربنای کل: ۲۳٬۶۰۰ مترمربع');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  const thumbs = page.locator('.modal__thumb');
  await expect(thumbs).toHaveCount(8);
  expect(
    await page
      .locator('#modalMedia img')
      .evaluate((element) => getComputedStyle(element).objectFit),
  ).toBe('contain');
  await thumbs.nth(1).click();
  await expect(page.locator('#modalMedia img')).toHaveAttribute(
    'src',
    imageVariant('/assets/projects/real/france-market-kish/01.webp', 800, 'webp'),
  );

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('the modal traps keyboard focus, hides itself when closed and restores focus', async ({ page }) => {
  await page.goto('/projects/');

  const card = page.locator('[data-project="france-market-kish"]');
  const modal = page.locator('#projectModal');
  const close = page.locator('#modalClose');

  await expect(modal).toHaveAttribute('inert', '');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');

  await card.focus();
  await page.keyboard.press('Enter');
  await expect(modal).toHaveClass(/is-open/);
  await expect(modal).not.toHaveAttribute('inert');
  await expect(close).toBeFocused();

  const focusInsideModal = () =>
    page.evaluate(() => Boolean(document.querySelector('#projectModal')?.contains(document.activeElement)));

  await page.keyboard.press('Tab');
  expect(await focusInsideModal()).toBe(true);
  await page.keyboard.press('Shift+Tab');
  expect(await focusInsideModal()).toBe(true);

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  await expect(modal).toHaveAttribute('inert', '');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect(card).toBeFocused();
});

test('project cards are keyboard operable', async ({ page }) => {
  await page.goto('/projects/');

  const card = page.locator('[data-project="france-market-kish"]');
  const modal = page.locator('#projectModal');

  await card.focus();
  await page.keyboard.press('Enter');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('بازار فرانسه کیش');

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);

  await page.keyboard.press('Space');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('بازار فرانسه کیش');
});

test('CTA points to the contact page', async ({ page }) => {
  await page.goto('/projects/');

  const cta = page.locator('.cta');
  await expect(cta.locator('h2')).toHaveText('ایده‌ای در ذهن دارید؟');
  await expect(cta.locator('p')).toHaveText(
    'برای مشاوره و برآورد اولیه پروژه با ما در تماس باشید. تیم ما در ۲۴ ساعت پاسخگوی شما خواهد بود.',
  );

  const link = cta.getByRole('link', { name: 'شروع همکاری' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', /^\/contact\/?$/);
  await expect(cta.getByRole('link')).toHaveCount(1);
});
