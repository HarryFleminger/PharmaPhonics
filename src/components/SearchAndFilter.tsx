import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { CategoryFilter } from '../types/medication';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: 'All Drugs', value: 'All' },
  { label: 'JRCALC Pre-Hospital', value: 'JRCALC Pre-Hospital' },
  { label: 'NHS Community', value: 'NHS Community' },
  { label: 'Dual (Both)', value: 'Both' },
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
  filteredCount,
}) => {
  return (
    <section
      aria-label="Medication search and category filters"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6"
    >
      {/* Prominent Search Input */}
      <div className="relative">
        <Search
          className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by UK drug name, class, or indication (e.g. Salbutamol, statin, asthma, AF)..."
          aria-label="Search medications by drug name, class, or indication"
          className="w-full pl-11 pr-10 py-3 sm:py-3.5 text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ambulance-green focus:border-ambulance-green focus:bg-white transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills & Result Summary */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            Formulary:
          </span>
          {CATEGORIES.map(({ label, value }) => {
            const isActive = selectedCategory === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onCategoryChange(value)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-ambulance-green text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs sm:text-sm text-slate-500">
          <span>
            Showing <strong className="text-slate-800 font-semibold">{filteredCount}</strong> of{' '}
            {totalCount} medications
          </span>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('All');
              }}
              className="text-ambulance-green hover:underline font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
