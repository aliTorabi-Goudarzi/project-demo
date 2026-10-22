import fs from 'node:fs';
import path from 'node:path';

import type { Page } from '@playwright/test';

export const SERVICE_INITIAL = 'طراحی معماری و سازه';
export const SCALE_INITIAL = 'مسکونی و بلندمرتبه';
export const VALID_MESSAGE = 'متراژ تقریبی ۵۰۰۰ مترمربع، ۱۰ طبقه و پرونده شهرداری در مرحله اول.';
export const SUBMIT_ERROR =
  'ارسال استعلام انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر تماس بگیرید.';
export const SUBMIT_BUTTON = 'ثبت و ارسال استعلام پروژه';
export const ENDPOINT_URL = process.env.CONTACT_E2E_ENDPOINT_URL ?? 'http://127.0.0.1:4175/contact/';

export const endpointBuildExists = () =>
  fs.existsSync(path.resolve(process.cwd(), 'out-endpoint'));

export async function fillValidForm(page: Page) {
  await page.locator('#name').fill('مهندس احمدی');
  await page.locator('#phone').fill('09121234567');
  await page.locator('#email').fill('ahmadi@example.com');
  await page.locator('#city').fill('تهران / منطقه ۱');
  await page.locator('#message').fill(VALID_MESSAGE);
}
