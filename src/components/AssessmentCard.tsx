import React from 'react';
import {
  HelpCircle,
  Stethoscope,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ClinicalAssessmentItem } from '../types/assessment';

interface AssessmentCardProps {
  assessment: ClinicalAssessmentItem;
  isExpanded: boolean;
  onToggle: (assessment: ClinicalAssessmentItem) => void;
}

/**
 * Formats a concise pocketbook line such as `"Onset: When did it start?"`
 * so the keyword prefix stands out cleanly for rapid scanning.
 */
function renderChecklistLine(line: string, accentClass: string): React.ReactNode {
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

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  isExpanded,
  onToggle,
}) => {
  return (
    <article
      onClick={() => onToggle(assessment)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        isExpanded
          ? 'border-ambulance-green ring-2 ring-ambulance-green/25 shadow-md'
          : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Compact Pocketbook Card Header */}
      <div className="px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {assessment.title}
          </h2>
          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            {assessment.category}
          </span>
          {assessment.id.startsWith('ai-') && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-nhs-blue border border-sky-200 shrink-0">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>AI</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(assessment);
          }}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? `Hide ${assessment.title} assessment`
              : `View ${assessment.title} assessment`
          }
          className="inline-flex items-center gap-1 text-xs font-semibold text-ambulance-green hover:text-emerald-800 transition-colors cursor-pointer shrink-0"
        >
          <span>{isExpanded ? 'Hide' : 'Open'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Expanded Checklist Body */}
      {isExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="border-t border-slate-100 bg-slate-50/40 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 cursor-default"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* 1. Key Questions to Ask */}
            <section
              aria-label={`Key questions to ask for ${assessment.title}`}
              className="bg-white rounded-xl border border-sky-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-sky-100">
                <div className="p-1 rounded-md bg-sky-100 text-nhs-blue shrink-0">
                  <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Key Questions to Ask
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {assessment.keyQuestions.map((question, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-nhs-blue font-bold select-none shrink-0">-</span>
                    <span>{renderChecklistLine(question, 'text-nhs-blue')}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 2. Key Assessments to Make */}
            <section
              aria-label={`Key assessments to make for ${assessment.title}`}
              className="bg-white rounded-xl border border-emerald-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                <div className="p-1 rounded-md bg-emerald-100 text-ambulance-green shrink-0">
                  <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Key Assessments to Make
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {assessment.keyAssessments.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm leading-snug"
                  >
                    <span className="text-ambulance-green font-bold select-none shrink-0">-</span>
                    <span>{renderChecklistLine(item, 'text-ambulance-green')}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Red Flags */}
            <section
              aria-label={`Red flags for ${assessment.title}`}
              className="lg:col-span-2 bg-rose-50/80 rounded-xl border-2 border-rose-200 p-3.5 sm:p-4 shadow-xs"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-rose-200/80">
                <div className="p-1 rounded-md bg-rose-100 text-rose-700 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-900">
                  Red Flags
                </h3>
              </div>
              <ul className="space-y-1.5 mt-2.5">
                {assessment.redFlags.map((flag, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm text-rose-950 font-semibold leading-snug"
                  >
                    <span className="text-rose-600 font-bold select-none shrink-0">-</span>
                    <span>{flag}</span>
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
