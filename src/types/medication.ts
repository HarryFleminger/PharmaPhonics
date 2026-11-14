export type MedicationCategory = 'JRCALC Pre-Hospital' | 'NHS Community' | 'Both';

export interface Medication {
  id: string;
  /** UK BNF / rINN approved drug name (e.g., Paracetamol, Salbutamol, Adrenaline) */
  name: string;
  /** Syllabic British English phonetic spelling with stressed syllables capitalized */
  phonetic: string;
  /** Pharmacological class per BNF / JRCALC */
  drugClass: string;
  /** Clinical context where paramedics encounter this medication */
  category: MedicationCategory;
  /** Common UK clinical indications */
  indications: string[];
  /** Concise pre-hospital or post-shift reflection note */
  clinicalNote?: string;
}

export type CategoryFilter = 'All' | MedicationCategory;

export type SpeechSpeed = 1.0 | 0.75;
