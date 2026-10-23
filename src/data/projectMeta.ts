import { Crown, Workflow, BarChart3, FolderTree, Building2, GraduationCap, LineChart, Hammer, AudioLines, Timer, type LucideIcon } from 'lucide-react';
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
