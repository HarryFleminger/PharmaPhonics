import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  BookOpenCheck,
  Trash2,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';
import { clearAllCachedStudyData } from '../services/geminiClinicalService';

export type LegalModalTab = 'terms' | 'privacy' | 'licensing';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalModalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalModalTab>(initialTab);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setCacheCleared(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleClearCache = () => {
    clearAllCachedStudyData();
    setCacheCleared(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Top Modal Header */}
        <div className="bg-ambulance-green text-white px-5 py-4 flex items-center justify-between gap-3 border-b-4 border-nhs-warmYellow shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/15 border border-white/25 text-nhs-warmYellow shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2
                id="legal-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight truncate"
              >
                MedSpeak Study Guardrails &amp; Legal Info
              </h2>
              <p className="text-xs text-emerald-100/90 truncate">
                Educational use only · No Patient Identifiable Data · Open Data Attribution
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal and privacy notice"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Tab Switcher */}
        <div
          role="tablist"
          aria-label="Legal and guardrail sections"
          className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'terms'}
            onClick={() => setActiveTab('terms')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-ambulance-green text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Educational &amp; MHRA Notice</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-ambulance-green text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Privacy &amp; No-PID Policy</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'licensing'}
            onClick={() => setActiveTab('licensing')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'licensing'
                ? 'bg-ambulance-green text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Data &amp; Trademarks</span>
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'terms' && (
            <div role="tabpanel" className="space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-950">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      Strictly Off-Duty Education &amp; CPD Study Only
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-amber-900">
                      MedSpeak is designed solely for pharmacology revision, OSCE/university
                      simulation, and personal CPD. It must never be relied upon for live clinical
                      decision-making, patient triage, prescribing, or active overdose management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  1. Not a Medical Device (UK MHRA SaMD Position)
                </h4>
                <p>
                  MedSpeak is <strong>not</strong> a medical device (not UKCA or CE marked under the
                  UK Medical Devices Regulations 2002) and is <strong>not</strong> clinical decision
                  support software. Any overdose threshold notes and the Overdose / Tox Study
                  Calculator are provided purely as worked revision exercises for hypothetical
                  scenarios.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  2. Authoritative Clinical Sources
                </h4>
                <p>
                  During operational duty or clinical placements, practitioners must always consult
                  official authoritative references including <strong>JRCALC+</strong>,{' '}
                  <strong>TOXBASE</strong> (or NPIS advice), local NHS Ambulance Trust clinical
                  guidelines, and the official <strong>BNF</strong>.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  3. AI Summaries &amp; Synthetic Pronunciations
                </h4>
                <p>
                  Live medication lookups and holistic prescription breakdowns are generated using
                  Google Gemini AI and provided &ldquo;as-is&rdquo;. AI models can omit rare
                  contraindications or produce inaccuracies. British English audio pronunciations are
                  synthetic study aids and are not guaranteed to be definitive.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div role="tabpanel" className="space-y-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-950">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    className="w-5 h-5 text-ambulance-green shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">
                      Zero Patient Identifiable Data (UK GDPR / NHS IG / HCPC)
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-emerald-900">
                      Never upload, photograph, or paste real patient names, dates of birth, NHS
                      numbers, home addresses, postcodes, or hospital/GP header blocks into
                      MedSpeak. Only use anonymised lists, simulated study scenarios, or tightly
                      cropped medication-only strips.
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Client &amp; Server Text Scrubbing:</strong> Pasted medication text runs
                    through automated pattern scrubbing (redacting NHS numbers, DOBs, postcodes,
                    emails, phone numbers, titled names, and patient header lines) both in your
                    browser and on the server before any AI call.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Local Image Resizing &amp; Prompt Guardrail:</strong> Uploaded photos are
                    compressed locally in your browser via HTML5 canvas before transmission, and the
                    server instructs Gemini to ignore any incidental personal identifiers.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>No Server Database Storage:</strong> MedSpeak does not persist your
                    medication searches, pasted lists, or uploaded images in a server database.
                    Previously viewed lookups are cached strictly in your own browser&rsquo;s{' '}
                    <code>localStorage</code> to save quota.
                  </span>
                </li>
              </ul>

              {/* Clear Local Study Cache Action */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>Clear Device Study Cache</span>
                  </p>
                  <p className="mt-0.5">
                    Removes cached drug cards and scan summaries stored on this browser.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {cacheCleared && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Local study cache cleared</span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear Local Study Cache</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'licensing' && (
            <div role="tabpanel" className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  1. Open Prescribing &amp; NHS Data Attribution
                </h3>
                <p>
                  Medication nomenclature and prescribing codes are sourced from{' '}
                  <strong>NHS Business Services Authority (NHSBSA) Open Data</strong> and{' '}
                  <strong>OpenPrescribing.net</strong> (Bennett Institute for Applied Data Science,
                  University of Oxford), containing public sector information licensed under the{' '}
                  <a
                    href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ambulance-green font-semibold hover:underline"
                  >
                    <span>Open Government Licence v3.0 (OGL)</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                  .
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  2. Independent Study Tool — Trademark Notice
                </h3>
                <p className="text-xs sm:text-sm text-slate-700">
                  <strong>MedSpeak</strong> is an independent educational study tool and is{' '}
                  <strong>not affiliated with, endorsed by, or sponsored by</strong> the National
                  Institute for Health and Care Excellence (NICE), Pharmaceutical Press, the British
                  National Formulary (<strong>BNF®</strong>), the Joint Royal Colleges Ambulance
                  Liaison Committee (<strong>JRCALC®</strong>), the Association of Ambulance Chief
                  Executives (AACE), the National Health Service (<strong>NHS</strong>), or the
                  National Poisons Information Service (<strong>NPIS / TOXBASE®</strong>).
                </p>
                <p className="text-xs text-slate-500">
                  All third-party product names, clinical reference titles, and trademarks remain
                  the property of their respective owners and are cited solely for educational
                  signposting.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-ambulance-green hover:bg-emerald-800 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
