/**
 * Generates public/feed.xml, public/sitemap.xml and public/robots.txt from
 * site data. Runs before `vite build` so the outputs get copied into dist/.
 */
import fs from 'fs';
import path from 'path';
import { blogPostsData } from '../src/data/blogs';
import { projects } from '../src/data/projects';
import { site } from '../src/data/site';

const SITE_URL = site.url;
const PUBLIC_DIR = path.join(process.cwd(), 'public');

const STATIC_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/now',
  '/certificates',
  '/photos',
  '/resume',
  '/contact',
  '/uses',
];

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

const sortedPosts = () =>
  Object.entries(blogPostsData)
    .map(([slug, post]) => ({ slug, ...post, parsedDate: new Date(post.date) }))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

function generateRssFeed() {
  const lastBuildDate = new Date().toUTCString();

  let itemsXml = '';

  for (const post of sortedPosts()) {
    const postUrl = post.externalUrl ?? `${SITE_URL}/blog/${post.slug}`;
    const pubDate = post.parsedDate.toUTCString();

    // Limit description length or clean HTML
    let cleanDesc = '';
    try {
      const mdxPath = path.join(process.cwd(), 'src', 'content', 'blog', `${post.slug}.mdx`);
      const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
      cleanDesc = mdxContent.replace(/<[^>]*>/g, '').replace(/[#*`_\[\]()]/g, '').substring(0, 200).trim() + '...';
    } catch (e) {
      cleanDesc = post.description || post.title;
    }

    itemsXml += `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cleanDesc}]]></description>
      <category>${escapeXml(post.category)}</category>
      <dc:creator>${escapeXml(post.author)}</dc:creator>
    </item>`;
  }

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on systems, backend engineering and things I am learning.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'feed.xml'), rssFeed.trim());
}

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_ROUTES.map((route) => ({ loc: route, lastmod: today, priority: route === '/' ? '1.0' : '0.8' })),
    ...projects.map((p) => ({ loc: `/projects/${p.slug}`, lastmod: today, priority: '0.7' })),
    // External (Medium) posts aren't pages on this site, so they stay out of the sitemap.
    ...sortedPosts().filter((p) => !p.externalUrl).map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: isNaN(p.parsedDate.getTime()) ? today : p.parsedDate.toISOString().slice(0, 10),
      priority: '0.6',
    })),
  ];

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${SITE_URL}${u.loc === '/' ? '/' : u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

function generateRobots() {
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'robots.txt'),
    `User-agent: *\nDisallow:\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  );
}

generateRssFeed();
generateSitemap();
generateRobots();
console.log('\n✅ Generated feed.xml, sitemap.xml and robots.txt in public/\n');
