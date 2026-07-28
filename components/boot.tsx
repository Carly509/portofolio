'use client';

import { useEffect, useRef } from 'react';

import { useMediaQuery } from '@/lib/use-media-query';
import styles from './boot.module.css';

const LINES = ['> establishing uplink', '> signal locked_'];
const STORAGE_KEY = 'signal.booted';

/* The boot sequence. Two console lines type out, then `booted` lands on
 * <body> and the hero's channel-split converges into register. It runs once
 * per session — a console that re-boots on every visit is a console with a
 * fault — and reduced-motion skips straight to the final frame.
 *
 * No-JS and SSR render only the caret; the hero title has its own CSS-only
 * animation path, so nothing anywhere waits on this script. */
export default function Boot() {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = text.current;
    if (!el) return;

    const booted =
      reduced ||
      (() => {
        try {
          return sessionStorage.getItem(STORAGE_KEY) === '1';
        } catch {
          return false;
        }
      })();

    const finish = () => {
      el.textContent = LINES.join('\n');
      document.body.classList.add('booted');
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // Storage blocked — the boot simply plays again next visit.
      }
    };

    if (booted) {
      finish();
      return;
    }

    let line = 0;
    let char = 0;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      // Completed lines plus the partial current one.
      el.textContent = LINES.slice(0, line)
        .concat(LINES[line].slice(0, char))
        .join('\n');

      char += 1;
      if (char > LINES[line].length) {
        line += 1;
        char = 0;
      }

      if (line >= LINES.length) {
        timer = setTimeout(finish, 140);
      } else {
        timer = setTimeout(type, line === 0 ? 34 : 22);
      }
    };

    timer = setTimeout(type, 240);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <p className={styles.boot} aria-label="System ready">
      <span ref={text} />
      <span className={styles.caret} aria-hidden="true" />
    </p>
  );
}
