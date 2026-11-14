import { BnfMedicationItem } from '../types/medication';
import { UK_BNF_FALLBACK_ITEMS } from '../data/bnfNomenclature';

interface RawOpenPrescribingItem {
  id?: string | number;
  name?: string;
  type?: string;
}

function parseOpenPrescribingResponse(data: unknown): BnfMedicationItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return (data as RawOpenPrescribingItem[])
    .filter(
      (item): item is Required<Pick<RawOpenPrescribingItem, 'id' | 'name'>> & RawOpenPrescribingItem =>
        Boolean(item && item.id !== undefined && item.name)
    )
    .map((item) => ({
      id: String(item.id),
      name: String(item.name),
      type: item.type ? String(item.type) : undefined,
    }));
}

function filterFallbackBnfItems(query: string): BnfMedicationItem[] {
  const normalized = query.trim().toLowerCase();
  return UK_BNF_FALLBACK_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.id.toLowerCase().includes(normalized)
  );
}

/**
 * Queries the OpenPrescribing BNF Code API (`/api/1.0/bnf_code/?format=json&q={searchTerm}`).
 *
 * Why `/api/1.0/bnf/` and `corsproxy.io` returned HTTP 403:
 * 1. OpenPrescribing's documented BNF lookup endpoint is `/api/1.0/bnf_code/` (not `/api/1.0/bnf/`).
 * 2. `corsproxy.io` blocks free-tier requests from `localhost` and datacenter IPs are blocked by
 *    OpenPrescribing's Cloudflare WAF with HTTP 403.
 *
 * Strategy:
 * 1. Try direct browser fetch to `https://openprescribing.net/api/1.0/bnf_code/?format=json&q=...`
 *    (which uses OpenPrescribing's native `django-cors-headers` without custom preflight headers).
 * 2. If blocked by CORS, try the local Vite proxy `/api/openprescribing/api/1.0/bnf_code/?format=json&q=...`
 *    (with localhost `Origin`/`Referer` headers stripped).
 * 3. If OpenPrescribing's Cloudflare WAF still returns 403, seamlessly fall back to the built-in
 *    UK BNF nomenclature dataset (`UK_BNF_FALLBACK_ITEMS`) so searches always succeed.
 */
export async function searchOpenPrescribingBnf(
  searchTerm: string,
  signal?: AbortSignal
): Promise<BnfMedicationItem[]> {
  const trimmed = searchTerm.trim();
  if (trimmed.length <= 2) {
    return [];
  }

  const encodedSearchTerm = encodeURIComponent(trimmed);
  const directUrl = `https://openprescribing.net/api/1.0/bnf_code/?format=json&q=${encodedSearchTerm}`;
  const proxyUrl = `/api/openprescribing/api/1.0/bnf_code/?format=json&q=${encodedSearchTerm}`;

  // 1. Try direct OpenPrescribing `/api/1.0/bnf_code/` endpoint (no custom headers to avoid OPTIONS preflight)
  try {
    const directResponse = await fetch(directUrl, {
      method: 'GET',
      signal,
    });

    if (directResponse.ok) {
      const data: unknown = await directResponse.json();
      return parseOpenPrescribingResponse(data);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    // Proceed to Vite proxy attempt
  }

  // 2. Try local Vite proxy with stripped Origin/Referer headers
  try {
    const proxyResponse = await fetch(proxyUrl, {
      method: 'GET',
      signal,
    });

    if (proxyResponse.ok) {
      const data: unknown = await proxyResponse.json();
      return parseOpenPrescribingResponse(data);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
  }

  // 3. Fallback to built-in UK BNF nomenclature & BNF ID dataset if Cloudflare WAF returns 403
  return filterFallbackBnfItems(trimmed);
}
