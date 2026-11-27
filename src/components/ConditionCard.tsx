import React from 'react';
import {
  BookOpen,
  Activity,
  Stethoscope,
  Pill,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react';
import { ClinicalConditionItem } from '../types/condition';

interface ConditionCardProps {
  id?: string;
  condition: ClinicalConditionItem;
  isExpanded: boolean;
  onToggle: (condition: ClinicalConditionItem) => void;
  onSelectMedication: (drugName: string, conditionTitle: string) => void;
  isAudioLoading: boolean;
  isSpeaking: boolean;
  onListen: (id: string, name: string) => void;
}

/**
 * Strips bracketed acronyms (e.g. `"Motor Neurone Disease (MND)"` -> `"Motor Neurone Disease"`)
 * so UK Neural speech synthesis reads the condition name naturally.
 */
function getSpokenConditionTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)/g, '').trim() || title;
}

/**
 * Formats a hyphenated UK English phonetic string so uppercase stressed syllables stand out.
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

/**
 * Formats a concise bullet such as `"Motor Neurone Loss: Progressive degeneration..."`
 * so the keyword prefix stands out cleanly for rapid scanning en route.
 */
function renderStructuredLine(line: string, accentClass: string): React.ReactNode {
  const colonIdx = line.indexOf(':');
  if (colonIdx > 0 && colonIdx <= 28) {
    const label = line.slice(0, colonIdx + 1);
    const body = line.slice(colonIdx + 1);
    return (
      <>
        <span className={`font-bold uppercase tracking-wide ${accentClass}`}>{label}</span>
        <span className="text-slate-800">{body}</span>
      </>
    );
  }
  return <span className="text-slate-800">{line}</span>;
}

export function getConditionCardDomId(conditionId: string): string {
  return `condition-card-${conditionId.toLowerCase().replace(/[^a-z0-9-_]/g, '-')}`;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({
  id,
  condition,
  isExpanded,
  onToggle,
  onSelectMedication,
  isAudioLoading,
  isSpeaking,
  onListen,
}) => {
  const ttsItemId = `cond-${condition.id}`;
  const spokenTitle = getSpokenConditionTitle(condition.title);

  return (
    <article
      id={id}
      onClick={() => onToggle(condition)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isExpanded || isSpeaking || isAudioLoading
          ? 'border-ambulance-green ring-2 ring-ambulance-green/25 shadow-md'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Card Header */}
      <div className="px-4 py-3.5 sm:px-5 sm:py-4 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {condition.title}
            </h2>
            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              {condition.category}
            </span>
            {condition.id.startsWith('ai-') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-nhs-blue border border-sky-200 shrink-0">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>AI</span>
              </span>
            )}
          </div>

          {/* Phonetic Guide + UK Listen Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap items-center gap-2 cursor-default"
          >
            <span className="text-xs sm:text-sm tracking-wide">
              <span className="text-slate-400 mr-1">/</span>
              {renderPhoneticSyllables(condition.phoneticSpelling)}
              <span className="text-slate-400 ml-1">/</span>
            </span>

            <button
              type="button"
              onClick={() => onListen(ttsItemId, spokenTitle)}
              aria-label={
                isSpeaking
                  ? `Stop pronunciation for ${spokenTitle}`
                  : `Listen to UK pronunciation of ${spokenTitle}`
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer active:scale-[0.98] ${
                isSpeaking
                  ? 'bg-ambulance-green text-white border-ambulance-green shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-ambulance-green hover:border-emerald-300'
              }`}
            >
              {isAudioLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                  <span>Loading…</span>
                </>
              ) : isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Listen</span>
                </>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(condition);
          }}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? `Hide ${condition.title} details`
              : `View ${condition.title} details`
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-ambulance-green hover:text-emerald-800 transition-colors cursor-pointer shrink-0 pt-1"
        >
          <span>{isExpanded ? 'Hide' : 'Open'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-slate-100 bg-slate-50/40 px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 cursor-default"
        >
          {/* Top Overview: What It Is */}
          <section
            aria-label={`Overview for ${condition.title}`}
            className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs mb-3.5"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1 rounded-md bg-emerald-100 text-ambulance-green shrink-0">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                What It Is
              </h3>
            </div>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {condition.overview}
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* 1. Causes & Pathophysiology */}
            <section
              aria-label={`Causes and pathophysiology for ${condition.title}`}
              className="bg-white rounded-xl border border-sky-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-sky-100">
                <div className="p-1 rounded-md bg-sky-100 text-nhs-blue shrink-0">
                  <Activity className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Causes &amp; Pathophysiology
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {condition.causesAndPathophysiology.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-nhs-blue font-bold select-none shrink-0">-</span>
                    <span>{renderStructuredLine(line, 'text-nhs-blue')}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. Symptoms & Typical Baseline */}
            <section
              aria-label={`Symptoms and baseline for ${condition.title}`}
              className="bg-white rounded-xl border border-teal-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-teal-100">
                <div className="p-1 rounded-md bg-teal-100 text-teal-700 shrink-0">
                  <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Symptoms &amp; Typical Baseline
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {condition.symptomsAndBaseline.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-teal-700 font-bold select-none shrink-0">-</span>
                    <span>{renderStructuredLine(line, 'text-teal-700')}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Treatments & Common UK Meds Seen */}
            <section
              aria-label={`Treatments and common medications for ${condition.title}`}
              className="lg:col-span-2 bg-white rounded-xl border border-emerald-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                <div className="p-1 rounded-md bg-emerald-100 text-ambulance-green shrink-0">
                  <Pill className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Treatments &amp; Common Medications
                </h3>
              </div>

              <ul className="space-y-1.5 mt-2.5">
                {condition.treatments.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-ambulance-green font-bold select-none shrink-0">-</span>
                    <span>{renderStructuredLine(line, 'text-ambulance-green')}</span>
                  </li>
                ))}
              </ul>

              {condition.commonMeds.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-emerald-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Common UK Medications Seen (tap to open in Medications)
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {condition.commonMeds.map((med) => (
                      <button
                        key={med}
                        type="button"
                        onClick={() => onSelectMedication(med, condition.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-ambulance-green text-ambulance-green hover:text-white border border-emerald-200 hover:border-ambulance-green text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <Pill className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{med}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-75" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 4. Acute Complications & Crises */}
            <section
              aria-label={`Acute complications and crises for ${condition.title}`}
              className="lg:col-span-2 bg-white rounded-xl border border-amber-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
                <div className="p-1 rounded-md bg-amber-100 text-amber-700 shrink-0">
                  <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Acute Complications &amp; Crises
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {condition.acuteComplications.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-amber-600 font-bold select-none shrink-0">-</span>
                    <span>{renderStructuredLine(line, 'text-amber-800')}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Gemini AI Attribution / Disclaimer */}
          <p className="mt-3.5 pt-2.5 border-t border-slate-200/70 text-xs text-slate-400 text-center">
            This content was generated by Gemini Ai which can make mistakes
          </p>
        </div>
      )}
    </article>
  );
};
