import type { Metadata } from 'next';

import { CtaPanel } from '@/components/shared/CtaPanel';
import { PageHead } from '@/components/shared/PageHead';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'درباره ما | مهندسین مشاور ناجی سازان امین',
  description:
    'درباره شرکت مهندسین مشاور ناجی سازان امین — بیش از دو دهه تجربه در طراحی، نظارت و مدیریت طرح.',
  path: '/about',
});

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
    icon: (
      <>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </>
    ),
  },
  {
    heading: 'نظارت مقیم کارگاهی و سراسری',
    body: 'استقرار دفاتر فنی و گروه‌های نظارتی در محل اجرای پروژه‌ها در اقصی نقاط کشور با اعمال پروتکل‌های سخت‌گیرانه ایمنی و کیفیت.',
    footer: 'دفاتر فنی کارگاهی • کنترل کیفی HSE',
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

export default function AboutPage() {
  return (
    <main>
      <PageHead
        title="درباره مهندسین مشاور"
        lead="تجربه، تخصص و تعهد؛ سه رکن ماندگار در مسیر توسعه صنعت عمرانی کشور از سال ۱۳۸۳"
      />

      <section className="section">
        <div className="container">
          <div className="about-stats-ribbon reveal">
            {STATS.map((stat) => (
              <div key={stat.title} className="stats-card">
                <span className="stats-card__num">{stat.num}</span>
                <h3 className="stats-card__title">{stat.title}</h3>
                <p className="stats-card__sub">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="about-bento-grid">
            <div
              className="bento-card bento-card--hero reveal"
              style={{ backgroundImage: "url('/assets/projects/supervision-real.jpg')" }}
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
                  شرکت مهندسین مشاور ناجی سازان امین فعالیت خود را از سال ۱۳۸۳ آغاز کرد و طی بیش از
                  بیست سال با اتکا به دانش فنی روز، سرمایه انسانی متخصص و اصول حرفه‌ای، مجری و ناظر
                  بزرگ‌ترین پروژه‌های عمرانی، اقامتی، اداری و یادمان‌های ملی بوده است.
                </p>
                <div className="bento-badge-group">
                  <span className="bento-pill">پروانه حقوقی پایه یک</span>
                  <span className="bento-pill">گواهینامه سمتا</span>
                  <span className="bento-pill">عضو انجمن بتن ایران</span>
                  <span className="bento-pill">سیستم مدیریت ISO 9001</span>
                </div>
              </div>
            </div>

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

          <div className="executive-glass reveal">
            <div className="executive-photo-wrap">
              <img
                src="/assets/team/ceo.webp"
                alt="محمد منزوی — مدیر عامل"
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
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

          <header
            className="section-head section-head--center reveal"
            style={{ marginBottom: '2.25rem' }}
          >
            <h2 className="h-2">راهبران و اعضای ارشد مهندسی</h2>
            <p className="lead">
              سرمایه انسانی کارآزموده‌ای که ستون فقرات اعتبار و کیفیت پروژه‌های ما هستند
            </p>
          </header>

          <div className="editorial-leaders-grid reveal">
            {LEADERS.map((leader) => (
              <article key={leader.name} className="editorial-leader-card">
                <div className="editorial-leader-photo">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    width="600"
                    height="800"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="editorial-leader-info">
                  <h3 className="editorial-leader-name">{leader.name}</h3>
                  <div className="editorial-leader-title">{leader.title}</div>
                  <p className="editorial-leader-sub">{leader.sub}</p>
                </div>
              </article>
            ))}
          </div>
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
