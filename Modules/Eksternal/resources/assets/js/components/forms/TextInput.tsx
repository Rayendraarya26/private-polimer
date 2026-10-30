import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      leftIcon,
      rightIcon,
      isClearable = false,
      onClear,
      hasError = false,
      disabled,
      type = 'text',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const showClear = isClearable && !disabled && Boolean(value && String(value).length > 0);

    const handleClearClick = (e: React.MouseEvent) => {
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

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 z-10">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full h-[42px] bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-300 px-4 transition-all duration-200 shadow-2xs',
            'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 hover:border-slate-400',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200 disabled:shadow-none',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon || showClear ? 'pr-10' : 'pr-4',
            hasError &&
              'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20 text-rose-950',
            className
          )}
          {...props}
        />

        {showClear && !rightIcon && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClearClick}
            aria-label="Hapus teks"
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400 z-10 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
