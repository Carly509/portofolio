'use client';

import { useEffect, useRef } from 'react';

import styles from './telemetry.module.css';

/* The telemetry bar — a fixed console strip at the foot of the viewport:
 * local time, scroll depth, pointer coordinates, current ops mode, and a
 * pulsing SYS.OK. Values are written straight to the DOM (no re-render per
 * frame), and the ops-mode label is picked by CSS so it is right on the
 * server, before JS, and after a system theme change. */
export default function Telemetry() {
  const time = useRef<HTMLSpanElement>(null);
  const scroll = useRef<HTMLSpanElement>(null);
  const x = useRef<HTMLSpanElement>(null);
  const y = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pad = (n: number, l = 2) => String(n).padStart(l, '0');

    const clock = () => {
      const d = new Date();
      time.current?.replaceChildren(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      );
    };
    clock();
    const interval = setInterval(clock, 1000);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(Math.round((window.scrollY / max) * 100), 100) : 0;
      scroll.current?.replaceChildren(`${pad(pct, 3)}%`);
    };
    onScroll();

    const onMove = (e: PointerEvent) => {
      x.current?.replaceChildren(pad(e.clientX, 4));
      y.current?.replaceChildren(pad(e.clientY, 4));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className={styles.bar} aria-hidden="true">
      <span className={styles.brand}>CT://SIGNAL</span>
      <span>
        TIME{' '}
        <b ref={time} className="tabular">
          --:--:--
        </b>
      </span>
      <span className={styles.optional}>
        SCROLL{' '}
        <b ref={scroll} className="tabular">
          000%
        </b>
      </span>
      <span className={styles.optional}>
        X<b ref={x} className="tabular">0000</b> Y
        <b ref={y} className="tabular">0000</b>
      </span>
      <span className={styles.spacer} />
      <span className={`when-light ${styles.optional}`}>DAY OPS</span>
      <span className={`when-dark ${styles.optional}`}>NIGHT OPS</span>
      <span className={styles.ok}>SYS.OK</span>
    </div>
  );
}
