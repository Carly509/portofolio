'use client';

import { useEffect, useRef } from 'react';

import { useMediaQuery } from '@/lib/use-media-query';
import styles from './grid-wave.module.css';

type Wave = { x: number; y: number; started: number };

const CELL = 44;
const SPEED = 410;
const WIDTH = 90;
const DURATION = 1100;
const MAX_WAVES = 4;
const SPAWN_INTERVAL = 70;

/* A short-lived canvas wave, not a permanent render loop. Every pointer
 * movement reveals an expanding ring of the same rectangular grid cells that
 * normally sit in the page background; after the last ring fades, the canvas
 * clears and requestAnimationFrame stops completely. */
export default function GridWave() {
  const fine = useMediaQuery('(pointer: fine)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = fine && !reduced;

  useEffect(() => {
    const element = canvas.current;
    if (!active || !element) return;

    const context = element.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let line = '';
    let waves: Wave[] = [];
    let raf = 0;
    let lastSpawn = 0;

    const colors = () => {
      const root = getComputedStyle(document.documentElement);
      line = root.getPropertyValue('--line').trim() || '#1c2433';
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      waves = waves.filter((wave) => now - wave.started < DURATION);
      context.clearRect(0, 0, width, height);

      if (waves.length === 0) {
        raf = 0;
        return;
      }

      context.lineWidth = 1;
      context.strokeStyle = line;

      // The dormant grid lives at the foot of the viewport, but pointer waves
      // can travel anywhere across the screen.
      for (let y = 0; y < height; y += CELL) {
        for (let x = 0; x < width; x += CELL) {
          let strength = 0;

          for (const wave of waves) {
            const age = (now - wave.started) / 1000;
            const radius = age * SPEED;
            const distance = Math.hypot(x - wave.x, y - wave.y);
            const delta = Math.abs(distance - radius);

            if (delta < WIDTH) {
              const ring = 1 - delta / WIDTH;
              const fade = 1 - age / (DURATION / 1000);
              strength = Math.max(strength, ring * ring * fade);
            }
          }

          if (strength > 0.035) {
            context.globalAlpha = strength * 0.9;
            // Half-pixel alignment keeps the one-pixel rules crisp on a
            // high-density canvas, just like the CSS grid at rest.
            context.strokeRect(x + 0.5, y + 0.5, CELL, CELL);
          }
        }
      }

      context.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (raf === 0) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;

      const now = performance.now();
      if (now - lastSpawn < SPAWN_INTERVAL) return;
      lastSpawn = now;
      colors();
      waves.push({ x: event.clientX, y: event.clientY, started: now });
      waves = waves.slice(-MAX_WAVES);
      wake();
    };

    const onVisibility = () => {
      if (!document.hidden) return;
      waves = [];
      cancelAnimationFrame(raf);
      raf = 0;
      context.clearRect(0, 0, width, height);
    };

    colors();
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />;
}
