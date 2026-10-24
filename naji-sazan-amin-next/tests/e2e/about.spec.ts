import { expect, test } from '@playwright/test';

import { assetUrl } from './assets';

const STATS = [
  {
    num: '۲۲+',
    title: 'سال سابقه مستمر',
    sub: 'حضور فعال و پایدار در عرصه مهندسی از سال ۱۳۸۳',
  },
  {
    num: 'پایه ۱',
    title: 'صلاحیت ارشد حقوقی',
    sub: 'پروانه اشتغال طراحی و نظارت سازمان برنامه و بودجه',
  },
  {
    num: '+۵۰۰k',
    title: 'مترمربع زیربنا',
    sub: 'راهبری فنی کلان‌پروژه‌های درمانی، اقامتی و موزه‌ها',
  },
  {
    num: '۱۰۰٪',
    title: 'کنترل کیفی مقیم',
    sub: 'آزمایشگاه تخصصی و پایش ژئوتکنیک و بتن کارگاهی',
  },
];

const BENTO_CARDS = [
  {
    heading: 'مطالعات جامع و مدلسازی BIM',
    body: 'طراحی یکپارچه فاز صفر، یک و دو معماری و محاسبات سازه‌ای منطبق بر مدلسازی سه‌بعدی اطلاعات ساخت و بهینه‌سازی اقلیمی.',
    footer: 'مطالعات فاز صفر، ۱ و ۲ • پایش تداخلات',
    iconPaths: [
      'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
      'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    ],
  },
  {
    heading: 'نظارت مقیم کارگاهی و سراسری',
    body: 'استقرار دفاتر فنی و گروه‌های نظارتی در محل اجرای پروژه‌ها در اقصی نقاط کشور با اعمال پروتکل‌های سخت‌گیرانه ایمنی و کیفیت.',
    footer: 'دفاتر فنی کارگاهی • کنترل کیفی HSE',
    iconPaths: [
      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      'M9 12l2 2 4-4',
    ],
  },
];

const EXECUTIVE_MATRIX = [
  ['تحصیلات دانشگاهی', 'فوق لیسانس معماری — دانشگاه تهران'],
  ['پروانه اشتغال', 'پایه ارشد — نظارت، طراحی و اجرا'],
  ['سابقه مدیریت ارشد', 'بیش از ۳۲ سال سابقه اجرایی'],
  ['حوزه راهبری', 'طراحی جامع، نظارت عالیه، مدیریت طرح و ساخت'],
];

const LEADERS = [
  {
    name: 'احمد نادری',
    image: '/assets/team/vp-engineering.webp',
    title: 'معاونت فنی و نظارت',
    sub: 'راهبری محاسبات سازه، زلزله و ژئوتکنیک',
  },
  {
    name: 'مهدی نوری',
    image: '/assets/team/head-design.webp',
    title: 'مدیر مطالعات و طراحی',
    sub: 'مدیریت طراحی مفهومی، فاز یک و دو و BIM',
  },
  {
    name: 'سعید رفیعی',
    image: '/assets/team/lead-structure.webp',
    title: 'مدیر نظارت و امور کارگاهی',
    sub: 'هدایت کادر ناظران مقیم و پایش HSE کارگاه‌ها',
  },
  {
    name: 'امیر ربیعی فر',
    image: '/assets/team/lead-mep.webp',
    title: 'مدیر آزمایشگاه مقاومت مصالح',
    sub: 'مدیریت آزمون‌های کیفی بتن، خاک و مصالح',
  },
  {
    name: 'حامد یزدان پناه',
    image: '/assets/team/project-manager.webp',
    title: 'مدیر طرح و برنامه',
    sub: 'کنترل پروژه، زمان‌بندی و مدیریت منابع مالی',
  },
  {
    name: 'وحید جمالی',
    image: '/assets/team/qa-qc.webp',
    title: 'مدیر امور قراردادها و پیمان',
    sub: 'رسیدگی به امور حقوقی، قراردادها و اسناد مناقصه',
  },
];

test('about page renders metadata and the page head', async ({ page }) => {
  const response = await page.goto('/about/');
  expect(response?.status()).toBe(200);

  await expect(page).toHaveTitle('درباره ما | مهندسین مشاور ناجی سازان امین');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'درباره شرکت مهندسین مشاور ناجی سازان امین — بیش از دو دهه تجربه در طراحی، نظارت و مدیریت طرح.',
  );

  await expect(page.locator('main .page-head__title')).toHaveText('درباره مهندسین مشاور');
  await expect(page.locator('main .page-head .lead')).toHaveText(
    'تجربه، تخصص و تعهد؛ سه رکن ماندگار در مسیر توسعه صنعت عمرانی کشور از سال ۱۳۸۳',
  );
});

