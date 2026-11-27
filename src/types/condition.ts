/**
 * Structured UK Paramedic condition refresher & pathophysiology reference item
 * for chronic, complex, or unfamiliar past medical history encountered en route.
 */
export interface ClinicalConditionItem {
  id: string;
  /** Primary UK NHS clinical title (e.g. "Motor Neurone Disease (MND)") */
  title: string;
  /** Hyphenated British English phonetic guide with stressed syllables in ALL CAPS */
  phoneticSpelling: string;
  /** Clinical system category */
  category: string;
  /** Common UK abbreviations, legacy names, and international synonyms for search */
  aliases: string[];
  /** Crisp 2–3 sentence plain-English "What It Is" summary */
  overview: string;
  /** Pathophysiological mechanisms in "Label: explanation" format */
  causesAndPathophysiology: string[];
  /** Typical baseline findings & chronic/relapse symptoms in "Label: explanation" format */
  symptomsAndBaseline: string[];
  /** Standard NHS / NICE management approaches in "Label: explanation" format */
  treatments: string[];
  /** Clean single UK BNF generic drug names for quick lookup in the Medications tab */
  commonMeds: string[];
  /** Purely descriptive acute flares, decompensations, or emergencies caused by the condition */
  acuteComplications: string[];
}
