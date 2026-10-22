'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\+\-\s]{8,}$/;
const SUBMIT_ERROR = 'ارسال استعلام انجام نشد. لطفاً دوباره تلاش کنید یا با دفتر تماس بگیرید.';

const SERVICE_OPTIONS = [
  { label: 'طراحی معماری و سازه', value: 'طراحی معماری و سازه' },
  { label: 'نظارت عالیه و کارگاهی', value: 'نظارت عالیه و کارگاهی' },
  { label: 'مدیریت طرح (MC)', value: 'مدیریت طرح (MC)' },
  { label: 'مشاوره و مقاوم‌سازی', value: 'مشاوره و مقاوم‌سازی' },
  { label: 'طراحی تاسیسات و BIM', value: 'طراحی تاسیسات و BIM' },
];

const SCALE_OPTIONS = [
  { label: 'مسکونی و بلندمرتبه', value: 'مسکونی و بلندمرتبه' },
  { label: 'تجاری و اداری', value: 'تجاری و اداری' },
  { label: 'درمانی و کلینیک', value: 'درمانی و بیمارستانی' },
  { label: 'ویلایی و خاص', value: 'ویلایی و خاص' },
  { label: 'صنعتی و سازه خاص', value: 'صنعتی و سوله' },
];

type FieldKey = 'name' | 'phone' | 'email' | 'message';
type FormValues = Record<'name' | 'phone' | 'email' | 'city' | 'message', string>;
type FormErrors = Partial<Record<FieldKey, string>>;

const INITIAL_VALUES: FormValues = { name: '', phone: '', email: '', city: '', message: '' };

