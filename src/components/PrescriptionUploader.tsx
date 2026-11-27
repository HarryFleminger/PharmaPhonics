import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Pill,
  AlertCircle,
  Sparkles,
  Trash2,
  Stethoscope,
  Skull,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Layers,
  ArrowDownRight,
} from 'lucide-react';
import { ExtractedBrandBreakdown, ScannedMedicationEntry } from '../types/medication';
import { resolveScannedMedicationsHierarchy } from '../data/brandProducts';
import {
  extractMedicationsFromPrescriptionImage,
  extractMedicationsFromPastedText,
} from '../services/geminiClinicalService';
import { trackEvent } from '../services/analyticsService';

const MAX_IMAGE_DIMENSION_PX = 1024;
const JPEG_COMPRESSION_QUALITY = 0.75;

type UploaderTab = 'photo' | 'paste';

/**
 * Downscales and compresses an uploaded or camera image on the client using an HTML5 `<canvas>`
 * to a maximum width/height of 1024px (JPEG quality 0.75), reducing payload size and multimodal
 * token usage by ~85% before calling Gemini Vision.
 */
function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl) {
        reject(new Error('Could not read image data.'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        resolve(rawDataUrl);
      };
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > MAX_IMAGE_DIMENSION_PX || height > MAX_IMAGE_DIMENSION_PX) {
            if (width >= height) {
              height = Math.round((height * MAX_IMAGE_DIMENSION_PX) / width);
              width = MAX_IMAGE_DIMENSION_PX;
            } else {
              width = Math.round((width * MAX_IMAGE_DIMENSION_PX) / height);
              height = MAX_IMAGE_DIMENSION_PX;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_COMPRESSION_QUALITY);
          resolve(compressedDataUrl || rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

interface PrescriptionUploaderProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectMedication: (
    drugName: string,
    options?: { scrollToResults?: boolean; brandGroupId?: string }
  ) => void;
  activeSearchQuery: string;
  isToxicityMode?: boolean;
  onFirstInteract?: () => void;
  onUploadActiveChange?: (isActive: boolean) => void;
  onSavedCountChange?: (count: number) => void;
}

export const PrescriptionUploader: React.FC<PrescriptionUploaderProps> = ({
  isOpen,
  onToggleOpen,
  onSelectMedication,
  activeSearchQuery,
  isToxicityMode = false,
  onFirstInteract,
  onUploadActiveChange,
  onSavedCountChange,
}) => {
  const [activeTab, setActiveTab] = useState<UploaderTab>('photo');
  const [pastedText, setPastedText] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedMedications, setScannedMedications] = useState<string[]>([]);
  const [brandBreakdowns, setBrandBreakdowns] = useState<ExtractedBrandBreakdown[]>([]);
  const [patientConditions, setPatientConditions] = useState<string[]>([]);
  const [onSceneBullets, setOnSceneBullets] = useState<string[]>([]);
  const [interactionBullets, setInteractionBullets] = useState<string[]>([]);
  const [toxRedFlagBullets, setToxRedFlagBullets] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const processImageFile = useCallback(
    (file: File) => {
      onFirstInteract?.();

      if (!file.type.startsWith('image/')) {
        setScanError('Please upload a valid image file (JPEG, PNG, WebP, or HEIC).');
        return;
      }

      setActiveTab('photo');
      setScanError(null);
      setImageFileName(file.name);
      setIsScanning(true);
      onUploadActiveChange?.(true);
      trackEvent('prescription_scan_started', { method: 'photo' });

      void (async () => {
        try {
          const compressedDataUrl = await compressImageFileToDataUrl(file);
          setImagePreviewUrl(compressedDataUrl);

          const base64Match = compressedDataUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (!base64Match) {
            setIsScanning(false);
            setScanError('Could not read image data.');
            trackEvent('prescription_scan_failed', { method: 'photo', reason: 'invalid_image' });
            return;
          }

          const mimeType = base64Match[1];
          const base64Data = base64Match[2];

          const scanResult = await extractMedicationsFromPrescriptionImage(
            base64Data,
            mimeType
          );
          setScannedMedications(scanResult.medications);
          setBrandBreakdowns(scanResult.brandBreakdowns ?? []);
          setPatientConditions(scanResult.patientConditions);
          setOnSceneBullets(scanResult.onSceneBullets);
          setInteractionBullets(scanResult.interactionBullets);
          setToxRedFlagBullets(scanResult.toxRedFlagBullets);
          setIsScanning(false);

          if (scanResult.medications.length > 0) {
            const initialEntries = resolveScannedMedicationsHierarchy(
              scanResult.medications,
              scanResult.brandBreakdowns ?? []
            );
            const brandCount = initialEntries.filter((entry) => entry.kind === 'brand').length;
            const activeDrugCount = initialEntries.reduce(
              (sum, entry) => sum + (entry.kind === 'brand' ? entry.group.constituents.length : 1),
              0
            );
            trackEvent('prescription_scan_completed', {
              method: 'photo',
              extracted_count: initialEntries.length,
              brand_count: brandCount,
              active_drug_count: activeDrugCount,
              mode: isToxicityMode ? 'toxicity' : 'standard',
            });
            const firstEntry = initialEntries[0];
            const initialSelection =
              firstEntry?.kind === 'brand'
                ? firstEntry.group.brandName
                : firstEntry?.drugName ?? scanResult.medications[0];
            onSelectMedication(initialSelection, { scrollToResults: false });
          } else {
            trackEvent('prescription_scan_failed', { method: 'photo', reason: 'empty_result' });
            setScanError(
              'No clearly readable medication names were detected. Try a clearer photo or search above.'
            );
          }
        } catch (err) {
          setIsScanning(false);
          trackEvent('prescription_scan_failed', { method: 'photo', reason: 'api_error' });
          setScanError(
            err instanceof Error
              ? err.message
              : 'Unable to scan prescription image with Gemini AI.'
          );
        }
      })();
    },
    [onFirstInteract, onSelectMedication, onUploadActiveChange, isToxicityMode]
  );

  const handleExtractPastedText = useCallback(() => {
    const trimmed = pastedText.trim();
    if (!trimmed) {
      setScanError('Please type or paste a list of medications first.');
      return;
    }

    onFirstInteract?.();
    setScanError(null);
    setIsScanning(true);
    onUploadActiveChange?.(true);
    trackEvent('prescription_scan_started', { method: 'paste' });

    void (async () => {
      try {
        const scanResult = await extractMedicationsFromPastedText(trimmed);
        setScannedMedications(scanResult.medications);
        setBrandBreakdowns(scanResult.brandBreakdowns ?? []);
        setPatientConditions(scanResult.patientConditions);
        setOnSceneBullets(scanResult.onSceneBullets);
        setInteractionBullets(scanResult.interactionBullets);
        setToxRedFlagBullets(scanResult.toxRedFlagBullets);
        setIsScanning(false);

        if (scanResult.medications.length > 0) {
          const initialEntries = resolveScannedMedicationsHierarchy(
            scanResult.medications,
            scanResult.brandBreakdowns ?? []
          );
          const brandCount = initialEntries.filter((entry) => entry.kind === 'brand').length;
          const activeDrugCount = initialEntries.reduce(
            (sum, entry) => sum + (entry.kind === 'brand' ? entry.group.constituents.length : 1),
            0
          );
          trackEvent('prescription_scan_completed', {
            method: 'paste',
            extracted_count: initialEntries.length,
            brand_count: brandCount,
            active_drug_count: activeDrugCount,
            mode: isToxicityMode ? 'toxicity' : 'standard',
          });
          const firstEntry = initialEntries[0];
          const initialSelection =
            firstEntry?.kind === 'brand'
              ? firstEntry.group.brandName
              : firstEntry?.drugName ?? scanResult.medications[0];
          onSelectMedication(initialSelection, { scrollToResults: false });
        } else {
          trackEvent('prescription_scan_failed', { method: 'paste', reason: 'empty_result' });
          setScanError(
            'No UK medication names were detected in the pasted text. Check the text or search above.'
          );
        }
      } catch (err) {
        setIsScanning(false);
        trackEvent('prescription_scan_failed', { method: 'paste', reason: 'api_error' });
        setScanError(
          err instanceof Error
            ? err.message
            : 'Unable to extract medications from pasted text.'
        );
      }
    })();
  }, [pastedText, onFirstInteract, onSelectMedication, onUploadActiveChange, isToxicityMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleClearAll = () => {
    if (imagePreviewUrl || pastedText.trim() !== '' || scannedMedications.length > 0 || scanError) {
      trackEvent('prescription_cleared', { tab: activeTab });
    }
    setImagePreviewUrl(null);
    setImageFileName(null);
    setPastedText('');
    setScannedMedications([]);
    setBrandBreakdowns([]);
    setPatientConditions([]);
    setOnSceneBullets([]);
    setInteractionBullets([]);
    setToxRedFlagBullets([]);
    setScanError(null);
    setIsScanning(false);
    onUploadActiveChange?.(false);
  };

  const resolvedEntries = useMemo(
    () => resolveScannedMedicationsHierarchy(scannedMedications, brandBreakdowns),
    [scannedMedications, brandBreakdowns]
  );

  const brandEntries = useMemo(
    () =>
      resolvedEntries.filter(
        (entry): entry is Extract<ScannedMedicationEntry, { kind: 'brand' }> =>
          entry.kind === 'brand'
      ),
    [resolvedEntries]
  );

  const singleEntries = useMemo(
    () =>
      resolvedEntries.filter(
        (entry): entry is Extract<ScannedMedicationEntry, { kind: 'single' }> =>
          entry.kind === 'single'
      ),
    [resolvedEntries]
  );

  const totalActiveDrugCount = useMemo(
    () =>
      resolvedEntries.reduce(
        (sum, entry) => sum + (entry.kind === 'brand' ? entry.group.constituents.length : 1),
        0
      ),
    [resolvedEntries]
  );

  useEffect(() => {
    onSavedCountChange?.(resolvedEntries.length);
  }, [resolvedEntries.length, onSavedCountChange]);

  const hasAnyContent = Boolean(
    imagePreviewUrl || pastedText.trim() !== '' || scannedMedications.length > 0 || scanError
  );

  const hasStandardSummary = patientConditions.length > 0 || onSceneBullets.length > 0;
  const hasToxicitySummary = interactionBullets.length > 0 || toxRedFlagBullets.length > 0;

  return (
    <div
      className={`rounded-xl border p-3.5 sm:p-4 transition-all ${
        !isOpen ? 'hidden' : ''
      } ${
        isToxicityMode
          ? 'bg-rose-50/50 border-rose-200'
          : 'bg-emerald-50/40 border-emerald-200'
      }`}
    >
      {/* Hidden File Inputs for Photo Library / File Picker and Mobile Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload prescription or medication list photo"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Take photo of prescription or medication list with camera"
      />

      {/* Top Header + Two-Tab Switcher ("Upload Photo" vs "Paste Med List") */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div
          role="tablist"
          aria-label="Prescription input mode"
          className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200 shadow-2xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'photo'}
            onClick={() => {
              if (activeTab !== 'photo') {
                trackEvent('prescription_tab_selected', { tab: 'photo' });
              }
              setActiveTab('photo');
              setScanError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'photo'
                ? isToxicityMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-ambulance-green text-white shadow-sm'
                : isToxicityMode
                ? 'bg-white text-slate-700 border border-slate-200/80 hover:border-rose-300 hover:text-rose-700 shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:border-emerald-300 hover:text-ambulance-green shadow-2xs'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Upload Photo</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'paste'}
            onClick={() => {
              if (activeTab !== 'paste') {
                trackEvent('prescription_tab_selected', { tab: 'paste' });
              }
              setActiveTab('paste');
              setScanError(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'paste'
                ? isToxicityMode
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-ambulance-green text-white shadow-sm'
                : isToxicityMode
                ? 'bg-white text-rose-700 border border-rose-200 hover:border-rose-400 hover:bg-rose-50/70 shadow-2xs'
                : 'bg-white text-ambulance-green border border-emerald-200 hover:border-ambulance-green hover:bg-emerald-50/70 shadow-2xs'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Type / Paste Multiple Meds</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            if (hasAnyContent || isScanning) {
              handleClearAll();
            } else {
              onToggleOpen();
            }
          }}
          aria-label="Clear multiple meds and prescription scanner"
          title="Clear uploaded photo or multiple medications list"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* TAB 1: UPLOAD PHOTO (Drag-and-Drop / Camera & Photo Picker) */}
      {activeTab === 'photo' ? (
        !imagePreviewUrl ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all cursor-pointer ${
              isDragging
                ? isToxicityMode
                  ? 'border-rose-600 bg-rose-100/60 scale-[0.99]'
                  : 'border-ambulance-green bg-emerald-100/60 scale-[0.99]'
                : isToxicityMode
                ? 'border-rose-300 bg-white/90 hover:border-rose-500 hover:bg-white'
                : 'border-emerald-300 bg-white/90 hover:border-ambulance-green hover:bg-white'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full mx-auto mb-2.5 flex items-center justify-center ${
                isToxicityMode
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-100 text-ambulance-green'
              }`}
            >
              <Upload className="w-5 h-5" aria-hidden="true" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Drag &amp; drop a prescription or medication list photo here
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports repeat prescriptions, discharge letters, blister packs, or medicine boxes
            </p>

            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-3.5 flex flex-wrap items-center justify-center gap-2"
            >
              {/* Mobile Camera Button */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-xs transition-all cursor-pointer active:scale-[0.98] ${
                  isToxicityMode
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-ambulance-green hover:bg-emerald-800'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Take Photo</span>
              </button>

              {/* Photo Library / File Picker Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border shadow-2xs transition-all cursor-pointer active:scale-[0.98] ${
                  isToxicityMode
                    ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                    : 'border-emerald-300 text-ambulance-green hover:bg-emerald-50'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Choose Photo / File</span>
              </button>
            </div>
          </div>
        ) : (
          /* Uploaded Image Preview Bar */
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={imagePreviewUrl}
                alt="Uploaded prescription or medication list"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                  {imageFileName || 'Uploaded Prescription Image'}
                </p>
                {isScanning ? (
                  <p
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${
                      isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                    }`}
                  >
                    <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                    <span>Scanning medications &amp; clinical summary…</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {scannedMedications.length > 0
                      ? `Detected ${scannedMedications.length} medication${
                          scannedMedications.length === 1 ? '' : 's'
                        } — tap any drug below`
                      : 'Scan complete'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>New Photo</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                aria-label="Remove uploaded prescription image"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )
      ) : (
        /* TAB 2: TYPE / PASTE MULTIPLE MEDS */
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-3.5 space-y-2.5">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={3}
            maxLength={4000}
            placeholder="Type or paste multiple medications to study (e.g. 'amiodarone, bisoprolol, ramipril, apixaban') or paste text from a repeat prescription, discharge summary, or clinical letter..."
            aria-label="Type or paste multiple medications"
            className={`w-full p-3 text-base bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-y ${
              isToxicityMode
                ? 'border-rose-200 focus:ring-rose-600 focus:border-rose-600'
                : 'border-slate-300 focus:ring-ambulance-green focus:border-ambulance-green'
            }`}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
              <ShieldCheck
                className={`w-3.5 h-3.5 shrink-0 ${
                  isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                }`}
                aria-hidden="true"
              />
              <span>
                NHS numbers, DOBs, postcodes &amp; phone numbers are automatically scrubbed in your
                browser
              </span>
            </span>

            <div className="flex items-center gap-2 ml-auto">
              {(pastedText.trim() !== '' || scannedMedications.length > 0) && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isScanning}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExtractPastedText}
                disabled={isScanning || !pastedText.trim()}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isToxicityMode
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-ambulance-green hover:bg-emerald-800'
                }`}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                    <span>Extracting…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Extract Medications</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Output Area: Scan Error, Extracted Medication Pills & Holistic Bullet Summary */}
      {(scanError || scannedMedications.length > 0) && (
        <div className="mt-3.5 space-y-3.5">
          {/* Scan Error Message */}
          {scanError && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Extracted Medication Pills (with Brand -> Constituent Drug Hierarchy) */}
          {resolvedEntries.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                  }`}
                  aria-hidden="true"
                />
                <span>Extracted Medications ({resolvedEntries.length})</span>
                {totalActiveDrugCount > resolvedEntries.length && (
                  <span className="font-semibold normal-case text-slate-400">
                    (comprising {totalActiveDrugCount} active drugs)
                  </span>
                )}
              </div>

              {/* 1. Brand / Combination Products with Tree-Connected Constituent Drugs */}
              {brandEntries.length > 0 && (
                <div className="space-y-2.5">
                  {brandEntries.map(({ group }) => {
                    const isBrandActive =
                      activeSearchQuery.trim().toLowerCase() === group.brandName.toLowerCase();

                    return (
                      <button
                        key={group.id}
                        type="button"
                        aria-pressed={isBrandActive}
                        onClick={() => {
                          trackEvent('prescription_drug_clicked', {
                            item_name: group.brandName,
                            item_kind: 'brand',
                            mode: isToxicityMode ? 'toxicity' : 'standard',
                          });
                          onSelectMedication(group.brandName, {
                            scrollToResults: true,
                            brandGroupId: group.id,
                          });
                        }}
                        className={`w-full group text-left rounded-xl border p-2.5 sm:p-3 bg-white shadow-2xs transition-all cursor-pointer ${
                          isBrandActive
                            ? isToxicityMode
                              ? 'border-rose-500 ring-2 ring-rose-500/20'
                              : 'border-ambulance-green ring-2 ring-ambulance-green/20'
                            : isToxicityMode
                            ? 'border-rose-200/90 hover:border-rose-400'
                            : 'border-emerald-200/90 hover:border-ambulance-green'
                        }`}
                      >
                        <div
                          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-left transition-all border ${
                            isBrandActive
                              ? isToxicityMode
                                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                : 'bg-ambulance-green text-white border-ambulance-green shadow-sm'
                              : isToxicityMode
                              ? 'bg-rose-50/70 border-rose-200 group-hover:border-rose-500 text-slate-900'
                              : 'bg-emerald-50/70 border-emerald-200 group-hover:border-ambulance-green text-slate-900'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  isBrandActive
                                    ? 'bg-white/20 text-white'
                                    : isToxicityMode
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-ambulance-green text-white'
                                }`}
                              >
                                <Layers className="w-3 h-3 shrink-0" aria-hidden="true" />
                                <span>
                                  {group.constituents.length > 1
                                    ? `${group.constituents.length} Active Drugs`
                                    : 'Brand'}
                                </span>
                              </span>
                              <span className="text-xs sm:text-sm font-extrabold truncate">
                                {group.brandName}
                              </span>
                            </div>
                            <p
                              className={`mt-1 text-[11px] sm:text-xs font-medium truncate ${
                                isBrandActive
                                  ? 'text-white/90'
                                  : isToxicityMode
                                  ? 'text-rose-900/80'
                                  : 'text-emerald-900/80'
                              }`}
                            >
                              Comprises:{' '}
                              {group.constituents.map((item) => item.name).join(' / ')}
                            </p>
                          </div>
                        </div>

                        {/* Tree-Connected Separate Constituent Drug Rows (clicking any row selects the parent brand) */}
                        <div
                          className={`mt-2 ml-2 pl-3 border-l-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 ${
                            isToxicityMode ? 'border-rose-300' : 'border-emerald-300'
                          }`}
                        >
                          {group.constituents.map((item) => (
                            <div key={`${group.id}::${item.id}::${item.name}`} className="relative">
                              <span
                                aria-hidden="true"
                                className={`hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-0.5 ${
                                  isToxicityMode ? 'bg-rose-300' : 'bg-emerald-300'
                                }`}
                              />
                              <div
                                className={`w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-left text-xs border transition-colors ${
                                  isToxicityMode
                                    ? 'bg-slate-50 border-rose-200/80 text-slate-800 font-medium'
                                    : 'bg-slate-50 border-emerald-200/80 text-slate-800 font-medium'
                                }`}
                              >
                                <ArrowDownRight
                                  className={`w-3 h-3 shrink-0 ${
                                    isToxicityMode ? 'text-rose-500' : 'text-emerald-600'
                                  }`}
                                  aria-hidden="true"
                                />
                                <span className="truncate">{item.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. Standalone Generic Medications */}
              {singleEntries.length > 0 && (
                <div>
                  {brandEntries.length > 0 && (
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Single Generic Medications
                    </p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {singleEntries.map(({ drugName }) => {
                      const isActiveDrug =
                        activeSearchQuery.trim().toLowerCase() === drugName.toLowerCase();

                      return (
                        <button
                          key={drugName}
                          type="button"
                          onClick={() => {
                            trackEvent('prescription_drug_clicked', {
                              item_name: drugName,
                              item_kind: 'single',
                              mode: isToxicityMode ? 'toxicity' : 'standard',
                            });
                            onSelectMedication(drugName, { scrollToResults: true });
                          }}
                          className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all cursor-pointer border ${
                            isActiveDrug
                              ? isToxicityMode
                                ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-sm'
                                : 'bg-ambulance-green text-white border-ambulance-green font-semibold shadow-sm'
                              : isToxicityMode
                              ? 'bg-white border-rose-200 text-slate-800 font-medium hover:border-rose-600 hover:shadow-sm'
                              : 'bg-white border-emerald-200 text-slate-800 font-medium hover:border-ambulance-green hover:shadow-sm'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5 min-w-0">
                            <Pill
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isActiveDrug
                                  ? isToxicityMode
                                    ? 'text-rose-200'
                                    : 'text-nhs-warmYellow'
                                  : isToxicityMode
                                  ? 'text-rose-600'
                                  : 'text-emerald-600'
                              }`}
                              aria-hidden="true"
                            />
                            <span className="truncate">{drugName}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Streamlined Bullet-Point Summary Tile */}
          {!isScanning &&
            scannedMedications.length > 0 &&
            (isToxicityMode ? hasToxicitySummary : hasStandardSummary) && (
              <div
                className={`rounded-xl border p-3.5 sm:p-4 shadow-2xs transition-colors ${
                  isToxicityMode
                    ? 'bg-white border-rose-300 ring-1 ring-rose-200/70'
                    : 'bg-white border-emerald-300 ring-1 ring-emerald-200/70'
                }`}
              >
                {isToxicityMode ? (
                  /* TOXICITY MODE: Two concise bullet sections */
                  <div className="space-y-3.5">
                    {interactionBullets.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Skull
                            className="w-4 h-4 text-rose-600 shrink-0"
                            aria-hidden="true"
                          />
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-800">
                            Drug Interactions &amp; Synergies
                          </h4>
                        </div>
                        <ul className="space-y-1.5">
                          {interactionBullets.map((point, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-700 leading-snug"
                            >
                              <AlertTriangle
                                className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {toxRedFlagBullets.length > 0 && (
                      <div
                        className={
                          interactionBullets.length > 0
                            ? 'pt-3 border-t border-rose-100'
                            : ''
                        }
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Key Overdose Red Flags to Watch
                        </h4>
                        <ul className="space-y-1.5">
                          {toxRedFlagBullets.map((point, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-700 leading-snug"
                            >
                              <CheckCircle2
                                className="w-4 h-4 text-rose-600 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  /* STANDARD MODE: Two concise bullet sections */
                  <div className="space-y-3.5">
                    {patientConditions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope
                            className="w-4 h-4 text-ambulance-green shrink-0"
                            aria-hidden="true"
                          />
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900">
                            Likely Patient Conditions
                          </h4>
                        </div>
                        <ul className="space-y-1.5">
                          {patientConditions.map((condition, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-700 leading-snug"
                            >
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {onSceneBullets.length > 0 && (
                      <div
                        className={
                          patientConditions.length > 0
                            ? 'pt-3 border-t border-emerald-100'
                            : ''
                        }
                      >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Key On-Scene Considerations
                        </h4>
                        <ul className="space-y-1.5">
                          {onSceneBullets.map((point, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-slate-700 leading-snug"
                            >
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400 text-center">
                  This content was generated by Gemini Ai which can make mistakes
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
