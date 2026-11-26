import React, { useMemo, useState } from 'react';
import { Search, SearchX, X } from 'lucide-react';
import { SAMPLE_ASSESSMENTS } from '../data/sampleAssessments';
import { ClinicalAssessmentItem } from '../types/assessment';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentViewProps {
  onOpenAssessment?: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onOpenAssessment }) => {
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredAssessments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SAMPLE_ASSESSMENTS;

    return SAMPLE_ASSESSMENTS.filter((item) => {
      if (item.title.toLowerCase().includes(normalized)) return true;
      if (item.category.toLowerCase().includes(normalized)) return true;
      return item.aliases.some((alias) => alias.toLowerCase().includes(normalized));
    });
  }, [query]);

  const handleToggleCard = (assessment: ClinicalAssessmentItem) => {
    setExpandedIds((prev) => {
      const nextExpanded = !prev[assessment.id];
      if (nextExpanded) {
        onOpenAssessment?.();
      }
      return {
        ...prev,
        [assessment.id]: nextExpanded,
      };
    });
  };

  const handleSelectQuickSample = (assessment: ClinicalAssessmentItem) => {
    setQuery(assessment.title);
    setExpandedIds((prev) => ({
      ...prev,
      [assessment.id]: true,
    }));
    onOpenAssessment?.();
  };

  const hasSingleSearchMatch = query.trim() !== '' && filteredAssessments.length === 1;

  return (
    <div className="space-y-4">
      {/* Search & Quick Jump Pills */}
      <section
        aria-label="Clinical assessment search and quick call-outs"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3.5 sm:p-5 space-y-3"
      >
        <div className="relative">
          <Search
            className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="medspeak-assessment-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search condition or call-out (e.g. Chest Pain, SOB, Abdo Pain)..."
            aria-label="Search condition or 999 call-out presentation"
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50/60 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ambulance-green/30 focus:border-ambulance-green focus:bg-white transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear assessment search"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Quick Call-Out Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_ASSESSMENTS.map((item) => {
            const isActiveFilter = query.trim().toLowerCase() === item.title.toLowerCase();
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectQuickSample(item)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer active:scale-[0.98] ${
                  isActiveFilter
                    ? 'bg-ambulance-green text-white border-ambulance-green shadow-xs'
                    : 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:bg-emerald-100/80'
                }`}
              >
                {item.title}
              </button>
            );
          })}

          {query.trim() !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Show All
            </button>
          )}
        </div>
      </section>

      {/* Assessment Cards or Empty State */}
      {filteredAssessments.length > 0 ? (
        <section aria-label="Pre-hospital clinical assessments" className="space-y-3">
          {filteredAssessments.map((assessment) => {
            const isCardExpanded =
              Boolean(expandedIds[assessment.id]) || hasSingleSearchMatch;
            return (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                isExpanded={isCardExpanded}
                onToggle={handleToggleCard}
              />
            );
          })}
        </section>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <SearchX className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            No match for &ldquo;{query.trim()}&rdquo;
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            Currently showing <strong>Chest Pain</strong>,{' '}
            <strong>Difficulty Breathing / SOB</strong>, and <strong>Abdominal Pain</strong> while
            testing layout.
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-ambulance-green hover:bg-emerald-800 text-white text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};
