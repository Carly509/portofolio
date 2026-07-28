'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { nav, site } from '@/content/site';
import { openPalette } from '@/lib/palette';
import { toggleTheme } from '@/lib/theme';
import styles from './nav.module.css';

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.bar}`}>
        {/* The mark is the way home, so it carries the active state itself. */}
        <Link
          href="/"
          className={styles.brand}
          aria-label={`${site.name} — home`}
          aria-current={pathname === '/' ? 'page' : undefined}
          data-active={pathname === '/' || undefined}
          data-cursor="Home"
          onClick={close}
        >
          CT<span className={styles.brandSigil}>://</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {nav.map((item) =>
            'external' in item && item.external ? (
              <a
                key={item.href}
                href={item.href}
                className={styles.link}
                data-cursor="Write"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                data-active={isActive(item.href) || undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
                data-cursor="Go"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className={styles.tools}>
          <button
            type="button"
            className={styles.chip}
            onClick={openPalette}
            data-cursor="Search"
          >
            <span aria-hidden="true">⌘K</span>
            <span className={styles.srOnly}>Open command palette</span>
          </button>

          <button
            type="button"
            className={styles.chip}
            onClick={toggleTheme}
            data-cursor="Switch"
            aria-label="Switch between night ops and day ops themes"
          >
            <span className={styles.pulseDot} aria-hidden="true" />
            {/* Which word shows is a CSS decision, so it is correct on the
                server, before JS, and after a system theme change. */}
            <span className="when-light" aria-hidden="true">
              Night ops
            </span>
            <span className="when-dark" aria-hidden="true">
              Day ops
            </span>
          </button>

          <button
            type="button"
            className={`${styles.chip} ${styles.menuBtn}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={styles.sheet} hidden={!open}>
        {nav.map((item, i) => {
          const index = (
            <span className={styles.sheetIndex}>
              {String(i + 1).padStart(2, '0')}
            </span>
          );

          return 'external' in item && item.external ? (
            <a
              key={item.href}
              href={item.href}
              className={styles.sheetLink}
              style={{ '--i': i } as React.CSSProperties}
              onClick={close}
            >
              {index}
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={styles.sheetLink}
              style={{ '--i': i } as React.CSSProperties}
              data-active={isActive(item.href) || undefined}
              onClick={close}
            >
              {index}
              {item.label}
            </Link>
          );
        })}

        <a
          className={styles.sheetLink}
          href={site.resume}
          target="_blank"
          rel="noopener noreferrer"
          style={{ '--i': nav.length } as React.CSSProperties}
          onClick={close}
        >
          <span className={styles.sheetIndex}>
            {String(nav.length + 1).padStart(2, '0')}
          </span>
          Resumé ↗
        </a>
      </div>
    </header>
  );
}
