/**
 * Daily coding activity from GitHub, LeetCode and Codeforces, normalised to
 * { 'YYYY-MM-DD': count } per source. Runs server-side (LeetCode's API has no CORS),
 * shared by the Vercel function (api/activity.ts) and the Vite dev middleware.
 * Files under api/_lib are not deployed as routes.
 */
import { codingHandles } from '../../src/data/coding';

export type DailyCounts = Record<string, number>;
export type ActivityPayload = {
  github: DailyCounts | null;
  leetcode: DailyCounts | null;
  codeforces: DailyCounts | null;
  generatedAt: string;
};

// Dates are bucketed in IST so a late-night submission lands on the day it was made here.
const toISTDate = (unixSeconds: number) =>
  new Date((unixSeconds + 5.5 * 3600) * 1000).toISOString().slice(0, 10);

// Public contributions page: <td data-date id="contribution-day-component-…"> plus a
// <tool-tip for="…">N contributions on …</tool-tip> holding the count. No token needed.
async function fetchGithub(user: string): Promise<DailyCounts | null> {
  const res = await fetch(`https://github.com/users/${user}/contributions`);
  if (!res.ok) return null;
  const html = await res.text();
  const idToDate = new Map<string, string>();
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"/g)) idToDate.set(m[2], m[1]);
  const counts: DailyCounts = {};
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)</g)) {
    const date = idToDate.get(m[1]);
    if (!date) continue;
    const n = /^(\d+) contribution/.exec(m[2].trim());
    counts[date] = n ? Number(n[1]) : 0;
  }
  return Object.keys(counts).length ? counts : null;
}

// submissionCalendar is a JSON string of { unixSecondsAtUTCMidnight: submissions }.
async function fetchLeetcode(user: string): Promise<DailyCounts | null> {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({
      query: 'query($u:String!){matchedUser(username:$u){userCalendar{submissionCalendar}}}',
      variables: { u: user },
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const raw = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
  if (!raw) return null;
  const counts: DailyCounts = {};
  for (const [ts, n] of Object.entries(JSON.parse(raw) as Record<string, number>)) {
    counts[new Date(Number(ts) * 1000).toISOString().slice(0, 10)] = n;
  }
  return counts;
}

async function fetchCodeforces(handle: string): Promise<DailyCounts | null> {
  const res = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`);
  if (!res.ok) return null;
  const json = await res.json();
  if (json.status !== 'OK') return null;
  const cutoff = Date.now() / 1000 - 370 * 86400;
  const counts: DailyCounts = {};
  for (const sub of json.result as { creationTimeSeconds: number }[]) {
    if (sub.creationTimeSeconds < cutoff) continue;
    const d = toISTDate(sub.creationTimeSeconds);
    counts[d] = (counts[d] ?? 0) + 1;
  }
  return counts;
}

// One source failing (rate limit, outage) must not take the others down.
const safe = (fn: () => Promise<DailyCounts | null>) => fn().catch(() => null);

export async function getActivity(): Promise<ActivityPayload> {
  const { github, leetcode, codeforces } = codingHandles;
  const [gh, lc, cf] = await Promise.all([
    github ? safe(() => fetchGithub(github)) : null,
    leetcode ? safe(() => fetchLeetcode(leetcode)) : null,
    codeforces ? safe(() => fetchCodeforces(codeforces)) : null,
  ]);
  return { github: gh, leetcode: lc, codeforces: cf, generatedAt: new Date().toISOString() };
}
