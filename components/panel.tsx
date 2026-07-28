import Image from 'next/image';
import Link from 'next/link';

import { kindLabels, projects, type Project } from '@/content/projects';
import styles from './panel.module.css';

/* A panel, not a card. Span comes from the content, so the grid says which
 * work matters instead of rolling dice at render time. The image develops
 * like a signal acquiring lock: duotone at rest, full colour on approach. */
export default function Panel({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const { cols, rows } = project.panel;

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`${styles.panel} rise`}
      style={
        {
          '--cols': cols,
          '--rows': rows,
          '--i': index,
        } as React.CSSProperties
      }
      data-cursor="Case study"
    >
      <Image
        src={project.image}
        alt=""
        fill
        sizes={cols >= 4 ? '(max-width: 820px) 100vw, 66vw' : '(max-width: 820px) 100vw, 33vw'}
        className={styles.img}
        priority={priority}
      />
      <span className={styles.tone} aria-hidden="true" />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.sweep} aria-hidden="true" />

      <span className={styles.index} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
        <s>{'//' + String(projects.length).padStart(2, '0')}</s>
      </span>

      <span className={styles.year} aria-hidden="true">
        {project.year} · {kindLabels[project.kinds[0]].replace(/s$/, '').toUpperCase()}
      </span>

      <span className={styles.body}>
        <span className={styles.title}>{project.title}</span>
        <span className={styles.tagline}>{project.tagline}</span>
        <span className={styles.stack}>
          {project.stack.slice(0, 3).map((tech) => (
            <span key={tech} className={styles.tech}>
              {tech}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
