import React from 'react';
import { Volume2, Gauge, Stethoscope, Layers, LayoutGrid } from 'lucide-react';
import { SpeechSpeed } from '../types/medication';

interface HeaderProps {
  isApiKeyConfigured: boolean;
  voiceName: string;
  speed: SpeechSpeed;
  onToggleSpeed: () => void;
  studyMode: 'grid' | 'deck';
  onToggleStudyMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isApiKeyConfigured,
  voiceName,
  speed,
  onToggleSpeed,
  studyMode,
  onToggleStudyMode,
}) => {
  return (
    <header className="bg-ambulance-green text-white shadow-md sticky top-0 z-30 border-b-4 border-nhs-warmYellow">
      <div className="max-w-6xl mx-auto px-4 py-3.5 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-nhs-warmYellow" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">PharmaPhonics</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white/15 text-emerald-100 border border-white/20">
                  UK BNF / JRCALC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90">
                Pre-Hospital &amp; NHS Community Medication Pronunciation Study
              </p>
            </div>
          </div>
        </div>

        {/* Voice Status & Study Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm">
          {/* Google Cloud TTS British Neural Voice Badge */}
          <div
            className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/15"
            title="Powered by Google Cloud Text-to-Speech API (British Neural2 Voice)"
          >
            <Volume2 className="w-4 h-4 text-nhs-warmYellow shrink-0" aria-hidden="true" />
            <span className="font-medium text-emerald-50">
              🇬🇧 {voiceName}
            </span>
            <span
              className={`ml-1 inline-block w-2 h-2 rounded-full ${
                isApiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={
                isApiKeyConfigured
                  ? 'VITE_GOOGLE_TTS_API_KEY configured'
                  : 'VITE_GOOGLE_TTS_API_KEY missing in .env.local'
              }
            />
          </div>

          {/* Speech Rate Toggle */}
          <button
            type="button"
            onClick={onToggleSpeed}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer"
            title="Toggle between normal clinical speed (1.0x) and slow phonetic study speed (0.75x)"
          >
            <Gauge className="w-4 h-4 text-nhs-warmYellow" aria-hidden="true" />
            <span>{speed === 1.0 ? '1.0x Normal' : '0.75x Slow'}</span>
          </button>

          {/* Grid vs Single-Card Study Deck Mode */}
          <button
            type="button"
            onClick={onToggleStudyMode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer ml-auto sm:ml-0"
            title="Switch between Flashcard Grid and Single-Card Focus Deck"
          >
            {studyMode === 'grid' ? (
              <>
                <Layers className="w-4 h-4 text-nhs-warmYellow" aria-hidden="true" />
                <span>Deck Mode</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4 text-nhs-warmYellow" aria-hidden="true" />
                <span>Grid View</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
