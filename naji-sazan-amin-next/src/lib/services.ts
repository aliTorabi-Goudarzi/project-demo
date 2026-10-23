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
    img: '/assets/projects/parsa-tower.webp',
    alt: 'طراحی معماری و سازه',
    title: 'طراحی معماری و سازه',
    desc: 'طراحی پروژه‌های مسکونی، تجاری، اداری و سازه‌های بلندمرتبه با بهینه‌سازی مصرف انرژی.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'supervision',
    img: '/assets/projects/supervision-real.webp',
    alt: 'نظارت عالیه و اجرا',
    title: 'نظارت عالیه و اجرا',
    desc: 'نظارت دقیق بر اجرا با استقرار دفاتر فنی در محل پروژه و کنترل کیفیت، زمان و هزینه.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'management',
    img: '/assets/projects/setareh-office.webp',
    alt: 'مدیریت طرح و کنترل پروژه',
    title: 'مدیریت طرح و کنترل پروژه',
    desc: 'مدیریت یکپارچه طرح‌های عمرانی، برنامه‌ریزی، هماهنگی ذی‌نفعان و گزارش‌دهی دوره‌ای.',
    href: '/projects',
    link: 'نمونه پروژه‌ها',
  },
  {
    id: 'consulting',
    img: '/assets/projects/consulting-real.webp',
    alt: 'مشاوره مهندسی و مطالعات',
    title: 'مشاوره مهندسی و مطالعات',
    desc: 'مطالعات امکان‌سنجی، گزارش‌های فنی و اقتصادی و مشاوره در تصمیم‌سازی‌های کلان.',
    href: '/contact',
    link: 'درخواست مشاوره',
  },
];
