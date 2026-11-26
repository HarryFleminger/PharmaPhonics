import React from 'react';
import { Layers, ChevronDown, ChevronUp, ArrowDownRight } from 'lucide-react';
import {
  BnfMedicationItem,
  BrandProductGroup,
  GeminiClinicalDetails,
  GeminiToxicityDetails,
} from '../types/medication';
import { MedicationCard } from './MedicationCard';
import { ToxDoseUnit } from './ToxCalculator';

interface BrandProductGroupCardProps {
  group: BrandProductGroup;
  getCardKey: (item: BnfMedicationItem) => string;
  selectedCardKeys: Record<string, boolean>;
  onSelectMedication: (item: BnfMedicationItem) => void;
  onExpandAllConstituents: (group: BrandProductGroup, expand: boolean) => void;
  clinicalDetailsByKey: Record<string, GeminiClinicalDetails>;
  clinicalLoadingByKey: Record<string, boolean>;
  clinicalErrorByKey: Record<string, string | null>;
  onRetryClinical: (item: BnfMedicationItem) => void;
  isToxicityMode: boolean;
  onToggleToxicityMode: (item: BnfMedicationItem) => void;
  toxicityDetailsByKey: Record<string, GeminiToxicityDetails>;
  toxicityLoadingByKey: Record<string, boolean>;
  toxicityErrorByKey: Record<string, string | null>;
  onRetryToxicity: (item: BnfMedicationItem) => void;
  toxCalculatedMetrics: {
    totalIngested: number | null;
    ingestedDosePerKg: number | null;
    unit: ToxDoseUnit;
  };
  onToggleToxUnit: () => void;
  audioLoadingId: string | null;
  speakingId: string | null;
  onListen: (id: string, name: string) => void;
}

