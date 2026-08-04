export type Book = {
  id: string;
  title: string;
  shortTitle: string;
  author: string;
  description: string;
  quote: string;
  cover: string;
  accent: string;
  ink: string;
  height: number;
  thickness: number;
};

export const books: Book[] = [
  {
    id: 'the-little-prince',
    title: 'The Little Prince',
    shortTitle: 'The Little Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'A stranded pilot meets a young prince whose small-planet stories make a case for curiosity, love, and seeing beyond the obvious.',
    quote: 'A brief, strange, and enduring fable about what matters.',
    cover: '#6f2130',
    accent: '#d5a756',
    ink: '#f4ead7',
    height: 2.08,
    thickness: 0.24,
  },
  {
    id: 'eloquent-javascript',
    title: 'Eloquent JavaScript',
    shortTitle: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    description: 'A hands-on introduction to modern JavaScript, from core language ideas to the browser, Node.js, and building complete programs.',
    quote: 'A technical book that rewards making things as you read.',
    cover: '#c49d25',
    accent: '#312c1f',
    ink: '#fff3d8',
    height: 1.96,
    thickness: 0.19,
  },
  {
    id: 'letranger',
    title: "L'Etranger",
    shortTitle: "L'Etranger",
    author: 'Albert Camus',
    description: 'Camus follows Meursault through an ordinary life that becomes a confrontation with grief, judgment, and the absurd.',
    quote: 'A spare novel that leaves more room for the reader than it first appears to.',
    cover: '#1d4f71',
    accent: '#d6df45',
    ink: '#e7f1e8',
    height: 2.17,
    thickness: 0.27,
  },
  {
    id: 'automate-the-boring-stuff-with-python',
    title: 'Automate the Boring Stuff with Python',
    shortTitle: 'Automate the Boring Stuff',
    author: 'Al Sweigart',
    description: 'A practical guide to using Python for the repetitive tasks that eat up a day, from files and spreadsheets to web work.',
    quote: 'A friendly invitation to hand repetitive tasks back to a computer.',
    cover: '#4c3970',
    accent: '#9ad3bf',
    ink: '#f3ecdb',
    height: 2.02,
    thickness: 0.21,
  },
];
