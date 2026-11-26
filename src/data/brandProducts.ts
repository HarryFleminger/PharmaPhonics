import { BnfMedicationItem, BrandProductGroup } from '../types/medication';
import { UK_BNF_FALLBACK_ITEMS } from './bnfNomenclature';

interface CuratedBrandEntry {
  brandName: string;
  aliases?: string[];
  subtitle?: string;
  constituentNames: string[];
  supersededBnfIds?: string[];
}

interface InternalBrandEntry extends CuratedBrandEntry {
  id: string;
}

function stripParentheticalNotes(name: string): string {
  return name.replace(/\s*\([^)]*\)/g, '').trim();
}

function normalizeMatchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-–—]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCompactText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const cleanGenericChemicalEntries: Array<{
  cleanLower: string;
  item: BnfMedicationItem;
}> = UK_BNF_FALLBACK_ITEMS.filter((item) => item.type === 'chemical').map((item) => ({
  cleanLower: stripParentheticalNotes(item.name).toLowerCase(),
  item,
}));

/**
 * Resolves an active generic drug name (e.g. "Beclometasone dipropionate", "Glycopyrronium",
 * "Clavulanic acid") to a UK BNF record so each constituent card carries a real BNF ID where available.
 */
export function resolveConstituentToBnfItem(
  genericName: string,
  parentKey: string,
  index: number
): BnfMedicationItem {
  const trimmedName = genericName.trim();
  const targetLower = trimmedName.toLowerCase();

  // 1. Exact match on clean generic BNF chemical name
  const exactMatch = cleanGenericChemicalEntries.find(
    (entry) => entry.cleanLower === targetLower
  );
  if (exactMatch) {
    return {
      id: exactMatch.item.id,
      name: trimmedName,
      type: 'chemical',
    };
  }

  // 2. Prefix salt match (e.g. "Glycopyrronium" -> "Glycopyrronium bromide")
  if (targetLower.length >= 4) {
    const saltMatch = cleanGenericChemicalEntries.find((entry) =>
      entry.cleanLower.startsWith(`${targetLower} `)
    );
    if (saltMatch) {
      return {
        id: saltMatch.item.id,
        name: trimmedName,
        type: 'chemical',
      };
    }
  }

  // 3. Fallback for enzyme inhibitors / non-standalone co-formulated ingredients (e.g. Clavulanic acid, Sacubitril)
  const sanitizedParent = parentKey
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 14);
  return {
    id: `ING-${sanitizedParent || 'BRAND'}-${index + 1}`,
    name: trimmedName,
    type: 'active ingredient',
  };
}

/**
 * Curated UK BNF fixed-dose combination products & high-frequency brand medications
 * that expand cleanly into separate constituent generic drug cards.
 */
