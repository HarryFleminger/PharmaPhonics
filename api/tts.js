/**
 * Vercel Serverless Function: `POST /api/tts`
 * - Keeps `GOOGLE_TTS_API_KEY` strictly on the server (never exposed in the browser bundle).
 * - Validates `POST`, `Origin` / `Referer`, and per-IP rate limit (max 15 requests/min).
 * - Hardcodes voice to British English `en-GB-Neural2-B` (`en-GB`, `MP3`).
 */

const GOOGLE_TTS_UPSTREAM_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
const MAX_PAYLOAD_BYTES = 128 * 1024; // 128 KB max for text/SSML synthesis
const ONE_MINUTE_MS = 60_000;
const ONE_DAY_MS = 86_400_000;
const MAX_PER_MINUTE_PER_IP = 15;
const MAX_PER_DAY_GLOBAL = 250;

const ipTimestamps = new Map();
let globalDailyTimestamps = [];

function getTtsApiKey() {
  const key = (
    process.env.GOOGLE_TTS_API_KEY ||
    process.env.VITE_GOOGLE_TTS_API_KEY ||
    ''
  ).trim();
  if (!key || key === 'your_google_cloud_tts_api_key_here' || key === '...') return '';
  return key;
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim() !== '') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function isOriginAllowed(req) {
  const origin = req.headers?.origin || '';
  const referer = req.headers?.referer || '';
  const host = req.headers?.host || '';

  if (!origin && !referer) return true;

  const isAllowedUrl = (rawUrl) => {
    if (!rawUrl) return true;
    try {
      const parsed = new URL(rawUrl);
      const hostname = parsed.hostname.toLowerCase();
      return (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === 'medspeak.co.uk' ||
        hostname === 'www.medspeak.co.uk' ||
        hostname.endsWith('.medspeak.co.uk') ||
        hostname.endsWith('.vercel.app') ||
        hostname.endsWith('.onrender.com') ||
        (host && parsed.host.toLowerCase() === host.toLowerCase())
      );
    } catch {
      return false;
    }
  };

  if (origin && !isAllowedUrl(origin)) return false;
  if (!origin && referer && !isAllowedUrl(referer)) return false;
  return true;
}

function checkRateLimit(ip) {
  const now = Date.now();

  globalDailyTimestamps = globalDailyTimestamps.filter((ts) => now - ts < ONE_DAY_MS);
  if (globalDailyTimestamps.length >= MAX_PER_DAY_GLOBAL) {
    return {
      allowed: false,
      message: `Daily server study limit reached (${MAX_PER_DAY_GLOBAL} voice syntheses/day). Previously played drug pronunciations remain available from cache.`,
    };
  }

  const existing = (ipTimestamps.get(ip) || []).filter((ts) => now - ts < ONE_MINUTE_MS);
  if (existing.length >= MAX_PER_MINUTE_PER_IP) {
    const waitSeconds = Math.max(1, Math.ceil((ONE_MINUTE_MS - (now - existing[0])) / 1000));
    ipTimestamps.set(ip, existing);
    return {
      allowed: false,
      message: `Rate limit reached (${MAX_PER_MINUTE_PER_IP} voice requests/minute). Please wait ${waitSeconds}s.`,
    };
  }

  existing.push(now);
  ipTimestamps.set(ip, existing);
  globalDailyTimestamps.push(now);
  return { allowed: true };
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body);
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    req.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_PAYLOAD_BYTES) {
        const err = new Error('Payload too large.');
        err.statusCode = 413;
        reject(err);
        req.destroy?.();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('Invalid JSON request body.'));
      }
    });

    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(status).json(data);
  }
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, { error: 'Forbidden origin.' });
  }

  const apiKey = getTtsApiKey();
  if (!apiKey) {
    return sendJson(res, 500, {
      error:
        'Server GOOGLE_TTS_API_KEY is not configured. Please add GOOGLE_TTS_API_KEY in your Vercel Environment Variables.',
    });
  }

  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return sendJson(res, 429, { error: rateCheck.message });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    const status = err?.statusCode === 413 ? 413 : 400;
    return sendJson(res, status, {
      error: err instanceof Error ? err.message : 'Invalid request body.',
    });
  }

  const input = body?.input;
  if (!input || (typeof input.text !== 'string' && typeof input.ssml !== 'string')) {
    return sendJson(res, 400, { error: 'Missing required `input.text` or `input.ssml` field.' });
  }

  const rawRate = Number(body?.speakingRate);
  const speakingRate = rawRate === 0.75 ? 0.75 : 1.0;

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
      `${GOOGLE_TTS_UPSTREAM_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: upstreamPayload,
      }
    );

    const text = await upstreamRes.text();
    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      parsedJson = { error: text || upstreamRes.statusText };
    }

    return sendJson(res, upstreamRes.status, parsedJson);
  } catch (err) {
    return sendJson(res, 502, {
      error: err instanceof Error ? err.message : 'Failed to reach Google Cloud TTS API.',
    });
  }
}
