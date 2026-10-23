import { expect, test } from '@playwright/test';

import {
  ENDPOINT_URL,
  SUBMIT_BUTTON,
  SUBMIT_ERROR,
  VALID_MESSAGE,
  endpointBuildExists,
  fillValidForm,
} from './contact-fixtures';

test('the demo build simulates success without posting to the endpoint', async ({ page }) => {
  let requests = 0;
  page.on('request', (request) => {
    if (request.url().includes('/api/contact')) requests += 1;
  });

  await page.goto('/contact/');
  await fillValidForm(page);
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  await expect(page.locator('#formSuccess')).toContainText('استعلام شما با موفقیت ثبت شد.');
  expect(requests).toBe(0);
  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#message')).toHaveValue('');
});

test('the honeypot suppresses the request and still shows success', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  let requests = 0;
  await page.route('**/api/contact', (route) => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.locator('#company_website').fill('bot-filled', { force: true });
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  expect(requests).toBe(0);
  await expect(page.locator('#name')).toHaveValue('');
});

test('valid submissions post the exact JSON payload', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  type Captured = { method: string; contentType: string; body: unknown };
  let captured: Captured | null = null;

  await page.route('**/api/contact', async (route) => {
    captured = {
      method: route.request().method(),
      contentType: route.request().headers()['content-type'] ?? '',
      body: route.request().postDataJSON(),
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.locator('#serviceChips .form-chip').filter({ hasText: 'مشاوره و مقاوم‌سازی' }).click();
  await page.locator('#scaleChips .form-chip').filter({ hasText: 'تجاری و اداری' }).click();
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);

  const payload = captured as Captured | null;
  if (!payload) throw new Error('no contact request was captured');

  expect(payload.method).toBe('POST');
  expect(payload.contentType).toContain('application/json');
  expect(payload.body).toEqual({
    name: 'مهندس احمدی',
    phone: '09121234567',
    email: 'ahmadi@example.com',
    city: 'تهران / منطقه ۱',
    message: VALID_MESSAGE,
    type: 'مشاوره و مقاوم‌سازی',
    scale: 'تجاری و اداری',
  });

  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#serviceInput')).toHaveValue('طراحی معماری و سازه');
  await expect(page.locator('#scaleInput')).toHaveValue('مسکونی و بلندمرتبه');
});

test('invalid submissions never reach the endpoint', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  let requests = 0;
  await page.route('**/api/contact', (route) => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto(ENDPOINT_URL);
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('.field--error')).toHaveCount(3);
  expect(requests).toBe(0);
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('name');
  await expect(page.locator('#name')).toHaveValue('');
});

test('a server error keeps the values and a retry can succeed', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  let status = 500;
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ ok: status === 200 }),
    }),
  );

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.locator('#serviceChips .form-chip').filter({ hasText: 'مدیریت طرح (MC)' }).click();
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('.form__submit-error')).toHaveText(SUBMIT_ERROR);
  await expect(page.locator('#formSuccess')).not.toHaveClass(/is-visible/);
  await expect(page.locator('#name')).toHaveValue('مهندس احمدی');
  await expect(page.locator('#message')).toHaveValue(VALID_MESSAGE);
  await expect(page.locator('#serviceInput')).toHaveValue('مدیریت طرح (MC)');

  status = 200;
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  await expect(page.locator('.form__submit-error')).toHaveCount(0);
  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#serviceInput')).toHaveValue('طراحی معماری و سازه');
});

test('a network failure keeps the values and lets the user retry', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  let requests = 0;
  await page.route('**/api/contact', (route) => {
    requests += 1;
    return route.abort('failed');
  });

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

  await expect(page.locator('.form__submit-error')).toHaveText(SUBMIT_ERROR);
  expect(requests).toBe(1);
  await expect(page.locator('#name')).toHaveValue('مهندس احمدی');
  await expect(page.locator('#message')).toHaveValue(VALID_MESSAGE);
  await expect(page.locator('#formSuccess')).not.toHaveClass(/is-visible/);
});
