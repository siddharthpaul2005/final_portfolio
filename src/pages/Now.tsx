import { Hammer, PencilRuler, BookOpen, Search, GitPullRequest, Coffee, type LucideIcon } from 'lucide-react';
import PageShell from '../components/ios/PageShell';
import AppIcon, { type IconColor } from '../components/ios/AppIcon';
import { InsetGroup, ListRow } from '../components/ios/InsetList';
import { now, type NowItem, type NowKind } from '../data/now';

const kinds: { kind: NowKind; icon: LucideIcon; color: IconColor }[] = [
  { kind: 'Building', icon: Hammer, color: 'green' },
  { kind: 'Designing', icon: PencilRuler, color: 'purple' },
  { kind: 'Learning', icon: BookOpen, color: 'blue' },
  { kind: 'Contributing', icon: GitPullRequest, color: 'pink' },
  { kind: 'Looking for', icon: Search, color: 'orange' },
];

const linkProps = (item: NowItem) => ({
  to: item.href?.startsWith('/') ? item.href : undefined,
  href: item.href && !item.href.startsWith('/') ? item.href : undefined,
});

const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-5 mt-2 px-1">
    <h2 className="font-display text-[24px] font-bold text-foreground">{title}</h2>
    <p className="mt-0.5 text-[14px] text-label-2">{subtitle}</p>
  </div>
);

const Now = () => (
  <PageShell eyebrow={`Updated ${now.updated}`} title="Now" subtitle={now.description}>
    <SectionHeading title="Focus" subtitle="What I'm actively working on." />
    {kinds.map(({ kind, icon, color }) => {
      const items = now.active.filter((item) => item.kind === kind);
      if (items.length === 0) return null;
      return (
        <InsetGroup key={kind} title={kind}>
          {items.map((item) => (
            <ListRow
              key={item.title}
              icon={<AppIcon icon={icon} color={color} size={32} />}
              title={item.title}
              subtitle={
                <>
                  <span className="block">{item.description}</span>
                  <span className="mt-1.5 block text-[12px] font-medium text-label-2/80">{item.tags.join(' · ')}</span>
                </>
              }
              {...linkProps(item)}
              className="py-3.5"
            />
          ))}
        </InsetGroup>
      );
    })}

    {now.side.length > 0 && (
      <>
        <div className="mt-12">
          <SectionHeading title="On the side" subtitle="Things I explore when I have time. Not my main focus." />
        </div>
        <InsetGroup variant="side">
          {now.side.map((item) => (
            <ListRow
              key={item.title}
              icon={
                <span className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-dashed border-[var(--label-2)] text-label-2">
                  <Coffee className="h-4 w-4" />
                </span>
              }
              title={<span className="text-foreground/85">{item.title}</span>}
              subtitle={
                <>
                  <span className="block">{item.description}</span>
                  <span className="mt-1.5 block text-[12px] font-medium text-label-2/80">{item.tags.join(' · ')}</span>
                </>
              }
              {...linkProps(item)}
              className="py-3.5"
            />
          ))}
        </InsetGroup>
      </>
    )}
  </PageShell>
);

export default Now;
