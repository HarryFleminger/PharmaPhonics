import React from 'react';
import { AlertTriangle, Volume2, X } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  variant: 'clinical-warning' | 'pronunciation-notice';
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose?: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  variant,
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const isWarning = variant === 'clinical-warning';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose ?? onConfirm}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        {/* Top Accent Banner */}
        <div
          className={`px-5 py-4 flex items-center justify-between gap-3 border-b ${
            isWarning
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                isWarning
                  ? 'bg-amber-100 text-amber-700 border border-amber-300/80'
                  : 'bg-emerald-100 text-ambulance-green border border-emerald-300/80'
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              )}
            </div>
            <h2 id="notice-modal-title" className="text-base sm:text-lg font-bold tracking-tight">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose ?? onConfirm}
            aria-label="Close notice"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{message}</p>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all cursor-pointer active:scale-[0.99] ${
                isWarning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-ambulance-green hover:bg-emerald-800'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
