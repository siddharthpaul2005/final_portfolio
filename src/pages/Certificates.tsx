import { useState } from 'react';
import { ChevronDown, Award, Trophy } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from '../components/ios/PageShell';
import AppIcon from '../components/ios/AppIcon';
import { InsetGroup } from '../components/ios/InsetList';
import Sponsors from '../components/ui/Sponsors';
import { certificates, achievements } from '../data/achievements';

type Entry = { title: string; source: string; date: string; href?: string; details: string[] };

// Expandable row: tap to reveal details, like a disclosure cell.
const ExpandableRow = ({ entry, icon }: { entry: Entry; icon: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ios-row relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3.5 px-4 py-3 text-left hover:bg-[var(--lg-hover)] transition-colors"
      >
        {icon}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-foreground leading-snug">{entry.title}</p>
          <p className="mt-0.5 text-[13px] text-label-2">
            {entry.source} · {entry.date}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-label-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="space-y-1.5 pb-4 pl-[3.75rem] pr-4 text-[13.5px] leading-relaxed text-label-2">
              {entry.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
              {entry.href && (
                <li>
                  <a href={entry.href} target="_blank" rel="noopener noreferrer" className="text-[#0a84ff]">
                    View credential
                  </a>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Certificates = () => (
  <PageShell title="Achievements" subtitle="Open source, academics, contests and certifications." back={{ to: '/about', label: 'About' }}>
    {achievements.length > 0 && (
    <InsetGroup title={`Achievements · ${achievements.length}`}>
      {achievements.map((a, i) => (
        <ExpandableRow
          key={i}
          entry={{ ...a, source: a.organization }}
          icon={<AppIcon icon={Trophy} color="orange" size={32} />}
        />
      ))}
    </InsetGroup>
    )}

    {certificates.length > 0 && (
    <InsetGroup title={`Certifications · ${certificates.length}`}>
      {certificates.map((c, i) => (
        <ExpandableRow key={i} entry={{ ...c, source: c.issuer }} icon={<AppIcon icon={Award} color="blue" size={32} />} />
      ))}
    </InsetGroup>
    )}

    <Sponsors />
  </PageShell>
);

export default Certificates;
