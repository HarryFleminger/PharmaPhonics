import React from 'react';
import {
  Search,
  X,
  Loader2,
  Layers,
  Pill,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { quickCategories } from '../data/quickCategories';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
      aria-label="Quick Practice Categories and BNF medication search"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3.5 sm:p-5 mb-5 space-y-3.5"
    >
      {/* 1. Above Search Bar: Horizontally Scrollable Row of Quick Practice Category Pills */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            <Layers className="w-3.5 h-3.5 text-ambulance-green shrink-0" aria-hidden="true" />
            <span>Quick Categories</span>
          </span>
          {activeCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear Category
            </button>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Quick Practice Systemic Categories"
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-ambulance-green text-white border-ambulance-green shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50/60 hover:border-emerald-300 hover:text-emerald-900'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Prominent Debounced Search Input */}
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
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search UK BNF database (type 3+ chars, or pick a category above)..."
          aria-label="Search live UK BNF medications via OpenPrescribing API"
          className="w-full pl-11 pr-10 py-2.5 sm:py-3.5 text-sm sm:text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ambulance-green focus:border-ambulance-green focus:bg-white transition-all"
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

      {/* 3. Below Search Bar: Category Drug List (Minimises automatically when a drug is selected) */}
      {activeCategory && activeCategoryDrugs.length > 0 && (
        <div
          role="tabpanel"
          aria-label={`${activeCategory} medications`}
          className="pt-2.5 border-t border-slate-100"
        >
          {isCategoryMinimized ? (
            /* Minimized Bar: Shows active category + clicked drug, with 1-tap button to re-expand */
            <div className="flex items-center justify-between gap-2 bg-emerald-50/70 border border-emerald-200/90 rounded-xl px-3.5 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5 min-w-0 text-xs sm:text-sm">
                <Pill className="w-4 h-4 text-ambulance-green shrink-0" aria-hidden="true" />
                <span className="font-semibold text-slate-700 truncate">
                  {activeCategory}
                </span>
                {selectedCategoryDrug && (
                  <>
                    <ChevronRight
                      className="w-3.5 h-3.5 text-slate-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-ambulance-green text-white font-bold text-xs">
                      {selectedCategoryDrug}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onToggleMinimizeCategory}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-semibold text-ambulance-green hover:bg-emerald-50 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                <span>Show all {activeCategoryDrugs.length} drugs</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* Expanded Category Drug List */
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 min-w-0">
                  <Pill className="w-4 h-4 text-ambulance-green shrink-0" aria-hidden="true" />
                  <span className="truncate">{activeCategory}</span>
                  <span className="hidden sm:inline text-xs font-normal text-slate-500">
                    — tap a medication to view its flashcard
                  </span>
                </h3>

                <button
                  type="button"
                  onClick={onToggleMinimizeCategory}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-ambulance-green hover:underline cursor-pointer"
                >
                  <span>Minimise list</span>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[260px] sm:max-h-none overflow-y-auto pr-0.5">
                {activeCategoryDrugs.map((drugName) => {
                  const isActiveDrug =
                    searchQuery.trim().toLowerCase() === drugName.toLowerCase();

                  return (
                    <button
                      key={drugName}
                      type="button"
                      onClick={() => onSelectDrug(drugName)}
                      className={`group flex items-center justify-between gap-1.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                        isActiveDrug
                          ? 'bg-emerald-50 border-ambulance-green text-emerald-950 font-semibold ring-1 ring-ambulance-green/40 shadow-sm'
                          : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-400 hover:text-slate-900 hover:shadow-sm'
                      }`}
                    >
                      <span className="truncate">{drugName}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isActiveDrug
                            ? 'text-ambulance-green translate-x-0.5'
                            : 'text-slate-400 group-hover:text-ambulance-green group-hover:translate-x-0.5'
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

      {/* Search Status Summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-0.5">
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
            <span>Tap a Quick Category above or search any UK drug</span>
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
    </section>
  );
};
