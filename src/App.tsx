import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SearchX,
  AlertCircle,
  X,
  Sparkles,
  Pill,
  Stethoscope,
} from 'lucide-react';
import {
  BnfMedicationItem,
  BrandProductGroup,
  GeminiClinicalDetails,
  GeminiToxicityDetails,
} from './types/medication';
import { useDebounce } from './hooks/useDebounce';
import { searchMedicationsWithBrandHierarchy } from './services/openPrescribingService';
import {
  fetchBrandProductBreakdown,
  fetchMedicationClinicalDetails,
  fetchMedicationToxicityDetails,
  fetchServerHealthStatus,
  getCachedClinicalDetails,
  getCachedToxicityDetails,
} from './services/geminiClinicalService';
import { buildBrandGroupFromResolution } from './data/brandProducts';
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
import { BrandProductGroupCard, getBrandGroupDomId } from './components/BrandProductGroupCard';
import { NoticeModal } from './components/NoticeModal';
import { WelcomePage } from './components/WelcomePage';
import { AssessmentView } from './components/AssessmentView';
import { HowToUseCard } from './components/HowToUseCard';

const PRESCRIPTION_FEATURE_STORAGE_KEY = 'medspeak_seen_prescription_feature_v1';

export function App() {
  const [activeSection, setActiveSection] = useState<'medications' | 'assessments'>('medications');
  const [searchQuery, setSearchQuery] = useState('');
  // No category is pre-applied when the page opens; user clicks a category pill to open it
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCategoryMinimized, setIsCategoryMinimized] = useState(false);
  const [selectedCategoryDrug, setSelectedCategoryDrug] = useState<string | null>(null);

  // Search panel UI states (controlled from App so How to Use MedSpeak buttons can open/focus them)
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isQuickCategoriesMinimized, setIsQuickCategoriesMinimized] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });
  const [isAssessmentCategoriesMinimized, setIsAssessmentCategoriesMinimized] = useState<boolean>(
    () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth < 768;
    }
  );

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

  const [brandGroups, setBrandGroups] = useState<BrandProductGroup[]>([]);
  const [results, setResults] = useState<BnfMedicationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAiBrandLookupLoading, setIsAiBrandLookupLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Track whether the search was triggered by clicking a Quick Category drug
  // so we can automatically expand and fetch Gemini details for the top matching card
  const autoExpandNextResultRef = useRef(false);
  const pendingScrollTargetRef = useRef<{ query: string; brandGroupId?: string } | null>(null);
  const [scrollTriggerCount, setScrollTriggerCount] = useState(0);

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

  // Triggers the first-time JRCALC+ / Clinical Disclaimer warning modal
  // only the first time a drug's clinical or overdose details are opened
  const triggerFirstTimeClinicalWarning = useCallback(() => {
    if (!hasSeenJrcalcWarning) {
      setHasSeenJrcalcWarning(true);
      setIsJrcalcModalOpen(true);
    }
  }, [hasSeenJrcalcWarning]);

  const handleSelectMedication = useCallback(
    (item: BnfMedicationItem) => {
      const cardKey = getCardKey(item);
      const willBeSelected = !selectedCardKeys[cardKey];

      setSelectedCardKeys((prev) => ({
        ...prev,
        [cardKey]: willBeSelected,
      }));

      if (willBeSelected) {
        triggerFirstTimeClinicalWarning();

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
      triggerFirstTimeClinicalWarning,
    ]
  );

  // Requirement 4 (State Logic):
  // If the user toggles Toxicity Mode on/off from a drug card, ensure that drug card is
  // expanded and automatically fetch the data for all selected drugs using the appropriate prompt.
  const handleToggleToxicityMode = useCallback(
    (clickedMedication?: BnfMedicationItem) => {
      const nextToxMode = !isToxicityMode;
      setIsToxicityMode(nextToxMode);

      const nextSelectedKeys = { ...selectedCardKeys };
      if (clickedMedication) {
        triggerFirstTimeClinicalWarning();
        nextSelectedKeys[getCardKey(clickedMedication)] = true;
        setSelectedCardKeys(nextSelectedKeys);
      }

      const combinedItems = [...brandGroups.flatMap((g) => g.constituents), ...results];
      const seenToggleKeys = new Set<string>();

      combinedItems.forEach((item) => {
        const cardKey = getCardKey(item);
        if (seenToggleKeys.has(cardKey)) return;
        seenToggleKeys.add(cardKey);

        if (nextSelectedKeys[cardKey]) {
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
    },
    [
      isToxicityMode,
      brandGroups,
      results,
      selectedCardKeys,
      toxicityDetailsByKey,
      toxicityLoadingByKey,
      clinicalDetailsByKey,
      clinicalLoadingByKey,
      loadToxicityDetailsForMedication,
      loadClinicalDetailsForMedication,
      triggerFirstTimeClinicalWarning,
    ]
  );

  const handleExpandAllConstituents = useCallback(
    (group: BrandProductGroup, expand: boolean) => {
      if (expand) {
        triggerFirstTimeClinicalWarning();
      }

      setSelectedCardKeys((prev) => {
        const next = { ...prev };
        group.constituents.forEach((item) => {
          next[getCardKey(item)] = expand;
        });
        return next;
      });

      if (expand) {
        group.constituents.forEach((item) => {
          const cardKey = getCardKey(item);
          const existingTox = toxicityDetailsByKey[cardKey] ?? getCachedToxicityDetails(item.name);
          if (existingTox) {
            const preferredUnit = detectPreferredToxUnit(item.name, existingTox.toxicThreshold);
            setToxCalculatorValues((prev) =>
              prev.unit === preferredUnit ? prev : { ...prev, unit: preferredUnit }
            );
          }
          if (isToxicityMode) {
            if (!toxicityDetailsByKey[cardKey] && !toxicityLoadingByKey[cardKey]) {
              void loadToxicityDetailsForMedication(item);
            }
          } else {
            if (!clinicalDetailsByKey[cardKey] && !clinicalLoadingByKey[cardKey]) {
              void loadClinicalDetailsForMedication(item);
            }
          }
        });
      }
    },
    [
      triggerFirstTimeClinicalWarning,
      toxicityDetailsByKey,
      clinicalDetailsByKey,
      clinicalLoadingByKey,
      toxicityLoadingByKey,
      isToxicityMode,
      loadClinicalDetailsForMedication,
      loadToxicityDetailsForMedication,
    ]
  );

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

  // Clicking a category pill in the top row:
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
      setSearchQuery('');
      setSelectedCategoryDrug(null);
    },
    [activeCategory, isCategoryMinimized]
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

  // Clicking a drug inside a category list or extracted prescription pill:
  // - Triggers the first-time JRCALC clinical disclaimer if not yet seen,
  //   records the selected drug, minimizes the category list, and opens the flashcard
  const handleSelectCategoryDrug = useCallback(
    (drugName: string, options?: { scrollToResults?: boolean; brandGroupId?: string }) => {
      triggerFirstTimeClinicalWarning();
      autoExpandNextResultRef.current = true;
      setSelectedCategoryDrug(drugName);
      setIsCategoryMinimized(true);
      setSearchQuery(drugName);
      if (options?.scrollToResults) {
        pendingScrollTargetRef.current = {
          query: drugName.trim().toLowerCase(),
          brandGroupId: options.brandGroupId,
        };
        setScrollTriggerCount((prev) => prev + 1);
      }
    },
    [triggerFirstTimeClinicalWarning]
  );

  // Allows looking up a brand-name, combination, or unlisted medication via Gemini AI
  // even if it is not yet in the local UK BNF index
  const handleLookupCustomDrugWithAi = useCallback(async () => {
    const raw = debouncedQuery.trim();
    if (!raw) return;

    triggerFirstTimeClinicalWarning();
    setIsAiBrandLookupLoading(true);

    try {
      const resolution = await fetchBrandProductBreakdown(raw);
      const isMultiOrAliasBrand =
        resolution.isBrandOrCombination &&
        resolution.constituents.length > 0 &&
        (resolution.constituents.length > 1 ||
          resolution.constituents[0].toLowerCase() !== raw.toLowerCase());

      if (isMultiOrAliasBrand) {
        const brandGroup = buildBrandGroupFromResolution(
          resolution.productName,
          resolution.constituents,
          resolution.subtitle
        );
        setBrandGroups([brandGroup]);
        setResults([]);
        setSelectedCardKeys((prev) => {
          const next = { ...prev };
          brandGroup.constituents.forEach((item) => {
            next[getCardKey(item)] = true;
          });
          return next;
        });

        brandGroup.constituents.forEach((item) => {
          if (isToxicityMode) {
            void loadToxicityDetailsForMedication(item);
          } else {
            void loadClinicalDetailsForMedication(item);
          }
        });
        return;
      }
    } catch {
      // Fall back to standard direct single-drug lookup if brand breakdown cannot resolve
    } finally {
      setIsAiBrandLookupLoading(false);
    }

    const formattedName = raw.charAt(0).toUpperCase() + raw.slice(1);
    const customItem: BnfMedicationItem = {
      id: 'CUSTOM-LOOKUP',
      name: formattedName,
      type: 'AI Direct Lookup',
    };
    const cardKey = getCardKey(customItem);

    setBrandGroups([]);
    setResults([customItem]);
    setSelectedCardKeys((prev) => ({ ...prev, [cardKey]: true }));

    if (isToxicityMode) {
      void loadToxicityDetailsForMedication(customItem);
    } else {
      void loadClinicalDetailsForMedication(customItem);
    }
  }, [
    debouncedQuery,
    isToxicityMode,
    loadClinicalDetailsForMedication,
    loadToxicityDetailsForMedication,
    triggerFirstTimeClinicalWarning,
  ]);

  // Keep a ref to current isToxicityMode so the search effect always uses the latest mode
  const isToxicityModeRef = useRef(isToxicityMode);
  useEffect(() => {
    isToxicityModeRef.current = isToxicityMode;
  }, [isToxicityMode]);

  // Fetch live UK BNF records (and expand matching UK brands) after 400ms debounce when input length > 2
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length <= 2) {
      setBrandGroups([]);
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    const abortController = new AbortController();
    setIsSearching(true);
    setSearchError(null);

    searchMedicationsWithBrandHierarchy(trimmed, abortController.signal)
      .then((outcome) => {
        if (!abortController.signal.aborted) {
          setBrandGroups(outcome.brandGroups);
          setResults(outcome.standaloneItems);
          setIsSearching(false);

          // If the user clicked a drug from Quick Categories or Upload/Paste Med List,
          // automatically select the first matching card unless showing a multi-drug brand hierarchy
          if (autoExpandNextResultRef.current) {
            autoExpandNextResultRef.current = false;
            const shouldAutoExpandFirst =
              outcome.standaloneItems.length > 0 ||
              (outcome.brandGroups.length === 1 &&
                outcome.brandGroups[0].constituents.length === 1);
            const firstItem =
              outcome.standaloneItems[0] ?? outcome.brandGroups[0]?.constituents[0];
            if (shouldAutoExpandFirst && firstItem) {
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
          setBrandGroups([]);
          setResults([]);
          setIsSearching(false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery, loadClinicalDetailsForMedication, loadToxicityDetailsForMedication]);

  useEffect(() => {
    const pending = pendingScrollTargetRef.current;
    if (!pending || isSearching) return;
    if (debouncedQuery.trim().toLowerCase() !== pending.query) return;

    pendingScrollTargetRef.current = null;
    const frameId = requestAnimationFrame(() => {
      const targetEl =
        (pending.brandGroupId
          ? document.getElementById(getBrandGroupDomId(pending.brandGroupId))
          : null) ??
        (brandGroups[0] ? document.getElementById(getBrandGroupDomId(brandGroups[0].id)) : null) ??
        document.getElementById('medspeak-results-section');

      if (targetEl && typeof window !== 'undefined') {
        const headerEl = document.querySelector('header');
        const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 0;
        const targetTop = Math.max(
          0,
          window.scrollY + targetEl.getBoundingClientRect().top - headerHeight - 12
        );
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [brandGroups, results, isSearching, debouncedQuery, scrollTriggerCount]);

  const hasActiveQuery = debouncedQuery.trim().length > 2;
  const totalResultCount =
    brandGroups.reduce((sum, group) => sum + group.constituents.length, 0) + results.length;
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
        isGeminiApiKeyConfigured={serverHealth.geminiConfigured}
        isToxicityMode={activeSection === 'medications' && isToxicityMode}
        onExitToxicityMode={() => setIsToxicityMode(false)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      <main
        className={`flex-1 max-w-6xl w-full mx-auto px-3.5 py-4 sm:px-6 sm:py-8 ${
          activeSection === 'medications' && searchQuery !== ''
            ? 'min-h-[calc(100vh+4rem)]'
            : ''
        }`}
      >
        {/* Top-Level Section Switcher: Medications | Assessments */}
        <nav
          aria-label="MedSpeak section switcher"
          className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-200/75 border border-slate-200/90 max-w-md mx-auto mb-5"
        >
          <button
            type="button"
            onClick={() => setActiveSection('medications')}
            aria-pressed={activeSection === 'medications'}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
              activeSection === 'medications'
                ? isToxicityMode
                  ? 'bg-white text-rose-700 shadow-sm font-bold'
                  : 'bg-white text-ambulance-green shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Pill className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Medications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('assessments')}
            aria-pressed={activeSection === 'assessments'}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${
              activeSection === 'assessments'
                ? 'bg-white text-ambulance-green shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            <Stethoscope className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Assessments</span>
          </button>
        </nav>

        {activeSection === 'medications' ? (
          <>
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
            if ((searchQuery === '' || selectedCategoryDrug !== null) && q !== '') {
              setSelectedCardKeys({});
            }
            setSearchQuery(q);
            setSelectedCategoryDrug(null);
          }}
          activeCategory={activeCategory}
          isCategoryMinimized={isCategoryMinimized}
          selectedCategoryDrug={selectedCategoryDrug}
          onSelectCategory={handleSelectCategory}
          onToggleMinimizeCategory={() => setIsCategoryMinimized((prev) => !prev)}
          onSelectDrug={handleSelectCategoryDrug}
          isSearching={isSearching || isAiBrandLookupLoading}
          resultCount={totalResultCount}
          hasActiveQuery={hasActiveQuery}
          isToxicityMode={isToxicityMode}
          highlightUploadButton={highlightUploadButton}
          isUploaderOpen={isUploaderOpen}
          onSetUploaderOpen={setIsUploaderOpen}
          isQuickCategoriesMinimized={isQuickCategoriesMinimized}
          onSetQuickCategoriesMinimized={setIsQuickCategoriesMinimized}
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
        {isSearching || isAiBrandLookupLoading ? (
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
          <HowToUseCard
            isToxicityMode={isToxicityMode}
            onClickSearchDrugs={() => {
              setActiveSection('medications');
              requestAnimationFrame(() => {
                const input = document.getElementById(
                  'medspeak-search-input'
                ) as HTMLInputElement | null;
                input?.focus();
                input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              });
            }}
            onClickUploadMedList={() => {
              setActiveSection('medications');
              setIsUploaderOpen(true);
              requestAnimationFrame(() => {
                const uploader =
                  document.getElementById('medspeak-prescription-uploader') ??
                  document.getElementById('medspeak-search-input');
                uploader?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              });
            }}
            onClickQuickCategories={() => {
              setIsQuickCategoriesMinimized(false);
              requestAnimationFrame(() => {
                const categoriesEl = document.getElementById('medspeak-quick-categories');
                categoriesEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              });
            }}
            onClickAssessments={() => {
              setActiveSection('assessments');
              requestAnimationFrame(() => {
                const input = document.getElementById(
                  'medspeak-assessment-search'
                ) as HTMLInputElement | null;
                input?.focus();
                input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              });
            }}
            onClickToxicityMode={() => {
              const willBeTox = !isToxicityMode;
              handleToggleToxicityMode();
              if (willBeTox) {
                setIsToxCalculatorMinimized(false);
                requestAnimationFrame(() => {
                  const input = document.getElementById(
                    'medspeak-search-input'
                  ) as HTMLInputElement | null;
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }
            }}
          />
        ) : brandGroups.length === 0 && results.length === 0 ? (
          /* No Local BNF Match State — Offer 1-Tap Direct Gemini AI Lookup */
          <div
            className={`bg-white rounded-2xl border p-8 sm:p-10 text-center max-w-lg mx-auto my-6 shadow-sm ${
              isToxicityMode ? 'border-rose-200' : 'border-slate-200'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              No local BNF entry found for &ldquo;{debouncedQuery.trim()}&rdquo;
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              If this is a new medication or a brand name, you can generate its{' '}
              {isToxicityMode ? 'overdose & toxicity' : 'clinical & phonetic'} flashcard directly
              with Gemini AI, or check your spelling.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => void handleLookupCustomDrugWithAi()}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-[0.98] ${
                  isToxicityMode
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-ambulance-green hover:bg-emerald-800'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Look up &ldquo;{debouncedQuery.trim()}&rdquo; with Gemini AI</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          /* Brand Product Hierarchy Groups + Responsive Standalone Flashcard Grid */
          <div id="medspeak-results-section" className="space-y-6">
            {brandGroups.length > 0 && (
              <section
                aria-label="Brand and combination product active ingredients"
                className="space-y-5"
              >
                {brandGroups.map((group) => (
                  <BrandProductGroupCard
                    key={group.id}
                    group={group}
                    getCardKey={getCardKey}
                    selectedCardKeys={selectedCardKeys}
                    onSelectMedication={handleSelectMedication}
                    onExpandAllConstituents={handleExpandAllConstituents}
                    clinicalDetailsByKey={clinicalDetailsByKey}
                    clinicalLoadingByKey={clinicalLoadingByKey}
                    clinicalErrorByKey={clinicalErrorByKey}
                    onRetryClinical={loadClinicalDetailsForMedication}
                    isToxicityMode={isToxicityMode}
                    onToggleToxicityMode={handleToggleToxicityMode}
                    toxicityDetailsByKey={toxicityDetailsByKey}
                    toxicityLoadingByKey={toxicityLoadingByKey}
                    toxicityErrorByKey={toxicityErrorByKey}
                    onRetryToxicity={loadToxicityDetailsForMedication}
                    toxCalculatedMetrics={toxCalculatedMetrics}
                    onToggleToxUnit={() =>
                      setToxCalculatorValues((prev) => ({
                        ...prev,
                        unit: prev.unit === 'mg' ? 'mcg' : 'mg',
                      }))
                    }
                    audioLoadingId={audioLoadingId}
                    speakingId={speakingId}
                    onListen={handleListenClick}
                  />
                ))}
              </section>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                {brandGroups.length > 0 && (
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                    Other Matching UK BNF Entries
                  </h3>
                )}
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
                        onToggleToxicityMode={handleToggleToxicityMode}
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
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <>
            <AssessmentView
              onOpenAssessment={triggerFirstTimeClinicalWarning}
              isQuickCategoriesMinimized={isAssessmentCategoriesMinimized}
              onSetQuickCategoriesMinimized={setIsAssessmentCategoriesMinimized}
            />
            <HowToUseCard
              isToxicityMode={false}
              onClickSearchDrugs={() => {
                setActiveSection('medications');
                requestAnimationFrame(() => {
                  const input = document.getElementById(
                    'medspeak-search-input'
                  ) as HTMLInputElement | null;
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }}
              onClickUploadMedList={() => {
                setActiveSection('medications');
                setIsUploaderOpen(true);
                requestAnimationFrame(() => {
                  const uploader =
                    document.getElementById('medspeak-prescription-uploader') ??
                    document.getElementById('medspeak-search-input');
                  uploader?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }}
              onClickQuickCategories={() => {
                setIsAssessmentCategoriesMinimized(false);
                requestAnimationFrame(() => {
                  const categoriesEl = document.getElementById(
                    'medspeak-assessment-categories'
                  );
                  categoriesEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }}
              onClickAssessments={() => {
                requestAnimationFrame(() => {
                  const input = document.getElementById(
                    'medspeak-assessment-search'
                  ) as HTMLInputElement | null;
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }}
              onClickToxicityMode={() => {
                setActiveSection('medications');
                if (!isToxicityMode) {
                  handleToggleToxicityMode();
                }
                setIsToxCalculatorMinimized(false);
                requestAnimationFrame(() => {
                  const input = document.getElementById(
                    'medspeak-search-input'
                  ) as HTMLInputElement | null;
                  input?.focus();
                  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
              }}
            />
          </>
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
                activeSection === 'medications' && isToxicityMode
                  ? 'text-rose-600'
                  : 'text-ambulance-green'
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
              activeSection === 'medications' && isToxicityMode
                ? 'text-rose-600'
                : 'text-ambulance-green'
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
