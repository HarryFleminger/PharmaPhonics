import React from 'react';
import {
  Calculator,
  RotateCcw,
  AlertTriangle,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type ToxDoseUnit = 'mg' | 'mcg';

export interface ToxCalculatorValues {
  dosePerPillMg: string;
  numberOfPills: string;
  patientWeightKg: string;
  unit: ToxDoseUnit;
}

interface ToxCalculatorProps {
  values: ToxCalculatorValues;
  onChange: (next: ToxCalculatorValues) => void;
  isMinimized?: boolean;
  onToggleMinimized?: () => void;
}

/**
 * Automatically detects whether a drug's toxic threshold (or BNF name) is expressed in
 * micrograms (`mcg` / `mcg/kg`) or milligrams (`mg` / `mg/kg`).
 */
export function detectPreferredToxUnit(
  drugName: string,
  toxicThreshold?: string
): ToxDoseUnit {
  if (toxicThreshold) {
    const mcgPerKgMatch = /(mcg|micrograms?|µg)\s*\/\s*kg/i.exec(toxicThreshold);
    const mgPerKgMatch = /\b(mg|milligrams?)\s*\/\s*kg/i.exec(toxicThreshold);

    if (mcgPerKgMatch && mgPerKgMatch) {
      return mcgPerKgMatch.index <= mgPerKgMatch.index ? 'mcg' : 'mg';
    }
    if (mcgPerKgMatch) {
      return 'mcg';
    }
    if (mgPerKgMatch) {
      return 'mg';
    }

    const mcgMatch = /\b(mcg|micrograms?|µg)\b/i.exec(toxicThreshold);
    const mgMatch = /\b(mg|milligrams?)\b/i.exec(toxicThreshold);
    if (mcgMatch && !mgMatch) {
      return 'mcg';
    }
    if (mcgMatch && mgMatch && mcgMatch.index < mgMatch.index) {
      return 'mcg';
    }
  }

  if (/\b(mcg|micrograms?|µg)\b/i.test(drugName) && !/\bmg\b/i.test(drugName)) {
    return 'mcg';
  }

  return 'mg';
}

/**
 * Computes total ingested dose and weight-adjusted ingested dose (in the selected unit: mg or mcg)
 * from raw input strings.
 */
export function computeToxDoseMetrics(values: ToxCalculatorValues): {
  totalIngested: number | null;
  ingestedDosePerKg: number | null;
  unit: ToxDoseUnit;
} {
  const dose = parseFloat(values.dosePerPillMg);
  const pills = parseFloat(values.numberOfPills);
  const weight = parseFloat(values.patientWeightKg);

  const hasValidDoseAndPills =
    Number.isFinite(dose) && dose >= 0 && Number.isFinite(pills) && pills >= 0;

  const totalIngested = hasValidDoseAndPills ? dose * pills : null;

  const hasValidWeight = Number.isFinite(weight) && weight > 0;
  const ingestedDosePerKg =
    totalIngested !== null && hasValidWeight ? totalIngested / weight : null;

  return {
    totalIngested,
    ingestedDosePerKg,
    unit: values.unit,
  };
}

export function formatMetricNumber(num: number, maxDecimals = 2): string {
  return Number(num.toFixed(maxDecimals)).toLocaleString('en-GB', {
    maximumFractionDigits: maxDecimals,
  });
}

export const ToxCalculator: React.FC<ToxCalculatorProps> = ({
  values,
  onChange,
  isMinimized = false,
  onToggleMinimized,
}) => {
  const { totalIngested, ingestedDosePerKg, unit } = computeToxDoseMetrics(values);
  const unitLabel = unit === 'mcg' ? 'mcg (micrograms)' : 'mg (milligrams)';
  const hasAnyInput =
    values.dosePerPillMg.trim() !== '' ||
    values.numberOfPills.trim() !== '' ||
    values.patientWeightKg.trim() !== '';

  const handleFieldChange = (
    field: 'dosePerPillMg' | 'numberOfPills' | 'patientWeightKg',
    rawValue: string
  ) => {
    onChange({
      ...values,
      [field]: rawValue,
    });
  };

  const handleToggleUnit = () => {
    onChange({
      ...values,
      unit: unit === 'mg' ? 'mcg' : 'mg',
    });
  };

  const handleReset = () => {
    onChange({
      ...values,
      dosePerPillMg: '',
      numberOfPills: '',
      patientWeightKg: '',
    });
  };

  return (
    <section
      aria-label="Overdose Toxicity Calculator"
      className="bg-white rounded-2xl shadow-sm border-2 border-rose-200 overflow-hidden mb-5"
    >
      {/* Calculator Header Bar (Tappable to expand/minimise) */}
      <div
        onClick={onToggleMinimized}
        role={onToggleMinimized ? 'button' : undefined}
        tabIndex={onToggleMinimized ? 0 : undefined}
        aria-expanded={!isMinimized}
        onKeyDown={(e) => {
          if (onToggleMinimized && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onToggleMinimized();
          }
        }}
        className={`bg-rose-600 text-white px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-2 select-none ${
          onToggleMinimized ? 'cursor-pointer hover:bg-rose-600/95 transition-colors' : ''
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-white/15 border border-white/20 shrink-0">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-rose-100" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold tracking-tight flex flex-wrap items-center gap-2">
              <span>Overdose / Tox Dose Calculator</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-800/80 text-rose-100 border border-rose-400/30">
                <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Study Tool Only</span>
              </span>
              {isMinimized && (totalIngested !== null || ingestedDosePerKg !== null) && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-white text-rose-700">
                  {totalIngested !== null ? `${formatMetricNumber(totalIngested)} ${unit}` : ''}
                  {ingestedDosePerKg !== null
                    ? ` (${formatMetricNumber(ingestedDosePerKg)} ${unit}/kg)`
                    : ''}
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Unit Switcher (mg <-> micrograms), Reset Button & Collapse/Expand Toggle */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-wrap items-center gap-2 shrink-0"
        >
          {!isMinimized && (
            <>
              <button
                type="button"
                onClick={handleToggleUnit}
                aria-label={`Switch dose units between milligrams and micrograms (currently ${unitLabel})`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold border border-white shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                title="Switch calculator and overdose readout between milligrams (mg) and micrograms (mcg)"
              >
                <ArrowLeftRight
                  className="w-3.5 h-3.5 text-rose-600 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Unit:{' '}
                  <strong className="underline">{unit === 'mg' ? 'mg' : 'mcg (µg)'}</strong>
                </span>
                <span className="text-rose-400 font-normal">
                  → {unit === 'mg' ? 'mcg' : 'mg'}
                </span>
              </button>

              {hasAnyInput && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </>
          )}

          {onToggleMinimized && (
            <button
              type="button"
              onClick={onToggleMinimized}
              aria-label={isMinimized ? 'Expand Overdose Calculator' : 'Minimise Overdose Calculator'}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer shrink-0"
            >
              <span>{isMinimized ? 'Open' : 'Minimise'}</span>
              {isMinimized ? (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Inputs & Live Calculated Outputs (Hidden when Minimized) */}
      {!isMinimized && (
        <div className="p-4 sm:p-5 space-y-4">
        {/* Three Number Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Dose per pill (mg or mcg) */}
          <div>
            <label
              htmlFor="tox-dose-per-pill"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              Dose per pill ({unit === 'mg' ? 'mg' : 'micrograms / mcg'})
            </label>
            <div className="relative">
              <input
                id="tox-dose-per-pill"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={values.dosePerPillMg}
                onChange={(e) => handleFieldChange('dosePerPillMg', e.target.value)}
                placeholder={unit === 'mg' ? 'e.g. 500' : 'e.g. 250'}
                className="w-full px-3.5 py-2.5 pr-14 text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 focus:bg-white transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                {unit}
              </span>
            </div>
          </div>

          {/* 2. Number of pills taken */}
          <div>
            <label
              htmlFor="tox-number-of-pills"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              Number of pills taken
            </label>
            <div className="relative">
              <input
                id="tox-number-of-pills"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={values.numberOfPills}
                onChange={(e) => handleFieldChange('numberOfPills', e.target.value)}
                placeholder="e.g. 16"
                className="w-full px-3.5 py-2.5 pr-14 text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 focus:bg-white transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                pills
              </span>
            </div>
          </div>

          {/* 3. Patient weight (kg) */}
          <div>
            <label
              htmlFor="tox-patient-weight"
              className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
            >
              Patient weight (kg)
            </label>
            <div className="relative">
              <input
                id="tox-patient-weight"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={values.patientWeightKg}
                onChange={(e) => handleFieldChange('patientWeightKg', e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-3.5 py-2.5 pr-12 text-base bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600 focus:bg-white transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">
                kg
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Live Calculation Readouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Total Ingested (mg or mcg) */}
          <div className="rounded-xl bg-rose-50/90 border border-rose-200 px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-rose-800">
                Total Ingested ({unit})
              </span>
              <span className="text-xs text-rose-600/90">
                Dose per pill ({unit}) × Number of pills
              </span>
            </div>
            <div className="text-right">
              {totalIngested !== null ? (
                <span className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono">
                  {formatMetricNumber(totalIngested)}{' '}
                  <span className="text-sm font-bold">{unit}</span>
                </span>
              ) : (
                <span className="text-lg sm:text-xl font-bold text-rose-300 font-mono">
                  — {unit}
                </span>
              )}
            </div>
          </div>

          {/* Ingested Dose per kg (mg/kg or mcg/kg) */}
          <div className="rounded-xl bg-rose-600 text-white border border-rose-700 px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-rose-100">
                Ingested Dose per kg ({unit}/kg)
              </span>
              <span className="text-xs text-rose-200">
                Total ingested ({unit}) ÷ Patient weight (kg)
              </span>
            </div>
            <div className="text-right">
              {ingestedDosePerKg !== null ? (
                <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                  {formatMetricNumber(ingestedDosePerKg)}{' '}
                  <span className="text-sm font-bold text-rose-100">{unit}/kg</span>
                </span>
              ) : (
                <span className="text-lg sm:text-xl font-bold text-rose-300 font-mono">
                  — {unit}/kg
                </span>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
