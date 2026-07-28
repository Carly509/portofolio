import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { articles, formatDate, getArticle } from '@/content/writing';
import { site } from '@/content/site';
import NPlusOne from '@/content/articles/n-plus-one-queries-in-rails';
import styles from './article.module.css';

/* One entry per article. Adding a piece means a metadata row in
 * content/writing.ts and a component here — when this list outgrows a screen,
 * that is the moment to bring in MDX. */
const bodies: Record<string, React.ComponentType> = {
  'n-plus-one-queries-in-rails': NPlusOne,
};

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Not found' };

  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: `/writing/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      authors: [site.name],
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  const Body = bodies[slug];
  if (!article || !Body) notFound();

  return (
    <div className={`shell ${styles.page}`}>
      <article className={styles.layout}>
        <div className={styles.main}>
          <header className={styles.head}>
            <h1 className={styles.title}>{article.title}</h1>
            <p className={styles.dek}>{article.dek}</p>
            <div className={styles.byline}>
              <span className="label tabular">{formatDate(article.date)}</span>
              <span className="label">{article.readingTime}</span>
              {article.tags.map((tag) => (
                <span key={tag} className="label">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <Body />

          <footer className={styles.foot}>
            <p className={styles.footNote}>
              Written by hand. No newsletter, no popup.
            </p>
            <div className={styles.footLinks}>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  article.title,
                )}&url=${encodeURIComponent(`${site.url}/writing/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="Share ↗"
              >
                Discuss on Twitter ↗
              </a>
              <Link href="/writing" data-cursor="Back">
                All writing ←
              </Link>
            </div>
          </footer>
        </div>

        {/* Section rail. Plain anchors, so it works before JS and needs none. */}
        <nav className={styles.rail} aria-label="On this page">
          <p className="label">On this page</p>
          <ol className={styles.toc}>
            {article.toc.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ol>
        </nav>
      </article>
    </div>
  );
}
