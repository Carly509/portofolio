import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getProject, kindLabels, projects } from '@/content/projects';
import styles from './case.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Not found' };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: [{ url: project.image, alt: project.alt }],
    },
  };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = i > 0 ? projects[i - 1] : projects[projects.length - 1];
  const next = i < projects.length - 1 ? projects[i + 1] : projects[0];

  return (
    <article className={`shell ${styles.page}`}>
      <div className={styles.layout}>
        {/* Everything a recruiter scans for, before the prose. */}
        <aside className={styles.meta}>
          <dl className={styles.facts}>
            <div>
              <dt>Year</dt>
              <dd className="tabular">{project.year}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Kind</dt>
              <dd>{project.kinds.map((k) => kindLabels[k]).join(', ')}</dd>
            </div>
            <div>
              <dt>Stack</dt>
              <dd>{project.stack.join(' · ')}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.action} ${styles.primary}`}
                data-cursor="Open ↗"
              >
                <span>Open live</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.source && (
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.action}
                data-cursor="Source ↗"
              >
                <span>Source</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            <Link href="/work" className={styles.action} data-cursor="Back">
              <span>All side projects</span>
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </aside>

        <div className={styles.main}>
          <p className={`label ${styles.eyebrow}`}>
            Project file <b>{String(i + 1).padStart(2, '0')}</b>
            <b>{'//' + String(projects.length).padStart(2, '0')}</b>
          </p>

          <h1 className={`glitch ${styles.title}`}>
            <span>{project.title}</span>
          </h1>

          <p className={styles.kicker}>{project.summary}</p>

          {project.facts && (
            <dl className={styles.stats}>
              {project.facts.map((f) => (
                <div key={f.label}>
                  <dt className="tabular">{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* No caption — the alt text already describes it, and repeating
              that in visible type makes a screen reader say it twice. */}
          <div className={styles.shot}>
            <Image
              src={project.image}
              alt={project.alt}
              width={1200}
              height={800}
              sizes="(max-width: 900px) 100vw, 62vw"
              className={styles.shotImg}
              priority
            />
          </div>

          {project.notes && (
            <div className={styles.notes}>
              <p className="label">Notes</p>
              {project.notes.map((note) => (
                <p key={note} className={styles.note}>
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className={styles.pager} aria-label="More side projects">
        <Link href={`/work/${prev.slug}`} data-cursor="Previous">
          <span className="label">Previous</span>
          <span className={styles.pagerTitle}>← {prev.title}</span>
        </Link>
        <Link href={`/work/${next.slug}`} data-cursor="Next">
          <span className="label">Next</span>
          <span className={styles.pagerTitle}>{next.title} →</span>
        </Link>
      </nav>
    </article>
  );
}
