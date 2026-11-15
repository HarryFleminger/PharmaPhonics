import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SearchX,
  AlertCircle,
  X,
  BookOpenCheck,
} from 'lucide-react';
import { BnfMedicationItem, GeminiClinicalDetails } from './types/medication';
import { useDebounce } from './hooks/useDebounce';
import { searchOpenPrescribingBnf } from './services/openPrescribingService';
import {
  fetchMedicationClinicalDetails,
  getCachedClinicalDetails,
  hasGeminiApiKey,
} from './services/geminiClinicalService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { MedicationCard, MedicationCardSkeleton } from './components/MedicationCard';
import { NoticeModal } from './components/NoticeModal';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  // No category is pre-applied when the page opens; user clicks a category pill to open it
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoryMinimized, setIsCategoryMinimized] = useState(false);
  const [selectedCategoryDrug, setSelectedCategoryDrug] = useState<string | null>(null);

  // First-time warning modals state
  const [hasSeenJrcalcWarning, setHasSeenJrcalcWarning] = useState(false);
  const [isJrcalcModalOpen, setIsJrcalcModalOpen] = useState(false);

  const [hasSeenVoiceNotice, setHasSeenVoiceNotice] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [pendingSpeech, setPendingSpeech] = useState<{ id: string; name: string } | null>(
    null
  );

  const debouncedQuery = useDebounce(searchQuery, 400);

  const [results, setResults] = useState<BnfMedicationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Track whether the search was triggered by clicking a Quick Category drug
  // so we can automatically expand and fetch Gemini clinical details for the top matching card
  const autoExpandNextResultRef = useRef(false);

  // Track which flashcards are selected/expanded and their Gemini clinical details state
  const [selectedCardKeys, setSelectedCardKeys] = useState<Record<string, boolean>>({});
  const [clinicalDetailsByKey, setClinicalDetailsByKey] = useState<
    Record<string, GeminiClinicalDetails>
  >({});
  const [clinicalLoadingByKey, setClinicalLoadingByKey] = useState<Record<string, boolean>>({});
  const [clinicalErrorByKey, setClinicalErrorByKey] = useState<Record<string, string | null>>({});

  const {
    isApiKeyConfigured: isTtsApiKeyConfigured,
    loadingId: audioLoadingId,
    speakingId,
    error: ttsError,
    clearError: clearTtsError,
    speed,
    toggleSpeed,
    speak,
  } = useSpeechSynthesis();

  const getCardKey = (item: BnfMedicationItem) => `${item.id}::${item.name}`;

  const loadClinicalDetailsForMedication = useCallback(async (item: BnfMedicationItem) => {
    const cardKey = `${item.id}::${item.name}`;

    // If already stored in persistent localStorage cache, resolve immediately without loading spinner
    const cached = getCachedClinicalDetails(item.name);
    if (cached) {
      setClinicalDetailsByKey((prev) => ({ ...prev, [cardKey]: cached }));
      setClinicalLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
      setClinicalErrorByKey((prev) => ({ ...prev, [cardKey]: null }));
      return;
    }

    setClinicalLoadingByKey((prev) => ({ ...prev, [cardKey]: true }));
    setClinicalErrorByKey((prev) => ({ ...prev, [cardKey]: null }));

    try {
      const details = await fetchMedicationClinicalDetails(item.name);
      setClinicalDetailsByKey((prev) => ({ ...prev, [cardKey]: details }));
      setClinicalLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
    } catch (error) {
      console.error(`Error loading clinical details for "${item.name}":`, error);
      const message =
        error instanceof Error ? error.message : 'Unable to generate clinical details.';
      setClinicalLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
      setClinicalErrorByKey((prev) => ({ ...prev, [cardKey]: message }));
    }
  }, []);

  const handleSelectMedication = useCallback(
    (item: BnfMedicationItem) => {
      const cardKey = getCardKey(item);
      const willBeSelected = !selectedCardKeys[cardKey];

      setSelectedCardKeys((prev) => ({
        ...prev,
        [cardKey]: willBeSelected,
      }));

      if (
        willBeSelected &&
        !clinicalDetailsByKey[cardKey] &&
        !clinicalLoadingByKey[cardKey]
      ) {
        void loadClinicalDetailsForMedication(item);
      }
    },
    [
      selectedCardKeys,
      clinicalDetailsByKey,
      clinicalLoadingByKey,
      loadClinicalDetailsForMedication,
    ]
  );

  // Clicking a category pill in the top row:
  // - Shows a first-time JRCALC+ warning pop-up when "JRCALC Core Emergency" is selected
  // - If clicking a different category: open it expanded
  // - If clicking the same category while minimized: re-expand it
  // - If clicking the same category while already expanded: close it
  const handleSelectCategory = useCallback(
    (category: string | null) => {
      if (category === null) {
        setActiveCategory(null);
        setIsCategoryMinimized(false);
        setSelectedCategoryDrug(null);
        return;
      }

      if (category === 'JRCALC Core Emergency' && !hasSeenJrcalcWarning) {
        setHasSeenJrcalcWarning(true);
        setIsJrcalcModalOpen(true);
      }

      if (activeCategory === category) {
        if (isCategoryMinimized) {
          setIsCategoryMinimized(false);
        } else {
          setActiveCategory(null);
          setIsCategoryMinimized(false);
        }
      } else {
        setActiveCategory(category);
        setIsCategoryMinimized(false);
      }
    },
    [activeCategory, isCategoryMinimized, hasSeenJrcalcWarning]
  );

  // Clicking the "Listen" voice button on a medication card:
  // - The first time a user clicks any voice button, show a pop-up explaining that
  //   all pronunciations are reasonable approximations, not inherently definitive/correct.
  const handleListenClick = useCallback(
    (id: string, name: string) => {
      if (!hasSeenVoiceNotice) {
        setHasSeenVoiceNotice(true);
        setPendingSpeech({ id, name });
        setIsVoiceModalOpen(true);
        return;
      }

      void speak(id, name);
    },
    [hasSeenVoiceNotice, speak]
  );

  const handleConfirmVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(false);
    if (pendingSpeech) {
      void speak(pendingSpeech.id, pendingSpeech.name);
      setPendingSpeech(null);
    }
  }, [pendingSpeech, speak]);

  const handleCloseVoiceModal = useCallback(() => {
    setIsVoiceModalOpen(false);
    setPendingSpeech(null);
  }, []);

  // Clicking a drug inside a category list:
  // - Records the selected drug, minimizes the category list so flashcards are visible below,
  //   and triggers the OpenPrescribing + Gemini fetch flow
  const handleSelectCategoryDrug = useCallback((drugName: string) => {
    autoExpandNextResultRef.current = true;
    setSelectedCategoryDrug(drugName);
    setIsCategoryMinimized(true);
    setSearchQuery(drugName);
  }, []);

  // Fetch live UK BNF records from OpenPrescribing after 400ms debounce when input length > 2
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length <= 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const abortController = new AbortController();
    setIsSearching(true);
    setSearchError(null);

    searchOpenPrescribingBnf(trimmed, abortController.signal)
      .then((items) => {
        if (!abortController.signal.aborted) {
          setResults(items);
          setIsSearching(false);

          // If the user clicked a drug from Quick Categories, automatically
          // select the first returned BNF card to trigger the Gemini clinical details fetch
          if (autoExpandNextResultRef.current && items.length > 0) {
            autoExpandNextResultRef.current = false;
            const firstItem = items[0];
            const firstKey = getCardKey(firstItem);
            setSelectedCardKeys((prev) => ({ ...prev, [firstKey]: true }));
            void loadClinicalDetailsForMedication(firstItem);
          }
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!abortController.signal.aborted) {
          autoExpandNextResultRef.current = false;
          setSearchError(
            err instanceof Error
              ? err.message
              : 'Unable to fetch UK BNF medications from OpenPrescribing.'
          );
          setResults([]);
          setIsSearching(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, loadClinicalDetailsForMedication]);

  const hasActiveQuery = debouncedQuery.trim().length > 2;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* First-Time JRCALC Core Emergency Clinical Disclaimer Modal */}
      <NoticeModal
        isOpen={isJrcalcModalOpen}
        variant="clinical-warning"
        title="JRCALC Clinical Disclaimer"
        message="Practitioners must always check JRCALC+ (or local Trust clinical guidelines) for use on the road. Do not make any clinical decisions based on the information on this app — it is for learning purposes only."
        confirmLabel="I Understand"
        onConfirm={() => setIsJrcalcModalOpen(false)}
      />

      {/* First-Time Voice Pronunciation Notice Modal */}
      <NoticeModal
        isOpen={isVoiceModalOpen}
        variant="pronunciation-notice"
        title="Pronunciation Notice"
        message="Please note that all pronunciations in this app are reasonable approximations for study, but are not inherently definitive or guaranteed to be correct in every clinical setting."
        confirmLabel="Got It, Play Audio"
        onConfirm={handleConfirmVoiceModal}
        onClose={handleCloseVoiceModal}
      />

      <Header
        isTtsApiKeyConfigured={isTtsApiKeyConfigured}
        isGeminiApiKeyConfigured={hasGeminiApiKey()}
        speed={speed}
        onToggleSpeed={toggleSpeed}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 py-4 sm:px-6 sm:py-8">
        {/* Google Cloud TTS Error Alert */}
        {ttsError && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Audio Synthesis Error</p>
                <p className="mt-0.5 text-red-800">{ttsError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearTtsError}
              aria-label="Dismiss audio error"
              className="p-1 rounded-lg text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* OpenPrescribing Search Error Alert */}
        {searchError && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">OpenPrescribing BNF Search Error</p>
                <p className="mt-0.5 text-amber-900">{searchError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSearchError(null)}
              aria-label="Dismiss search error"
              className="p-1 rounded-lg text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (!q.trim()) {
              setSelectedCategoryDrug(null);
            }
          }}
          activeCategory={activeCategory}
          isCategoryMinimized={isCategoryMinimized}
          selectedCategoryDrug={selectedCategoryDrug}
          onSelectCategory={handleSelectCategory}
          onToggleMinimizeCategory={() => setIsCategoryMinimized((prev) => !prev)}
          onSelectDrug={handleSelectCategoryDrug}
          isSearching={isSearching}
          resultCount={results.length}
          hasActiveQuery={hasActiveQuery}
        />

        {/* Loading Skeleton State while OpenPrescribing API Fetches */}
        {isSearching ? (
          <section
            aria-label="Loading BNF search results"
            aria-busy="true"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <MedicationCardSkeleton key={idx} />
            ))}
          </section>
        ) : !hasActiveQuery ? (
          /* Initial Prompt State before >2 chars are entered */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center max-w-xl mx-auto my-4 sm:my-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-ambulance-green border border-emerald-200 flex items-center justify-center mx-auto mb-3.5">
              <BookOpenCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Search the Live UK BNF Database
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
              Tap one of the <strong>Quick Categories</strong> above to browse UK study
              medications, or type at least <strong>3 characters</strong> in the search bar to load
              flashcards and on-scene clinical notes.
            </p>
          </div>
        ) : results.length === 0 ? (
          /* No Results State */
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center max-w-lg mx-auto my-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No BNF entries found for &ldquo;{debouncedQuery.trim()}&rdquo;
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Check your spelling or select a drug from the Quick Categories above.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-ambulance-green text-white text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* Responsive Flashcard Grid */
          <section
            aria-label="OpenPrescribing BNF Medication Flashcards"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start"
          >
            {results.map((item) => {
              const cardKey = getCardKey(item);
              return (
                <MedicationCard
                  key={cardKey}
                  medication={item}
                  isSelected={Boolean(selectedCardKeys[cardKey])}
                  onSelect={handleSelectMedication}
                  clinicalDetails={clinicalDetailsByKey[cardKey]}
                  isClinicalLoading={Boolean(clinicalLoadingByKey[cardKey])}
                  clinicalError={clinicalErrorByKey[cardKey]}
                  onRetryClinical={loadClinicalDetailsForMedication}
                  isAudioLoading={audioLoadingId === item.id}
                  isSpeaking={speakingId === item.id}
                  onListen={handleListenClick}
                />
              );
            })}
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-center text-xs text-slate-500">
        <p>
          <strong>PharmaPhonics</strong> — Powered by{' '}
          <a
            href="https://openprescribing.net/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ambulance-green hover:underline font-medium"
          >
            OpenPrescribing BNF API
          </a>
          , Google Gemini AI, &amp; Google Cloud Text-to-Speech (UK English Voice).
        </p>
      </footer>
    </div>
  );
}

export default App;
