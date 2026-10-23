import { CopyButton } from '@/components/contact/CopyButton';
import { OfficeStatus } from '@/components/contact/OfficeStatus';
import { SITE } from '@/lib/site';

export function ContactInfo() {
  return (
    <div className="contact-info-col reveal">
      <div className="contact-info__header">
        <OfficeStatus />
        <h2 className="h-2" style={{ marginBottom: 'var(--space-2)' }}>
          دفتر مرکزی مهندسی
        </h2>
        <p className="contact-info__sub">
          ارتباط مستقیم با کادر مدیریت، مهندسان مشاور و واحدهای نظارت و قراردادها
        </p>
      </div>

      <div className="contact-cards-stack">
        <div className="contact-action-card">
          <div className="contact-action-card__main">
            <div className="contact-action-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <span className="contact-action-card__label">تلفن دفتر مرکزی و مشاوره</span>
              <a href={SITE.phoneHref} className="contact-action-card__val" dir="ltr">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="contact-action-card__actions">
            <a href={SITE.phoneHref} className="mini-btn mini-btn--primary">
              تماس
            </a>
            <CopyButton
              value={SITE.phone}
              label="کپی"
              title="کپی شماره"
              className="mini-btn mini-btn--ghost copy-btn"
            />
          </div>
        </div>

        <div className="contact-action-card">
          <div className="contact-action-card__main">
            <div className="contact-action-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <span className="contact-action-card__label">پست الکترونیک رسمی استعلامات</span>
              <a href={`mailto:${SITE.email}`} className="contact-action-card__val" dir="ltr">
                {SITE.email}
              </a>
            </div>
          </div>
          <div className="contact-action-card__actions">
            <a href={`mailto:${SITE.email}`} className="mini-btn mini-btn--primary">
              ایمیل
            </a>
            <CopyButton
              value={SITE.email}
              label="کپی"
              title="کپی ایمیل"
              className="mini-btn mini-btn--ghost copy-btn"
            />
          </div>
        </div>

        <div className="contact-action-card">
          <div className="contact-action-card__main">
            <div className="contact-action-card__icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span className="contact-action-card__label">ساعات کاری و پذیرش جلسات</span>
              <span className="contact-action-card__val" style={{ fontSize: '0.95rem' }}>
                شنبه تا چهارشنبه: ۸:۰۰ الی ۱۷:۰۰
              </span>
            </div>
          </div>
          <span className="badge-subtle">پنج‌شنبه تعطیل</span>
        </div>
      </div>

      <div className="contact-map-widget">
        <div className="contact-map-view">
          <div className="map-cad-overlay" />
          <div className="map-pin-pulse">
            <div className="map-pin-ring" />
            <div className="map-pin-point">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="map-pin-callout">
              <strong>دفتر مرکزی ناجی سازان امین</strong>
              <span>{SITE.addressMap}</span>
            </div>
          </div>
        </div>

        <div className="map-nav-toolbar">
          <a
            href={SITE.mapLinks.nshn}
            target="_blank"
            rel="noopener noreferrer"
            className="map-nav-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>مسیریابی در نشان</span>
          </a>
          <a
            href={SITE.mapLinks.balad}
            target="_blank"
            rel="noopener noreferrer"
            className="map-nav-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>مسیریابی در بلد</span>
          </a>
          <a
            href={SITE.mapLinks.google}
            target="_blank"
            rel="noopener noreferrer"
            className="map-nav-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            </svg>
            <span>گوگل مپ</span>
          </a>
          <CopyButton
            value={SITE.addressFull}
            label="کپی نشانی کامل"
            title="کپی نشانی کامل"
            className="map-nav-btn copy-btn"
          />
        </div>
      </div>
    </div>
  );
}
