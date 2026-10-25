// Rendered on /certificates. Sections with no entries are hidden.

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  href?: string;
  logo?: string; // brand key for components/ios/TechLogo
  details: string[];
};

export type Achievement = {
  title: string;
  organization: string;
  date: string;
  href?: string;
  logo?: string; // brand key for components/ios/TechLogo
  details: string[];
};

export const certificates: Certificate[] = [
  {
    title: 'Machine Learning Specialization',
    issuer: 'Stanford Online & DeepLearning.AI (Coursera)',
    logo: 'coursera',
    date: '2026',
    href: 'https://coursera.org/share/46613b0d105fbe9ed9309343bad7bead',
    details: [
      'Supervised Machine Learning: Regression and Classification',
      'Advanced Learning Algorithms',
      'Unsupervised Learning, Recommenders, Reinforcement Learning',
    ],
  },
];

export const achievements: Achievement[] = [
  {
    title: 'Smart India Hackathon: internal round winner, twice',
    organization: 'Chandigarh University',
    date: '2025, 2026',
    details: ['Won the internal round of Smart India Hackathon at Chandigarh University two years in a row.'],
  },
  {
    title: 'Open-source contributor, GSSoC 2026 (completed)',
    organization: 'GirlScript Summer of Code',
    logo: 'gssoc',
    date: '2026',
    details: [
      'Selected as a contributor in one of India’s largest open-source programs, and completed the 2026 cohort.',
      'Collaborative workflows: pull requests, code review and issue triage.',
    ],
  },
];
