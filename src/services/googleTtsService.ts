import { SpeechSpeed } from '../types/medication';

const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Hardcoded premium British English Neural2 voice per UK clinical pronunciation requirements.
 */
export const UK_NEURAL_VOICE_NAME = 'en-GB-Neural2-B';
export const UK_LANGUAGE_CODE = 'en-GB';

/**
 * Persistent localStorage key and max entry cap for caching synthesized MP3 audio
 * across browser sessions without exceeding browser localStorage quota (~5MB).
 */
const TTS_AUDIO_STORAGE_KEY = 'pharmaphonics_tts_audio_cache_v1';
const MAX_PERSISTED_AUDIO_ENTRIES = 45;

export interface SynthesizeMedicationParams {
  name: string;
  ssml?: string;
  speakingRate?: SpeechSpeed;
  signal?: AbortSignal;
}

interface GoogleTtsResponse {
  audioContent: string;
}

interface GoogleTtsErrorResponse {
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

// In-memory cache hydrated from localStorage
const audioCache = new Map<string, string>();

function hydrateAudioCacheFromLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const raw = window.localStorage.getItem(TTS_AUDIO_STORAGE_KEY);
    if (!raw) return;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'string' && value.startsWith('data:audio/mp3;base64,')) {
        audioCache.set(key, value);
      }
    }
  } catch (err) {
    console.warn('[GoogleTtsService] Could not read localStorage audio cache:', err);
  }
}

function saveAudioCacheToLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const entries = Array.from(audioCache.entries()).slice(-MAX_PERSISTED_AUDIO_ENTRIES);
    const serialized = Object.fromEntries(entries);
    window.localStorage.setItem(TTS_AUDIO_STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // If localStorage quota is reached, trim older entries and retry once
    try {
      const trimmedEntries = Array.from(audioCache.entries()).slice(-20);
      window.localStorage.setItem(
        TTS_AUDIO_STORAGE_KEY,
        JSON.stringify(Object.fromEntries(trimmedEntries))
      );
    } catch {
      // Ignore storage quota errors safely
    }
  }
}

hydrateAudioCacheFromLocalStorage();

/**
 * Checks whether `VITE_GOOGLE_TTS_API_KEY` is configured in the Vite environment.
 */
export function hasGoogleTtsApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
  return Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_google_cloud_tts_api_key_here');
}

/**
 * Calls the Google Cloud Text-to-Speech REST API (`https://texttospeech.googleapis.com/v1/text:synthesize`)
 * using `en-GB-Neural2-B` and returns a playable `data:audio/mp3;base64,...` URL.
 * Checks persistent `localStorage` first to avoid redundant API calls.
 */
export async function synthesizeMedicationSpeech({
  name,
  ssml,
  speakingRate = 1.0,
  signal,
}: SynthesizeMedicationParams): Promise<string> {
  const trimmedSsml = ssml?.trim();
  const inputPayload = trimmedSsml ? { ssml: trimmedSsml } : { text: name };
  const cacheKey = `${UK_NEURAL_VOICE_NAME}:${speakingRate}:${(trimmedSsml || name).toLowerCase()}`;

  const cachedAudioSrc = audioCache.get(cacheKey);
  if (cachedAudioSrc) {
    return cachedAudioSrc;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_google_cloud_tts_api_key_here') {
    throw new Error(
      'Missing Google Cloud TTS API key. Please set VITE_GOOGLE_TTS_API_KEY in your .env.local file.'
    );
  }

  const response = await fetch(`${GOOGLE_TTS_ENDPOINT}?key=${encodeURIComponent(apiKey.trim())}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      input: inputPayload,
      voice: {
        languageCode: UK_LANGUAGE_CODE,
        name: UK_NEURAL_VOICE_NAME,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch: 0.0,
      },
    }),
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errJson = (await response.json()) as GoogleTtsErrorResponse;
      if (errJson.error?.message) {
        errorDetails = errJson.error.message;
      }
    } catch {
      // Fallback to status text if response body is not JSON
    }
    throw new Error(`Google Cloud TTS request failed: ${errorDetails}`);
  }

  const data = (await response.json()) as GoogleTtsResponse;

  if (!data.audioContent) {
    throw new Error('Google Cloud TTS returned an empty audioContent payload.');
  }

  const audioDataUrl = `data:audio/mp3;base64,${data.audioContent}`;
  audioCache.set(cacheKey, audioDataUrl);
  saveAudioCacheToLocalStorage();

  return audioDataUrl;
}
