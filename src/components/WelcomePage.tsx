import React from 'react';
import {
  Stethoscope,
  HeartPulse,
  FolderOpen,
  Skull,
  Camera,
  Volume2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface WelcomePageProps {
  onClose: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onClose }) => {
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
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight">MedSpeak</span>
                <span className="text-xs sm:text-sm font-medium text-emerald-100/95">
                  A Paramedic Companion App
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-ambulance-green hover:bg-emerald-50 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to MedSpeak</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            UK Paramedic Medication &amp; Assessment Study Tool
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-emerald-100/95 max-w-3xl leading-relaxed">
            Built for UK paramedics, EMT/AAPs, and student clinicians to search 999 assessments, UK
            NHS drugs, medical conditions, overdose doses, and multiple-med breakdowns.
          </p>
        </div>
      </header>

      {/* Main Feature Cards */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            How MedSpeak Works — 6 Core Study Tools
          </h2>
        </div>

        {/* 6 Visual Feature Cards */}
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
                Tap <strong>Toxicity Mode</strong> on any medication card to switch the app into a
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

          {/* 3. British English Pronunciation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-nhs-blue flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-nhs-blue">
                    3. Handover Confidence
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

          {/* 4. Prescription Photo Scanner & Holistic Reviews (New Feature — Last Tile) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-ambulance-green flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ambulance-green">
                    4. Multi-Drug Vision &amp; Text AI
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Multiple Meds Study &amp; Prescription Scanner
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Tap <strong>Multiple Meds / Prescription</strong> next to the search bar to type or
                paste multiple medications to study together, or snap a photo of a repeat
                prescription, discharge letter, or blister pack.
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

          {/* 5. Pre-Hospital Scene Assessments */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-ambulance-green flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ambulance-green">
                    5. Clinical Assessments
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    999 Call-Out Checklists &amp; Condition Lookup
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Switch to the <strong>Assessments</strong> tab for concise, pocketbook-style{' '}
                <strong>Key Questions to Ask</strong>, <strong>Key Assessments to Make</strong>,
                and <strong>Red Flags</strong> without waffle or filler.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>26 Instant 999 Call-Outs:</strong> Browse 7 clinical categories or
                    search UK abbreviations (<code>cp</code>, <code>sob</code>, <code>tloc</code>,{' '}
                    <code>fast</code>, <code>dka</code>, <code>ces</code>) with zero API tokens.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Live Gemini AI Lookup:</strong> Search any other condition (e.g.{' '}
                    <em>Pericarditis</em> or <em>Ectopic Pregnancy</em>) to generate and locally
                    cache its pocketbook checklist in seconds.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 6. Conditions & Pathophysiology (New Feature) */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-ambulance-green flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ambulance-green">
                      6. Conditions &amp; PMH
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase bg-nhs-warmYellow text-slate-950">
                      New
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    Condition Refreshers &amp; Pathophysiology
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Open the <strong>Conditions</strong> tab en route to a job to quickly refresh
                unfamiliar or complex past medical history (e.g. <em>Motor Neurone Disease / ALS</em>,{' '}
                <em>Addison&apos;s</em>, or <em>Myasthenia Gravis</em>).
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Clear Clinical Breakdown:</strong> Covers What It Is, Pathophysiology,
                    Symptoms &amp; Baseline, Treatments, and Acute Complications in British NHS
                    terminology.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>UK Audio &amp; Common Meds Links:</strong> Hear British English
                    pronunciation or tap any associated drug pill to jump straight to its BNF card.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Return Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ambulance-green hover:bg-emerald-800 text-white font-bold text-sm sm:text-base shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
            <span>Back to MedSpeak</span>
          </button>
        </div>
      </main>
    </div>
  );
};
