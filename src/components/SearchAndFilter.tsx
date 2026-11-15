import React from 'react';
import {
  Search,
  X,
  Loader2,
  FolderOpen,
  Folder,
  Pill,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { quickCategories } from '../data/quickCategories';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchInteract?: () => void;
  activeCategory: string | null;
  isCategoryMinimized: boolean;
  selectedCategoryDrug: string | null;
  onSelectCategory: (category: string | null) => void;
  onToggleMinimizeCategory: () => void;
  onSelectDrug: (drugName: string) => void;
  isSearching: boolean;
  resultCount: number;
  hasActiveQuery: boolean;
}

const categoryNames = Object.keys(quickCategories);

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  onSearchInteract,
  activeCategory,
  isCategoryMinimized,
  selectedCategoryDrug,
  onSelectCategory,
  onToggleMinimizeCategory,
  onSelectDrug,
  isSearching,
  resultCount,
  hasActiveQuery,
}) => {
  const trimmedLength = searchQuery.trim().length;
  const activeCategoryDrugs = activeCategory ? quickCategories[activeCategory] ?? [] : [];

  return (
    <section
      aria-label="BNF medication search and Quick Categories"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3.5 sm:p-5 mb-5 space-y-4"
    >
      {/* 1. Top of Page: Prominent Debounced Search Input (`text-base` = 16px prevents iOS/mobile auto-zoom) */}
      <div>
        <div className="relative">
          {isSearching ? (
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
            type="search"
            value={searchQuery}
            onFocus={onSearchInteract}
            onClick={onSearchInteract}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search UK BNF database (type 3+ chars, or pick a category below)..."
            aria-label="Search live UK BNF medications via OpenPrescribing API"
            className="w-full pl-11 pr-10 py-3 sm:py-3.5 text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ambulance-green focus:border-ambulance-green focus:bg-white transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Status Summary */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mt-2 px-0.5">
          <span>
            {trimmedLength > 0 && trimmedLength <= 2 ? (
              <span className="text-amber-700 font-medium">
                Type at least 3 characters to search…
              </span>
            ) : isSearching ? (
              <span className="text-ambulance-green font-medium">
                Fetching BNF records for &ldquo;{searchQuery.trim()}&rdquo;…
              </span>
            ) : hasActiveQuery ? (
              <span>
                Found <strong className="text-slate-800 font-semibold">{resultCount}</strong> BNF{' '}
                {resultCount === 1 ? 'entry' : 'entries'} for{' '}
                <strong className="text-slate-800 font-semibold">
                  &ldquo;{searchQuery.trim()}&rdquo;
                </strong>
              </span>
            ) : (
              <span>Search any UK drug above or open a Quick Category folder below</span>
            )}
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-ambulance-green hover:underline font-medium cursor-pointer shrink-0 ml-2"
            >
              Reset Search
            </button>
          )}
        </div>
      </div>

      {/* 2. Below Search Bar: Quick Categories (Styled as Folder Tabs / Rounded Pills) */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            <Folder className="w-3.5 h-3.5 text-ambulance-green shrink-0" aria-hidden="true" />
            <span>Quick Categories</span>
          </span>
          {activeCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Close Category
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Quick Categories"
          className="flex flex-wrap items-center gap-1.5 sm:gap-2"
        >
          {categoryNames.map((category) => {
            const isSelected = activeCategory === category;
            const count = quickCategories[category]?.length ?? 0;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(category)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-ambulance-green text-white border-ambulance-green shadow-md ring-2 ring-ambulance-green/25'
                    : 'bg-slate-100/90 text-slate-700 border-slate-200/90 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {isSelected ? (
                  <FolderOpen className="w-3.5 h-3.5 text-nhs-warmYellow shrink-0" aria-hidden="true" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                )}
                <span>{category}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-bold ${
                    isSelected
                      ? 'bg-black/25 text-emerald-50'
                      : 'bg-white text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Opened Category Medication Drawer: Visually Distinct Tinted Sub-Panel */}
      {activeCategory && activeCategoryDrugs.length > 0 && (
        <div
          role="tabpanel"
          aria-label={`${activeCategory} medications`}
          className="rounded-xl border border-emerald-200 bg-emerald-50/50 border-l-4 border-l-ambulance-green overflow-hidden"
        >
          {isCategoryMinimized ? (
            /* Minimized Drawer Header: Shows active category + clicked drug, with 1-tap button to re-expand */
            <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-emerald-50/90">
              <div className="flex flex-wrap items-center gap-1.5 min-w-0 text-xs sm:text-sm">
                <FolderOpen className="w-4 h-4 text-ambulance-green shrink-0" aria-hidden="true" />
                <span className="font-bold text-emerald-950 truncate">{activeCategory}</span>
                {selectedCategoryDrug && (
                  <>
                    <ChevronRight
                      className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-ambulance-green text-white font-semibold text-xs shadow-sm">
                      <Pill className="w-3 h-3 text-nhs-warmYellow shrink-0" aria-hidden="true" />
                      {selectedCategoryDrug}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onToggleMinimizeCategory}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-ambulance-green hover:bg-emerald-100/50 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                <span>Show all {activeCategoryDrugs.length} drugs</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* Expanded Category Drawer */
            <div>
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-emerald-100/70 border-b border-emerald-200/80">
                <div className="flex items-center gap-2 min-w-0">
                  <FolderOpen
                    className="w-4 h-4 text-ambulance-green shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="text-xs sm:text-sm font-bold text-emerald-950 truncate">
                    {activeCategory} Medications ({activeCategoryDrugs.length})
                  </h3>
                  <span className="hidden sm:inline text-xs text-emerald-800/80">
                    — select a drug below to open its BNF flashcard
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onToggleMinimizeCategory}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-emerald-300/80 text-xs font-semibold text-ambulance-green transition-colors cursor-pointer"
                >
                  <span>Minimise</span>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Distinct Drug Cards Grid inside the Drawer */}
              <div className="p-3 sm:p-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[260px] sm:max-h-none overflow-y-auto">
                {activeCategoryDrugs.map((drugName) => {
                  const isActiveDrug =
                    searchQuery.trim().toLowerCase() === drugName.toLowerCase();

                  return (
                    <button
                      key={drugName}
                      type="button"
                      onClick={() => onSelectDrug(drugName)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all cursor-pointer border ${
                        isActiveDrug
                          ? 'bg-ambulance-green text-white border-ambulance-green font-semibold shadow-sm'
                          : 'bg-white border-emerald-200/90 text-slate-800 font-medium shadow-2xs hover:border-ambulance-green hover:shadow-sm'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <Pill
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActiveDrug
                              ? 'text-nhs-warmYellow'
                              : 'text-emerald-600/70 group-hover:text-ambulance-green'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{drugName}</span>
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActiveDrug
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
  );
};
