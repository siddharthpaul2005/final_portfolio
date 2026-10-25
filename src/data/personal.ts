/**
 * Personal lists. (Gears, extensions, bucket list and desk setup were retired.)
 */

// Books, courses and docs I learned from (shown on /about).
export const sources: { group: string; items: { title: string; by?: string; logo?: string }[] }[] = [
  {
    group: 'Books & Papers',
    items: [
      { title: 'Designing Data-Intensive Applications', by: 'Martin Kleppmann' },
      { title: 'Options, Futures, and Other Derivatives', by: 'John C. Hull' },
      { title: 'Stochastic Calculus for Finance I: The Binomial Asset Pricing Model', by: 'Steven Shreve' },
      { title: 'Introduction to Algorithms (CLRS)', by: 'Cormen, Leiserson, Rivest, Stein' },
      { title: 'Operating Systems: Three Easy Pieces', by: 'Remzi & Andrea Arpaci-Dusseau' },
    ],
  },
  {
    group: 'Courses',
    items: [
      { title: 'Stanford CS229: Machine Learning' },
      { title: 'MIT 6.S081: Operating System Engineering' },
      { title: "Striver's A2Z DSA Course (C++)" },
    ],
  },
  {
    group: 'Docs & References',
    items: [{ title: 'cppreference.com', logo: 'c++' }, { title: 'Elixir School & HexDocs', logo: 'elixir' }, { title: 'The Rust Programming Language', logo: 'rust' }],
  },
];
