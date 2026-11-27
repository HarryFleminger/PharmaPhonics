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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerThemeClass = isToxicityMode ? 'bg-rose-700' : 'bg-ambulance-green';
  const accentBorderClass = isToxicityMode ? 'border-rose-300' : 'border-nhs-warmYellow';

  return (
    <>
      <header
        className={`text-white sticky top-0 z-30 transition-colors duration-200 ${headerThemeClass} ${
          isScrolled ? `border-b-2 shadow-md ${accentBorderClass}` : 'border-b-0'
        } md:border-b-4 md:shadow-md ${accentBorderClass}`}
      >
        <div className="max-w-6xl mx-auto px-3.5 py-2 md:px-6 md:py-3.5 flex items-center justify-between gap-2.5 md:gap-3">
          {/* Left: Brand Icon + Title + Mode Badge (+ Desktop Subtitle) */}
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
            <div className="p-1.5 md:p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shrink-0">
              {isToxicityMode ? (
                <Skull className="w-5 h-5 md:w-6 md:h-6 text-rose-200" aria-hidden="true" />
              ) : (
                <Stethoscope
                  className="w-5 h-5 md:w-6 md:h-6 text-nhs-warmYellow"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-lg md:text-2xl font-bold tracking-tight shrink-0">
                  MedSpeak
                </h1>
                {isToxicityMode && onExitToxicityMode ? (
                  <button
                    type="button"
                    onClick={onExitToxicityMode}
                    aria-label="Exit Toxicity / Overdose Mode"
                    title="Click to exit Toxicity Mode and return to standard clinical mode"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] md:text-xs font-semibold border shrink-0 bg-rose-900/60 hover:bg-rose-950/80 text-rose-100 border-rose-300/40 transition-colors cursor-pointer"
                  >
                    <span className="sm:hidden">TOXICITY</span>
                    <span className="hidden sm:inline">TOXICITY / OVERDOSE MODE</span>
                    <X className="w-3 h-3 text-rose-200 shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] md:text-xs font-semibold border shrink-0 ${
                      isToxicityMode
                        ? 'bg-rose-900/60 text-rose-100 border-rose-300/40'
                        : 'bg-white/15 text-emerald-100 border-white/20'
                    }`}
                  >
                    {isToxicityMode ? 'TOXICITY' : 'UK BNF'}
                  </span>
                )}
              </div>

              <p
                className={`hidden md:block text-sm max-w-2xl leading-snug mt-0.5 ${
                  isToxicityMode ? 'text-rose-100/90' : 'text-emerald-100/90'
                }`}
              >
                {isToxicityMode
                  ? 'Pre-Hospital Overdose & Toxbase Study Assessment'
                  : 'Built for UK paramedics, EMTs, and student clinicians to search BNF drugs, 999 assessment checklists, on-scene context, overdose doses, and prescription breakdowns.'}
              </p>
            </div>
          </div>

          {/* Mobile Right Action: Compact Guide Button inside Sticky Top Bar */}
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer shrink-0"
              title="Open MedSpeak Welcome Guide & Feature Overview"
            >
              <HelpCircle
                className={`w-3.5 h-3.5 shrink-0 ${
                  isToxicityMode ? 'text-rose-200' : 'text-nhs-warmYellow'
                }`}
                aria-hidden="true"
              />
              <span>Guide</span>
            </button>
          )}

          {/* Desktop Action Badges */}
          <div className="hidden md:flex flex-wrap items-center gap-2 text-sm shrink-0">
            <div
              className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg border border-white/15"
              title="Powered by Google Gemini API for UK BNF Clinical Details"
            >
              <Sparkles
                className={`w-4 h-4 shrink-0 ${
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

            {isToxicityMode && onExitToxicityMode && (
              <button
                type="button"
                onClick={onExitToxicityMode}
                aria-label="Exit Toxicity Mode"
                title="Exit Toxicity Mode and return to standard clinical mode"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold bg-rose-900/60 hover:bg-rose-950/80 active:bg-rose-950 text-white border border-rose-300/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-200 shrink-0" aria-hidden="true" />
                <span>Exit Tox Mode</span>
              </button>
            )}

            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/20 transition-colors cursor-pointer"
                title="Open MedSpeak Welcome Guide & Feature Overview"
              >
                <HelpCircle
                  className={`w-4 h-4 shrink-0 ${
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

      {/* Mobile Non-Sticky Sub-Banner: scrolls away cleanly so the search bar sits at the top */}
      <div
        className={`md:hidden text-white shadow-md border-b-4 transition-colors duration-200 ${headerThemeClass} ${accentBorderClass}`}
      >
        <div className="max-w-6xl mx-auto px-3.5 pb-3 pt-0.5 space-y-2">
          <p
            className={`text-xs leading-snug ${
              isToxicityMode ? 'text-rose-100/90' : 'text-emerald-100/90'
            }`}
          >
            {isToxicityMode
              ? 'Pre-Hospital Overdose & Toxbase Study Assessment'
              : 'Built for UK paramedics, EMTs, and student clinicians to search BNF drugs, 999 assessment checklists, on-scene context, overdose doses, and prescription breakdowns.'}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <div
              className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/15"
              title="Powered by Google Gemini API for UK BNF Clinical Details"
            >
              <Sparkles
                className={`w-3.5 h-3.5 shrink-0 ${
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

            {isToxicityMode && onExitToxicityMode && (
              <button
                type="button"
                onClick={onExitToxicityMode}
                aria-label="Exit Toxicity Mode"
                title="Exit Toxicity Mode and return to standard clinical mode"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold bg-rose-900/60 hover:bg-rose-950/80 active:bg-rose-950 text-white border border-rose-300/40 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-rose-200 shrink-0" aria-hidden="true" />
                <span>Exit Tox Mode</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
