import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];
const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Local Vite dev-server middleware that mirrors the Vercel Serverless Functions
 * (`/api/health`, `/api/gemini`, `/api/tts`) during `npm run dev` using server-side
 * environment variables loaded from `.env.local` (never exposed to the client bundle).
 */
function localServerlessApiPlugin(env: Record<string, string>): Plugin {
  const geminiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '').trim();
  const ttsKey = (env.GOOGLE_TTS_API_KEY || env.VITE_GOOGLE_TTS_API_KEY || '').trim();

  const isKeyValid = (k: string) =>
    Boolean(
      k &&
        k !== '...' &&
        k !== 'your_gemini_api_key_here' &&
        k !== 'your_google_cloud_tts_api_key_here'
    );

  return {
    name: 'medspeak-local-serverless-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        if (url.startsWith('/api/health') && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              geminiConfigured: isKeyValid(geminiKey),
              ttsConfigured: isKeyValid(ttsKey),
            })
          );
          return;
        }

        if (url.startsWith('/api/gemini') && req.method === 'POST') {
          if (!isKeyValid(geminiKey)) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              JSON.stringify({
                error: 'GEMINI_API_KEY not configured in .env.local.',
              })
            );
            return;
          }

          let rawBody = '';
          req.on('data', (chunk: unknown) => {
            rawBody += String(chunk);
          });
          req.on('end', () => {
            void (async () => {
              try {
                const parsed = JSON.parse(rawBody) as { contents?: unknown[] };
                const upstreamPayload = JSON.stringify({
                  contents: parsed.contents ?? [],
                  generationConfig: {
                    responseMimeType: 'application/json',
                    maxOutputTokens: 450,
                  },
                });

                let lastStatus = 502;
                let lastText = '';

                for (const endpoint of GEMINI_ENDPOINTS) {
                  const upstreamRes = await fetch(
                    `${endpoint}?key=${encodeURIComponent(geminiKey)}`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': geminiKey,
                      },
                      body: upstreamPayload,
                    }
                  );
                  lastStatus = upstreamRes.status;
                  lastText = await upstreamRes.text();
                  if (upstreamRes.ok || upstreamRes.status !== 404) {
                    break;
                  }
                }

                res.statusCode = lastStatus;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(lastText);
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(
                  JSON.stringify({
                    error: err instanceof Error ? err.message : 'Local Gemini proxy error',
                  })
                );
              }
            })();
          });
          return;
        }

        if (url.startsWith('/api/tts') && req.method === 'POST') {
          if (!isKeyValid(ttsKey)) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              JSON.stringify({
                error: 'GOOGLE_TTS_API_KEY not configured in .env.local.',
              })
            );
            return;
          }

          let rawBody = '';
          req.on('data', (chunk: unknown) => {
            rawBody += String(chunk);
          });
          req.on('end', () => {
            void (async () => {
              try {
                const parsed = JSON.parse(rawBody) as {
                  input?: { text?: string; ssml?: string };
                  speakingRate?: number;
                };
                const speakingRate = Number(parsed.speakingRate) === 0.75 ? 0.75 : 1.0;

                const upstreamRes = await fetch(
                  `${GOOGLE_TTS_ENDPOINT}?key=${encodeURIComponent(ttsKey)}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      input: parsed.input,
                      voice: {
                        languageCode: 'en-GB',
                        name: 'en-GB-Neural2-B',
                      },
                      audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate,
                        pitch: 0.0,
                      },
                    }),
                  }
                );

                const text = await upstreamRes.text();
                res.statusCode = upstreamRes.status;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(text);
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(
                  JSON.stringify({
                    error: err instanceof Error ? err.message : 'Local TTS proxy error',
                  })
                );
              }
            })();
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables (including non-VITE_ keys) on the server only
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), localServerlessApiPlugin(env)],
    server: {
      proxy: {
        '/api/openprescribing': {
          target: 'https://openprescribing.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/openprescribing/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
              proxyReq.removeHeader('referer');
              proxyReq.removeHeader('sec-fetch-site');
              proxyReq.removeHeader('sec-fetch-mode');
              proxyReq.removeHeader('sec-fetch-dest');
            });
          },
        },
      },
    },
  };
});
