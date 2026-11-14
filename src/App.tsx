import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, SearchX } from 'lucide-react';
import medicationsData from './data/medications.json';
import { Medication, CategoryFilter } from './types/medication';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { MedicationCard } from './components/MedicationCard';

const medications = medicationsData as Medication[];

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [studyMode, setStudyMode] = useState<'grid' | 'deck'>('grid');
  const [deckIndex, setDeckIndex] = useState(0);

  const {
    isSupported,
    ukVoices,
    selectedVoice,
    setSelectedVoiceByName,
    speakingId,
    speed,
    toggleSpeed,
    speak,
  } = useSpeechSynthesis();

  // Instant client-side filtering by drug name, phonetic spelling, class, or indication
  const filteredMedications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return medications.filter((med) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        med.category === selectedCategory ||
        (selectedCategory !== 'Both' && med.category === 'Both');

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const matchesName = med.name.toLowerCase().includes(normalizedQuery);
      const matchesPhonetic = med.phonetic.toLowerCase().includes(normalizedQuery);
      const matchesClass = med.drugClass.toLowerCase().includes(normalizedQuery);
      const matchesIndication = med.indications.some((ind) =>
        ind.toLowerCase().includes(normalizedQuery)
      );
      const matchesNote = med.clinicalNote?.toLowerCase().includes(normalizedQuery) ?? false;

      return (
        matchesName || matchesPhonetic || matchesClass || matchesIndication || matchesNote
      );
    });
  }, [searchQuery, selectedCategory]);

  // Reset single-card deck index when filter results change
  useEffect(() => {
    setDeckIndex(0);
  }, [searchQuery, selectedCategory]);

  const activeDeckCard = filteredMedications[deckIndex] ?? null;

  const handleRandomCard = () => {
    if (filteredMedications.length <= 1) return;
    let nextIdx = deckIndex;
    while (nextIdx === deckIndex) {
      nextIdx = Math.floor(Math.random() * filteredMedications.length);
    }
    setDeckIndex(nextIdx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        isSupported={isSupported}
        ukVoices={ukVoices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoiceByName}
        speed={speed}
        onToggleSpeed={toggleSpeed}
        studyMode={studyMode}
        onToggleStudyMode={() =>
          setStudyMode((prev) => (prev === 'grid' ? 'deck' : 'grid'))
        }
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          totalCount={medications.length}
          filteredCount={filteredMedications.length}
        />

        {filteredMedications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-8 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <SearchX className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">No matching UK medications found</h2>
            <p className="text-sm text-slate-600 mt-1">
              Try searching by UK BNF/rINN name (e.g., <em>Paracetamol</em>,{' '}
              <em>Adrenaline</em>, <em>Furosemide</em>), drug class, or clinical indication.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-ambulance-green text-white text-sm font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Show All Medications
            </button>
          </div>
        ) : studyMode === 'grid' ? (
          /* Responsive Flashcard Grid */
          <section
            aria-label="Medication Flashcards"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {filteredMedications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                isSpeaking={speakingId === med.id}
                onListen={speak}
              />
            ))}
          </section>
        ) : (
          /* Single-Card Focused Deck Mode for Mobile/Tablet Post-Shift Review */
          <section aria-label="Single Flashcard Study Deck" className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Card {deckIndex + 1} of {filteredMedications.length}
              </span>
              <button
                type="button"
                onClick={handleRandomCard}
                disabled={filteredMedications.length <= 1}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ambulance-green hover:underline disabled:opacity-40 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                Shuffle Card
              </button>
            </div>

            {activeDeckCard && (
              <MedicationCard
                medication={activeDeckCard}
                isSpeaking={speakingId === activeDeckCard.id}
                onListen={speak}
              />
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeckIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredMedications.length - 1
                  )
                }
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 hover:bg-slate-100 active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setDeckIndex((prev) =>
                    prev < filteredMedications.length - 1 ? prev + 1 : 0
                  )
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
          <strong>PharmaPhonics</strong> — Uses UK BNF / rINN nomenclature &amp; native{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
            en-GB
          </code>{' '}
          Web Speech synthesis. For educational &amp; pronunciation study only; always consult current
          JRCALC and BNF clinical guidelines in practice.
        </p>
      </footer>
    </div>
  );
}

export default App;