test('stats ribbon shows the four headline figures in order', async ({ page }) => {
  await page.goto('/about/');

  const ribbon = page.locator('main .about-stats-ribbon');
  await expect(ribbon).toHaveCount(1);
  await expect(ribbon).toHaveClass(/reveal/);

  const cards = ribbon.locator('.stats-card');
  await expect(cards).toHaveCount(STATS.length);

  for (const [index, stat] of STATS.entries()) {
    const card = cards.nth(index);
    await expect(card.locator('.stats-card__num')).toHaveText(stat.num);
    await expect(card.locator('.stats-card__title')).toHaveText(stat.title);
    await expect(card.locator('.stats-card__sub')).toHaveText(stat.sub);
  }
});

test('bento grid renders the hero and the two service cards', async ({ page }) => {
  await page.goto('/about/');

  const grid = page.locator('main .about-bento-grid');
  await expect(grid).toHaveCount(1);

  const hero = grid.locator('.bento-card.bento-card--hero');
  await expect(hero).toHaveCount(1);
  await expect(hero).toHaveClass(/reveal/);
  expect(await hero.getAttribute('style')).toContain(assetUrl('/assets/projects/supervision-real.webp'));
  await expect(hero.locator('.bento-overlay')).toHaveCount(1);

  const heroPill = hero.locator('.bento-content > .bento-pill');
  await expect(heroPill).toContainText('دو دهه راهبری و اثرگذاری');
  await expect(heroPill).toHaveAttribute('style', /margin-bottom:\s*0\.85rem/);
  const heroPillIcon = heroPill.locator('svg');
  await expect(heroPillIcon).toHaveAttribute('aria-hidden', 'true');
  await expect(heroPillIcon.locator('path')).toHaveAttribute(
    'd',
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  );

  await expect(hero.locator('h3')).toHaveText(
    'بیش از دو دهه مهندسی اصیل، متعهد و ماندگار در زیرساخت‌های کشور',
  );
  await expect(hero.locator('.bento-content p')).toHaveText(
    'شرکت مهندسین مشاور ناجی سازان امین فعالیت خود را از سال ۱۳۸۳ آغاز کرد و طی بیش از بیست سال با اتکا به دانش فنی روز، سرمایه انسانی متخصص و اصول حرفه‌ای، مجری و ناظر بزرگ‌ترین پروژه‌های عمرانی، اقامتی، اداری و یادمان‌های ملی بوده است.',
  );

  const badges = hero.locator('.bento-badge-group .bento-pill');
  await expect(badges).toHaveCount(4);
  await expect(badges).toHaveText([
    'پروانه حقوقی پایه یک',
    'گواهینامه سمتا',
    'عضو انجمن بتن ایران',
    'سیستم مدیریت ISO 9001',
  ]);

  const cards = grid.locator('.bento-card:not(.bento-card--hero)');
  await expect(cards).toHaveCount(BENTO_CARDS.length);

  for (const [index, expected] of BENTO_CARDS.entries()) {
    const card = cards.nth(index);
    await expect(card).toHaveClass(/reveal/);
    await expect(card).toHaveAttribute('data-delay', String(index + 1));
    await expect(card.locator('h4')).toHaveText(expected.heading);
    await expect(card.locator('p')).toHaveText(expected.body);

    const icon = card.locator('.bento-card__icon svg');
    await expect(icon).toHaveCount(1);
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon.locator('path')).toHaveCount(expected.iconPaths.length);
    for (const [pathIndex, pathData] of expected.iconPaths.entries()) {
      await expect(icon.locator('path').nth(pathIndex)).toHaveAttribute('d', pathData);
    }

    const footer = card.locator(':scope > div').last();
    await expect(footer).toHaveText(expected.footer);
    await expect(footer).toHaveAttribute('style', /font-size:\s*0\.8rem/);
    await expect(footer).toHaveAttribute('style', /font-weight:\s*700/);
    await expect(footer).toHaveAttribute('style', /color:\s*var\(--accent\)/);
  }
});

test('executive spotlight presents the CEO profile matrix', async ({ page }) => {
  await page.goto('/about/');

  const spot = page.locator('main .executive-glass');
  await expect(spot).toHaveCount(1);
  await expect(spot).toHaveClass(/reveal/);

  const photo = spot.locator('.executive-photo-wrap img');
  await expect(photo).toHaveAttribute('src', assetUrl('/assets/team/ceo.webp'));
  await expect(photo).toHaveAttribute('alt', 'محمد منزوی — مدیر عامل');
  await expect(photo).toHaveAttribute('width', '600');
  await expect(photo).toHaveAttribute('height', '800');
  await expect(photo).toHaveAttribute('loading', 'lazy');
  await expect(photo).toHaveAttribute('decoding', 'async');

  await expect(spot.locator('.executive-details h3')).toHaveText('مهندس محمد منزوی');
  await expect(spot.locator('.executive-role-pill')).toHaveText(
    'بنیان‌گذار و مدیر عامل مهندسین مشاور',
  );
  await expect(spot.locator('.executive-bio')).toHaveText(
    'فوق لیسانس معماری از دانشگاه تهران با بیش از ۳۲ سال سابقه ارشد مدیریتی و اجرایی در کلان‌پروژه‌های کشور. دارای پروانه اشتغال به کار مهندسی پایه ارشد در سه صلاحیت نظارت، طراحی و اجرا و سابقه هدایت شرکت‌های مهندسی معتبر و طرح‌های ملی.',
  );

  const items = spot.locator('.executive-matrix-item');
  await expect(items).toHaveCount(EXECUTIVE_MATRIX.length);
  for (const [index, [term, description]] of EXECUTIVE_MATRIX.entries()) {
    const item = items.nth(index);
    await expect(item.locator('dt')).toHaveText(term);
    await expect(item.locator('dd')).toHaveText(description);
  }
});

