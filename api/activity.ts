import { getActivity } from './_lib/activity';

// GET /api/activity — daily GitHub / LeetCode / Codeforces counts for the home heatmap.
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const data = await getActivity();
    // Cache at Vercel's edge: fresh for an hour, served stale for a day while it refreshes.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(data);
  } catch (error) {
    console.error('Activity API error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
}
