/**
 * Cookieless, anonymous UX & feature usage analytics client.
 * Routes all events through the same-origin `/api/analytics` proxy so ad-blockers
 * and NHS/Trust networks do not drop telemetry, zero cookies are written, and zero
 * raw prescription payloads, images, or patient parameters leave the browser.
 */

const ANALYTICS_ENDPOINT = '/api/analytics';
const BATCH_FLUSH_DELAY_MS = 600;
const MAX_BATCH_QUEUE_SIZE = 10;

export type AnalyticsVirtualPath = '/medications' | '/assessments' | '/guide';

export type AnalyticsEventName =
  | '$pageview'
  | '$pageleave'
  | 'app_opened'
  | 'section_switched'
  | 'welcome_guide_opened'
  | 'how_to_use_shortcut_clicked'
  | 'quick_category_selected'
  | 'quick_categories_toggled'
  | 'drug_viewed'
  | 'brand_hierarchy_viewed'
  | 'brand_expand_all_clicked'
  | 'drug_search_no_match'
  | 'ai_drug_lookup_clicked'
  | 'pronunciation_played'
  | 'toxicity_mode_toggled'
  | 'tox_calculator_used'
  | 'toxbase_link_clicked'
  | 'prescription_uploader_toggled'
  | 'prescription_tab_selected'
  | 'prescription_scan_started'
  | 'prescription_scan_completed'
  | 'prescription_scan_failed'
  | 'prescription_drug_clicked'
  | 'prescription_cleared'
  | 'assessment_category_selected'
  | 'assessment_viewed'
  | 'assessment_search_no_match'
  | 'assessment_ai_generated';

export type AnalyticsPrimitive = string | number | boolean | null;
export type AnalyticsProperties = Record<string, AnalyticsPrimitive>;

interface QueuedAnalyticsEvent {
  event: AnalyticsEventName;
  properties: AnalyticsProperties;
  timestamp: string;
}

let inMemorySessionId: string | null = null;
let currentVirtualPath: AnalyticsVirtualPath = '/medications';
let eventQueue: QueuedAnalyticsEvent[] = [];
let flushTimer: number | null = null;
let lifecycleListenersRegistered = false;

