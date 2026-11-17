import React from 'react';
import {
  Volume2,
  VolumeX,
  Loader2,
  Hash,
  Pill,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Skull,
  AlertTriangle,
  Activity,
  ExternalLink,
} from 'lucide-react';
import {
  BnfMedicationItem,
  GeminiClinicalDetails,
  GeminiToxicityDetails,
} from '../types/medication';
import { formatMetricNumber, ToxDoseUnit } from './ToxCalculator';

interface MedicationCardProps {
  medication: BnfMedicationItem;
  isSelected: boolean;
  onSelect: (medication: BnfMedicationItem) => void;
  clinicalDetails?: GeminiClinicalDetails;
  isClinicalLoading: boolean;
  clinicalError?: string | null;
  onRetryClinical: (medication: BnfMedicationItem) => void;
  isToxicityMode?: boolean;
  toxicityDetails?: GeminiToxicityDetails;
  isToxicityLoading?: boolean;
  toxicityError?: string | null;
  onRetryToxicity?: (medication: BnfMedicationItem) => void;
  toxCalculatedMetrics?: {
    totalIngested: number | null;
    ingestedDosePerKg: number | null;
    unit: ToxDoseUnit;
  };
  onToggleToxUnit?: () => void;
  isAudioLoading: boolean;
  isSpeaking: boolean;
  onListen: (id: string, name: string) => void;
}

/**
 * Extracts a clean generic drug search term from a BNF nomenclature name
 * (e.g. "Paracetamol 500mg tablets" -> "Paracetamol") for TOXBASE lookup.
 */
function getCleanToxbaseDrugName(rawName: string): string {
  const withoutParens = rawName.replace(/\s*\([^)]*\)/g, '').trim();
  // Strip dosage numbers and formulation suffixes if present (e.g. "500mg tablets")
  const beforeDoseMatch = withoutParens.match(/^([A-Za-z][A-Za-z\s-]*?)(?:\s+\d|\s*$)/);
  if (beforeDoseMatch && beforeDoseMatch[1].trim().length >= 3) {
    return beforeDoseMatch[1].trim();
  }
  return withoutParens || rawName.trim();
}

/**
 * Formats a hyphenated phonetic string (e.g. "pa-ra-SEE-ta-mol") so uppercase
 * stressed syllables stand out clearly for pronunciation practice.
 */
