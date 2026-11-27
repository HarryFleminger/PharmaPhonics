import React, { useEffect, useState } from 'react';
import { Stethoscope, Sparkles, Skull, HelpCircle, X } from 'lucide-react';

interface HeaderProps {
  isGeminiApiKeyConfigured: boolean;
  isToxicityMode: boolean;
  onExitToxicityMode?: () => void;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isGeminiApiKeyConfigured,
  isToxicityMode,
  onExitToxicityMode,
  onOpenGuide,
}) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 2);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`text-white shadow-md z-30 border-b-4 transition-colors duration-200 ${
        isAtTop ? 'sticky top-0' : 'md:sticky md:top-0'
      } ${
        isToxicityMode
          ? 'bg-rose-700 border-rose-300'
          : 'bg-ambulance-green border-nhs-warmYellow'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3.5 py-2.5 sm:px-6 sm:py-3.5 flex items-start sm:items-center gap-2.5 sm:gap-3">
        {/* Left Brand Icon */}
        <div className="p-1.5 sm:p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          {isToxicityMode ? (
            <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200" aria-hidden="true" />
          ) : (
            <Stethoscope
              className="w-5 h-5 sm:w-6 sm:h-6 text-nhs-warmYellow"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Right Column: Title, Subtitle & Action Badges (aligned on the same left edge on mobile) */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                MedSpeak
              </h1>
              {isToxicityMode && onExitToxicityMode ? (
                <button
                  type="button"
                  onClick={onExitToxicityMode}
                  aria-label="Exit Toxicity / Overdose Mode"
                  title="Click to exit Toxicity Mode and return to standard clinical mode"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold border shrink-0 bg-rose-900/60 hover:bg-rose-950/80 text-rose-100 border-rose-300/40 transition-colors cursor-pointer"
                >
                  <span>TOXICITY / OVERDOSE MODE</span>
                  <X className="w-3 h-3 text-rose-200 shrink-0" aria-hidden="true" />
                </button>
              ) : (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-semibold border shrink-0 ${
                    isToxicityMode
                      ? 'bg-rose-900/60 text-rose-100 border-rose-300/40'
                      : 'bg-white/15 text-emerald-100 border-white/20'
                  }`}
                >
                  {isToxicityMode ? 'TOXICITY / OVERDOSE MODE' : 'UK BNF'}
                </span>
              )}
            </div>
            <p
              className={`text-xs sm:text-sm max-w-2xl leading-snug mt-0.5 ${
                isToxicityMode ? 'text-rose-100/90' : 'text-emerald-100/90'
              }`}
            >
              {isToxicityMode
                ? 'Pre-Hospital Overdose & Toxbase Study Assessment'
                : 'Built for UK paramedics, EMTs, and student clinicians to search BNF drugs, 999 assessment checklists, on-scene context, overdose doses, and prescription breakdowns.'}
            </p>
          </div>

          {/* Gemini Status & Guide Button */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shrink-0">
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

            {/* Exit Toxicity Mode Button (shown in Toxicity Mode even when no drug card is open) */}
            {isToxicityMode && onExitToxicityMode && (
              <button
                type="button"
                onClick={onExitToxicityMode}
                aria-label="Exit Toxicity Mode"
                title="Exit Toxicity Mode and return to standard clinical mode"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-semibold bg-rose-900/60 hover:bg-rose-950/80 active:bg-rose-950 text-white border border-rose-300/40 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-200 shrink-0" aria-hidden="true" />
                <span>Exit Tox Mode</span>
              </button>
            )}

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
      </div>
    </header>
  );
};
