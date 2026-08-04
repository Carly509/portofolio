import type { Metadata } from 'next';
import Link from 'next/link';

import PageHeader from '@/components/page-header';
import CompleteShelf from '@/components/complete-shelf';
import { books } from '@/content/books';
import { articles, formatDate } from '@/content/writing';
import styles from './writing.module.css';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Notes on the things I had to work out the hard way — Rails performance, mobile architecture, and shipping small.',
  alternates: { canonical: '/writing' },
};

export default function WritingPage() {
  return (
    <div className={`shell ${styles.page}`}>
      <PageHeader title="Writing.">
        <p>
          Notes on the things I had to work out the hard way. Written when I have
          something to say rather than on a schedule, which is why there is one
          of them.
        </p>
      </PageHeader>

      <ul className={styles.list}>
        {articles.map((article, i) => (
          <li
            key={article.slug}
            className={`${styles.item} rise`}
            style={{ '--i': i } as React.CSSProperties}
          >
            <Link
              href={`/writing/${article.slug}`}
              className={styles.link}
              data-cursor="Read"
            >
              <span className={`label ${styles.date} tabular`}>
                <b>TX-{String(i + 1).padStart(3, '0')}</b>
                <br />
                {formatDate(article.date)}
              </span>
              <span className={styles.body}>
                <span className={styles.title}>{article.title}</span>
                <span className={styles.dek}>{article.dek}</span>
                <span className={styles.tags}>
                  {article.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
              <span className={`label ${styles.time}`}>
                {article.readingTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className={styles.recommendations} aria-labelledby="books-heading">
        <div className={styles.recommendationHead}>
          <p className="label">READING RECOMMENDATIONS // OPEN SHELF</p>
          <h2 id="books-heading">Books worth losing a weekend to.</h2>
          <p>
            A growing list of books worth passing on. Drag, scroll, or use the
            arrow keys to browse, then inspect a volume.
          </p>
        </div>
        <CompleteShelf books={books} />
      </section>
    </div>
  );
}
