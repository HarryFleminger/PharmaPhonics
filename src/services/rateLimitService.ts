/**
 * Client-side sliding-window rate limiter & daily circuit breaker persisted in `localStorage`.
 * Protects live Gemini Text, Gemini Vision, and Google Cloud TTS API keys against runaway
 * token usage or automated abuse while leaving all 101 pre-generated Quick Category drugs
 * and cached lookups completely unrestricted.
 */

export type RateLimitBucket = 'gemini_text' | 'gemini_vision' | 'google_tts';

interface BucketPolicy {
  label: string;
  maxPerMinute: number;
  maxPerDay: number;
  cooldownMs: number;
}

const BUCKET_POLICIES: Record<RateLimitBucket, BucketPolicy> = {
  gemini_text: {
    label: 'live Gemini clinical lookup',
    maxPerMinute: 5,
    maxPerDay: 35,
    cooldownMs: 0,
  },
  gemini_vision: {
    label: 'prescription image scan',
    maxPerMinute: 2,
    maxPerDay: 10,
    cooldownMs: 10_000, // 10-second cooldown between live image scans
  },
  google_tts: {
    label: 'new voice pronunciation synthesis',
    maxPerMinute: 8,
    maxPerDay: 50,
    cooldownMs: 0,
  },
};

const RATE_LIMIT_STORAGE_KEY = 'medspeak_rate_limits_v1';
const ONE_MINUTE_MS = 60_000;
const ONE_DAY_MS = 86_400_000;

type PersistedTimestamps = Record<RateLimitBucket, number[]>;

export class RateLimitExceededError extends Error {
  public readonly bucket: RateLimitBucket;
  public readonly retryAfterSeconds: number;

  constructor(message: string, bucket: RateLimitBucket, retryAfterSeconds: number) {
    super(message);
    this.name = 'RateLimitExceededError';
    this.bucket = bucket;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function loadTimestamps(): PersistedTimestamps {
  const empty: PersistedTimestamps = {
    gemini_text: [],
    gemini_vision: [],
    google_tts: [],
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return empty;
  }

  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (!raw) return empty;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return empty;

    const record = parsed as Record<string, unknown>;
    const now = Date.now();

    const cleanArray = (val: unknown): number[] =>
      Array.isArray(val)
        ? val.filter(
            (ts): ts is number =>
              typeof ts === 'number' && Number.isFinite(ts) && now - ts < ONE_DAY_MS
          )
        : [];

    return {
      gemini_text: cleanArray(record.gemini_text),
      gemini_vision: cleanArray(record.gemini_vision),
      google_tts: cleanArray(record.google_tts),
    };
  } catch {
    return empty;
  }
}

function saveTimestamps(state: PersistedTimestamps): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Safely ignore storage quota errors
  }
}

/**
 * Checks whether a live API call for `bucket` is permitted under the sliding-window
 * per-minute, per-day, and cooldown policies.
 * - If permitted, records the current timestamp in `localStorage` and returns.
 * - If a limit is reached, throws a friendly `RateLimitExceededError` BEFORE any
 *   network request is sent to Google.
 */
export function enforceRateLimit(bucket: RateLimitBucket): void {
  const policy = BUCKET_POLICIES[bucket];
  const now = Date.now();
  const state = loadTimestamps();

  // Keep only timestamps within the last 24 hours
  const dayTimestamps = state[bucket].filter((ts) => now - ts < ONE_DAY_MS);
  const minuteTimestamps = dayTimestamps.filter((ts) => now - ts < ONE_MINUTE_MS);

  // 1. Check Cooldown (e.g., 10s between Gemini Vision image scans)
  if (policy.cooldownMs > 0 && dayTimestamps.length > 0) {
    const lastTimestamp = dayTimestamps[dayTimestamps.length - 1];
    const elapsed = now - lastTimestamp;
    if (elapsed < policy.cooldownMs) {
      const waitSeconds = Math.max(1, Math.ceil((policy.cooldownMs - elapsed) / 1000));
      throw new RateLimitExceededError(
        `Please wait ${waitSeconds}s before scanning another prescription photo. (10-second cooldown between live image scans to protect study quota.)`,
        bucket,
        waitSeconds
      );
    }
  }

  // 2. Check Daily Circuit Breaker
  if (dayTimestamps.length >= policy.maxPerDay) {
    const oldestInDay = dayTimestamps[0];
    const waitSeconds = Math.max(60, Math.ceil((ONE_DAY_MS - (now - oldestInDay)) / 1000));
    const waitHours = Math.max(1, Math.ceil(waitSeconds / 3600));
    throw new RateLimitExceededError(
      `Daily study limit reached for ${policy.label}s (${policy.maxPerDay}/day). Please wait ~${waitHours}h before making new live AI requests. All 101 Quick Category medications and previously viewed drugs remain available immediately.`,
      bucket,
      waitSeconds
    );
  }

  // 3. Check Per-Minute Sliding Window
  if (minuteTimestamps.length >= policy.maxPerMinute) {
    const oldestInMinute = minuteTimestamps[0];
    const waitSeconds = Math.max(1, Math.ceil((ONE_MINUTE_MS - (now - oldestInMinute)) / 1000));
    throw new RateLimitExceededError(
      `Rate limit reached (${policy.maxPerMinute} ${policy.label}s per minute). Please wait ${waitSeconds}s before making another live AI request. All Quick Category drugs and cached lookups remain unrestricted.`,
      bucket,
      waitSeconds
    );
  }

  // Record this live request
  dayTimestamps.push(now);
  state[bucket] = dayTimestamps;
  saveTimestamps(state);
}
