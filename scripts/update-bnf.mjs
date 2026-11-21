/**
 * Automated UK BNF Nomenclature Updater (`npm run update-bnf`)
 *
 * Queries the official NHS Business Services Authority (NHSBSA) Open Data Portal CKAN API
 * (`BNF_CODE_CURRENT`) for distinct UK BNF chemical substances and merges any new entries
 * into `src/data/bnfNomenclature.ts`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BNF_FILE_PATH = path.resolve(__dirname, '../src/data/bnfNomenclature.ts');

const NHSBSA_SQL_URL =
  'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?sql=' +
  encodeURIComponent(
    'SELECT DISTINCT "BNF_CHEMICAL_SUBSTANCE_CODE", "BNF_CHEMICAL_SUBSTANCE" FROM "BNF_CODE_CURRENT" WHERE "BNF_CHEMICAL_SUBSTANCE_CODE" IS NOT NULL ORDER BY "BNF_CHEMICAL_SUBSTANCE" ASC LIMIT 2500'
  );

async function fetchNhsbsaChemicals() {
  console.log('[update-bnf] Fetching latest UK BNF chemical substances from NHSBSA Open Data Portal...');
  const response = await fetch(NHSBSA_SQL_URL, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'MedSpeak-BNF-Updater/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`NHSBSA Open Data Portal returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  const records = payload?.result?.records?.records || payload?.result?.records || [];

  const items = [];
  for (const row of records) {
    const id = String(row.BNF_CHEMICAL_SUBSTANCE_CODE || '').trim();
    const name = String(row.BNF_CHEMICAL_SUBSTANCE || '').trim();
    if (!id || !name) continue;
    // Skip non-medication appliance/dressing chapters (Chapters 20+)
    if (/^(18|19|20|21|22|23)/.test(id)) continue;
    items.push({ id, name, type: 'chemical' });
  }

  return items;
}

function parseExistingItems(fileContent) {
  const regex = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*type:\s*'([^']+)'\s*\}/g;
  const existing = [];
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    existing.push({
      id: match[1],
      name: match[2],
      type: match[3],
    });
  }
  return existing;
}

function escapeSingleQuotes(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function run() {
  const currentContent = fs.readFileSync(BNF_FILE_PATH, 'utf8');
  const existingItems = parseExistingItems(currentContent);
  const existingIds = new Set(existingItems.map((i) => i.id));

  let fetchedItems = [];
  try {
    fetchedItems = await fetchNhsbsaChemicals();
  } catch (err) {
    console.warn('[update-bnf] Could not reach NHSBSA API:', err.message);
    console.log(`[update-bnf] Keeping existing ${existingItems.length} BNF entries intact.`);
    return;
  }

  let addedCount = 0;
  for (const item of fetchedItems) {
    if (!existingIds.has(item.id)) {
      existingIds.add(item.id);
      existingItems.push(item);
      addedCount++;
    }
  }

  if (addedCount === 0) {
    console.log(
      `[update-bnf] Local BNF dataset is already up to date (${existingItems.length} entries).`
    );
    return;
  }

  const lines = [
    "import { BnfMedicationItem } from '../types/medication';",
    '',
    '/**',
    ' * Comprehensive UK BNF (British National Formulary) nomenclature & code dataset.',
    ' * Auto-updated from the official NHSBSA Open Data Portal (`BNF_CODE_CURRENT`).',
    ' */',
    'export const UK_BNF_FALLBACK_ITEMS: BnfMedicationItem[] = [',
    ...existingItems.map(
      (item) =>
        `  { id: '${escapeSingleQuotes(item.id)}', name: '${escapeSingleQuotes(
          item.name
        )}', type: '${escapeSingleQuotes(item.type)}' },`
    ),
    '];',
    '',
  ];

  fs.writeFileSync(BNF_FILE_PATH, lines.join('\n'), 'utf8');
  console.log(
    `[update-bnf] Added ${addedCount} new UK BNF entries (total: ${existingItems.length}).`
  );
}

run().catch((err) => {
  console.error('[update-bnf] Fatal error:', err);
  process.exit(1);
});
