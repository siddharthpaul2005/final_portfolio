/**
 * Central SEO/OG metadata config for all pages and blog posts.
 * Used client-side by <SEO /> and server-side by api/og.ts for crawlers.
 */

import { site } from './src/data/site';
import { projects } from './src/data/projects';
import { blogPostsData } from './src/data/blogs';

const SITE_URL = site.url;
// Square photo for now; a dedicated 1200x630 card would crop better in link previews.
export const DEFAULT_OG_IMAGE = '/assets/siddharth-photo.jpg';

export type PageMeta = {
  title: string;
  description: string;
  image?: string;
};

const staticPages: Record<string, PageMeta> = {
  '/': {
    title: site.title,
    description: site.description,
  },
  '/about': {
    title: `About - ${site.name}`,
    description: 'CS undergrad, pre-final year (graduating 2028). Backend, distributed systems and low-level software.',
  },
  '/projects': {
    title: `Projects - ${site.name}`,
    description: 'Backend, systems and AI/ML projects, mostly built from scratch.',
  },
  '/blog': {
    title: `Blog - ${site.name}`,
    description: 'Notes on systems, backend engineering and things I am learning.',
  },
  '/now': {
    title: `Now - ${site.name}`,
    description: 'What I am currently building, designing and learning.',
  },
  '/certificates': {
    title: `Achievements - ${site.name}`,
    description: 'Certifications, contests and contributions.',
  },
  '/photos': {
    title: `Gallery - ${site.name}`,
    description: 'Photos from life outside the editor.',
  },
  '/contact': {
    title: `Contact - ${site.name}`,
    description: 'Get in touch about backend SWE or AI/ML roles (internship or full-time), or collaborations.',
  },
  '/resume': {
    title: `Resume - ${site.name}`,
    description: 'View my resume.',
  },
  '/uses': {
    title: `AI Toolkit - ${site.name}`,
    description: 'Model gateways, local inference, retrieval, agents and the AI tools I build with.',
  },
};

export function getMetaForPath(pathname: string): PageMeta | null {
  const path = pathname.replace(/\/$/, '') || '/';
  if (staticPages[path]) return staticPages[path];

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const post = blogPostsData[blogMatch[1]];
    if (post) {
      return {
        title: `${post.title} - ${site.name}`,
        description: post.description || post.title,
        image: post.image,
      };
    }
    return null;
  }

  const projectMatch = path.match(/^\/projects\/(.+)$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const project = projects.find(p => p.slug === slug);
    if (project) {
      return {
        title: `${project.title} - ${site.name}`,
        description: project.description,
      };
    }
  }

  return null;
}

export function toAbsoluteUrl(path: string = DEFAULT_OG_IMAGE): string {
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`;
}