const VALIDATORS: Record<FieldKey, (value: string) => string | null> = {
  name: (value) => (value.trim().length >= 2 ? null : 'نام و نام خانوادگی الزامی است'),
  email: (value) => (EMAIL_PATTERN.test(value) ? null : 'ایمیل معتبر وارد کنید'),
  phone: (value) =>
    value.trim() === '' || PHONE_PATTERN.test(value) ? null : 'شماره تماس معتبر وارد کنید',
  message: (value) => (value.trim().length >= 10 ? null : 'پیام باید حداقل ۱۰ کاراکتر باشد'),
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  (Object.keys(VALIDATORS) as FieldKey[]).forEach((key) => {
    const message = VALIDATORS[key](values[key]);
    if (message) errors[key] = message;
  });

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [service, setService] = useState(SERVICE_OPTIONS[0].value);
  const [scale, setScale] = useState(SCALE_OPTIONS[0].value);
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const successRef = useRef<HTMLDivElement>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!successVisible) return;
    successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [successVisible]);

  useEffect(
    () => () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    },
    [],
  );

  const showSuccess = () => {
    setSuccessVisible(true);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setSuccessVisible(false), 6000);
  };

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setService(SERVICE_OPTIONS[0].value);
    setScale(SCALE_OPTIONS[0].value);
    setHoneypot('');
  };

  const handleChange =
    (key: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [key]: value }));
      setErrors((current) => {
        if (!(key in current)) return current;
        const next = { ...current };
        delete next[key as FieldKey];
        return next;
      });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sending) return;

    setSubmitError('');

    if (honeypot.trim() !== '') {
      showSuccess();
      resetForm();
      return;
    }

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = (Object.keys(nextErrors) as FieldKey[])[0];
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setErrors({});

    if (!CONTACT_ENDPOINT) {
      showSuccess();
      resetForm();
      return;
    }

    if (inFlight.current) return;

    inFlight.current = true;
    setSending(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, type: service, scale }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Request failed');

      showSuccess();
      resetForm();
    } catch {
      setSubmitError(SUBMIT_ERROR);
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      setSending(false);
    }
  };

  return (
    <div id="form" className="inquiry-form-card spotlight-card reveal" data-delay="1">
      <div className="inquiry-form__header">
        <div className="inquiry-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>بررسی اولیه و تماس ظرف کمتر از ۲۴ ساعت کاری</span>
        </div>
        <h2 className="h-3" style={{ marginBottom: 'var(--space-2)' }}>
          پروژه خود را با ما در میان بگذارید
        </h2>
        <p className="inquiry-form__sub">
          مشخصات اولیه طرح را وارد کنید تا کارشناسان ارشد مهندسی جهت هماهنگی و ارزیابی اولیه با شما
          تماس بگیرند.
        </p>
      </div>

      <form className="form" id="contactForm" method="post" noValidate onSubmit={handleSubmit}>
        <div className="form-honeypot" aria-hidden="true">
          <input
            type="text"
            name="company_website"
            id="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <div className="chips-field">
          <span className="chips-field__label" id="serviceChipsLabel">
            حوزه خدمات مورد نظر <span className="req">*</span>
          </span>
          <div className="chips-container" id="serviceChips" role="radiogroup" aria-labelledby="serviceChipsLabel">
            {SERVICE_OPTIONS.map((option) => {
              const active = option.value === service;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`form-chip${active ? ' is-active' : ''}`}
                  data-value={option.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setService(option.value)}
                >
                  <span className="chip-check">✓</span>
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
          <input type="hidden" name="type" id="serviceInput" value={service} />
        </div>

        <div className="chips-field">
          <span className="chips-field__label" id="scaleChipsLabel">
            کاربری و نوع پروژه (اختیاری)
          </span>
          <div className="chips-container" id="scaleChips" role="radiogroup" aria-labelledby="scaleChipsLabel">
            {SCALE_OPTIONS.map((option) => {
              const active = option.value === scale;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`form-chip form-chip--subtle${active ? ' is-active' : ''}`}
                  data-value={option.value}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setScale(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="scale" id="scaleInput" value={scale} />
        </div>

        <div className="form__row">
          <div className={`field${errors.name ? ' field--error' : ''}`}>
            <label htmlFor="name">
              نام و نام خانوادگی <span className="req">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="مثال: مهندس احمدی"
              maxLength={120}
              required
              value={values.name}
              onChange={handleChange('name')}
            />
            <span className="field__error">{errors.name}</span>
          </div>
          <div className={`field${errors.phone ? ' field--error' : ''}`}>
            <label htmlFor="phone">
              شماره تماس مستقیم <span className="req">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="۰۹۱۲..."
              maxLength={20}
              required
              value={values.phone}
              onChange={handleChange('phone')}
            />
            <span className="field__error">{errors.phone}</span>
          </div>
        </div>

        <div className="form__row">
          <div className={`field${errors.email ? ' field--error' : ''}`}>
            <label htmlFor="email">
              آدرس ایمیل <span className="req">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              placeholder="name@company.com"
              maxLength={254}
              required
              value={values.email}
              onChange={handleChange('email')}
            />
            <span className="field__error">{errors.email}</span>
          </div>
          <div className="field">
            <label htmlFor="city">محل / شهر اجرای پروژه</label>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="مثال: تهران / منطقه ۱"
              maxLength={120}
              value={values.city}
              onChange={handleChange('city')}
            />
            <span className="field__error" />
          </div>
        </div>

        <div className={`field${errors.message ? ' field--error' : ''}`}>
          <label htmlFor="message">
            شرح مختصر مشخصات و نیازهای پروژه <span className="req">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="متراژ تقریبی، تعداد طبقات، وضعیت فعلی پرونده شهرداری یا زمین، و زمان‌بندی مد نظر..."
            maxLength={2000}
            required
            value={values.message}
            onChange={handleChange('message')}
          />
          <span className="field__error">{errors.message}</span>
        </div>

        <div className="form-meta-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span>امکان تبادل فایل نقشه‌ها (DWG / PDF) پس از تماس اولیه کارشناس هماهنگ می‌شود.</span>
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--shimmer btn--magnetic btn--lg btn--block"
          disabled={sending}
          aria-busy={sending}
        >
          <span>ثبت و ارسال استعلام پروژه</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {submitError && (
          <p className="form__submit-error" role="alert">
            {submitError}
          </p>
        )}

        <div
          ref={successRef}
          className={`form__success${successVisible ? ' is-visible' : ''}`}
          id="formSuccess"
          role="status"
        >
          <div className="form__success-icon">✓</div>
          <div>
            <strong>استعلام شما با موفقیت ثبت شد.</strong>
            <p>کارشناسان ارشد مهندسی شرکت در کمتر از ۲۴ ساعت کاری با شما تماس خواهند گرفت.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
