export type Service = {
  id: string;
  img: string;
  alt: string;
  title: string;
  desc: string;
  href: string;
  link: string;
};

export const SERVICES: Service[] = [
  {
    id: 'design',
    img: '/assets/projects/real/baran-design/cover.webp',
    alt: 'مشاوره و طراحی معماری و سازه',
    title: 'مشاوره و طراحی',
    desc: 'مطالعات فاز صفر، یک و دو؛ طراحی معماری، سازه و تأسیسات ساختمان‌های مسکونی، تجاری، اداری، مذهبی و رفاهی.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'supervision',
    img: '/assets/projects/real/arg-kish/cover.webp',
    alt: 'نظارت کارگاهی و عالیه',
    title: 'نظارت کارگاهی و عالیه',
    desc: 'استقرار دفاتر فنی و ناظران مقیم در محل پروژه، کنترل کیفیت اجرا، ایمنی و انطباق با نقشه‌ها و ضوابط.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'management',
    img: '/assets/projects/real/majlesi-isfahan/cover.webp',
    alt: 'مدیریت طرح و کنترل پروژه',
    title: 'مدیریت طرح و کنترل پروژه',
    desc: 'برنامه‌ریزی و زمان‌بندی، کنترل پیشرفت، تهیه گزارش‌های دوره‌ای و مدیریت تأخیرات در پروژه‌های عمرانی.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'lab',
    img: '/assets/projects/real/qiam-dasht/cover.webp',
    alt: 'خدمات آزمایشگاهی و کنترل کیفیت',
    title: 'خدمات آزمایشگاهی',
    desc: 'آزمون‌های ژئوتکنیک، بتن، میلگرد و جوش با تجهیزات تخصصی؛ پشتیبان کنترل کیفیت طراحی و اجرا.',
    href: '/contact',
    link: 'درخواست مشاوره',
  },
];
