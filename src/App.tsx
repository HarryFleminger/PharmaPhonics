import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
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
  hasGeminiApiKey,
} from './services/geminiClinicalService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { MedicationCard, MedicationCardSkeleton } from './components/MedicationCard';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [results, setResults] = useState<BnfMedicationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [studyMode, setStudyMode] = useState<'grid' | 'deck'>('grid');
  const [deckIndex, setDeckIndex] = useState(0);

  // Track which flashcards are selected/expanded and their Gemini clinical details state
  const [selectedCardKeys, setSelectedCardKeys] = useState<Record<string, boolean>>({});
  const [clinicalDetailsByKey, setClinicalDetailsByKey] = useState<
    Record<string, GeminiClinicalDetails>
  >({});
  const [clinicalLoadingByKey, setClinicalLoadingByKey] = useState<Record<string, boolean>>({});
  const [clinicalErrorByKey, setClinicalErrorByKey] = useState<Record<string, string | null>>({});

  const {
    isApiKeyConfigured: isTtsApiKeyConfigured,
    voiceName,
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
          setDeckIndex(0);
          setIsSearching(false);
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (!abortController.signal.aborted) {
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
  }, [debouncedQuery]);

  const hasActiveQuery = debouncedQuery.trim().length > 2;
  const activeDeckCard = results[deckIndex] ?? null;

  const handleRandomCard = () => {
    if (results.length <= 1) return;
    let nextIdx = deckIndex;
    while (nextIdx === deckIndex) {
      nextIdx = Math.floor(Math.random() * results.length);
    }
    setDeckIndex(nextIdx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        isTtsApiKeyConfigured={isTtsApiKeyConfigured}
        isGeminiApiKeyConfigured={hasGeminiApiKey()}
        voiceName={voiceName}
        speed={speed}
        onToggleSpeed={toggleSpeed}
        studyMode={studyMode}
        onToggleStudyMode={() =>
          setStudyMode((prev) => (prev === 'grid' ? 'deck' : 'grid'))
        }
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8">
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
          onSearchChange={setSearchQuery}
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
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center max-w-xl mx-auto my-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-ambulance-green border border-emerald-200 flex items-center justify-center mx-auto mb-3.5">
              <BookOpenCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Search the Live UK BNF Database
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
              Type at least <strong>3 characters</strong> above (or tap a Quick BNF Lookup pill) to
              search UK medications. Select any flashcard to generate{' '}
              <strong>Phonetic Spelling, Class, and Clinical Indications</strong> with Gemini AI.
            </p>
          </div>
        ) : results.length === 0 ? (
          /* No Results State */
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No BNF entries found for &ldquo;{debouncedQuery.trim()}&rdquo;
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Check your spelling or try a UK BNF generic name (e.g., <em>Paracetamol</em>,{' '}
              <em>Salbutamol</em>, <em>Furosemide</em>, <em>Amiodarone</em>).
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-ambulance-green text-white text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : studyMode === 'grid' ? (
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
                  onListen={speak}
                />
              );
            })}
          </section>
        ) : (
          /* Single-Card Focused Deck Mode */
          <section aria-label="Single Flashcard Study Deck" className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Card {deckIndex + 1} of {results.length}
              </span>
              <button
                type="button"
                onClick={handleRandomCard}
                disabled={results.length <= 1}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ambulance-green hover:underline disabled:opacity-40 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                Shuffle Card
              </button>
            </div>

            {activeDeckCard && (
              <MedicationCard
                medication={activeDeckCard}
                isSelected={Boolean(selectedCardKeys[getCardKey(activeDeckCard)])}
                onSelect={handleSelectMedication}
                clinicalDetails={clinicalDetailsByKey[getCardKey(activeDeckCard)]}
                isClinicalLoading={Boolean(clinicalLoadingByKey[getCardKey(activeDeckCard)])}
                clinicalError={clinicalErrorByKey[getCardKey(activeDeckCard)]}
                onRetryClinical={loadClinicalDetailsForMedication}
                isAudioLoading={audioLoadingId === activeDeckCard.id}
                isSpeaking={speakingId === activeDeckCard.id}
                onListen={speak}
              />
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeckIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
                }
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 hover:bg-slate-100 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeckIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
                }
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-ambulance-green text-white font-semibold hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <span>Next Card</span>
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
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
          , Google Gemini AI, &amp; Google Cloud Text-to-Speech (
          <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
            {voiceName}
          </code>
          ).
        </p>
      </footer>
    </div>
  );
}

export default App;
