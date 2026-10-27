'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { useProjectModal } from '@/components/layout/ProjectModalContext';
import { ResponsiveImage } from '@/components/shared/ResponsiveImage';
import { GALLERY_PROJECTS } from '@/lib/gallery';

const ANGLE_STEP = 30;

type ItemState = {
  opacity: string;
  pointerEvents: 'auto' | 'none';
};

function itemState(angle: number): ItemState {
  let diff = angle % 360;
  if (diff < 0) diff += 360;
  const distance = Math.abs(diff <= 180 ? diff : 360 - diff);

  return {
    opacity: Math.max(0.18, 1 - (distance / 180) * 1.08).toFixed(3),
    pointerEvents: distance < 65 ? 'auto' : 'none',
  };
}

export function CircularGallery() {
  const { openGalleryItem } = useProjectModal();
  const stageRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rotator = rotatorRef.current;
    if (!stage || !rotator) return;
    const items = itemRefs.current.filter((item): item is HTMLDivElement => item !== null);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = media.matches;
    let currentAngle = 0;
    let targetAngle = 0;
    let autoRotating = true;
    let visible = false;
    let frame: number | null = null;
    let lastScrollY = window.scrollY;
    let lastAppliedAngle = -9999;

    const applyItems = (angle: number) => {
      items.forEach((item, index) => {
        const state = itemState(angle + index * ANGLE_STEP);
        item.style.opacity = state.opacity;
        item.style.pointerEvents = state.pointerEvents;
      });
    };

    const applyAngle = (angle: number) => {
      rotator.style.transform = `rotateY(${angle}deg)`;
    };

    const tick = () => {
      if (!visible) {
        frame = null;
        return;
      }

      if (autoRotating && !reduced) {
        targetAngle -= 0.12;
      }

      currentAngle += (targetAngle - currentAngle) * 0.1;
      applyAngle(currentAngle);

      if (Math.abs(currentAngle - lastAppliedAngle) > 0.45) {
        lastAppliedAngle = currentAngle;
        applyItems(currentAngle);
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || frame !== null) return;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    applyAngle(currentAngle);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === 'undefined') {
      visible = true;
      start();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible) {
              lastScrollY = window.scrollY;
              start();
            } else {
              stop();
            }
          });
        },
        { rootMargin: '100px' },
      );
      observer.observe(stage);
    }

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (!visible) {
        lastScrollY = scrollY;
        return;
      }
      const delta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      if (!reduced) {
        targetAngle -= delta * 0.12;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onEnter = () => {
      autoRotating = false;
    };
    const onLeave = () => {
      autoRotating = true;
    };
    stage.addEventListener('mouseenter', onEnter);
    stage.addEventListener('mouseleave', onLeave);

    const step = (delta: number) => {
      targetAngle += delta;
      if (reduced) {
        currentAngle = targetAngle;
        lastAppliedAngle = currentAngle;
        applyAngle(currentAngle);
        applyItems(currentAngle);
      }
      start();
    };

    const onPrev = () => step(ANGLE_STEP);
    const onNext = () => step(-ANGLE_STEP);
    const prev = prevRef.current;
    const next = nextRef.current;
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);

    const onMotionChange = () => {
      reduced = media.matches;
      if (reduced) {
        stop();
      } else if (visible) {
        start();
      }
    };
    media.addEventListener('change', onMotionChange);

    return () => {
      observer?.disconnect();
      stop();
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('mouseenter', onEnter);
      stage.removeEventListener('mouseleave', onLeave);
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      media.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <section className="circular-gallery-section" id="projectsShowcase">
      <div className="circular-gallery-header">
        <h2 className="h-2 reveal" data-delay="1">
          برگزیده‌ای از پروژه‌ها و آمار عملکرد
        </h2>
        <p className="lead reveal" data-delay="2">
          ترکیبی از طرح‌های سه‌بعدی معماری، مدلسازی سازه و تصاویر واقعی کارگاه‌های نظارتی در سراسر کشور.
        </p>
      </div>

      <div
        ref={stageRef}
        className="circular-gallery-stage"
        id="circularGalleryStage"
        role="region"
        aria-label="گالری سه‌بعدی پروژه‌ها"
      >
        <div ref={rotatorRef} className="circular-gallery-rotator" id="circularGalleryRotator">
          {GALLERY_PROJECTS.map((project, index) => {
            const state = itemState(index * ANGLE_STEP);
            return (
              <div
                key={project.id}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className="circular-gallery-item"
                data-index={index}
                style={{
                  transform: `rotateY(${index * ANGLE_STEP}deg) translateZ(var(--gallery-radius))`,
                  opacity: state.opacity,
                  pointerEvents: state.pointerEvents,
                }}
              >
                <div
                  className="circular-gallery-card"
                  data-project={project.id}
                  tabIndex={0}
                  role="button"
                  aria-label={project.title}
                  onClick={() => openGalleryItem(project.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openGalleryItem(project.id);
                    }
                  }}
                >
                  <ResponsiveImage
                    className="circular-gallery-img"
                    src={project.image}
                    alt={project.title}
                    width={290}
                    height={400}
                    widths={[290, 580]}
                    sizes="290px"
                  />
                  <div className="circular-gallery-scrim">
                    <h3 className="circular-gallery-title">{project.title}</h3>
                    <div className="circular-gallery-loc">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{project.loc}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="circular-gallery-controls">
        <button
          ref={prevRef}
          type="button"
          className="circular-ctrl-btn"
          id="circularPrevBtn"
          aria-label="پروژه قبلی"
          title="پروژه قبلی"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <button
          ref={nextRef}
          type="button"
          className="circular-ctrl-btn"
          id="circularNextBtn"
          aria-label="پروژه بعدی"
          title="پروژه بعدی"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      <div className="text-center mt-6 reveal">
        <Link className="btn btn--outline btn--lg" href="/projects">
          مشاهده مشخصات و آرشیو کامل پروژه‌ها
        </Link>
      </div>
    </section>
  );
}
