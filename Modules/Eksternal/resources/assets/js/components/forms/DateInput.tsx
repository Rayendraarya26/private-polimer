import React, { useRef, forwardRef } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
  showHumanPreview?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      hasError = false,
      isClearable = true,
      showHumanPreview = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);

    const formatHumanDate = (dateStr: string | number | readonly string[] | undefined): string => {
      if (!dateStr || typeof dateStr !== 'string') return '';
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch (e) {
        // ignore
      }
      return '';
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) {
        onClear();
      } else if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const humanDate = showHumanPreview ? formatHumanDate(value) : '';

    return (
      <div className="w-full space-y-1">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 z-10">
            <CalendarIcon className="w-4 h-4" />
          </div>

          <input
            ref={(node) => {
              // Handle forwardRef and internal ref
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }
              (internalInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }}
            type="date"
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={cn(
              'w-full h-[42px] bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-300 pl-10 pr-10 transition-all duration-200 shadow-2xs',
              'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 hover:border-slate-400',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:shadow-none',
              hasError &&
                'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20 text-rose-950',
              className
            )}
            {...props}
          />

          {isClearable && Boolean(value) && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Hapus tanggal"
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {humanDate && (
          <p className="text-xs text-brand-700 font-medium pl-1 flex items-center gap-1.5 animate-in fade-in-50 duration-150">
            <span>📅 {humanDate}</span>
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

export default DateInput;
