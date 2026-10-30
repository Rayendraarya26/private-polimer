import React from 'react';
import { ArrowLeft, ArrowRight, Save, Send, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface StickyFormActionsProps {
  onBack?: () => void;
  onSaveDraft?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  backLabel?: string;
  saveDraftLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  canGoBack?: boolean;
  isLastStep?: boolean;
  disabled?: boolean;
  errorCount?: number;
  onErrorClick?: () => void;
  className?: string;
  isSticky?: boolean;
}

export const StickyFormActions: React.FC<StickyFormActionsProps> = ({
  onBack,
  onSaveDraft,
  onNext,
  onSubmit,
  backLabel = 'Sebelumnya',
  saveDraftLabel = 'Simpan Draft',
  nextLabel = 'Selanjutnya',
  submitLabel = 'Kirim Permohonan',
  isSubmitting = false,
  isSavingDraft = false,
  canGoBack = true,
  isLastStep = false,
  disabled = false,
  errorCount = 0,
  onErrorClick,
  className,
  isSticky = false,
}) => {
  return (
    <div
      className={cn(
        'w-full pt-4 transition-all',
        isSticky &&
          'sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3.5 px-4 sm:px-6 shadow-elevated rounded-t-2xl -mx-4 sm:-mx-6 mt-6',
        className
      )}
    >
      {/* Error Callout Banner if validation failed */}
      {errorCount > 0 && (
        <div
          onClick={onErrorClick}
          className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs text-rose-800 cursor-pointer hover:bg-rose-100/70 transition-colors animate-in fade-in-50 duration-200"
          title="Klik untuk berpindah ke kolom yang perlu diperbaiki"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">
              Terdapat {errorCount} isian wajib yang belum lengkap atau belum valid pada langkah ini.
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-700 underline shrink-0">
            Lihat Kolom &rarr;
          </span>
        </div>
      )}

      {/* Main Buttons Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Back Button */}
        <div>
          {canGoBack && onBack && (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || isSavingDraft}
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="w-full sm:w-auto px-5 py-2.5 font-semibold text-xs border-slate-300 hover:bg-slate-50"
            >
              {backLabel}
            </Button>
          )}
        </div>

        {/* Right: Save Draft & Next / Submit Buttons */}
        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting || isSavingDraft}
              isLoading={isSavingDraft}
              onClick={onSaveDraft}
              leftIcon={!isSavingDraft ? <Save className="w-4 h-4 text-slate-600" /> : undefined}
              className="flex-1 sm:flex-initial px-4 py-2.5 font-semibold text-xs border border-slate-200 shadow-2xs hover:bg-slate-100"
            >
              {saveDraftLabel}
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting || isSavingDraft || disabled}
              isLoading={isSubmitting}
              onClick={onSubmit}
              rightIcon={!isSubmitting ? <Send className="w-4 h-4" /> : undefined}
              className="flex-1 sm:flex-initial px-6 py-2.5 font-bold text-xs shadow-sm bg-brand-600 hover:bg-brand-700"
            >
              {isSubmitting ? 'Mengirim...' : submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting || isSavingDraft || disabled}
              onClick={onNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="flex-1 sm:flex-initial px-6 py-2.5 font-bold text-xs shadow-sm bg-brand-600 hover:bg-brand-700"
            >
              {nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyFormActions;
