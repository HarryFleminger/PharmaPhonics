import { GeminiClinicalDetails } from '../types/medication';

/**
 * Active Gemini Flash model endpoints.
 */
const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];

/**
 * Versioned localStorage key for persisting AI-generated clinical details across browser sessions
 * so previously looked-up drugs load instantaneously without consuming Gemini API tokens.
 */
const CLINICAL_STORAGE_KEY = 'pharmaphonics_clinical_cache_v1';

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// In-memory cache hydrated from localStorage
const clinicalDetailsCache = new Map<string, GeminiClinicalDetails>();

function isValidClinicalDetails(value: unknown): value is GeminiClinicalDetails {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.phoneticSpelling === 'string' &&
    record.phoneticSpelling.trim() !== '' &&
    typeof record.class === 'string' &&
    record.class.trim() !== '' &&
    typeof record.medicSummary === 'string' &&
    record.medicSummary.trim() !== '' &&
    Array.isArray(record.indications) &&
    record.indications.length > 0 &&
    record.indications.every((item) => typeof item === 'string')
  );
}

/**
 * Loads all cached clinical details from localStorage into memory on startup.
 */
function hydrateCacheFromLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const raw = window.localStorage.getItem(CLINICAL_STORAGE_KEY);
    if (!raw) return;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isValidClinicalDetails(value)) {
        clinicalDetailsCache.set(key, value);
      }
    }
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not read localStorage cache:', err);
  }
}

/**
 * Persists the current clinicalDetailsCache map to localStorage.
 */
function saveCacheToLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const serialized: Record<string, GeminiClinicalDetails> = {};
    clinicalDetailsCache.forEach((value, key) => {
      serialized[key] = value;
    });
    window.localStorage.setItem(CLINICAL_STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not write to localStorage cache:', err);
  }
}

// Hydrate cache immediately when module loads
hydrateCacheFromLocalStorage();

/**
 * Checks whether `VITE_GEMINI_API_KEY` is configured in the Vite environment.
 */
export function hasGeminiApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
}

/**
 * Synchronously checks if clinical details for a drug are already cached locally.
 */
export function getCachedClinicalDetails(
  selectedDrugName: string
): GeminiClinicalDetails | undefined {
  const normalizedKey = selectedDrugName.trim().toLowerCase();
  return clinicalDetailsCache.get(normalizedKey);
}

/**
 * Builds the JRCALC / BNF pharmacology prompt requesting `phoneticSpelling`, `class`,
 * `indications`, and a pre-hospital `medicSummary`.
 */
export function buildClinicalPrompt(selectedDrugName: string): string {
  return `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${selectedDrugName}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`;
}

/**
 * Strips any markdown code fences (```json or ```) and validates the flat JSON object.
 */
function parseAndValidateClinicalJson(rawText: string): GeminiClinicalDetails {
  const cleanedText = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const parsed: unknown = JSON.parse(cleanedText);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure returned by Gemini.');
  }

  const record = parsed as Record<string, unknown>;
  const phoneticSpelling =
    typeof record.phoneticSpelling === 'string' ? record.phoneticSpelling.trim() : '';
  const drugClass = typeof record.class === 'string' ? record.class.trim() : '';
  const indications = Array.isArray(record.indications)
    ? record.indications
        .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
        .map((item) => item.trim())
    : [];
  const medicSummary =
    typeof record.medicSummary === 'string' ? record.medicSummary.trim() : '';

  if (!phoneticSpelling || !drugClass || indications.length === 0 || !medicSummary) {
    throw new Error('Gemini response missing required clinical fields.');
  }

  return {
    phoneticSpelling,
    class: drugClass,
    indications,
    medicSummary,
  };
}

/**
 * Sends the generateContent request to a Gemini endpoint, supporting both `x-goog-api-key`
 * and `?key=` query parameter.
 */
async function callGeminiEndpoint(
  endpoint: string,
  apiKey: string,
  requestBody: string,
  signal?: AbortSignal
): Promise<Response> {
  const trimmedKey = apiKey.trim();
  const encodedKey = encodeURIComponent(trimmedKey);

  return fetch(`${endpoint}?key=${encodedKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': trimmedKey,
    },
    signal,
    body: requestBody,
  });
}

/**
 * Fetches UK Paramedic (JRCALC) & BNF clinical details (`phoneticSpelling`, `class`, `indications`, `medicSummary`)
 * for a selected medication. Checks persistent `localStorage` first so previously looked-up
 * medications resolve immediately without using Gemini API tokens.
 */
export async function fetchMedicationClinicalDetails(
  selectedDrugName: string,
  signal?: AbortSignal
): Promise<GeminiClinicalDetails> {
  const normalizedKey = selectedDrugName.trim().toLowerCase();
  const cached = clinicalDetailsCache.get(normalizedKey);
  if (cached) {
    return cached;
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      throw new Error(
        'VITE_GEMINI_API_KEY not loaded. Make sure .env.local is saved and restart `npm run dev`.'
      );
    }

    const prompt = buildClinicalPrompt(selectedDrugName);
    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    let lastResponse: Response | null = null;
    let lastErrorBody = '';

    for (const endpoint of GEMINI_ENDPOINTS) {
      const response = await callGeminiEndpoint(endpoint, apiKey, requestBody, signal);
      if (response.ok) {
        lastResponse = response;
        break;
      }
      lastResponse = response;
      lastErrorBody = await response.text().catch(() => '');
      if (response.status !== 404) {
        break;
      }
    }

    if (!lastResponse || !lastResponse.ok) {
      const status = lastResponse?.status ?? 'Network Error';
      throw new Error(
        `Gemini API HTTP ${status}: ${lastErrorBody || lastResponse?.statusText || 'Request failed'}`
      );
    }

    const data = (await lastResponse.json()) as GeminiGenerateContentResponse;
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response candidate from Gemini API.');
    }

    const clinicalDetails = parseAndValidateClinicalJson(rawText);
    clinicalDetailsCache.set(normalizedKey, clinicalDetails);
    saveCacheToLocalStorage();

    return clinicalDetails;
  } catch (error) {
    console.error(
      `[GeminiClinicalService] Failed to fetch or parse clinical details for "${selectedDrugName}":`,
      error
    );
    throw error;
  }
}