export const BrandProductGroupCard: React.FC<BrandProductGroupCardProps> = ({
  group,
  getCardKey,
  selectedCardKeys,
  onSelectMedication,
  onExpandAllConstituents,
  clinicalDetailsByKey,
  clinicalLoadingByKey,
  clinicalErrorByKey,
  onRetryClinical,
  isToxicityMode,
  onToggleToxicityMode,
  toxicityDetailsByKey,
  toxicityLoadingByKey,
  toxicityErrorByKey,
  onRetryToxicity,
  toxCalculatedMetrics,
  onToggleToxUnit,
  audioLoadingId,
  speakingId,
  onListen,
}) => {
  const count = group.constituents.length;
  const allExpanded =
    count > 0 && group.constituents.every((item) => Boolean(selectedCardKeys[getCardKey(item)]));

  const handleFocusConstituent = (item: BnfMedicationItem) => {
    const cardKey = getCardKey(item);
    if (!selectedCardKeys[cardKey]) {
      onSelectMedication(item);
    }
    requestAnimationFrame(() => {
      const targetId = `brand-constituent-${group.id}-${item.id}`
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-');
      const el = document.getElementById(targetId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  return (
    <section
      aria-label={`${group.brandName} active ingredients breakdown`}
      className={`rounded-2xl border-2 p-4 sm:p-5 shadow-sm transition-colors ${
        isToxicityMode
          ? 'bg-gradient-to-b from-rose-50/90 via-white to-white border-rose-300'
          : 'bg-gradient-to-b from-emerald-50/90 via-white to-white border-emerald-300/90'
      }`}
    >
      {/* Parent Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                isToxicityMode
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-ambulance-green text-white border-ambulance-green'
              }`}
            >
              <Layers className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span>
                {count > 1
                  ? `Brand / Combination · ${count} Active Drugs`
                  : 'Brand-Name Product · 1 Active Drug'}
              </span>
            </span>

            {group.subtitle && (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-slate-700 border border-slate-200">
                {group.subtitle}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {group.brandName}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onExpandAllConstituents(group, !allExpanded)}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer active:scale-[0.98] ${
            isToxicityMode
              ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-white hover:bg-emerald-50 text-ambulance-green border-emerald-300'
          }`}
        >
          <span>{allExpanded ? 'Collapse All' : count > 1 ? 'Expand All' : 'Expand Details'}</span>
          {allExpanded ? (
            <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Composition Formula Bar */}
      <div
        className={`mt-3 rounded-xl px-3.5 py-2.5 border flex flex-wrap items-center gap-1.5 text-xs sm:text-sm ${
          isToxicityMode
            ? 'bg-rose-50/70 border-rose-200/90 text-rose-950'
            : 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950'
        }`}
      >
        <span className="font-bold uppercase tracking-wider text-[11px] opacity-75 mr-1">
          Comprises:
        </span>
        {group.constituents.map((item, idx) => (
          <React.Fragment key={getCardKey(item)}>
            {idx > 0 && (
              <span
                aria-hidden="true"
                className={`font-extrabold px-0.5 ${
                  isToxicityMode ? 'text-rose-400' : 'text-emerald-600/70'
                }`}
              >
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => handleFocusConstituent(item)}
              title={`Inspect ${item.name}`}
              className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer border ${
                selectedCardKeys[getCardKey(item)]
                  ? isToxicityMode
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-ambulance-green text-white border-ambulance-green'
                  : isToxicityMode
                  ? 'bg-white hover:bg-rose-100 text-rose-900 border-rose-200'
                  : 'bg-white hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
            >
              {item.name}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Tree-Connected Child Drug Cards */}
      <div
        className={`mt-4 pl-3 sm:pl-5 ml-1.5 sm:ml-2.5 border-l-2 space-y-4 ${
          isToxicityMode ? 'border-rose-300' : 'border-emerald-300'
        }`}
      >
        {group.constituents.map((item, idx) => {
          const cardKey = getCardKey(item);
          const anchorId = `brand-constituent-${group.id}-${item.id}`
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '-');

          return (
            <div key={cardKey} id={anchorId} className="relative">
              {/* Horizontal tree connector tick */}
              <span
                aria-hidden="true"
                className={`absolute -left-3 sm:-left-5 top-6 w-2.5 sm:w-4 h-0.5 ${
                  isToxicityMode ? 'bg-rose-300' : 'bg-emerald-300'
                }`}
              />

              {/* Branch label showing hierarchy relationship */}
              <div className="flex items-center gap-1.5 mb-1.5 pl-0.5 text-[11px] font-bold uppercase tracking-wider">
                <ArrowDownRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isToxicityMode ? 'text-rose-500' : 'text-emerald-600'
                  }`}
                  aria-hidden="true"
                />
                <span className={isToxicityMode ? 'text-rose-700' : 'text-emerald-800'}>
                  {count > 1
                    ? `Component ${idx + 1} of ${count} in ${group.brandName}`
                    : `Active Generic Drug in ${group.brandName}`}
                </span>
              </div>

              <MedicationCard
                medication={item}
                isSelected={Boolean(selectedCardKeys[cardKey])}
                onSelect={onSelectMedication}
                clinicalDetails={clinicalDetailsByKey[cardKey]}
                isClinicalLoading={Boolean(clinicalLoadingByKey[cardKey])}
                clinicalError={clinicalErrorByKey[cardKey]}
                onRetryClinical={onRetryClinical}
                isToxicityMode={isToxicityMode}
                onToggleToxicityMode={onToggleToxicityMode}
                toxicityDetails={toxicityDetailsByKey[cardKey]}
                isToxicityLoading={Boolean(toxicityLoadingByKey[cardKey])}
                toxicityError={toxicityErrorByKey[cardKey]}
                onRetryToxicity={onRetryToxicity}
                toxCalculatedMetrics={toxCalculatedMetrics}
                onToggleToxUnit={onToggleToxUnit}
                isAudioLoading={audioLoadingId === item.id}
                isSpeaking={speakingId === item.id}
                onListen={onListen}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
