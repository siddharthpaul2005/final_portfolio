import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

// iOS-style app icon: gradient squircle with a glossy top highlight.
export const iconGradients = {
  gray: 'from-zinc-400 to-zinc-600',
  blue: 'from-sky-400 to-blue-600',
  green: 'from-emerald-400 to-green-600',
  mint: 'from-teal-300 to-emerald-500',
  orange: 'from-amber-400 to-orange-600',
  purple: 'from-fuchsia-400 to-violet-600',
  indigo: 'from-indigo-400 to-indigo-700',
  pink: 'from-pink-400 to-rose-600',
  red: 'from-red-400 to-red-600',
  black: 'from-zinc-700 to-zinc-950',
} as const;

export type IconColor = keyof typeof iconGradients;

type AppIconProps = {
  icon: LucideIcon;
  color: IconColor;
  size?: number;
  className?: string;
};

const AppIcon = ({ icon: Icon, color, size = 44, className }: AppIconProps) => (
  <span
    className={cn(
      'app-icon inline-flex shrink-0 items-center justify-center bg-gradient-to-b text-white',
      iconGradients[color],
      className
    )}
    style={{ width: size, height: size }}
  >
    <Icon style={{ width: size * 0.52, height: size * 0.52 }} strokeWidth={2} />
  </span>
);

export default AppIcon;
