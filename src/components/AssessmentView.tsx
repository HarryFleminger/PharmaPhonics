import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  SearchX,
  X,
  Folder,
  FolderOpen,
  Stethoscope,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  ASSESSMENT_CATEGORIES,
  PREGENERATED_ASSESSMENTS,
} from '../data/pregeneratedAssessments';
import {
  fetchConditionAssessment,
  getAllCachedAiAssessments,
} from '../services/geminiClinicalService';
import { ClinicalAssessmentItem } from '../types/assessment';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentViewProps {
  onOpenAssessment?: () => void;
  isQuickCategoriesMinimized?: boolean;
  onSetQuickCategoriesMinimized?: (minimized: boolean | ((prev: boolean) => boolean)) => void;
}

const COMMON_CALLOUT_IDS = [
  'chest-pain',
  'difficulty-breathing',
  'abdominal-pain',
  'collapse-syncope',
  'stroke-tia',
  'seizure',
  'suspected-sepsis',
  'elderly-fall',
] as const;

function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[/&-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function searchAssessments(
  rawQuery: string,
  items: ClinicalAssessmentItem[]
): ClinicalAssessmentItem[] {
  const qRaw = rawQuery.trim().toLowerCase();
  const qNorm = normalizeSearchText(rawQuery);
  if (!qRaw) return [];

  const scored: Array<{ item: ClinicalAssessmentItem; score: number }> = [];

  for (const item of items) {
    const titleLower = item.title.toLowerCase();
    const titleNorm = normalizeSearchText(item.title);
    const categoryNorm = normalizeSearchText(item.category);

    let score = 0;

    if (titleLower === qRaw || titleNorm === qNorm) {
      score = 100;
    } else if (
      item.aliases.some(
        (alias) =>
          alias.toLowerCase() === qRaw || normalizeSearchText(alias) === qNorm
      )
    ) {
      score = 95;
    } else if (titleLower.startsWith(qRaw) || titleNorm.startsWith(qNorm)) {
      score = 85;
    } else if (
      item.aliases.some(
        (alias) =>
          alias.toLowerCase().startsWith(qRaw) ||
          normalizeSearchText(alias).startsWith(qNorm)
      )
    ) {
      score = 75;
    } else if (titleLower.includes(qRaw) || titleNorm.includes(qNorm)) {
      score = 65;
    } else if (
      item.aliases.some(
        (alias) =>
          alias.toLowerCase().includes(qRaw) ||
          normalizeSearchText(alias).includes(qNorm)
      )
    ) {
      score = 55;
    } else if (categoryNorm.includes(qNorm)) {
      score = 40;
    } else if (
      item.keyQuestions.some((line) => normalizeSearchText(line).includes(qNorm)) ||
      item.keyAssessments.some((line) => normalizeSearchText(line).includes(qNorm)) ||
      item.redFlags.some((line) => normalizeSearchText(line).includes(qNorm))
    ) {
      score = 25;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.map((entry) => entry.item);
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onOpenAssessment,
  isQuickCategoriesMinimized,
  onSetQuickCategoriesMinimized,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoryDrawerMinimized, setIsCategoryDrawerMinimized] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [internalQuickCategoriesMinimized, setInternalQuickCategoriesMinimized] = useState<boolean>(
    () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < 768;
    }
  );
  const quickCategoriesMinimized =
    isQuickCategoriesMinimized ?? internalQuickCategoriesMinimized;
  const setQuickCategoriesMinimized =
    onSetQuickCategoriesMinimized ?? setInternalQuickCategoriesMinimized;
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [aiAssessments, setAiAssessments] = useState<ClinicalAssessmentItem[]>(() =>
    getAllCachedAiAssessments()
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const allAssessments = useMemo(() => {
    const mergedMap = new Map<string, ClinicalAssessmentItem>();
    for (const item of PREGENERATED_ASSESSMENTS) {
      mergedMap.set(item.id, item);
    }
    for (const item of aiAssessments) {
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    }
    return Array.from(mergedMap.values());
  }, [aiAssessments]);

  const assessmentsByCategory = useMemo(() => {
    const map: Record<string, ClinicalAssessmentItem[]> = {};
    for (const category of ASSESSMENT_CATEGORIES) {
      map[category] = [];
    }
    for (const item of allAssessments) {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category].push(item);
    }
    return map;
  }, [allAssessments]);

  const commonCallOuts = useMemo(() => {
    return COMMON_CALLOUT_IDS.map((id) =>
      PREGENERATED_ASSESSMENTS.find((item) => item.id === id)
    ).filter((item): item is ClinicalAssessmentItem => Boolean(item));
  }, []);

  const activeCategoryItems = activeCategory ? assessmentsByCategory[activeCategory] ?? [] : [];

  const searchResults = useMemo(
    () => searchAssessments(query, allAssessments),
    [query, allAssessments]
  );

  const selectedAssessment = useMemo(
    () =>
      selectedAssessmentId
        ? allAssessments.find((item) => item.id === selectedAssessmentId) ?? null
        : null,
    [selectedAssessmentId, allAssessments]
  );

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

  const handleSelectCategory = (category: string | null) => {
    if (category === null) {
      setActiveCategory(null);
      setIsCategoryDrawerMinimized(false);
      return;
    }

    if (activeCategory === category) {
      if (isCategoryDrawerMinimized) {
        setIsCategoryDrawerMinimized(false);
      } else {
        setActiveCategory(null);
        setIsCategoryDrawerMinimized(false);
      }
    } else {
      setActiveCategory(category);
      setIsCategoryDrawerMinimized(false);
      setSelectedAssessmentId(null);
    }
  };

  const handleSelectAssessmentFromList = (assessment: ClinicalAssessmentItem) => {
    setQuery('');
    setAiError(null);
    setSelectedAssessmentId(assessment.id);
    setActiveCategory(assessment.category);
    setIsCategoryDrawerMinimized(true);
    setExpandedIds((prev) => ({
      ...prev,
      [assessment.id]: true,
    }));
    onOpenAssessment?.();
  };

  const handleResetAll = () => {
    setQuery('');
    setAiError(null);
    setSelectedAssessmentId(null);
    setActiveCategory(null);
    setIsCategoryDrawerMinimized(false);
  };

  const handleLookupWithAi = async (rawCondition: string) => {
    const trimmed = rawCondition.trim();
    if (trimmed.length < 2 || isAiLoading) return;

    onOpenAssessment?.();
    setIsAiLoading(true);
    setAiError(null);

    try {
      const generated = await fetchConditionAssessment(trimmed);
      setAiAssessments((prev) => {
        const cached = getAllCachedAiAssessments();
        const combined = new Map<string, ClinicalAssessmentItem>();
        for (const item of prev) combined.set(item.id, item);
        for (const item of cached) combined.set(item.id, item);
        if (generated.id.startsWith('ai-')) {
          combined.set(generated.id, generated);
        }
        return Array.from(combined.values());
      });
      setQuery('');
      setSelectedAssessmentId(generated.id);
      setActiveCategory(generated.category);
      setIsCategoryDrawerMinimized(true);
      setExpandedIds((prev) => ({
        ...prev,
        [generated.id]: true,
      }));
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : 'Unable to generate assessment checklist.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const trimmedQuery = query.trim();
  const hasSearchQuery = trimmedQuery !== '';
  const hasSingleSearchMatch = hasSearchQuery && searchResults.length === 1;
  const hasExactTitleMatch =
    hasSearchQuery &&
    searchResults.some((item) => item.title.toLowerCase() === trimmedQuery.toLowerCase());

  useEffect(() => {
    if (hasSingleSearchMatch) {
      onOpenAssessment?.();
    }
  }, [hasSingleSearchMatch, onOpenAssessment]);

  return (
    <div className="space-y-4">
      {/* Gemini Assessment Error Alert */}
      {aiError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold">Gemini AI Lookup Error</p>
              <p className="mt-0.5 text-amber-900">{aiError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAiError(null)}
            aria-label="Dismiss AI lookup error"
            className="p-1 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Search Bar & Collapsible Quick Categories Panel */}
      <section
        aria-label="Clinical assessment search and Quick Categories"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3.5 sm:p-5 space-y-4"
      >
        {/* 1. Search Input */}
        <div>
          <div className="relative">
            {isAiLoading ? (
              <Loader2
                className="w-5 h-5 text-ambulance-green animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            ) : (
              <Search
                className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            )}
            <input
              id="medspeak-assessment-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedAssessmentId(null);
                if (aiError) setAiError(null);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  trimmedQuery.length >= 2 &&
                  searchResults.length === 0 &&
                  !isAiLoading
                ) {
                  e.preventDefault();
                  void handleLookupWithAi(trimmedQuery);
                }
              }}
              placeholder="Search condition or 999 call-out (e.g. Chest Pain, SOB, Pericarditis)..."
              aria-label="Search condition or 999 call-out presentation"
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50/60 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ambulance-green/30 focus:border-ambulance-green focus:bg-white transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setAiError(null);
                }}
                aria-label="Clear assessment search"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/70 absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Quick Categories (Collapsible Header + Pills, minimised on mobile by default) */}
        <div id="medspeak-assessment-categories" className="pt-3 border-t border-slate-100">
          <div
            onClick={() => setQuickCategoriesMinimized((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-expanded={!quickCategoriesMinimized}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setQuickCategoriesMinimized((prev) => !prev);
              }
            }}
            className={`flex items-center justify-between gap-2 cursor-pointer select-none rounded-lg px-1 py-0.5 hover:bg-slate-50 transition-colors ${
              quickCategoriesMinimized ? '' : 'mb-2.5'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
              <Folder className="w-3.5 h-3.5 shrink-0 text-ambulance-green" aria-hidden="true" />
              <span>Quick Categories</span>
              {quickCategoriesMinimized && (
                <span className="text-[11px] font-medium normal-case text-slate-400">
                  (tap to open)
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              {activeCategory && !quickCategoriesMinimized && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCategory(null);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Close Category
                </button>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border bg-emerald-50 text-ambulance-green border-emerald-200">
                <span>{quickCategoriesMinimized ? 'Open' : 'Minimise'}</span>
                {quickCategoriesMinimized ? (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </span>
            </div>
          </div>

          {!quickCategoriesMinimized && (
            <div
              role="tablist"
              aria-label="Clinical assessment categories"
              className="flex flex-wrap items-center gap-1.5 sm:gap-2"
            >
              {ASSESSMENT_CATEGORIES.map((category) => {
                const isSelected = activeCategory === category;
                const count = assessmentsByCategory[category]?.length ?? 0;

                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCategory(category)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-ambulance-green text-white border-ambulance-green shadow-md ring-2 ring-ambulance-green/25'
                        : 'bg-slate-100/90 text-slate-700 border-slate-200/90 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    {isSelected ? (
                      <FolderOpen
                        className="w-3.5 h-3.5 shrink-0 text-nhs-warmYellow"
                        aria-hidden="true"
                      />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    )}
                    <span>{category}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-bold ${
                        isSelected
                          ? 'bg-black/25 text-white'
                          : 'bg-white text-slate-600 border border-slate-200/80'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Opened Category Call-Out Drawer */}
        {activeCategory && activeCategoryItems.length > 0 && (
          <div
            role="tabpanel"
            aria-label={`${activeCategory} call-outs`}
            className="rounded-xl border border-l-4 overflow-hidden border-emerald-200 bg-emerald-50/50 border-l-ambulance-green"
          >
            {isCategoryDrawerMinimized ? (
              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-emerald-50/90">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0 text-xs sm:text-sm">
                  <FolderOpen
                    className="w-4 h-4 shrink-0 text-ambulance-green"
                    aria-hidden="true"
                  />
                  <span className="font-bold truncate text-emerald-950">{activeCategory}</span>
                  {selectedAssessment && (
                    <>
                      <ChevronRight
                        className="w-3.5 h-3.5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-ambulance-green text-white font-semibold text-xs shadow-sm">
                        <Stethoscope
                          className="w-3 h-3 shrink-0 text-nhs-warmYellow"
                          aria-hidden="true"
                        />
                        {selectedAssessment.title}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCategoryDrawerMinimized(false)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-ambulance-green hover:bg-emerald-100/50 text-xs font-semibold active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  <span>Show all {activeCategoryItems.length}</span>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b bg-emerald-100/70 border-emerald-200/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderOpen
                      className="w-4 h-4 shrink-0 text-ambulance-green"
                      aria-hidden="true"
                    />
                    <h3 className="text-xs sm:text-sm font-bold truncate text-emerald-950">
                      {activeCategory} ({activeCategoryItems.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCategoryDrawerMinimized(true)}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-emerald-300/80 text-ambulance-green text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Minimise</span>
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-3 sm:p-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {activeCategoryItems.map((item) => {
                    const isActiveItem = selectedAssessmentId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectAssessmentFromList(item)}
                        className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all cursor-pointer border ${
                          isActiveItem
                            ? 'bg-ambulance-green text-white border-ambulance-green font-semibold shadow-sm'
                            : 'bg-white border-emerald-200/90 text-slate-800 font-medium shadow-2xs hover:border-ambulance-green hover:shadow-sm'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <Stethoscope
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isActiveItem
                                ? 'text-nhs-warmYellow'
                                : 'text-emerald-600/70 group-hover:text-ambulance-green'
                            }`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.title}</span>
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isActiveItem
                              ? 'text-white translate-x-0.5'
                              : 'text-slate-300 group-hover:text-ambulance-green group-hover:translate-x-0.5'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Main Output Below Search Panel */}
      {isAiLoading ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-white rounded-2xl border border-emerald-200 p-8 text-center max-w-lg mx-auto my-6 shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-ambulance-green flex items-center justify-center mx-auto mb-3 border border-emerald-200">
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Generating pocketbook checklist for &ldquo;{trimmedQuery}&rdquo; with Gemini AI…
          </h2>
        </div>
      ) : hasSearchQuery ? (
        searchResults.length > 0 ? (
          <section aria-label="Matching clinical assessments" className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="text-slate-700">{searchResults.length}</strong>{' '}
                matching {searchResults.length === 1 ? 'assessment' : 'assessments'}
              </span>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-ambulance-green hover:underline font-semibold cursor-pointer"
              >
                Reset Search
              </button>
            </div>

            {searchResults.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                isExpanded={Boolean(expandedIds[assessment.id]) || hasSingleSearchMatch}
                onToggle={handleToggleCard}
              />
            ))}

            {trimmedQuery.length >= 3 && !hasExactTitleMatch && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <span className="text-xs sm:text-sm text-slate-700 font-medium">
                  Want a dedicated checklist specifically for{' '}
                  <strong className="text-slate-900">&ldquo;{trimmedQuery}&rdquo;</strong>?
                </span>
                <button
                  type="button"
                  onClick={() => void handleLookupWithAi(trimmedQuery)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ambulance-green hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Generate with Gemini AI</span>
                </button>
              </div>
            )}
          </section>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No local checklist found for &ldquo;{trimmedQuery}&rdquo;
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Generate its pocketbook Key Questions, Assessments, and Red Flags checklist directly
              with Gemini AI, or check your spelling.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                disabled={trimmedQuery.length < 2 || isAiLoading}
                onClick={() => void handleLookupWithAi(trimmedQuery)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ambulance-green hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Look up &ldquo;{trimmedQuery}&rdquo; with Gemini AI</span>
              </button>

              <button
                type="button"
                onClick={() => setQuery('')}
                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          </div>
        )
      ) : selectedAssessment ? (
        <section aria-label={selectedAssessment.title} className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ambulance-green hover:underline cursor-pointer"
            >
              <span>← Back to all call-outs</span>
            </button>
          </div>

          <AssessmentCard
            assessment={selectedAssessment}
            isExpanded={expandedIds[selectedAssessment.id] ?? true}
            onToggle={handleToggleCard}
          />
        </section>
      ) : activeCategory && activeCategoryItems.length > 0 ? (
        <section aria-label={`${activeCategory} assessments`} className="space-y-3">
          {activeCategoryItems.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              isExpanded={Boolean(expandedIds[assessment.id])}
              onToggle={handleToggleCard}
            />
          ))}
        </section>
      ) : (
        /* Initial Compact Common 999 Call-Outs Grid */
        <section
          aria-label="Common 999 call-outs"
          className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-ambulance-green shrink-0">
                <Stethoscope className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Common 999 Call-Outs
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {allAssessments.length} checklists ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {commonCallOuts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectAssessmentFromList(item)}
                className="group flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-emerald-50/70 hover:border-emerald-300 text-left transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{item.category}</div>
                </div>
                <ChevronRight
                  className="w-4 h-4 text-slate-400 group-hover:text-ambulance-green shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
