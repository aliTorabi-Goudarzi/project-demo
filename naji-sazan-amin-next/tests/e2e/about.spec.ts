import { expect, test } from '@playwright/test';

import { imageVariant } from '../../src/components/shared/ResponsiveImage';

import { assetUrl } from './assets';

const RESUME_PARAGRAPHS = [
  'این مجموعه در سال ۱۳۸۶ با بازنگری در اساسنامه و توسعه دامنه فعالیت‌ها، وارد عرصه مدیریت طرح، کارفرمایی و ارائه خدمات تخصصی مهندسی شد و با ایجاد ساختارهای سازمانی منسجم، جذب متخصصان برجسته و تشکیل دپارتمان‌های فنی، زمینه حضور در پروژه‌های بزرگ و پیچیده عمرانی را فراهم ساخت.',
  'از سال ۱۳۸۹ و با تمرکز بر فعالیت به عنوان مهندسین مشاور، شرکت ناجی سازان امین مسیر توسعه خود را با رویکردی تخصص‌محور ادامه داد و با حضور در طراحی و نظارت پروژه‌های شاخص، سازه‌های بلندمرتبه و پروژه‌های خاص، توانست تجربه‌ای ارزشمند در اجرای پروژه‌های ملی و منطقه‌ای کسب کند. توسعه دامنه خدمات به استان‌های مختلف کشور و استقرار دفاتر فنی و نظارتی در محل اجرای پروژه‌ها، بیانگر رویکرد این مجموعه در ارائه خدمات دقیق، مستمر و مسئولانه است.',
  'پایبندی به کیفیت و توسعه مستمر، همواره از اصول بنیادین شرکت بوده است. اخذ پروانه حقوقی پایه یک طراحی و نظارت از وزارت راه و شهرسازی، دریافت مدال برنزین جایزه ملی بقراط، استقرار سیستم مدیریت کیفیت و اخذ گواهینامه ISO 9001 و ارتقای گواهینامه سمتا، عضویت در انجمن بتن ایران و تجهیز آزمایشگاه تخصصی، بخشی از دستاوردهای این مجموعه در مسیر ارتقای استانداردهای حرفه‌ای و سازمانی به شمار می‌رود.',
  'شرکت مهندسین مشاور ناجی سازان امین در سال‌های اخیر نیز با رویکردی مبتنی بر شفافیت، انضباط مالی و توسعه پایدار، ضمن ساماندهی ساختارهای مدیریتی، تسویه کامل تعهدات مالیاتی و بیمه‌ای، رفع محدودیت‌های ثبتی و پیگیری فرآیند تمدید و ارتقای مجوزهای حرفه‌ای، مسیر رشد و تعالی سازمانی خود را با قدرت ادامه داده است.',
  'امروز، مهندسین مشاور ناجی سازان امین با پشتوانه سال‌ها تجربه، بهره‌گیری از دانش روز مهندسی و اعتقاد راسخ به کیفیت، دقت و مسئولیت‌پذیری، آماده ارائه خدمات تخصصی در حوزه طراحی، نظارت، مدیریت طرح، کنترل پروژه و مشاوره مهندسی در سراسر کشور است؛ با این باور که اعتماد کارفرمایان، بزرگ‌ترین سرمایه هر سازمان و کیفیت، ماندگارترین دستاورد آن است.',
];

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
    num: '۵۰۰ هزار',
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
    heading: 'مطالعات و طراحی یکپارچه',
    body: 'مطالعات فاز صفر، یک و دو؛ طراحی معماری، سازه و تأسیسات مکانیکی و الکتریکی بر اساس مصوبات سازمان برنامه و بودجه و با کنترل مشاوران مجرب.',
    footer: 'فاز صفر، ۱ و ۲ • BIM و هماهنگی تأسیسات',
    iconPaths: [
      'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z',
      'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
    ],
  },
  {
    heading: 'نظارت کارگاهی و کنترل کیفیت',
    body: 'استقرار دفاتر فنی و ناظران مقیم در محل اجرای پروژه‌ها؛ کنترل کیفیت بتن، میلگرد و جوش، پایش ایمنی کارگاه و انطباق کامل با نقشه‌ها و ضوابط.',
    footer: 'نظارت مقیم • آزمایشگاه تخصصی • HSE',
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

type TestLeader = {
  name: string;
  image?: string;
  title: string;
  sub: string;
  ceo?: boolean;
};

const CHART_ROWS: { className: string | null; leaders: TestLeader[] }[] = [
  {
    className: 'org-chart__row--ceo',
    leaders: [
      {
        name: 'محمد منزوی',
        image: '/assets/team/ceo.webp',
        title: 'مدیر عامل',
        sub: 'بنیان‌گذار و راهبر ارشد مجموعه',
        ceo: true,
      },
    ],
  },
  {
    className: null,
    leaders: [
      {
        name: 'احمد نادری',
        image: '/assets/team/vp-engineering.webp',
        title: 'معاونت فنی و نظارت',
        sub: 'راهبری محاسبات سازه، زلزله و ژئوتکنیک',
      },
    ],
  },
  {
    className: 'org-chart__row--managers',
    leaders: [
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
    ],
  },
  {
    className: 'org-chart__row--staff',
    leaders: [
      {
        name: 'حامد یزدان پناه',
        image: '/assets/team/project-manager.webp',
        title: 'مدیر طرح و برنامه',
        sub: 'کنترل پروژه، زمان‌بندی و برنامه‌ریزی اجرایی',
      },
      {
        name: 'کامیار بینا',
        title: 'مدیر مالی',
        sub: 'راهبری بودجه، گزارش‌های مالی و انضباط مالی',
      },
      {
        name: 'محمد رحیمی',
        title: 'مدیر اداری و پشتیبانی',
        sub: 'مدیریت منابع انسانی، امور اداری و پشتیبانی',
      },
      {
        name: 'وحید جمالی',
        image: '/assets/team/qa-qc.webp',
        title: 'مدیر امور قراردادها',
        sub: 'رسیدگی به امور حقوقی، قراردادها و اسناد مناقصه',
      },
    ],
  },
];

const CHART_LEADERS = CHART_ROWS.flatMap((row) => row.leaders);

test('about page renders metadata and the centered page head', async ({ page }) => {
  const response = await page.goto('/about/');
  expect(response?.status()).toBe(200);

  await expect(page).toHaveTitle('درباره ما | مهندسین مشاور ناجی سازان امین');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'درباره شرکت مهندسین مشاور ناجی سازان امین — بیش از دو دهه تجربه در طراحی، نظارت و مدیریت طرح.',
  );

  const banner = page.locator('main .page-head');
  await expect(banner).toHaveClass(/page-head--center/);
  await expect(banner.locator('.page-head__title')).toHaveText('درباره مهندسین مشاور');
  await expect(banner.locator('.lead')).toHaveText(
    'تجربه، تخصص و تعهد؛ سه رکن ماندگار در مسیر توسعه صنعت عمرانی کشور از سال ۱۳۸۳',
  );
  expect(await banner.evaluate((element) => getComputedStyle(element).textAlign)).toBe('center');
});

