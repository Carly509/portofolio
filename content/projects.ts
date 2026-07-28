export type ProjectKind = 'client' | 'open-source' | 'tool' | 'app';

export type Project = {
  slug: string;
  title: string;
  /** One line, shown on the panel. */
  tagline: string;
  /** The case-study opening. Two or three sentences, no marketing. */
  summary: string;
  year: string;
  role: string;
  kinds: ProjectKind[];
  stack: string[];
  image: string;
  /** Written for someone who can't see the image. */
  alt: string;
  live?: string;
  source?: string;
  /** Authored panel size, never randomised — this is what stops the grid
   *  shifting between renders and lets layout say which work matters.
   *  cols/rows are spans on a 6-column, 104px-row grid. */
  panel: { cols: number; rows: number };
  featured?: boolean;
  facts?: { value: string; label: string }[];
  notes?: string[];
};

export const projects: Project[] = [
  {
    slug: 'reperem',
    title: 'Reperem',
    tagline: 'Pharmacy search for Haiti, on iOS',
    summary:
      'Finding a specific medication in Haiti means phoning pharmacies one at a time. Reperem gathers their stock into one searchable place, so the call is the last step instead of the first. Shipped to the App Store as the only engineer on it.',
    year: '2021',
    role: 'Mobile engineer, solo',
    kinds: ['app'],
    stack: ['React Native', 'Redux Saga', 'JavaScript', 'Firebase'],
    image:
      'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/5f/56/55/5f5655fc-a2d7-695c-031c-d270dfe170dc/79ccc47b-0543-4b2d-9f94-7fd544b383c3_Simulator_Screen_Shot_-_iPhone_14_Pro_Max_-_2023-03-17_at_13.13.23.png/460x0w.webp',
    alt: 'Reperem running on iPhone, showing a pharmacy search results list',
    live: 'https://apps.apple.com/us/app/reperem/id1579713753',
    panel: { cols: 4, rows: 3 },
    featured: true,
    facts: [
      { value: '1', label: 'Engineer' },
      { value: 'iOS', label: 'App Store' },
      { value: '2021', label: 'Shipped' },
    ],
    notes: [
      'Redux Saga handles the search pipeline: debounce, cancel the in-flight request, retry on a flaky connection. Connectivity in Haiti is the constraint the whole app is designed around.',
      'Firebase for auth and the pharmacy catalogue, so pharmacists can update stock without me shipping a release.',
    ],
  },
  {
    slug: 'piggment',
    title: 'Piggment',
    tagline: 'Gradients in every new tab',
    summary:
      'A Chrome extension that replaces the new-tab page with a curated collection of gradients you can generate, explore and copy as cross-browser CSS.',
    year: '2020',
    role: 'Design and build',
    kinds: ['tool', 'open-source'],
    stack: ['React', 'Context API', 'JavaScript', 'Chrome APIs'],
    image: 'https://i.ibb.co/Pxm6yzy/Screenshot-2020-07-28-at-02-48-43.png',
    alt: 'Piggment new tab page showing a grid of colour gradients',
    live: 'https://chrome.google.com/webstore/detail/piggment-crafted-to-inspi/eifkhhlfjplpakoddkndkgjhfajnhffg',
    source: 'https://github.com/Carly509',
    panel: { cols: 2, rows: 2 },
    notes: [
      'Every gradient is generated and copied client-side — the extension asks for no permissions beyond replacing the new-tab page.',
    ],
  },
  {
    slug: 'daily-ai-news',
    title: 'Daily AI News',
    tagline: 'One page, the day in AI',
    summary:
      'A reading page for AI news that updates daily, built to stay legible on a phone and load on a slow connection.',
    year: '2023',
    role: 'Design and build',
    kinds: ['tool'],
    stack: ['React', 'Context API', 'JavaScript'],
    image: '/img/aitech.png',
    alt: 'Daily AI News homepage listing the day’s technology headlines',
    live: 'https://gpt3-5-ui.vercel.app/',
    source: 'https://github.com/Carly509',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'snake',
    title: 'Snake',
    tagline: 'The classic, in Ruby',
    summary:
      'Snake written with Ruby and Ruby2D — a deliberate exercise in game loops, collision and state in a language people rarely use for graphics.',
    year: '2023',
    role: 'Build',
    kinds: ['open-source'],
    stack: ['Ruby', 'Ruby2D'],
    image:
      'https://user-images.githubusercontent.com/42774502/269058153-ffb41a19-0a06-4958-a238-e96af4cf140a.png',
    alt: 'The Snake game running in a window, snake mid-turn on a grid',
    source: 'https://github.com/Carly509/snake-game',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'phineas-and-ferb',
    title: 'Phineas & Ferb, in pure CSS',
    tagline: 'No images, only stylesheets',
    summary:
      'The two of them drawn entirely in Sass and CSS — no SVG, no images. An exercise in how far shapes, gradients and pseudo-elements will actually go.',
    year: '2021',
    role: 'Build',
    kinds: ['open-source'],
    stack: ['Sass', 'CSS'],
    image:
      'https://user-images.githubusercontent.com/42774502/132997448-1c64aab1-7466-4752-aba1-e764ea6ad1aa.png',
    alt: 'Phineas and Ferb illustrated entirely with CSS shapes',
    source: 'https://github.com/Carly509/cartoons-css',
    panel: { cols: 2, rows: 1 },
  },
  {
    slug: 'social-management',
    title: 'Social Management',
    tagline: 'Every account in one place',
    summary:
      'A dashboard that pulls several social accounts into a single view, so scheduling and replying does not mean five open tabs.',
    year: '2022',
    role: 'Frontend',
    kinds: ['tool'],
    stack: ['React', 'CSS', 'JavaScript'],
    image: '/img/social-media.png',
    alt: 'Social management dashboard with scheduled posts across accounts',
    live: 'https://newsocial-git-main-carly509s-projects.vercel.app/',
    source: 'https://github.com/Carly509',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'servicemaster-clean',
    title: 'ServiceMaster Clean',
    tagline: 'Commercial cleaning, Canada',
    summary:
      'Marketing site and quote flow for a commercial cleaning company, built on WordPress so their team can edit it without me.',
    year: '2022',
    role: 'Build',
    kinds: ['client'],
    stack: ['WordPress', 'HTML', 'CSS', 'JavaScript'],
    image: '/img/servicemaster.png',
    alt: 'ServiceMaster Clean homepage with a request-a-quote form',
    live: 'https://servicemasterclean.ca/',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'amerclean',
    title: 'Amerclean',
    tagline: 'Cleaning services, per need',
    summary:
      'A service site organised around what the customer needs cleaned rather than around the company’s internal service list.',
    year: '2022',
    role: 'Build',
    kinds: ['client'],
    stack: ['WordPress', 'HTML', 'CSS', 'JavaScript'],
    image: '/img/americancleanong.png',
    alt: 'Amerclean homepage showing residential and commercial services',
    live: 'https://www.amercln.com/',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'alive-and-in-color',
    title: 'Alive and in Color',
    tagline: 'A platform for colour and craft',
    summary:
      'A site for a creative studio, built to put the work first and stay out of its way.',
    year: '2023',
    role: 'Build',
    kinds: ['client'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/img/alive.png',
    alt: 'Alive and in Color homepage with a full-width artwork gallery',
    live: 'https://www.aliveandincolor.com/',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'zinealdea',
    title: 'Zinealdea',
    tagline: 'A zine community, in Spanish',
    summary:
      'A community site for a Spanish zine collective — archive, contributors and submissions.',
    year: '2023',
    role: 'Build',
    kinds: ['client'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/img/zinealda.png',
    alt: 'Zinealdea homepage showing a grid of zine covers',
    live: 'https://zinealdea.es/',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'mobile-pushers',
    title: 'Mobile Pushers',
    tagline: 'Mobile development studio',
    summary:
      'Site for a mobile development studio, structured around case studies instead of a service grid.',
    year: '2022',
    role: 'Build',
    kinds: ['client'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/img/mp.png',
    alt: 'Mobile Pushers homepage with app case studies',
    live: 'http://mobilepushers.com/',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'landing-page-template',
    title: 'Landing Page Template',
    tagline: 'One template, any category',
    summary:
      'A landing page template built to be re-skinned for a different industry with small changes rather than a rewrite — the structure holds, the content slots move.',
    year: '2023',
    role: 'Design and build',
    kinds: ['tool', 'open-source'],
    stack: ['React', 'Context API', 'JavaScript'],
    image: '/img/agency-landing.png',
    alt: 'Landing page template showing a hero, features and pricing sections',
    live: 'https://landing-page-template-ryqh.vercel.app/',
    source: 'https://github.com/Carly509',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'agency-landing',
    title: 'Agency Landing Page',
    tagline: 'A front-end challenge, hand-built',
    summary:
      'A design challenge built from scratch in plain HTML, CSS and JavaScript — no framework, no build step.',
    year: '2021',
    role: 'Build',
    kinds: ['open-source'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/img/sunny.png',
    alt: 'Agency landing page with a large headline over a sunlit photograph',
    live: 'https://carly509.github.io/agency/',
    source: 'https://github.com/Carly509',
    panel: { cols: 2, rows: 2 },
  },
  {
    slug: 'handy',
    title: 'Handy',
    tagline: 'Booking trusted home services',
    summary:
      'Frontend work on a home-services marketplace — the flow from picking a service to a confirmed booking.',
    year: '2022',
    role: 'Frontend',
    kinds: ['client'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/img/handy.png',
    alt: 'Handy booking page with service categories and available times',
    live: 'https://www.handy.com/',
    panel: { cols: 2, rows: 2 },
  },
];

export const kindLabels: Record<ProjectKind, string> = {
  app: 'Apps',
  client: 'Client work',
  'open-source': 'Open source',
  tool: 'Tools',
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function projectsByKind(kind: ProjectKind | 'all') {
  return kind === 'all'
    ? projects
    : projects.filter((p) => p.kinds.includes(kind));
}
