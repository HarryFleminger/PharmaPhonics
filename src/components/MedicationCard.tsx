import React from 'react';
import { Volume2, VolumeX, Loader2, Pill, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { Medication } from '../types/medication';

interface MedicationCardProps {
  medication: Medication;
  isLoading: boolean;
  isSpeaking: boolean;
  onListen: (medication: Medication) => void;
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

function getCategoryBadgeStyles(category: Medication['category']): {
  badgeClass: string;
  label: string;
} {
  switch (category) {
    case 'JRCALC Pre-Hospital':
      return {
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: 'JRCALC Pre-Hospital',
      };
    case 'NHS Community':
      return {
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
        label: 'NHS FP10 Community',
      };
    case 'Both':
      return {
        badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
        label: 'JRCALC & NHS Community',
      };
  }
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isLoading,
  isSpeaking,
  onListen,
}) => {
  const { badgeClass, label } = getCategoryBadgeStyles(medication.category);

  return (
    <article
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isSpeaking || isLoading
          ? 'border-ambulance-green ring-2 ring-ambulance-green/30 shadow-md'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Top Section: Category, Drug Name, Phonetic Spelling & Listen Button */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
          >
            {label}
          </span>

          {medication.ssml && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-200"
              title={`SSML Pronunciation Markup: ${medication.ssml}`}
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              SSML Tuned
            </span>
          )}
        </div>

        {/* Drug Name + Listen Button Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
              {medication.name}
            </h2>

            {/* Phonetic Breakdown Pill */}
            <div
              className="mt-2 inline-flex flex-wrap items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 font-mono text-sm sm:text-base tracking-wide"
              aria-label={`Phonetic pronunciation: ${medication.phonetic}`}
            >
              <span className="text-slate-400 select-none mr-0.5">/</span>
              {renderPhoneticSyllables(medication.phonetic)}
              <span className="text-slate-400 select-none ml-0.5">/</span>
            </div>
          </div>

          {/* Listen Button (Google Cloud TTS en-GB-Neural2-B with Loading Spinner) */}
          <button
            type="button"
            onClick={() => onListen(medication)}
            aria-busy={isLoading}
            aria-label={
              isLoading
                ? `Fetching pronunciation audio for ${medication.name}`
                : isSpeaking
                ? `Stop pronunciation of ${medication.name}`
                : `Listen to British English pronunciation of ${medication.name}`
            }
            className={`shrink-0 inline-flex items-center justify-center gap-2 min-w-[112px] px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer select-none shadow-sm ${
              isLoading
                ? 'bg-emerald-800 text-emerald-50 ring-2 ring-emerald-500/40'
                : isSpeaking
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/30 animate-pulse'
                : 'bg-ambulance-green text-white hover:bg-emerald-800 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
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

        {/* Drug Class */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2">
          <Pill className="w-4 h-4 text-nhs-blue shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Class:
          </span>
          <span className="text-sm font-semibold text-nhs-blue">{medication.drugClass}</span>
        </div>

        {/* Common Indications */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Common Indications
          </h3>
          <ul className="space-y-1.5">
            {medication.indications.map((indication, index) => (
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

      {/* Bottom Footer: Pre-Hospital / Clinical Reflection Pearl */}
      {medication.clinicalNote && (
        <div className="bg-slate-50/90 border-t border-slate-200/80 px-5 py-3.5 sm:px-6">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <BookOpen
              className="w-4 h-4 text-ambulance-green shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p>
              <strong className="font-semibold text-slate-800">Paramedic Reflection: </strong>
              {medication.clinicalNote}
            </p>
          </div>
        </div>
      )}
    </article>
  );
};
