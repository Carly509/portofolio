export const site = {
  name: 'Carly Tesnor',
  role: 'Software engineer',
  // Set NEXT_PUBLIC_SITE_URL in the deploy env; the fallback only affects
  // absolute URLs in metadata, sitemap and OG images.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carlytesnor.com',
  email: 'tesnorcarly@gmail.com',
  resume: '/resume.pdf',
  twitterHandle: '@TesnorC',
  description:
    'Software engineer with over seven years building for the web, iOS, and healthcare data — C#, NestJS, MSSQL, React, and TypeScript. Shipped projects include Reperem, a pharmacy search app for Haiti.',
  social: [
    { name: 'GitHub', href: 'https://github.com/Carly509' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/carly-tesnor-633736160/' },
    { name: 'Twitter', href: 'https://twitter.com/TesnorC' },
    { name: 'Instagram', href: 'https://www.instagram.com/tazz_509/' },
  ],
} as const;

/* No "Index" entry — the CT. mark is the way home, the way it is on every
   masthead. Contact is a mailto rather than a page: clicking it opens their
   mail client with the address filled in, which is the whole job a form did. */
export const nav = [
  { label: 'Side Projects', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
  { label: 'Email', href: `mailto:${site.email}`, external: true },
] as const;
