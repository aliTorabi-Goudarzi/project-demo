'use client';

import { useEffect, useRef } from 'react';

import { lockBodyScroll, unlockBodyScroll } from '@/lib/scroll-lock';

import { useProjectModal } from './ProjectModalProvider';

export function ProjectModal() {
  const { activeItem, close } = useProjectModal();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activeItem) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockBodyScroll();
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockBodyScroll();
      previousFocusRef.current?.focus();
    };
  }, [activeItem, close]);

  return (
    <div
      className={activeItem ? 'modal is-open' : 'modal'}
      id="projectModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal__dialog">
        <div className="modal__media-wrapper">
          <div className="modal__media" id="modalMedia">
            {activeItem && (
              <img src={activeItem.image} alt={activeItem.title} loading="lazy" decoding="async" width={800} height={600} />
            )}
          </div>
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
        </div>
        <div className="modal__body">
          <h3 className="modal__title" id="modalTitle">
            {activeItem ? activeItem.title : '—'}
          </h3>
          <dl className="modal__meta">
            <div>
              <dt>کارفرما</dt>
              <dd id="modalClient">{activeItem ? activeItem.client : '—'}</dd>
            </div>
            <div>
              <dt>محل</dt>
              <dd id="modalLocation">{activeItem ? activeItem.location : '—'}</dd>
            </div>
            <div>
              <dt>سال</dt>
              <dd id="modalYear">{activeItem ? activeItem.year : '—'}</dd>
            </div>
            <div>
              <dt>دسته</dt>
              <dd id="modalCategory">{activeItem ? activeItem.category : '—'}</dd>
            </div>
          </dl>
          <p id="modalDesc">{activeItem ? activeItem.description : '—'}</p>
        </div>
      </div>
    </div>
  );
}
