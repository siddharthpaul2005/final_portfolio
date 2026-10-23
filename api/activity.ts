import { getActivity } from './_lib/activity';

// Edge runtime (like api/og.ts): imports are bundled at deploy time. The plain Node runtime
// failed here because package.json is "type": "module" and extensionless imports don't resolve.
export const config = { runtime: 'edge' };

// GET /api/activity — daily GitHub / LeetCode / Codeforces counts for the home heatmap.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }
  try {
    const data = await getActivity();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache at Vercel's edge: fresh for an hour, served stale for a day while it refreshes.
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Activity API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch activity' }), { status: 500 });
  }
}
