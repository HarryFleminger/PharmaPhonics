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
} from 'lucide-react';
import { BnfMedicationItem, GeminiClinicalDetails } from '../types/medication';

interface MedicationCardProps {
  medication: BnfMedicationItem;
  isSelected: boolean;
  onSelect: (medication: BnfMedicationItem) => void;
  clinicalDetails?: GeminiClinicalDetails;
  isClinicalLoading: boolean;
  clinicalError?: string | null;
  onRetryClinical: (medication: BnfMedicationItem) => void;
  isAudioLoading: boolean;
  isSpeaking: boolean;
  onListen: (id: string, name: string) => void;
}

/**
 * Formats a hyphenated phonetic string (e.g. "pa-ra-SEE-ta-mol") so uppercase
 * stressed syllables stand out clearly for pronunciation practice.
 */
function renderPhoneticSyllables(phonetic: string): React.ReactNode {
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
                    ? 'font-bold text-emerald-800 underline decoration-emerald-500/70 decoration-2 underline-offset-4'
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
  isAudioLoading,
  isSpeaking,
  onListen,
}) => {
  return (
    <article
      onClick={() => onSelect(medication)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isSelected || isSpeaking || isAudioLoading
          ? 'border-ambulance-green ring-2 ring-ambulance-green/30 shadow-md'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Row: Optional Entity Type & Clinical Details Action Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {medication.type ? (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
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
            className="inline-flex items-center gap-1 text-xs font-semibold text-ambulance-green hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isSelected ? 'Hide Clinical Details' : 'View Clinical Details'}</span>
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
                ? 'bg-emerald-800 text-emerald-50 ring-2 ring-emerald-500/40'
                : isSpeaking
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/30 animate-pulse'
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

        {/* Expanded Gemini Clinical Details Panel when Card is Selected */}
        {isSelected && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 pt-4 border-t border-slate-100 cursor-default"
          >
            {isClinicalLoading ? (
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
                    <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
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
              /* Resolved Gemini Clinical Details: Phonetic Spelling, Class, and Indications */
              <div className="space-y-3.5">
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
                    {renderPhoneticSyllables(clinicalDetails.phoneticSpelling)}
                    <span className="text-slate-400 select-none ml-0.5">/</span>
                  </div>
                </div>

                {/* Drug Class */}
                <div className="flex items-center gap-2 pt-1">
                  <Pill className="w-4 h-4 text-nhs-blue shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Class:
                  </span>
                  <span className="text-sm font-semibold text-nhs-blue">
                    {clinicalDetails.class}
                  </span>
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
              </div>
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
