import type { ReactNode } from 'react';

type Pillar = {
  coord: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  schematic: ReactNode;
};

const PILLARS: Pillar[] = [
  {
    coord: '۲۲ سال سابقه',
    num: '۰۱',
    title: 'دانش فنی روز',
    desc: 'بهره‌گیری از روش‌های نوین مهندسی و مدل‌سازی پیشرفته در کنار تجربه ۲۲ ساله در پروژه‌های عمرانی.',
    tag: 'سیستم مدل‌سازی BIM',
    schematic: (
      <>
        <polygon points="50,15 85,32 50,50 15,32" strokeWidth="2" strokeDasharray="2 2" />
        <polygon points="50,50 85,68 50,85 15,68" strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="85" strokeWidth="2" />
        <line x1="15" y1="32" x2="15" y2="68" strokeWidth="2" />
        <line x1="85" y1="32" x2="85" y2="68" strokeWidth="2" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </>
    ),
  },
  {
    coord: 'ISO 9001:2015',
    num: '۰۲',
    title: 'تعهد به کیفیت',
    desc: 'سیستم مدیریت کیفیت ISO 9001 و آزمایشگاه تخصصی کنترل کیفی و مقاومت بتن و مصالح.',
    tag: 'پایش دقیق آزمایشگاهی',
    schematic: (
      <>
        <circle cx="50" cy="50" r="36" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="28" strokeWidth="2" />
        <path d="M35 50 L45 60 L65 38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="50" x2="22" y2="50" strokeWidth="1.5" />
        <line x1="78" y1="50" x2="90" y2="50" strokeWidth="1.5" />
        <line x1="50" y1="10" x2="50" y2="22" strokeWidth="1.5" />
        <line x1="50" y1="78" x2="50" y2="90" strokeWidth="1.5" />
      </>
    ),
  },
  {
    coord: 'کادر مهندسی ارشد',
    num: '۰۳',
    title: 'تیم متخصص',
    desc: 'مهندسان ارشد و طراحان زبده با سوابق اجرایی درخشان در پروژه‌های شاخص و ملی کشوری.',
    tag: 'مهندسان ارشد محاسب و ناظر',
    schematic: (
      <>
        <line x1="15" y1="75" x2="85" y2="75" strokeWidth="2.2" />
        <polygon points="15,75 50,25 85,75" strokeWidth="2" />
        <line x1="50" y1="25" x2="50" y2="75" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="32.5" y1="50" x2="50" y2="75" strokeWidth="1.5" />
        <line x1="67.5" y1="50" x2="50" y2="75" strokeWidth="1.5" />
        <circle cx="50" cy="25" r="3" fill="currentColor" />
        <circle cx="15" cy="75" r="3" fill="currentColor" />
        <circle cx="85" cy="75" r="3" fill="currentColor" />
      </>
    ),
  },
];

export function HomePillars() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-head section-head--center">
          <h2 className="h-2 reveal">سه اصل بنیادین ما</h2>
          <p className="lead reveal" data-delay="1">
            ارکان بنیادین در طراحی، محاسبات و نظارت عالیه مهندسین مشاور ناجی سازان امین
          </p>
        </header>

        <div className="cad-pillars-grid">
          {PILLARS.map((pillar, index) => (
            <div key={pillar.title} className="cad-card reveal" data-delay={String(index + 1)}>
              <div className="cad-card__corner cad-card__corner--tl" />
              <div className="cad-card__corner cad-card__corner--tr" />
              <div className="cad-card__corner cad-card__corner--bl" />
              <div className="cad-card__corner cad-card__corner--br" />

              <div className="cad-card__top">
                <span className="cad-card__coord">{pillar.coord}</span>
              </div>

              <div className="cad-card__icon-wrap">
                <svg className="cad-card__schematic" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                  {pillar.schematic}
                </svg>
                <span className="cad-card__num" aria-hidden="true">
                  {pillar.num}
                </span>
              </div>

              <h3 className="cad-card__title">{pillar.title}</h3>
              <p className="cad-card__desc">{pillar.desc}</p>

              <div className="cad-card__footer">
                <div className="cad-card__tag">
                  <span className="cad-dot" />
                  <span>{pillar.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
