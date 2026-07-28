import type { MetadataRoute } from 'next';

import { site } from '@/content/site';
import { projects } from '@/content/projects';
import { articles } from '@/content/writing';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/work`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/writing`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.7 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/writing/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.6,
    })),
  ];
}
