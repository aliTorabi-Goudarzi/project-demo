import { expect, test, type Route } from '@playwright/test';

import {
  ENDPOINT_URL,
  SCALE_INITIAL,
  SERVICE_INITIAL,
  SUBMIT_BUTTON,
  SUBMIT_ERROR,
  VALID_MESSAGE,
  endpointBuildExists,
  fillValidForm,
} from './contact-fixtures';

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

test('office status after Wednesday closing time points to Saturday', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-21T14:30:00Z') });
  await page.goto('/contact/');

  await expect(page.locator('#officeStatusText')).toHaveText(
    'دفتر اکنون تعطیل است • آغاز کار: شنبه ۸:۰۰',
  );
  await expect(page.locator('#officeStatus')).toHaveClass(/is-closed/);
});

test('office status before opening on a work day points to today', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-21T03:00:00Z') });
  await page.goto('/contact/');

  await expect(page.locator('#officeStatusText')).toHaveText(
    'دفتر اکنون تعطیل است • آغاز کار: امروز ۸:۰۰',
  );
  await expect(page.locator('#officeStatus')).toHaveClass(/is-closed/);
});

test('office status on Saturday evening points to tomorrow', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-24T14:30:00Z') });
  await page.goto('/contact/');

  await expect(page.locator('#officeStatusText')).toHaveText(
    'دفتر اکنون تعطیل است • آغاز کار: فردا ۸:۰۰',
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
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

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
  await page.getByRole('button', { name: SUBMIT_BUTTON }).click();

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

test('the SSR form posts natively and caps the user field lengths', async ({ page }) => {
  await page.goto('/contact/');

  const form = page.locator('#contactForm');
  await expect(form).toHaveAttribute('method', 'post');

  await expect(page.locator('#name')).toHaveAttribute('maxlength', '120');
  await expect(page.locator('#phone')).toHaveAttribute('maxlength', '20');
  await expect(page.locator('#email')).toHaveAttribute('maxlength', '254');
  await expect(page.locator('#city')).toHaveAttribute('maxlength', '120');
  await expect(page.locator('#message')).toHaveAttribute('maxlength', '2000');
});

test('a submit without JavaScript never leaks the field values into the URL', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();

  const navigationRequests: { method: string; url: string }[] = [];
  page.on('request', (request) => {
    if (request.isNavigationRequest()) {
      navigationRequests.push({ method: request.method(), url: request.url() });
    }
  });

  const name = 'مهندس افشاگر';
  const phone = '09129998877';
  const email = 'leak-check@example.com';
  const message = 'این پیام نباید هرگز داخل نشانی صفحه ظاهر شود.';

  try {
    await page.goto('/contact/');
    await page.locator('#name').fill(name);
    await page.locator('#phone').fill(phone);
    await page.locator('#email').fill(email);
    await page.locator('#message').fill(message);

    await Promise.all([
      page.waitForEvent('framenavigated', (frame) => frame === page.mainFrame()),
      page.getByRole('button', { name: SUBMIT_BUTTON }).click(),
    ]);
    await page.waitForLoadState('load');

    const currentUrl = new URL(page.url());
    expect(currentUrl.search).toBe('');
    const decodedUrl = decodeURIComponent(page.url());
    for (const value of [name, phone, email, message]) {
      expect(decodedUrl).not.toContain(value);
    }

    const submission = navigationRequests.at(-1);
    expect(submission?.method).toBe('POST');
    expect(new URL(submission?.url ?? '').search).toBe('');
  } finally {
    await context.close();
  }
});

test('a double submit produces a single network request', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  await page.clock.install({ time: new Date('2026-10-21T06:00:00Z') });

  let requests = 0;
  let releaseRequest: () => void = () => {};
  const requestGate = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });

  await page.route('**/api/contact', async (route) => {
    requests += 1;
    await requestGate;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);

  const form = page.locator('#contactForm');
  await form.evaluate((node) => {
    const element = node as HTMLFormElement;
    element.requestSubmit();
    element.requestSubmit();
  });

  const submitButton = page.getByRole('button', { name: SUBMIT_BUTTON });
  await expect(submitButton).toBeDisabled();
  await expect(submitButton).toHaveAttribute('aria-busy', 'true');

  await expect.poll(() => requests).toBe(1);
  releaseRequest();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  expect(requests).toBe(1);
});

test('a hanging submit aborts after 15 seconds and the form can be retried', async ({ page }) => {
  test.skip(!endpointBuildExists(), 'endpoint build is not present');

  await page.clock.install({ time: new Date('2026-10-21T06:00:00Z') });

  let requests = 0;
  let releaseFirstRequest: () => void = () => {};
  const firstRequestGate = new Promise<void>((resolve) => {
    releaseFirstRequest = resolve;
  });

  const hangingHandler = async (route: Route) => {
    requests += 1;
    await firstRequestGate;
    try {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    } catch {
      // the browser already aborted this request when the timeout fired
    }
  };

  await page.route('**/api/contact', hangingHandler);

  await page.goto(ENDPOINT_URL);
  await fillValidForm(page);

  const submitButton = page.getByRole('button', { name: SUBMIT_BUTTON });
  await submitButton.click();
  await expect.poll(() => requests).toBe(1);
  await expect(submitButton).toBeDisabled();

  await page.clock.fastForward(15_000);

  await expect(page.locator('.form__submit-error')).toHaveText(SUBMIT_ERROR);
  await expect(page.locator('#formSuccess')).not.toHaveClass(/is-visible/);
  await expect(page.locator('#name')).toHaveValue('مهندس احمدی');
  await expect(page.locator('#phone')).toHaveValue('09121234567');
  await expect(page.locator('#email')).toHaveValue('ahmadi@example.com');
  await expect(page.locator('#city')).toHaveValue('تهران / منطقه ۱');
  await expect(page.locator('#message')).toHaveValue(VALID_MESSAGE);
  await expect(submitButton).toBeEnabled();

  await page.unroute('**/api/contact', hangingHandler);
  releaseFirstRequest();
  await page.route('**/api/contact', (route) => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await submitButton.click();

  await expect(page.locator('#formSuccess')).toHaveClass(/is-visible/);
  await expect(page.locator('.form__submit-error')).toHaveCount(0);
  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#message')).toHaveValue('');
  expect(requests).toBe(2);
});
