import React from 'react';
import { AlertTriangle, ArrowRight, UserCheck, Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface RevisionBannerCalloutProps {
  catatan?: string | null;
  petugas?: string | null;
  tanggal?: string | null;
  onJumpToField?: () => void;
  jumpLabel?: string;
  className?: string;
}

export const RevisionBannerCallout: React.FC<RevisionBannerCalloutProps> = ({
  catatan,
  petugas,
  tanggal,
  onJumpToField,
  jumpLabel = 'Periksa Kolom Terkait',
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm animate-in fade-in-50 duration-200 text-amber-950 space-y-3',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">
              Permohonan Memerlukan Perbaikan Data (Revisi)
            </h4>
            <div className="flex items-center gap-3 text-xs text-amber-800 mt-0.5">
              {petugas && (
                <span className="inline-flex items-center gap-1 font-medium">
                  <UserCheck className="w-3.5 h-3.5" /> Verifikator: {petugas}
                </span>
              )}
              {tanggal && (
                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> {tanggal}
                </span>
              )}
            </div>
          </div>
        </div>

        {onJumpToField && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onJumpToField}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="hidden sm:inline-flex text-xs font-bold border-amber-400 bg-white hover:bg-amber-100 text-amber-900 shadow-2xs"
          >
            {jumpLabel}
          </Button>
        )}
      </div>

      {/* Note Content Box */}
      <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200 text-xs sm:text-sm leading-relaxed text-slate-800 shadow-2xs">
        <span className="font-bold text-amber-900 block mb-1">
          Catatan / Alasan Perbaikan dari Petugas:
        </span>
        <p className="whitespace-pre-line text-slate-700">
          {catatan && catatan.trim()
            ? catatan
            : 'Silakan periksa kembali data permohonan dan kelengkapan dokumen persyaratan Anda sesuai ketentuan.'}
        </p>
      </div>

      {onJumpToField && (
        <div className="sm:hidden pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onJumpToField}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="w-full text-xs font-bold border-amber-400 bg-white hover:bg-amber-100 text-amber-900"
          >
            {jumpLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RevisionBannerCallout;
