/**
 * Vercel Serverless Function: `POST /api/gemini`
 * - Keeps `GEMINI_API_KEY` strictly on the server (never exposed in the browser bundle).
 * - Requires a valid `Origin` or `Referer` header (`medspeak.co.uk`, `*.vercel.app`, `localhost`);
 *   rejects requests with missing origin/referer headers.
 * - Rejects arbitrary prompts: only accepts structured `{ mode: 'clinical' | 'toxicity', drugName }`
 *   (with `drugName` capped at 120 characters) or `{ mode: 'prescription', base64Data, mimeType }`
 *   and builds the locked UK Paramedic pharmacology prompt on the server.
 * - Enforces an in-memory per-IP rate limit (max 8 requests/min) and daily circuit breaker (150/day).
 * - Hardcodes upstream model to `gemini-2.5-flash` (with `thinkingBudget: 0` and `maxOutputTokens: 1500`).
 */

const GEMINI_UPSTREAM_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];

const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_OUTPUT_TOKENS = 1500;
const MAX_MULTI_DRUG_OUTPUT_TOKENS = 2048;
const MAX_DRUG_NAME_LENGTH = 120;
const MAX_MEDLIST_TEXT_LENGTH = 4000;
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

  // Reject direct script/curl requests that provide neither Origin nor Referer
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

/**
 * Server-locked prompt templates so clients cannot send arbitrary free-form prompts.
 */
function buildClinicalPrompt(drugName) {
  return `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${drugName}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`;
}

function buildToxicityPrompt(drugName) {
  return `You are a UK Paramedic and Toxbase/JRCALC expert. Provide pre-hospital overdose information for '${drugName}'. Return ONLY flat JSON with exactly these keys: 'overdoseEffects' (string: plain-English summary of how the overdose presents clinically and vital sign changes) and 'toxicThreshold' (string: known toxic dose limit, e.g., '>75mg/kg' or specific mg amount).`;
}

function buildPrescriptionVisionPrompt() {
  return "You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine this image of a prescription, repeat medication list, discharge summary, or medicine packaging. Keep all points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 5 keys: 'medications' (array of strings: distinct UK generic/BNF drug names visible), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions or synergistic overdose effects between these medications), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are visible, return empty arrays for all keys.";
}

function buildMedListTextPrompt(scrubbedText) {
  return `You are a UK Paramedic (JRCALC), Toxbase, and BNF pharmacology expert. Examine the following pasted text from a prescription table, repeat medication list, discharge summary, or clinical letter. Extract all distinct UK medications mentioned, converting UK brand names (such as Eliquis, Xarelto, MST Continus, Zomorph, Ventolin, Clenil, Epilim, Plavix, Brilique) to their generic UK BNF / rINN name where identifiable (e.g. 'Apixaban', 'Rivaroxaban', 'Morphine Sulfate', 'Salbutamol'). Keep all summary points streamlined, concise, and easy to scan (1 short sentence or phrase per bullet, max 15 words each). Return ONLY a flat JSON object with exactly these 5 keys: 'medications' (array of strings: distinct UK generic/BNF drug names found), 'patientConditions' (array of 2 to 4 brief strings: what medical conditions/PMH the patient likely has based on these meds, naming the relevant drugs in brackets), 'onSceneBullets' (array of 2 to 4 brief strings: key pre-hospital on-scene considerations such as bleeding risk, masked tachycardia, postural hypotension, or hypoglycaemia risk), 'interactionBullets' (array of 2 to 4 brief strings: dangerous drug-drug interactions or synergistic overdose effects between these medications), and 'toxRedFlagBullets' (array of 2 to 4 brief strings: key vital sign or ECG red flags to watch for in a mixed overdose of these drugs). If no medications are found, return empty arrays for all keys.\n\nPASTED MEDICATION TEXT:\n${scrubbedText}`;
}

