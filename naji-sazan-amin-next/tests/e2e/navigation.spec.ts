import { expect, test, type Page } from '@playwright/test';

import {
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICE_LINKS,
  NAV_ITEMS,
  SITE,
} from '../../src/lib/site';

const ROUTES = ['/', '/projects/', '/about/', '/contact/'] as const;

test.use({ viewport: { width: 1440, height: 900 } });

function normalizeHref(href: string) {
  const [pathname, hash] = href.split('#');
  const compactPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return hash ? `${compactPath}#${hash}` : compactPath;
}

function headerNav(page: Page) {
  return page.locator(`#siteHeader nav[aria-label="${SITE.navAria}"] a`);
}

test('header navigation exposes the four sections in order with the consultation CTA', async ({ page }) => {
  await page.goto('/');

  const links = headerNav(page);
  await expect(links).toHaveCount(NAV_ITEMS.length);

  const rendered = await links.evaluateAll((elements) =>
    elements.map((element) => ({
      text: (element.textContent ?? '').trim(),
      href: element.getAttribute('href') ?? '',
    })),
  );

  expect(rendered.map((link) => link.text)).toEqual(NAV_ITEMS.map((item) => item.label));
  expect(rendered.map((link) => normalizeHref(link.href))).toEqual(
    NAV_ITEMS.map((item) => normalizeHref(item.href)),
  );

  const cta = page.locator('#siteHeader .header-actions a.btn');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText(SITE.ctaLabel);
  await expect(cta).toHaveAttribute('href', '/contact/');
});

test('the active navigation item follows the current route', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);

    const active = page.locator('#siteHeader nav a.is-active');
    await expect(active, `active item on ${route}`).toHaveCount(1);

    const expected = NAV_ITEMS.find((item) => normalizeHref(item.href) === normalizeHref(route));
    if (!expected) throw new Error(`No navigation item configured for ${route}`);

    expect(normalizeHref((await active.getAttribute('href')) ?? ''), `active href on ${route}`).toBe(
      normalizeHref(expected.href),
    );
    await expect(active).toHaveText(expected.label);
  }
});

test('the header CTA targets the contact form only on the contact route', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('#siteHeader .header-actions a.btn');
  await expect(cta).toHaveAttribute('href', '/contact/');

  await page.goto('/contact/');
  await expect(cta).toHaveAttribute('href', '#form');
  expect(await cta.evaluate((element) => (element as HTMLAnchorElement).href)).toContain(
    '/contact/#form',
  );
});

test('footer navigation keeps both link groups on every route', async ({ page }) => {
  const expected = [...FOOTER_QUICK_LINKS, ...FOOTER_SERVICE_LINKS];

  for (const route of ROUTES) {
    await page.goto(route);

    const footer = page.locator('#siteFooter');
    await expect(footer, `footer on ${route}`).toBeVisible();

    const links = footer.locator('.footer-col__nav a');
    await expect(links, `footer links on ${route}`).toHaveCount(expected.length);

    const rendered = await links.evaluateAll((elements) =>
      elements.map((element) => ({
        text: (element.textContent ?? '').trim(),
        href: element.getAttribute('href') ?? '',
      })),
    );

    expect(rendered.map((link) => normalizeHref(link.href))).toEqual(
      expected.map((link) => normalizeHref(link.href)),
    );
    expect(rendered.map((link) => link.text)).toEqual(expected.map((link) => link.label));

    await expect(footer.locator('.footer-brand__name')).toHaveText(SITE.name);
    await expect(footer.locator('.footer-contact-item span').first()).toHaveText(SITE.address);
    await expect(footer.locator('.footer-subbar__copy')).toHaveText(SITE.copyright);
  }
});

test('desktop navigation switches to mobile controls below the breakpoint', async ({ page }) => {
  await page.goto('/');

  const nav = page.locator('#siteHeader nav');
  const menu = page.locator('#menuBtn');

  await expect(nav).toBeVisible();
  await expect(menu).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toBeHidden();
  await expect(menu).toBeVisible();
});

