'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    reveals.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.spotlight-card'));

    const cleanups = cards.map((card) => {
      let rect: DOMRect | null = null;

      const onEnter = () => {
        rect = card.getBoundingClientRect();
      };
      const onMove = (event: MouseEvent) => {
        const current = rect ?? card.getBoundingClientRect();
        rect = current;
        card.style.setProperty('--mouse-x', `${event.clientX - current.left}px`);
        card.style.setProperty('--mouse-y', `${event.clientY - current.top}px`);
      };
      const onLeave = () => {
        rect = null;
      };

      card.addEventListener('mouseenter', onEnter, { passive: true });
      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });

      return () => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLElement>('.btn--magnetic'));

    const cleanups = buttons.map((button) => {
      const onMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      };
      const onLeave = () => {
        button.style.transform = 'translate(0, 0)';
      };

      button.addEventListener('mousemove', onMove);
      button.addEventListener('mouseleave', onLeave);

      return () => {
        button.removeEventListener('mousemove', onMove);
        button.removeEventListener('mouseleave', onLeave);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname]);

  return null;
}
