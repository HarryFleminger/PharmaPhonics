import React from 'react';
import { Search, X, Loader2, Sparkles } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching: boolean;
  resultCount: number;
  hasActiveQuery: boolean;
}

const QUICK_SEARCH_TERMS = [
  'Paracetamol',
  'Salbutamol',
  'Amiodarone',
  'Furosemide',
  'Ondansetron',
  'Atorvastatin',
  'Amlodipine',
  'Lansoprazole',
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  isSearching,
  resultCount,
  hasActiveQuery,
}) => {
  const trimmedLength = searchQuery.trim().length;

  return (
    <section
      aria-label="OpenPrescribing BNF live medication search"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6"
    >
      {/* Prominent Debounced Search Input */}
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
          placeholder="Search live UK BNF database (type 3+ characters, e.g. Salbutamol, Amiodarone)..."
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

      {/* Quick-Search Suggestions & Live Search Status Row */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Quick BNF Lookup:
          </span>
          {QUICK_SEARCH_TERMS.map((term) => {
            const isSelected = searchQuery.trim().toLowerCase() === term.toLowerCase();
            return (
              <button
                key={term}
                type="button"
                onClick={() => onSearchChange(term)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ambulance-green text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {term}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm text-slate-500 shrink-0">
          {trimmedLength > 0 && trimmedLength <= 2 ? (
            <span className="text-amber-700 font-medium">
              Type at least 3 characters to search…
            </span>
          ) : isSearching ? (
            <span className="text-ambulance-green font-medium">
              Fetching BNF records…
            </span>
          ) : hasActiveQuery ? (
            <span>
              Found <strong className="text-slate-800 font-semibold">{resultCount}</strong> BNF{' '}
              {resultCount === 1 ? 'entry' : 'entries'}
            </span>
          ) : (
            <span>Live OpenPrescribing BNF API (400ms debounce)</span>
          )}
        </div>
      </div>
    </section>
  );
};
