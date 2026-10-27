import { askAlfred } from './_lib/alfred';

// Edge runtime, like api/activity.ts (extensionless imports are bundled at deploy time).
export const config = { runtime: 'edge' };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// POST /api/alfred { messages: [{ role, content }], page } -> { reply, action? }
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  try {
    const body = await req.json().catch(() => null);
    return json(await askAlfred(body?.messages, body?.page));
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'bad_request') return json({ error: 'Bad request' }, 400);
    if (message === 'rate_limited') return json({ error: 'Busy' }, 429);
    console.error('ALFRED API error:', error);
    return json({ error: 'ALFRED is unavailable' }, 502);
  }
}
