'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { normalizePath } from '@/lib/path';
import { NAV_ITEMS, SITE } from '@/lib/site';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function Drawer({ open, onClose }: DrawerProps) {
  const pathname = normalizePath(usePathname());
  const ctaHref = pathname === '/contact' ? '#form' : '/contact';

  return (
    <div className={open ? 'drawer is-open' : 'drawer'} id="drawer" aria-hidden={!open} inert={!open}>
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
      <Link className="btn btn--primary btn--block" href={ctaHref} prefetch={false} onClick={onClose}>
        {SITE.ctaLabel}
      </Link>
    </div>
  );
}
