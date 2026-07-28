import type { ReactNode } from 'react';
import styles from './prose.module.css';

/* Ruby keywords get the magenta plate, comments go graphite. Hand-marked
 * rather than tokenised — there are two languages on this site, not twenty,
 * and a highlighter would be a dependency and a bundle for no gain. */
export function Kw({ children }: { children: ReactNode }) {
  return <span className={styles.kw}>{children}</span>;
}

export function Cm({ children }: { children: ReactNode }) {
  return <span className={styles.cm}>{children}</span>;
}

export function CodeBlock({
  label,
  cost,
  tone,
  children,
}: {
  label: string;
  cost?: string;
  tone?: 'bad' | 'good';
  children: ReactNode;
}) {
  return (
    <div className={styles.block} data-tone={tone}>
      <div className={styles.blockHead}>
        <span>{label}</span>
        {cost && <span className={styles.cost}>{cost}</span>}
      </div>
      <pre className={styles.pre} tabIndex={0}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function CodeCompare({ children }: { children: ReactNode }) {
  return <div className={styles.compare}>{children}</div>;
}

export function CodeSingle({ children }: { children: ReactNode }) {
  return <div className={styles.single}>{children}</div>;
}
