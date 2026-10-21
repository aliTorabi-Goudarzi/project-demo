import fs from 'node:fs';
import path from 'node:path';

import { expect, test, type Page } from '@playwright/test';

const SERVICE_INITIAL = 'طراحی معماری و سازه';
const SCALE_INITIAL = 'مسکونی و بلندمرتبه';
const VALID_MESSAGE = 'متراژ تقریبی ۵۰۰۰ مترمربع، ۱۰ طبقه و پرونده شهرداری در مرحله اول.';
const ENDPOINT_URL = process.env.CONTACT_E2E_ENDPOINT_URL ?? 'http://127.0.0.1:4175/contact/';
const SUBMIT_ERROR =
  'ارسال استعلام انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر تماس بگیرید.';

const endpointBuildExists = () =>
  fs.existsSync(path.resolve(process.cwd(), 'out-endpoint'));

async function fillValidForm(page: Page) {
  await page.locator('#name').fill('مهندس احمدی');
  await page.locator('#phone').fill('09121234567');
  await page.locator('#email').fill('ahmadi@example.com');
  await page.locator('#city').fill('تهران / منطقه ۱');
  await page.locator('#message').fill(VALID_MESSAGE);
}

test('contact page renders the head, info cards and map widget', async ({ page }) => {
  const response = await page.goto('/contact/');
  expect(response?.status()).toBe(200);

  await expect(page.locator('.page-head__title')).toHaveText('تماس با ما');
  await expect(page.locator('.page-head .lead')).toHaveText(
    'برای دریافت مشاوره، برآورد اولیه یا هرگونه همکاری، از طریق فرم زیر یا اطلاعات تماس با ما در ارتباط باشید.',
  );

  const cards = page.locator('.contact-action-card');
  await expect(cards).toHaveCount(3);

  const phoneCard = cards.filter({ hasText: 'تلفن دفتر مرکزی و مشاوره' });
  await expect(phoneCard).toHaveCount(1);
  const phoneValue = phoneCard.locator('a.contact-action-card__val');
  await expect(phoneValue).toHaveText('۰۲۱-۸۸۰۰۰۰۰۰');
  await expect(phoneValue).toHaveAttribute('href', 'tel:+982188000000');
  await expect(phoneValue).toHaveAttribute('dir', 'ltr');
  await expect(phoneCard.getByRole('link', { name: 'تماس' })).toHaveAttribute(
    'href',
    'tel:+982188000000',
  );

  const emailCard = cards.filter({ hasText: 'پست الکترونیک رسمی استعلامات' });
  await expect(emailCard).toHaveCount(1);
  const emailValue = emailCard.locator('a.contact-action-card__val');
  await expect(emailValue).toHaveText('info@naji-amin.ir');
  await expect(emailValue).toHaveAttribute('href', 'mailto:info@naji-amin.ir');
  await expect(emailValue).toHaveAttribute('dir', 'ltr');
  await expect(emailCard.getByRole('link', { name: 'ایمیل' })).toHaveAttribute(
    'href',
    'mailto:info@naji-amin.ir',
  );

  const hoursCard = cards.filter({ hasText: 'ساعات کاری و پذیرش جلسات' });
  await expect(hoursCard).toHaveCount(1);
  await expect(hoursCard).toContainText('شنبه تا چهارشنبه: ۸:۰۰ الی ۱۷:۰۰');
  await expect(hoursCard.locator('.badge-subtle')).toHaveText('پنج‌شنبه تعطیل');

  await expect(page.locator('#officeStatusText')).not.toHaveText('');

  await expect(page.locator('.map-pin-callout strong')).toHaveText('دفتر مرکزی ناجی سازان امین');
  await expect(page.locator('.map-pin-callout span')).toHaveText('تهران، بزرگراه مدرس، پلاک ۱۲۰، طبقه ۵');

  const mapLinks = page.locator('.map-nav-toolbar a');
  await expect(mapLinks).toHaveCount(3);
  await expect(mapLinks.nth(0)).toHaveText('مسیریابی در نشان');
  await expect(mapLinks.nth(0)).toHaveAttribute('href', 'https://nshn.ir');
  await expect(mapLinks.nth(1)).toHaveText('مسیریابی در بلد');
  await expect(mapLinks.nth(1)).toHaveAttribute('href', 'https://balad.ir');
  await expect(mapLinks.nth(2)).toHaveText('گوگل مپ');
  await expect(mapLinks.nth(2)).toHaveAttribute(
    'href',
    'https://maps.google.com/?q=Tehran,Modares+Hwy',
  );
  for (const link of await mapLinks.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }

  await expect(page.locator('.map-nav-toolbar .copy-btn')).toContainText('کپی نشانی کامل');
});

test('office status is open during Tehran working hours', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-24T06:00:00Z') });
  await page.goto('/contact/');

  await expect(page.locator('#officeStatusText')).toHaveText(
    'هم‌اکنون دفتر باز است • پذیرش تا ۱۷:۰۰',
  );
  await expect(page.locator('#officeStatus')).not.toHaveClass(/is-closed/);
});

test('office status is closed on Thursday', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-22T08:30:00Z') });
  await page.goto('/contact/');

  await expect(page.locator('#officeStatusText')).toHaveText(
    'دفتر اکنون تعطیل است • آغاز کار: شنبه ۸:۰۰',
  );
  await expect(page.locator('#officeStatus')).toHaveClass(/is-closed/);
});

