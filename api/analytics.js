/**
 * Vercel Serverless Function: `POST /api/analytics`
 * - First-party cookieless proxy forwarding anonymous MedSpeak UX/usage events to PostHog EU/US.
 * - Keeps `POSTHOG_API_KEY` strictly on the server (never exposed to the browser bundle).
 * - Computes a one-way rotating daily HMAC hash (`distinct_id`) across serverless instances and
 *   strips raw IP / person-profile persistence (`$ip: null`, `$process_person_profile: false`)
 *   so unique daily user counts & funnels work with zero cookies and no cookie banner.
 * - Enforces event allow-listing and server-side PII scrubbing before forwarding.
 */

import crypto from 'node:crypto';

const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB hard cap
const MAX_EVENTS_PER_BATCH = 25;
const MAX_PROPS_PER_EVENT = 25;
const ONE_MINUTE_MS = 60_000;
const MAX_PER_MINUTE_PER_IP = 120;

const ipTimestamps = new Map();

const ALLOWED_EVENTS = new Set([
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
  'condition_assessment_clicked',
]);

function getPosthogApiKey() {
  const key = (
    process.env.POSTHOG_API_KEY ||
    process.env.VITE_POSTHOG_KEY ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    ''
  ).trim();
  if (!key || key === 'your_posthog_project_api_key_here' || key === '...') {
    return '';
  }
  return key;
}

function normalizePosthogHost(rawHost) {
  const trimmed = (rawHost || '').trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://eu.i.posthog.com';
  if (trimmed === 'https://eu.posthog.com') return 'https://eu.i.posthog.com';
  if (trimmed === 'https://us.posthog.com' || trimmed === 'https://app.posthog.com') {
    return 'https://us.i.posthog.com';
  }
  return trimmed;
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

  if (!origin && !referer) return false;

  const isAllowedUrl = (rawUrl) => {
    if (!rawUrl) return false;
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

  if (origin && !isOriginAllowedUrl(origin, isAllowedUrl)) return false;
  if (!origin && referer && !isOriginAllowedUrl(referer, isAllowedUrl)) return false;
  return true;
}

function isOriginAllowedUrl(rawUrl, checker) {
  return checker(rawUrl);
}

function checkRateLimit(ip) {
  const now = Date.now();
  const existing = (ipTimestamps.get(ip) || []).filter((ts) => now - ts < ONE_MINUTE_MS);
  if (existing.length >= MAX_PER_MINUTE_PER_IP) {
    ipTimestamps.set(ip, existing);
    return false;
  }
  existing.push(now);
  ipTimestamps.set(ip, existing);
  return true;
}

function scrubAnalyticsString(value, key) {
  if (key === '$current_url') {
    try {
      const parsed = new URL(value);
      return `${parsed.origin}${parsed.pathname}`.slice(0, 200);
    } catch {
      return value.split(/[?#]/)[0].slice(0, 200);
    }
  }

  return value
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[redacted]')
    .replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, '[redacted]')
    .replace(/\b\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}\b/g, '[redacted]')
    .replace(/\b[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}\b/gi, '[redacted]')
    .replace(/\b(?:\+44\s?7\d{3}|\(?07\d{3}\)?|\(?0[12]\d{2,3}\)?)\s?\d{3}\s?\d{3,4}\b/g, '[redacted]')
    .trim()
    .slice(0, 120);
}

function sanitizeProperties(rawProps, distinctId) {
  const sanitized = {};

  if (rawProps && typeof rawProps === 'object' && !Array.isArray(rawProps)) {
    let count = 0;
    for (const [key, val] of Object.entries(rawProps)) {
      if (count >= MAX_PROPS_PER_EVENT) break;
      if (!key || key.length > 64) continue;
      if (key === 'distinct_id' || key === '$ip' || key === '$process_person_profile') {
        continue;
      }

      if (typeof val === 'string') {
        sanitized[key] = scrubAnalyticsString(val, key);
        count += 1;
      } else if (typeof val === 'number' && Number.isFinite(val)) {
        sanitized[key] = val;
        count += 1;
      } else if (typeof val === 'boolean' || val === null) {
        sanitized[key] = val;
        count += 1;
      }
    }
  }

  sanitized.distinct_id = distinctId;
  sanitized.$ip = null;
  sanitized.$process_person_profile = false;
  return sanitized;
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    const serialized = JSON.stringify(req.body);
    if (serialized.length > MAX_PAYLOAD_BYTES) {
      const err = new Error('Analytics payload exceeds 32 KB limit.');
      err.statusCode = 413;
      throw err;
    }
    return req.body;
  }

  if (typeof req.body === 'string') {
    if (req.body.length > MAX_PAYLOAD_BYTES) {
      const err = new Error('Analytics payload exceeds 32 KB limit.');
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
        const err = new Error('Analytics payload exceeds 32 KB limit.');
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
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, { error: 'Forbidden origin.' });
  }

  const posthogKey = getPosthogApiKey();
  if (!posthogKey) {
    return sendJson(res, 200, { ok: true, skipped: true });
  }

  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return sendJson(res, 429, { error: 'Analytics rate limit reached.' });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    return sendJson(res, err?.statusCode === 413 ? 413 : 400, {
      error: err instanceof Error ? err.message : 'Invalid request body.',
    });
  }

  const rawEvents = Array.isArray(body?.events) ? body.events.slice(0, MAX_EVENTS_PER_BATCH) : [];
  if (rawEvents.length === 0) {
    return sendJson(res, 200, { ok: true, forwarded: 0 });
  }

  const utcDay = new Date().toISOString().slice(0, 10);
  const userAgent =
    typeof req.headers?.['user-agent'] === 'string' ? req.headers['user-agent'] : '';
  const distinctId = crypto
    .createHmac('sha256', `${posthogKey}:${utcDay}`)
    .update(`${clientIp}|${userAgent}`)
    .digest('hex')
    .slice(0, 32);

  const batch = [];
  for (const item of rawEvents) {
    if (!item || typeof item !== 'object') continue;
    const eventName = typeof item.event === 'string' ? item.event.trim() : '';
    if (!ALLOWED_EVENTS.has(eventName)) continue;

    batch.push({
      event: eventName,
      properties: sanitizeProperties(item.properties, distinctId),
      timestamp:
        typeof item.timestamp === 'string' && !Number.isNaN(Date.parse(item.timestamp))
          ? item.timestamp
          : new Date().toISOString(),
    });
  }

  if (batch.length === 0) {
    return sendJson(res, 200, { ok: true, forwarded: 0 });
  }

  const host = normalizePosthogHost(
    process.env.POSTHOG_HOST || process.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com'
  );

  try {
    const upstreamRes = await fetch(`${host}/batch/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: posthogKey,
        batch,
      }),
    });

    if (!upstreamRes.ok) {
      return sendJson(res, 200, { ok: false, status: upstreamRes.status });
    }

    return sendJson(res, 200, { ok: true, forwarded: batch.length });
  } catch {
    return sendJson(res, 200, { ok: false });
  }
}
