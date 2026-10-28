import Link from 'next/link';

import { HeroVideo } from './HeroVideo';

export function HomeHero() {
  return (
    <section className="hero">
      <div className="hero__bg-wrap" aria-hidden="true">
        <HeroVideo />
        <div className="hero__bg-overlay" />
      </div>

      <div className="hero__ambient" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />
      <div className="container">
        <div className="hero__inner">
          <h1 className="hero__title h-hero reveal" data-delay="1">
            شریک مهندسی مطمئن شما
            <br />
            <span className="text-gradient">از سال ۱۳۸۳ تا امروز</span>
          </h1>
          <p className="lead hero__lead reveal" data-delay="2">
            شرکت مهندسین مشاور ناجی سازان امین با تکیه بر دانش فنی روز و سرمایه انسانی متخصص، پیشرو در خدمات جامع
            طراحی، نظارت عالیه، مدیریت طرح و کنترل کیفیت پروژه‌های عمرانی کشور.
          </p>
          <div className="hero__actions reveal" data-delay="3">
            <Link className="btn btn--primary btn--lg" href="/contact" prefetch={false}>
              مشاوره و تماس با ما
            </Link>
            <Link className="btn btn--outline btn--lg" href="/about" prefetch={false}>
              درباره ما
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
