import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { commentService } from '../../lib/supabase';
import { site } from '../../data/site';
import { socials } from '../../data/socials';
import { GithubIcon, LinkedinIcon, XIcon } from '../icons/SocialIcons';

const getOrdinalSuffix = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

// Everything that isn't in the dock.
const links = [
  { name: 'Resume', href: '/resume' },
  { name: 'Achievements', href: '/certificates' },
  { name: 'Gallery', href: '/photos' },
  { name: 'AI Toolkit', href: '/uses' },
  { name: 'Medium', href: socials.medium },
  { name: 'LeetCode', href: socials.leetcode },
  { name: 'Codeforces', href: socials.codeforces },
  { name: 'RSS', href: '/feed.xml' },
];

const connect = [
  { href: socials.github, label: 'GitHub', icon: <GithubIcon size="16" className="stroke-current" /> },
  { href: socials.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size="17" className="stroke-current" /> },
  { href: socials.twitter, label: 'X', icon: <XIcon size="13" className="fill-current" /> },
  { href: `mailto:${socials.email}`, label: 'Email', icon: <Mail className="h-4 w-4" /> },
];

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const handleVisitorCount = async () => {
      try {
        if (!localStorage.getItem('site_visited')) {
          await commentService.incrementSiteViews('main-site');
          localStorage.setItem('site_visited', 'true');
        }
        setVisitorCount(await commentService.getSiteViews('main-site'));
      } catch (error) {
        console.warn('Error handling visitor count:', error);
      }
    };
    handleVisitorCount();
  }, []);

  return (
    // Bottom padding keeps the footer clear of the floating dock.
    <footer className="mx-auto w-full max-w-[720px] px-4 sm:px-6 pb-36">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--lg-separator)] to-transparent" />
      <div className="flex flex-col gap-8 pt-10 sm:flex-row sm:justify-between">
        <div>
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-label-2">More</p>
          <nav className="flex max-w-sm flex-wrap gap-x-5 gap-y-2.5">
            {links.map((l) =>
              /^https?:/.test(l.href) || l.href.endsWith('.xml') ? (
                <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-foreground/75 hover:text-foreground transition-colors">
                  {l.name}
                </a>
              ) : (
                <Link key={l.name} to={l.href} className="text-[14px] text-foreground/75 hover:text-foreground transition-colors">
                  {l.name}
                </Link>
              )
            )}
          </nav>
        </div>
        <div>
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-label-2">Connect</p>
          <div className="flex gap-2">
            {connect.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={c.label}
                className="lg lg-press flex h-10 w-10 items-center justify-center rounded-xl text-label-2 hover:text-foreground"
              >
                <span className="relative z-[2]">{c.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-1.5 text-[12.5px] text-label-2 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. Built from scratch.</p>
        {!!visitorCount && (
          <p>
            You're the {visitorCount.toLocaleString()}
            <sup>{getOrdinalSuffix(visitorCount)}</sup> visitor
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
