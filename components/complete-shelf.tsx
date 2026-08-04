'use client';

import { useEffect, useRef, useState } from 'react';

import type { Book } from '@/content/books';
import { CompleteShelfEngine, type ShelfMode } from '@/lib/complete-shelf-engine';
import styles from './complete-shelf.module.css';

type CompleteShelfProps = {
  books: Book[];
};

export default function CompleteShelf({ books }: CompleteShelfProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CompleteShelfEngine | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<ShelfMode>('browse');
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('Assembling the shelf');

  useEffect(() => {
    if (!canvasRef.current || books.length === 0) return;
    let engine: CompleteShelfEngine | null = null;
    let unavailableFrame: number | null = null;

    try {
      engine = new CompleteShelfEngine(canvasRef.current, books, {
        onActiveIndex: setActiveIndex,
        onMode: (nextMode, index) => {
          setMode(nextMode);
          setSelectedIndex(index);
        },
        onReady: () => setReady(true),
        onStatus: setStatus,
      });
      engineRef.current = engine;
    } catch {
      unavailableFrame = requestAnimationFrame(() => {
        setStatus('WebGL is unavailable in this browser');
      });
    }

    return () => {
      if (unavailableFrame !== null) cancelAnimationFrame(unavailableFrame);
      engine?.dispose();
      engineRef.current = null;
    };
  }, [books]);

  const activeBook = books[activeIndex];
  const selectedBook = selectedIndex === null ? null : books[selectedIndex];
  const focused = mode !== 'browse';

  return (
    <div className={`${styles.experience} ${ready ? styles.ready : ''} ${focused ? styles.focused : ''}`}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="application"
        tabIndex={0}
        aria-label={`Interactive three-dimensional shelf of ${books.length} books. Drag or use arrow keys to browse, then press Enter to inspect a book.`}
      />

      <div className={styles.header} aria-hidden="true">
        <span>CARLY&apos;S SHELF</span>
        <span>{books.length} VOLUMES / TEMPORARY EDITION</span>
      </div>

      <section className={styles.caption} aria-hidden={focused}>
        <p className={styles.position}>
          {String(activeIndex + 1).padStart(2, '0')}
          <i />
          {String(books.length).padStart(2, '0')}
        </p>
        <h3>{activeBook?.shortTitle}</h3>
        <p className={styles.author}>{activeBook?.author}</p>
        <button type="button" className={styles.inspect} onClick={() => engineRef.current?.focusBook(activeIndex)} data-cursor="Inspect">
          Inspect volume <span aria-hidden="true">↗</span>
        </button>
      </section>

      <button
        type="button"
        className={`${styles.arrow} ${styles.previous}`}
        aria-label="Previous book"
        disabled={focused || activeIndex === 0}
        onClick={() => engineRef.current?.browseBy(-1)}
        data-cursor="Previous"
      >
        ←
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        aria-label="Next book"
        disabled={focused || activeIndex === books.length - 1}
        onClick={() => engineRef.current?.browseBy(1)}
        data-cursor="Next"
      >
        →
      </button>

      <nav className={styles.index} aria-label="Book position">
        <div className={styles.ticks}>
          {books.map((book, index) => (
            <button
              key={book.id}
              type="button"
              className={index === activeIndex ? styles.activeTick : undefined}
              aria-label={`Browse to ${book.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              disabled={focused}
              onClick={() => engineRef.current?.browseTo(index)}
              data-cursor="Browse"
            />
          ))}
        </div>
        <span>DRAG / SCROLL / ARROW KEYS</span>
      </nav>

      {selectedBook && (
        <aside className={styles.details} aria-label={`Details for ${selectedBook.title}`}>
          <button type="button" className={styles.back} onClick={() => engineRef.current?.returnToShelf()} data-cursor="Return">
            ← Return to shelf
          </button>
          <p className={styles.detailPosition}>
            {String(selectedIndex! + 1).padStart(2, '0')} / {String(books.length).padStart(2, '0')}
          </p>
          <h3>{selectedBook.title}</h3>
          <p className={styles.detailAuthor}>{selectedBook.author}</p>
          <p className={styles.description}>{selectedBook.description}</p>
          <blockquote>{selectedBook.quote}</blockquote>
          <button type="button" className={styles.reset} onClick={() => engineRef.current?.resetFocusView()}>
            Reset view
          </button>
        </aside>
      )}

      <p className={styles.status} role="status" aria-live="polite">{status}</p>
      {!ready && <div className={styles.loading} aria-hidden="true">Assembling {books.length} volumes</div>}
    </div>
  );
}
