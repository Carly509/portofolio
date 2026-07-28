'use client';

import { useEffect } from 'react';

/* Scroll reveal. `.rise` elements start hidden (only under html.js — without
 * JS nothing is ever hidden) and get `.in` the first time they enter the
 * viewport. A MutationObserver re-scans after client-side navigation, so
 * pages rendered later are covered without any per-page wiring. */
export default function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const scan = () => {
      document
        .querySelectorAll('.rise:not(.in)')
        .forEach((el) => io.observe(el));
    };

    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
