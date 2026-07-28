export type Article = {
  slug: string;
  title: string;
  /** The standfirst — one sentence, what the reader gets. */
  dek: string;
  date: string;
  readingTime: string;
  tags: string[];
  /** Section headings, in order. Drives the on-this-page rail. */
  toc: { id: string; label: string }[];
};

export const articles: Article[] = [
  {
    slug: 'n-plus-one-queries-in-rails',
    title: 'Understanding and fixing the N+1 query in Rails',
    dek: 'Why your index page makes 400 database calls, how to see it happening, and the one method that usually fixes it.',
    date: '2024-03-18',
    readingTime: '6 min',
    tags: ['Ruby on Rails', 'Performance', 'ActiveRecord'],
    toc: [
      { id: 'what-it-means', label: 'What N+1 actually means' },
      { id: 'the-grocery-run', label: 'The grocery run' },
      { id: 'in-code', label: 'What it looks like in code' },
      { id: 'spotting-it', label: 'Spotting it before production does' },
      { id: 'the-three-methods', label: 'includes, preload, eager_load' },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
