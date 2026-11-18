import React from 'react';
import {
  Stethoscope,
  FolderOpen,
  Skull,
  Camera,
  Volume2,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface WelcomePageProps {
  isReturningUser: boolean;
  onContinue: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  isReturningUser,
  onContinue,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Hero Banner */}
      <header className="bg-ambulance-green text-white border-b-4 border-nhs-warmYellow shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-nhs-warmYellow" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight">MedSpeak</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-white/15 text-emerald-100 border border-white/20">
                  UK BNF
                </span>
              </div>
            </div>

            {isReturningUser && (
              <button
                type="button"
                onClick={onContinue}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs sm:text-sm font-semibold text-white border border-white/25 transition-colors cursor-pointer"
              >
                <span>Back to MedSpeak</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            UK Paramedic Medication Study Tool
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-emerald-100/95 max-w-3xl leading-relaxed">
            Built for UK paramedics, EMTs, and student clinicians to quickly revise UK BNF
            medications, pre-hospital on-scene context, overdose toxicity thresholds, holistic
            prescription lists, and British English drug pronunciations.
          </p>
        </div>
      </header>

      {/* Main Feature Cards & Clinical Disclaimer */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            How MedSpeak Works — 4 Core Study Tools
          </h2>
        </div>

        {/* 4 Visual Feature Cards in Exact Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* 1. Quick Categories & On-Scene Context */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-ambulance-green flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ambulance-green">
                    1. Pharmacology &amp; Primary Survey
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Quick Categories &amp; On-Scene Context
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Browse <strong>101 pre-loaded UK emergency and community medications</strong> across
                10 Quick Categories or search the live UK BNF database.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>On-Scene Context:</strong> Plain-English summary of why a drug is
                    prescribed and key red flags (bleeding risks, masked tachycardia, postural
                    hypotension).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Drug Class &amp; Indications:</strong> Instant UK BNF classification and
                    common clinical indications.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Toxicity Mode & Overdose Calculator */}
          <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <Skull className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    2. Toxicology &amp; Overdose Study
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Toxicity Mode &amp; Overdose Calculator
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Toggle <strong>Toxicity Mode</strong> in the top header to switch the app into a
                high-alert red overdose assessment view.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Live Tox Dose Calculator:</strong> Enter pill strength, quantity, and
                    patient weight to calculate total dose and weight-adjusted dose (auto-switching
                    between <code>mg/kg</code> and <code>mcg/kg</code>).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Thresholds, Vital Signs &amp; TOXBASE:</strong> Compare against known
                    toxic thresholds, clinical overdose presentations, and 1-tap TOXBASE links.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Prescription Photo Scanner & Holistic Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-ambulance-green flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ambulance-green">
                      3. Multi-Drug Vision AI
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase bg-nhs-warmYellow text-slate-950">
                      New
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Prescription Photo Scanner &amp; Holistic Reviews
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Tap <strong>Upload Prescription / Med List</strong> next to the search bar to snap a
                photo or upload a screenshot of a repeat prescription, discharge letter, or blister
                pack.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Holistic Patient Profile:</strong> Automatically extracts every drug on
                    the list and summarizes likely patient conditions and combined on-scene
                    considerations.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Polypharmacy Interactions:</strong> In Toxicity Mode, highlights
                    dangerous drug-drug interactions and mixed-overdose red flags.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. British English Pronunciation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-nhs-blue flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-nhs-blue">
                    4. Handover Confidence
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    🇬🇧 British English Pronunciation
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Build confidence pronouncing complex UK generic drug names during hospital
                pre-alerts and clinical handovers.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-nhs-blue shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>UK Neural Voice Audio:</strong> Tap <strong>Listen</strong> on any
                    medication card to hear a clear British English voice synthesis.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-nhs-blue shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Phonetic Breakdowns:</strong> Every clinical flashcard highlights
                    stressed syllables (e.g. <code>/a-mee-OH-da-rone/</code>) for quick visual
                    reading.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integrated Clinical Disclaimer & Launch CTA Card */}
        <section
          aria-label="Clinical Disclaimer and Launch"
          className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-amber-950">
                Important Clinical &amp; Study Disclaimer
              </h2>
              <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
                <strong>For educational and study purposes only.</strong> Practitioners must always
                check <strong>JRCALC+</strong> (or local NHS Trust clinical guidelines), the{' '}
                <strong>BNF</strong>, and <strong>TOXBASE</strong> for operational use on the road.
                Never make clinical decisions based on the information in this app.
              </p>
              <p className="text-xs text-amber-900/80 leading-relaxed flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>
                  Clinical summaries are generated by Gemini AI (which can make mistakes), and voice
                  pronunciations are reasonable approximations for study.
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs text-amber-900/80 font-medium">
              You can reopen this guide anytime via the <strong>Guide</strong> button in the top
              bar.
            </span>

            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ambulance-green hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer active:scale-[0.99] shrink-0"
            >
              <span>
                {isReturningUser
                  ? 'Back to MedSpeak'
                  : 'I Understand (Study Use Only) — Open MedSpeak'}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
