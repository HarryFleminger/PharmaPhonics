import React from 'react';
import {
  BookOpenCheck,
  Skull,
  Search,
  Camera,
  FolderOpen,
  Stethoscope,
  HeartPulse,
  ChevronRight,
} from 'lucide-react';

interface HowToUseCardProps {
  isToxicityMode?: boolean;
  onClickSearchDrugs: () => void;
  onClickUploadMedList: () => void;
  onClickQuickCategories: () => void;
  onClickAssessments: () => void;
  onClickConditions?: () => void;
  onClickToxicityMode: () => void;
}

export const HowToUseCard: React.FC<HowToUseCardProps> = ({
  isToxicityMode = false,
  onClickSearchDrugs,
  onClickUploadMedList,
  onClickQuickCategories,
  onClickAssessments,
  onClickConditions,
  onClickToxicityMode,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border p-6 sm:p-8 max-w-2xl mx-auto my-4 sm:my-6 shadow-sm ${
        isToxicityMode ? 'border-rose-200' : 'border-slate-200'
      }`}
    >
      <div className="flex flex-col items-center text-center mb-5">
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3 ${
            isToxicityMode
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-emerald-50 text-ambulance-green border-emerald-200'
          }`}
        >
          {isToxicityMode ? (
            <Skull className="w-6 h-6" aria-hidden="true" />
          ) : (
            <BookOpenCheck className="w-6 h-6" aria-hidden="true" />
          )}
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
          {isToxicityMode
            ? 'Toxicity Mode: Assess Overdose Doses & Effects'
            : 'How to Use MedSpeak'}
        </h2>
      </div>

      <ul className="space-y-2.5 text-left max-w-lg mx-auto">
        <li>
          <button
            type="button"
            onClick={onClickSearchDrugs}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left transition-all cursor-pointer active:scale-[0.99] group ${
              isToxicityMode
                ? 'hover:bg-rose-50/70 hover:border-rose-300'
                : 'hover:bg-emerald-50/70 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isToxicityMode
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-emerald-100 text-ambulance-green'
                }`}
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                <strong className="text-slate-900">Search</strong> — look up any UK drug for
                essential on-scene context, indications, and pronunciation.
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isToxicityMode
                  ? 'group-hover:text-rose-600'
                  : 'group-hover:text-ambulance-green'
              }`}
              aria-hidden="true"
            />
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={onClickUploadMedList}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left transition-all cursor-pointer active:scale-[0.99] group ${
              isToxicityMode
                ? 'hover:bg-rose-50/70 hover:border-rose-300'
                : 'hover:bg-emerald-50/70 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isToxicityMode
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-emerald-100 text-ambulance-green'
                }`}
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                <strong className="text-slate-900">Multiple Meds / Prescription</strong> — type or
                paste multiple medications to study, or snap a prescription photo for a holistic
                overview.
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isToxicityMode
                  ? 'group-hover:text-rose-600'
                  : 'group-hover:text-ambulance-green'
              }`}
              aria-hidden="true"
            />
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={onClickQuickCategories}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left transition-all cursor-pointer active:scale-[0.99] group ${
              isToxicityMode
                ? 'hover:bg-rose-50/70 hover:border-rose-300'
                : 'hover:bg-emerald-50/70 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isToxicityMode
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-emerald-100 text-ambulance-green'
                }`}
              >
                <FolderOpen className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                <strong className="text-slate-900">Quick Categories</strong> — tap any category
                above to browse commonly encountered emergency drugs or 999 call-outs.
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isToxicityMode
                  ? 'group-hover:text-rose-600'
                  : 'group-hover:text-ambulance-green'
              }`}
              aria-hidden="true"
            />
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={onClickAssessments}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left transition-all cursor-pointer active:scale-[0.99] group ${
              isToxicityMode
                ? 'hover:bg-rose-50/70 hover:border-rose-300'
                : 'hover:bg-emerald-50/70 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isToxicityMode
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-emerald-100 text-ambulance-green'
                }`}
              >
                <Stethoscope className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                <strong className="text-slate-900">Assessments</strong> — search any condition or
                common 999 call-out for rapid Key Questions, Assessments, and Red Flags.
              </span>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                isToxicityMode
                  ? 'group-hover:text-rose-600'
                  : 'group-hover:text-ambulance-green'
              }`}
              aria-hidden="true"
            />
          </button>
        </li>

        {onClickConditions && (
          <li>
            <button
              type="button"
              onClick={onClickConditions}
              className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left transition-all cursor-pointer active:scale-[0.99] group ${
                isToxicityMode
                  ? 'hover:bg-rose-50/70 hover:border-rose-300'
                  : 'hover:bg-emerald-50/70 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isToxicityMode
                      ? 'bg-rose-100 text-rose-600'
                      : 'bg-emerald-100 text-ambulance-green'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  <strong className="text-slate-900">Conditions</strong> — look up any chronic or
                  unfamiliar condition en route for pathophysiology, baseline, treatments, and
                  on-scene takeaways.
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                  isToxicityMode
                    ? 'group-hover:text-rose-600'
                    : 'group-hover:text-ambulance-green'
                }`}
                aria-hidden="true"
              />
            </button>
          </li>
        )}

        <li>
          <button
            type="button"
            onClick={onClickToxicityMode}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 hover:bg-rose-100/70 hover:border-rose-300 text-left transition-all cursor-pointer active:scale-[0.99] group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 shrink-0 mt-0.5">
                <Skull className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                <strong className="text-rose-900">Toxicity Mode</strong> — tap Toxicity Mode on any
                drug card to calculate ingested doses and view toxic thresholds and effects.
              </span>
            </div>
            <ChevronRight
              className="w-4 h-4 text-rose-400 group-hover:text-rose-600 shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </div>
  );
};
