import {
  GeminiClinicalDetails,
  GeminiToxicityDetails,
  PrescriptionScanResult,
} from '../types/medication';
import { findPregeneratedClinicalDetails } from '../data/pregeneratedClinicalDetails';
import { findPregeneratedToxicityDetails } from '../data/pregeneratedToxicityDetails';
import { enforceRateLimit } from './rateLimitService';
import { setServerTtsConfigured } from './googleTtsService';

/**
 * Backend proxy endpoints (`server.js`) that attach `GEMINI_API_KEY` on the server
 * and enforce `gemini-2.5-flash` + `maxOutputTokens: 450` without exposing any key to the browser.
 */
const GEMINI_PROXY_ENDPOINT = '/api/gemini';
const HEALTH_PROXY_ENDPOINT = '/api/health';

/**
 * Hard ceiling on drug name length sent to `/api/gemini`.
 */
const MAX_DRUG_NAME_LENGTH = 120;

/**
 * Versioned localStorage keys for persisting AI-generated clinical, toxicity, and prescription
 * scan results across browser sessions.
 */
const CLINICAL_STORAGE_KEY = 'medspeak_clinical_cache_v1';
const TOXICITY_STORAGE_KEY = 'medspeak_toxicity_cache_v1';
const PRESCRIPTION_SCAN_STORAGE_KEY = 'medspeak_prescription_scan_cache_v1';
const MAX_PERSISTED_PRESCRIPTION_SCANS = 25;

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: string | { message?: string };
}

interface HealthCheckResponse {
  geminiConfigured?: boolean;
  ttsConfigured?: boolean;
}

// In-memory caches hydrated from localStorage
const clinicalDetailsCache = new Map<string, GeminiClinicalDetails>();
const toxicityDetailsCache = new Map<string, GeminiToxicityDetails>();
const prescriptionScanCache = new Map<string, PrescriptionScanResult>();

// In-flight request deduplicators so concurrent requests for the same drug/image share one Promise
const inFlightClinicalRequests = new Map<string, Promise<GeminiClinicalDetails>>();
const inFlightToxicityRequests = new Map<string, Promise<GeminiToxicityDetails>>();
const inFlightVisionRequests = new Map<string, Promise<PrescriptionScanResult>>();

let serverGeminiConfigured = true;

/**
 * Queries `GET /api/health` on the backend server to check whether `GEMINI_API_KEY`
 * and `GOOGLE_TTS_API_KEY` are configured on the server without exposing any keys.
 */
export async function fetchServerHealthStatus(): Promise<{
  geminiConfigured: boolean;
  ttsConfigured: boolean;
}> {
  try {
    const res = await fetch(HEALTH_PROXY_ENDPOINT, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = (await res.json()) as HealthCheckResponse;
      const geminiOk = Boolean(data.geminiConfigured);
      const ttsOk = Boolean(data.ttsConfigured);
      serverGeminiConfigured = geminiOk;
      setServerTtsConfigured(ttsOk);
      return { geminiConfigured: geminiOk, ttsConfigured: ttsOk };
    }
  } catch {
    // Keep default status if health check cannot reach server
  }
  return {
    geminiConfigured: serverGeminiConfigured,
    ttsConfigured: true,
  };
}

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

function isValidPrescriptionScanResult(value: unknown): value is PrescriptionScanResult {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const isStringArray = (arr: unknown): arr is string[] =>
    Array.isArray(arr) && arr.every((item) => typeof item === 'string');

  return (
    isStringArray(record.medications) &&
    isStringArray(record.patientConditions) &&
    isStringArray(record.onSceneBullets) &&
    isStringArray(record.interactionBullets) &&
    isStringArray(record.toxRedFlagBullets)
  );
}

/**
 * Computes a fast, deterministic FNV-1a fingerprint over a base64 image string
 * so re-uploading the same photo resolves from `localStorage` with 0 tokens.
 */
