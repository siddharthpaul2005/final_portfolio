import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { House, LayoutGrid, Radio, PenLine, User, Mail, Search, Sun, Moon, type LucideIcon } from 'lucide-react';
import AppIcon, { type IconColor } from './AppIcon';
import useUIStore from '../../store/useUIStore';
import useThemeStore from '../../store/useThemeStore';

const apps: { to: string; label: string; icon: LucideIcon; color: IconColor }[] = [
  { to: '/', label: 'Home', icon: House, color: 'gray' },
  { to: '/projects', label: 'Projects', icon: LayoutGrid, color: 'blue' },
  { to: '/now', label: 'Now', icon: Radio, color: 'green' },
  { to: '/blog', label: 'Writing', icon: PenLine, color: 'orange' },
  { to: '/about', label: 'About', icon: User, color: 'purple' },
  { to: '/contact', label: 'Contact', icon: Mail, color: 'mint' },
];

const BASE = 46;
const COMPACT_BASE = 42;
const MAX = 66;

// Phones and touch screens get a fixed-size dock (no hover to magnify with), sized so the six
// app icons always fit: 1.5rem screen margin, 2 x 8px dock padding, 5 x 6px gaps.
const COMPACT_QUERY = '(max-width: 639px), (pointer: coarse)';
const compactBaseFor = (width: number) =>
  Math.max(30, Math.min(COMPACT_BASE, Math.floor((width - 24 - 16 - 30) / apps.length)));

const useDockSize = () => {
  const read = () => ({
    compact: window.matchMedia(COMPACT_QUERY).matches,
    width: window.innerWidth,
  });
  const [state, setState] = useState(read);
  useEffect(() => {
    const update = () => setState(read());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return { compact: state.compact, base: state.compact ? compactBaseFor(state.width) : BASE };
};

// Each icon grows with proximity to the cursor, like the macOS dock.
const DockItem = ({
  mouseX,
  label,
  active,
  base,
  children,
}: {
  mouseX: MotionValue<number>;
  label: string;
  active?: boolean;
  base: number;
  children: (size: MotionValue<number>) => React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? x - (rect.left + rect.width / 2) : Infinity;
  });
  const target = useTransform(distance, [-140, 0, 140], [base, base === BASE ? MAX : base, base]);
  // Keep the spring in step when the base size changes (e.g. on resize).
  useEffect(() => {
    if (mouseX.get() === Infinity) size.jump(base);
  }, [base, mouseX]);
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

  return (
    <motion.div ref={ref} style={{ width: size }} className="group relative flex flex-col items-center justify-end">
      <span className="lg-chrome pointer-events-none absolute -top-10 hidden sm:block whitespace-nowrap rounded-lg px-2.5 py-1 text-[12px] font-medium text-foreground opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
        <span className="relative z-[2]">{label}</span>
      </span>
      {children(size)}
      <span
        className={`mt-1 h-1 w-1 rounded-full bg-foreground/70 transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}
      />
    </motion.div>
  );
};

const ScaledIcon = ({ size, base, children }: { size: MotionValue<number>; base: number; children: React.ReactNode }) => {
  const scale = useTransform(size, (s) => s / base);
  return (
    <motion.div style={{ scale, transformOrigin: 'bottom center' }} className="flex items-center justify-center">
      {children}
    </motion.div>
  );
};

const Dock = () => {
  const { pathname } = useLocation();
  const mouseX = useMotionValue(Infinity);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const { theme, toggleTheme } = useThemeStore();
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to));
  const { compact, base } = useDockSize();

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)]"
    >
      <motion.div
        onMouseMove={(e) => !compact && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.2 }}
        className="lg-chrome flex items-end gap-1.5 sm:gap-2.5 rounded-[24px] sm:rounded-[26px] px-2 sm:px-2.5 pt-2 sm:pt-2.5 pb-1"
      >
        <div className="relative z-[2] flex items-end gap-1.5 sm:gap-2.5">
          {apps.map((app) => (
            <DockItem key={app.to} mouseX={mouseX} base={base} label={app.label} active={isActive(app.to)}>
              {(size) => (
                <Link to={app.to} aria-label={app.label}>
                  <ScaledIcon size={size} base={base}>
                    <AppIcon icon={app.icon} color={app.color} size={base} />
                  </ScaledIcon>
                </Link>
              )}
            </DockItem>
          ))}

          {/* Search + theme live in the status bar on phones, where the dock is narrower. */}
          <div className="hidden sm:flex items-end gap-2.5">
          <span className="mx-0.5 mb-3 h-9 w-px self-end bg-[var(--lg-separator)]" />

          <DockItem mouseX={mouseX} base={base} label="Search  Ctrl K">
            {(size) => (
              <button type="button" aria-label="Search" onClick={() => setCommandPaletteOpen(true)}>
                <ScaledIcon size={size} base={base}>
                  <AppIcon icon={Search} color="black" size={base} />
                </ScaledIcon>
              </button>
            )}
          </DockItem>
          <DockItem mouseX={mouseX} base={base} label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {(size) => (
              <button type="button" aria-label="Toggle theme" onClick={(e) => toggleTheme(e)}>
                <ScaledIcon size={size} base={base}>
                  <AppIcon icon={theme === 'dark' ? Sun : Moon} color="indigo" size={base} />
                </ScaledIcon>
              </button>
            )}
          </DockItem>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Dock;
