import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from '../components/ios/PageShell';
import Segmented from '../components/ios/Segmented';
import { projects } from '../data/projects';
import { ideas } from '../data/ideas';
import { InsetGroup } from '../components/ios/InsetList';
import { projectImages, projectLogos, areaLabels, statusLabel } from '../data/projectMeta';
import Tile from '../components/ios/Tile';

type Filter = 'all' | 'featured' | keyof typeof areaLabels;

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'featured', label: 'Featured' },
  ...Object.entries(areaLabels)
    .filter(([key]) => projects.some((p) => p.tags[0] === key))
    .map(([value, label]) => ({ value: value as Filter, label })),
];

const statusTone = {
  completed: 'text-[#1f9d45] dark:text-[#30d158]',
  'in progress': 'text-[#0a84ff]',
  'in design': 'text-[#bf5af2]',
} as const;

const AllProjects = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = projects.filter(
    (p) => filter === 'all' || (filter === 'featured' ? p.featured : p.tags[0] === filter)
  );

  return (
    <PageShell
      width="wide"
      eyebrow={`${projects.length} projects`}
      title="Projects"
      subtitle="Backend, systems and AI/ML work, mostly built from scratch."
    >
      <div className="mb-6">
        <Segmented id="projects" options={filters} value={filter} onChange={setFilter} />
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => {
            return (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              >
                <Link to={`/projects/${project.slug}`} className="block h-full">
                  <div className="lg lg-press h-full rounded-[24px] p-4 sm:p-5">
                    <div className="relative z-[2] flex gap-4">
                      <Tile img={projectImages[project.slug]} logo={projectLogos[project.slug]} size={60} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate text-[17px] font-semibold text-foreground">{project.title}</h2>
                            <p className="text-[13px] text-label-2">
                              {areaLabels[project.tags[0]] ?? 'Project'}
                              {project.featured && (
                                <span className="ml-2 rounded-full bg-[#ff9f0a]/15 px-2 py-0.5 text-[11px] font-semibold text-[#c77700] dark:text-[#ff9f0a]">
                                  Featured
                                </span>
                              )}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[#0a84ff]/12 dark:bg-white/12 px-3.5 py-1 text-[13px] font-bold text-[#0a84ff] dark:text-white">
                            VIEW
                          </span>
                        </div>
                        <p className="mt-2.5 text-[13.5px] leading-relaxed text-label-2 line-clamp-2">{project.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                          <span className={`font-semibold ${statusTone[project.status]}`}>{statusLabel[project.status]}</span>
                          <span className="text-label-2">{project.tags.slice(1, 4).join(' · ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Ideas without a repo yet, kept apart from shipped work */}
      {ideas.length > 0 && (
        <section className="mt-14">
          <InsetGroup
            title="On the workbench"
            footer="Ideas I'm planning to build in my free time. They move up to Projects once there's code to show."
          >
            {ideas.map((idea) => (
              <div key={idea.title} className="ios-row relative flex items-start gap-3.5 px-4 py-3.5">
                <Tile logo={idea.stack[0].toLowerCase()} size={32} dashed className="mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-foreground">{idea.title}</p>
                    <span className="rounded-full bg-[var(--lg-tint)] px-2 py-0.5 text-[11px] font-semibold text-label-2">Planned</span>
                  </div>
                  <p className="mt-0.5 text-[13.5px] leading-snug text-label-2">{idea.pitch}</p>
                  <p className="mt-1 text-[12px] text-label-2/80">{idea.stack.join(' · ')}</p>
                </div>
              </div>
            ))}
          </InsetGroup>
        </section>
      )}
    </PageShell>
  );
};

export default AllProjects;
