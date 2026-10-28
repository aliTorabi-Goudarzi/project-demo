'use client';

import { useEffect, useRef, useState } from 'react';

const faNumber = new Intl.NumberFormat('fa-IR', { useGrouping: false });

type AnimatedStatProps = {
  value: number;
  prefix?: string;
  suffix?: string;
};

export function AnimatedStat({ value, prefix = '', suffix = '' }: AnimatedStatProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || animatedRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        animatedRef.current = true;
        setDisplay(0);
        const duration = 1200;
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(Math.max((now - startedAt) / duration, 0), 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.max(0, Math.round(eased * value)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      // Start the count just before the ribbon enters the viewport, so the
      // server-rendered final figure never flashes and then drops to zero.
      { threshold: 0.35, rootMargin: '0px 0px 200px 0px' },
    );

    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [value]);

  return (
    <span
      ref={nodeRef}
      className="stats-card__num"
      aria-label={`${prefix}${faNumber.format(value)}${suffix}`}
    >
      {prefix && <span className="stats-card__prefix">{prefix}</span>}
      <span className="stats-card__value">{faNumber.format(display)}</span>
      {suffix && <span className="stats-card__suffix">{suffix}</span>}
    </span>
  );
}
