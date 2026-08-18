import React from 'react';
import { cn } from '../../utils/cn';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
  onClick,
}) => {
  const iconVariants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-brand-50 text-brand-600 border border-brand-200/60',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-600 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200/60',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden bg-white p-5 rounded-xl border border-slate-200/80 shadow-card transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-elevated hover:border-slate-300 hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h4>
        </div>

        {icon && (
          <div className={cn('p-2.5 rounded-xl shrink-0 flex items-center justify-center', iconVariants[variant])}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.value}
              {trend.label && (
                <span className="font-normal text-slate-500 ml-1">{trend.label}</span>
              )}
            </span>
          )}

          {subtitle && (
            <span className="text-slate-500 ml-auto">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
