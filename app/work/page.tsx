import type { Metadata } from 'next';
import Link from 'next/link';

import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';
import {
  kindLabels,
  projectsByKind,
  type ProjectKind,
} from '@/content/projects';
import styles from './work.module.css';

export const metadata: Metadata = {
  title: 'Side Projects',
  description:
    'Side projects, iOS apps, client sites, developer tools and open source. React, React Native, Ruby and WordPress.',
  alternates: { canonical: '/work' },
};

const kinds = Object.keys(kindLabels) as ProjectKind[];

function isKind(value: string | undefined): value is ProjectKind {
  return !!value && kinds.includes(value as ProjectKind);
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const active = isKind(type) ? type : 'all';
  const shown = projectsByKind(active);

  return (
    <div className={`shell ${styles.page}`}>
      <PageHeader
        title="Side Projects."
        aside={
          <>
            <Link
              href="/work"
              className={styles.filter}
              data-active={active === 'all' || undefined}
              scroll={false}
            >
              All
            </Link>
            {kinds.map((kind) => (
              <Link
                key={kind}
                href={`/work?type=${kind}`}
                className={styles.filter}
                data-active={active === kind || undefined}
                scroll={false}
              >
                {kindLabels[kind]}
              </Link>
            ))}
          </>
        }
      >
        <p>
          Ordered by what I would want to talk about first. Panel size is set per
          project — the bigger the panel, the more there is to say.
        </p>
      </PageHeader>

      <ul className={styles.grid}>
        {shown.map((project, i) => (
          <li
            key={project.slug}
            className={styles.cell}
            style={
              {
                '--cols': project.panel.cols,
                '--rows': project.panel.rows,
              } as React.CSSProperties
            }
          >
            <Panel project={project} index={i} priority={i < 2} />
          </li>
        ))}

        {active === 'all' && (
          <li className={`${styles.cell} ${styles.note} rise`}>
            <p className={`label ${styles.noteLabel}`}>Client projects</p>
            <p className={styles.noteBody}>
              Shipped sites for cleaning, home-service and mobile companies.
              Built to be handed over — most of them their team edits without me.
            </p>
            <Link
              href="/work?type=client"
              className={styles.noteLink}
              scroll={false}
              data-cursor="Filter"
            >
              See the client projects →
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
