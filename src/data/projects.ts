export type ProjectStatus = 'completed' | 'in progress' | 'in design';

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  github: string; // empty string hides the link
  demo?: string;
  demoLabel?: string; // button text for the demo link (default "OPEN")
  image?: string;
  tags: string[]; // first tag is the area: systems | dev | ML | quant
  status: ProjectStatus;
  date?: string;
  // Featured projects (the ones on the resume) are listed first and highlighted.
  featured?: boolean;
};

export const projects: Project[] = [
  // ---- Featured ----
  {
    id: 0,
    slug: 'alfred',
    title: 'ALFRED',
    description:
      'A personal, Jarvis-style assistant: a Go orchestrator and ten Python agents over gRPC, planned by an LLM, with a safety gate on every action, a kill switch and a hash-chained audit log.',
    github: '',
    tags: ['systems', 'Go', 'Python', 'gRPC', 'LLM Agents'],
    status: 'in progress',
    date: '2026 – Present',
    featured: true,
  },
  {
    id: 1,
    slug: 'disktree',
    title: 'DiskTree',
    description:
      'Multithreaded disk-usage analyzer in C++20 that indexes 230K files across 210 GB in about 10 seconds, with a CLI, a terminal UI and a web treemap.',
    github: 'https://github.com/siddharthpaul2005/DiskTree',
    tags: ['systems', 'C++20', 'CMake', 'FTXUI', 'Catch2'],
    status: 'completed',
    date: 'May 2026 – Jun 2026',
    featured: true,
  },
  {
    id: 2,
    slug: 'voice-rag',
    title: 'Voice-First Multilingual RAG System',
    description:
      'Voice-driven hybrid retrieval (BM25 + dense embeddings, fused with RRF) that answers Hindi and Bengali queries in under 200 ms. Led a 3-person team.',
    github: 'https://github.com/siddharthpaul2005/Asmodieus',
    demo: 'https://asmodieus.vercel.app/',
    tags: ['ML', 'Python', 'FastAPI', 'BM25', 'HNSW'],
    status: 'completed',
    date: 'Aug 2026',
    featured: true,
  },
  {
    id: 3,
    slug: 'multi-agent-orchestrator',
    title: 'Multi-Agent Orchestration Daemon',
    description:
      'The core of ALFRED: a local-first, always-on Go daemon that supervises polyglot AI agents as isolated OS processes, with typed gRPC/Protobuf contracts.',
    github: 'https://github.com/siddharthpaul2005/Multidomal_MultiLangage_Agentic_Daemon_Application',
    tags: ['systems', 'Go', 'Python', 'gRPC', 'Protobuf'],
    status: 'in progress',
    date: 'Feb 2026 – Present',
    featured: true,
  },
  {
    id: 4,
    slug: 'cp-companion',
    title: 'CP Companion',
    description:
      'Cross-platform desktop app in Rust/Tauri that tracks upcoming contests across Codeforces, LeetCode, CodeChef and AtCoder, with an always-on-top countdown widget.',
    github: 'https://github.com/siddharthpaul2005/CP-Companion',
    demo: 'https://cpcompanion.vercel.app/',
    tags: ['dev', 'Rust', 'Tauri', 'React', 'SQLite'],
    status: 'completed',
    date: 'Jun 2025 – Aug 2025',
    featured: true,
  },

  // ---- More projects ----
  {
    id: 5,
    slug: 'chess-engine',
    title: 'Chess Engine in C++',
    description: 'Full chess engine from scratch with an SDL2 GUI: bitboard move generation and an alpha-beta search bot with iterative deepening.',
    github: 'https://github.com/siddharthpaul2005/Chess-Engine',
    tags: ['systems', 'C++', 'CMake', 'SDL2'],
    status: 'completed',
  },
  {
    id: 7,
    slug: 'codetrack',
    title: 'CodeTrack / CP Wrapped',
    description: 'Stateless competitive-programming dashboard for teachers: pulls Codeforces, LeetCode and HackerRank history and builds a "CP Wrapped" summary.',
    github: 'https://github.com/siddharthpaul2005/codechecker',
    demo: 'https://codechecker-sand.vercel.app',
    tags: ['dev', 'React', 'Vite', 'Tailwind', 'Node', 'Express'],
    status: 'completed',
  },
  {
    id: 9,
    slug: 'blockestate',
    title: 'BlockEstate',
    description: 'Real-estate platform on Solana with smart-contract property transactions.',
    github: 'https://github.com/siddharthpaul2005/Blockestate_3.0',
    tags: ['dev', 'Solana', 'Rust', 'React'],
    status: 'completed',
  },
  {
    id: 10,
    slug: 'ai-rag-tutor',
    title: 'AI RAG Tutor',
    description: 'Retrieval-augmented generation pipeline for personalised learning, grounded in course material with source attribution.',
    github: 'https://github.com/siddharthpaul2005/Semester_mini_project_rag',
    tags: ['ML', 'Python', 'LangChain', 'Vector DB', 'OpenAI API'],
    status: 'completed',
  },
  {
    id: 11,
    slug: 'stock-price-predictor',
    title: 'Stock Price Predictor',
    description: 'Multi-stock next-day prediction from technical indicators (SMA/EMA, RSI, Bollinger Bands): up/down classification and next-day price regression with scikit-learn.',
    github: '',
    demo: 'https://colab.research.google.com/drive/1CHv8UQIuw5AckniTngmEGYw6xvfYDYne?usp=sharing',
    demoLabel: 'Colab',
    tags: ['quant', 'Python', 'scikit-learn', 'yFinance', 'Pandas'],
    status: 'completed',
  },
  {
    id: 12,
    slug: 'pairs-trading-nifty200',
    title: 'Pairs Trading on NIFTY 200',
    description:
      'Echelon Strategies’ first study: walk-forward statistical arbitrage on NIFTY 200 futures with C++ cointegration, HMM and backtest engines, full Indian F&O costs and a locked holdout.',
    github: '',
    demo: 'https://colab.research.google.com/drive/1vcKTIAkGAghPD9kDl3rGZEXVwK9nfi7Z?usp=sharing',
    demoLabel: 'Colab',
    tags: ['quant', 'C++', 'Python', 'Pandas', 'NumPy'],
    status: 'completed',
    date: '2026',
  },
  {
    id: 13,
    slug: 'aida',
    title: 'AIDA: AI, Derived Not Assumed',
    description:
      'My blog and ML knowledge repository: machine learning derived from first principles, with LaTeX proofs, PyTorch from scratch and an interactive knowledge graph.',
    github: '',
    demo: 'https://aida-derive.vercel.app/',
    tags: ['ML', 'PyTorch', 'Mathematics', 'Vercel'],
    status: 'in progress',
    date: '2026',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
