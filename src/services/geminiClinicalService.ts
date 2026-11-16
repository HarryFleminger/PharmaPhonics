import { GeminiClinicalDetails, GeminiToxicityDetails } from '../types/medication';
import { findPregeneratedClinicalDetails } from '../data/pregeneratedClinicalDetails';
import { findPregeneratedToxicityDetails } from '../data/pregeneratedToxicityDetails';

/**
 * Active Gemini Flash model endpoints.
 */
const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];

/**
 * Versioned localStorage keys for persisting AI-generated clinical and toxicity details
 * across browser sessions.
 */
const CLINICAL_STORAGE_KEY = 'medspeak_clinical_cache_v1';
const TOXICITY_STORAGE_KEY = 'medspeak_toxicity_cache_v1';

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// In-memory caches hydrated from localStorage
const clinicalDetailsCache = new Map<string, GeminiClinicalDetails>();
const toxicityDetailsCache = new Map<string, GeminiToxicityDetails>();

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

function isValidToxicityDetails(value: unknown): value is GeminiToxicityDetails {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.overdoseEffects === 'string' &&
    record.overdoseEffects.trim() !== '' &&
    typeof record.toxicThreshold === 'string' &&
    record.toxicThreshold.trim() !== ''
  );
}

/**
 * Loads all cached clinical and toxicity details from localStorage into memory on startup.
 */
function hydrateCachesFromLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const rawClinical = window.localStorage.getItem(CLINICAL_STORAGE_KEY);
    if (rawClinical) {
      const parsed: unknown = JSON.parse(rawClinical);
      if (parsed && typeof parsed === 'object') {
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (isValidClinicalDetails(value)) {
            clinicalDetailsCache.set(key, value);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not read clinical localStorage cache:', err);
  }

  try {
    const rawToxicity = window.localStorage.getItem(TOXICITY_STORAGE_KEY);
    if (rawToxicity) {
      const parsed: unknown = JSON.parse(rawToxicity);
      if (parsed && typeof parsed === 'object') {
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (isValidToxicityDetails(value)) {
            toxicityDetailsCache.set(key, value);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not read toxicity localStorage cache:', err);
  }
}

/**
 * Persists the current clinicalDetailsCache map to localStorage.
 */
function saveClinicalCacheToLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const serialized: Record<string, GeminiClinicalDetails> = {};
    clinicalDetailsCache.forEach((value, key) => {
      serialized[key] = value;
    });
    window.localStorage.setItem(CLINICAL_STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not write clinical localStorage cache:', err);
  }
}

/**
 * Persists the current toxicityDetailsCache map to localStorage.
 */
function saveToxicityCacheToLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const serialized: Record<string, GeminiToxicityDetails> = {};
    toxicityDetailsCache.forEach((value, key) => {
      serialized[key] = value;
    });
    window.localStorage.setItem(TOXICITY_STORAGE_KEY, JSON.stringify(serialized));
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not write toxicity localStorage cache:', err);
  }
}

// Hydrate caches immediately when module loads
hydrateCachesFromLocalStorage();

/**
 * Checks whether `VITE_GEMINI_API_KEY` is configured in the Vite environment.
 */
export function hasGeminiApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
}

/**
 * Synchronously checks if standard clinical details for a drug are already available in:
 * 1. The built-in pre-generated Quick Categories dataset (`PREGENERATED_CLINICAL_DETAILS`)
 * 2. The persistent `localStorage` cache (`clinicalDetailsCache`)
 */
export function getCachedClinicalDetails(
  selectedDrugName: string
): GeminiClinicalDetails | undefined {
  const pregenerated = findPregeneratedClinicalDetails(selectedDrugName);
  if (pregenerated) {
    return pregenerated;
  }

  const normalizedKey = selectedDrugName.trim().toLowerCase();
  return clinicalDetailsCache.get(normalizedKey);
}

/**
 * Synchronously checks if toxicity/overdose details for a drug are already available in:
 * 1. The built-in pre-generated Quick Categories dataset (`PREGENERATED_TOXICITY_DETAILS`)
 * 2. The persistent `localStorage` cache (`toxicityDetailsCache`)
 */
export function getCachedToxicityDetails(
  selectedDrugName: string
): GeminiToxicityDetails | undefined {
  const pregenerated = findPregeneratedToxicityDetails(selectedDrugName);
  if (pregenerated) {
    return pregenerated;
  }

  const normalizedKey = selectedDrugName.trim().toLowerCase();
  return toxicityDetailsCache.get(normalizedKey);
}

/**
 * Builds the standard JRCALC / BNF pharmacology prompt requesting `phoneticSpelling`, `class`,
 * `indications`, and a pre-hospital `medicSummary`.
 */
