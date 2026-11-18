import React from 'react';
import { Volume2, Stethoscope, Sparkles, Skull, HelpCircle } from 'lucide-react';

interface HeaderProps {
  isTtsApiKeyConfigured: boolean;
  isGeminiApiKeyConfigured: boolean;
  isToxicityMode: boolean;
  onToggleToxicityMode: () => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isTtsApiKeyConfigured,
  isGeminiApiKeyConfigured,
  isToxicityMode,
  onToggleToxicityMode,
  onOpenGuide,
}) => {
  return (
    <header
      className={`text-white shadow-md sticky top-0 z-30 border-b-4 transition-colors duration-200 ${
        isToxicityMode
          ? 'bg-rose-700 border-rose-300'
          : 'bg-ambulance-green border-nhs-warmYellow'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand & Title */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              {isToxicityMode ? (
                <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200" aria-hidden="true" />
              ) : (
                <Stethoscope
                  className="w-5 h-5 sm:w-6 sm:h-6 text-nhs-warmYellow"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                  MedSpeak
                </h1>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold border shrink-0 ${
                    isToxicityMode
                      ? 'bg-rose-900/60 text-rose-100 border-rose-300/40'
                      : 'bg-white/15 text-emerald-100 border-white/20'
                  }`}
                >
                  {isToxicityMode ? 'TOXICITY / OVERDOSE MODE' : 'UK BNF'}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm ${
                  isToxicityMode ? 'text-rose-100/90' : 'text-emerald-100/90'
                }`}
              >
                {isToxicityMode
                  ? 'Pre-Hospital Overdose & Toxbase Study Assessment'
                  : 'Pre-Hospital & NHS Community Medication Study'}
              </p>
            </div>
          </div>
        </div>

        {/* Prominent Toxicity Mode Toggle + Voice Status, Gemini Status & Speed Control */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
          {/* Prominent Toxicity Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleToxicityMode}
            aria-pressed={isToxicityMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-sm border ${
              isToxicityMode
                ? 'bg-white text-rose-700 border-white ring-2 ring-rose-300 hover:bg-rose-50'
                : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/70'
            }`}
            title="Toggle Toxicity Mode for pre-hospital overdose calculator and Toxbase/JRCALC assessment"
          >
            <Skull
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                isToxicityMode ? 'text-rose-600' : 'text-white'
              }`}
              aria-hidden="true"
            />
            <span>{isToxicityMode ? 'Toxicity Mode: ON' : 'Toxicity Mode'}</span>
          </button>

          {/* Friendly UK Voice Badge */}
          <div
            className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/15"
            title="Powered by Google Cloud Text-to-Speech (British English Neural Voice)"
          >
            <Volume2
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
              }`}
              aria-hidden="true"
            />
            <span className="font-medium text-white/95">🇬🇧 UK English Voice</span>
            <span
              className={`ml-0.5 inline-block w-2 h-2 rounded-full ${
                isTtsApiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={
                isTtsApiKeyConfigured
                  ? 'GOOGLE_TTS_API_KEY configured on server'
                  : 'GOOGLE_TTS_API_KEY missing in server environment'
              }
            />
          </div>

          {/* Gemini AI Clinical Pharmacology Status Badge */}
          <div
            className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 sm:py-1.5 rounded-lg border border-white/15"
            title="Powered by Google Gemini API for UK BNF Clinical Details"
          >
            <Sparkles
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
              }`}
              aria-hidden="true"
            />
            <span className="font-medium text-white/95">
              {isToxicityMode ? 'Gemini Tox AI' : 'Gemini Clinical AI'}
            </span>
            <span
              className={`ml-0.5 inline-block w-2 h-2 rounded-full ${
                isGeminiApiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={
                isGeminiApiKeyConfigured
                  ? 'GEMINI_API_KEY configured on server'
                  : 'GEMINI_API_KEY missing in server environment'
              }
            />
          </div>

          {/* Reopen Welcome / Guide Page Button */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer"
              title="Open MedSpeak Welcome Guide & Feature Overview"
            >
              <HelpCircle
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
                }`}
                aria-hidden="true"
              />
              <span>Guide</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
