import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            {label}
            {props.required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 z-10">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs rounded-lg border border-slate-300 py-2.5 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
              'disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed',
              leftIcon ? '!pl-10' : '!pl-3.5',
              rightIcon ? '!pr-10' : '!pr-3.5',
              error &&
                'border-rose-500 focus:ring-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-slate-400 z-10">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-600 animate-in fade-in-50 duration-200">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
