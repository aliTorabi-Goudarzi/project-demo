import { expect, test } from '@playwright/test';

import { PROJECTS, PROJECT_CATEGORIES } from '../../src/lib/projects';

import { assetUrl } from './assets';

const expectedCounts: Record<string, number> = {
  all: 9,
  residential: 2,
  commercial: 2,
  cultural: 1,
  healthcare: 1,
  office: 1,
  restoration: 1,
  infrastructure: 1,
};

test('projects page renders head, metadata, chips and server-rendered cards', async ({ page }) => {
  await page.goto('/projects/');

  await expect(page).toHaveTitle('پروژه‌ها | مهندسین مشاور ناجی سازان امین');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'نمونه پروژه‌های شرکت مهندسین مشاور ناجی سازان امین.',
  );

  await expect(page.locator('.page-head__title')).toHaveText('نمونه پروژه‌های شاخص');
  await expect(page.locator('.page-head .lead')).toHaveText(
    'گزیده‌ای از پروژه‌های شاخص شرکت در حوزه‌های مختلف طراحی، نظارت و مدیریت طرح در سراسر کشور.',
  );

  const chips = page.locator('#filterBar.filter-bar.filter-bar--pills .chip');
  await expect(chips).toHaveCount(8);
  for (const [index, category] of PROJECT_CATEGORIES.entries()) {
    await expect(chips.nth(index)).toHaveText(
      `${category.label} (${expectedCounts[category.slug] ?? 0})`,
    );
  }
  await expect(chips.nth(0)).toHaveClass(/is-active/);
  await expect(chips.nth(0)).toHaveAttribute('aria-pressed', 'true');

  const cards = page.locator('#projectGrid.grid.grid-2 .project.spotlight-card.reveal');
  await expect(cards).toHaveCount(9);
  for (const [index, project] of PROJECTS.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveAttribute('data-project', project.id);
    await expect(card).toHaveAttribute('data-cat', project.categorySlug);
    if (index % 3) {
      await expect(card).toHaveAttribute('data-delay', String(index % 3));
    } else {
      await expect(card).not.toHaveAttribute('data-delay');
    }
    await expect(card.locator('.project__cat')).toHaveText(project.category);
    await expect(card.locator('.project__title')).toHaveText(project.title);
    await expect(card.locator('.project__summary')).toHaveText(project.summary);
    await expect(card.locator('.project__media img')).toHaveAttribute('src', assetUrl(project.image));
    await expect(card.locator('.project__media img')).toHaveAttribute('alt', project.title);
  }

  const response = await page.request.get('/projects/');
  const html = await response.text();
  for (const project of PROJECTS) {
    expect(html).toContain(`data-project="${project.id}"`);
  }
  expect(html.match(/data-project="/g)).toHaveLength(PROJECTS.length);
});

test('filters hide and restore the server-rendered cards', async ({ page }) => {
  await page.goto('/projects/');

  const allChip = page.locator('#filterBar .chip[data-cat="all"]');
  const residentialChip = page.locator('#filterBar .chip[data-cat="residential"]');
  const commercialChip = page.locator('#filterBar .chip[data-cat="commercial"]');
  const cards = page.locator('#projectGrid .project');

  await residentialChip.click();
  await expect(residentialChip).toHaveClass(/is-active/);
  await expect(residentialChip).toHaveAttribute('aria-pressed', 'true');
  await expect(allChip).not.toHaveClass(/is-active/);
  await expect(allChip).toHaveAttribute('aria-pressed', 'false');

  await expect(page.locator('.project:visible')).toHaveCount(2);
  await expect(page.locator('[data-project="parsa-tower"]')).toBeVisible();
  await expect(page.locator('[data-project="niavaran-villa"]')).toBeVisible();
  await expect(page.locator('[data-project="atlas-complex"]')).toBeHidden();
  await expect(cards).toHaveCount(9);

  await commercialChip.click();
  await expect(commercialChip).toHaveClass(/is-active/);
  await expect(commercialChip).toHaveAttribute('aria-pressed', 'true');
  await expect(residentialChip).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.project:visible')).toHaveCount(2);
  await expect(page.locator('[data-project="atlas-complex"]')).toBeVisible();
  await expect(page.locator('[data-project="venus-mall"]')).toBeVisible();

  await allChip.click();
  await expect(allChip).toHaveClass(/is-active/);
  await expect(allChip).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.project:visible')).toHaveCount(9);
  await expect(cards).toHaveCount(9);
});

test('project card click opens the modal and Escape restores scrolling', async ({ page }) => {
  await page.goto('/projects/');

  await page.locator('[data-project="parsa-tower"]').click();

  const modal = page.locator('#projectModal');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('برج مسکونی پارسا');
  await expect(page.locator('#modalClient')).toHaveText('شرکت ساختمانی پارسا');
  await expect(page.locator('#modalLocation')).toHaveText('تهران / الهیه');
  await expect(page.locator('#modalCategory')).toHaveText('مسکونی');
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('the modal traps keyboard focus, hides itself when closed and restores focus', async ({ page }) => {
  await page.goto('/projects/');

  const card = page.locator('[data-project="parsa-tower"]');
  const modal = page.locator('#projectModal');
  const close = page.locator('#modalClose');

  await expect(modal).toHaveAttribute('inert', '');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');

  await card.focus();
  await page.keyboard.press('Enter');
  await expect(modal).toHaveClass(/is-open/);
  await expect(modal).not.toHaveAttribute('inert');
  await expect(close).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);
  await expect(modal).toHaveAttribute('inert', '');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect(card).toBeFocused();
});

test('project cards are keyboard operable', async ({ page }) => {
  await page.goto('/projects/');

  const card = page.locator('[data-project="atlas-complex"]');
  const modal = page.locator('#projectModal');

  await card.focus();
  await page.keyboard.press('Enter');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('مجتمع تجاری اطلس');

  await page.keyboard.press('Escape');
  await expect(modal).not.toHaveClass(/is-open/);

  await page.keyboard.press('Space');
  await expect(modal).toHaveClass(/is-open/);
  await expect(page.locator('#modalTitle')).toHaveText('مجتمع تجاری اطلس');
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
