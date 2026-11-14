import { GeminiClinicalDetails } from '../types/medication';

/**
 * Active Gemini Flash model endpoints.
 * Note: `gemini-1.5-flash` and `gemini-2.0-flash` have been retired by Google and return HTTP 404.
 * `gemini-2.5-flash` and `gemini-flash-latest` are the active endpoints for Google AI Studio `AQ.` keys.
 */
const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
];

interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

// In-memory session cache so re-selecting a drug card resolves immediately
const clinicalDetailsCache = new Map<string, GeminiClinicalDetails>();

/**
 * Checks whether `VITE_GEMINI_API_KEY` is configured in the Vite environment.
 */
export function hasGeminiApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');
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
 * (recommended for Google AI Studio `AQ.` auth keys) and `?key=` query parameter.
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
 * for a selected medication from the Gemini API with strict `application/json` output.
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

    return clinicalDetails;
  } catch (error) {
    console.error(
      `[GeminiClinicalService] Failed to fetch or parse clinical details for "${selectedDrugName}":`,
      error
    );
    throw error;
  }
}
