import type { LucideIcon } from 'lucide-react';
import TechLogo, { hasTechLogo } from './TechLogo';
import AppIcon, { type IconColor } from './AppIcon';
import { cn } from '../../lib/utils';

// Icon for any item. Real logos win: an image file (`img`, e.g. Alfred) or a brand logo
// (`logo`) in the AI Toolkit-style white tile. Without a logo it falls back to the coloured
// app icon (`icon` + `color`). `dashed` marks side-interest items.
type TileProps = {
  logo?: string;
  img?: string;
  icon?: LucideIcon;
  color?: IconColor;
  size?: number;
  dashed?: boolean;
  className?: string;
};

const Tile = ({ logo, img, icon, color = 'gray', size = 34, dashed, className }: TileProps) => {
  const radius = Math.round(size * 0.27);

  if (!img && !(logo && hasTechLogo(logo)) && icon) {
    if (dashed) {
      const Icon = icon;
      return (
        <span
          className={cn('inline-flex shrink-0 items-center justify-center border border-dashed border-[var(--label-2)] text-label-2', className)}
          style={{ width: size, height: size, borderRadius: radius }}
        >
          <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
        </span>
      );
    }
    return <AppIcon icon={icon} color={color} size={size} className={className} />;
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden',
        dashed
          ? 'border border-dashed border-[var(--label-2)] bg-transparent'
          : 'bg-white ring-1 ring-black/5 dark:bg-zinc-800 dark:ring-white/10',
        img && 'bg-white dark:bg-white',
        className
      )}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {img ? (
        <img src={img} alt="" className="h-full w-full object-contain" />
      ) : logo && hasTechLogo(logo) ? (
        <TechLogo name={logo} size={Math.round(size * 0.58)} />
      ) : null}
    </span>
  );
};

export default Tile;
