'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS, SITE } from '@/lib/site';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function Drawer({ open, onClose }: DrawerProps) {
  const pathname = normalizePath(usePathname());

  return (
    <div className={open ? 'drawer is-open' : 'drawer'} id="drawer" aria-hidden={!open}>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          className={normalizePath(item.href) === pathname ? 'drawer__link is-active' : 'drawer__link'}
          href={item.href}
          prefetch={false}
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
      <Link className="btn btn--primary btn--block" href="/contact" prefetch={false} onClick={onClose}>
        {SITE.ctaLabel}
      </Link>
    </div>
  );
}
