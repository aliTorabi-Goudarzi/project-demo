import type { ReactNode } from 'react';

type Credential = {
  title: string;
  issuer: string;
  year: string;
  icon: ReactNode;
};

const CREDENTIALS: Credential[] = [
  {
    title: 'پروانه حقوقی پایه یک',
    issuer: 'طراحی و نظارت — وزارت راه و شهرسازی، سازمان برنامه و بودجه',
    year: '۱۳۸۳',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: 'گواهینامه ISO 9001',
    issuer: 'سیستم مدیریت کیفیت',
    year: '۱۳۸۹',
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
      </>
    ),
  },
  {
    title: 'مدال برنزین جایزه ملی بقراط',
    issuer: 'تقدیر از عملکرد حرفه‌ای',
    year: '۱۳۹۲',
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M12 7v4l2.5 2.5M8.5 14L7 22l5-3 5 3-1.5-8" />
      </>
    ),
  },
  {
    title: 'عضویت در انجمن بتن ایران',
    issuer: 'همراه با تجهیز آزمایشگاه تخصصی',
    year: '۱۳۹۰',
    icon: (
      <>
        <path d="M9 3h6M10 3v6L4.5 19a2 2 0 001.8 3h11.4a2 2 0 001.8-3L14 9V3" />
        <path d="M7.5 15h9" />
      </>
    ),
  },
  {
    title: 'گواهینامه سمتا',
    issuer: 'خدمات فنی و مهندسی — ارتقا یافته',
    year: '۱۳۹۴',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </>
    ),
  },
];

export function Credentials() {
  return (
    <section className="section">
      <div className="container">
        <header className="section-head section-head--center">
          <h2 className="h-2 reveal" data-delay="1">
            مجوزها، گواهینامه‌ها و عضویت‌ها
          </h2>
        </header>

        <div className="tl-h__scroll">
          <ol className="tl-h">
            {CREDENTIALS.map((credential) => (
              <li key={credential.title} className="tl-h__item">
                <span className="tl-h__dot" aria-hidden="true" />
                <div className="seal-mark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {credential.icon}
                  </svg>
                </div>
                <h3 className="seal-title">{credential.title}</h3>
                <p className="seal-issuer">{credential.issuer}</p>
                <span className="seal-year">{credential.year}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
