import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads environment variables from `.env.local` and `.env` if present (zero-dependency parser)
 * so local execution works seamlessly without external packages.
 */
function loadLocalEnvFiles() {
  const envFiles = ['.env.local', '.env'];
  for (const fileName of envFiles) {
    const fullPath = path.join(__dirname, fileName);
    if (!fs.existsSync(fullPath)) continue;

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx <= 0) continue;

        const key = line.slice(0, eqIdx).trim();
        let value = line.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
    } catch {
      // Ignore file read errors
    }
  }
}

loadLocalEnvFiles();

/**
 * Resolves the server-side Gemini API key (supports `GEMINI_API_KEY`, with fallback to
 * `VITE_GEMINI_API_KEY` on the server environment for backwards compatibility).
 */
function getServerGeminiKey() {
  const key = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (!key || key === 'your_gemini_api_key_here' || key === '...') return '';
  return key;
}

/**
 * Resolves the server-side Google Cloud TTS API key (supports `GOOGLE_TTS_API_KEY`, with fallback
 * to `VITE_GOOGLE_TTS_API_KEY` on the server environment for backwards compatibility).
 */
function getServerTtsKey() {
  const key = (
    process.env.GOOGLE_TTS_API_KEY ||
    process.env.VITE_GOOGLE_TTS_API_KEY ||
    ''
  ).trim();
  if (!key || key === 'your_google_cloud_tts_api_key_here' || key === '...') return '';
  return key;
}

// Locked upstream endpoints and safety caps
const GEMINI_UPSTREAM_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];
const GOOGLE_TTS_UPSTREAM_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2 MB hard cap
const MAX_GEMINI_OUTPUT_TOKENS = 1500;

// Server-side sliding-window & daily circuit-breaker limits
const ONE_MINUTE_MS = 60_000;
const ONE_DAY_MS = 86_400_000;

const RATE_POLICIES = {
  gemini: {
    maxPerMinutePerIp: 8,
    maxPerDayGlobal: 150,
    label: 'Gemini AI clinical lookup',
  },
  tts: {
    maxPerMinutePerIp: 15,
    maxPerDayGlobal: 250,
    label: 'UK voice audio synthesis',
  },
};

const ipRequestTimestamps = {
  gemini: new Map(),
  tts: new Map(),
};

const globalDailyTimestamps = {
  gemini: [],
  tts: [],
};

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim() !== '') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Checks whether the request Origin / Referer comes from an allowed MedSpeak host
 * (`medspeak.co.uk`, `*.onrender.com`, `localhost`, `127.0.0.1`, or same-origin).
 */
