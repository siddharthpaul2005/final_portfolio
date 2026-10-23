// Blog post metadata.
// - Posts hosted here need a matching src/content/blog/<key>.mdx file.
// - Posts with `externalUrl` live elsewhere (Medium) and are linked out to.
// See BLOG_GUIDE.md for how to add a post.

export type BlogPost = {
  title: string;
  description?: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
  externalUrl?: string;
};

const author = 'Siddharth Paul';
const mediumCard = '/assets/medium-card.svg';

export const blogPostsData: Record<string, BlogPost> = {
  'india-2047-from-potential-to-capability': {
    title: 'India 2047: From Potential to Capability',
    date: 'September 24, 2026',
    author,
    category: 'Opinion',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['India', 'Opinion'],
    externalUrl: 'https://paulsiddharth.medium.com/india-2047-from-potential-to-capability-d8cd93d5addc',
  },
  'byzantine-generals-problem': {
    title: "Byzantine Generals' Problem",
    description:
      'Crash faults go silent; Byzantine faults lie. Why consensus needs n ≥ 3f+1 nodes, with Go simulations, interactive demos, and how PBFT, Tendermint and HotStuff make it practical.',
    date: 'August 28, 2026',
    author,
    category: 'Distributed Systems',
    readTime: '12 min read',
    image: '/blog/byzantine-generals-problem/img1.png',
    tags: ['Distributed Systems', 'Consensus', 'BFT', 'Go'],
  },
  'anthropic-vs-pentagon': {
    title: 'Anthropic vs Pentagon: The AI Ethics Battle Explained',
    description: 'The conflict between Anthropic and the U.S. Department of War over AI guardrails, explained in depth.',
    date: 'March 11, 2026',
    author,
    category: 'AI',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['AI', 'Ethics'],
    externalUrl: 'https://paulsiddharth.medium.com/anthropic-vs-pentagon-the-ai-ethics-battle-explained-406c2c12472e',
  },
  'youre-not-overthinking': {
    title: "You're Not Overthinking. You're Under-Deciding.",
    date: 'January 30, 2026',
    author,
    category: 'Mindset',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['Mindset'],
    externalUrl: 'https://paulsiddharth.medium.com/youre-not-overthinking-you-re-under-deciding-94f75130c199',
  },
  'how-google-maps-works': {
    title: 'How Google Maps Actually Works: The Simple Explanation Behind Routing Algorithms',
    date: 'November 26, 2025',
    author,
    category: 'Algorithms',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['Algorithms', 'Graphs'],
    externalUrl:
      'https://paulsiddharth.medium.com/how-google-maps-actually-works-the-simple-explanation-behind-routing-algorithms-6f099591295c',
  },
  'new-atheism-to-wokism': {
    title: 'From New Atheism to Wokism: The Ideological Shift No One Saw Coming',
    date: 'October 20, 2025',
    author,
    category: 'Opinion',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['Opinion'],
    externalUrl: 'https://paulsiddharth.medium.com/philosophy-of-failure-e508f205fb4c',
  },
  'leetcode-question-234': {
    title: 'Question 234, LeetCode',
    date: 'October 7, 2025',
    author,
    category: 'DSA',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['LeetCode', 'DSA'],
    externalUrl: 'https://paulsiddharth.medium.com/question-234-leetcode-b18637f7c3f6',
  },
  'how-eigenfaces-got-me-hooked-on-ml': {
    title: 'How Eigenfaces Got Me Hooked on Machine Learning',
    date: 'April 9, 2025',
    author,
    category: 'Machine Learning',
    readTime: 'Medium',
    image: mediumCard,
    tags: ['Machine Learning', 'Linear Algebra'],
    externalUrl: 'https://paulsiddharth.medium.com/how-eigenfaces-got-me-hooked-on-machine-learning-8283864324f1',
  },
};

export type BlogPostKey = keyof typeof blogPostsData;
