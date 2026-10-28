'use client';

import { useEffect, useRef, useState } from 'react';

import { ResponsiveImage, imageVariant } from '@/components/shared/ResponsiveImage';
import { trapTabKey } from '@/lib/focus';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/scroll-lock';

import { useProjectModal } from './ProjectModalContext';

export function ProjectModal() {
  const { activeItem, close } = useProjectModal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastItem, setLastItem] = useState(activeItem);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  if (lastItem !== activeItem) {
    setLastItem(activeItem);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (!activeItem) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockBodyScroll();
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      }
      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => Math.min(index + 1, (activeItem.images.length ?? 1) - 1));
        return;
      }
      if (dialogRef.current) trapTabKey(event, dialogRef.current);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockBodyScroll();
      previousFocusRef.current?.focus();
    };
  }, [activeItem, close]);

  const images = activeItem?.images ?? [];
  const safeIndex = images.length ? Math.min(activeIndex, images.length - 1) : 0;
  const currentImage = images[safeIndex];
  const hasMultiple = images.length > 1;

  const step = (direction: -1 | 1) => {
    setActiveIndex((index) => {
      const next = index + direction;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <div
      ref={dialogRef}
      className={activeItem ? 'modal is-open' : 'modal'}
      id="projectModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-hidden={!activeItem}
      inert={!activeItem}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal__dialog">
        <div className="modal__media-wrapper">
          <div className="modal__media" id="modalMedia">
            {activeItem && currentImage && (
              <ResponsiveImage
                src={currentImage}
                alt={activeItem.title}
                width={800}
                height={600}
                widths={[600, 800]}
                sizes="(max-width: 700px) 100vw, 560px"
              />
            )}
          </div>
          {hasMultiple && (
            <>
              <button
                type="button"
                className="modal__nav modal__nav--prev"
                aria-label="تصویر قبلی"
                title="تصویر قبلی"
                onClick={() => step(-1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <button
                type="button"
                className="modal__nav modal__nav--next"
                aria-label="تصویر بعدی"
                title="تصویر بعدی"
                onClick={() => step(1)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            </>
          )}
          <button
            ref={closeButtonRef}
            className="modal__close"
            id="modalClose"
            type="button"
            aria-label="بستن"
            title="بستن"
            onClick={close}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          {hasMultiple && (
            <div className="modal__counter" aria-live="polite">
              {new Intl.NumberFormat('fa-IR').format(safeIndex + 1)} / {new Intl.NumberFormat('fa-IR').format(images.length)}
            </div>
          )}
        </div>

        {hasMultiple && (
          <div className="modal__thumbs" role="group" aria-label="تصاویر پروژه">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={index === safeIndex ? 'modal__thumb is-active' : 'modal__thumb'}
                aria-label={`تصویر ${new Intl.NumberFormat('fa-IR').format(index + 1)}`}
                aria-pressed={index === safeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={imageVariant(image, 290, 'webp')}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}

        <div className="modal__body">
          <h3 className="modal__title" id="modalTitle">
            {activeItem ? activeItem.title : '—'}
          </h3>
          <dl className="modal__meta">
            <div>
              <dt>خدمات</dt>
              <dd id="modalService">{activeItem ? activeItem.service : '—'}</dd>
            </div>
            <div>
              <dt>نوع</dt>
              <dd id="modalType">{activeItem ? activeItem.type : '—'}</dd>
            </div>
            <div>
              <dt>محل</dt>
              <dd id="modalLocation">{activeItem ? activeItem.location || '—' : '—'}</dd>
            </div>
          </dl>
          {activeItem?.scope ? <p className="modal__scope">{activeItem.scope}</p> : null}
          <p id="modalDesc">{activeItem ? activeItem.description : '—'}</p>
        </div>
      </div>
    </div>
  );
}
