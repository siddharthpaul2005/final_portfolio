import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Mail, FileText, RefreshCw, ChevronDown, Coffee, MapPin, ArrowUpRight, Sigma, LineChart, Satellite, PenLine } from 'lucide-react';
import type { IconColor } from '../components/ios/AppIcon';
import Widget, { WidgetLabel } from '../components/ios/Widget';
import { ListRow } from '../components/ios/InsetList';
import ActivityHeatmap from '../components/ActivityHeatmap';
import LogoMark from '../components/ios/LogoMark';
import TechLogo from '../components/ios/TechLogo';
import { toolGroups } from '../data/uses';
import { GithubIcon, LinkedinIcon, XIcon } from '../components/icons/SocialIcons';
import { profile } from '../data/profile';
import { socials } from '../data/socials';
import { site, education } from '../data/site';
import { now, type NowItem } from '../data/now';
import { projects, featuredProjects } from '../data/projects';
import { skills } from '../data/skills';
import { blogPostsData } from '../data/blogs';
import { projectImages, projectLogos, statusLabel } from '../data/projectMeta';
import Tile from '../components/ios/Tile';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
} as const;

const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <h2 className="font-hanken text-[22px] font-extrabold tracking-tight text-foreground">{children}</h2>
    {action}
  </div>
);

// GitHub allows only 60 unauthenticated requests an hour per IP, so: one request per page load
// shared by every component, and the last good result cached in localStorage for 6 hours
// (a stale cached value is still shown if a fresh request fails).
type GithubStats = { repos: number; followers: number };
const GITHUB_CACHE_KEY = 'github_stats';
const GITHUB_CACHE_MS = 6 * 60 * 60 * 1000;

const readGithubCache = (): { at: number; stats: GithubStats } | null => {
  try {
    return JSON.parse(localStorage.getItem(GITHUB_CACHE_KEY) || 'null');
  } catch {
    return null;
  }
};

