import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'

// Serves the Vercel API routes during `vite dev` (in production Vercel runs api/*.ts itself).
const apiDev = () => ({
  name: 'api-dev',
  configureServer(server: any) {
    server.middlewares.use('/api/activity', async (_req: any, res: any) => {
      try {
        const { getActivity } = await server.ssrLoadModule('/api/_lib/activity.ts');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(await getActivity()));
      } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to fetch activity' }));
      }
    });
  }
});

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx() },
    react(),
    apiDev()
  ],
  server: {
    watch: {
      ignored: ['**/*.tmp', '**/*.~tmp']
    }
  }
})
