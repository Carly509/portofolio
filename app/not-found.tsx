import Link from 'next/link';

import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={`shell ${styles.page}`}>
      <p className="label">
        Error <b className={styles.code}>404</b> — carrier not found
      </p>
      <h1 className={`glitch ${styles.title}`}>
        <span>Signal</span>
        <span>lost.</span>
      </h1>
      <p className={styles.body}>
        This frequency isn&apos;t broadcasting. The page may have moved when
        the site was rebuilt — the work and the writing are both still
        transmitting.
      </p>
      <div className={styles.links}>
        <Link href="/work" data-cursor="See all">
          See the work →
        </Link>
        <Link href="/" data-cursor="Home">
          Back to the index →
        </Link>
      </div>
    </div>
  );
}
