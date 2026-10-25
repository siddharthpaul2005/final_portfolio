import type { ReactNode } from 'react';
import { Mail, GraduationCap, LineChart, Sigma, Zap, BookOpen, Radio, FileText, Trophy, Images } from 'lucide-react';
import PageShell from '../components/ios/PageShell';
import { InsetGroup, ListRow } from '../components/ios/InsetList';
import { GithubIcon, LinkedinIcon, XIcon } from '../components/icons/SocialIcons';
import { profile } from '../data/profile';
import { socials } from '../data/socials';
import { skills } from '../data/skills';
import { education } from '../data/site';
import { sources } from '../data/personal';
import TechLogo from '../components/ios/TechLogo';
import Tile from '../components/ios/Tile';

// Tiles for the focus / side lists: a real logo where one fits, otherwise an app icon.
const focusTile = (f: string) =>
  f.startsWith('Backend') ? { logo: 'go' }
  : f.startsWith('Systems') ? { logo: 'c++' }
  : f.startsWith('Applied') ? { logo: 'pytorch' }
  : f.startsWith('DSA') ? { logo: 'codeforces' }
  : { icon: GraduationCap, color: 'orange' as const };
const sideIcon = (s: string) => (s.startsWith('Quant') ? LineChart : s.startsWith('Stochastic') ? Sigma : Zap);

// Round action buttons under the name, like the iOS Contacts card.
const Action = ({ href, label, children }: { href: string; label: string; children: ReactNode }) => (
  <a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel="noopener noreferrer"
    className="group flex w-[72px] flex-col items-center gap-1.5"
  >
    <span className="lg lg-press flex h-12 w-12 items-center justify-center rounded-full text-[#0a84ff]">
      <span className="relative z-[2]">{children}</span>
    </span>
    <span className="text-[12px] font-medium text-[#0a84ff]">{label}</span>
  </a>
);

const About = () => (
  <PageShell title={null} crumb="About">
    {/* Contact card header */}
    <div className="mb-10 flex flex-col items-center text-center">
      <img
        src="/assets/siddharth-photo.jpg"
        alt={profile.name}
        className="h-32 w-32 rounded-full object-cover object-[50%_35%] shadow-xl ring-4 ring-white/30"
      />
      <h1 className="font-display mt-4 text-[32px] sm:text-[40px] font-bold leading-tight text-foreground">
        {profile.name}
      </h1>
      <p className="mt-1 text-[15px] text-label-2">{profile.tagline}</p>
      <div className="mt-6 flex justify-center gap-2">
        <Action href={`mailto:${socials.email}`} label="mail">
          <Mail className="h-5 w-5" />
        </Action>
        <Action href={socials.github} label="github">
          <GithubIcon size="20" className="stroke-[#0a84ff]" />
        </Action>
        <Action href={socials.linkedin} label="linkedin">
          <LinkedinIcon size="20" className="stroke-[#0a84ff]" />
        </Action>
        <Action href={socials.twitter} label="x">
          <XIcon size="16" className="fill-[#0a84ff]" />
        </Action>
      </div>
    </div>

    <InsetGroup title="About">
      <div className="space-y-3 px-4 py-4 text-[15px] leading-relaxed text-label-2">
        <p className="text-foreground">
          I'm not a tutorial-completer. Every project I build is there to understand something deeply, not to add a
          line item.
        </p>
        <p>
          For DiskTree I wrote my own arena allocator and thread pool instead of leaning on the heap and a thread per
          directory. For voice search I fused BM25 and dense retrieval by hand and replaced LLM generation with
          extractive answers to stay under 200 ms. For my agent daemon I defined the gRPC contracts from first
          principles rather than reaching for a framework.
        </p>
        <p>
          I don't have years of internship experience. What I have is a genuine obsession with how systems work, a
          track record of building things that are non-trivially hard, and the discipline to sit with a hard problem
          until I understand it.
        </p>
        <p>{profile.status}</p>
        <p className="text-label-2/80">{profile.sideNote}</p>
      </div>
    </InsetGroup>

    <InsetGroup title="Education">
      <ListRow
        icon={<Tile icon={GraduationCap} color="blue" size={34} />}
        title={education.degree}
        subtitle={`${education.institution} · ${education.years} · CGPA ${education.cgpa}`}
        href={education.institutionUrl || undefined}
      />
      <div className="ios-row relative px-4 py-3">
        <p className="mb-2 text-[13px] text-label-2">Relevant coursework</p>
        <div className="flex flex-wrap gap-1.5">
          {education.coursework.map((c) => (
            <span key={c} className="lg-fill rounded-full px-2.5 py-1 text-[12.5px] font-medium text-foreground">
              {c}
            </span>
          ))}
        </div>
      </div>
    </InsetGroup>

    <InsetGroup title="Stack">
      {skills.map((group) => (
        <div key={group.category} className="ios-row relative flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-4 py-3">
          <span className="w-28 shrink-0 pt-1 text-[13px] font-medium text-label-2">{group.category}</span>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <span key={item} className="lg-fill inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-medium text-foreground">
                <TechLogo name={item} size={13} />
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </InsetGroup>

    <InsetGroup title="Focus" footer="What I actively work on.">
      {profile.focus.map((f) => (
        <ListRow key={f} icon={<Tile {...focusTile(f)} size={34} />} title={f} />
      ))}
    </InsetGroup>

    <InsetGroup title="On the side" variant="side" footer="Things I explore when I have time. Not my main focus.">
      {profile.side.map((s) => (
        <ListRow
          key={s}
          icon={<Tile icon={sideIcon(s)} size={34} dashed />}
          title={<span className="text-foreground/80">{s}</span>}
        />
      ))}
    </InsetGroup>


    {sources.map((s) => (
      <InsetGroup key={s.group} title={s.group}>
        {s.items.map((item) => (
          <ListRow
            key={item.title}
            icon={<Tile logo={item.logo} icon={s.group === 'Courses' ? GraduationCap : BookOpen} color={s.group === 'Courses' ? 'blue' : 'orange'} size={34} />}
            title={item.title}
            subtitle={item.by}
          />
        ))}
      </InsetGroup>
    ))}

    <InsetGroup title="More">
      <ListRow icon={<Tile icon={Radio} color="green" size={34} />} title="Now" subtitle="What I'm working on" to="/now" />
      <ListRow icon={<Tile icon={FileText} color="red" size={34} />} title="Resume" to="/resume" />
      <ListRow icon={<Tile icon={Trophy} color="orange" size={34} />} title="Achievements" to="/certificates" />
      <ListRow icon={<Tile icon={Images} color="pink" size={34} />} title="Gallery" to="/photos" />
      <ListRow icon={<Tile logo="openai" size={34} />} title="AI Toolkit" subtitle="Models, retrieval, inference and agents" to="/uses" />
    </InsetGroup>

  </PageShell>
);

export default About;
