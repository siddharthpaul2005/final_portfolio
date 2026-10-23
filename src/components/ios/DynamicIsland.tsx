import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { now } from '../../data/now';

// Black pill that expands on hover to show what's being built right now.
const DynamicIsland = ({ className = '' }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const current = now.active[0];

  return (
    <Link
      to="/now"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={`Now ${current.kind.toLowerCase()}: ${current.title}`}
      className={`inline-block min-w-0 max-w-full ${className}`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ borderRadius: open ? 24 : 22 }}
        className="max-w-full bg-black text-white shadow-[0_10px_34px_rgba(0,0,0,0.35)] ring-1 ring-white/10 overflow-hidden"
      >
        <motion.div layout="position" className="flex min-w-0 items-center gap-2 px-3.5 py-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#30d158]" />
          </span>
          <span className="block min-w-0 truncate text-[12.5px] font-medium tracking-tight whitespace-nowrap">
            <span className="hidden sm:inline text-white/55">Now {current.kind.toLowerCase()} </span>
            {current.title}
          </span>
        </motion.div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="px-4 pb-3.5 max-w-[300px]"
            >
              <p className="text-[12.5px] leading-relaxed text-white/70">{current.description}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#30d158]">
                Everything I'm working on <ArrowUpRight className="w-3.5 h-3.5" />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default DynamicIsland;
