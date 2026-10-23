import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

// Home-screen widget sizes on a 4-column grid (2 columns on phones).
const sizes = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-1',
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 md:col-span-4 row-span-1',
} as const;

type WidgetProps = {
  size: keyof typeof sizes;
  children: ReactNode;
  className?: string;
  to?: string;
  href?: string;
  index?: number;
  label?: string;
};

const Widget = ({ size, children, className, to, href, index = 0, label }: WidgetProps) => {
  const inner = (
    <div className={cn('lg lg-press h-full w-full overflow-hidden rounded-[28px] p-4 sm:p-5', className)}>
      <div className="relative z-[2] h-full">{children}</div>
    </div>
  );

  return (
    <motion.div
      className={cn(sizes[size], 'min-w-0')}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: 0.05 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {to ? (
        <Link to={to} aria-label={label} className="block h-full">
          {inner}
        </Link>
      ) : href ? (
        <a
          href={href}
          aria-label={label}
          target={href.startsWith('mailto:') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className="block h-full"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.div>
  );
};

export const WidgetLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-[11px] font-semibold uppercase tracking-[0.08em] text-label-2', className)}>{children}</p>
);

export default Widget;