test('the blue company banner opens the page and the plain résumé paragraphs follow', async ({
  page,
}) => {
  await page.goto('/about/');

  const paragraphs = page.locator('main .about-resume p');
  await expect(paragraphs).toHaveCount(RESUME_PARAGRAPHS.length);
  await expect(paragraphs).toHaveText(RESUME_PARAGRAPHS);
  await expect(page.locator('.about-resume__lead')).toHaveCount(0);
  await expect(page.locator('.about-resume__columns')).toHaveCount(0);

  const top = page.locator('main .about-resume--top');
  await expect(top).toHaveClass(/reveal/);
  await expect(top.locator('p')).toHaveCount(2);

  const bottom = page.locator('main .about-resume--bottom');
  await expect(bottom.locator('p')).toHaveCount(2);

  const closing = page.locator('main .about-resume--closing');
  await expect(closing).toHaveCount(1);
  await expect(closing.locator('p')).toHaveText(RESUME_PARAGRAPHS[4]);

  const order = await page.evaluate(() => {
    const nodes = [
      document.querySelector('.about-bento-grid--hero'),
      document.querySelector('.about-resume--top'),
      document.querySelector('.about-bento-grid--cards'),
      document.querySelector('.about-resume--bottom'),
      document.querySelector('.about-vision'),
      document.querySelector('.about-resume--closing'),
      document.querySelector('.executive-glass'),
      document.querySelector('.page-head'),
    ];
    if (nodes.some((node) => !node)) return null;
    return nodes.every((node, index) => {
      if (index === 0) return true;
      return Boolean(
        nodes[index - 1]!.compareDocumentPosition(node!) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });
  expect(
    order,
    'blue banner, first text block, cards row, second text block, vision, closing text, management, page head',
  ).toBe(true);
});

test('stats ribbon shows the four headline figures with animated counters', async ({ page }) => {
  await page.goto('/about/');

  const ribbon = page.locator('main .about-stats-ribbon');
  await expect(ribbon).toHaveCount(1);
  await expect(ribbon).toHaveClass(/reveal/);

  const cards = ribbon.locator('.stats-card');
  await expect(cards).toHaveCount(STATS.length);
  await cards.first().scrollIntoViewIfNeeded();

  for (const [index, stat] of STATS.entries()) {
    const card = cards.nth(index);
    await expect(card.locator('.stats-card__icon svg')).toHaveCount(1);
    await expect(card.locator('.stats-card__num')).toContainText(stat.num);
    await expect(card.locator('.stats-card__title')).toHaveText(stat.title);
    await expect(card.locator('.stats-card__sub')).toHaveText(stat.sub);
  }

  await expect(cards.last().locator('.stats-card__num')).toHaveText(STATS[3].num);
});

test('the blue banner and the two-card row render as separate blocks', async ({ page }) => {
  await page.goto('/about/');

  const grids = page.locator('main .about-bento-grid');
  await expect(grids).toHaveCount(2);

  const heroGrid = page.locator('main .about-bento-grid--hero');
  await expect(heroGrid).toHaveCount(1);
  await expect(heroGrid).toHaveClass(/reveal/);

  const hero = heroGrid.locator('.bento-card.bento-card--hero');
  await expect(hero).toHaveCount(1);
  expect(await hero.getAttribute('style')).toContain(
    assetUrl('/assets/projects/real/majlesi-isfahan/cover.webp'),
  );
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
    'شرکت مهندسین مشاور ناجی سازان امین، وابسته به بنیاد تعاون فراجا، فعالیت خود را از سال ۱۳۸۳ آغاز کرد و طی بیش از دو دهه با اتکا به دانش فنی روز، سرمایه انسانی متخصص و پایبندی به اصول حرفه‌ای، در طراحی و نظارت بزرگ‌ترین پروژه‌های عمرانی، اقامتی، اداری و یادمان‌های ملی حضور داشته است.',
  );

  const badges = hero.locator('.bento-badge-group .bento-pill');
  await expect(badges).toHaveCount(4);
  await expect(badges).toHaveText([
    'پروانه پایه یک طراحی و نظارت',
    'گواهینامه سمتا',
    'عضو انجمن بتن ایران',
    'سیستم مدیریت ISO 9001',
  ]);

  const cardsGrid = page.locator('main .about-bento-grid--cards');
  await expect(cardsGrid).toHaveCount(1);
  const cards = cardsGrid.locator('.bento-card');
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

test('executive spotlight presents the CEO profile, quote and matrix', async ({ page }) => {
  await page.goto('/about/');

  const spot = page.locator('main .executive-glass');
  await expect(spot).toHaveCount(1);
  await expect(spot).toHaveClass(/reveal/);

  const photo = spot.locator('.executive-photo-wrap img');
  await expect(photo).toHaveAttribute(
    'src',
    imageVariant('/assets/team/ceo.webp', 600, 'webp'),
  );
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
  await expect(spot.locator('.executive-quote')).toContainText(
    'هر پروژه برای ما صرفاً یک قرارداد یا یک سازه نبوده',
  );

  const items = spot.locator('.executive-matrix-item');
  await expect(items).toHaveCount(EXECUTIVE_MATRIX.length);
  for (const [index, [term, description]] of EXECUTIVE_MATRIX.entries()) {
    const item = items.nth(index);
    await expect(item.locator('dt')).toHaveText(term);
    await expect(item.locator('dd')).toHaveText(description);
  }
});

test('vision section lists the five strategic objectives', async ({ page }) => {
  await page.goto('/about/');

  const vision = page.locator('main .about-vision');
  await expect(vision).toHaveCount(1);
  await expect(vision.locator('h2')).toHaveText('چشم‌انداز و اهداف');
  await expect(vision.locator('.about-vision__intro p')).toContainText(
    'تبدیل شدن به یکی از برجسته‌ترین و قابل‌اعتمادترین شرکت‌های مهندسین مشاور',
  );
  await expect(vision.locator('.about-vision__list li')).toHaveCount(5);
});

test('leadership chart arranges all nine managers in four tiers', async ({ page }) => {
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

  const chart = page.locator('main .org-chart');
  await expect(chart).toHaveCount(1);
  await expect(chart.locator('.org-chart__connectors path')).toHaveCount(12);

  const rows = chart.locator('.org-chart__row');
  await expect(rows).toHaveCount(CHART_ROWS.length);

  for (const [rowIndex, row] of CHART_ROWS.entries()) {
    const rowLocator = rows.nth(rowIndex);
    if (row.className) await expect(rowLocator).toHaveClass(new RegExp(row.className));
    await expect(rowLocator.locator('.editorial-leader-card')).toHaveCount(row.leaders.length);

    for (const [cardIndex, leader] of row.leaders.entries()) {
      const card = rowLocator.locator('.editorial-leader-card').nth(cardIndex);
      await expect(card.locator('.editorial-leader-name')).toHaveText(leader.name);
      await expect(card.locator('.editorial-leader-title')).toHaveText(leader.title);
      await expect(card.locator('.editorial-leader-sub')).toHaveText(leader.sub);

      if (leader.image) {
        const photo = card.locator('.editorial-leader-photo img');
        await expect(photo).toHaveAttribute('src', imageVariant(leader.image, 600, 'webp'));
        await expect(photo).toHaveAttribute('alt', leader.name);
        await expect(photo).toHaveAttribute('width', '600');
        await expect(photo).toHaveAttribute('height', '800');
        await expect(photo).toHaveAttribute('loading', 'lazy');
        await expect(photo).toHaveAttribute('decoding', 'async');
      } else {
        await expect(card.locator('.editorial-leader-photo--placeholder')).toHaveCount(1);
        await expect(card.locator('.editorial-leader-photo--placeholder svg')).toHaveCount(1);
        await expect(card.locator('.editorial-leader-photo img')).toHaveCount(0);
      }

      if (leader.ceo) {
        await expect(card).toHaveClass(/editorial-leader-card--ceo/);
      }
    }
  }

  await expect(chart.locator('.editorial-leader-card')).toHaveCount(CHART_LEADERS.length);
  await expect(chart.locator('.editorial-leader-photo img')).toHaveCount(
    CHART_LEADERS.filter((leader) => leader.image).length,
  );
  await expect(chart.locator('.editorial-leader-photo--placeholder')).toHaveCount(
    CHART_LEADERS.filter((leader) => !leader.image).length,
  );

  const names = await chart.locator('.editorial-leader-name').allTextContents();
  expect(names).toEqual(CHART_LEADERS.map((leader) => leader.name));
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

test('all about images resolve from the static export', async ({ page }) => {
  await page.goto('/about/');

  const images = page.locator('main img');
  await expect(images).toHaveCount(
    CHART_LEADERS.filter((leader) => leader.image).length + 1,
  );

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
  expect(html).toContain('محمد منزوی');
  expect(html).toContain('کامیار بینا');
  expect(html).toContain('محمد رحیمی');
  expect(html).toContain('بنیاد تعاون فراجا');
  expect(html).toContain(assetUrl('/assets/projects/real/majlesi-isfahan/cover.webp'));
});

test('about images resolve with image content types', async ({ page }) => {
  const images = [
    '/assets/projects/real/majlesi-isfahan/cover.webp',
    ...new Set([
      ...CHART_LEADERS.filter((leader) => leader.image).map((leader) => leader.image!),
      '/assets/team/ceo.webp',
    ]),
  ];

  for (const image of images) {
    const response = await page.request.get(assetUrl(image));
    expect(response.status(), image).toBe(200);
    expect(response.headers()['content-type'] ?? '', image).toMatch(/^image\//);
  }
});
