import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GithubIcon } from '../components/icons/SocialIcons';
import PageShell from '../components/ios/PageShell';
import AppIcon from '../components/ios/AppIcon';
import { projects } from '../data/projects';
import { projectIcons, fallbackIcon, areaLabels, statusLabel } from '../data/projectMeta';

const mdxModules = import.meta.glob('../content/projects/*.mdx', { eager: true });

const mdxComponents = {
  h2: (props: any) => (
    <h2 className="font-display mt-10 mb-4 text-[22px] sm:text-[26px] font-bold text-foreground" {...props} />
  ),
  h3: (props: any) => <h3 className="mt-6 mb-3 text-[17px] font-semibold text-foreground" {...props} />,
  p: (props: any) => <p className="mb-4 text-[15px] leading-relaxed text-label-2" {...props} />,
  ul: (props: any) => <ul className="lg rounded-[22px] mb-6 divide-y divide-[var(--lg-separator)] overflow-hidden" {...props} />,
  li: (props: any) => (
    <li className="relative z-[2] px-4 py-3 text-[14.5px] leading-relaxed text-label-2 list-none" {...props} />
  ),
  strong: (props: any) => <strong className="font-semibold text-foreground" {...props} />,
  a: (props: any) => <a className="text-[#0a84ff] hover:underline" {...props} />,
  code: (props: any) => <code className="lg-fill rounded-md px-1.5 py-0.5 text-[13px] text-foreground" {...props} />,
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  const MdxContent = useMemo(() => {
    const mod = mdxModules[`../content/projects/${slug}.mdx`] as any;
    return mod ? mod.default : null;
  }, [slug]);

  if (!project) {
    return (
      <PageShell title="Not found" back={{ to: '/projects', label: 'Projects' }}>
        <Link to="/projects" className="text-[#0a84ff]">Back to all projects</Link>
      </PageShell>
    );
  }

  const meta = projectIcons[project.slug] ?? fallbackIcon;
  const info = [
    { label: 'Status', value: statusLabel[project.status] },
    { label: 'Area', value: areaLabels[project.tags[0]] ?? 'Project' },
    { label: 'Stack', value: project.tags.slice(1, 3).join(', ') || '—' },
  ];

  return (
    <PageShell title={null} crumb={project.title} back={{ to: '/projects', label: 'Projects' }}>
      {/* App Store-style header */}
      <div className="flex items-start gap-5">
        <AppIcon icon={meta.icon} color={meta.color} size={112} className="hidden sm:inline-flex" />
        <AppIcon icon={meta.icon} color={meta.color} size={88} className="sm:hidden" />
        <div className="min-w-0 flex-1 pt-1">
          <h1 className="font-display text-[26px] sm:text-[34px] font-bold leading-tight text-foreground">{project.title}</h1>
          <p className="mt-1 text-[15px] text-label-2 line-clamp-2">{project.description}</p>
          {project.date && <p className="mt-1 text-[13px] text-label-2">{project.date}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#0a84ff] px-5 py-1.5 text-[14px] font-bold text-white hover:opacity-90"
              >
                OPEN
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="lg-fill inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[14px] font-semibold text-foreground hover:opacity-80"
              >
                <GithubIcon size="14" className="stroke-current" /> Source
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="mt-7 grid grid-cols-3 border-y border-[var(--lg-separator)] py-3">
        {info.map((item, i) => (
          <div key={item.label} className={`px-2 text-center ${i > 0 ? 'border-l border-[var(--lg-separator)]' : ''}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-label-2">{item.label}</p>
            <p className="mt-1 truncate text-[15px] font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      {project.image && (
        <div className="lg mt-8 overflow-hidden rounded-[24px] p-1.5">
          <img src={project.image} alt={project.title} className="relative z-[2] w-full rounded-[20px]" />
        </div>
      )}

      <article className="mt-8">
        {MdxContent ? (
          <MdxContent components={mdxComponents} />
        ) : (
          <p className="text-label-2">Details coming soon.</p>
        )}
      </article>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.slice(1).map((tag) => (
          <span key={tag} className="lg-fill rounded-full px-3 py-1 text-[12.5px] font-medium text-foreground">
            {tag}
          </span>
        ))}
      </div>
    </PageShell>
  );
};

export default ProjectDetail;
