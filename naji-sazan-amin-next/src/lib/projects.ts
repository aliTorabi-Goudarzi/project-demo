export type Project = {
  id: string;
  code: string;
  title: string;
  summary: string;
  client: string;
  location: string;
  year: string;
  category: string;
  categorySlug: string;
  type: string;
  image: string;
  description: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'parsa-tower',
    code: 'NSA-1401-01',
    title: 'برج مسکونی پارسا',
    summary: 'برج ۲۲ طبقه مسکونی با سازه بتنی و نمای دوپوسته.',
    client: 'شرکت ساختمانی پارسا',
    location: 'تهران / الهیه',
    year: '۱۳۹۸',
    category: 'مسکونی',
    categorySlug: 'residential',
    type: 'tower',
    image: '/assets/projects/parsa-tower.webp',
    description:
      'طراحی معماری و سازه، نظارت عالیه بر اجرا. ۲۲ طبقه، ۹۸ واحد، ۱۸٬۰۰۰ متر مربع زیربنا. سیستم باربر قاب خمشی بتنی با دیوار برشی. پی فونداسیون گسترده.',
  },
  {
    id: 'atlas-complex',
    code: 'NSA-1400-02',
    title: 'مجتمع تجاری اطلس',
    summary: 'مجتمع تجاری ۸ طبقه با پارکینگ ۴ طبقه در مرکز شهر.',
    client: 'گروه اطلس',
    location: 'اصفهان / چهارباغ',
    year: '۱۳۹۷',
    category: 'تجاری',
    categorySlug: 'commercial',
    type: 'complex',
    image: '/assets/projects/atlas-complex.webp',
    description:
      'طراحی معماری، سازه و تأسیسات. ۸ طبقه تجاری به‌همراه ۴ طبقه پارکینگ زیرزمین. ۳۲٬۰۰۰ متر مربع. سازه فلزی با مهاربندی هم‌مرکز.',
  },
  {
    id: 'saft-defense-museum',
    code: 'NSA-1395-03',
    title: 'موزه دفاع مقدس',
    summary: 'طراحی و نظارت موزه‌های دفاع مقدس در ۷ استان کشور.',
    client: 'بنیاد حفظ آثار دفاع مقدس',
    location: 'اصفهان، شیراز، تبریز و ۴ استان دیگر',
    year: '۱۳۹۲ — ۱۴۰۴',
    category: 'فرهنگی',
    categorySlug: 'cultural',
    type: 'cultural',
    image: '/assets/projects/saft-defense-museum.webp',
    description:
      'مدیریت طراحی، فنی و نظارت. عضویت در کارگروه محتوایی موزه‌ها. شامل سالن‌های نمایش، گالری، آمفی‌تئاتر و بخش اداری.',
  },
  {
    id: 'al-zahra-hospital',
    code: 'NSA-1399-04',
    title: 'بیمارستان الزهرا',
    summary: 'بیمارستان ۲۵۰ تخت‌خوابی با سازه بتنی مقاوم.',
    client: 'دانشگاه علوم پزشکی',
    location: 'شیراز',
    year: '۱۳۹۹',
    category: 'درمانی',
    categorySlug: 'healthcare',
    type: 'healthcare',
    image: '/assets/projects/al-zahra-hospital.webp',
    description:
      'طراحی معماری و سازه، نظارت عالیه. ۶ طبقه درمانی به‌همراه ۲ طبقه زیرزمین. ۲۸٬۰۰۰ متر مربع. سازه مقاوم در برابر زلزله با جداگرهای لرزه‌ای.',
  },
  {
    id: 'venus-mall',
    code: 'NSA-1402-05',
    title: 'مرکز خرید ونوس',
    summary: 'مرکز خرید ۵ طبقه با سالن‌های چندمنظوره.',
    client: 'گروه ونوس',
    location: 'کرج / گوهردشت',
    year: '۱۴۰۲',
    category: 'تجاری',
    categorySlug: 'commercial',
    type: 'complex',
    image: '/assets/projects/venus-mall.webp',
    description:
      'طراحی معماری، سازه و تأسیسات. ۵ طبقه تجاری به‌همراه ۳ طبقه پارکینگ. ۴۵٬۰۰۰ متر مربع. سازه فلزی با دهانه‌های ۲۴ متری.',
  },
  {
    id: 'niavaran-villa',
    code: 'NSA-1401-06',
    title: 'مجموعه ویلایی نیاوران',
    summary: '۱۲ واحد ویلایی لوکس در زمینی شیب‌دار.',
    client: 'شرکت توسعه مسکن پارس',
    location: 'تهران / نیاوران',
    year: '۱۴۰۱',
    category: 'مسکونی',
    categorySlug: 'residential',
    type: 'villa',
    image: '/assets/projects/niavaran-villa.webp',
    description:
      'طراحی معماری، محوطه‌سازی و سازه. ۱۲ واحد مستقل، هر واحد ۳۵۰ متر مربع. سازه بتنی با سقف تیرچه‌بلوک.',
  },
  {
    id: 'setareh-office',
    code: 'NSA-1400-07',
    title: 'ساختمان اداری ستاره',
    summary: 'برج اداری ۱۵ طبقه با نمای شیشه‌ای دوپوسته.',
    client: 'سازمان سرمایه‌گذاری ستاره',
    location: 'تهران / ونک',
    year: '۱۴۰۰',
    category: 'اداری',
    categorySlug: 'office',
    type: 'office',
    image: '/assets/projects/setareh-office.webp',
    description:
      'طراحی معماری و سازه. ۱۵ طبقه اداری به‌همراه ۴ طبقه پارکینگ. ۲۲٬۰۰۰ متر مربع. سازه ترکیبی فولاد و بتن.',
  },
  {
    id: 'bazaar-restoration',
    code: 'NSA-1396-08',
    title: 'بازسازی بازار تهران',
    summary: 'مرمت و مقاوم‌سازی بخش‌های تاریخی بازار تهران.',
    client: 'سازمان میراث فرهنگی',
    location: 'تهران / بازار',
    year: '۱۳۹۶',
    category: 'مرمت',
    categorySlug: 'restoration',
    type: 'restoration',
    image: '/assets/projects/bazaar-restoration.webp',
    description:
      'مرمت و مقاوم‌سازی لرزه‌ای با حفظ اصالت معماری سنتی و استفاده از مصالح بومی. ۲٬۰۰۰ متر مربع.',
  },
  {
    id: 'lahijan-bridge',
    code: 'NSA-1402-09',
    title: 'پل عابر پیاده لاهیجان',
    summary: 'پل عابر پیاده فولادی به طول ۱۲۰ متر.',
    client: 'شهرداری لاهیجان',
    location: 'گیلان / لاهیجان',
    year: '۱۴۰۲',
    category: 'زیرساخت',
    categorySlug: 'infrastructure',
    type: 'infrastructure',
    image: '/assets/projects/lahijan-bridge.webp',
    description:
      'طراحی سازه و نظارت. پل فولادی قوسی به طول ۱۲۰ متر و عرض ۴ متر با پوشش مقاوم در برابر خوردگی.',
  },
];

export const PROJECT_CATEGORIES = [
  { slug: 'all', label: 'همه' },
  { slug: 'residential', label: 'مسکونی' },
  { slug: 'commercial', label: 'تجاری' },
  { slug: 'cultural', label: 'فرهنگی' },
  { slug: 'healthcare', label: 'درمانی' },
  { slug: 'office', label: 'اداری' },
  { slug: 'restoration', label: 'مرمت' },
  { slug: 'infrastructure', label: 'زیرساخت' },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}
