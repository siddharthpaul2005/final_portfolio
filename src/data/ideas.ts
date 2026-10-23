/**
 * "On the workbench": ideas I plan to build in my free time. No proof of work yet, so they are
 * shown separately from projects. Move an entry into projects.ts once it has a repo.
 */

export type Idea = {
  title: string;
  pitch: string;
  stack: string[];
};

export const ideas: Idea[] = [
  {
    title: 'FORGE',
    pitch: 'A social platform for programmers, a hybrid of LinkedIn and Twitter built around code, projects and reputation.',
    stack: ['Elixir', 'Phoenix', 'Neo4j', 'Meilisearch', 'NATS JetStream'],
  },
  {
    title: 'File Encryptor',
    pitch: 'A CLI/TUI with a self-describing authenticated encryption format: AES-256 by hand first, then libsodium AES-256-GCM.',
    stack: ['C++', 'libsodium'],
  },
  {
    title: 'End-to-end encrypted chat',
    pitch: 'A Zero Trust chat app with a Go and Elixir backend, a Redux web client and a Flutter mobile app.',
    stack: ['Go', 'Elixir', 'Flutter'],
  },
  {
    title: 'Speech-to-text from scratch',
    pitch: 'Training a transcription model from first principles.',
    stack: ['PyTorch'],
  },
  {
    title: 'Neural network from scratch',
    pitch: 'Forward and backward passes with no framework, to understand training end to end.',
    stack: ['C++'],
  },
];
