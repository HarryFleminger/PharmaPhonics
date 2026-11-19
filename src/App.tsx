import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SearchX,
  AlertCircle,
  X,
  BookOpenCheck,
  Skull,
  Search,
  Camera,
  FolderOpen,
} from 'lucide-react';
import {
  BnfMedicationItem,
  GeminiClinicalDetails,
  GeminiToxicityDetails,
} from './types/medication';
import { useDebounce } from './hooks/useDebounce';
import { searchOpenPrescribingBnf } from './services/openPrescribingService';
import {
  fetchMedicationClinicalDetails,
  fetchMedicationToxicityDetails,
  fetchServerHealthStatus,
  getCachedClinicalDetails,
  getCachedToxicityDetails,
} from './services/geminiClinicalService';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import {
  ToxCalculator,
  ToxCalculatorValues,
  computeToxDoseMetrics,
  detectPreferredToxUnit,
} from './components/ToxCalculator';
import { MedicationCard, MedicationCardSkeleton } from './components/MedicationCard';
import { NoticeModal } from './components/NoticeModal';
import { WelcomePage } from './components/WelcomePage';

const PRESCRIPTION_FEATURE_STORAGE_KEY = 'medspeak_seen_prescription_feature_v1';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  // No category is pre-applied when the page opens; user clicks a category pill to open it
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoryMinimized, setIsCategoryMinimized] = useState(false);
  const [selectedCategoryDrug, setSelectedCategoryDrug] = useState<string | null>(null);

  // Toxicity Mode state & Tox Calculator inputs
  const [isToxicityMode, setIsToxicityMode] = useState(false);
  const [isToxCalculatorMinimized, setIsToxCalculatorMinimized] = useState(false);
  const [toxCalculatorValues, setToxCalculatorValues] = useState<ToxCalculatorValues>({
    dosePerPillMg: '',
    numberOfPills: '',
    patientWeightKg: '',
    unit: 'mg',
  });

  // On-demand Guide page & first-time warning modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('welcome') === '1';
    } catch {
      return false;
    }
  });

  const [isNewFeatureModalOpen, setIsNewFeatureModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      return window.localStorage.getItem(PRESCRIPTION_FEATURE_STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [highlightUploadButton, setHighlightUploadButton] = useState(false);

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
  // so we can automatically expand and fetch Gemini details for the top matching card
  const autoExpandNextResultRef = useRef(false);

  // Track which flashcards are selected/expanded
  const [selectedCardKeys, setSelectedCardKeys] = useState<Record<string, boolean>>({});

  // Standard Mode clinical details state
  const [clinicalDetailsByKey, setClinicalDetailsByKey] = useState<
    Record<string, GeminiClinicalDetails>
  >({});
  const [clinicalLoadingByKey, setClinicalLoadingByKey] = useState<Record<string, boolean>>({});
  const [clinicalErrorByKey, setClinicalErrorByKey] = useState<Record<string, string | null>>({});

  // Toxicity Mode overdose details state
  const [toxicityDetailsByKey, setToxicityDetailsByKey] = useState<
    Record<string, GeminiToxicityDetails>
  >({});
  const [toxicityLoadingByKey, setToxicityLoadingByKey] = useState<Record<string, boolean>>({});
  const [toxicityErrorByKey, setToxicityErrorByKey] = useState<Record<string, string | null>>({});

  // Server API key status (populated via GET /api/health without exposing keys to the browser)
  const [serverHealth, setServerHealth] = useState({
    geminiConfigured: true,
    ttsConfigured: true,
  });

  useEffect(() => {
    void fetchServerHealthStatus().then((status) => {
      setServerHealth(status);
    });
  }, []);

  const {
    loadingId: audioLoadingId,
    speakingId,
    error: ttsError,
    clearError: clearTtsError,
    speak,
  } = useSpeechSynthesis();

  const getCardKey = (item: BnfMedicationItem) => `${item.id}::${item.name}`;

  const loadClinicalDetailsForMedication = useCallback(async (item: BnfMedicationItem) => {
    const cardKey = `${item.id}::${item.name}`;

    // If already stored in pre-generated bundle or persistent localStorage cache, resolve immediately
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

  const loadToxicityDetailsForMedication = useCallback(async (item: BnfMedicationItem) => {
    const cardKey = `${item.id}::${item.name}`;

    // If already stored in pre-generated bundle or persistent localStorage toxicity cache, resolve immediately
    const cached = getCachedToxicityDetails(item.name);
    if (cached) {
      const preferredUnit = detectPreferredToxUnit(item.name, cached.toxicThreshold);
      setToxCalculatorValues((prev) =>
        prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
      );
      setToxicityDetailsByKey((prev) => ({ ...prev, [cardKey]: cached }));
      setToxicityLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
      setToxicityErrorByKey((prev) => ({ ...prev, [cardKey]: null }));
      return;
    }

    setToxicityLoadingByKey((prev) => ({ ...prev, [cardKey]: true }));
    setToxicityErrorByKey((prev) => ({ ...prev, [cardKey]: null }));

    try {
      const details = await fetchMedicationToxicityDetails(item.name);
      const preferredUnit = detectPreferredToxUnit(item.name, details.toxicThreshold);
      setToxCalculatorValues((prev) =>
        prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
      );
      setToxicityDetailsByKey((prev) => ({ ...prev, [cardKey]: details }));
      setToxicityLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
    } catch (error) {
      console.error(`Error loading toxicity details for "${item.name}":`, error);
      const message =
        error instanceof Error ? error.message : 'Unable to generate overdose details.';
      setToxicityLoadingByKey((prev) => ({ ...prev, [cardKey]: false }));
      setToxicityErrorByKey((prev) => ({ ...prev, [cardKey]: message }));
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

      if (willBeSelected) {
        const existingTox = toxicityDetailsByKey[cardKey] ?? getCachedToxicityDetails(item.name);
        const preferredUnit = detectPreferredToxUnit(item.name, existingTox?.toxicThreshold);
        setToxCalculatorValues((prev) =>
          prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
        );

        if (isToxicityMode) {
          if (!toxicityDetailsByKey[cardKey] && !toxicityLoadingByKey[cardKey]) {
            void loadToxicityDetailsForMedication(item);
          }
        } else {
          if (!clinicalDetailsByKey[cardKey] && !clinicalLoadingByKey[cardKey]) {
            void loadClinicalDetailsForMedication(item);
          }
        }
      }
    },
    [
      selectedCardKeys,
      isToxicityMode,
      clinicalDetailsByKey,
      clinicalLoadingByKey,
      toxicityDetailsByKey,
      toxicityLoadingByKey,
      loadClinicalDetailsForMedication,
      loadToxicityDetailsForMedication,
    ]
  );

  // Requirement 4 (State Logic):
  // If the user toggles Toxicity Mode on/off while one or more drugs are currently selected,
  // automatically fetch the data for those selected drugs using the appropriate standard or tox prompt.
  const handleToggleToxicityMode = useCallback(() => {
    const nextToxMode = !isToxicityMode;
    setIsToxicityMode(nextToxMode);

    results.forEach((item) => {
      const cardKey = getCardKey(item);
      if (selectedCardKeys[cardKey]) {
        const existingTox = toxicityDetailsByKey[cardKey] ?? getCachedToxicityDetails(item.name);
        if (existingTox) {
          const preferredUnit = detectPreferredToxUnit(item.name, existingTox.toxicThreshold);
          setToxCalculatorValues((prev) =>
            prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
          );
        }
        if (nextToxMode) {
          if (!toxicityDetailsByKey[cardKey] && !toxicityLoadingByKey[cardKey]) {
            void loadToxicityDetailsForMedication(item);
          }
        } else {
          if (!clinicalDetailsByKey[cardKey] && !clinicalLoadingByKey[cardKey]) {
            void loadClinicalDetailsForMedication(item);
          }
        }
      }
    });
  }, [
    isToxicityMode,
    results,
    selectedCardKeys,
    toxicityDetailsByKey,
    toxicityLoadingByKey,
    clinicalDetailsByKey,
    clinicalLoadingByKey,
    loadToxicityDetailsForMedication,
    loadClinicalDetailsForMedication,
  ]);

  const handleDismissNewFeatureModal = useCallback(() => {
    setIsNewFeatureModalOpen(false);
    try {
      window.localStorage?.setItem(PRESCRIPTION_FEATURE_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
    setHighlightUploadButton(true);
    window.setTimeout(() => {
      setHighlightUploadButton(false);
    }, 3400);
  }, []);

  // Triggers the first-time JRCALC+ / Clinical Disclaimer warning modal
  // whenever the user first interacts with ANY Quick Category or the search bar
  const triggerFirstTimeClinicalWarning = useCallback(() => {
    if (!hasSeenJrcalcWarning) {
      setHasSeenJrcalcWarning(true);
      setIsJrcalcModalOpen(true);
    }
  }, [hasSeenJrcalcWarning]);

  // Clicking a category pill in the top row:
  // - Shows the first-time JRCALC+ clinical warning pop-up when any category is first selected
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

      triggerFirstTimeClinicalWarning();

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
    [activeCategory, isCategoryMinimized, triggerFirstTimeClinicalWarning]
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

  // Keep a ref to current isToxicityMode so the search effect always uses the latest mode
  const isToxicityModeRef = useRef(isToxicityMode);
  useEffect(() => {
    isToxicityModeRef.current = isToxicityMode;
  }, [isToxicityMode]);

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
          // select the first returned BNF card and fetch the active mode's details
          if (autoExpandNextResultRef.current && items.length > 0) {
            autoExpandNextResultRef.current = false;
            const firstItem = items[0];
            const firstKey = getCardKey(firstItem);
            setSelectedCardKeys((prev) => ({ ...prev, [firstKey]: true }));
            const existingTox = getCachedToxicityDetails(firstItem.name);
            const preferredUnit = detectPreferredToxUnit(
              firstItem.name,
              existingTox?.toxicThreshold
            );
            setToxCalculatorValues((prev) =>
              prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
            );
            if (isToxicityModeRef.current) {
              void loadToxicityDetailsForMedication(firstItem);
            } else {
              void loadClinicalDetailsForMedication(firstItem);
            }
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
  }, [debouncedQuery, loadClinicalDetailsForMedication, loadToxicityDetailsForMedication]);

  const hasActiveQuery = debouncedQuery.trim().length > 2;
  const toxCalculatedMetrics = computeToxDoseMetrics(toxCalculatorValues);

  if (isGuideOpen) {
    return <WelcomePage onClose={() => setIsGuideOpen(false)} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col text-slate-900 transition-colors duration-200 ${
        isToxicityMode ? 'bg-rose-50/40' : 'bg-slate-50'
      }`}
    >
      {/* One-Time "New Feature" Prescription Upload Announcement Modal */}
      <NoticeModal
        isOpen={isNewFeatureModalOpen}
        variant="new-feature"
        title="Scan Prescriptions & Repeat Med Lists"
        message="You can now upload a photo or screenshot of a prescription or repeat medication list to scan multiple drugs at once — complete with a holistic summary of likely patient conditions, on-scene considerations, and drug interaction risks."
        confirmLabel="Got It"
        onConfirm={handleDismissNewFeatureModal}
        onClose={handleDismissNewFeatureModal}
      />

      {/* First-Time JRCALC Clinical Disclaimer Modal */}
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
        message="Please note that all pronunciations in this app are reasonable for study, but are not inherently definitive or guaranteed to be correct"
        confirmLabel="Got It, Play Audio"
        onConfirm={handleConfirmVoiceModal}
        onClose={handleCloseVoiceModal}
      />

      <Header
        isTtsApiKeyConfigured={serverHealth.ttsConfigured}
        isGeminiApiKeyConfigured={serverHealth.geminiConfigured}
        isToxicityMode={isToxicityMode}
        onToggleToxicityMode={handleToggleToxicityMode}
        onOpenGuide={() => setIsGuideOpen(true)}
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
          onSearchInteract={triggerFirstTimeClinicalWarning}
          onSearchChange={(q) => {
            triggerFirstTimeClinicalWarning();
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
          isToxicityMode={isToxicityMode}
          highlightUploadButton={highlightUploadButton}
          onUploadActiveChange={(isActive) => {
            setIsToxCalculatorMinimized(isActive);
          }}
        />

        {/* Requirement 2: Tox Calculator Card displayed above clinical details when Toxicity Mode is active */}
        {isToxicityMode && (
          <ToxCalculator
            values={toxCalculatorValues}
            onChange={setToxCalculatorValues}
            isMinimized={isToxCalculatorMinimized}
            onToggleMinimized={() => setIsToxCalculatorMinimized((prev) => !prev)}
          />
        )}

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
          <div
            className={`bg-white rounded-2xl border p-6 sm:p-8 max-w-2xl mx-auto my-4 sm:my-6 shadow-sm ${
              isToxicityMode ? 'border-rose-200' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col items-center text-center mb-5">
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 ${
                  isToxicityMode
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-emerald-50 text-ambulance-green border-emerald-200'
                }`}
              >
                {isToxicityMode ? (
                  <Skull className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <BookOpenCheck className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {isToxicityMode
                  ? 'Toxicity Mode: Assess Overdose Doses & Effects'
                  : 'How to Use MedSpeak'}
              </h2>
            </div>

            <ul className="space-y-2.5 text-left max-w-lg mx-auto">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isToxicityMode
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-ambulance-green'
                  }`}
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong className="text-slate-900">Search</strong> — look up any UK drug for
                  essential on-scene context, indications, and pronunciation.
                </span>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isToxicityMode
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-ambulance-green'
                  }`}
                >
                  <Camera className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong className="text-slate-900">Upload</strong> — snap or upload a photo of a
                  patient’s medication list for an instant holistic overview.
                </span>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isToxicityMode
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-ambulance-green'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong className="text-slate-900">Quick Categories</strong> — tap any category
                  above to browse commonly encountered emergency and community drugs.
                </span>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                  <Skull className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong className="text-rose-900">Toxicity Mode</strong> — switch on Toxicity
                  Mode at the top to calculate ingested doses and view toxic thresholds and effects.
                </span>
              </li>
            </ul>
          </div>
        ) : results.length === 0 ? (
          /* No Results State */
          <div
            className={`bg-white rounded-2xl border p-8 sm:p-10 text-center max-w-lg mx-auto my-6 shadow-sm ${
              isToxicityMode ? 'border-rose-200' : 'border-slate-200'
            }`}
          >
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
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors cursor-pointer ${
                isToxicityMode
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-ambulance-green hover:bg-emerald-800'
              }`}
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
                  isToxicityMode={isToxicityMode}
                  toxicityDetails={toxicityDetailsByKey[cardKey]}
                  isToxicityLoading={Boolean(toxicityLoadingByKey[cardKey])}
                  toxicityError={toxicityErrorByKey[cardKey]}
                  onRetryToxicity={loadToxicityDetailsForMedication}
                  toxCalculatedMetrics={toxCalculatedMetrics}
                  onToggleToxUnit={() =>
                    setToxCalculatorValues((prev) => ({
                      ...prev,
                      unit: prev.unit === 'mg' ? 'mcg' : 'mg',
                    }))
                  }
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
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>
            <strong>MedSpeak</strong> — Powered by{' '}
            <a
              href="https://openprescribing.net/api/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline font-medium ${
                isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
              }`}
            >
              OpenPrescribing BNF API
            </a>
            , Google Gemini AI, &amp; Google Cloud Text-to-Speech (UK English Voice).
          </span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className={`hover:underline font-semibold cursor-pointer ${
              isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
            }`}
          >
            Welcome Guide
          </button>
        </p>
      </footer>
    </div>
  );
}

export default App;
