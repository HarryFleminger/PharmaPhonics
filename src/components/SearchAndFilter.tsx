import React, { useState } from 'react';
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
  Camera,
} from 'lucide-react';
import { quickCategories } from '../data/quickCategories';
import { PrescriptionUploader } from './PrescriptionUploader';

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
  isToxicityMode?: boolean;
  onUploadActiveChange?: (isActive: boolean) => void;
  highlightUploadButton?: boolean;
  isUploaderOpen?: boolean;
  onSetUploaderOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  isQuickCategoriesMinimized?: boolean;
  onSetQuickCategoriesMinimized?: (minimized: boolean | ((prev: boolean) => boolean)) => void;
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
  isToxicityMode = false,
  onUploadActiveChange,
  highlightUploadButton = false,
  isUploaderOpen,
  onSetUploaderOpen,
  isQuickCategoriesMinimized,
  onSetQuickCategoriesMinimized,
}) => {
  const [internalUploaderOpen, setInternalUploaderOpen] = useState(false);
  const [internalQuickCategoriesMinimized, setInternalQuickCategoriesMinimized] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const uploaderOpen = isUploaderOpen ?? internalUploaderOpen;
  const setUploaderOpen = onSetUploaderOpen ?? setInternalUploaderOpen;
  const quickCategoriesMinimized =
    isQuickCategoriesMinimized ?? internalQuickCategoriesMinimized;
  const setQuickCategoriesMinimized =
    onSetQuickCategoriesMinimized ?? setInternalQuickCategoriesMinimized;

  const trimmedLength = searchQuery.trim().length;
  const activeCategoryDrugs = activeCategory ? quickCategories[activeCategory] ?? [] : [];

  return (
    <section
      aria-label="UK medication search and Quick Categories"
      onDragEnter={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          setUploaderOpen(true);
        }
      }}
      className={`bg-white rounded-2xl shadow-sm border p-3.5 sm:p-5 mb-5 space-y-4 transition-colors ${
        isToxicityMode ? 'border-rose-200' : 'border-slate-200'
      }`}
    >
      {/* 1. Top of Page: Prominent Debounced Search Input + "Upload Prescription / Med List" Button */}
      <div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input (`text-base` = 16px prevents iOS/mobile auto-zoom) */}
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2
                className={`w-5 h-5 animate-spin absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                }`}
                aria-hidden="true"
              />
            ) : (
              <Search
                className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  isToxicityMode ? 'text-rose-400' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
            )}

            <input
              id="medspeak-search-input"
              type="search"
              value={searchQuery}
              onFocus={onSearchInteract}
              onClick={onSearchInteract}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isToxicityMode
                  ? 'Search medication for overdose study (type 3+ chars, or pick a category)...'
                  : 'Search UK medications (type 3+ chars, or pick a category below)...'
              }
              aria-label="Search UK prescribed medications"
              className={`w-full pl-11 pr-10 py-3 sm:py-3.5 text-base bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                isToxicityMode
                  ? 'border-rose-200 focus:ring-rose-600 focus:border-rose-600'
                  : 'border-slate-300 focus:ring-ambulance-green focus:border-ambulance-green'
              }`}
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

          {/* Prominent "Upload Prescription / Med List" Button */}
          <button
            type="button"
            onClick={() => {
              onSearchInteract?.();
              setUploaderOpen((prev) => !prev);
            }}
            aria-expanded={uploaderOpen}
            className={`inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 border transition-all cursor-pointer active:scale-[0.98] shadow-xs ${
              highlightUploadButton ? 'animate-flash-upload' : ''
            } ${
              uploaderOpen
                ? isToxicityMode
                  ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-600/25'
                  : 'bg-ambulance-green text-white border-ambulance-green ring-2 ring-ambulance-green/25'
                : isToxicityMode
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80 hover:border-rose-300'
                : 'bg-emerald-50 text-ambulance-green border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-300'
            }`}
            title="Upload a cropped med list photo or paste an anonymised med list"
          >
            <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Upload Prescription / Med List</span>
          </button>
        </div>

        {/* Search Status Summary */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mt-2 px-0.5">
          <span>
            {trimmedLength > 0 && trimmedLength <= 2 ? (
              <span className="text-amber-700 font-medium">
                Type at least 3 characters to search…
              </span>
            ) : isSearching ? (
              <span
                className={`font-medium ${
                  isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                }`}
              >
                Searching UK medications for &ldquo;{searchQuery.trim()}&rdquo;…
              </span>
            ) : hasActiveQuery ? (
              <span>
                Found <strong className="text-slate-800 font-semibold">{resultCount}</strong> UK
                prescribing {resultCount === 1 ? 'entry' : 'entries'} for{' '}
                <strong className="text-slate-800 font-semibold">
                  &ldquo;{searchQuery.trim()}&rdquo;
                </strong>
              </span>
            ) : (
              <span>
                Search any UK drug above, upload a cropped med list photo, or open a Quick Category
                below
              </span>
            )}
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className={`hover:underline font-medium cursor-pointer shrink-0 ml-2 ${
                isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
              }`}
            >
              Reset Search
            </button>
          )}
        </div>
      </div>

      {/* Expandable Drag-and-Drop & Camera/Photo Prescription Uploader */}
      <div id="medspeak-prescription-uploader">
        <PrescriptionUploader
          isOpen={uploaderOpen}
          onToggleOpen={() => setUploaderOpen((prev) => !prev)}
          onSelectMedication={(drugName) => onSelectDrug(drugName)}
          activeSearchQuery={searchQuery}
          isToxicityMode={isToxicityMode}
          onFirstInteract={onSearchInteract}
          onUploadActiveChange={(isActive) => {
            const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
            setQuickCategoriesMinimized(isActive || isMobileScreen);
            if (isActive && activeCategory) {
              onSelectCategory(null);
            }
            onUploadActiveChange?.(isActive);
          }}
        />
      </div>

      {/* 2. Below Search Bar: Quick Categories (Collapsible Header + Folder Tabs) */}
      <div id="medspeak-quick-categories" className="pt-3 border-t border-slate-100">
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
            <Folder
              className={`w-3.5 h-3.5 shrink-0 ${
                isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
              }`}
              aria-hidden="true"
            />
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
                  onSelectCategory(null);
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Close Category
              </button>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
                isToxicityMode
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-emerald-50 text-ambulance-green border-emerald-200'
              }`}
            >
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
                      ? isToxicityMode
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-600/25'
                        : 'bg-ambulance-green text-white border-ambulance-green shadow-md ring-2 ring-ambulance-green/25'
                      : isToxicityMode
                      ? 'bg-slate-100/90 text-slate-700 border-slate-200/90 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-900'
                      : 'bg-slate-100/90 text-slate-700 border-slate-200/90 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {isSelected ? (
                    <FolderOpen
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
                      }`}
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

      {/* 3. Opened Category Medication Drawer: Visually Distinct Tinted Sub-Panel */}
      {activeCategory && activeCategoryDrugs.length > 0 && (
        <div
          role="tabpanel"
          aria-label={`${activeCategory} medications`}
          className={`rounded-xl border border-l-4 overflow-hidden transition-colors ${
            isToxicityMode
              ? 'border-rose-200 bg-rose-50/50 border-l-rose-600'
              : 'border-emerald-200 bg-emerald-50/50 border-l-ambulance-green'
          }`}
        >
          {isCategoryMinimized ? (
            /* Minimized Drawer Header: Shows active category + clicked drug, with 1-tap button to re-expand */
            <div
              className={`flex items-center justify-between gap-2 px-3.5 py-2.5 ${
                isToxicityMode ? 'bg-rose-50/90' : 'bg-emerald-50/90'
              }`}
            >
              <div className="flex flex-wrap items-center gap-1.5 min-w-0 text-xs sm:text-sm">
                <FolderOpen
                  className={`w-4 h-4 shrink-0 ${
                    isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`font-bold truncate ${
                    isToxicityMode ? 'text-rose-950' : 'text-emerald-950'
                  }`}
                >
                  {activeCategory}
                </span>
                {selectedCategoryDrug && (
                  <>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isToxicityMode ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-white font-semibold text-xs shadow-sm ${
                        isToxicityMode ? 'bg-rose-600' : 'bg-ambulance-green'
                      }`}
                    >
                      <Pill
                        className={`w-3 h-3 shrink-0 ${
                          isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
                        }`}
                        aria-hidden="true"
                      />
                      {selectedCategoryDrug}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={onToggleMinimizeCategory}
                className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border text-xs font-semibold active:scale-[0.98] transition-all shadow-sm cursor-pointer ${
                  isToxicityMode
                    ? 'border-rose-300 text-rose-600 hover:bg-rose-100/50'
                    : 'border-emerald-300 text-ambulance-green hover:bg-emerald-100/50'
                }`}
              >
                <span>Show all {activeCategoryDrugs.length} drugs</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            /* Expanded Category Drawer */
            <div>
              {/* Drawer Top Bar */}
              <div
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 border-b ${
                  isToxicityMode
                    ? 'bg-rose-100/70 border-rose-200/80'
                    : 'bg-emerald-100/70 border-emerald-200/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FolderOpen
                    className={`w-4 h-4 shrink-0 ${
                      isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                    }`}
                    aria-hidden="true"
                  />
                  <h3
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isToxicityMode ? 'text-rose-950' : 'text-emerald-950'
                    }`}
                  >
                    {activeCategory} Medications ({activeCategoryDrugs.length})
                  </h3>
                  <span
                    className={`hidden sm:inline text-xs ${
                      isToxicityMode ? 'text-rose-800/80' : 'text-emerald-800/80'
                    }`}
                  >
                    — select a drug below to open its{' '}
                    {isToxicityMode ? 'Overdose / Tox' : 'study'} flashcard
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onToggleMinimizeCategory}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border text-xs font-semibold transition-colors cursor-pointer ${
                    isToxicityMode
                      ? 'border-rose-300/80 text-rose-600'
                      : 'border-emerald-300/80 text-ambulance-green'
                  }`}
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
                          ? isToxicityMode
                            ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-sm'
                            : 'bg-ambulance-green text-white border-ambulance-green font-semibold shadow-sm'
                          : isToxicityMode
                          ? 'bg-white border-rose-200/90 text-slate-800 font-medium shadow-2xs hover:border-rose-600 hover:shadow-sm'
                          : 'bg-white border-emerald-200/90 text-slate-800 font-medium shadow-2xs hover:border-ambulance-green hover:shadow-sm'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <Pill
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActiveDrug
                              ? isToxicityMode
                                ? 'text-rose-200'
                                : 'text-nhs-warmYellow'
                              : isToxicityMode
                              ? 'text-rose-600/70 group-hover:text-rose-600'
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
                            : isToxicityMode
                            ? 'text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5'
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
