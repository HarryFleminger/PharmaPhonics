import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];
const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const MAX_DRUG_NAME_LENGTH = 120;
const MAX_MEDLIST_TEXT_LENGTH = 4000;

interface LocalGeminiPayload {
  mode?: 'clinical' | 'toxicity' | 'prescription' | 'medlist';
  drugName?: string;
  base64Data?: string;
  mimeType?: string;
  text?: string;
}

function scrubMedListText(rawText: string): string {
  return rawText
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED]')
    .replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, '[REDACTED]')
    .replace(/\b\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}\b/g, '[REDACTED]')
    .replace(
      /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4}\b/gi,
      '[REDACTED]'
    )
    .replace(/\b[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}\b/gi, '[REDACTED]')
    .replace(/\b(?:\+44\s?7\d{3}|\(?07\d{3}\)?|\(?0[12]\d{2,3}\)?)\s?\d{3}\s?\d{3,4}\b/g, '[REDACTED]')
    .replace(
      /\b(?:Mr|Mrs|Ms|Miss|Mx|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g,
      '[REDACTED]'
    )
    .replace(
      /^\s*(?:patient\s*name|name|nhs\s*(?:no|number)|chi|mrn|hospital\s*(?:no|number)|dob|date\s*of\s*birth|address|postcode|tel|telephone|mobile|gp|surgery)\s*:.*$/gim,
      '[REDACTED]'
    )
    .trim()
    .slice(0, MAX_MEDLIST_TEXT_LENGTH);
}

function buildLockedContents(body: LocalGeminiPayload): unknown[] {
  const mode = body.mode;

  if (mode === 'clinical' || mode === 'toxicity') {
    const rawDrugName = typeof body.drugName === 'string' ? body.drugName.trim() : '';
    if (!rawDrugName) {
      throw new Error('Missing required `drugName` string.');
    }
    if (rawDrugName.length > MAX_DRUG_NAME_LENGTH) {
      throw new Error(`drugName exceeds maximum length of ${MAX_DRUG_NAME_LENGTH} characters.`);
    }
    const sanitized = rawDrugName.replace(/[\r\n"'`\\]/g, ' ').trim();
    const prompt =
      mode === 'clinical'
        ? `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${sanitized}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`
        : `You are a UK Paramedic and Toxbase/JRCALC expert. Provide pre-hospital overdose information for '${sanitized}'. Return ONLY flat JSON with exactly these keys: 'overdoseEffects' (string: plain-English summary of how the overdose presents clinically and vital sign changes) and 'toxicThreshold' (string: known toxic dose limit, e.g., '>75mg/kg' or specific mg amount).`;

    return [{ parts: [{ text: prompt }] }];
  }

  if (mode === 'prescription') {
    const base64Data = typeof body.base64Data === 'string' ? body.base64Data.trim() : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.trim() : '';
    if (!base64Data || !mimeType.startsWith('image/')) {
      throw new Error('Missing valid `base64Data` or `image/*` `mimeType` for prescription scan.');
    }
    const visionPrompt =
      "PRIVACY GUARDRAIL: Completely ignore and NEVER transcribe, echo, or infer any visible patient names, dates of birth, NHS numbers, addresses, prescriber names, or pharmacy labels—extract medication names and clinical pharmacology study points ONLY. You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine this image of a prescription, repeat medication list, discharge summary, or medicine packaging. Keep all points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 5 keys: 'medications' (array of strings: distinct UK generic/BNF drug names visible), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions or synergistic overdose effects between these medications), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are visible, return empty arrays for all keys.";

    return [
      {
        parts: [
          { text: visionPrompt },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ];
  }

  if (mode === 'medlist') {
    const rawText = typeof body.text === 'string' ? body.text.trim() : '';
    const scrubbedText = scrubMedListText(rawText);
    if (!scrubbedText) {
      throw new Error('Missing required `text` string for medication list extraction.');
    }
    const medListPrompt = `You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine the following pasted text from a prescription table, repeat medication list, discharge summary, or clinical letter. Extract all distinct UK medications mentioned, converting UK brand names (such as Eliquis, Xarelto, MST Continus, Zomorph, Ventolin, Clenil, Epilim, Plavix, Brilique) to their generic UK BNF / rINN name where identifiable (e.g. 'Apixaban', 'Rivaroxaban', 'Morphine Sulfate', 'Salbutamol'). Keep all summary points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 5 keys: 'medications' (array of strings: distinct UK generic/BNF drug names found), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions or synergistic overdose effects between these medications), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are found, return empty arrays for all keys.\n\nPASTED MEDICATION TEXT:\n${scrubbedText}`;

    return [{ parts: [{ text: medListPrompt }] }];
  }

  throw new Error("Invalid `mode`. Expected 'clinical', 'toxicity', 'prescription', or 'medlist'.");
}

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
                const parsed = JSON.parse(rawBody) as LocalGeminiPayload;
                const contents = buildLockedContents(parsed);
                const isMultiDrugMode =
                  parsed.mode === 'medlist' || parsed.mode === 'prescription';
                const maxOutputTokens = isMultiDrugMode ? 2048 : 1500;

                let lastStatus = 502;
                let lastText = '';

                for (const endpoint of GEMINI_ENDPOINTS) {
                  const generationConfig = {
                    responseMimeType: 'application/json',
                    maxOutputTokens,
                    thinkingConfig: { thinkingBudget: 0 },
                  };

                  const upstreamPayload = JSON.stringify({
                    contents,
                    generationConfig,
                  });

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
                  if (upstreamRes.ok) {
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
