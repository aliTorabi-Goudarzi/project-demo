export type Project = {
  id: string;
  title: string;
  service: string;
  serviceSlug: 'design' | 'supervision';
  type: string;
  location: string;
  scope: string;
  summary: string;
  description: string;
  image: string;
  images: string[];
  featured?: boolean;
};

type ProjectSeed = Omit<Project, 'image' | 'images'> & { imageCount: number };

function buildProject(seed: ProjectSeed): Project {
  const base = `/assets/projects/real/${seed.id}`;
  return {
    ...seed,
    image: `${base}/cover.webp`,
    images: [
      `${base}/cover.webp`,
      ...Array.from(
        { length: Math.max(0, seed.imageCount - 1) },
        (_, index) => `${base}/${String(index + 1).padStart(2, '0')}.webp`,
      ),
    ],
  };
}

const PROJECT_SEEDS: ProjectSeed[] = [
  // ---------- طراحی ----------
  {
    id: 'baran-design',
    title: 'پروژه اداری تجاری باران',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اداری، تجاری',
    location: 'تهران',
    scope: '۱۳ طبقه · ۲۴۲ واحد اداری · ۶۱۲ واحد تجاری',
    summary: 'مجتمع بلندمرتبه اداری-تجاری با طراحی معماری و سازه یکپارچه.',
    description:
      'طراحی معماری و سازه مجتمع ۱۳ طبقه باران با ۲۴۲ واحد اداری و ۶۱۲ واحد تجاری در تهران؛ شامل مدلسازی سه‌بعدی، طراحی نما و هماهنگی تأسیسات.',
    imageCount: 6,
    featured: true,
  },
  {
    id: 'france-market-kish',
    title: 'بازار فرانسه کیش',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'تجاری، رفاهی',
    location: 'کیش',
    scope: 'زیربنای کل: ۲۳٬۶۰۰ مترمربع',
    summary: 'مجتمع تجاری-رفاهی با سقف‌های فضاکار و معماری گردشگرمحور در کیش.',
    description:
      'طراحی معماری بازار فرانسه کیش با زیربنای حدود ۲۳٬۶۰۰ مترمربع؛ سقف‌های فضاکار، مسیرهای پیاده و فضاهای تجاری و رفاهی.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'navalreza-hotel-interior',
    title: 'طراحی داخلی هتل نوالرضا',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اقامتی',
    location: 'مشهد',
    scope: '۱۴ طبقه · ۱۰۸ واحد اقامتی',
    summary: 'طراحی داخلی فضاهای اقامتی هتل نوالرضا مشهد.',
    description:
      'طراحی داخلی لابی، اتاق‌ها و فضاهای عمومی هتل نوالرضا مشهد با رویکرد اقامتی-زیارتی.',
    imageCount: 6,
  },
  {
    id: 'saadi-shiraz',
    title: 'مجتمع مسکونی سعدی',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'مسکونی',
    location: 'شیراز',
    scope: '',
    summary: 'مجتمع مسکونی در بافت شهری شیراز با طراحی اقلیمی.',
    description:
      'طراحی مجتمع مسکونی سعدی شیراز با تمرکز بر نور طبیعی، تهویه و هماهنگی با بافت شهری.',
    imageCount: 1,
  },
  {
    id: 'einoli-zeynoli',
    title: 'طرح توسعه امامزادگان عین‌علی و زین‌علی',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'مذهبی',
    location: '',
    scope: '',
    summary: 'طرح جامع توسعه و ساماندهی حرم امامزادگان عین‌علی و زین‌علی.',
    description:
      'مطالعات و طراحی توسعه مجموعه مذهبی امامزادگان عین‌علی و زین‌علی شامل صحن، رواق و فضاهای خدماتی.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'mobinnet-hq',
    title: 'ساختمان مرکزی مبین نت',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اداری',
    location: 'تهران',
    scope: '',
    summary: 'ساختمان اداری مرکزی با نمای شاخص و پلان منعطف.',
    description:
      'طراحی ساختمان مرکزی شرکت مبین نت در تهران با نمای شیشه‌ای، پلان اداری منعطف و هماهنگی تأسیسات.',
    imageCount: 3,
  },
  {
    id: 'shahid-boroujerdi',
    title: 'مجموعه فرهنگی شهید بروجردی',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'فرهنگی، مذهبی',
    location: '',
    scope: '',
    summary: 'مجموعه فرهنگی-مذهبی با فضاهای اجتماعی و آموزشی.',
    description:
      'طراحی مجموعه فرهنگی شهید بروجردی شامل سالن اجتماعات، فضاهای آموزشی و محوطه‌سازی.',
    imageCount: 8,
  },
  {
    id: 'seoul-residential',
    title: 'مجتمع مسکونی سئول',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'مسکونی',
    location: 'تهران',
    scope: 'زیربنای کل: ۳۵٬۰۰۰ مترمربع',
    summary: 'برج‌های مسکونی در شهرک سئول تهران.',
    description:
      'طراحی مجتمع مسکونی سئول در تهران با زیربنای حدود ۳۵٬۰۰۰ مترمربع؛ شامل برج‌های مسکونی، محوطه و پارکینگ.',
    imageCount: 2,
  },
  {
    id: 'najm-hypermarket',
    title: 'هایپر نجم خاورمیانه',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'تجاری',
    location: '',
    scope: '',
    summary: 'هایپرمارکت و مجموعه تجاری با دهانه‌های بزرگ.',
    description:
      'طراحی هایپر نجم خاورمیانه با فضاهای فروش، انبار و پارکینگ؛ سازه دهانه‌بزرگ و نمای مدرن.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'modares-hotel-isfahan',
    title: 'هتل مدرس اصفهان',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اقامتی',
    location: 'اصفهان',
    scope: '',
    summary: 'هتل شهری با معماری معاصر در اصفهان.',
    description:
      'طراحی هتل مدرس اصفهان شامل اتاق‌ها، لابی، رستوران و فضاهای خدماتی با نگاه به معماری بومی.',
    imageCount: 2,
  },
  {
    id: 'narges-bagh-aseman',
    title: 'هتل نرگس باغ آسمان',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اقامتی',
    location: 'تهران',
    scope: '',
    summary: 'مجموعه هتل نرگس باغ آسمان با طراحی اقامتی-رفاهی.',
    description:
      'طراحی مجموعه هتل نرگس باغ آسمان شامل برج اقامتی، فضاهای رفاهی و محوطه.',
    imageCount: 2,
  },
  {
    id: 'narges-marzadaran',
    title: 'هتل نرگس مرزداران',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'اقامتی',
    location: 'تهران',
    scope: '',
    summary: 'هتل شهری با نمای منحنی در مرزداران تهران.',
    description:
      'طراحی هتل نرگس مرزداران با نمای منحنی، اتاق‌های اقامتی و فضاهای پذیرایی.',
    imageCount: 6,
  },
  {
    id: 'bushehr-campus',
    title: 'پردیس رفاهی بوشهر',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'رفاهی',
    location: 'بوشهر',
    scope: '',
    summary: 'پردیس رفاهی با معماری اقلیمی در بوشهر.',
    description:
      'طراحی پردیس رفاهی بوشهر شامل ساختمان‌های اقامتی، رستوران، محوطه و فضاهای تفریحی با توجه به اقلیم گرم و مرطوب.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'bojnourd-campus',
    title: 'پردیس بجنورد',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'رفاهی، اداری',
    location: 'بجنورد',
    scope: '',
    summary: 'پردیس اداری-رفاهی با ساختمان‌های کم‌ارتفاع و محوطه سبز.',
    description:
      'طراحی پردیس بجنورد شامل بلوک‌های اداری و رفاهی، محوطه‌سازی و استخر.',
    imageCount: 8,
  },
  {
    id: 'yas-hangam',
    title: 'مجتمع تجاری یاس هنگام',
    service: 'طراحی',
    serviceSlug: 'design',
    type: 'تجاری',
    location: 'تهران',
    scope: '۱۵ طبقه · ۳۹۴ واحد',
    summary: 'مجتمع تجاری ۱۵ طبقه در تهران.',
    description:
      'طراحی مجتمع تجاری یاس هنگام با ۱۵ طبقه و ۳۹۴ واحد تجاری؛ شامل نما، پلان فروشگاهی و هماهنگی تأسیسات.',
    imageCount: 4,
    featured: true,
  },
  // ---------- نظارت ----------
  {
    id: 'arg-kish',
    title: 'مجتمع مسکونی ارگ کیش',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'کیش',
    scope: '۳ بلوک · ۷ طبقه',
    summary: 'مجتمع مسکونی چندبلوکی در جزیره کیش.',
    description:
      'نظارت بر اجرای مجتمع مسکونی ارگ کیش شامل سه بلوک هفت‌طبقه، محوطه و تأسیسات.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'baran-supervision',
    title: 'پروژه اداری تجاری باران',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'اداری، تجاری',
    location: 'تهران',
    scope: '۱۳ طبقه · ۲۴۲ واحد اداری · ۶۱۲ واحد تجاری',
    summary: 'نظارت بر اجرای مجتمع اداری-تجاری باران.',
    description:
      'نظارت کارگاهی و کنترل کیفیت اجرای مجتمع ۱۳ طبقه باران با ۲۴۲ واحد اداری و ۶۱۲ واحد تجاری.',
    imageCount: 8,
  },
  {
    id: 'hafez-shiraz',
    title: 'مجتمع مسکونی حافظ شیراز',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'شیراز',
    scope: '۱۵ طبقه · ۲۱۶ واحد',
    summary: 'برج مسکونی ۱۵ طبقه در شیراز.',
    description: 'نظارت بر اجرای مجتمع مسکونی حافظ شیراز شامل ۱۵ طبقه و ۲۱۶ واحد.',
    imageCount: 8,
  },
  {
    id: 'hekmat-orumiyeh',
    title: 'مجتمع مسکونی حکمت ارومیه',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'ارومیه',
    scope: '۱۸ طبقه · ۱۹۲ واحد',
    summary: 'برج مسکونی ۱۸ طبقه در ارومیه.',
    description: 'نظارت بر اجرای مجتمع مسکونی حکمت ارومیه با ۱۸ طبقه و ۱۹۲ واحد.',
    imageCount: 7,
  },
  {
    id: 'khalij-fars-yazd',
    title: 'مجتمع مسکونی خلیج فارس یزد',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'یزد',
    scope: '',
    summary: 'مجتمع مسکونی در یزد با نظارت کارگاهی.',
    description:
      'نظارت بر اجرای مجتمع مسکونی خلیج فارس یزد شامل بلوک‌های مسکونی و محوطه.',
    imageCount: 2,
  },
  {
    id: 'rihaneh-mehstan',
    title: 'مجتمع مسکونی ریحانه مهستان',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'هشتگرد',
    scope: 'برج‌های ۱۸ طبقه',
    summary: 'مجتمع مسکونی بلندمرتبه در هشتگرد.',
    description:
      'نظارت بر اجرای مجتمع مسکونی ریحانه مهستان هشتگرد شامل برج‌های بلندمرتبه و محوطه.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'setayesh-khorramabad',
    title: 'مجتمع مسکونی ستایش',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'خرم‌آباد',
    scope: '',
    summary: 'مجتمع مسکونی ستایش در خرم‌آباد.',
    description:
      'نظارت بر اجرای مجتمع مسکونی ستایش خرم‌آباد شامل بلوک‌های مسکونی و تأسیسات.',
    imageCount: 3,
  },
  {
    id: 'shaghayegh-sari',
    title: 'مجتمع مسکونی شقایق ساری',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'ساری',
    scope: '۵ طبقه · ۶۴۰ واحد',
    summary: 'مجتمع مسکونی ۵ طبقه با ۶۴۰ واحد در ساری.',
    description:
      'نظارت بر اجرای مجتمع شقایق ساری شامل بلوک‌های ۵ طبقه و ۶۴۰ واحد.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'qiam-dasht',
    title: 'مجتمع مسکونی قیام دشت',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'تهران',
    scope: '',
    summary: 'مجتمع مسکونی در قیام‌دشت تهران.',
    description:
      'نظارت بر اجرای مجتمع مسکونی قیام دشت شامل بلوک‌ها، محوطه و تأسیسات.',
    imageCount: 8,
  },
  {
    id: 'laleh-malard',
    title: 'مجتمع مسکونی لاله ملارد',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'ملارد',
    scope: '۶ طبقه · ۶۵۰ واحد',
    summary: 'مجتمع مسکونی ۶ طبقه با ۶۵۰ واحد در ملارد.',
    description:
      'نظارت بر اجرای مجتمع لاله ملارد شامل بلوک‌های ۶ طبقه و ۶۵۰ واحد.',
    imageCount: 8,
  },
  {
    id: 'majlesi-isfahan',
    title: 'مجتمع مسکونی مجلسی اصفهان',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'اصفهان',
    scope: '۱۴ بلوک · ۶ طبقه · ۶۷۴ واحد',
    summary: 'مجتمع مسکونی ۱۴ بلوکی در اصفهان.',
    description:
      'نظارت بر اجرای مجتمع مجلسی اصفهان شامل ۱۴ بلوک ۶ طبقه و ۶۷۴ واحد.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'rasht-residential',
    title: 'مجتمع مسکونی مهر رشت',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'رشت',
    scope: '',
    summary: 'مجتمع مسکونی در رشت با نظارت کارگاهی.',
    description:
      'نظارت بر اجرای مجتمع مسکونی مهر رشت شامل بلوک‌های مسکونی و محوطه.',
    imageCount: 8,
  },
  {
    id: 'razavi-yaftabad',
    title: 'مجتمع مسکونی رضوی یافت‌آباد',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'تهران',
    scope: '',
    summary: 'مجتمع مسکونی در یافت‌آباد تهران.',
    description:
      'نظارت بر اجرای مجتمع مسکونی رضوی یافت‌آباد شامل بلوک‌ها و تأسیسات.',
    imageCount: 8,
  },
  {
    id: 'yaftabad-residential',
    title: 'مجتمع مسکونی یافت‌آباد',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'تهران',
    scope: '',
    summary: 'مجتمع مسکونی در یافت‌آباد.',
    description: 'نظارت بر اجرای مجتمع مسکونی یافت‌آباد.',
    imageCount: 1,
  },
  {
    id: 'khavaran-housing',
    title: 'منازل سازمانی خاوران',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'تهران',
    scope: '',
    summary: 'منازل سازمانی در منطقه خاوران تهران.',
    description:
      'نظارت بر اجرای منازل سازمانی خاوران شامل بلوک‌های مسکونی و محوطه.',
    imageCount: 1,
  },
  {
    id: 'navalreza-mashhad',
    title: 'هتل نوالرضا مشهد',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'اقامتی',
    location: 'مشهد',
    scope: '۱۴ طبقه · ۱۰۸ واحد اقامتی',
    summary: 'هتل ۱۴ طبقه با ۱۰۸ واحد اقامتی در مشهد.',
    description:
      'نظارت بر اجرای هتل نوالرضا مشهد شامل ۱۴ طبقه و ۱۰۸ واحد اقامتی.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'parnian-andisheh',
    title: 'مجتمع مسکونی پرنیان اندیشه',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'رشت',
    scope: '۸ طبقه',
    summary: 'مجتمع مسکونی ۸ طبقه در رشت.',
    description:
      'نظارت بر اجرای مجتمع پرنیان اندیشه رشت شامل بلوک‌های ۸ طبقه و محوطه.',
    imageCount: 8,
    featured: true,
  },
  {
    id: 'imam-musa-kazem',
    title: 'مجتمع مسکونی امام موسی کاظم (ع)',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'بندرعباس',
    scope: '۱۴ طبقه · ۷۶۹ واحد',
    summary: 'مجتمع مسکونی ۱۴ طبقه در بندرعباس.',
    description:
      'نظارت بر اجرای مجتمع امام موسی کاظم (ع) بندرعباس با ۱۴ طبقه و ۷۶۹ واحد.',
    imageCount: 2,
  },
  {
    id: 'pounak-campus',
    title: 'پردیس رفاهی پونک',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'رفاهی',
    location: 'تهران',
    scope: '',
    summary: 'پردیس رفاهی در پونک تهران.',
    description:
      'نظارت بر اجرای پردیس رفاهی پونک شامل ساختمان‌های اقامتی، رستوران و محوطه.',
    imageCount: 3,
  },
  {
    id: 'kowsar-shahroud',
    title: 'مجتمع مسکونی کوثر شاهرود',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'شاهرود',
    scope: '',
    summary: 'مجتمع مسکونی کوثر در شاهرود.',
    description: 'نظارت بر اجرای مجتمع مسکونی کوثر شاهرود.',
    imageCount: 1,
  },
  {
    id: 'mohajeran-arak',
    title: 'مجتمع مسکونی مهاجران',
    service: 'نظارت',
    serviceSlug: 'supervision',
    type: 'مسکونی',
    location: 'اراک',
    scope: '۶ طبقه',
    summary: 'مجتمع مسکونی ۶ طبقه در اراک.',
    description:
      'نظارت بر اجرای مجتمع مسکونی مهاجران اراک شامل بلوک‌های ۶ طبقه.',
    imageCount: 1,
  },
];

export const PROJECTS: Project[] = PROJECT_SEEDS.map(buildProject);

export const PROJECT_CATEGORIES = [
  { slug: 'all', label: 'همه' },
  { slug: 'design', label: 'طراحی' },
  { slug: 'supervision', label: 'نظارت' },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
