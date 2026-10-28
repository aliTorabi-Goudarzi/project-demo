import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AnimatedStat } from '@/components/about/AnimatedStat';
import { LeadershipChart } from '@/components/about/LeadershipChart';
import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHead } from '@/components/shared/PageHead';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'درباره ما | مهندسین مشاور ناجی سازان امین',
  description:
    'درباره شرکت مهندسین مشاور ناجی سازان امین — بیش از دو دهه تجربه در طراحی، نظارت و مدیریت طرح.',
  path: '/about',
});

const RESUME_PARAGRAPHS = [
  'این مجموعه در سال ۱۳۸۶ با بازنگری در اساسنامه و توسعه دامنه فعالیت‌ها، وارد عرصه مدیریت طرح، کارفرمایی و ارائه خدمات تخصصی مهندسی شد و با ایجاد ساختارهای سازمانی منسجم، جذب متخصصان برجسته و تشکیل دپارتمان‌های فنی، زمینه حضور در پروژه‌های بزرگ و پیچیده عمرانی را فراهم ساخت.',
  'از سال ۱۳۸۹ و با تمرکز بر فعالیت به عنوان مهندسین مشاور، شرکت ناجی سازان امین مسیر توسعه خود را با رویکردی تخصص‌محور ادامه داد و با حضور در طراحی و نظارت پروژه‌های شاخص، سازه‌های بلندمرتبه و پروژه‌های خاص، توانست تجربه‌ای ارزشمند در اجرای پروژه‌های ملی و منطقه‌ای کسب کند. توسعه دامنه خدمات به استان‌های مختلف کشور و استقرار دفاتر فنی و نظارتی در محل اجرای پروژه‌ها، بیانگر رویکرد این مجموعه در ارائه خدمات دقیق، مستمر و مسئولانه است.',
  'پایبندی به کیفیت و توسعه مستمر، همواره از اصول بنیادین شرکت بوده است. اخذ پروانه حقوقی پایه یک طراحی و نظارت از وزارت راه و شهرسازی، دریافت مدال برنزین جایزه ملی بقراط، استقرار سیستم مدیریت کیفیت و اخذ گواهینامه ISO 9001 و ارتقای گواهینامه سمتا، عضویت در انجمن بتن ایران و تجهیز آزمایشگاه تخصصی، بخشی از دستاوردهای این مجموعه در مسیر ارتقای استانداردهای حرفه‌ای و سازمانی به شمار می‌رود.',
  'شرکت مهندسین مشاور ناجی سازان امین در سال‌های اخیر نیز با رویکردی مبتنی بر شفافیت، انضباط مالی و توسعه پایدار، ضمن ساماندهی ساختارهای مدیریتی، تسویه کامل تعهدات مالیاتی و بیمه‌ای، رفع محدودیت‌های ثبتی و پیگیری فرآیند تمدید و ارتقای مجوزهای حرفه‌ای، مسیر رشد و تعالی سازمانی خود را با قدرت ادامه داده است.',
  'امروز، مهندسین مشاور ناجی سازان امین با پشتوانه سال‌ها تجربه، بهره‌گیری از دانش روز مهندسی و اعتقاد راسخ به کیفیت، دقت و مسئولیت‌پذیری، آماده ارائه خدمات تخصصی در حوزه طراحی، نظارت، مدیریت طرح، کنترل پروژه و مشاوره مهندسی در سراسر کشور است؛ با این باور که اعتماد کارفرمایان، بزرگ‌ترین سرمایه هر سازمان و کیفیت، ماندگارترین دستاورد آن است.',
];

