import { defineConfig, loadEnv } from 'vite'
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
    // ALFRED's chat needs GROQ_API_KEY (and optionally GROQ_MODEL), from the shell or from .env.
    const env = loadEnv(server.config.mode, process.cwd(), '');
    for (const key of ['GROQ_API_KEY', 'GROQ_MODEL']) {
      if (!process.env[key] && env[key]) process.env[key] = env[key];
    }
    // Refresh ALFRED's index of project and blog pages.
    server.ssrLoadModule('/scripts/generate-alfred-pages.ts').then((m: any) => m.generateAlfredPages()).catch(console.error);
    server.middlewares.use('/api/alfred', async (req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      try {
        let raw = '';
        for await (const chunk of req) raw += chunk;
        const body = JSON.parse(raw || '{}');
        const { askAlfred } = await server.ssrLoadModule('/api/_lib/alfred.ts');
        res.end(JSON.stringify(await askAlfred(body.messages, body.page)));
      } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : '';
        res.statusCode = message === 'bad_request' ? 400 : message === 'rate_limited' ? 429 : 502;
        res.end(JSON.stringify({ error: res.statusCode === 400 ? 'Bad request' : 'ALFRED is unavailable' }));
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
