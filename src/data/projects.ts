export type ProjectStatus = 'completed' | 'in progress' | 'in design';

export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  github: string; // empty string hides the link
  demo?: string;
  image?: string;
  tags: string[]; // first tag is the area: systems | dev | ML | quant
  status: ProjectStatus;
  date?: string;
  // Featured projects (the ones on the resume) are listed first and highlighted.
  featured?: boolean;
};

export const projects: Project[] = [
  // ---- Featured (from the resume) ----
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
      'Local-first, always-on Go daemon that supervises polyglot AI agents as isolated OS processes, with typed gRPC/Protobuf contracts.',
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
    description: 'Multi-stock price and movement prediction from historical data, comparing Linear Regression, Random Forest and an LSTM prototype.',
    github: '',
    demo: '', // PLACEHOLDER: Colab notebook link
    tags: ['quant', 'Python', 'scikit-learn', 'yFinance', 'Pandas'],
    status: 'completed',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
