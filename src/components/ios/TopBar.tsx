import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sun, Moon } from 'lucide-react';
import DynamicIsland from './DynamicIsland';
import useUIStore from '../../store/useUIStore';
import useThemeStore from '../../store/useThemeStore';
import { site } from '../../data/site';

const formatTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone }).format(new Date());

export const useClock = (intervalMs = 10_000) => {
  const [time, setTime] = useState(formatTime);
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return time;
};

// iOS-style status bar: time, Dynamic Island, and quick actions on phones (the dock has them on desktop).
const TopBar = () => {
  const time = useClock();
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setCommandPaletteOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Progressive blur so content scrolling underneath fades out instead of colliding. */}
      <div
        className="absolute inset-x-0 top-0 h-20 backdrop-blur-xl"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 40%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 40%, transparent)',
          background: 'linear-gradient(to bottom, var(--wallpaper-base), transparent)',
        }}
      />
      {/* items-start: when the island expands on hover, the time and search hint stay pinned to the top row */}
      <div className="relative mx-auto flex max-w-[720px] items-start gap-3 px-4 sm:px-6 pt-3">
        <Link to="/" className="pointer-events-auto flex h-9 w-16 shrink-0 items-center text-[14px] font-semibold tabular-nums text-foreground sm:flex-1">
          {time}
        </Link>
        <div className="flex min-w-0 flex-1 justify-center pointer-events-auto">
          <DynamicIsland />
        </div>
        <div className="pointer-events-auto flex h-9 w-16 shrink-0 items-center justify-end gap-1 sm:flex-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-label-2 hover:text-foreground hover:bg-[var(--lg-tint)] transition-colors sm:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={(e) => toggleTheme(e)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-label-2 hover:text-foreground hover:bg-[var(--lg-tint)] transition-colors sm:hidden"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <span className="hidden sm:inline text-[12px] text-label-2">
            <kbd className="rounded-md bg-[var(--lg-tint)] px-1.5 py-0.5 font-sans">Ctrl K</kbd> to search
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