let githubRequest: Promise<GithubStats | null> | null = null;
const fetchGithubStats = () => {
  const cached = readGithubCache();
  if (cached && Date.now() - cached.at < GITHUB_CACHE_MS) return Promise.resolve(cached.stats);
  return (githubRequest ??= fetch(`https://api.github.com/users/${site.githubUsername}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return cached?.stats ?? null;
      const stats = { repos: d.public_repos, followers: d.followers };
      try {
        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify({ at: Date.now(), stats }));
      } catch {
        /* storage unavailable */
      }
      return stats;
    })
    .catch(() => cached?.stats ?? null));
};

const useGithubStats = () => {
  const [stats, setStats] = useState<GithubStats | null>(null);
  useEffect(() => {
    let alive = true;
    fetchGithubStats().then((s) => alive && setStats(s));
    return () => {
      alive = false;
    };
  }, []);
  return stats;
};

/* ---------- Banner + profile ---------- */

// Looping pixel-art "Creation of Adam" animation. The poster shows while it loads,
// and stays put for visitors who prefer reduced motion.
const Banner = () => {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="relative aspect-[16/9] sm:aspect-[2.4/1] w-full overflow-hidden rounded-[30px] bg-black ring-1 ring-white/10 shadow-2xl">
      {reduceMotion ? (
        <img src="/assets/banner-poster.jpg" alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          src="/assets/banner.mp4"
          poster="/assets/banner-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      )}
      {/* Soft fade at the bottom so the overlapping avatar sits cleanly */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
};

const avatars = {
  photo: { src: '/assets/siddharth-photo.jpg', label: 'photo' },
  cartoon: { src: '/assets/avaterlogo.jpg', label: 'avatar' },
} as const;
type AvatarKind = keyof typeof avatars;

// Tap to flip between the real photo and the cartoon avatar; the choice is remembered.
const AvatarSwap = ({ className = '' }: { className?: string }) => {
  const [kind, setKind] = useState<AvatarKind>(() => {
    try {
      return localStorage.getItem('avatar_kind') === 'cartoon' ? 'cartoon' : 'photo';
    } catch {
      return 'photo';
    }
  });
  const next: AvatarKind = kind === 'photo' ? 'cartoon' : 'photo';

  const swap = () => {
    setKind(next);
    try {
      localStorage.setItem('avatar_kind', next);
    } catch {
      /* storage unavailable: still swaps for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={swap}
      aria-label={`Show ${avatars[next].label}`}
      title={`Tap to show my ${avatars[next].label}`}
      className={`group relative block shrink-0 [perspective:900px] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={kind}
          src={avatars[kind].src}
          alt={profile.name}
          initial={{ rotateY: -90, opacity: 0.4 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0.4 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="h-full w-full rounded-full object-cover ring-4 ring-[var(--wallpaper-base)] shadow-xl"
        />
      </AnimatePresence>
      <span className="lg-chrome absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-transform duration-300 group-hover:rotate-180">
        <RefreshCw className="relative z-[2] h-3.5 w-3.5" />
      </span>
    </button>
  );
};

const SocialButton = ({ href, label, children }: { href: string; label: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel="noopener noreferrer"
    aria-label={label}
    className="lg lg-press flex h-10 w-10 items-center justify-center rounded-full text-label-2 hover:text-foreground"
  >
    <span className="relative z-[2]">{children}</span>
  </a>
);

const Profile = () => {
  const stats = useGithubStats();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Banner />

      <div className="relative z-10 -mt-12 sm:-mt-14 flex items-end justify-between px-3 sm:px-5">
        <AvatarSwap className="h-24 w-24 sm:h-[116px] sm:w-[116px]" />
        <a
          href={socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="lg lg-press mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-label-2 hover:text-foreground"
        >
          <span className="relative z-[2] inline-flex items-center gap-1.5">
            <GithubIcon size="13" className="stroke-current" />
            {stats ? `${stats.followers} followers · ${stats.repos} repos` : 'GitHub'}
          </span>
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 data-alfred-perch className="font-display text-[30px] sm:text-[34px] font-bold leading-tight text-foreground">{profile.name}</h1>
          <p className="mt-0.5 text-[14px] text-label-2">{profile.tagline}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-label-2">
            <MapPin className="h-3.5 w-3.5" />
            {education.institution}, {site.city} · from {site.hometown}
          </p>
        </div>
        <div className="flex gap-2">
          <SocialButton href={socials.github} label="GitHub">
            <GithubIcon size="17" className="stroke-current" />
          </SocialButton>
          <SocialButton href={socials.twitter} label="X">
            <XIcon size="14" className="fill-current" />
          </SocialButton>
          <SocialButton href={socials.linkedin} label="LinkedIn">
            <LinkedinIcon size="18" className="stroke-current" />
          </SocialButton>
          <SocialButton href={`mailto:${socials.email}`} label="Email">
            <Mail className="h-4 w-4" />
          </SocialButton>
        </div>
      </div>

      <div className="mt-8 px-1">
        <h3 className="font-hanken text-[17px] sm:text-[18px] font-bold text-foreground">
          CS undergrad, pre-final year (graduating 2028).{' '}
          <span className="text-[#1f9d45] dark:text-[#30d158]">Open to backend SWE and AI/ML roles.</span>
        </h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-label-2">{profile.bio}</p>
      </div>

      {/* What I'm building right now (static, replaces the old status-bar island) */}
      {now.active[0] && (
        <Link
          to={now.active[0].href ?? '/now'}
          className="lg lg-press mt-6 flex items-center gap-3 rounded-[18px] px-3.5 py-3"
        >
          <span className="relative z-[2] flex min-w-0 flex-1 items-center gap-3">
            <Tile img={now.active[0].img} logo={now.active[0].logo} icon={now.active[0].icon} color={now.active[0].color} size={34} />
            <span className="min-w-0">
              <span className="block text-[11.5px] font-semibold uppercase tracking-[0.06em] text-label-2">Currently building</span>
              <span className="block truncate text-[15px] font-semibold text-foreground">{now.active[0].title}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-label-2" />
          </span>
        </Link>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5 px-1">
        <Link
          to="/resume"
          className="lg lg-press inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-foreground"
        >
          <span className="relative z-[2] inline-flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Resume / CV
          </span>
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-3.5 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-85"
        >
          <img src="/assets/avaterlogo.jpg" alt="" className="h-4 w-4 rounded-full object-cover" />
          About me
        </Link>
      </div>
    </motion.section>
  );
};

/* ---------- Currently working on: lock-screen notification stack ---------- */


const Notification = ({ item }: { item: NowItem }) => {
  const body = (
    <div className="lg rounded-[22px] p-3.5 sm:p-4">
      <div className="relative z-[2] flex gap-3">
        <Tile img={item.img} logo={item.logo} icon={item.icon} color={item.color} size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-label-2">{item.kind}</p>
            <p className="text-[12px] text-label-2">now</p>
          </div>
          <p className="mt-0.5 text-[15px] font-semibold leading-snug text-foreground">{item.title}</p>
          <p className="mt-0.5 text-[13.5px] leading-snug text-label-2 line-clamp-2">{item.description}</p>
        </div>
      </div>
    </div>
  );

  if (!item.href) return body;
  return item.href.startsWith('/') ? (
    <Link to={item.href} className="block lg-press">{body}</Link>
  ) : (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="block lg-press">{body}</a>
  );
};

const NowStack = () => {
  const [open, setOpen] = useState(false);
  // Only active work goes in the stack; side interests get their own, quieter strip below.
  const [first, ...others] = now.active;
  // Expanded stack shows a handful; the full list lives on /now.
  const rest = others.slice(0, 5);

  return (
    <motion.section {...reveal}>
      <SectionTitle
        action={
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg-fill inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12.5px] font-semibold text-foreground"
          >
            {open ? 'Show less' : `${now.active.length} updates`}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        }
      >
        Currently Working On
      </SectionTitle>

      <div className="relative">
        <div className="relative z-10">
          <Notification item={first} />
        </div>

        {/* Collapsed: the rest peek out underneath like a grouped notification stack */}
        <AnimatePresence initial={false}>
          {!open && (
            <motion.button
              type="button"
              aria-label="Show all updates"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="block w-full"
            >
              <div className="lg mx-3 -mt-4 h-6 rounded-b-[20px] opacity-80" />
              <div className="lg mx-7 -mt-3 h-5 rounded-b-[18px] opacity-50" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2.5 pt-2.5">
                {rest.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: -16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Notification item={item} />
                  </motion.div>
                ))}
                <Link
                  to="/now"
                  className="flex items-center justify-center gap-1.5 pt-1 text-[13.5px] font-semibold text-[#0a84ff] hover:opacity-80"
                >
                  See everything on Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {now.side.length > 0 && (
        <Link to="/now" className="side-surface mt-5 block rounded-[20px] px-4 py-3.5 transition-opacity hover:opacity-80">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-label-2">
            <Coffee className="h-3.5 w-3.5" /> On the side · when I have time
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {now.side.map((item) => (
              <span key={item.title} className="rounded-full border border-dashed border-[var(--label-2)] px-2.5 py-1 text-[12.5px] text-label-2">
                {item.title}
              </span>
            ))}
          </div>
        </Link>
      )}
    </motion.section>
  );
};

/* ---------- Coding activity ---------- */

const CodingActivity = () => (
  <motion.section {...reveal}>
    <SectionTitle>Coding Daily</SectionTitle>
    <ActivityHeatmap />
  </motion.section>
);

/* ---------- Projects ---------- */

/* ---------- AI toolkit preview ---------- */

const toolkitTools = toolGroups.flatMap((g) => g.tools);
const shippedTools = toolkitTools.filter((t) => t.proof).length;

/* ---------- Research & writing: the blog I run and the research group I'm part of ---------- */

const outlets = [
  {
    name: 'AIDA',
    role: 'My blog · ML knowledge repository',
    pitch: 'Artificial Intelligence, Derived Not Assumed: where I write up machine learning from first principles, with LaTeX proofs and PyTorch from scratch.',
    facts: ['Blog posts', 'Formal proofs', 'Knowledge graph'],
    site: 'https://aida-derive.vercel.app/',
    more: { to: '/projects/aida', label: 'About AIDA' },
    icon: Sigma,
    color: 'purple' as IconColor,
    side: false,
  },
  {
    name: 'Echelon Strategies',
    role: 'Quant research group',
    pitch: 'A small research group I run with Ankur Saha and Souradeep Bhattacharya, studying markets as a signal-processing problem with rigorous, falsifiable studies and our own C++ tooling.',
    facts: ['Statistical arbitrage', 'First study: pairs trading'],
    site: 'https://echeleonstrategiesweb.vercel.app/',
    more: { to: '/projects/pairs-trading-nifty200', label: 'First study' },
    icon: LineChart,
    color: 'indigo' as IconColor,
    side: true,
  },
  {
    name: 'Autonomous FDIR for CubeSats',
    role: 'Research · Solid Propulsion',
    pitch: 'Joint research with a friend from Aerospace Engineering: autonomous fault detection, isolation and recovery for CubeSat satellites.',
    facts: ['Aerospace', 'Fault tolerance', 'Ongoing'],
    site: '',
    more: { to: '/now', label: 'On Now' },
    icon: Satellite,
    color: 'blue' as IconColor,
    side: false,
  },
];

const ResearchAndWriting = () => (
  <motion.section {...reveal}>
    <SectionTitle>Research &amp; Writing</SectionTitle>
    <div className="grid gap-3 sm:grid-cols-2">
      {outlets.map((v) => (
        <div
          key={v.name}
          className={`flex flex-col rounded-[24px] p-5 ${v.side ? 'side-surface' : 'lg'}`}
        >
          <div className="relative z-[2] flex h-full flex-col">
            <div className="flex items-start justify-between gap-2">
              <Tile icon={v.icon} color={v.color} size={44} />
              {v.side && (
                <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--label-2)] px-2 py-0.5 text-[11px] font-semibold text-label-2">
                  <Coffee className="h-3 w-3" /> On the side
                </span>
              )}
            </div>
            <h3 className="font-display mt-4 text-[20px] font-bold text-foreground">{v.name}</h3>
            <p className="text-[12.5px] font-medium text-label-2">{v.role}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-label-2">{v.pitch}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {v.facts.map((f) => (
                <span key={f} className="rounded-full bg-[var(--lg-tint)] px-2.5 py-1 text-[12px] font-medium text-foreground/85">{f}</span>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              {v.site && (
                <a
                  href={v.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-semibold text-background hover:opacity-85"
                >
                  Visit site <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              <Link to={v.more.to} className="text-[13px] font-semibold text-[#0a84ff] hover:opacity-80">
                {v.more.label} →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

const ToolkitPreview = () => (
  <motion.section {...reveal}>
    <SectionTitle
      action={
        <Link to="/uses" className="text-[13px] font-semibold text-[#0a84ff] hover:opacity-80">
          See all
        </Link>
      }
    >
      AI Toolkit
    </SectionTitle>
    <Link to="/uses" className="lg lg-press block rounded-[24px] p-4 sm:p-5">
      <div className="relative z-[2]">
        <div className="flex flex-wrap gap-2">
          {toolkitTools.slice(0, 12).map((t) => (
            <span key={t.name} title={t.name}>
              <LogoMark id={t.logo} size={36} />
            </span>
          ))}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-label-2">
          Model gateways, local inference, retrieval, speech and agents:{' '}
          <span className="font-semibold text-foreground">{toolkitTools.length} tools</span>,{' '}
          {shippedTools} of them used in shipped projects.
        </p>
      </div>
    </Link>
  </motion.section>
);

const ProjectsList = () => (
  <motion.section {...reveal}>
    <SectionTitle
      action={
        <Link to="/projects" className="text-[13px] font-semibold text-[#0a84ff] hover:opacity-80">
          See all
        </Link>
      }
    >
      Projects
    </SectionTitle>
    <div className="lg overflow-hidden rounded-[24px]">
      <div className="relative z-[2]">
        {featuredProjects.map((p) => {
          return (
            <ListRow
              key={p.slug}
              icon={<Tile img={projectImages[p.slug]} logo={projectLogos[p.slug]} size={40} />}
              title={p.title}
              subtitle={<span className="line-clamp-1">{p.description}</span>}
              detail={<span className="hidden sm:inline text-[12.5px]">{statusLabel[p.status]}</span>}
              to={`/projects/${p.slug}`}
              className="py-3"
            />
          );
        })}
        <ListRow
          icon={<span className="flex h-10 w-10 items-center justify-center text-[#0a84ff]"><ArrowRight className="h-5 w-5" /></span>}
          title={<span className="text-[#0a84ff]">All {projects.length} projects</span>}
          to="/projects"
        />
      </div>
    </div>
  </motion.section>
);

/* ---------- Widgets strip ---------- */

// Apple Watch-style Activity Rings for project progress: shipped / building / designing,
// each as a share of all projects.
const ringColors = { shipped: '#fa114f', building: '#a6ff00', designing: '#00d8ff' } as const;

const ActivityRingsWidget = () => {
  const total = projects.length;
  const count = (status: string) => projects.filter((p) => p.status === status).length;
  const rings = [
    { key: 'shipped', label: 'Shipped', value: count('completed'), color: ringColors.shipped, r: 40 },
    { key: 'building', label: 'Building', value: count('in progress'), color: ringColors.building, r: 29 },
    { key: 'designing', label: 'Designing', value: count('in design'), color: ringColors.designing, r: 18 },
  ];

  return (
    <Widget size="small" index={0} to="/projects" label="Project progress" className="lg-dark text-white">
      <div className="flex h-full flex-col">
        <WidgetLabel className="!text-white/60">Projects</WidgetLabel>
        <div className="mt-auto flex items-end justify-between gap-2">
          <svg viewBox="0 0 100 100" className="h-[74px] w-[74px] sm:h-[80px] sm:w-[80px] -rotate-90" aria-hidden="true">
            {rings.map((ring) => {
              const circumference = 2 * Math.PI * ring.r;
              const progress = total ? ring.value / total : 0;
              return (
                <g key={ring.key}>
                  <circle cx="50" cy="50" r={ring.r} fill="none" stroke={ring.color} strokeOpacity={0.2} strokeWidth="9" />
                  {/* Final value is the static style; the CSS animation only draws it in. */}
                  <circle
                    cx="50"
                    cy="50"
                    r={ring.r}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    className="ring-draw"
                    style={
                      {
                        strokeDashoffset: circumference * (1 - Math.max(progress, 0.02)),
                        '--ring-full': circumference,
                      } as React.CSSProperties
                    }
                  />
                </g>
              );
            })}
          </svg>
          <ul className="space-y-0.5 text-right">
            {rings.map((ring) => (
              <li key={ring.key} className="text-[12px] leading-tight">
                <span className="font-display text-[17px] font-bold" style={{ color: ring.color }}>
                  {ring.value}
                </span>
                <span className="ml-1 text-white/60">{ring.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Widget>
  );
};

const GithubWidget = () => {
  const stats = useGithubStats();
  return (
    <Widget size="small" index={1} href={socials.github} label="GitHub" className="lg-dark text-white">
      <div className="flex h-full flex-col">
        <GithubIcon size="24" className="stroke-white" />
        <div className="mt-auto">
          {stats ? (
            <>
              <p className="font-display text-[28px] font-bold leading-none">{stats.repos}</p>
              <p className="mt-1 text-[12px] text-white/60">public repos</p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-semibold leading-tight">@{site.githubUsername}</p>
              <p className="mt-1 text-[12px] text-white/60">View profile →</p>
            </>
          )}
        </div>
      </div>
    </Widget>
  );
};

const StatusWidget = () => (
  <Widget size="small" index={2} to="/contact" label="Contact about internships">
    <div className="flex h-full flex-col">
      <WidgetLabel>Class of</WidgetLabel>
      <div className="mt-auto">
        <p className="font-display text-[30px] font-bold leading-none text-foreground">2028</p>
        <p className="mt-1.5 text-[12px] font-semibold leading-snug text-[#0a84ff]">Backend · AI/ML roles →</p>
      </div>
    </div>
  </Widget>
);

const WritingWidget = () => {
  // Newest post hosted on this site (Medium posts are listed on /blog).
  const [slug, post] =
    Object.entries(blogPostsData)
      .filter(([, p]) => !p.externalUrl)
      .sort(([, a], [, b]) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? [];
  return (
    <Widget size="small" index={3} to={slug ? `/blog/${slug}` : '/blog'} label="Latest writing">
      <div className="flex h-full flex-col">
        <Tile icon={PenLine} color="orange" size={34} />
        <div className="mt-auto min-w-0">
          <WidgetLabel className="mb-1">Latest post</WidgetLabel>
          <p className="text-[13.5px] font-semibold leading-snug text-foreground line-clamp-2">
            {post ? post.title : 'Writing soon'}
          </p>
        </div>
      </div>
    </Widget>
  );
};

const Widgets = () => (
  <section>
    <SectionTitle>At a Glance</SectionTitle>
    <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[150px] sm:auto-rows-[160px] gap-3">
      <ActivityRingsWidget />
      <GithubWidget />
      <StatusWidget />
      <WritingWidget />
    </div>
  </section>
);

/* ---------- Stack ---------- */

const Stack = () => {
  const items = Array.from(new Set(skills.flatMap((s) => s.items)));
  return (
    <motion.section {...reveal}>
      <SectionTitle>Tech Stack</SectionTitle>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="lg rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground">
            <span className="relative z-[2] inline-flex items-center gap-1.5">
              <TechLogo name={item} size={14} />
              {item}
            </span>
          </span>
        ))}
      </div>
      {/* Focus vs. side interests, kept visually distinct */}
      <div className="mt-6 grid gap-3 sm:grid-cols-[1.4fr_1fr]">
        <div className="lg rounded-[20px] px-4 py-3.5">
          <div className="relative z-[2]">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#0a84ff]">Focus</p>
            <ul className="mt-2 space-y-1">
              {profile.focus.map((f) => (
                <li key={f} className="text-[14px] font-medium text-foreground">{f}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="side-surface rounded-[20px] px-4 py-3.5">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-label-2">
            <Coffee className="h-3.5 w-3.5" /> On the side
          </p>
          <ul className="mt-2 space-y-1">
            {profile.side.map((s) => (
              <li key={s} className="text-[14px] text-label-2">{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

/* ---------- Call to action ---------- */

const GetInTouch = () => (
  <motion.section {...reveal}>
    <div className="lg relative overflow-hidden rounded-[30px] px-6 py-10 text-center">
      <div className="relative z-[2]">
        <h2 className="font-display text-[28px] sm:text-[36px] font-bold leading-tight text-foreground">
          Working on something?
          <span className="block text-label-2">Let's build it.</span>
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <a
            href={`mailto:${socials.email}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0a84ff] px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg shadow-[#0a84ff]/25 hover:opacity-90"
          >
            <Mail className="h-4 w-4" /> Email me
          </a>
          <Link
            to="/contact"
            className="lg-fill inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold text-foreground hover:opacity-80"
          >
            Send a message <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  </motion.section>
);

/* ---------- Page ---------- */

const Home = () => (
  <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6 pt-20 sm:pt-24 pb-12 space-y-14 sm:space-y-16">
    <Profile />
    <NowStack />
    <CodingActivity />
    <ProjectsList />
    <ResearchAndWriting />
    <ToolkitPreview />
    <Widgets />
    <Stack />
    <GetInTouch />
  </div>
);

export default Home;