export function buildClinicalPrompt(selectedDrugName: string): string {
  return `You are a UK Paramedic (JRCALC) and BNF pharmacology expert. Provide clinical details for the drug '${selectedDrugName}'. Return a flat JSON object using exactly these keys: 'phoneticSpelling' (string), 'class' (string), 'indications' (array of brief strings), and 'medicSummary' (string: a plain-English, pre-hospital summary explaining why a patient is typically prescribed this medication and what an ambulance crew needs to be aware of on scene, such as bleeding risks, masked heart rates, or postural hypotension—highly relevant to a paramedic's primary survey and assessment, while strictly avoiding overly dense academic jargon). No markdown, no extra text.`;
}

/**
 * Builds the Toxicity Mode prompt for pre-hospital overdose assessment (Toxbase / JRCALC).
 */
export function buildToxicityPrompt(selectedDrugName: string): string {
  return `You are a UK Paramedic and Toxbase/JRCALC expert. Provide pre-hospital overdose information for '${selectedDrugName}'. Return ONLY flat JSON with exactly these keys: 'overdoseEffects' (string: plain-English summary of how the overdose presents clinically and vital sign changes) and 'toxicThreshold' (string: known toxic dose limit, e.g., '>75mg/kg' or specific mg amount).`;
}

/**
 * Strips any markdown code fences (```json or ```) and validates the standard clinical JSON object.
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
 * Strips any markdown code fences (```json or ```) and validates the Toxicity Mode JSON object.
 */
function parseAndValidateToxicityJson(rawText: string): GeminiToxicityDetails {
  const cleanedText = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const parsed: unknown = JSON.parse(cleanedText);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure returned by Gemini for Toxicity Mode.');
  }

  const record = parsed as Record<string, unknown>;
  const overdoseEffects =
    typeof record.overdoseEffects === 'string' ? record.overdoseEffects.trim() : '';
  const toxicThreshold =
    typeof record.toxicThreshold === 'string' ? record.toxicThreshold.trim() : '';

  if (!overdoseEffects || !toxicThreshold) {
    throw new Error('Gemini toxicity response missing required fields (overdoseEffects, toxicThreshold).');
  }

  return {
    overdoseEffects,
    toxicThreshold,
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
 * Executes a prompt against the configured Gemini Flash endpoints and returns the raw text response.
 */
async function executeGeminiPrompt(prompt: string, signal?: AbortSignal): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'VITE_GEMINI_API_KEY not loaded. Make sure .env.local is saved and restart `npm run dev`.'
    );
  }

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

  return rawText;
}

/**
 * Resolves UK Paramedic (JRCALC) & BNF clinical details (`phoneticSpelling`, `class`, `indications`, `medicSummary`):
 * 1. Returns pre-generated details immediately if the drug belongs to any Quick Category (0 tokens used).
 * 2. Returns cached details from `localStorage` if previously looked up (0 tokens used).
 * 3. Calls the live Gemini API only for custom searched drugs not in the Quick Categories,
 *    then persists the response to `localStorage`.
 */
export async function fetchMedicationClinicalDetails(
  selectedDrugName: string,
  signal?: AbortSignal
): Promise<GeminiClinicalDetails> {
  const existing = getCachedClinicalDetails(selectedDrugName);
  if (existing) {
    return existing;
  }

  const normalizedKey = selectedDrugName.trim().toLowerCase();

  try {
    const prompt = buildClinicalPrompt(selectedDrugName);
    const rawText = await executeGeminiPrompt(prompt, signal);
    const clinicalDetails = parseAndValidateClinicalJson(rawText);

    clinicalDetailsCache.set(normalizedKey, clinicalDetails);
    saveClinicalCacheToLocalStorage();

    return clinicalDetails;
  } catch (error) {
    console.error(
      `[GeminiClinicalService] Failed to fetch or parse clinical details for "${selectedDrugName}":`,
      error
    );
    throw error;
  }
}

/**
 * Resolves UK Paramedic Toxbase/JRCALC overdose details (`overdoseEffects`, `toxicThreshold`, `management`)
 * using the Toxicity Mode system prompt and caches the result in `localStorage`.
 */
export async function fetchMedicationToxicityDetails(
  selectedDrugName: string,
  signal?: AbortSignal
): Promise<GeminiToxicityDetails> {
  const existing = getCachedToxicityDetails(selectedDrugName);
  if (existing) {
    return existing;
  }

  const normalizedKey = selectedDrugName.trim().toLowerCase();

  try {
    const prompt = buildToxicityPrompt(selectedDrugName);
    const rawText = await executeGeminiPrompt(prompt, signal);
    const toxicityDetails = parseAndValidateToxicityJson(rawText);

    toxicityDetailsCache.set(normalizedKey, toxicityDetails);
    saveToxicityCacheToLocalStorage();

    return toxicityDetails;
  } catch (error) {
    console.error(
      `[GeminiClinicalService] Failed to fetch or parse toxicity details for "${selectedDrugName}":`,
      error
    );
    throw error;
  }
}
