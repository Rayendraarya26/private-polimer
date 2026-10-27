import React from 'react';
import { Cloud, CloudCheck, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type DraftStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface DraftStatusIndicatorProps {
  status: DraftStatus;
  lastSavedTime?: string | null;
  className?: string;
}

export const DraftStatusIndicator: React.FC<DraftStatusIndicatorProps> = ({
  status,
  lastSavedTime,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all select-none',
        status === 'saved' && 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
        status === 'saving' && 'bg-brand-50 text-brand-700 border border-brand-200/80',
        status === 'idle' && 'bg-slate-100 text-slate-600 border border-slate-200',
        status === 'error' && 'bg-rose-50 text-rose-700 border border-rose-200/80',
        className
      )}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600 shrink-0" />
          <span>Menyimpan draf...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <CloudCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            {lastSavedTime ? `Tersimpan otomatis ${lastSavedTime}` : 'Draf tersimpan'}
          </span>
        </>
      )}

      {status === 'idle' && (
        <>
          <Cloud className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Draf otomatis aktif</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Gagal menyimpan draf</span>
        </>
      )}
    </div>
  );
};

export default DraftStatusIndicator;