test('header navigation traverses every route without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');

  for (const item of [NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[3], NAV_ITEMS[0]]) {
    await headerNav(page).filter({ hasText: item.label }).click();

    const expectedPath = item.href === '/' ? '/' : `${item.href}/`;
    await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('#siteHeader')).toBeVisible();
    await expect(page.locator('#siteFooter')).toBeVisible();
  }

  expect(errors).toEqual([]);
});

test('the header marks itself scrolled while the page is scrolled', async ({ page }) => {
  await page.goto('/');

  const header = page.locator('#siteHeader');
  await expect(header).not.toHaveClass(/is-scrolled/);

  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveClass(/is-scrolled/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-scrolled/);
});

test('the 404 page keeps the shell and links back home', async ({ page }) => {
  const response = await page.goto('/404.html');
  expect(response?.status()).toBe(200);

  await expect(page.locator('#siteHeader')).toBeVisible();
  await expect(page.locator('#siteFooter')).toBeVisible();

  const home = page.locator('main a[href="/"]');
  await expect(home).toHaveCount(1);
  await home.click();
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
});

test('client-side navigation loads every RSC page payload without 404s', async ({ page }) => {
  const isPayloadUrl = (url: string) => url.includes('__next.') && url.includes('__PAGE__.txt');
  const payloadResponses: { url: string; status: number }[] = [];
  let inFlight = 0;

  page.on('request', (request) => {
    if (isPayloadUrl(request.url())) inFlight += 1;
  });
  page.on('requestfinished', (request) => {
    if (isPayloadUrl(request.url())) inFlight = Math.max(0, inFlight - 1);
  });
  page.on('requestfailed', (request) => {
    if (isPayloadUrl(request.url())) inFlight = Math.max(0, inFlight - 1);
  });
  page.on('response', (response) => {
    if (isPayloadUrl(response.url())) {
      payloadResponses.push({ url: response.url(), status: response.status() });
    }
  });

  await page.goto('/');

  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>).__rscSoftNavigation = true;
  });

  const settlePayloadRequests = async () => {
    await expect.poll(() => inFlight, { message: 'RSC payload requests must settle' }).toBe(0);
  };

  const prefetchFromCtaPanel = async () => {
    const before = payloadResponses.length;
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect.poll(() => payloadResponses.length, {
      message: 'scrolling to the CTA panel must trigger RSC page payload prefetches',
    }).toBeGreaterThan(before);
    await settlePayloadRequests();
  };

  await prefetchFromCtaPanel();

  for (const item of [NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[3]]) {
    await headerNav(page).filter({ hasText: item.label }).click();

    const expectedPath = `${item.href}/`;
    await expect.poll(() => new URL(page.url()).pathname).toBe(expectedPath);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(
      await page.evaluate(() => (window as unknown as Record<string, unknown>).__rscSoftNavigation),
      `${item.label} navigation must stay client-side`,
    ).toBe(true);

    if (item === NAV_ITEMS[2]) {
      await prefetchFromCtaPanel();
    }
  }

  await expect.poll(() => inFlight).toBe(0);

  expect(
    payloadResponses.length,
    'expected at least one RSC page payload response',
  ).toBeGreaterThan(0);
  expect(
    payloadResponses.filter((response) => response.status < 200 || response.status >= 300),
    'every RSC page payload response must be successful',
  ).toEqual([]);
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the drawer opens, locks scrolling and closes with Escape', async ({ page }) => {
    await page.goto('/');

    const drawer = page.locator('#drawer');
    const menu = page.locator('#menuBtn');

    await expect(drawer).toHaveAttribute('aria-hidden', 'true');

    await menu.click();
    await expect(drawer).toHaveClass(/is-open/);
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // The drawer carries the mobile call to action because the header CTA is hidden.
    const drawerCta = drawer.locator('a.btn');
    await expect(drawerCta).toBeVisible();
    await expect(drawerCta).toHaveText(SITE.ctaLabel);
    await expect(drawerCta).toHaveAttribute('href', '/contact/');

    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect(drawer).toHaveAttribute('aria-hidden', 'true');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('the drawer closes after navigating to a route', async ({ page }) => {
    await page.goto('/');

    const drawer = page.locator('#drawer');
    await page.locator('#menuBtn').click();
    await expect(drawer).toHaveClass(/is-open/);

    await drawer.getByRole('link', { name: NAV_ITEMS[1].label }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe('/projects/');
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('client-side history navigation closes the open modal and drawer', async ({ page }) => {
    await page.goto('/');

    const drawer = page.locator('#drawer');
    const modal = page.locator('#projectModal');

    await page.locator('#menuBtn').click();
    await expect(drawer).toHaveClass(/is-open/);
    await drawer.getByRole('link', { name: NAV_ITEMS[1].label }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe('/projects/');

    await page.locator('[data-project="parsa-tower"]').click();
    await expect(modal).toHaveClass(/is-open/);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.evaluate(() => {
      (window as unknown as Record<string, unknown>).__softNavigation = true;
    });

    await page.goBack();
    await expect.poll(() => new URL(page.url()).pathname).toBe('/');
    expect(
      await page.evaluate(() => (window as unknown as Record<string, unknown>).__softNavigation),
      'history navigation must stay client-side',
    ).toBe(true);
    await expect(modal).not.toHaveClass(/is-open/);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');

    await page.locator('#menuBtn').click();
    await expect(drawer).toHaveClass(/is-open/);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    await page.goForward();
    await expect.poll(() => new URL(page.url()).pathname).toBe('/projects/');
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('the closed drawer keeps its links out of the focus order', async ({ page }) => {
    await page.goto('/');

    const drawer = page.locator('#drawer');
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect(drawer).toHaveAttribute('inert', '');

    await page.locator('#menuBtn').focus();
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(
        () => document.querySelector('#drawer')?.contains(document.activeElement) ?? false,
      ),
    ).toBe(false);

    expect(
      await drawer
        .locator('a')
        .first()
        .evaluate((element) => {
          (element as HTMLElement).focus();
          return document.activeElement === element;
        }),
    ).toBe(false);
  });

  test('mobile documents do not overflow the 390px viewport', async ({ page }) => {
    const results = [];
    for (const route of ROUTES) {
      await page.goto(route);

      const menu = page.locator('#menuBtn');
      const themeToggle = page.locator('#siteHeader .theme-toggle');
      const headerCta = page.locator('#siteHeader .header-actions a.btn');

      await expect(menu, `menu button on ${route}`).toBeVisible();
      await expect(themeToggle, `theme toggle on ${route}`).toBeVisible();
      await expect(headerCta, `header CTA on ${route}`).toBeHidden();

      results.push(
        await page.evaluate(() => {
          const rectOf = (selector: string) => {
            const element = document.querySelector(selector);
            if (!element) throw new Error(`Missing ${selector}`);
            const { left, right, top, bottom } = element.getBoundingClientRect();
            return { left, right, top, bottom };
          };

          const offenders = Array.from(document.querySelectorAll<HTMLElement>('body *'))
            .map((element) => ({ element, rect: element.getBoundingClientRect() }))
            .filter(
              ({ rect }) =>
                rect.width > 0 &&
                (rect.left < -1 || rect.right > window.innerWidth + 1),
            )
            .slice(0, 6)
            .map(({ element, rect }) => {
              const className =
                typeof element.className === 'string' && element.className.trim() !== ''
                  ? `.${element.className.trim().split(/\s+/).join('.')}`
                  : '';
              return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${className} [${Math.round(rect.left)}, ${Math.round(rect.right)}]`;
            });

          return {
            route: window.location.pathname,
            innerWidth: window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            menu: rectOf('#menuBtn'),
            themeToggle: rectOf('#siteHeader .theme-toggle'),
            offenders,
          };
        }),
      );
    }

    const failures = results.filter((result) => result.scrollWidth > result.innerWidth + 1);
    expect(
      failures,
      `Horizontal overflow at 390px:\n${JSON.stringify(failures, null, 2)}`,
    ).toEqual([]);

    for (const result of results) {
      for (const [name, rect] of [
        ['menu button', result.menu],
        ['theme toggle', result.themeToggle],
      ] as const) {
        expect(rect.left, `${name} left edge on ${result.route}`).toBeGreaterThanOrEqual(0);
        expect(rect.right, `${name} right edge on ${result.route}`).toBeLessThanOrEqual(
          result.innerWidth,
        );
      }
    }
  });
});