test('leadership grid lists six senior engineers in order without the CEO', async ({ page }) => {
  await page.goto('/about/');

  const head = page.locator(
    'main .section-head.section-head--center:has(h2:has-text("راهبران و اعضای ارشد مهندسی"))',
  );
  await expect(head).toHaveCount(1);
  await expect(head.locator('h2')).toHaveText('راهبران و اعضای ارشد مهندسی');
  await expect(head.locator('.lead')).toHaveText(
    'سرمایه انسانی کارآزموده‌ای که ستون فقرات اعتبار و کیفیت پروژه‌های ما هستند',
  );
  await expect(head).toHaveAttribute('style', /margin-bottom:\s*2\.25rem/);

  const grid = page.locator('main .editorial-leaders-grid');
  await expect(grid).toHaveCount(1);
  await expect(grid).toHaveClass(/reveal/);

  const cards = grid.locator('.editorial-leader-card');
  await expect(cards).toHaveCount(LEADERS.length);

  for (const [index, leader] of LEADERS.entries()) {
    const card = cards.nth(index);
    const photo = card.locator('.editorial-leader-photo img');
    await expect(photo).toHaveAttribute('src', assetUrl(leader.image));
    await expect(photo).toHaveAttribute('alt', leader.name);
    await expect(photo).toHaveAttribute('width', '600');
    await expect(photo).toHaveAttribute('height', '800');
    await expect(photo).toHaveAttribute('loading', 'lazy');
    await expect(photo).toHaveAttribute('decoding', 'async');
    await expect(card.locator('.editorial-leader-name')).toHaveText(leader.name);
    await expect(card.locator('.editorial-leader-title')).toHaveText(leader.title);
    await expect(card.locator('.editorial-leader-sub')).toHaveText(leader.sub);
  }

  const names = await page.locator('.editorial-leader-name').allTextContents();
  expect(names).toEqual(LEADERS.map((leader) => leader.name));
  expect(names).not.toContain('محمد منزوی');
});

test('CTA offers the contact and projects routes', async ({ page }) => {
  await page.goto('/about/');

  const cta = page.locator('main .cta');
  await expect(cta).toHaveCount(1);
  await expect(cta.locator('h2')).toHaveText('آماده همکاری هستیم');
  await expect(cta.locator('p')).toHaveText(
    'تیم ما آماده پاسخگویی به نیازهای فنی و مشاوره‌ای پروژه شماست.',
  );

  const links = cta.getByRole('link');
  await expect(links).toHaveCount(2);

  const contact = cta.getByRole('link', { name: 'تماس با ما' });
  await expect(contact).toHaveAttribute('href', /^\/contact\/?$/);

  const projects = cta.getByRole('link', { name: 'نمونه پروژه‌ها' });
  await expect(projects).toHaveAttribute('href', /^\/projects\/?$/);
});

test('all about portraits resolve from the static export', async ({ page }) => {
  await page.goto('/about/');

  const images = page.locator('main img');
  await expect(images).toHaveCount(LEADERS.length + 1);

  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element) => {
          const img = element as HTMLImageElement;
          return img.complete && img.naturalWidth > 0;
        }),
      )
      .toBe(true);
  }
});

test('about copy and leadership content are present in the static export', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const html = fs.readFileSync(path.resolve(process.cwd(), 'out/about/index.html'), 'utf8');

  expect(html).toContain('سال سابقه مستمر');
  expect(html).toContain('احمد نادری');
  expect(html).toContain(assetUrl('/assets/projects/supervision-real.webp'));
});

test('about leadership images resolve with image content types', async ({ page }) => {
  const images = [
    assetUrl('/assets/projects/supervision-real.webp'),
    ...LEADERS.map((leader) => assetUrl(leader.image)),
  ];

  for (const image of images) {
    const response = await page.request.get(image);
    expect(response.status(), image).toBe(200);
    expect(response.headers()['content-type'] ?? '', image).toMatch(/^image\//);
  }
});
