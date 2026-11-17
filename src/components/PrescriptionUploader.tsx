import React, { useState, useRef, useCallback } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Pill,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { extractMedicationsFromPrescriptionImage } from '../services/geminiClinicalService';

interface PrescriptionUploaderProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectMedication: (drugName: string) => void;
  activeSearchQuery: string;
  isToxicityMode?: boolean;
  onFirstInteract?: () => void;
}

export const PrescriptionUploader: React.FC<PrescriptionUploaderProps> = ({
  isOpen,
  onToggleOpen,
  onSelectMedication,
  activeSearchQuery,
  isToxicityMode = false,
  onFirstInteract,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedMedications, setScannedMedications] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const processImageFile = useCallback(
    (file: File) => {
      onFirstInteract?.();

      if (!file.type.startsWith('image/')) {
        setScanError('Please upload a valid image file (JPEG, PNG, WebP, or HEIC).');
        return;
      }

      setScanError(null);
      setImageFileName(file.name);
      setIsScanning(true);

      const reader = new FileReader();
      reader.onload = async () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        setImagePreviewUrl(result);

        const base64Match = result.match(/^data:([^;]+);base64,(.+)$/);
        if (!base64Match) {
          setIsScanning(false);
          setScanError('Could not read image data.');
          return;
        }

        const mimeType = base64Match[1];
        const base64Data = base64Match[2];

        try {
          const extracted = await extractMedicationsFromPrescriptionImage(base64Data, mimeType);
          setScannedMedications(extracted);
          setIsScanning(false);

          if (extracted.length > 0) {
            onSelectMedication(extracted[0]);
          } else {
            setScanError(
              'No clearly readable medication names were detected. Try a clearer photo or search above.'
            );
          }
        } catch (err) {
          setIsScanning(false);
          setScanError(
            err instanceof Error
              ? err.message
              : 'Unable to scan prescription image with Gemini AI.'
          );
        }
      };

      reader.onerror = () => {
        setIsScanning(false);
        setScanError('Failed to read the selected image file.');
      };

      reader.readAsDataURL(file);
    },
    [onFirstInteract, onSelectMedication]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset input value so re-uploading the same file triggers onChange
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

  const handleClearImage = () => {
    setImagePreviewUrl(null);
    setImageFileName(null);
    setScannedMedications([]);
    setScanError(null);
    setIsScanning(false);
  };

  if (!isOpen && !imagePreviewUrl && !isScanning) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border p-3.5 sm:p-4 transition-all ${
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

      {/* Top Header of Uploader Drawer */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Camera
            className={`w-4 h-4 shrink-0 ${
              isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
            }`}
            aria-hidden="true"
          />
          <h3
            className={`text-xs sm:text-sm font-bold truncate ${
              isToxicityMode ? 'text-rose-950' : 'text-emerald-950'
            }`}
          >
            Scan Prescription / Repeat Med List (Gemini Vision AI)
          </h3>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          aria-label="Close prescription scanner"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/70 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drag-and-Drop Zone / Camera & Photo Picker */}
      {!imagePreviewUrl ? (
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
        /* Uploaded Image Preview + Scanned Medications List */
        <div className="space-y-3">
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
                    <span>Scanning medications with Gemini Vision AI…</span>
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
                onClick={handleClearImage}
                aria-label="Remove uploaded prescription image"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Scan Error Message */}
          {scanError && (
            <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{scanError}</span>
            </div>
          )}

          {/* Extracted Medication Pills */}
          {scannedMedications.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    isToxicityMode ? 'text-rose-600' : 'text-ambulance-green'
                  }`}
                  aria-hidden="true"
                />
                <span>Extracted Medications ({scannedMedications.length})</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {scannedMedications.map((drugName) => {
                  const isActiveDrug =
                    activeSearchQuery.trim().toLowerCase() === drugName.toLowerCase();

                  return (
                    <button
                      key={drugName}
                      type="button"
                      onClick={() => onSelectMedication(drugName)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left text-xs sm:text-sm transition-all cursor-pointer border ${
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
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActiveDrug ? 'text-white' : 'text-slate-300'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
