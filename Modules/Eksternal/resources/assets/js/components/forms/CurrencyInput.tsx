import React, { useState, useEffect, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number | string;
  onValueChange?: (val: number) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value = 0,
      onValueChange,
      onChange,
      className,
      hasError = false,
      disabled,
      placeholder = '0',
      ...props
    },
    ref
  ) => {
    const formatDisplay = (val: number | string): string => {
      if (val === '' || val === null || val === undefined) return '';
      const num = typeof val === 'number' ? val : parseInt(String(val).replace(/\D/g, ''), 10);
      if (isNaN(num)) return '';
      return num.toLocaleString('id-ID');
    };

    const [displayVal, setDisplayVal] = useState<string>(() => formatDisplay(value));

    useEffect(() => {
      setDisplayVal(formatDisplay(value));
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawDigits = e.target.value.replace(/\D/g, '');
      const numericVal = rawDigits === '' ? 0 : parseInt(rawDigits, 10);

      setDisplayVal(rawDigits === '' ? '' : numericVal.toLocaleString('id-ID'));
      onValueChange?.(numericVal);
      onChange?.(e);
    };

    return (
      <div className="relative flex items-center w-full">
        {/* Rp Badge Prefix */}
        <div className="absolute left-3.5 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs select-none pointer-events-none border border-slate-200">
          Rp
        </div>

        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={displayVal}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            'w-full h-[42px] bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold rounded-xl border border-slate-300 pl-14 pr-4 text-right transition-all duration-200 shadow-2xs font-mono',
            'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 hover:border-slate-400',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:shadow-none',
            hasError &&
              'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20 text-rose-950',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
