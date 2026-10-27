import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { HelpCircle, AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  tooltip?: string;
  helperText?: string;
  helper?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  tooltip,
  helperText,
  helper,
  error,
  className,
  labelClassName,
  action,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const helpText = helperText || helper;

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {label && (
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={htmlFor}
                className={cn(
                  'text-sm font-semibold text-slate-800 select-none cursor-pointer',
                  labelClassName
                )}
              >
                {label}
                {required && (
                  <span className="text-rose-500 ml-1 font-bold" title="Wajib diisi">
                    *
                  </span>
                )}
              </label>

              {tooltip && (
                <div className="relative inline-flex items-center">
                  <button
                    type="button"
                    aria-label="Informasi tambahan"
                    onClick={() => setShowTooltip((prev) => !prev)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-slate-400 hover:text-brand-600 p-0.5 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>

                  {showTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl pointer-events-none animate-in fade-in-50 zoom-in-95 duration-150 leading-relaxed">
                      {tooltip}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {action && <div className="text-xs">{action}</div>}
        </div>
      )}

      {children}

      {error ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 mt-1.5 animate-in fade-in-50 duration-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helpText ? (
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{helpText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
