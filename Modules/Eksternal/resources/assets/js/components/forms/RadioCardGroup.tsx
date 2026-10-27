import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface RadioCardOption {
  value: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface RadioCardGroupProps {
  options: RadioCardOption[];
  value?: string;
  onChange?: (val: string) => void;
  name?: string;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
  disabled?: boolean;
}

export const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  options,
  value,
  onChange,
  name,
  gridCols = 2,
  className,
  disabled = false,
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled}
      className={cn('grid gap-3.5', gridClasses[gridCols], className)}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        const isDisabled = disabled || opt.disabled;

        return (
          <div
            key={opt.value}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isDisabled ? -1 : 0}
            onClick={() => !isDisabled && onChange?.(opt.value)}
            onKeyDown={(e) => {
              if (!isDisabled && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                onChange?.(opt.value);
              }
            }}
            className={cn(
              'p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer select-none text-left relative focus:outline-none focus-visible:ring-3 focus-visible:ring-brand-500/30',
              isSelected
                ? 'bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/15 shadow-xs'
                : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs',
              isDisabled && 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-200'
            )}
          >
            <div>
              {/* Header row: Icon / Title / Badge / Checkmark */}
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {opt.icon && (
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'bg-brand-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {opt.icon}
                    </div>
                  )}

                  <span
                    className={cn(
                      'text-sm font-bold truncate leading-tight',
                      isSelected ? 'text-brand-950' : 'text-slate-800'
                    )}
                  >
                    {opt.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {opt.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                      {opt.badge}
                    </span>
                  )}

                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                  )}
                </div>
              </div>

              {opt.description && (
                <p
                  className={cn(
                    'text-xs leading-relaxed mt-1',
                    isSelected ? 'text-brand-800' : 'text-slate-500'
                  )}
                >
                  {opt.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RadioCardGroup;
