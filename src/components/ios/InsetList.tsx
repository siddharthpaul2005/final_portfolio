import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// iOS Settings-style grouped list.
// variant="side" marks secondary, when-I-have-time content: dashed outline, no glass, muted.
export const InsetGroup = ({
  title,
  footer,
  children,
  className,
  variant = 'default',
}: {
  title?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'side';
}) => (
  <section className={cn('mb-8', className)}>
    {title && (
      <h3 className="px-4 mb-2 text-[13px] font-medium uppercase tracking-[0.06em] text-label-2">{title}</h3>
    )}
    <div
      className={cn(
        'overflow-hidden rounded-[22px]',
        variant === 'side' ? 'side-surface opacity-90' : 'lg'
      )}
    >
      <div className="relative z-[2]">{children}</div>
    </div>
    {footer && <p className="px-4 mt-2 text-[13px] text-label-2 leading-relaxed">{footer}</p>}
  </section>
);

type RowProps = {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  className?: string;
};

export const ListRow = ({ icon, title, subtitle, detail, to, href, onClick, trailing, className }: RowProps) => {
  const interactive = Boolean(to || href || onClick);
  const content = (
    <div
      className={cn(
        'relative flex items-center gap-3.5 px-4 py-3 min-h-[52px] transition-colors',
        interactive && 'hover:bg-[var(--lg-hover)] cursor-pointer',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium text-foreground leading-snug">{title}</div>
        {subtitle && <div className="mt-0.5 text-[13px] text-label-2 leading-snug">{subtitle}</div>}
      </div>
      {detail && <span className="shrink-0 text-[14px] text-label-2">{detail}</span>}
      {trailing}
      {to && <ChevronRight className="w-4 h-4 shrink-0 text-label-2" />}
      {href && <ArrowUpRight className="w-4 h-4 shrink-0 text-label-2" />}
    </div>
  );

  // The wrapper carries .ios-row so the separator CSS (.ios-row + .ios-row) sees siblings.
  if (to)
    return (
      <Link to={to} className="ios-row block relative">
        {content}
      </Link>
    );
  if (href)
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className="ios-row block relative"
      >
        {content}
      </a>
    );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className="ios-row block relative w-full text-left">
        {content}
      </button>
    );
  return <div className="ios-row relative">{content}</div>;
};