const CURATED_BRAND_PRODUCTS: CuratedBrandEntry[] = [
  // ---- Respiratory Inhalers & Nebulisers (Triple / Dual / ICS-LABA) ----
  {
    brandName: 'Trimbow',
    subtitle: 'Triple-therapy inhaler (ICS / LABA / LAMA)',
    constituentNames: [
      'Beclometasone dipropionate',
      'Formoterol fumarate',
      'Glycopyrronium',
    ],
    supersededBnfIds: ['0302000E0'],
  },
  {
    brandName: 'Trelegy Ellipta',
    aliases: ['Trelegy'],
    subtitle: 'Triple-therapy inhaler (ICS / LAMA / LABA)',
    constituentNames: ['Fluticasone furoate', 'Umeclidinium bromide', 'Vilanterol'],
    supersededBnfIds: ['0302000W0'],
  },
  {
    brandName: 'Trixeo Aerosphere',
    aliases: ['Trixeo'],
    subtitle: 'Triple-therapy inhaler (ICS / LAMA / LABA)',
    constituentNames: ['Budesonide', 'Glycopyrronium', 'Formoterol fumarate'],
  },
  {
    brandName: 'Enerzair Breezhaler',
    aliases: ['Enerzair'],
    subtitle: 'Triple-therapy inhaler (LABA / LAMA / ICS)',
    constituentNames: ['Indacaterol', 'Glycopyrronium', 'Mometasone furoate'],
  },
  {
    brandName: 'Fostair',
    aliases: ['Fostair NEXThaler'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Beclometasone dipropionate', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000D0'],
  },
  {
    brandName: 'Luforbec',
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Beclometasone dipropionate', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000D0'],
  },
  {
    brandName: 'Bibecfo',
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Beclometasone dipropionate', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000D0'],
  },
  {
    brandName: 'Symbicort',
    aliases: ['Symbicort Turbohaler'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Budesonide', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000L0'],
  },
  {
    brandName: 'DuoResp Spiromax',
    aliases: ['DuoResp'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Budesonide', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000L0'],
  },
  {
    brandName: 'Fobumix',
    aliases: ['Fobumix Easyhaler'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Budesonide', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000L0'],
  },
  {
    brandName: 'Seretide',
    aliases: ['Seretide Accuhaler', 'Seretide Evohaler'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Fluticasone propionate', 'Salmeterol'],
    supersededBnfIds: ['0302000P0'],
  },
  {
    brandName: 'AirFluSal',
    aliases: ['AirFluSal Forspiro'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Fluticasone propionate', 'Salmeterol'],
    supersededBnfIds: ['0302000P0'],
  },
  {
    brandName: 'Sirdupla',
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Fluticasone propionate', 'Salmeterol'],
    supersededBnfIds: ['0302000P0'],
  },
  {
    brandName: 'Relvar Ellipta',
    aliases: ['Relvar'],
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Fluticasone furoate', 'Vilanterol'],
    supersededBnfIds: ['0301011Z0'],
  },
  {
    brandName: 'Flutiform',
    subtitle: 'Combination inhaler (ICS / LABA)',
    constituentNames: ['Fluticasone propionate', 'Formoterol fumarate'],
    supersededBnfIds: ['0302000Q0'],
  },
  {
    brandName: 'Anoro Ellipta',
    aliases: ['Anoro'],
    subtitle: 'Dual bronchodilator inhaler (LAMA / LABA)',
    constituentNames: ['Umeclidinium bromide', 'Vilanterol'],
    supersededBnfIds: ['0301020U0'],
  },
  {
    brandName: 'Spiolto Respimat',
    aliases: ['Spiolto'],
    subtitle: 'Dual bronchodilator inhaler (LAMA / LABA)',
    constituentNames: ['Tiotropium', 'Olodaterol'],
    supersededBnfIds: ['0301020V0'],
  },
  {
    brandName: 'Ultibro Breezhaler',
    aliases: ['Ultibro'],
    subtitle: 'Dual bronchodilator inhaler (LABA / LAMA)',
    constituentNames: ['Indacaterol', 'Glycopyrronium'],
    supersededBnfIds: ['0301020X0'],
  },
  {
    brandName: 'Duaklir Genuair',
    aliases: ['Duaklir'],
    subtitle: 'Dual bronchodilator inhaler (LAMA / LABA)',
    constituentNames: ['Aclidinium bromide', 'Formoterol fumarate'],
    supersededBnfIds: ['0301020W0'],
  },
  {
    brandName: 'Combivent',
    subtitle: 'Dual bronchodilator nebuliser (SAMA / SABA)',
    constituentNames: ['Ipratropium bromide', 'Salbutamol'],
  },

  // ---- Analgesics, Opioids & Over-the-Counter Combinations ----
  {
    brandName: 'Co-codamol',
    aliases: ['Cocodamol'],
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Paracetamol', 'Codeine phosphate'],
    supersededBnfIds: ['0407010F0'],
  },
  {
    brandName: 'Zapain',
    subtitle: 'Compound opioid analgesic (30mg/500mg)',
    constituentNames: ['Paracetamol', 'Codeine phosphate'],
    supersededBnfIds: ['0407010F0'],
  },
  {
    brandName: 'Solpadol',
    subtitle: 'Compound opioid analgesic (30mg/500mg)',
    constituentNames: ['Paracetamol', 'Codeine phosphate'],
    supersededBnfIds: ['0407010F0'],
  },
  {
    brandName: 'Kapake',
    subtitle: 'Compound opioid analgesic (30mg/500mg)',
    constituentNames: ['Paracetamol', 'Codeine phosphate'],
    supersededBnfIds: ['0407010F0'],
  },
  {
    brandName: 'Solpadeine Max',
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Paracetamol', 'Codeine phosphate'],
    supersededBnfIds: ['0407010F0'],
  },
  {
    brandName: 'Solpadeine Plus',
    subtitle: 'Compound analgesic',
    constituentNames: ['Paracetamol', 'Codeine phosphate', 'Caffeine'],
  },
  {
    brandName: 'Co-dydramol',
    aliases: ['Codydramol', 'Remedeine'],
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Paracetamol', 'Dihydrocodeine tartrate'],
    supersededBnfIds: ['0407010N0'],
  },
  {
    brandName: 'Paramol',
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Paracetamol', 'Dihydrocodeine tartrate'],
    supersededBnfIds: ['0407010N0'],
  },
  {
    brandName: 'Tramacet',
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Paracetamol', 'Tramadol hydrochloride'],
  },
  {
    brandName: 'Nuromol',
    subtitle: 'Combination analgesic',
    constituentNames: ['Ibuprofen', 'Paracetamol'],
  },
  {
    brandName: 'Co-codaprin',
    subtitle: 'Compound opioid analgesic',
    constituentNames: ['Aspirin', 'Codeine phosphate'],
    supersededBnfIds: ['0407010A0'],
  },
  {
    brandName: 'Anadin Extra',
    subtitle: 'Compound analgesic',
    constituentNames: ['Aspirin', 'Paracetamol', 'Caffeine'],
  },
  {
    brandName: 'Migramax',
    subtitle: 'Migraine combination',
    constituentNames: ['Aspirin', 'Metoclopramide hydrochloride'],
  },
  {
    brandName: 'Paramax',
    subtitle: 'Migraine combination',
    constituentNames: ['Paracetamol', 'Metoclopramide hydrochloride'],
  },
  {
    brandName: 'Targinact',
    subtitle: 'Opioid + antagonist combination',
    constituentNames: ['Oxycodone hydrochloride', 'Naloxone hydrochloride'],
    supersededBnfIds: ['0407020AE'],
  },
  {
    brandName: 'Suboxone',
    subtitle: 'Opioid substitution combination',
    constituentNames: ['Buprenorphine', 'Naloxone hydrochloride'],
    supersededBnfIds: ['0407020AB'],
  },
  {
    brandName: 'Lemsip',
    aliases: ['Lemsip Max'],
    subtitle: 'Cold & flu combination',
    constituentNames: ['Paracetamol', 'Phenylephrine hydrochloride'],
  },
  {
    brandName: 'Night Nurse',
    subtitle: 'Night-time cold & flu combination',
    constituentNames: [
      'Paracetamol',
      'Promethazine hydrochloride',
      'Dextromethorphan hydrobromide',
    ],
  },
  {
    brandName: 'Day Nurse',
    subtitle: 'Daytime cold & flu combination',
    constituentNames: ['Paracetamol', 'Pseudoephedrine hydrochloride', 'Pholcodine'],
  },

  // ---- Cardiovascular Combinations ----
  {
    brandName: 'Entresto',
    subtitle: 'ARNI heart failure combination',
    constituentNames: ['Sacubitril', 'Valsartan'],
    supersededBnfIds: ['0205052AE'],
  },
  {
    brandName: 'Frumil',
    aliases: ['Co-amilofruse'],
    subtitle: 'Combination diuretic',
    constituentNames: ['Amiloride hydrochloride', 'Furosemide'],
    supersededBnfIds: ['0202040C0'],
  },
  {
    brandName: 'Co-amilozide',
    aliases: ['Moduret'],
    subtitle: 'Combination diuretic',
    constituentNames: ['Amiloride hydrochloride', 'Hydrochlorothiazide'],
    supersededBnfIds: ['0202040D0'],
  },
  {
    brandName: 'Co-tenidone',
    aliases: ['Tenoret'],
    subtitle: 'Beta-blocker + diuretic combination',
    constituentNames: ['Atenolol', 'Chlortalidone'],
    supersededBnfIds: ['0204000J0'],
  },
  {
    brandName: 'Cozaar-Comp',
    aliases: ['Cozaar Comp'],
    subtitle: 'ARB + thiazide combination',
    constituentNames: ['Losartan potassium', 'Hydrochlorothiazide'],
  },
  {
    brandName: 'Exforge',
    subtitle: 'CCB + ARB antihypertensive combination',
    constituentNames: ['Amlodipine', 'Valsartan'],
  },
  {
    brandName: 'Sevikar',
    subtitle: 'ARB + CCB antihypertensive combination',
    constituentNames: ['Olmesartan medoxomil', 'Amlodipine'],
  },

  // ---- Neurology / Parkinson's Combinations ----
  {
    brandName: 'Sinemet',
    aliases: ['Co-careldopa', 'Cocareldopa'],
    subtitle: 'Parkinson’s dopamine combination',
    constituentNames: ['Carbidopa', 'Levodopa'],
    supersededBnfIds: ['0409010N0'],
  },
  {
    brandName: 'Madopar',
    aliases: ['Co-beneldopa', 'Cobeneldopa'],
    subtitle: 'Parkinson’s dopamine combination',
    constituentNames: ['Benserazide', 'Levodopa'],
    supersededBnfIds: ['0409010B0'],
  },
  {
    brandName: 'Stalevo',
    aliases: ['Sastravi'],
    subtitle: 'Triple Parkinson’s combination',
    constituentNames: ['Levodopa', 'Carbidopa', 'Entacapone'],
    supersededBnfIds: ['0409010L0'],
  },
  {
    brandName: 'Produodopa',
    subtitle: 'Subcutaneous Parkinson’s infusion',
    constituentNames: ['Foslevodopa', 'Foscarbidopa'],
    supersededBnfIds: ['0409010F0'],
  },

  // ---- Antimicrobials & Antivirals ----
  {
    brandName: 'Augmentin',
    aliases: ['Co-amoxiclav', 'Coamoxiclav'],
    subtitle: 'Beta-lactam + beta-lactamase inhibitor',
    constituentNames: ['Amoxicillin', 'Clavulanic acid'],
    supersededBnfIds: ['0501013K0'],
  },
  {
    brandName: 'Tazocin',
    subtitle: 'Antipseudomonal penicillin combination',
    constituentNames: ['Piperacillin', 'Tazobactam'],
    supersededBnfIds: ['0501015P0'],
  },
  {
    brandName: 'Septrin',
    aliases: ['Co-trimoxazole', 'Cotrimoxazole'],
    subtitle: 'Folate-pathway antibiotic combination',
    constituentNames: ['Sulfamethoxazole', 'Trimethoprim'],
    supersededBnfIds: ['0501080D0'],
  },
  {
    brandName: 'Magnapen',
    aliases: ['Co-fluampicil', 'Cofluampicil'],
    subtitle: 'Dual penicillin combination',
    constituentNames: ['Ampicillin', 'Flucloxacillin sodium'],
    supersededBnfIds: ['0501013L0'],
  },
  {
    brandName: 'Rifinah',
    subtitle: 'Anti-tuberculosis combination',
    constituentNames: ['Rifampicin', 'Isoniazid'],
    supersededBnfIds: ['0501090S0'],
  },
  {
    brandName: 'Rifater',
    subtitle: 'Triple anti-tuberculosis combination',
    constituentNames: ['Rifampicin', 'Isoniazid', 'Pyrazinamide'],
    supersededBnfIds: ['0501090V0'],
  },
  {
    brandName: 'Paxlovid',
    subtitle: 'COVID-19 antiviral combination',
    constituentNames: ['Nirmatrelvir', 'Ritonavir'],
    supersededBnfIds: ['0503050N0'],
  },
  {
    brandName: 'Malarone',
    subtitle: 'Antimalarial combination',
    constituentNames: ['Atovaquone', 'Proguanil hydrochloride'],
    supersededBnfIds: ['0504010P0'],
  },
  {
    brandName: 'Truvada',
    subtitle: 'Antiretroviral / PrEP combination',
    constituentNames: ['Emtricitabine', 'Tenofovir disoproxil'],
    supersededBnfIds: ['0503010G0'],
  },
  {
    brandName: 'Biktarvy',
    subtitle: 'Triple antiretroviral combination',
    constituentNames: ['Bictegravir', 'Emtricitabine', 'Tenofovir alafenamide'],
    supersededBnfIds: ['0503010C0'],
  },
  {
    brandName: 'Kaftrio',
    subtitle: 'CFTR modulator triple therapy',
    constituentNames: ['Ivacaftor', 'Tezacaftor', 'Elexacaftor'],
    supersededBnfIds: ['0307000I0'],
  },

  // ---- Endocrine & Diabetes Combinations ----
  {
    brandName: 'Synjardy',
    subtitle: 'SGLT2 inhibitor + biguanide',
    constituentNames: ['Empagliflozin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Xigduo',
    subtitle: 'SGLT2 inhibitor + biguanide',
    constituentNames: ['Dapagliflozin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Janumet',
    subtitle: 'DPP-4 inhibitor + biguanide',
    constituentNames: ['Sitagliptin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Jentadueto',
    subtitle: 'DPP-4 inhibitor + biguanide',
    constituentNames: ['Linagliptin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Vipdomet',
    subtitle: 'DPP-4 inhibitor + biguanide',
    constituentNames: ['Alogliptin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Vokanamet',
    subtitle: 'SGLT2 inhibitor + biguanide',
    constituentNames: ['Canagliflozin', 'Metformin hydrochloride'],
  },
  {
    brandName: 'Xultophy',
    subtitle: 'Basal insulin + GLP-1 agonist',
    constituentNames: ['Insulin degludec', 'Liraglutide'],
    supersededBnfIds: ['0601012Y0'],
  },
  {
    brandName: 'Suliqua',
    subtitle: 'Basal insulin + GLP-1 agonist',
    constituentNames: ['Insulin glargine', 'Lixisenatide'],
    supersededBnfIds: ['0601012Z0'],
  },

  // ---- MSK, Urology, Obs, ENT, Eye & Emergency Combinations ----
  {
    brandName: 'Vimovo',
    subtitle: 'NSAID + PPI gastroprotection',
    constituentNames: ['Naproxen', 'Esomeprazole'],
    supersededBnfIds: ['1001010Q0'],
  },
  {
    brandName: 'Combodart',
    subtitle: '5-alpha-reductase + alpha-blocker',
    constituentNames: ['Dutasteride', 'Tamsulosin hydrochloride'],
    supersededBnfIds: ['0704010V0'],
  },
  {
    brandName: 'Vesomni',
    subtitle: 'Antimuscarinic + alpha-blocker',
    constituentNames: ['Solifenacin succinate', 'Tamsulosin hydrochloride'],
    supersededBnfIds: ['0704010W0'],
  },
  {
    brandName: 'Syntometrine',
    subtitle: 'Uterotonic PPH combination',
    constituentNames: ['Ergometrine maleate', 'Oxytocin'],
    supersededBnfIds: ['0701011B0'],
  },
  {
    brandName: 'Entonox',
    subtitle: 'Pre-hospital inhaled analgesic gas (50% / 50%)',
    constituentNames: ['Nitrous oxide', 'Oxygen'],
    supersededBnfIds: ['1501041T0'],
  },
  {
    brandName: 'EMLA',
    aliases: ['EMLA Cream'],
    subtitle: 'Topical local anaesthetic combination',
    constituentNames: ['Lidocaine hydrochloride', 'Prilocaine hydrochloride'],
    supersededBnfIds: ['1502010N0'],
  },
  {
    brandName: 'Dymista',
    subtitle: 'Intranasal antihistamine + steroid',
    constituentNames: ['Azelastine hydrochloride', 'Fluticasone propionate'],
    supersededBnfIds: ['1202010B0'],
  },
  {
    brandName: 'Cosopt',
    subtitle: 'Glaucoma eye drops combination',
    constituentNames: ['Dorzolamide', 'Timolol maleate'],
    supersededBnfIds: ['1106000K0'],
  },
  {
    brandName: 'Xalacom',
    aliases: ['Fixapost'],
    subtitle: 'Glaucoma eye drops combination',
    constituentNames: ['Latanoprost', 'Timolol maleate'],
    supersededBnfIds: ['1106000M0'],
  },
  {
    brandName: 'Adcal-D3',
    aliases: ['Calcichew-D3'],
    subtitle: 'Calcium + Vitamin D3 supplement',
    constituentNames: ['Calcium carbonate', 'Colecalciferol'],
    supersededBnfIds: ['0905011H0'],
  },
  {
    brandName: 'Ryeqo',
    subtitle: 'GnRH antagonist + hormone add-back therapy',
    constituentNames: ['Relugolix', 'Estradiol', 'Norethisterone'],
    supersededBnfIds: ['0607020R0'],
  },
];

const EXCLUDED_AUTO_BRAND_TOKENS = new Set([
  'vitamin a',
  'vitamin b',
  'vitamin b1',
  'vitamin b6',
  'vitamin b12',
  'vitamin c',
  'vitamin d',
  'vitamin d2',
  'vitamin d3',
  'vitamin e',
  'vitamin k',
  'vitamin k1',
  'epinephrine',
  'norepinephrine',
  'ivig',
  'siadh',
  'g6pd',
  'mmr',
  'atra',
  'bal',
  'dhea',
  't3',
  '5-fu',
  '6-mp',
  'azt',
  'nac',
  'g-csf',
  'oral',
  'topical',
  'inhaled',
  'cardiovascular',
  'antispasmodic',
  'antiarrhythmic',
  'epilepsy',
  'hair loss',
  'eye drops',
  'ear drops',
  'nasal spray',
]);

function cleanBrandToken(rawToken: string): string {
  return rawToken
    .replace(
      /\b(?:nasal spray|ear\/eye drops|ear drops|eye drops|cold sore cream|topical cream\/ointment|topical gel|vaginal gel|vaginal tablets|vaginal pessary|mouthwash\/gargle|mouthwash|spray\/mouthwash|rectal ointment|caustic pencil|nail solution|nail lacquer|lozenges|lozenges|buccal tablets|film|gel|cream\/ointment|cream|ointment|patch|implant|tablets|tablet|solution|sachets|suspension)\b/gi,
      ''
    )
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalizeConstituentName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function splitGenericConstituents(baseGeneric: string): string[] {
  const cleaned = stripParentheticalNotes(baseGeneric).trim();
  if (!cleaned) return [];

  // Do not split "Vitamins B and C parenteral" or descriptive phrases
  if (/^vitamins?\b/i.test(cleaned) || /^soothing\b/i.test(cleaned) || /^emollient\b/i.test(cleaned)) {
    return [cleaned];
  }

  const parts = cleaned
    .split(/\s+with\s+|\s*&\s*|\s*\/\s*|\s+and\s+|,\s+/i)
    .map((p) => capitalizeConstituentName(p))
    .filter((p) => p.length >= 3);

  return parts.length > 0 ? parts : [cleaned];
}

function buildCombinedBrandRegistry(): InternalBrandEntry[] {
  const entries: InternalBrandEntry[] = [];
  const registeredTerms = new Set<string>();

  for (const entry of CURATED_BRAND_PRODUCTS) {
    entries.push({
      ...entry,
      id: `brand::${normalizeCompactText(entry.brandName)}`,
    });
    registeredTerms.add(normalizeMatchText(entry.brandName));
    entry.aliases?.forEach((alias) => registeredTerms.add(normalizeMatchText(alias)));
  }

  // Extract additional brand -> generic mappings from `UK_BNF_FALLBACK_ITEMS` parenthetical labels
  for (const bnfItem of UK_BNF_FALLBACK_ITEMS) {
    if (bnfItem.type !== 'chemical') continue;

    const parenMatch = /\(([^)]+)\)/.exec(bnfItem.name);
    if (!parenMatch) continue;

    let candidateSegment = parenMatch[1].trim();
    if (candidateSegment.includes(' - ')) {
      const segments = candidateSegment.split(' - ');
      candidateSegment = segments[segments.length - 1].trim();
    }

    // Split on '/' for multiple brands (e.g., "Zirtek / Piriteze")
    const rawTokens = candidateSegment.split('/').map((t) => cleanBrandToken(t));
    const constituents = splitGenericConstituents(bnfItem.name);
    if (constituents.length === 0) continue;

    for (const token of rawTokens) {
      if (!token || token.length < 3) continue;
      const lowerToken = normalizeMatchText(token);
      if (registeredTerms.has(lowerToken) || EXCLUDED_AUTO_BRAND_TOKENS.has(lowerToken)) {
        continue;
      }
      // Require an uppercase initial letter so lowercase clinical qualifiers ("oral antacid") are skipped
      if (!/^[A-Z]/.test(token)) continue;
      // Skip dosage numbers/percentages masquerading as tokens
      if (/^\d+%?$/.test(token)) continue;

      registeredTerms.add(lowerToken);
      entries.push({
        id: `brand::${bnfItem.id.toLowerCase()}::${normalizeCompactText(token)}`,
        brandName: token,
        subtitle:
          constituents.length > 1
            ? `Combination product (${constituents.length} active drugs)`
            : 'UK Brand-Name Preparation',
        constituentNames: constituents,
        supersededBnfIds: [bnfItem.id],
      });
    }
  }

  return entries;
}

const ALL_BRAND_ENTRIES: InternalBrandEntry[] = buildCombinedBrandRegistry();

const DEVICE_SUFFIXES = new Set([
  'ellipta',
  'breezhaler',
  'respimat',
  'spiromax',
  'genuair',
  'aerosphere',
  'nexthaler',
  'turbohaler',
  'accuhaler',
  'evohaler',
  'easyhaler',
  'forspiro',
  'modulite',
  'chrono',
  'cream',
  'max',
  'plus',
  'extra',
  'advance',
]);

function materializeBrandGroup(entry: InternalBrandEntry): BrandProductGroup {
  const seenKeys = new Set<string>();
  const constituents: BnfMedicationItem[] = [];

  entry.constituentNames.forEach((rawName, idx) => {
    const item = resolveConstituentToBnfItem(rawName, entry.brandName, idx);
    const key = `${item.id}::${item.name.toLowerCase()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      constituents.push(item);
    }
  });

  return {
    id: entry.id,
    brandName: entry.brandName,
    subtitle: entry.subtitle,
    constituents,
    supersededBnfIds: entry.supersededBnfIds,
  };
}

/**
 * Searches curated & BNF-derived brand/combination medications for a user search query
 * and returns them as hierarchical `BrandProductGroup` objects.
 */
export function searchBrandProducts(
  rawQuery: string,
  hasGenericPrefixMatches: boolean
): BrandProductGroup[] {
  const normQuery = normalizeMatchText(rawQuery);
  const compactQuery = normalizeCompactText(rawQuery);
  if (normQuery.length < 3 || !compactQuery) return [];

  const scored: Array<{ entry: InternalBrandEntry; score: number }> = [];

  for (const entry of ALL_BRAND_ENTRIES) {
    const terms = [entry.brandName, ...(entry.aliases ?? [])];
    let bestScore = 0;

    for (const term of terms) {
      const normTerm = normalizeMatchText(term);
      const compactTerm = normalizeCompactText(term);

      if (normTerm === normQuery || compactTerm === compactQuery) {
        bestScore = Math.max(bestScore, 100);
        continue;
      }

      const words = normTerm.split(' ');
      if (
        words.length > 1 &&
        words[0].length >= 4 &&
        words[0] === normQuery &&
        DEVICE_SUFFIXES.has(words[1])
      ) {
        bestScore = Math.max(bestScore, 95);
        continue;
      }

      const allowPrefix =
        normQuery.length >= 4 || (normQuery.length >= 3 && !hasGenericPrefixMatches);
      if (
        allowPrefix &&
        (normTerm.startsWith(normQuery) || compactTerm.startsWith(compactQuery))
      ) {
        bestScore = Math.max(bestScore, 80);
      }
    }

    if (bestScore > 0) {
      scored.push({ entry, score: bestScore });
    }
  }

  if (scored.length === 0) return [];

  scored.sort(
    (a, b) => b.score - a.score || a.entry.brandName.localeCompare(b.entry.brandName)
  );

  const exactMatches = scored.filter((item) => item.score >= 95);
  const chosen = exactMatches.length > 0 ? exactMatches.slice(0, 3) : scored.slice(0, 2);

  return chosen.map((item) => materializeBrandGroup(item.entry));
}

/**
 * Converts a dynamically fetched Gemini brand resolution into a `BrandProductGroup`
 * whose constituent drugs link to real UK BNF IDs where matched.
 */
export function buildBrandGroupFromResolution(
  productName: string,
  constituentNames: string[],
  subtitle?: string
): BrandProductGroup {
  const cleanBrand = productName.trim();
  const seenKeys = new Set<string>();
  const constituents: BnfMedicationItem[] = [];

  constituentNames
    .map((name) => capitalizeConstituentName(name))
    .filter((name) => name.length > 0)
    .forEach((name, idx) => {
      const bnfItem = resolveConstituentToBnfItem(name, cleanBrand, idx);
      const key = `${bnfItem.id}::${bnfItem.name.toLowerCase()}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        constituents.push(bnfItem);
      }
    });

  return {
    id: `brand::ai::${normalizeCompactText(cleanBrand)}`,
    brandName: cleanBrand,
    subtitle:
      subtitle?.trim() ||
      (constituents.length > 1
        ? `Combination product (${constituents.length} active drugs)`
        : 'Brand-name product'),
    constituents,
  };
}