function renderPhoneticSyllables(phonetic: string, isToxicityMode = false): React.ReactNode {
  const words = phonetic.split(' ');
  return words.map((word, wordIdx) => {
    const syllables = word.split('-');
    return (
      <React.Fragment key={wordIdx}>
        {wordIdx > 0 && <span className="mx-1.5 text-slate-400">·</span>}
        {syllables.map((syllable, sylIdx) => {
          const isStressed = syllable === syllable.toUpperCase() && /[A-Z]/.test(syllable);
          return (
            <React.Fragment key={sylIdx}>
              {sylIdx > 0 && <span className="text-slate-400 select-none">-</span>}
              <span
                className={
                  isStressed
                    ? isToxicityMode
                      ? 'font-bold text-rose-800 underline decoration-rose-500/70 decoration-2 underline-offset-4'
                      : 'font-bold text-emerald-800 underline decoration-emerald-500/70 decoration-2 underline-offset-4'
                    : 'text-slate-700 font-medium'
                }
              >
                {syllable}
              </span>
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isSelected,
  onSelect,
  clinicalDetails,
  isClinicalLoading,
  clinicalError,
  onRetryClinical,
  isToxicityMode = false,
  toxicityDetails,
  isToxicityLoading = false,
  toxicityError,
  onRetryToxicity,
  toxCalculatedMetrics,
  onToggleToxUnit,
  isAudioLoading,
  isSpeaking,
  onListen,
}) => {
  return (
    <article
      onClick={() => onSelect(medication)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected || isSpeaking || isAudioLoading
          ? isToxicityMode
            ? 'border-rose-600 ring-2 ring-rose-600/30 shadow-md'
            : 'border-ambulance-green ring-2 ring-ambulance-green/30 shadow-md'
          : isToxicityMode
          ? 'border-rose-200/80 shadow-sm hover:shadow-md hover:border-rose-300'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Row: Optional Entity Type & Clinical/Tox Details Action Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {medication.type ? (
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                isToxicityMode
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {medication.type}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(medication);
            }}
            className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              isToxicityMode
                ? 'text-rose-600 hover:text-rose-800'
                : 'text-ambulance-green hover:text-emerald-800'
            }`}
          >
            {isToxicityMode ? (
              <Skull className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {isSelected
                ? isToxicityMode
                  ? 'Hide Overdose Details'
                  : 'Hide Clinical Details'
                : isToxicityMode
                ? 'View Overdose Details'
                : 'View Clinical Details'}
            </span>
            {isSelected ? (
              <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Main Header: Prominent Drug Name, BNF ID Subtitle & Google Cloud TTS Listen Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight break-words leading-snug">
              {medication.name}
            </h2>

            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>BNF ID:</span>
              <code className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-mono text-xs sm:text-sm">
                {medication.id}
              </code>
            </p>
          </div>

          {/* Right: Listen Audio Button (Google Cloud TTS en-GB-Neural2-B) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onListen(medication.id, medication.name);
            }}
            aria-busy={isAudioLoading}
            aria-label={
              isAudioLoading
                ? `Fetching pronunciation audio for ${medication.name}`
                : isSpeaking
                ? `Stop pronunciation of ${medication.name}`
                : `Listen to British English pronunciation of ${medication.name}`
            }
            className={`shrink-0 inline-flex items-center justify-center gap-2 min-w-[112px] px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer select-none shadow-sm ${
              isAudioLoading
                ? isToxicityMode
                  ? 'bg-rose-800 text-rose-50 ring-2 ring-rose-500/40'
                  : 'bg-emerald-800 text-emerald-50 ring-2 ring-emerald-500/40'
                : isSpeaking
                ? isToxicityMode
                  ? 'bg-rose-700 text-white ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-emerald-700 text-white ring-4 ring-emerald-500/30 animate-pulse'
                : isToxicityMode
                ? 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98]'
                : 'bg-ambulance-green text-white hover:bg-emerald-800 active:scale-[0.98]'
            }`}
          >
            {isAudioLoading ? (
              <>
                <Loader2 className="w-5 h-5 shrink-0 animate-spin" aria-hidden="true" />
                <span>Loading…</span>
              </>
            ) : isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Listen</span>
              </>
            )}
          </button>
        </div>

        {/* Expanded Panel when Card is Selected */}
        {isSelected && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 pt-4 border-t border-slate-100 cursor-default"
          >
            {isToxicityMode ? (
              /* ================= TOXICITY MODE DETAILS PANEL ================= */
              isToxicityLoading ? (
                <div
                  aria-live="polite"
                  aria-busy="true"
                  className="space-y-3 py-2 animate-pulse"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                    <span>Generating UK Toxbase &amp; JRCALC overdose guidance…</span>
                  </div>
                  <div className="h-12 w-full bg-rose-50 rounded-xl" />
                  <div className="h-16 w-full bg-slate-100 rounded-xl" />
                  <div className="h-16 w-full bg-slate-100 rounded-xl" />
                </div>
              ) : toxicityError || !toxicityDetails ? (
                <div
                  role="status"
                  className="rounded-xl bg-rose-50/60 border border-rose-200 px-4 py-3 text-sm text-rose-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                      <span className="font-medium">Overdose details unavailable</span>
                    </div>
                    {onRetryToxicity && (
                      <button
                        type="button"
                        onClick={() => onRetryToxicity(medication)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:underline cursor-pointer shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                  {toxicityError && (
                    <p className="mt-1.5 text-xs text-rose-700 break-words">{toxicityError}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 1. Known Toxic Threshold (plus live comparison if user entered calculator values) */}
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className="w-4 h-4 text-rose-600 shrink-0"
                          aria-hidden="true"
                        />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-800">
                          Known Toxic Threshold
                        </h3>
                      </div>

                      {toxCalculatedMetrics &&
                        (toxCalculatedMetrics.totalIngested !== null ||
                          toxCalculatedMetrics.ingestedDosePerKg !== null) && (
                          <button
                            type="button"
                            onClick={onToggleToxUnit}
                            title="Click to switch between milligrams (mg) and micrograms (mcg)"
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono transition-colors cursor-pointer"
                          >
                            <span>
                              Calc:{' '}
                              {toxCalculatedMetrics.totalIngested !== null
                                ? `${formatMetricNumber(toxCalculatedMetrics.totalIngested)} ${toxCalculatedMetrics.unit}`
                                : ''}
                              {toxCalculatedMetrics.ingestedDosePerKg !== null
                                ? ` (${formatMetricNumber(toxCalculatedMetrics.ingestedDosePerKg)} ${toxCalculatedMetrics.unit}/kg)`
                                : ''}
                            </span>
                          </button>
                        )}
                    </div>
                    <p className="text-sm sm:text-base font-bold text-rose-950 leading-snug">
                      {toxicityDetails.toxicThreshold}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-rose-200/80 flex items-center justify-between gap-2">
                      <a
                        href={`https://www.toxbase.org/?q=${encodeURIComponent(
                          getCleanToxbaseDrugName(medication.name)
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          const cleanName = getCleanToxbaseDrugName(medication.name);
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            void navigator.clipboard.writeText(cleanName).catch(() => {});
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100/80 text-rose-700 border border-rose-300 text-xs sm:text-sm font-bold shadow-2xs transition-colors"
                        title={`Open TOXBASE for ${getCleanToxbaseDrugName(
                          medication.name
                        )} (also copies drug name to clipboard)`}
                      >
                        <span>
                          Look up &ldquo;{getCleanToxbaseDrugName(medication.name)}&rdquo; on
                          TOXBASE
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* 2. Overdose Presentation & Vital Sign Changes */}
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Activity
                        className="w-4 h-4 text-rose-600 shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Overdose Presentation &amp; Vital Signs
                      </h3>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                      {toxicityDetails.overdoseEffects}
                    </p>
                  </div>

                  {/* Gemini AI Attribution / Disclaimer */}
                  <p className="pt-2 border-t border-slate-100 text-xs text-slate-400 text-center">
                    This content was generated by Gemini Ai which can make mistakes
                  </p>
                </div>
              )
            ) : (
              /* ================= STANDARD CLINICAL DETAILS PANEL ================= */
              isClinicalLoading ? (
                /* Loading State on Flashcard while Gemini Generates Clinical Details */
                <div
                  aria-live="polite"
                  aria-busy="true"
                  className="space-y-3 py-2 animate-pulse"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-ambulance-green">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                    <span>Generating UK JRCALC &amp; BNF clinical details…</span>
                  </div>
                  <div className="h-8 w-48 bg-slate-100 rounded-xl" />
                  <div className="h-5 w-64 bg-slate-100 rounded-lg" />
                  <div className="h-16 w-full bg-slate-100 rounded-xl" />
                  <div className="space-y-2 pt-1">
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-5/6 bg-slate-100 rounded" />
                  </div>
                </div>
              ) : clinicalError || !clinicalDetails ? (
                /* Gentle Fallback Message if Gemini API Fails or Returns Invalid JSON */
                <div
                  role="status"
                  className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        className="w-4 h-4 text-slate-400 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-medium">Clinical details unavailable</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRetryClinical(medication)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ambulance-green hover:underline cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Retry</span>
                    </button>
                  </div>
                  {clinicalError && (
                    <p className="mt-1.5 text-xs text-slate-500 break-words">{clinicalError}</p>
                  )}
                </div>
              ) : (
                /* Resolved Gemini Clinical Details: Phonetic Spelling, Class, On-Scene Context, and Indications */
                <div className="space-y-4">
                  {/* Phonetic Spelling */}
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Phonetic Spelling
                    </span>
                    <div
                      className="inline-flex flex-wrap items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 font-mono text-sm sm:text-base tracking-wide"
                      aria-label={`Phonetic pronunciation: ${clinicalDetails.phoneticSpelling}`}
                    >
                      <span className="text-slate-400 select-none mr-0.5">/</span>
                      {renderPhoneticSyllables(clinicalDetails.phoneticSpelling, isToxicityMode)}
                      <span className="text-slate-400 select-none ml-0.5">/</span>
                    </div>
                  </div>

                  {/* Drug Class */}
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-nhs-blue shrink-0" aria-hidden="true" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Class:
                    </span>
                    <span className="text-sm font-semibold text-nhs-blue">
                      {clinicalDetails.class}
                    </span>
                  </div>

                  {/* Prominent Paramedic Pre-Hospital Overview: "On-Scene Context" */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3.5 sm:p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Stethoscope
                        className="w-4 h-4 text-ambulance-green shrink-0"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        On-Scene Context
                      </h3>
                    </div>
                    <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                      {clinicalDetails.medicSummary}
                    </p>
                  </div>

                  {/* Indications */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Common Indications
                    </h3>
                    <ul className="space-y-1.5">
                      {clinicalDetails.indications.map((indication, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm sm:text-[15px] text-slate-700 leading-snug"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{indication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gemini AI Attribution / Disclaimer */}
                  <p className="pt-2 border-t border-slate-100 text-xs text-slate-400 text-center">
                    This content was generated by Gemini Ai which can make mistakes
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </article>
  );
};

/**
 * Subtle loading skeleton flashcard displayed while OpenPrescribing API results are fetching.
 */
export const MedicationCardSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex items-center justify-between gap-4 shadow-sm animate-pulse"
    >
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-20 bg-slate-200 rounded-full" />
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
        <div className="h-4 w-36 bg-slate-100 rounded-md" />
      </div>
      <div className="h-11 w-[112px] bg-slate-200 rounded-xl shrink-0" />
    </div>
  );
};
