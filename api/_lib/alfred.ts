import { profile } from '../../src/data/profile';
import { projects } from '../../src/data/projects';
import { now } from '../../src/data/now';
import { skills } from '../../src/data/skills';
import { site, education } from '../../src/data/site';
import { socials } from '../../src/data/socials';
import { certificates, achievements } from '../../src/data/achievements';
import { blogPostsData } from '../../src/data/blogs';
import { toolGroups } from '../../src/data/uses';
import { ideas } from '../../src/data/ideas';
import { codingHandles } from '../../src/data/coding';
import { sources } from '../../src/data/personal';
import { pageTexts } from './pages.generated';

// ALFRED's chat brain for the on-site companion, running on Groq (OpenAI-compatible API).
// It knows the site from the same data files the pages render, can read any project or blog
// page in full (read_page), and can offer to take the visitor somewhere or take them there
// (navigate). The browser carries out the navigation.

export type ChatTurn = { role: 'user' | 'assistant'; content: string };
export type AlfredAction = { path: string; section?: string; label: string; go: boolean };
export type AlfredAnswer = { reply: string; action?: AlfredAction };

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// GPT-OSS 120B: the strongest model on Groq and still very fast; low reasoning keeps replies snappy.
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const MAX_TURNS = 12;
const MAX_CHARS = 600;
const MAX_TOOL_ROUNDS = 4;

// Every page on the site and the headings ALFRED can scroll to on it.
const siteMap: Record<string, { title: string; sections: string[] }> = {
  '/': {
    title: 'Home',
    sections: ['Currently Working On', 'Coding Daily', 'Projects', 'Research & Writing', 'AI Toolkit', 'At a Glance', 'Tech Stack', 'Working on something?'],
  },
  '/about': {
    title: 'About (story, education, stack, focus, books and courses)',
    sections: ['About', 'Education', 'Stack', 'Focus', 'On the side', ...sources.map((s) => s.group), 'More'],
  },
  '/now': { title: 'Now (what he is working on right now)', sections: ['Focus', 'On the side'] },
  '/projects': { title: 'All projects', sections: ['On the workbench'] },
  '/blog': { title: 'Writing (blog posts)', sections: ['All posts'] },
  '/certificates': { title: 'Achievements and certifications', sections: ['Achievements', 'Certifications'] },
  '/uses': { title: 'AI Toolkit (tools he uses)', sections: toolGroups.map((g) => g.title) },
  '/resume': { title: 'Resume (PDF viewer and download)', sections: [] },
  '/contact': { title: 'Contact (message form, email and profiles)', sections: ['New message', 'Or reach me directly'] },
  '/photos': { title: 'Gallery', sections: [] },
};
for (const p of projects) siteMap[`/projects/${p.slug}`] = { title: `Project: ${p.title}`, sections: pageTexts[`/projects/${p.slug}`]?.headings ?? [] };
for (const [slug, post] of Object.entries(blogPostsData)) {
  if (!post.externalUrl) siteMap[`/blog/${slug}`] = { title: `Blog post: ${post.title}`, sections: pageTexts[`/blog/${slug}`]?.headings ?? [] };
}

// Groq's free tier allows ~8K tokens a minute, so the always-on prompt holds only a compact
// summary; the details of each page come from read_page when a question needs them.
const list = (xs: (string | undefined)[]) => xs.filter(Boolean).join('; ');

