import type { ReactNode } from 'react';
import styles from './page-header.module.css';

export default function PageHeader({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  // The full stop is the accent — split it off so CSS can paint it magenta.
  const stops = title.endsWith('.');
  const word = stops ? title.slice(0, -1) : title;

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div>
          {eyebrow && <p className={`label ${styles.eyebrow}`}>{eyebrow}</p>}
          <h1 className={`glitch ${styles.title}`}>
            <span>
              {word}
              {stops && <em className={styles.stop}>.</em>}
            </span>
          </h1>
        </div>
        {aside && <div className={styles.aside}>{aside}</div>}
      </div>
      {children && <div className={styles.intro}>{children}</div>}
    </header>
  );
}