function buildAssessmentPrompt(conditionName) {
  return `You are a UK Paramedic (JRCALC / NICE) pre-hospital clinical assessment expert. Create a rapid-reference pocketbook assessment checklist for a patient presenting with '${conditionName}'. Keep every bullet ultra-concise, telegraphic, and straight to the point (no prose explanations, no filler). For 'keyQuestions' and 'keyAssessments', start each string with a short 1-3 word label followed by a colon (max 24 chars before ':'), e.g. 'Onset: Sudden or gradual? What were they doing?' or 'Obs: RR, SpO2, HR, BP, Temp, BM, GCS'. Return ONLY a flat JSON object with exactly these 5 keys: 'title' (string: clean UK clinical title for the condition/presentation), 'category' (string: choose the closest fit from 'Cardiovascular', 'Respiratory', 'Neurological', 'Abdominal, GI & Renal', 'Medical, Endocrine & Sepsis', 'Trauma & MSK', or 'Maternity, Paeds & Mental Health'), 'keyQuestions' (array of 5 to 7 concise SOCRATES/SOCATE/ROS history questions in 'Label: question?' format), 'keyAssessments' (array of 4 to 6 concise bedside primary/secondary survey checks in 'Label: check' format), and 'redFlags' (array of 4 to 5 blunt time-critical red flag signs/symptoms). No markdown, no extra text.`;
}

function buildBrandPrompt(queryName) {
  return `You are a UK BNF and NHS prescribing expert. Determine whether '${queryName}' is a UK brand-name medication or multi-ingredient combination product. Return ONLY a flat JSON object with exactly these 4 keys: 'isBrandOrCombination' (boolean: true if '${queryName}' is a brand/trade name or fixed-dose combination product, false if it is already a single generic UK BNF / rINN drug name), 'productName' (string: clean capitalised brand or product name), 'subtitle' (string: brief 2 to 5 word UK formulation/class description, or empty string), and 'constituents' (array of 1 to 5 strings: the distinct active generic UK BNF / rINN drug names contained in the product, e.g. ['Beclometasone dipropionate', 'Formoterol fumarate', 'Glycopyrronium']). No markdown, no extra text.`;
}

/**
 * Validates the incoming structured request body and returns the locked Gemini `contents` array.
 */
function buildLockedContentsFromBody(body) {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid JSON request payload.');
  }

  const mode = body.mode;

  if (mode === 'clinical' || mode === 'toxicity' || mode === 'brand') {
    const rawDrugName = typeof body.drugName === 'string' ? body.drugName.trim() : '';
    if (!rawDrugName) {
      throw new Error('Missing required `drugName` string.');
    }
    if (rawDrugName.length > MAX_DRUG_NAME_LENGTH) {
      throw new Error(`drugName exceeds maximum length of ${MAX_DRUG_NAME_LENGTH} characters.`);
    }
    // Strip control characters or quotes that could attempt prompt injection
    const sanitizedDrugName = rawDrugName.replace(/[\r\n"'`\\]/g, ' ').trim();
    const prompt =
      mode === 'clinical'
        ? buildClinicalPrompt(sanitizedDrugName)
        : mode === 'toxicity'
        ? buildToxicityPrompt(sanitizedDrugName)
        : buildBrandPrompt(sanitizedDrugName);

    return [{ parts: [{ text: prompt }] }];
  }

  if (mode === 'prescription') {
    const base64Data = typeof body.base64Data === 'string' ? body.base64Data.trim() : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType.trim() : '';

    if (!base64Data || !mimeType.startsWith('image/')) {
      throw new Error('Missing valid `base64Data` or `image/*` `mimeType` for prescription scan.');
    }

    return [
      {
        parts: [
          { text: buildPrescriptionVisionPrompt() },
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
    return [{ parts: [{ text: buildMedListTextPrompt(cappedText) }] }];
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
    return [{ parts: [{ text: buildAssessmentPrompt(sanitizedCondition) }] }];
  }

  throw new Error(
    "Invalid `mode`. Expected 'clinical', 'toxicity', 'brand', 'prescription', 'medlist', or 'assessment'."
  );
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

  let contents;
  try {
    contents = buildLockedContentsFromBody(body);
  } catch (err) {
    return sendJson(res, 400, {
      error: err instanceof Error ? err.message : 'Invalid request parameters.',
    });
  }

  try {
    let lastStatus = 502;
    let lastJson = { error: 'Upstream Gemini request failed.' };
    const isMultiDrugMode = body.mode === 'medlist' || body.mode === 'prescription';
    const maxOutputTokens = isMultiDrugMode
      ? MAX_MULTI_DRUG_OUTPUT_TOKENS
      : MAX_OUTPUT_TOKENS;

    for (const endpoint of GEMINI_UPSTREAM_ENDPOINTS) {
      const generationConfig = {
        responseMimeType: 'application/json',
        maxOutputTokens,
        thinkingConfig: { thinkingBudget: 0 },
      };

      const upstreamPayload = JSON.stringify({
        contents,
        generationConfig,
      });

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

      if (upstreamRes.ok) {
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