const staticPages: Record<string, string> = {
  '/about': [
    `${profile.bio}`,
    "Not a tutorial-completer: every project is there to understand something deeply. For DiskTree he wrote his own arena allocator and thread pool; for voice search he fused BM25 and dense retrieval by hand and used extractive answers to stay under 200 ms; for his agent daemon he defined the gRPC contracts from first principles. No long internship history yet, but an obsession with how systems work and the discipline to sit with hard problems.",
    `Education: ${education.degree}, ${education.institution} (${education.campus}), ${education.years}, CGPA ${education.cgpa}. Coursework: ${education.coursework.join(', ')}.`,
    `Stack: ${skills.map((g) => `${g.category}: ${g.items.join(', ')}`).join('. ')}.`,
    `Focus: ${profile.focus.join('; ')}. On the side: ${profile.side.join('; ')}.`,
    ...sources.map((g) => `${g.group}: ${list(g.items.map((i) => (i.by ? `${i.title} (${i.by})` : i.title)))}.`),
    `Hometown ${site.hometown}; lives in ${site.city}.`,
  ].join('\n'),
  '/now': now.items.map((i) => `${i.kind} (${i.mode === 'side' ? 'side' : 'main'}): ${i.title}: ${i.description}`).join('\n'),
  '/projects': [
    ...projects.map((p) => `${p.title} (/projects/${p.slug}, ${p.status}, ${p.date}): ${p.description} Tags: ${p.tags.join(', ')}.${p.github ? ` Code: ${p.github}` : ''}${p.demo ? ` Demo: ${p.demo}` : ''}`),
    `On the workbench (ideas, not built yet): ${ideas.map((i) => `${i.title}: ${i.pitch} (${i.stack.join(', ')})`).join(' | ')}`,
  ].join('\n'),
  '/certificates': [
    ...achievements.map((a) => `Achievement: ${Object.values(a).filter((v) => typeof v === 'string' && !v.startsWith('/') && !v.startsWith('http')).join(' - ')}`),
    ...certificates.map((c) => `Certification: ${Object.values(c).filter((v) => typeof v === 'string' && !v.startsWith('/') && !v.startsWith('http')).join(' - ')}`),
  ].join('\n'),
  '/blog': Object.entries(blogPostsData)
    .map(([slug, p]) => `${p.title} (${p.date}, ${p.category}): ${p.externalUrl ?? `/blog/${slug}`}${p.description ? `. ${p.description}` : ''}`)
    .join('\n'),
  '/uses': toolGroups.map((g) => `${g.title}: ${g.tools.map((t) => `${t.name}${t.proof ? ` (used in ${t.proof.label})` : ''}`).join(', ')}`).join('\n'),
  '/contact': `Message form on the page. Email ${socials.email}. GitHub ${socials.github}. LinkedIn ${socials.linkedin}. X ${socials.twitter}. Medium ${socials.medium}. LeetCode ${socials.leetcode} (${codingHandles.leetcode}). Codeforces ${socials.codeforces} (${codingHandles.codeforces}).`,
};

const readPage = (path: string) => staticPages[path] ?? pageTexts[path]?.text;

const SYSTEM = `You are ALFRED, the small dot-matrix robot on Siddharth Paul's portfolio (${site.url}) that follows visitors' cursors; a friendly guide to Siddharth, his work and this site. (The real ALFRED is his Jarvis-style assistant project, /projects/alfred.)

Rules:
- Two to four short sentences, plain text, no markdown or lists. Talk about Siddharth in the third person.
- The summary below is brief. For anything more specific (a project's details, his achievements, education, stack, posts, tools, what he's doing now), call read_page on the relevant path first, then answer from it.
- If it isn't on the site, say you don't know and suggest /contact. Never invent details. Never share a phone number.
- Recruiters: he wants backend-heavy SWE and AI/ML roles, internship or full-time.
- Off-topic: one friendly line, then steer back.
- When a page or section shows what they asked about, call navigate with go=false and end with "Want me to take you there?". When they accept or directly ask to go somewhere, call navigate with go=true and reply with one short line. Only use paths and sections from the site map.

Visitor is on: {{PAGE}}

Summary: ${profile.name}, ${profile.tagline}. ${profile.status} ${education.degree} at ${education.institution}. Email ${socials.email}.
Projects: ${projects.map((p) => `${p.title} (/projects/${p.slug})`).join(', ')}.

Site map (path: what's there [sections]):
${Object.entries(siteMap)
  .map(([path, p]) => `${path}: ${p.title}${p.sections.length ? ` [${p.sections.join(' | ')}]` : ''}`)
  .join('\n')}`;

const tools = [
  {
    type: 'function',
    function: {
      name: 'read_page',
      description: 'Read what a page on the site says (any path from the site map), for detailed questions.',
      parameters: {
        type: 'object',
        properties: { path: { type: 'string', description: 'A path from the site map, e.g. /about, /certificates or /projects/disktree.' } },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'navigate',
      description:
        'Offer to take the visitor to a page (go=false shows a "take me there" button), or take them there right now (go=true) when they asked or accepted.',
      parameters: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'A path from the site map.' },
          section: { type: 'string', description: "Optional: one of that page's listed sections to scroll to." },
          label: { type: 'string', description: 'Short button text, e.g. "Open DiskTree" or "Go to Contact".' },
          go: { type: 'boolean', description: 'true to go now, false to only offer.' },
        },
        required: ['path', 'label', 'go'],
      },
    },
  },
];

type GroqMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
};