test('service and scale chips update the hidden values', async ({ page }) => {
  await page.goto('/contact/');

  const services = page.locator('#serviceChips .form-chip');
  const scales = page.locator('#scaleChips .form-chip');
  await expect(services).toHaveCount(5);
  await expect(scales).toHaveCount(5);

  await expect(services.first()).toHaveClass(/is-active/);
  await expect(services.first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#serviceInput')).toHaveValue(SERVICE_INITIAL);
  await expect(scales.first()).toHaveClass(/is-active/);
  await expect(scales.first()).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#scaleInput')).toHaveValue(SCALE_INITIAL);

  const managementChip = services.filter({ hasText: 'مدیریت طرح (MC)' });
  await managementChip.click();
  await expect(managementChip).toHaveClass(/is-active/);
  await expect(managementChip).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#serviceChips [aria-checked="true"]')).toHaveCount(1);
  await expect(page.locator('#serviceInput')).toHaveValue('مدیریت طرح (MC)');

  const clinicChip = scales.filter({ hasText: 'درمانی و کلینیک' });
  await clinicChip.click();
  await expect(clinicChip).toHaveClass(/is-active/);
  await expect(clinicChip).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#scaleChips [aria-checked="true"]')).toHaveCount(1);
  await expect(page.locator('#scaleInput')).toHaveValue('درمانی و بیمارستانی');

  const industrialChip = scales.filter({ hasText: 'صنعتی و سازه خاص' });
  await industrialChip.click();
  await expect(industrialChip).toHaveClass(/is-active/);
  await expect(page.locator('#scaleInput')).toHaveValue('صنعتی و سوله');
});

test('empty submit shows exactly three field errors and phone stays optional', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'ثبت و ارسال استعلام پروژه' }).click();

  await expect(page.locator('.field--error')).toHaveCount(3);

  const nameField = page.locator('.field').filter({ has: page.locator('#name') });
  const phoneField = page.locator('.field').filter({ has: page.locator('#phone') });
  const emailField = page.locator('.field').filter({ has: page.locator('#email') });
  const messageField = page.locator('.field').filter({ has: page.locator('#message') });

  await expect(nameField).toHaveClass(/field--error/);
  await expect(nameField.locator('.field__error')).toHaveText('نام و نام خانوادگی الزامی است');
  await expect(emailField).toHaveClass(/field--error/);
  await expect(emailField.locator('.field__error')).toHaveText('ایمیل معتبر وارد کنید');
  await expect(messageField).toHaveClass(/field--error/);
  await expect(messageField.locator('.field__error')).toHaveText('پیام باید حداقل ۱۰ کاراکتر باشد');
  await expect(phoneField).not.toHaveClass(/field--error/);

  await page.locator('#name').fill('مهندس احمدی');
  await expect(nameField).not.toHaveClass(/field--error/);
});

test('valid submission shows success, resets the form and auto-hides', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-21T06:00:00Z') });
  await page.goto('/contact/');

  await fillValidForm(page);
  await page.getByRole('button', { name: 'ثبت و ارسال استعلام پروژه' }).click();

  const success = page.locator('#formSuccess');
  await expect(success).toHaveClass(/is-visible/);
  await expect(success).toContainText('استعلام شما با موفقیت ثبت شد.');
  await expect(success).toContainText(
    'کارشناسان ارشد مهندسی شرکت در کمتر از ۲۴ ساعت کاری با شما تماس خواهند گرفت.',
  );

  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#phone')).toHaveValue('');
  await expect(page.locator('#email')).toHaveValue('');
  await expect(page.locator('#city')).toHaveValue('');
  await expect(page.locator('#message')).toHaveValue('');
  await expect(page.locator('#serviceInput')).toHaveValue(SERVICE_INITIAL);
  await expect(page.locator('#scaleInput')).toHaveValue(SCALE_INITIAL);

  await page.clock.fastForward(6000);
  await expect(success).not.toHaveClass(/is-visible/);
});

test('copy buttons copy the value and restore their labels', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/contact/');

  const copyAddress = page.locator('.map-nav-toolbar .copy-btn');
  await expect(copyAddress).toContainText('کپی نشانی کامل');
  await copyAddress.click();
  await expect(copyAddress).toContainText('کپی شد!');
  await expect(copyAddress).toHaveClass(/is-copied/);

  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe('تهران، خیابان مدرس، پلاک ۱۲۰، طبقه ۵');

  await expect(copyAddress).toContainText('کپی نشانی کامل', { timeout: 5000 });
  await expect(copyAddress).not.toHaveClass(/is-copied/);
});

test('endpoint build posts the inquiry payload as JSON', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  let body: Record<string, unknown> | null = null;
  let contentType = '';

  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON();
    contentType = route.request().headers()['content-type'] ?? '';
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.locator('#serviceChips .form-chip').filter({ hasText: 'مشاوره و مقاوم‌سازی' }).click();
  await page.locator('#scaleChips .form-chip').filter({ hasText: 'تجاری و اداری' }).click();
  await page.getByRole('button', { name: 'ثبت و ارسال استعلام پروژه' }).click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  expect(contentType).toContain('application/json');
  expect(body).toEqual({
    name: 'مهندس احمدی',
    phone: '09121234567',
    email: 'ahmadi@example.com',
    city: 'تهران / منطقه ۱',
    message: VALID_MESSAGE,
    type: 'مشاوره و مقاوم‌سازی',
    scale: 'تجاری و اداری',
  });
});

test('endpoint failure shows an error and keeps the entered values', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 500, contentType: 'text/plain', body: 'failure' }),
  );

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);
  await page.getByRole('button', { name: 'ثبت و ارسال استعلام پروژه' }).click();

  await expect(page.locator('.form__submit-error')).toHaveText(SUBMIT_ERROR);
  await expect(page.locator('#formSuccess')).not.toHaveClass(/is-visible/);
  await expect(page.locator('#name')).toHaveValue('مهندس احمدی');
  await expect(page.locator('#message')).toHaveValue(VALID_MESSAGE);
});
