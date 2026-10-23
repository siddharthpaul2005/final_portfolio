/**
 * "Currently working on" — the Dynamic Island (first active item), the home notification stack and /now.
 * `mode` separates what I actively do ('active') from what I pick up when I have time ('side');
 * the two are always shown apart.
 */

export type NowKind = 'Building' | 'Designing' | 'Learning' | 'Contributing' | 'Looking for';
export type NowMode = 'active' | 'side';

export type NowItem = {
  title: string;
  kind: NowKind;
  mode: NowMode;
  description: string;
  tags: string[];
  // Internal link (e.g. a project page) or external URL.
  href?: string;
};

const items: NowItem[] = [
  // ---- Active focus ----
  {
    title: 'Multi-Agent Orchestration Daemon',
    kind: 'Building',
    mode: 'active',
    description:
      'Go daemon supervising polyglot AI agents as isolated processes. Now building heartbeat-based failure detection and a task dispatcher.',
    tags: ['Go', 'Python', 'gRPC', 'Protobuf'],
    href: '/projects/multi-agent-orchestrator',
  },
  {
    title: 'Distributed systems',
    kind: 'Learning',
    mode: 'active',
    description: 'Low-level distributed systems and backend design, reading Kleppmann’s Designing Data-Intensive Applications.',
    tags: ['Distributed Systems', 'DDIA'],
  },
  {
    title: 'ML fundamentals',
    kind: 'Learning',
    mode: 'active',
    description: 'Working through Stanford CS229 to deepen the theory behind my applied AI work.',
    tags: ['CS229', 'ML'],
  },
  {
    title: 'Competitive programming',
    kind: 'Learning',
    mode: 'active',
    description: 'Striver’s A2Z and SDE sheets in C++, pushing toward Codeforces Specialist (1400+).',
    tags: ['C++', 'DSA', 'Codeforces'],
    href: 'https://codeforces.com/profile/SIDDHARTH_2005',
  },
  {
    title: 'GATE preparation',
    kind: 'Learning',
    mode: 'active',
    description: 'Preparing for GATE CSE: strengthening the maths and CS fundamentals behind everything else.',
    tags: ['GATE', 'Math', 'CS Fundamentals'],
  },
  {
    title: 'Backend SWE and AI/ML roles',
    kind: 'Looking for',
    mode: 'active',
    description: 'Backend-heavy software engineering and AI/ML roles, internship or full-time.',
    tags: ['Backend', 'AI/ML', 'Intern', 'Full-time'],
    href: '/contact',
  },

  // ---- On the side, when I have time ----
  {
    title: 'Echelon Strategies',
    kind: 'Building',
    mode: 'side',
    description: 'A quant research group I started with two friends, exploring statistical arbitrage and quant infrastructure.',
    tags: ['Quant', 'Stat Arb'],
    href: 'https://echeleonstrategiesweb.vercel.app/',
  },
  {
    title: 'Quant finance & stochastic processes',
    kind: 'Learning',
    mode: 'side',
    description: 'Shreve’s Stochastic Calculus for Finance I, Hull’s Options, Futures & Other Derivatives, and stochastic processes lectures.',
    tags: ['Quant', 'Stochastic Processes'],
  },
];

export const now = {
  // Bump this whenever you edit the list.
  updated: 'October 2026',
  description:
    'CS undergrad at Chandigarh University, Mohali, graduating May 2028. My focus is backend systems and applied AI/ML; quant finance is a side interest I explore when I have time.',
  items,
  active: items.filter((i) => i.mode === 'active'),
  side: items.filter((i) => i.mode === 'side'),
};
