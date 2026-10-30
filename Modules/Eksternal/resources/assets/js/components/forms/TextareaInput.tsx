import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  showCount?: boolean;
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  (
    {
      className,
      hasError = false,
      showCount = false,
      maxLength,
      value,
      disabled,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const currentLength = value ? String(value).length : 0;

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          rows={rows}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          className={cn(
            'w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-300 p-3.5 transition-all duration-200 shadow-2xs resize-y min-h-[88px]',
            'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 hover:border-slate-400',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:shadow-none',
            hasError &&
              'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20 text-rose-950',
            className
          )}
          {...props}
        />

        {showCount && maxLength && (
          <div className="flex justify-end mt-1 text-[11px] text-slate-400 font-mono">
            <span>
              {currentLength} / {maxLength} karakter
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
