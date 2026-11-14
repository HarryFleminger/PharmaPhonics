import React from 'react';
import { Volume2, Gauge, Stethoscope, Sparkles } from 'lucide-react';
import { SpeechSpeed } from '../types/medication';

interface HeaderProps {
  isTtsApiKeyConfigured: boolean;
  isGeminiApiKeyConfigured: boolean;
  speed: SpeechSpeed;
  onToggleSpeed: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isTtsApiKeyConfigured,
  isGeminiApiKeyConfigured,
  speed,
  onToggleSpeed,
}) => {
  return (
    <header className="bg-ambulance-green text-white shadow-md sticky top-0 z-30 border-b-4 border-nhs-warmYellow">
      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand & Title */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-nhs-warmYellow" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                  PharmaPhonics
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold bg-white/15 text-emerald-100 border border-white/20 shrink-0">
                  UK BNF / JRCALC
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90">
                Pre-Hospital &amp; NHS Community Medication Study
              </p>
            </div>
          </div>
        </div>

        {/* Voice Status, Gemini Status & Speed Control (wraps to next line on narrow screens) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          {/* Friendly UK Voice Badge */}
          <div
            className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/15"
            title="Powered by Google Cloud Text-to-Speech (British English Neural Voice)"
          >
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nhs-warmYellow shrink-0" aria-hidden="true" />
            <span className="font-medium text-emerald-50">🇬🇧 UK English Voice</span>
            <span
              className={`ml-0.5 inline-block w-2 h-2 rounded-full ${
                isTtsApiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={
                isTtsApiKeyConfigured
                  ? 'VITE_GOOGLE_TTS_API_KEY configured'
                  : 'VITE_GOOGLE_TTS_API_KEY missing in .env.local'
              }
            />
          </div>

          {/* Gemini AI Clinical Pharmacology Status Badge */}
          <div
            className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/15"
            title="Powered by Google Gemini API for JRCALC & BNF Clinical Details"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nhs-warmYellow shrink-0" aria-hidden="true" />
            <span className="font-medium text-emerald-50">Gemini Clinical AI</span>
            <span
              className={`ml-0.5 inline-block w-2 h-2 rounded-full ${
                isGeminiApiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={
                isGeminiApiKeyConfigured
                  ? 'VITE_GEMINI_API_KEY configured'
                  : 'VITE_GEMINI_API_KEY missing in .env.local'
              }
            />
          </div>

          {/* Speech Rate Toggle */}
          <button
            type="button"
            onClick={onToggleSpeed}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer"
            title="Toggle between normal clinical speed (1.0x) and slow phonetic study speed (0.75x)"
          >
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nhs-warmYellow" aria-hidden="true" />
            <span>{speed === 1.0 ? '1.0x Normal' : '0.75x Slow'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
