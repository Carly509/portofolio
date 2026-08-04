import type { Metadata } from 'next';
import Link from 'next/link';

import PageHeader from '@/components/page-header';
import { timeline } from '@/content/timeline';
import { site } from '@/content/site';
import styles from './about.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Seven years of engineering, in the order it happened — from human-centred design to healthcare data pipelines.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className={`shell ${styles.page}`}>
      <PageHeader
        title="About."
        aside={
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resume}
            data-cursor="Resumé ↗"
          >
            Resumé ↗
          </a>
        }
      >
        <p>
          Seven years of building, in the order it happened. Engineering first,
          product because someone had to hold the vision, and a long habit of
          learning in public.
        </p>
      </PageHeader>

      <section className={styles.pitch}>
        <div>
          <h2 className={styles.h2}>Engineering</h2>
          <p>
            An outstanding site is not only how it looks — it is whether it
            works, and whether anyone can find their way around it. I am
            comfortable in the awkward technical middle of a project: the part
            where the design is decided, the data is messy, and someone has to
            make the two meet.
          </p>
          <Link href="/work" className={styles.more} data-cursor="See all">
            See side projects →
          </Link>
        </div>
        <div>
          <h2 className={styles.h2}>Product</h2>
          <p>
            I am not a product manager, but research, design and coordination are
            part of how I work rather than someone else&apos;s job. On Reperem
            they had to be — there was nobody else. That is the experience I
            bring to a team that already has a PM: I can hold the vision without
            needing to own it.
          </p>
          <Link href="/work/reperem" className={styles.more} data-cursor="Read">
            Reperem, end to end →
          </Link>
        </div>
      </section>

      <section aria-labelledby="path">
        <h2 id="path" className={`label ${styles.railHead}`}>
          How it happened
        </h2>
        <ol className={styles.rail}>
          {timeline.map((entry, i) => (
            <li
              key={`${entry.year}-${entry.title}`}
              className={`${styles.entry} rise`}
              data-mark={entry.mark || undefined}
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className={`${styles.year} tabular`}>{entry.year}</span>
              <div className={styles.entryBody}>
                <h3 className={styles.entryTitle}>
                  {entry.href ? (
                    entry.href.startsWith('/') ? (
                      <Link href={entry.href} data-cursor="Open">
                        {entry.title}
                      </Link>
                    ) : (
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Open ↗"
                      >
                        {entry.title}
                      </a>
                    )
                  ) : (
                    entry.title
                  )}
                  {entry.where && (
                    <span className={styles.where}>{entry.where}</span>
                  )}
                </h3>
                <p className={styles.entryText}>{entry.body}</p>
              </div>
              <span className={styles.kind}>{entry.kind}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.offscreen}>
        <h2 className={styles.h2}>Off screen</h2>
        <p className="measure">
          Manga, long games, and music loud enough to be a problem for the people
          I live with. If you want to argue about any of those,{' '}
          <a href={`mailto:${site.email}`} data-cursor="Write to me">
            write to me
          </a>
          .
        </p>
      </section>
    </div>
  );
}
