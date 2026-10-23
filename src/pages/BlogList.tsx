import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PageShell from '../components/ios/PageShell';
import { blogPostsData } from '../data/blogs';
import { socials } from '../data/socials';
import { commentService } from '../lib/supabase';

const posts = Object.entries(blogPostsData)
  .map(([slug, post]) => ({ slug, ...post }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Featured = newest post hosted here (it has a real cover image and full article).
const featured = posts.find((p) => !p.externalUrl);
const rest = posts.filter((p) => p !== featured);

const shortDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(date));

// Internal posts route inside the app; Medium posts open in a new tab.
const PostLink = ({ post, className, children }: { post: (typeof posts)[number]; className?: string; children: ReactNode }) =>
  post.externalUrl ? (
    <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link to={`/blog/${post.slug}`} className={className}>
      {children}
    </Link>
  );

const BlogList = () => {
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!featured) return;
    commentService
      .getBlogViews(featured.slug)
      .then((v: number) => setViews({ [featured.slug]: v }))
      .catch(() => {});
  }, []);

  return (
    <PageShell
      eyebrow={`${posts.length} posts`}
      title="Writing"
      subtitle="Distributed systems, algorithms, ML, and the occasional opinion. Longer pieces live here; the rest are on Medium."
    >
      {featured && (
        <PostLink post={featured} className="block mb-8">
          <article className="lg lg-press overflow-hidden rounded-[28px]">
            <div className="relative z-[2]">
              <div className="bg-white">
                <img src={featured.image} alt="" className="aspect-[2/1] w-full object-contain" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff9f0a]">
                  Latest · {featured.category}
                </p>
                <h2 className="font-display mt-2 text-[24px] sm:text-[30px] font-bold leading-tight text-foreground">
                  {featured.title}
                </h2>
                {featured.description && (
                  <p className="mt-2 text-[15px] leading-relaxed text-label-2">{featured.description}</p>
                )}
                <p className="mt-4 text-[13px] text-label-2">
                  {featured.date} · {featured.readTime}
                  {views[featured.slug] ? ` · ${views[featured.slug]} views` : ''}
                </p>
              </div>
            </div>
          </article>
        </PostLink>
      )}

      <h3 className="px-4 mb-2 text-[13px] font-medium uppercase tracking-[0.06em] text-label-2">All posts</h3>
      <div className="lg overflow-hidden rounded-[22px]">
        <div className="relative z-[2]">
          {rest.map((post) => (
            <PostLink key={post.slug} post={post} className="ios-row relative block">
              <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--lg-hover)] transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-snug text-foreground">{post.title}</p>
                  <p className="mt-0.5 text-[13px] text-label-2">
                    {shortDate(post.date)} · {post.category}
                  </p>
                </div>
                {post.externalUrl ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[12.5px] text-label-2">
                    Medium <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="shrink-0 text-[12.5px] text-label-2">{post.readTime}</span>
                )}
              </div>
            </PostLink>
          ))}
        </div>
      </div>

      {socials.medium && (
        <a
          href={socials.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 px-4 text-[14px] font-semibold text-[#0a84ff]"
        >
          Follow on Medium <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
    </PageShell>
  );
};

export default BlogList;