const callGroq = async (messages: GroqMessage[], useTools: boolean) => {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 1024, // includes the model's (hidden) reasoning
      temperature: 0.4,
      ...(MODEL.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low', include_reasoning: false } : {}),
      ...(useTools ? { tools, tool_choice: 'auto' } : {}),
    }),
  });
  if (res.status === 429) {
    console.warn('Groq rate limit:', (await res.text().catch(() => '')).slice(0, 300));
    throw new Error('rate_limited');
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    // The model occasionally emits a malformed tool call; the caller retries without tools.
    if (res.status === 400 && detail.includes('tool_use_failed')) throw new Error('tool_use_failed');
    throw new Error(`groq_${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message as GroqMessage | undefined;
};

const parseArgs = (raw: string): Record<string, unknown> => {
  try {
    const v = JSON.parse(raw || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
};

const normalisePath = (p: unknown) => (typeof p === 'string' ? p.trim().replace(/\/+$/, '') || '/' : '');

/** Validates the visitor's conversation and returns ALFRED's reply (and maybe a navigation). */
export async function askAlfred(input: unknown, page?: unknown): Promise<AlfredAnswer> {
  if (!process.env.GROQ_API_KEY) throw new Error('missing GROQ_API_KEY');
  if (!Array.isArray(input) || input.length === 0) throw new Error('bad_request');
  const turns: ChatTurn[] = input
    .slice(-MAX_TURNS)
    .filter(
      (m): m is ChatTurn =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim() !== '',
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') throw new Error('bad_request');

  const here = normalisePath(page);
  const messages: GroqMessage[] = [
    { role: 'system', content: SYSTEM.replace('{{PAGE}}', siteMap[here] ? `${here} (${siteMap[here].title})` : here || 'unknown') },
    ...turns,
  ];

  let action: AlfredAction | undefined;
  let lastRead: string | undefined; // the page ALFRED last read, for offers it forgets to attach
  let useTools = true;
  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    let msg: GroqMessage | undefined;
    try {
      msg = await callGroq(messages, useTools && round < MAX_TOOL_ROUNDS);
    } catch (e) {
      if (e instanceof Error && e.message === 'tool_use_failed' && useTools) {
        useTools = false;
        continue;
      }
      throw e;
    }
    if (!msg) break;
    if (!msg.tool_calls?.length) {
      const reply = (msg.content ?? '').trim();
      // The model sometimes offers to take the visitor somewhere without calling navigate;
      // attach the page it just read so the offer still comes with a button.
      if (!action && lastRead && lastRead !== here && /take you|bring you|show you|want me to/i.test(reply)) {
        action = { path: lastRead, label: `Open ${siteMap[lastRead].title.replace(/^(Project|Blog post): /, '').split(' (')[0]}`, go: false };
      }
      return { reply: reply || 'Hmm, I lost my train of thought. Try asking again?', action };
    }

    messages.push({ role: 'assistant', content: msg.content ?? null, tool_calls: msg.tool_calls });
    for (const call of msg.tool_calls) {
      const args = parseArgs(call.function.arguments);
      let result: string;
      if (call.function.name === 'read_page') {
        const path = normalisePath(args.path);
        if (readPage(path) && siteMap[path]) lastRead = path;
        result = readPage(path) ?? `Nothing readable at ${path}. Try /about, /now, /projects, /certificates, /blog, /uses, /contact or a project page.`;
      } else if (call.function.name === 'navigate') {
        const path = normalisePath(args.path);
        if (!siteMap[path]) {
          result = `Unknown path ${path}. Use a path from the site map.`;
        } else {
          const section =
            typeof args.section === 'string' &&
            siteMap[path].sections.find((s) => s.toLowerCase() === (args.section as string).trim().toLowerCase());
          action = {
            path,
            section: section || undefined,
            label: typeof args.label === 'string' && args.label.trim() ? args.label.trim().slice(0, 40) : `Go to ${siteMap[path].title}`,
            go: args.go === true || args.go === 'true',
          };
          result = action.go
            ? 'The visitor is being taken there now. Reply with one short line.'
            : 'A "take me there" button is shown under your reply. Finish your answer and ask if they want to go.';
        }
      } else {
        result = 'Unknown tool.';
      }
      messages.push({ role: 'tool', tool_call_id: call.id, content: result });
    }
  }
  return { reply: action?.go ? 'On my way!' : "Hmm, I lost my train of thought. Try asking again?", action };
}