export function computeImageFingerprint(base64Data: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  const len = base64Data.length;
  const step = Math.max(1, Math.floor(len / 4096));

  for (let i = 0; i < len; i += step) {
    const code = base64Data.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= code ^ (i & 0xff);
    h2 = Math.imul(h2, 0x01000193);
  }

  return `${len.toString(36)}_${(h1 >>> 0).toString(16)}_${(h2 >>> 0).toString(16)}`;
}

/**
 * Loads all cached clinical, toxicity, and prescription scan details from localStorage into memory on startup.
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

  try {
    const rawScans = window.localStorage.getItem(PRESCRIPTION_SCAN_STORAGE_KEY);
    if (rawScans) {
      const parsed: unknown = JSON.parse(rawScans);
      if (parsed && typeof parsed === 'object') {
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (isValidPrescriptionScanResult(value)) {
            prescriptionScanCache.set(key, value);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not read prescription scan cache:', err);
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

/**
 * Persists the current prescriptionScanCache map to localStorage (capped at 25 entries).
 */
function savePrescriptionScanCacheToLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const entries = Array.from(prescriptionScanCache.entries()).slice(
      -MAX_PERSISTED_PRESCRIPTION_SCANS
    );
    window.localStorage.setItem(
      PRESCRIPTION_SCAN_STORAGE_KEY,
      JSON.stringify(Object.fromEntries(entries))
    );
  } catch (err) {
    console.warn('[GeminiClinicalService] Could not write prescription scan cache:', err);
  }
}

// Hydrate caches immediately when module loads
hydrateCachesFromLocalStorage();

/**
 * Returns whether the backend server reported `GEMINI_API_KEY` as configured.
 */
export function hasGeminiApiKey(): boolean {
  return serverGeminiConfigured;
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
    throw new Error(
      'Gemini toxicity response missing required fields (overdoseEffects, toxicThreshold).'
    );
  }

  return {
    overdoseEffects,
    toxicThreshold,
  };
}

type GeminiProxyPayload =
  | {
      mode: 'clinical' | 'toxicity';
      drugName: string;
    }
  | {
      mode: 'prescription';
      base64Data: string;
      mimeType: string;
    };

/**
 * Sends a structured request (`{ mode: 'clinical' | 'toxicity', drugName }` or
 * `{ mode: 'prescription', base64Data, mimeType }`) to the backend proxy (`POST /api/gemini`),
 * which builds the locked pharmacology prompt on the server and attaches `GEMINI_API_KEY`.
 */
async function callServerGeminiProxy(
  payload: GeminiProxyPayload,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(GEMINI_PROXY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errMessage = response.statusText || 'Request failed';
    try {
      const errJson = (await response.json()) as GeminiGenerateContentResponse;
      if (typeof errJson.error === 'string') {
        errMessage = errJson.error;
      } else if (errJson.error?.message) {
        errMessage = errJson.error.message;
      }
    } catch {
      const errText = await response.text().catch(() => '');
      if (errText) errMessage = errText;
    }
    throw new Error(errMessage);
  }

  const data = (await response.json()) as GeminiGenerateContentResponse;
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Empty response candidate from Gemini API.');
  }

  return rawText;
}

