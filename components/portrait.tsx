'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/lib/use-media-query';
import styles from './portrait.module.css';

/* This is a directional portrait, not a warped single photograph. The contact
 * sheet supplies a real frame for each of eight gaze directions, so the head
 * and eyes move together like a person following the pointer. */

const directions = [
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
  'top-left',
  'top',
  'top-right',
] as const;

type Direction = (typeof directions)[number] | 'center';

const frames: Record<Direction, string> = {
  center: '/img/portrait/center.jpg',
  top: '/img/portrait/top.jpg',
  'top-right': '/img/portrait/top-right.jpg',
  right: '/img/portrait/right.jpg',
  'bottom-right': '/img/portrait/bottom-right.jpg',
  bottom: '/img/portrait/bottom.jpg',
  'bottom-left': '/img/portrait/bottom-left.jpg',
  left: '/img/portrait/left.jpg',
  'top-left': '/img/portrait/top-left.jpg',
};

const TRANSITION_MS = 130;

function directionAt(x: number, y: number, bounds: DOMRect): Direction {
  const dx = x - (bounds.left + bounds.width / 2);
  const dy = y - (bounds.top + bounds.height / 2);

  // A dead zone around the avatar stops tiny pointer movements from causing
  // the face to jitter between nearby directions.
  if (Math.hypot(dx, dy) < bounds.width * 0.35) return 'center';

  const sector = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
  return directions[(sector + directions.length) % directions.length];
}

export default function Portrait() {
  const fine = useMediaQuery('(pointer: fine)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const frame = useRef<HTMLDivElement>(null);
  const current = useRef<Direction>('center');
  const clearPrevious = useRef<number | undefined>(undefined);
  const [direction, setDirection] = useState<Direction>('center');
  const [previous, setPrevious] = useState<Direction | null>(null);
  const active = fine && !reduced;

  useEffect(() => {
    if (!active) return;

    const show = (next: Direction) => {
      if (next === current.current) return;

      setPrevious(current.current);
      current.current = next;
      setDirection(next);

      if (clearPrevious.current) window.clearTimeout(clearPrevious.current);
      clearPrevious.current = window.setTimeout(
        () => setPrevious(null),
        TRANSITION_MS,
      );
    };

    const onMove = (event: PointerEvent) => {
      const bounds = frame.current?.getBoundingClientRect();
      if (bounds) show(directionAt(event.clientX, event.clientY, bounds));
    };

    const reset = () => show('center');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', reset);
    document.addEventListener('mouseleave', reset);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', reset);
      document.removeEventListener('mouseleave', reset);
      if (clearPrevious.current) window.clearTimeout(clearPrevious.current);
    };
  }, [active]);

  // Each frame is only about 24 KB. Warm them after first paint so directional
  // changes use decoded local images rather than waiting on the network.
  useEffect(() => {
    if (!active) return;

    const preload = window.setTimeout(() => {
      Object.values(frames).forEach((src) => {
        const image = new window.Image();
        image.src = src;
      });
    }, 600);

    return () => window.clearTimeout(preload);
  }, [active]);

  const shown = active ? direction : 'center';

  return (
    <figure className={styles.figure} data-cursor="Operator">
      <div ref={frame} className={styles.frame}>
        {active && previous && (
          <Image
            src={frames[previous]}
            alt=""
            fill
            unoptimized
            sizes="168px"
            className={styles.previous}
          />
        )}
        <Image
          key={shown}
          src={frames[shown]}
          alt="Portrait of Carly Tesnor"
          fill
          unoptimized
          priority={shown === 'center'}
          sizes="168px"
          className={styles.current}
        />

        <span className={styles.tone} aria-hidden="true" />
      </div>

      <figcaption className={styles.caption}>CT // Portrait</figcaption>
    </figure>
  );
}
