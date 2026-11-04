'use client';

import { useState, type ReactNode } from 'react';

type CollapsibleTextProps = {
  children: ReactNode;
};

/**
 * The client asked for the long About texts to collapse on phones: a
 * one-to-two sentence preview stays visible and the rest opens behind an
 * accordion toggle. The clamping itself is pure CSS (the static HTML already
 * renders collapsed on phones — no hydration flash); the button only flips a
 * class. On desktop the toggle is hidden and the approved full-text layout is
 * untouched.
 */
export function CollapsibleText({ children }: CollapsibleTextProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={open ? 'text-accordion is-open' : 'text-accordion'}>
      <div className="text-accordion__body">
        <div className="text-accordion__clip">{children}</div>
      </div>
      <button
        type="button"
        className="text-accordion__toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'بستن' : 'ادامه مطلب'}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