/**
 * Resolves UK Paramedic (JRCALC) & BNF clinical details (`phoneticSpelling`, `class`, `indications`, `medicSummary`):
 * 1. Returns pre-generated details immediately if the drug belongs to any Quick Category (0 tokens, bypasses limiter).
 * 2. Returns cached details from `localStorage` if previously looked up (0 tokens, bypasses limiter).
 * 3. Deduplicates concurrent in-flight requests for the same drug.
 * 4. Enforces client-side rate limit (5/min, 35/day) and calls `POST /api/gemini`.
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

  const existingInFlight = inFlightClinicalRequests.get(normalizedKey);
  if (existingInFlight) {
    return existingInFlight;
  }

  // Enforce sliding-window rate limit before sending a live request
  enforceRateLimit('gemini_text');

  const requestPromise = (async () => {
    try {
      const trimmedDrugName = selectedDrugName.trim().slice(0, MAX_DRUG_NAME_LENGTH);
      const rawText = await callServerGeminiProxy(
        {
          mode: 'clinical',
          drugName: trimmedDrugName,
        },
        signal
      );
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
  })();

  inFlightClinicalRequests.set(normalizedKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightClinicalRequests.delete(normalizedKey);
  }
}

/**
 * Resolves UK Paramedic Toxbase/JRCALC overdose details (`overdoseEffects`, `toxicThreshold`):
 * 1. Returns pre-generated details immediately if the drug belongs to any Quick Category (0 tokens, bypasses limiter).
 * 2. Returns cached details from `localStorage` if previously looked up (0 tokens, bypasses limiter).
 * 3. Deduplicates concurrent in-flight requests for the same drug.
 * 4. Enforces client-side rate limit (5/min, 35/day) and calls `POST /api/gemini`.
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

  const existingInFlight = inFlightToxicityRequests.get(normalizedKey);
  if (existingInFlight) {
    return existingInFlight;
  }

  // Enforce sliding-window rate limit before sending a live request
  enforceRateLimit('gemini_text');

  const requestPromise = (async () => {
    try {
      const trimmedDrugName = selectedDrugName.trim().slice(0, MAX_DRUG_NAME_LENGTH);
      const rawText = await callServerGeminiProxy(
        {
          mode: 'toxicity',
          drugName: trimmedDrugName,
        },
        signal
      );
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
  })();

  inFlightToxicityRequests.set(normalizedKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightToxicityRequests.delete(normalizedKey);
  }
}

/**
 * Analyzes a compressed photo of a UK prescription, repeat medication slip, blister pack,
 * or medicine box using `POST /api/gemini` (`inlineData`) and returns streamlined bullet points
 * for both Standard Mode and Toxicity Mode.
 * - Deduplicates & caches results by image fingerprint in `localStorage` (`medspeak_prescription_scan_cache_v1`).
 * - Enforces `gemini_vision` rate limits (max 2/min, 10/day, 10s cooldown) on uncached scans.
 */
export async function extractMedicationsFromPrescriptionImage(
  base64Data: string,
  mimeType: string,
  signal?: AbortSignal
): Promise<PrescriptionScanResult> {
  const fingerprint = computeImageFingerprint(base64Data);

  const cachedResult = prescriptionScanCache.get(fingerprint);
  if (cachedResult) {
    return cachedResult;
  }

  const existingInFlight = inFlightVisionRequests.get(fingerprint);
  if (existingInFlight) {
    return existingInFlight;
  }

  // Enforce Gemini Vision rate limit (2/min, 10/day, 10s cooldown) before sending live image payload
  enforceRateLimit('gemini_vision');

  const requestPromise = (async () => {
    const rawText = await callServerGeminiProxy(
      {
        mode: 'prescription',
        base64Data,
        mimeType,
      },
      signal
    );

    const cleanedText = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed: unknown = JSON.parse(cleanedText);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON returned when scanning prescription image.');
    }

    const record = parsed as Record<string, unknown>;
    const toCleanStringArray = (val: unknown): string[] =>
      Array.isArray(val)
        ? val
            .filter((item): item is string => typeof item === 'string' && item.trim() !== '')
            .map((item) => item.trim())
        : [];

    const uniqueMeds = Array.from(new Set(toCleanStringArray(record.medications)));

    const scanResult: PrescriptionScanResult = {
      medications: uniqueMeds,
      patientConditions: toCleanStringArray(record.patientConditions),
      onSceneBullets: toCleanStringArray(record.onSceneBullets),
      interactionBullets: toCleanStringArray(record.interactionBullets),
      toxRedFlagBullets: toCleanStringArray(record.toxRedFlagBullets),
    };

    if (uniqueMeds.length > 0) {
      prescriptionScanCache.set(fingerprint, scanResult);
      savePrescriptionScanCacheToLocalStorage();
    }

    return scanResult;
  })();

  inFlightVisionRequests.set(fingerprint, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightVisionRequests.delete(fingerprint);
  }
}
