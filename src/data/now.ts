import { Sigma, Satellite, Network, Brain, GraduationCap, Briefcase, LineChart, type LucideIcon } from 'lucide-react';
import type { IconColor } from '../components/ios/AppIcon';

/**
 * "Currently working on" — the Dynamic Island (first active item), the home notification stack and /now.
 * `mode` separates what I actively do ('active') from what I pick up when I have time ('side');
 * the two are always shown apart.
 */

export type NowKind = 'Building' | 'Researching' | 'Designing' | 'Learning' | 'Contributing' | 'Looking for';
export type NowMode = 'active' | 'side';

export type NowItem = {
  title: string;
  kind: NowKind;
  mode: NowMode;
  description: string;
  tags: string[];
  // Tile: a logo image, a brand logo key (components/ios/TechLogo), or an app icon when there is no logo.
  img?: string;
  logo?: string;
  icon?: LucideIcon;
  color?: IconColor;
  // Internal link (e.g. a project page) or external URL.
  href?: string;
};

const items: NowItem[] = [
  // ---- Active focus ----
  {
    title: 'ALFRED',
    img: '/logos/alfred.png',
    kind: 'Building',
    mode: 'active',
    description:
      'My personal, Jarvis-style assistant: a Go orchestrator and ten Python agents (email, calendar, files, research, dev and more), planned by an LLM and guarded by a safety gate.',
    tags: ['Go', 'Python', 'gRPC', 'LLM Agents'],
    href: '/projects/alfred',
  },
  {
    title: 'AIDA',
    icon: Sigma,
    color: 'purple',
    kind: 'Building',
    mode: 'active',
    description: 'Writing on my blog and knowledge repository: machine learning derived from first principles, with maths, LaTeX proofs and PyTorch from scratch.',
    tags: ['ML', 'PyTorch', 'Math'],
    href: '/projects/aida',
  },
  {
    title: 'Autonomous FDIR for CubeSats',
    icon: Satellite,
    color: 'indigo',
    kind: 'Researching',
    mode: 'active',
    description:
      'Joint research with a friend from Aerospace Engineering under Solid Propulsion: autonomous fault detection, isolation and recovery (FDIR) for CubeSat satellites.',
    tags: ['Aerospace', 'CubeSat', 'FDIR', 'Research'],
  },
  {
    title: 'Distributed systems',
    icon: Network,
    color: 'blue',
    kind: 'Learning',
    mode: 'active',
    description: 'Low-level distributed systems and backend design, reading Kleppmann’s Designing Data-Intensive Applications.',
    tags: ['Distributed Systems', 'DDIA'],
  },
  {
    title: 'ML fundamentals',
    icon: Brain,
    color: 'pink',
    kind: 'Learning',
    mode: 'active',
    description: 'Working through Stanford CS229 to deepen the theory behind my applied AI work.',
    tags: ['CS229', 'ML'],
  },
  {
    title: 'Competitive programming',
    logo: 'codeforces',
    kind: 'Learning',
    mode: 'active',
    description: 'Striver’s A2Z and SDE sheets in C++, pushing toward Codeforces Specialist (1400+).',
    tags: ['C++', 'DSA', 'Codeforces'],
    href: 'https://codeforces.com/profile/SIDDHARTH_2005',
  },
  {
    title: 'GATE preparation',
    icon: GraduationCap,
    color: 'orange',
    kind: 'Learning',
    mode: 'active',
    description: 'Preparing for GATE CSE: strengthening the maths and CS fundamentals behind everything else.',
    tags: ['GATE', 'Math', 'CS Fundamentals'],
  },
  {
    title: 'Backend SWE and AI/ML roles',
    icon: Briefcase,
    color: 'green',
    kind: 'Looking for',
    mode: 'active',
    description: 'Backend-heavy software engineering and AI/ML roles, internship or full-time.',
    tags: ['Backend', 'AI/ML', 'Intern', 'Full-time'],
    href: '/contact',
  },

  // ---- On the side, when I have time ----
  {
    title: 'Echelon Strategies',
    icon: LineChart,
    color: 'gray',
    kind: 'Building',
    mode: 'side',
    description:
      'A research group with Ankur Saha and Souradeep Bhattacharya. Our first study: walk-forward pairs trading on NIFTY 200 futures with C++ engines and full Indian F&O costs.',
    tags: ['Quant', 'Stat Arb', 'C++'],
    href: '/projects/pairs-trading-nifty200',
  },
  {
    title: 'Quant finance & stochastic processes',
    icon: Sigma,
    color: 'gray',
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
