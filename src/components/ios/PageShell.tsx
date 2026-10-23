import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// iOS "large title" screen used by the inner pages.
type PageShellProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  subtitle?: ReactNode;
  back?: { to: string; label: string };
  // Last breadcrumb segment; defaults to the title when it's plain text.
  crumb?: string;
  actions?: ReactNode;
  children: ReactNode;
  width?: 'narrow' | 'wide';
};

const PageShell = ({
  title,
  eyebrow,
  subtitle,
  back = { to: '/', label: 'Home' },
  crumb,
  actions,
  children,
  width = 'narrow',
}: PageShellProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 pt-24 md:pt-28 pb-16', width === 'wide' ? 'max-w-4xl' : 'max-w-[720px]')}>
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[13.5px] text-label-2">
        {back.to !== '/' && (
          <>
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <Link to={back.to} className="hover:text-foreground transition-colors">{back.label}</Link>
        {(crumb || typeof title === 'string') && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-foreground">{crumb ?? title}</span>
          </>
        )}
      </nav>
      {(title || eyebrow || subtitle || actions) && (
      <header className="mb-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-label-2">{eyebrow}</p>
          )}
          <h1 className="font-display text-[34px] sm:text-[44px] font-bold leading-[1.05] text-foreground">{title}</h1>
          {subtitle && <p className="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed text-label-2">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </header>
      )}
      {children}
    </div>
  );
};

export default PageShell;
