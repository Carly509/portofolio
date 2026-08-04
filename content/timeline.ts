type Entry = {
  year: string;
  title: string;
  where?: string;
  body: string;
  /** What kind of turning point this was — shown as the right-hand label. */
  kind: string;
  href?: string;
  /** Only genuine turning points get the magenta plate mark. */
  mark?: boolean;
};

export const timeline: Entry[] = [
  {
    year: '2017—18',
    title: 'Human-Centered Design 101',
    where: 'Acumen',
    body: 'A hands-on course that pushed me out of the chair to test ideas on actual people. Still the reason I start with the user rather than the schema.',
    kind: 'Foundation',
    href: 'https://www.plusacumen.org/courses/introduction-human-centered-design',
    mark: true,
  },
  {
    year: '2017—21',
    title: 'Senior Software Engineer I',
    where: 'Noukod',
    body: 'The first engineering seat, four years of it: Rails APIs redesigned for speed, a CSV/XLS uploader that turned spreadsheets into graphs on PostgreSQL, and releases automated through CI/CD.',
    kind: 'Work',
    mark: true,
  },
  {
    year: '2019',
    title: 'Data Structures and Algorithms',
    where: 'Udemy',
    body: 'Closing the gap self-taught engineers tend to carry: Big-O, and knowing which structure to reach for before writing the loop.',
    kind: 'Craft',
    href: 'https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/',
  },
  {
    year: '2019',
    title: 'Adaptive Leadership',
    where: 'edX',
    body: 'A Harvard Kennedy School framework for leading change when there is no easy answer. I have used it more than I expected to.',
    kind: 'Team',
    href: 'https://www.edx.org/course/adaptive-leadership-in-development',
  },
  {
    year: '2020',
    title: 'Learning to Learn',
    where: 'Udemy',
    body: 'Study and recall strategies with research behind them. Less glamorous than a framework, more useful than most.',
    kind: 'Craft',
    href: 'https://www.udemy.com/course/learning-to-learn-efficient-learning-zero-to-mastery/',
  },
  {
    year: '2021',
    title: 'Reperem ships to the App Store',
    body: 'Zero to one, alone: research, product decisions, React Native, Firebase, and the review queue. The first thing I built that people outside a repo depend on.',
    kind: 'Shipped',
    href: '/work/reperem',
    mark: true,
  },
  {
    year: '2021—22',
    title: 'Full Stack Developer',
    where: 'BairesDev',
    body: 'Rails on PostgreSQL for a distributed team: data retrieval 25% faster, Jenkins CI/CD cutting release cycles by 40%, RSpec throughout, and a Next.js/NestJS monorepo held together with tRPC.',
    kind: 'Work',
  },
  {
    year: '2022—25',
    title: 'Web Developer',
    where: 'Mobile Pushers',
    body: 'Rails applications plus the Node.js edge in front of them: Sidekiq for background jobs, NGINX load-balancing dozens of Node instances, Express auth middleware, and 100% on-time delivery.',
    kind: 'Work',
  },
  {
    year: '2025—Now',
    title: 'Full Stack Developer',
    where: 'BioCollections WorldWide',
    body: 'Healthcare data, end to end: C# services moving 10,000+ HL7/LIS medical records a month into a NestJS backend and MSSQL, a production AI chatbot on a Qwen model, and the legacy ASP Classic that preceded it all.',
    kind: 'Work',
    mark: true,
  },
  {
    year: 'Now',
    title: 'Still learning, out loud',
    body: 'Whatever I have had to work out the hard way ends up written down eventually.',
    kind: 'Ongoing',
    href: '/writing',
  },
];
