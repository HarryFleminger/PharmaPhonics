/**
 * Structured pre-hospital clinical assessment checklist for a medical condition or
 * common 999 ambulance call-out presentation.
 */
export interface ClinicalAssessmentItem {
  id: string;
  /** Primary presentation / call-out title (e.g. "Chest Pain", "Difficulty Breathing / SOB") */
  title: string;
  /** System or call-out category (e.g. "Cardiovascular", "Respiratory", "Abdominal & GI") */
  category: string;
  /** Common UK pre-hospital abbreviations & synonyms for instant local search */
  aliases: string[];
  /** Focused SOCRATES/SOCATE/ROS questions to ask */
  keyQuestions: string[];
  /** Direct bedside assessments & primary/secondary survey checks */
  keyAssessments: string[];
  /** High-risk red flags requiring urgent escalation */
  redFlags: string[];
}