const BENTO_CARDS = [
  {
    heading: 'مطالعات و طراحی یکپارچه',
    body: 'مطالعات فاز صفر، یک و دو؛ طراحی معماری، سازه و تأسیسات مکانیکی و الکتریکی بر اساس مصوبات سازمان برنامه و بودجه و با کنترل مشاوران مجرب.',
    footer: 'فاز صفر، ۱ و ۲ • BIM و هماهنگی تأسیسات',
    icon: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
  {
    heading: 'نظارت کارگاهی و کنترل کیفیت',
    body: 'استقرار دفاتر فنی و ناظران مقیم در محل اجرای پروژه‌ها؛ کنترل کیفیت بتن، میلگرد و جوش، پایش ایمنی کارگاه و انطباق کامل با نقشه‌ها و ضوابط.',
    footer: 'نظارت مقیم • آزمایشگاه تخصصی • HSE',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const EXECUTIVE_MATRIX = [
  { term: 'تحصیلات دانشگاهی', description: 'فوق لیسانس معماری — دانشگاه تهران' },
  { term: 'پروانه اشتغال', description: 'پایه ارشد — نظارت، طراحی و اجرا' },
  { term: 'سابقه مدیریت ارشد', description: 'بیش از ۳۲ سال سابقه اجرایی' },
  { term: 'حوزه راهبری', description: 'طراحی جامع، نظارت عالیه، مدیریت طرح و ساخت' },
];

const VISION_POINTS = [
  'ارتقای استانداردهای طراحی و نظارت در پروژه‌های عمرانی بزرگ‌مقیاس',
  'بهره‌گیری از فناوری‌های نوین برای افزایش سرعت، دقت و بهره‌وری',
  'به‌کارگیری اصول معماری پایدار و مهندسی ارزش در تمامی پروژه‌ها',
  'ایجاد ساختاری منسجم برای مدیریت ریسک و تضمین کیفیت',
  'توسعه همکاری‌های داخلی و بین‌المللی با نهادها و شرکت‌های معتبر',
];

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  sub: string;
  icon: ReactNode;
};

const STATS: Stat[] = [
  {
    value: 22,
    suffix: '+',
    title: 'سال سابقه مستمر',
    sub: 'حضور فعال و پایدار در عرصه مهندسی از سال ۱۳۸۳',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
  },
  {
    value: 1,
    prefix: 'پایه ',
    title: 'صلاحیت ارشد حقوقی',
    sub: 'پروانه اشتغال طراحی و نظارت سازمان برنامه و بودجه',
    icon: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M8.5 13.5 7 22l5-2.5L17 22l-1.5-8.5" />
      </>
    ),
  },
  {
    value: 500,
    suffix: ' هزار',
    title: 'مترمربع زیربنا',
    sub: 'راهبری فنی کلان‌پروژه‌های درمانی، اقامتی و موزه‌ها',
    icon: (
      <>
        <path d="M4 21V9l8-5 8 5v12" />
        <path d="M9 21v-6h6v6" />
        <path d="M2 21h20" />
      </>
    ),
  },
  {
    value: 100,
    suffix: '٪',
    title: 'کنترل کیفی مقیم',
    sub: 'آزمایشگاه تخصصی و پایش ژئوتکنیک و بتن کارگاهی',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="about-bento-grid about-bento-grid--hero reveal">
            <div
              className="bento-card bento-card--hero"
              style={{ backgroundImage: "url('/assets/projects/real/majlesi-isfahan/cover.webp')" }}
            >
              <div className="bento-overlay" />
              <div className="bento-content">
                <span className="bento-pill" style={{ marginBottom: '0.85rem' }}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden="true"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  دو دهه راهبری و اثرگذاری
                </span>
                <h3>بیش از دو دهه مهندسی اصیل، متعهد و ماندگار در زیرساخت‌های کشور</h3>
                <p>
                  شرکت مهندسین مشاور ناجی سازان امین، وابسته به بنیاد تعاون فراجا، فعالیت خود را از
                  سال ۱۳۸۳ آغاز کرد و طی بیش از دو دهه با اتکا به دانش فنی روز، سرمایه انسانی متخصص
                  و پایبندی به اصول حرفه‌ای، در طراحی و نظارت بزرگ‌ترین پروژه‌های عمرانی، اقامتی،
                  اداری و یادمان‌های ملی حضور داشته است.
                </p>
                <div className="bento-badge-group">
                  <span className="bento-pill">پروانه پایه یک طراحی و نظارت</span>
                  <span className="bento-pill">گواهینامه سمتا</span>
                  <span className="bento-pill">عضو انجمن بتن ایران</span>
                  <span className="bento-pill">سیستم مدیریت ISO 9001</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-resume about-resume--top reveal">
            <p>{RESUME_PARAGRAPHS[0]}</p>
            <p>{RESUME_PARAGRAPHS[1]}</p>
          </div>

          <div className="about-bento-grid about-bento-grid--cards">
            {BENTO_CARDS.map((card, index) => (
              <div key={card.heading} className="bento-card reveal" data-delay={String(index + 1)}>
                <div>
                  <div className="bento-card__icon">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {card.icon}
                    </svg>
                  </div>
                  <h4>{card.heading}</h4>
                  <p>{card.body}</p>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)' }}>
                  {card.footer}
                </div>
              </div>
            ))}
          </div>

          <div className="about-resume about-resume--bottom reveal">
            <p>{RESUME_PARAGRAPHS[2]}</p>
            <p>{RESUME_PARAGRAPHS[3]}</p>
          </div>

          <div className="about-vision reveal" id="vision">
            <div className="about-vision__intro">
              <h2 className="h-2">چشم‌انداز و اهداف</h2>
              <p>
                چشم‌انداز ما تبدیل شدن به یکی از برجسته‌ترین و قابل‌اعتمادترین شرکت‌های مهندسین مشاور
                در کشور و منطقه است؛ شرکتی که نام آن یادآور تعهد، کیفیت و نوآوری باشد.
              </p>
            </div>
            <ul className="about-vision__list">
              {VISION_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="about-resume about-resume--closing reveal">
            <p>{RESUME_PARAGRAPHS[4]}</p>
          </div>

          <div className="executive-glass reveal">
            <div className="executive-photo-wrap">
              <ResponsiveImage
                src="/assets/team/ceo.webp"
                alt="محمد منزوی — مدیر عامل"
                width={600}
                height={800}
                widths={[300, 600]}
                sizes="(max-width: 900px) 80vw, 280px"
              />
            </div>
            <div className="executive-details">
              <h3>مهندس محمد منزوی</h3>
              <span className="executive-role-pill">بنیان‌گذار و مدیر عامل مهندسین مشاور</span>
              <p className="executive-bio">
                فوق لیسانس معماری از دانشگاه تهران با بیش از ۳۲ سال سابقه ارشد مدیریتی و اجرایی در
                کلان‌پروژه‌های کشور. دارای پروانه اشتغال به کار مهندسی پایه ارشد در سه صلاحیت نظارت،
                طراحی و اجرا و سابقه هدایت شرکت‌های مهندسی معتبر و طرح‌های ملی.
              </p>
              <blockquote className="executive-quote">
                «در این سال‌ها، هر پروژه برای ما صرفاً یک قرارداد یا یک سازه نبوده؛ فرصتی بوده برای
                بهبود کیفیت زندگی انسان‌ها، ارتقای استانداردهای ساخت‌وساز و ایجاد ارزش پایدار برای
                کارفرمایان و جامعه.»
              </blockquote>
              <dl className="executive-matrix">
                {EXECUTIVE_MATRIX.map((item) => (
                  <div key={item.term} className="executive-matrix-item">
                    <dt>{item.term}</dt>
                    <dd>{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <PageHead
        align="center"
        title="درباره مهندسین مشاور"
        lead="تجربه، تخصص و تعهد؛ سه رکن ماندگار در مسیر توسعه صنعت عمرانی کشور از سال ۱۳۸۳"
      />

      <section className="section">
        <div className="container">
          <div className="about-stats-ribbon reveal">
            {STATS.map((stat) => (
              <div key={stat.title} className="stats-card">
                <span className="stats-card__icon" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {stat.icon}
                  </svg>
                </span>
                <AnimatedStat value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <h3 className="stats-card__title">{stat.title}</h3>
                <p className="stats-card__sub">{stat.sub}</p>
              </div>
            ))}
          </div>

          <header
            className="section-head section-head--center reveal"
            style={{ marginBottom: '2.25rem' }}
          >
            <h2 className="h-2">راهبران و اعضای ارشد مهندسی</h2>
            <p className="lead">
              سرمایه انسانی کارآزموده‌ای که ستون فقرات اعتبار و کیفیت پروژه‌های ما هستند
            </p>
          </header>

          <LeadershipChart />
        </div>
      </section>

      <CtaPanel
        title="آماده همکاری هستیم"
        description="تیم ما آماده پاسخگویی به نیازهای فنی و مشاوره‌ای پروژه شماست."
        primary={{ label: 'تماس با ما', href: '/contact' }}
        secondary={{ label: 'نمونه پروژه‌ها', href: '/projects' }}
      />
    </main>
  );
}
