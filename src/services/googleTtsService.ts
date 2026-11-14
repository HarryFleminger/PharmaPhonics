import { SpeechSpeed } from '../types/medication';

const GOOGLE_TTS_ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Hardcoded premium British English Neural2 voice per UK clinical pronunciation requirements.
 */
export const UK_NEURAL_VOICE_NAME = 'en-GB-Neural2-B';
export const UK_LANGUAGE_CODE = 'en-GB';

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

// In-memory cache to avoid redundant API calls during a study session
const audioCache = new Map<string, string>();

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
 *
 * - If `ssml` is provided on the medication, sends `{ ssml }` in the synthesis `input`.
 * - Otherwise, sends `{ text: name }`.
 */
export async function synthesizeMedicationSpeech({
  name,
  ssml,
  speakingRate = 1.0,
  signal,
}: SynthesizeMedicationParams): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_google_cloud_tts_api_key_here') {
    throw new Error(
      'Missing Google Cloud TTS API key. Please set VITE_GOOGLE_TTS_API_KEY in your .env.local file.'
    );
  }

  const trimmedSsml = ssml?.trim();
  const inputPayload = trimmedSsml ? { ssml: trimmedSsml } : { text: name };
  const cacheKey = `${UK_NEURAL_VOICE_NAME}:${speakingRate}:${trimmedSsml || name}`;

  const cachedAudioSrc = audioCache.get(cacheKey);
  if (cachedAudioSrc) {
    return cachedAudioSrc;
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

  return audioDataUrl;
}
