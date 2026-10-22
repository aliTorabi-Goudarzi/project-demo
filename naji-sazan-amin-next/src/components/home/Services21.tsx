'use client';

import Link from 'next/link';
import { useEffect, useReducer, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { SERVICES } from '@/lib/services';

const AUTOPLAY_MS = 5000;
const FADE_MS = 150;

type PauseField = 'hovered' | 'focused' | 'hidden';

type PauseState = {
  hovered: boolean;
  focused: boolean;
  hidden: boolean;
  resume: number;
};

const INITIAL_PAUSE_STATE: PauseState = {
  hovered: false,
  focused: false,
  hidden: false,
  resume: 0,
};

function pauseReducer(state: PauseState, action: { field: PauseField; value: boolean }): PauseState {
  if (state[action.field] === action.value) return state;
  const next: PauseState = { ...state, [action.field]: action.value };
  const wasPaused = state.hovered || state.focused || state.hidden;
  const isPaused = next.hovered || next.focused || next.hidden;
  if (wasPaused && !isPaused) next.resume = state.resume + 1;
  return next;
}

export function Services21() {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [pause, dispatchPause] = useReducer(pauseReducer, INITIAL_PAUSE_STATE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const fadeTimer = useRef<number | null>(null);
  const paused = pause.hovered || pause.focused || pause.hidden;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener('change', syncMotion);

    const syncVisibility = () => dispatchPause({ field: 'hidden', value: document.hidden });
    syncVisibility();
    document.addEventListener('visibilitychange', syncVisibility);

    return () => {
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (fadeTimer.current !== null) {
        window.clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % SERVICES.length;
      if (fadeTimer.current !== null) {
        window.clearTimeout(fadeTimer.current);
        fadeTimer.current = null;
      }
      setActive(next);
      if (reducedMotion) {
        setDisplayed(next);
        return;
      }
      fadeTimer.current = window.setTimeout(() => {
        fadeTimer.current = null;
        setDisplayed(next);
      }, FADE_MS);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, cycle, paused, pause.resume, reducedMotion]);

  const select = (index: number) => {
    if (fadeTimer.current !== null) {
      window.clearTimeout(fadeTimer.current);
      fadeTimer.current = null;
    }
    setActive(index);
    setCycle((current) => current + 1);
    if (reducedMotion) {
      setDisplayed(index);
      return;
    }
    fadeTimer.current = window.setTimeout(() => {
      fadeTimer.current = null;
      setDisplayed(index);
    }, FADE_MS);
  };

  const current = SERVICES[displayed];

  return (
    <section className="section section--services" id="services">
      <div className="container">
        <div className="svc21 reveal" style={{ '--svc21-dur': `${AUTOPLAY_MS / 1000}s` } as CSSProperties}>
          <header className="svc21__head">
            <h2 className="h-2">چهار حوزه تخصصی، یک تیم یکپارچه</h2>
            <p>
              از مطالعات اولیه تا تحویل نهایی در کنار شما هستیم. خدمات ما بر پایه استانداردهای ملی و بین‌المللی ارائه
              می‌شود.
            </p>
          </header>

          <div className="svc21__layout">
            <ul
              className={paused ? 'svc21__list is-paused' : 'svc21__list'}
              id="svc21List"
              onMouseEnter={() => dispatchPause({ field: 'hovered', value: true })}
              onMouseLeave={() => dispatchPause({ field: 'hovered', value: false })}
              onFocus={() => dispatchPause({ field: 'focused', value: true })}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  dispatchPause({ field: 'focused', value: false });
                }
              }}
            >
              {SERVICES.map((service, index) => (
                <li key={service.id}>
                  <button
                    type="button"
                    className={index === active ? 'svc21__item is-active' : 'svc21__item'}
                    onClick={() => select(index)}
                    onFocus={() => select(index)}
                  >
                    <span className="svc21__item-title">{service.title}</span>
                    <span className="svc21__bar" aria-hidden="true">
                      <span key={`${service.id}-${active}-${cycle}-${pause.resume}`} className="svc21__bar-fill" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="svc21__preview">
              <div className="svc21__media">
                <img
                  id="svc21Img"
                  className={active !== displayed ? 'is-fading' : undefined}
                  src={current.img}
                  alt={current.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="svc21__cap">
                <h3 className="svc21__cap-title h-3" id="svc21Title">
                  {current.title}
                </h3>
                <p className="svc21__cap-desc" id="svc21Desc">
                  {current.desc}
                </p>
                <Link className="svc21__cap-link" id="svc21Link" href={current.href} prefetch={false}>
                  {current.link}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
