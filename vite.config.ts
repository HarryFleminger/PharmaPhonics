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
  mode?:
    | 'clinical'
    | 'toxicity'
    | 'brand'
    | 'prescription'
    | 'medlist'
    | 'assessment'
    | 'condition';
  drugName?: string;
  base64Data?: string;
  mimeType?: string;
  text?: string;
  condition?: string;
}

function buildLockedContents(body: LocalGeminiPayload): unknown[] {
  const mode = body.mode;

  if (mode === 'clinical' || mode === 'toxicity' || mode === 'brand') {
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
        ? `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${sanitized}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string: hyphenated UK English phonetic pronunciation covering EVERY word in '${sanitized}', including any pharmaceutical salt, ester, or second word such as dipropionate, fumarate, hydrochloride, tartrate, or sodium, with stressed syllables in ALL CAPS and words separated by spaces, e.g. 'bek-lo-MET-a-zone dy-PRO-pee-oh-nate'), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`
        : mode === 'toxicity'
        ? `You are a UK Paramedic and Toxbase/JRCALC expert. Provide pre-hospital overdose information for '${sanitized}'. Return ONLY flat JSON with exactly these keys: 'overdoseEffects' (string: plain-English summary of how the overdose presents clinically and vital sign changes) and 'toxicThreshold' (string: known toxic dose limit, e.g., '>75mg/kg' or specific mg amount).`
        : `You are a UK BNF and NHS prescribing expert. Determine whether '${sanitized}' is a UK brand-name medication or multi-ingredient combination product. Return ONLY a flat JSON object with exactly these 4 keys: 'isBrandOrCombination' (boolean: true if '${sanitized}' is a brand/trade name or fixed-dose combination product, false if it is already a single generic UK BNF / rINN drug name), 'productName' (string: clean capitalised brand or product name), 'subtitle' (string: brief 2 to 5 word UK formulation/class description, or empty string), and 'constituents' (array of 1 to 5 strings: the distinct active generic UK BNF / rINN drug names contained in the product, e.g. ['Beclometasone dipropionate', 'Formoterol fumarate', 'Glycopyrronium']). No markdown, no extra text.`;

    return [{ parts: [{ text: prompt }] }];
  }

  if (mode === 'prescription') {
    const base64Data = typeof body.base64Data === 'string' ? body.base64Data.trim() : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.trim() : '';
    if (!base64Data || !mimeType.startsWith('image/')) {
      throw new Error('Missing valid `base64Data` or `image/*` `mimeType` for prescription scan.');
    }
    const visionPrompt =
      "You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine this image of a prescription, repeat medication list, discharge summary, or medicine packaging. Keep all summary points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 6 keys: 'medications' (array of strings: distinct medication names visible, preserving UK brand names and Co- compound names as written such as 'Trimbow', 'Zapain', 'Co-codamol', 'Symbicort', 'Eliquis', or 'Ramipril', without dose/frequency text), 'brandBreakdowns' (array of objects: for every brand-name or multi-ingredient combination product in 'medications', include { 'brandName': string, 'subtitle': string, 'constituents': array of distinct active generic UK BNF / rINN drug names in that product, e.g. ['Beclometasone dipropionate', 'Formoterol fumarate', 'Glycopyrronium'] }; return [] if all drugs are single generics), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions, duplicate active ingredients across products, or synergistic overdose effects), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are visible, return empty arrays for all keys.";

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
    if (!rawText) {
      throw new Error('Missing required `text` string for medication list extraction.');
    }
    const cappedText = rawText.slice(0, MAX_MEDLIST_TEXT_LENGTH);
    const medListPrompt = `You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine the following pasted text from a prescription table, repeat medication list, discharge summary, or clinical letter. Extract all distinct UK medications mentioned, preserving UK brand names and Co- compound names in 'medications' when written as a brand or combination (such as 'Trimbow', 'Zapain', 'Co-codamol', 'Symbicort', 'Fostair', 'Entresto', 'Eliquis', 'Xarelto', 'Ventolin', 'Epilim') without dose/frequency text, and list their constituent generic UK BNF / rINN active ingredients in 'brandBreakdowns'. Keep all summary points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 6 keys: 'medications' (array of strings: distinct medication or brand names found), 'brandBreakdowns' (array of objects: for every brand-name or multi-ingredient combination product in 'medications', include { 'brandName': string, 'subtitle': string, 'constituents': array of distinct active generic UK BNF / rINN drug names in that product, e.g. ['Beclometasone dipropionate', 'Formoterol fumarate', 'Glycopyrronium'] }; return [] if all drugs are single generics), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions, duplicate active ingredients across products, or synergistic overdose effects), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are found, return empty arrays for all keys.\n\nPASTED MEDICATION TEXT:\n${cappedText}`;

    return [{ parts: [{ text: medListPrompt }] }];
  }

  if (mode === 'assessment') {
    const rawCondition = typeof body.condition === 'string' ? body.condition.trim() : '';
    if (!rawCondition) {
      throw new Error('Missing required `condition` string.');
    }
    if (rawCondition.length > MAX_DRUG_NAME_LENGTH) {
      throw new Error(`condition exceeds maximum length of ${MAX_DRUG_NAME_LENGTH} characters.`);
    }
    const sanitizedCondition = rawCondition.replace(/[\r\n"'`\\]/g, ' ').trim();
    const assessmentPrompt = `You are a UK Paramedic (JRCALC / NICE) pre-hospital clinical assessment expert. Create a rapid-reference pocketbook assessment checklist for a patient presenting with '${sanitizedCondition}'. Keep every bullet ultra-concise, telegraphic, and straight to the point (no prose explanations, no filler). For 'keyQuestions' and 'keyAssessments', start each string with a short 1-3 word label followed by a colon (max 24 chars before ':'), e.g. 'Onset: Sudden or gradual? What were they doing?' or 'Obs: RR, SpO2, HR, BP, Temp, BM, GCS'. Return ONLY a flat JSON object with exactly these 5 keys: 'title' (string: clean UK clinical title for the condition/presentation), 'category' (string: choose the closest fit from 'Cardiovascular', 'Respiratory', 'Neurological', 'Abdominal, GI & Renal', 'Medical, Endocrine & Sepsis', 'Trauma & MSK', or 'Maternity, Paeds & Mental Health'), 'keyQuestions' (array of 5 to 7 concise SOCRATES/SOCATE/ROS history questions in 'Label: question?' format), 'keyAssessments' (array of 4 to 6 concise bedside primary/secondary survey checks in 'Label: check' format), and 'redFlags' (array of 4 to 5 blunt time-critical red flag signs/symptoms). No markdown, no extra text.`;

    return [{ parts: [{ text: assessmentPrompt }] }];
  }

  if (mode === 'condition') {
    const rawCondition = typeof body.condition === 'string' ? body.condition.trim() : '';
    if (!rawCondition) {
      throw new Error('Missing required `condition` string.');
    }
    if (rawCondition.length > MAX_DRUG_NAME_LENGTH) {
      throw new Error(`condition exceeds maximum length of ${MAX_DRUG_NAME_LENGTH} characters.`);
    }
    const sanitizedCondition = rawCondition.replace(/[\r\n"'`\\]/g, ' ').trim();
    const conditionPrompt = `You are a UK Paramedic (JRCALC / NICE / BNF) and NHS clinical educator. Create a rapid en-route pre-hospital refresher for the medical condition '${sanitizedCondition}'. You MUST use strictly British English spelling (e.g. neurone, haematology, oedema, ischaemia, dyspnoea, diarrhoea, anaemia, coeliac, phaeochromocytoma, haemophilia, paediatric, tumour, stabilise) and strictly UK NHS/BNF nomenclature (e.g. 'Motor Neurone Disease (MND)' not 'ALS'; Paracetamol, Salbutamol, Adrenaline, Furosemide, Co-careldopa; 999, A&E, GP, ReSPECT, NHS Steroid Emergency Card). Write in purely descriptive, objective third-person clinical language: NEVER include instructions, directives, or imperatives telling a clinician what to do, give, check, or avoid (clinical actions belong in Assessments, not Conditions). Keep bullet points concise and scannable with a short 1-3 word prefix before a colon (max 24 chars before ':'). Return ONLY a flat JSON object with exactly these 9 keys: 'title' (string: official UK NHS condition title), 'phoneticSpelling' (string: hyphenated UK English pronunciation of the main condition name without bracketed acronyms, stressed syllables in ALL CAPS, words separated by spaces), 'category' (string: closest fit from 'Neurological', 'Cardiovascular', 'Respiratory', 'Endocrine & Metabolic', 'Autoimmune & Haematology', or 'GI, Hepatic & Renal'), 'overview' (string: crisp 2-3 sentence plain-English 'What It Is' summary), 'causesAndPathophysiology' (array of 3 to 5 concise 'Label: explanation' strings), 'symptomsAndBaseline' (array of 4 to 5 concise 'Label: explanation' strings covering presentation and typical patient baseline/devices), 'treatments' (array of 3 to 4 concise 'Label: explanation' strings covering NHS management), 'commonMeds' (array of 0 to 5 clean single UK BNF generic drug names without doses, e.g. ['Riluzole', 'Baclofen']), and 'acuteComplications' (array of 3 to 5 concise 'Label: explanation' strings purely describing the acute medical complications, flares, or physiological decompensations associated with this condition that commonly lead to emergency presentations). No markdown, no extra text.`;

    return [{ parts: [{ text: conditionPrompt }] }];
  }

  throw new Error(
    "Invalid `mode`. Expected 'clinical', 'toxicity', 'brand', 'prescription', 'medlist', 'assessment', or 'condition'."
  );
}

const LOCAL_ANALYTICS_EVENTS = new Set([
  '$pageview',
  '$pageleave',
  'app_opened',
  'section_switched',
  'welcome_guide_opened',
  'how_to_use_shortcut_clicked',
  'quick_category_selected',
  'quick_categories_toggled',
  'drug_viewed',
  'brand_hierarchy_viewed',
  'brand_expand_all_clicked',
  'drug_search_no_match',
  'ai_drug_lookup_clicked',
  'pronunciation_played',
  'toxicity_mode_toggled',
  'tox_calculator_used',
  'toxbase_link_clicked',
  'prescription_uploader_toggled',
  'prescription_tab_selected',
  'prescription_scan_started',
  'prescription_scan_completed',
  'prescription_scan_failed',
  'prescription_drug_clicked',
  'prescription_cleared',
  'assessment_category_selected',
  'assessment_viewed',
  'assessment_search_no_match',
  'assessment_ai_generated',
  'condition_category_selected',
  'condition_viewed',
  'condition_search_no_match',
  'condition_ai_generated',
  'condition_med_clicked',
]);

function computeLocalDailyHash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c ^ (i & 0xff);
    h2 = Math.imul(h2, 0x01000193);
  }
  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

function normalizeLocalPosthogHost(rawHost: string): string {
  const trimmed = rawHost.trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://eu.i.posthog.com';
  if (trimmed === 'https://eu.posthog.com') return 'https://eu.i.posthog.com';
  if (trimmed === 'https://us.posthog.com' || trimmed === 'https://app.posthog.com') {
    return 'https://us.i.posthog.com';
  }
  return trimmed;
}

/**
 * Local Vite dev-server middleware that mirrors the Vercel Serverless Functions
 * (`/api/health`, `/api/analytics`, `/api/gemini`, `/api/tts`) during `npm run dev` using server-side
 * environment variables loaded from `.env.local` (never exposed to the client bundle).
 */
function localServerlessApiPlugin(env: Record<string, string>): Plugin {
  const geminiKey = (env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '').trim();
  const ttsKey = (env.GOOGLE_TTS_API_KEY || env.VITE_GOOGLE_TTS_API_KEY || '').trim();
  const posthogKey = (
    env.POSTHOG_API_KEY ||
    env.VITE_POSTHOG_KEY ||
    env.NEXT_PUBLIC_POSTHOG_KEY ||
    ''
  ).trim();
  const posthogHost = normalizeLocalPosthogHost(
    env.POSTHOG_HOST || env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com'
  );

  const isKeyValid = (k: string) =>
    Boolean(
      k &&
        k !== '...' &&
        k !== 'your_gemini_api_key_here' &&
        k !== 'your_google_cloud_tts_api_key_here' &&
        k !== 'your_posthog_project_api_key_here'
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
              analyticsConfigured: isKeyValid(posthogKey),
            })
          );
          return;
        }

        if (url.startsWith('/api/analytics') && req.method === 'POST') {
          if (!isKeyValid(posthogKey)) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: true, skipped: true }));
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
                  events?: Array<{
                    event?: unknown;
                    properties?: unknown;
                    timestamp?: unknown;
                  }>;
                };
                const rawEvents = Array.isArray(parsed.events) ? parsed.events.slice(0, 25) : [];
                const utcDay = new Date().toISOString().slice(0, 10);
                const ua =
                  typeof req.headers['user-agent'] === 'string'
                    ? req.headers['user-agent']
                    : '';
                const ip = req.socket?.remoteAddress || '127.0.0.1';
                const distinctId = computeLocalDailyHash(`${posthogKey}:${utcDay}:${ip}|${ua}`);

                const batch: Array<Record<string, unknown>> = [];
                for (const item of rawEvents) {
                  if (!item || typeof item !== 'object') continue;
                  const eventName = typeof item.event === 'string' ? item.event.trim() : '';
                  if (!LOCAL_ANALYTICS_EVENTS.has(eventName)) continue;

                  const cleanProps: Record<string, unknown> = {};
                  if (
                    item.properties &&
                    typeof item.properties === 'object' &&
                    !Array.isArray(item.properties)
                  ) {
                    for (const [k, v] of Object.entries(item.properties)) {
                      if (k === 'distinct_id' || k === '$ip' || k === '$process_person_profile') {
                        continue;
                      }
                      if (typeof v === 'string') {
                        cleanProps[k] = v.slice(0, k === '$current_url' ? 200 : 120);
                      } else if (
                        (typeof v === 'number' && Number.isFinite(v)) ||
                        typeof v === 'boolean' ||
                        v === null
                      ) {
                        cleanProps[k] = v;
                      }
                    }
                  }
                  cleanProps.distinct_id = distinctId;
                  cleanProps.$ip = null;
                  cleanProps.$process_person_profile = false;

                  batch.push({
                    event: eventName,
                    properties: cleanProps,
                    timestamp:
                      typeof item.timestamp === 'string'
                        ? item.timestamp
                        : new Date().toISOString(),
                  });
                }

                if (batch.length > 0) {
                  await fetch(`${posthogHost}/batch/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ api_key: posthogKey, batch }),
                  });
                }

                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ ok: true, forwarded: batch.length }));
              } catch {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ ok: false }));
              }
            })();
          });
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
                  parsed.mode === 'medlist' ||
                  parsed.mode === 'prescription' ||
                  parsed.mode === 'condition';
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
