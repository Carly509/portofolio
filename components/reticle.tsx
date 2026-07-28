'use client';

import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/lib/use-media-query';
import styles from './reticle.module.css';

/* The targeting reticle.
 *
 * The print shop's registration crosshair, translated to a display: a
 * targeting ring with slowly rotating ticks. Over anything interactive it
 * corner-locks — snaps to the element's nearest corner — and names the
 * target in brackets, the way a scope names what it has acquired.
 *
 * Precise pointers only. Touch and no-JS keep the system cursor, and
 * reduced-motion drops the lag so it tracks 1:1. */

const SNAP_RADIUS = 46;
const LERP = 0.22;

export default function Reticle() {
  const fine = useMediaQuery('(pointer: fine)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  const root = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!fine) return;

    document.body.classList.add('has-reticle');

    // target = where the pointer (or snap point) is; current = where the
    // reticle has got to.
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let shown = false;

    const el = () => root.current;

    const draw = () => {
      el()?.style.setProperty('transform', `translate(${cx}px, ${cy}px)`);
    };

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        el()?.style.setProperty('opacity', '1');
      }

      const hit = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-cursor]',
      );

      if (hit) {
        setLabel(hit.dataset.cursor || '');

        // Corner-lock, but only once the pointer is genuinely near a corner —
        // otherwise it feels magnetic from across the room.
        const r = hit.getBoundingClientRect();
        let best: [number, number] | null = null;
        let bestDist = SNAP_RADIUS;

        for (const [x, y] of [
          [r.left, r.top],
          [r.right, r.top],
          [r.left, r.bottom],
          [r.right, r.bottom],
        ] as [number, number][]) {
          const d = Math.hypot(x - e.clientX, y - e.clientY);
          if (d < bestDist) {
            bestDist = d;
            best = [x, y];
          }
        }

        if (best) {
          [tx, ty] = best;
          el()?.setAttribute('data-snapped', 'true');
        } else {
          tx = e.clientX;
          ty = e.clientY;
          el()?.removeAttribute('data-snapped');
        }
        el()?.setAttribute('data-active', 'true');
      } else {
        tx = e.clientX;
        ty = e.clientY;
        setLabel('');
        el()?.removeAttribute('data-active');
        el()?.removeAttribute('data-snapped');
      }

      if (reduced) {
        cx = tx;
        cy = ty;
        draw();
      }
    };

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onDown = () => el()?.setAttribute('data-down', 'true');
    const onUp = () => el()?.removeAttribute('data-down');
    const onLeave = () => {
      shown = false;
      el()?.style.setProperty('opacity', '0');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);

    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-reticle');
    };
  }, [fine, reduced]);

  if (!fine) return null;

  return (
    <div ref={root} className={styles.root} aria-hidden="true">
      <span className={styles.ticks} />
      <span className={styles.ring} />
      <span className={styles.dot} />
      <span className={styles.tag} data-show={!!label || undefined}>
        {label}
      </span>
    </div>
  );
}
