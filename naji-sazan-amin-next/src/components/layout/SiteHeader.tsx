'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { lockBodyScroll, unlockBodyScroll } from '@/lib/scroll-lock';
import { NAV_ITEMS, SITE } from '@/lib/site';

import { Drawer } from './Drawer';

function normalizePath(path: string) {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function SiteHeader() {
  const pathname = normalizePath(usePathname());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 28);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    lockBodyScroll();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockBodyScroll();
    };
  }, [drawerOpen]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('nsa-theme', next);
  };

  const ctaHref = pathname === '/contact' ? '#form' : '/contact';

  return (
    <>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'} id="siteHeader">
        <div className="container site-header__inner">
          <Link className="brand" href="/" aria-label={SITE.brandAria} prefetch={false}>
            <img className="brand__logo" src="/assets/logo.png" alt={SITE.logoAlt} />
            <span className="brand__text">
              <span className="brand__name">{SITE.name}</span>
              <span className="brand__sub">{SITE.tagline}</span>
            </span>
          </Link>
          <nav className="nav" aria-label={SITE.navAria}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                className={normalizePath(item.href) === pathname ? 'nav__link is-active' : 'nav__link'}
                href={item.href}
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" type="button" id="themeToggle" aria-label={SITE.themeLabel} onClick={toggleTheme}>
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>
            <Link className="btn btn--primary" href={ctaHref} prefetch={false}>
              {SITE.ctaLabel}
            </Link>
            <button
              className="menu-btn"
              type="button"
              id="menuBtn"
              aria-label={SITE.menuLabel}
              aria-expanded={drawerOpen}
              aria-controls="drawer"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
