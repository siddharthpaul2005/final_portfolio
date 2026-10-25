import { Crown, Workflow, BarChart3, FolderTree, Building2, GraduationCap, LineChart, Hammer, AudioLines, Timer, ArrowLeftRight, Sigma, type LucideIcon } from 'lucide-react';
import type { IconColor } from '../components/ios/AppIcon';

// Visual identity for each project (app icon glyph + colour), keyed by slug.
export const projectIcons: Record<string, { icon: LucideIcon; color: IconColor }> = {
  disktree: { icon: FolderTree, color: 'mint' },
  'voice-rag': { icon: AudioLines, color: 'pink' },
  'multi-agent-orchestrator': { icon: Workflow, color: 'indigo' },
  'cp-companion': { icon: Timer, color: 'orange' },
  'chess-engine': { icon: Crown, color: 'black' },
  codetrack: { icon: BarChart3, color: 'blue' },
  blockestate: { icon: Building2, color: 'purple' },
  'ai-rag-tutor': { icon: GraduationCap, color: 'gray' },
  'stock-price-predictor': { icon: LineChart, color: 'green' },
  'pairs-trading-nifty200': { icon: ArrowLeftRight, color: 'indigo' },
  aida: { icon: Sigma, color: 'purple' },
};

export const fallbackIcon = { icon: Hammer, color: 'gray' as IconColor };

// The first tag of each project is its area.
export const areaLabels: Record<string, string> = {
  systems: 'Systems',
  dev: 'Product',
  ML: 'Machine Learning',
  quant: 'Quant (side interest)',
};

export const statusLabel = {
  completed: 'Shipped',
  'in progress': 'In progress',
  'in design': 'In design',
} as const;

// Tile logo per project: the main technology it's built with (brand key from components/ios/TechLogo).
// Projects with their own logo file (used instead of a tech logo).
export const projectImages: Record<string, string> = {
  alfred: '/logos/alfred.png',
};

export const projectLogos: Record<string, string> = {
  disktree: 'c++',
  'voice-rag': 'fastapi',
  'multi-agent-orchestrator': 'go',
  'cp-companion': 'tauri',
  'chess-engine': 'cmake',
  codetrack: 'react',
  blockestate: 'solana',
  'ai-rag-tutor': 'langchain',
  'stock-price-predictor': 'scikit-learn',
  'pairs-trading-nifty200': 'colab',
  aida: 'pytorch',
};