function getEphemeralSessionId(): string {
  if (inMemorySessionId) {
    return inMemorySessionId;
  }

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    inMemorySessionId = crypto.randomUUID();
  } else {
    inMemorySessionId = `ms-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return inMemorySessionId;
}

function getDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  if (typeof window === 'undefined') return 'Desktop';
  const width = window.innerWidth;
  if (width < 768) return 'Mobile';
  if (width < 1024) return 'Tablet';
  return 'Desktop';
}

function getBrowserName(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
  return 'Other';
}

function getOsName(ua: string): string {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}

function getReferringDomain(): string {
  if (typeof document === 'undefined' || !document.referrer) {
    return '$direct';
  }
  try {
    const parsed = new URL(document.referrer);
    if (typeof window !== 'undefined' && parsed.hostname === window.location.hostname) {
      return '$direct';
    }
    return parsed.hostname;
  } catch {
    return '$direct';
  }
}

function buildContextProperties(pathOverride?: AnalyticsVirtualPath): AnalyticsProperties {
  const path = pathOverride ?? currentVirtualPath;
  if (typeof window === 'undefined') {
    return {
      $session_id: getEphemeralSessionId(),
      $pathname: path,
    };
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  return {
    $session_id: getEphemeralSessionId(),
    $pathname: path,
    $current_url: `${window.location.origin}${path}`,
    $host: window.location.host,
    $referring_domain: getReferringDomain(),
    $device_type: getDeviceType(),
    $browser: getBrowserName(ua),
    $os: getOsName(ua),
    $screen_width: window.screen?.width ?? window.innerWidth,
    $screen_height: window.screen?.height ?? window.innerHeight,
  };
}

function isTrackingSuppressed(): boolean {
  if (typeof window === 'undefined') return true;
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true;
  return false;
}

function flushAnalyticsQueue(useBeacon = false): void {
  if (flushTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (eventQueue.length === 0 || isTrackingSuppressed()) {
    eventQueue = [];
    return;
  }

  const batchToSend = eventQueue;
  eventQueue = [];
  const payload = JSON.stringify({ events: batchToSend });

  if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const sent = navigator.sendBeacon(
        ANALYTICS_ENDPOINT,
        new Blob([payload], { type: 'application/json' })
      );
      if (sent) return;
    } catch {
      // Fall back to keepalive fetch below
    }
  }

  try {
    void fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics errors must never impact clinical functionality
  }
}

function ensureLifecycleListeners(): void {
  if (lifecycleListenersRegistered || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  lifecycleListenersRegistered = true;

  const handleLeave = () => {
    if (isTrackingSuppressed()) return;
    eventQueue.push({
      event: '$pageleave',
      properties: buildContextProperties(),
      timestamp: new Date().toISOString(),
    });
    flushAnalyticsQueue(true);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleLeave();
    }
  });

  window.addEventListener('pagehide', handleLeave);
}

/**
 * Scrubs any NHS numbers, dates/DOBs, UK postcodes, phone numbers, emails, or excessively
 * long free-text from zero-match search terms before sending them to analytics.
 */
export function scrubSearchTermForAnalytics(raw: string): {
  term: string;
  redacted: boolean;
} {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    return { term: '[empty]', redacted: true };
  }

  const scrubbed = trimmed
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[redacted]')
    .replace(/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g, '[redacted]')
    .replace(/\b\d{1,4}[/.-]\d{1,2}[/.-]\d{2,4}\b/g, '[redacted]')
    .replace(/\b[a-z]{1,2}\d[a-z\d]?\s+\d[a-z]{2}\b/gi, '[redacted]')
    .replace(/\b(?:\+44\s?7\d{3}|\(?07\d{3}\)?|\(?0[12]\d{2,3}\)?)\s?\d{3}\s?\d{3,4}\b/g, '[redacted]')
    .replace(/^(?:patient\s*name|name|nhs\s*(?:no|number)|dob|date\s*of\s*birth|address)\s*:.*$/i, '[redacted]')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = scrubbed.split(' ').filter(Boolean).length;
  const hasLongNumber = /\d{5,}/.test(scrubbed);

  if (
    !scrubbed ||
    scrubbed.includes('[redacted]') ||
    scrubbed.includes('@') ||
    hasLongNumber ||
    wordCount > 5 ||
    scrubbed.length > 60
  ) {
    return { term: '[redacted]', redacted: true };
  }

  return { term: scrubbed, redacted: false };
}

/**
 * Enqueues a typed, cookieless event to be batched to `/api/analytics`.
 */
export function trackEvent(
  event: AnalyticsEventName,
  properties: AnalyticsProperties = {}
): void {
  if (isTrackingSuppressed()) return;
  ensureLifecycleListeners();

  eventQueue.push({
    event,
    properties: {
      ...buildContextProperties(),
      ...properties,
    },
    timestamp: new Date().toISOString(),
  });

  if (eventQueue.length >= MAX_BATCH_QUEUE_SIZE || event === '$pageview') {
    flushAnalyticsQueue(false);
    return;
  }

  if (flushTimer === null) {
    flushTimer = window.setTimeout(() => {
      flushAnalyticsQueue(false);
    }, BATCH_FLUSH_DELAY_MS);
  }
}

/**
 * Records a virtual screen transition (`/medications`, `/assessments`, or `/guide`)
 * so PostHog Web Analytics and session funnels accurately capture navigation.
 */
export function trackPageView(virtualPath: AnalyticsVirtualPath): void {
  currentVirtualPath = virtualPath;
  if (isTrackingSuppressed()) return;
  ensureLifecycleListeners();

  eventQueue.push({
    event: '$pageview',
    properties: buildContextProperties(virtualPath),
    timestamp: new Date().toISOString(),
  });
  flushAnalyticsQueue(false);
}
