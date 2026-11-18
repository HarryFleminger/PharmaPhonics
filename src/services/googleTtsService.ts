import { SpeechSpeed } from '../types/medication';
import { enforceRateLimit } from './rateLimitService';

/**
 * Backend proxy endpoint (`server.js`) that attaches the server-side `GOOGLE_TTS_API_KEY`
 * without ever exposing any key to the browser bundle.
 */
const TTS_PROXY_ENDPOINT = '/api/tts';

/**
 * Hardcoded premium British English Neural2 voice per UK clinical pronunciation requirements.
 */
export const UK_NEURAL_VOICE_NAME = 'en-GB-Neural2-B';
export const UK_LANGUAGE_CODE = 'en-GB';

/**
 * Persistent localStorage key and max entry cap for caching synthesized MP3 audio
 * across browser sessions without exceeding browser localStorage quota (~5MB).
 */
const TTS_AUDIO_STORAGE_KEY = 'medspeak_tts_audio_cache_v1';
const MAX_PERSISTED_AUDIO_ENTRIES = 45;

export interface SynthesizeMedicationParams {
  name: string;
  ssml?: string;
  speakingRate?: SpeechSpeed;
  signal?: AbortSignal;
}

interface GoogleTtsResponse {
  audioContent?: string;
  error?:
    | string
    | {
        code?: number;
        message?: string;
        status?: string;
      };
}

// In-memory cache hydrated from localStorage
const audioCache = new Map<string, string>();
const inFlightTtsRequests = new Map<string, Promise<string>>();

let serverTtsConfigured = true;

export function setServerTtsConfigured(configured: boolean): void {
  serverTtsConfigured = configured;
}

export function hasGoogleTtsApiKey(): boolean {
  return serverTtsConfigured;
}

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
 * Calls the backend TTS proxy (`POST /api/tts`), which forwards British English (`en-GB-Neural2-B`)
 * synthesis requests to Google Cloud Text-to-Speech using the server-side `GOOGLE_TTS_API_KEY`.
 * Checks persistent `localStorage` first so cached playback uses 0 API calls.
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

  const existingInFlight = inFlightTtsRequests.get(cacheKey);
  if (existingInFlight) {
    return existingInFlight;
  }

  // Enforce client-side rate limit (8/min, 50/day) before making a live TTS synthesis call
  enforceRateLimit('google_tts');

  const requestPromise = (async () => {
    const response = await fetch(TTS_PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        input: inputPayload,
        speakingRate,
      }),
    });

    if (!response.ok) {
      let errorDetails = `HTTP ${response.status}`;
      try {
        const errJson = (await response.json()) as GoogleTtsResponse;
        if (typeof errJson.error === 'string') {
          errorDetails = errJson.error;
        } else if (errJson.error?.message) {
          errorDetails = errJson.error.message;
        }
      } catch {
        // Fallback to status text if response body is not JSON
      }
      throw new Error(`Voice synthesis request failed: ${errorDetails}`);
    }

    const data = (await response.json()) as GoogleTtsResponse;

    if (!data.audioContent) {
      throw new Error('Google Cloud TTS returned an empty audioContent payload.');
    }

    const audioDataUrl = `data:audio/mp3;base64,${data.audioContent}`;
    audioCache.set(cacheKey, audioDataUrl);
    saveAudioCacheToLocalStorage();

    return audioDataUrl;
  })();

  inFlightTtsRequests.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    inFlightTtsRequests.delete(cacheKey);
  }
}