function isOriginAllowed(req) {
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  const host = req.headers.host || '';

  // Reject direct script/curl requests that provide neither Origin nor Referer
  if (!origin && !referer) return false;

  const checkUrl = (rawUrl) => {
    if (!rawUrl) return true;
    try {
      const parsed = new URL(rawUrl);
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === 'medspeak.co.uk' ||
        hostname.endsWith('.medspeak.co.uk') ||
        hostname.endsWith('.onrender.com') ||
        (host && parsed.host.toLowerCase() === host.toLowerCase())
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  if (origin && !checkUrl(origin)) return false;
  if (!origin && referer && !checkUrl(referer)) return false;
  return true;
}

/**
 * Enforces per-IP per-minute and global daily circuit-breaker limits.
 * Returns `{ allowed: true }` or `{ allowed: false, status: 429, message: string }`.
 */
function checkServerRateLimit(bucket, ip) {
  const policy = RATE_POLICIES[bucket];
  const now = Date.now();

  // 1. Clean & check global 24-hour circuit breaker
  globalDailyTimestamps[bucket] = globalDailyTimestamps[bucket].filter(
    (ts) => now - ts < ONE_DAY_MS
  );
  if (globalDailyTimestamps[bucket].length >= policy.maxPerDayGlobal) {
    return {
      allowed: false,
      status: 429,
      message: `Daily server quota reached for ${policy.label}s (${policy.maxPerDayGlobal}/day). All 101 Quick Category drugs and cached lookups remain available immediately.`,
    };
  }

  // 2. Clean & check per-IP 1-minute sliding window
  const ipMap = ipRequestTimestamps[bucket];
  const existingIpTimestamps = (ipMap.get(ip) || []).filter(
    (ts) => now - ts < ONE_MINUTE_MS
  );

  if (existingIpTimestamps.length >= policy.maxPerMinutePerIp) {
    const oldest = existingIpTimestamps[0];
    const waitSeconds = Math.max(1, Math.ceil((ONE_MINUTE_MS - (now - oldest)) / 1000));
    ipMap.set(ip, existingIpTimestamps);
    return {
      allowed: false,
      status: 429,
      message: `Rate limit reached (${policy.maxPerMinutePerIp} ${policy.label}s/min). Please wait ${waitSeconds}s before making another live request.`,
    };
  }

  // Record request
  existingIpTimestamps.push(now);
  ipMap.set(ip, existingIpTimestamps);
  globalDailyTimestamps[bucket].push(now);

  return { allowed: true };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readRequestBody(req, maxBytes = MAX_PAYLOAD_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    let rejected = false;

    req.on('data', (chunk) => {
      if (rejected) return;
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        rejected = true;
        const err = new Error('Payload Too Large');
        err.statusCode = 413;
        reject(err);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (rejected) return;
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', (err) => {
      if (!rejected) reject(err);
    });
  });
}

/**
 * Handles `/api/health`, `/api/gemini`, `/api/tts`, and `/api/openprescribing/*`.
 * Returns `true` if the request matched an `/api/` route, or `false` to fall through to static files.
 */
export async function handleApiRequest(req, res) {
  const rawUrl = req.url || '/';
  const parsedUrl = new URL(rawUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (!pathname.startsWith('/api/')) {
    return false;
  }

  // 1. GET /api/health
  if (pathname === '/api/health' && req.method === 'GET') {
    sendJson(res, 200, {
      geminiConfigured: Boolean(getServerGeminiKey()),
      ttsConfigured: Boolean(getServerTtsKey()),
    });
    return true;
  }

  // 2. GET /api/openprescribing/*
  if (pathname.startsWith('/api/openprescribing/') && req.method === 'GET') {
    const upstreamPath = pathname.replace(/^\/api\/openprescribing/, '');
    const upstreamUrl = `https://openprescribing.net${upstreamPath}${parsedUrl.search}`;

    try {
      const upstreamRes = await fetch(upstreamUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MedSpeak-UK-Paramedic-Study-App/1.0',
        },
      });
      const text = await upstreamRes.text();
      res.writeHead(upstreamRes.status, {
        'Content-Type': upstreamRes.headers.get('content-type') || 'application/json',
      });
      res.end(text);
    } catch (err) {
      sendJson(res, 502, {
        error: err instanceof Error ? err.message : 'OpenPrescribing proxy error',
      });
    }
    return true;
  }

  // 3. POST /api/gemini
  if (pathname === '/api/gemini' && req.method === 'POST') {
    if (!isOriginAllowed(req)) {
      sendJson(res, 403, { error: 'Forbidden origin.' });
      return true;
    }

    const geminiKey = getServerGeminiKey();
    if (!geminiKey) {
      sendJson(res, 500, {
        error:
          'Server GEMINI_API_KEY is not configured. Set GEMINI_API_KEY in your environment variables.',
      });
      return true;
    }

    const ip = getClientIp(req);
    const rateCheck = checkServerRateLimit('gemini', ip);
    if (!rateCheck.allowed) {
      sendJson(res, rateCheck.status, { error: rateCheck.message });
      return true;
    }

    let rawBody = '';
    try {
      rawBody = await readRequestBody(req, MAX_PAYLOAD_BYTES);
    } catch (err) {
      if (err && err.statusCode === 413) {
        sendJson(res, 413, { error: 'Request payload exceeds 2 MB limit.' });
        return true;
      }
      sendJson(res, 400, { error: 'Failed to read request body.' });
      return true;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON request body.' });
      return true;
    }

    let contents;
    try {
      const mode = parsedBody?.mode;
      if (mode === 'clinical' || mode === 'toxicity') {
        const rawDrugName =
          typeof parsedBody.drugName === 'string' ? parsedBody.drugName.trim() : '';
        if (!rawDrugName || rawDrugName.length > 120) {
          throw new Error('Missing or invalid `drugName` (max 120 chars).');
        }
        const sanitized = rawDrugName.replace(/[\r\n"'`\\]/g, ' ').trim();
        const prompt =
          mode === 'clinical'
            ? `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${sanitized}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`
            : `You are a UK Paramedic and Toxbase/JRCALC expert. Provide pre-hospital overdose information for '${sanitized}'. Return ONLY flat JSON with exactly these keys: 'overdoseEffects' (string: plain-English summary of how the overdose presents clinically and vital sign changes) and 'toxicThreshold' (string: known toxic dose limit, e.g., '>75mg/kg' or specific mg amount).`;
        contents = [{ parts: [{ text: prompt }] }];
      } else if (mode === 'prescription') {
        const base64Data =
          typeof parsedBody.base64Data === 'string' ? parsedBody.base64Data.trim() : '';
        const mimeType =
          typeof parsedBody.mimeType === 'string' ? parsedBody.mimeType.trim() : '';
        if (!base64Data || !mimeType.startsWith('image/')) {
          throw new Error('Missing valid `base64Data` or `image/*` `mimeType`.');
        }
        const visionPrompt =
          "You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine this image of a prescription, repeat medication list, discharge summary, or medicine packaging. Keep all points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 5 keys: 'medications' (array of strings: distinct UK generic/BNF drug names visible), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions or synergistic overdose effects between these medications), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are visible, return empty arrays for all keys.";
        contents = [
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
      } else {
        throw new Error("Invalid `mode`. Expected 'clinical', 'toxicity', or 'prescription'.");
      }
    } catch (err) {
      sendJson(res, 400, {
        error: err instanceof Error ? err.message : 'Invalid request parameters.',
      });
      return true;
    }

    try {
      let lastRes = null;
      let lastText = '';

      for (const endpoint of GEMINI_UPSTREAM_ENDPOINTS) {
        const isGemini25 = endpoint.includes('gemini-2.5-flash');
        const generationConfig = isGemini25
          ? {
              responseMimeType: 'application/json',
              maxOutputTokens: MAX_GEMINI_OUTPUT_TOKENS,
              thinkingConfig: { thinkingBudget: 0 },
            }
          : {
              responseMimeType: 'application/json',
              maxOutputTokens: MAX_GEMINI_OUTPUT_TOKENS,
            };

        const upstreamPayload = JSON.stringify({
          contents,
          generationConfig,
        });

        const encodedKey = encodeURIComponent(geminiKey);
        const upstreamRes = await fetch(`${endpoint}?key=${encodedKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey,
          },
          body: upstreamPayload,
        });

        lastRes = upstreamRes;
        lastText = await upstreamRes.text();

        if (upstreamRes.ok) {
          break;
        }
      }

      res.writeHead(lastRes ? lastRes.status : 502, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(lastText || JSON.stringify({ error: 'Empty response from upstream Gemini API.' }));
    } catch (err) {
      sendJson(res, 502, {
        error: err instanceof Error ? err.message : 'Upstream Gemini request failed.',
      });
    }
    return true;
  }

  // 4. POST /api/tts
  if (pathname === '/api/tts' && req.method === 'POST') {
    if (!isOriginAllowed(req)) {
      sendJson(res, 403, { error: 'Forbidden origin.' });
      return true;
    }

    const ttsKey = getServerTtsKey();
    if (!ttsKey) {
      sendJson(res, 500, {
        error:
          'Server GOOGLE_TTS_API_KEY is not configured. Set GOOGLE_TTS_API_KEY in your environment variables.',
      });
      return true;
    }

    const ip = getClientIp(req);
    const rateCheck = checkServerRateLimit('tts', ip);
    if (!rateCheck.allowed) {
      sendJson(res, rateCheck.status, { error: rateCheck.message });
      return true;
    }

    let rawBody = '';
    try {
      rawBody = await readRequestBody(req, MAX_PAYLOAD_BYTES);
    } catch (err) {
      if (err && err.statusCode === 413) {
        sendJson(res, 413, { error: 'Request payload exceeds 2 MB limit.' });
        return true;
      }
      sendJson(res, 400, { error: 'Failed to read request body.' });
      return true;
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      sendJson(res, 400, { error: 'Invalid JSON request body.' });
      return true;
    }

    const input = parsedBody?.input;
    if (!input || (typeof input.text !== 'string' && typeof input.ssml !== 'string')) {
      sendJson(res, 400, { error: 'Missing required `input.text` or `input.ssml` field.' });
      return true;
    }

    const rawRate = Number(parsedBody?.speakingRate);
    const speakingRate = rawRate === 0.75 ? 0.75 : 1.0;

    // Strictly lock voice to British English en-GB-Neural2-B
    const upstreamPayload = JSON.stringify({
      input,
      voice: {
        languageCode: 'en-GB',
        name: 'en-GB-Neural2-B',
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch: 0.0,
      },
    });

    try {
      const upstreamRes = await fetch(
        `${GOOGLE_TTS_UPSTREAM_ENDPOINT}?key=${encodeURIComponent(ttsKey)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: upstreamPayload,
        }
      );

      const text = await upstreamRes.text();
      res.writeHead(upstreamRes.status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(text);
    } catch (err) {
      sendJson(res, 502, {
        error: err instanceof Error ? err.message : 'Upstream Google Cloud TTS request failed.',
      });
    }
    return true;
  }

  sendJson(res, 404, { error: `Unknown API endpoint: ${pathname}` });
  return true;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const distDir = path.join(__dirname, 'dist');

const server = http.createServer(async (req, res) => {
  try {
    const handled = await handleApiRequest(req, res);
    if (handled) return;

    // Serve static files from dist/ with SPA fallback to dist/index.html
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const safeSubPath = path
      .normalize(decodeURIComponent(parsedUrl.pathname))
      .replace(/^(\.\.(\/|\\|$))+/, '');
    let filePath = path.join(distDir, safeSubPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      filePath = path.join(distDir, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Frontend build not found in dist/. Run `npm run build` first.');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isHashedAsset = parsedUrl.pathname.startsWith('/assets/');

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error('[MedSpeak Server] Unexpected error:', err);
    if (!res.headersSent) {
      sendJson(res, 500, { error: 'Internal server error.' });
    }
  }
});

// Start listening only when server.js is executed directly (`node server.js` / `npm start`)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const PORT = Number(process.env.PORT) || 3001;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[MedSpeak Server] Listening on http://0.0.0.0:${PORT}`);
    console.log(
      `[MedSpeak Server] Gemini Key Configured: ${Boolean(
        getServerGeminiKey()
      )} | TTS Key Configured: ${Boolean(getServerTtsKey())}`
    );
  });
}
