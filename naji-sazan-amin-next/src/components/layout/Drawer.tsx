'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { getFocusableElements, trapTabKey } from '@/lib/focus';
import { normalizePath } from '@/lib/path';
import { NAV_ITEMS, SITE } from '@/lib/site';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function Drawer({ open, onClose }: DrawerProps) {
  const pathname = normalizePath(usePathname());
  const drawerRef = useRef<HTMLDivElement>(null);
  const ctaHref = pathname === '/contact' ? '#form' : '/contact';

  useEffect(() => {
    if (!open) return;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = drawerRef.current;
    if (container) getFocusableElements(container)[0]?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  return (
    <div
      ref={drawerRef}
      className={open ? 'drawer is-open' : 'drawer'}
      id="drawer"
      role="dialog"
      aria-modal="true"
      aria-label={SITE.navAria}
      aria-hidden={!open}
      inert={!open}
      onKeyDown={(event) => {
        if (drawerRef.current) trapTabKey(event.nativeEvent, drawerRef.current);
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          className={normalizePath(item.href) === pathname ? 'drawer__link is-active' : 'drawer__link'}
          href={item.href}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
      <Link className="btn btn--primary btn--block" href={ctaHref} onClick={onClose}>
        {SITE.ctaLabel}
      </Link>
    </div>
  );
}
