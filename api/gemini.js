/**
 * Vercel Serverless Function: `POST /api/gemini`
 * - Keeps `GEMINI_API_KEY` strictly on the server (never exposed in the browser bundle).
 * - Validates request method (`POST`), payload size (< 2 MB), and `Origin` / `Referer`.
 * - Enforces an in-memory per-IP rate limit (max 8 requests/min) and daily circuit breaker (150/day).
 * - Hardcodes upstream model to `gemini-2.5-flash` (with 404 fallback to `gemini-flash-latest`)
 *   and `maxOutputTokens: 450`.
 */

const GEMINI_UPSTREAM_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];

const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_OUTPUT_TOKENS = 450;
const ONE_MINUTE_MS = 60_000;
const ONE_DAY_MS = 86_400_000;
const MAX_PER_MINUTE_PER_IP = 8;
const MAX_PER_DAY_GLOBAL = 150;

const ipTimestamps = new Map();
let globalDailyTimestamps = [];

function getGeminiApiKey() {
  const key = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (!key || key === 'your_gemini_api_key_here' || key === '...') return '';
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
      message: `Daily server study limit reached (${MAX_PER_DAY_GLOBAL} live AI lookups/day). All 101 Quick Category medications and cached lookups remain available immediately.`,
    };
  }

  const existing = (ipTimestamps.get(ip) || []).filter((ts) => now - ts < ONE_MINUTE_MS);
  if (existing.length >= MAX_PER_MINUTE_PER_IP) {
    const waitSeconds = Math.max(1, Math.ceil((ONE_MINUTE_MS - (now - existing[0])) / 1000));
    ipTimestamps.set(ip, existing);
    return {
      allowed: false,
      message: `Rate limit reached (${MAX_PER_MINUTE_PER_IP} Gemini requests/minute). Please wait ${waitSeconds}s before making another live request.`,
    };
  }

  existing.push(now);
  ipTimestamps.set(ip, existing);
  globalDailyTimestamps.push(now);
  return { allowed: true };
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    const serialized = JSON.stringify(req.body);
    if (serialized.length > MAX_PAYLOAD_BYTES) {
      const err = new Error('Request payload exceeds 2 MB limit.');
      err.statusCode = 413;
      throw err;
    }
    return req.body;
  }

  if (typeof req.body === 'string') {
    if (req.body.length > MAX_PAYLOAD_BYTES) {
      const err = new Error('Request payload exceeds 2 MB limit.');
      err.statusCode = 413;
      throw err;
    }
    return JSON.parse(req.body);
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;

    req.on('data', (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_PAYLOAD_BYTES) {
        const err = new Error('Request payload exceeds 2 MB limit.');
        err.statusCode = 413;
        reject(err);
        req.destroy?.();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(raw));
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

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return sendJson(res, 500, {
      error:
        'Server GEMINI_API_KEY is not configured. Please add GEMINI_API_KEY in your Vercel Environment Variables.',
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

  if (!body || !Array.isArray(body.contents)) {
    return sendJson(res, 400, { error: 'Missing required `contents` array in Gemini request.' });
  }

  const upstreamPayload = JSON.stringify({
    contents: body.contents,
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  try {
    let lastStatus = 502;
    let lastJson = { error: 'Upstream Gemini request failed.' };

    for (const endpoint of GEMINI_UPSTREAM_ENDPOINTS) {
      const upstreamRes = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: upstreamPayload,
      });

      lastStatus = upstreamRes.status;
      const text = await upstreamRes.text();
      try {
        lastJson = JSON.parse(text);
      } catch {
        lastJson = { error: text || upstreamRes.statusText };
      }

      if (upstreamRes.ok || upstreamRes.status !== 404) {
        break;
      }
    }

    return sendJson(res, lastStatus, lastJson);
  } catch (err) {
    return sendJson(res, 502, {
      error: err instanceof Error ? err.message : 'Failed to reach Google Gemini API.',
    });
  }
}
