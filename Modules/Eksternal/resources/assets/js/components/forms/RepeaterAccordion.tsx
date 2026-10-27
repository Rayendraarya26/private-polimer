import React, { useState } from 'react';
import {
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface RepeaterItem {
  id: string;
  title: string;
  subtitle?: string;
  subtotalBadge?: string;
  isComplete?: boolean;
}

export interface RepeaterAccordionProps {
  items: RepeaterItem[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onAddItem?: () => void;
  onDuplicateLast?: () => void;
  onDeleteItem?: (id: string, index: number) => void;
  addLabel?: string;
  duplicateLabel?: string;
  children: (item: RepeaterItem, index: number, isExpanded: boolean) => React.ReactNode;
  className?: string;
}

export const RepeaterAccordion: React.FC<RepeaterAccordionProps> = ({
  items,
  activeIndex,
  onActiveIndexChange,
  onAddItem,
  onDuplicateLast,
  onDeleteItem,
  addLabel = 'Tambah Item Baru',
  duplicateLabel = 'Duplikat Terakhir',
  children,
  className,
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(0);

  const active = activeIndex !== undefined ? activeIndex : internalActiveIndex;

  const handleToggle = (idx: number) => {
    const nextIndex = active === idx ? -1 : idx;
    if (onActiveIndexChange) {
      onActiveIndexChange(nextIndex);
    } else {
      setInternalActiveIndex(nextIndex);
    }
  };

  return (
    <div className={cn('space-y-4 w-full', className)}>
      {/* List of Accordion Cards */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isExpanded = active === idx;

          return (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border transition-all duration-200 overflow-hidden',
                isExpanded
                  ? 'bg-white border-brand-300 ring-2 ring-brand-500/10 shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
              )}
            >
              {/* Accordion Header */}
              <div
                onClick={() => handleToggle(idx)}
                className={cn(
                  'px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors',
                  isExpanded ? 'bg-slate-50/80 border-b border-slate-200' : 'hover:bg-slate-50/50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Sequence Badge */}
                  <span
                    className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs transition-colors',
                      isExpanded
                        ? 'bg-brand-600 text-white'
                        : item.isComplete
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    )}
                  >
                    {idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {item.title || `Item #${idx + 1}`}
                      </h4>
                      {item.isComplete && !isExpanded && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.2 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terisi Lengkap
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Right Action Icons: Subtotal, Delete, Expand/Collapse */}
                <div className="flex items-center gap-3 shrink-0">
                  {item.subtotalBadge && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Subtotal
                      </span>
                      <span className="text-xs font-bold text-brand-700 font-mono">
                        {item.subtotalBadge}
                      </span>
                    </div>
                  )}

                  {items.length > 1 && onDeleteItem && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id, idx);
                      }}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg h-auto"
                      title="Hapus data ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}

                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition-transform duration-200',
                      isExpanded && 'rotate-180 text-brand-600'
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Accordion Body Content */}
              {isExpanded && (
                <div className="p-5 sm:p-6 bg-white animate-in fade-in-50 duration-150">
                  {children(item, idx, isExpanded)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Toolbar: Add Item & Duplicate */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {onAddItem && (
          <Button
            type="button"
            variant="outline"
            onClick={onAddItem}
            leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
            className="px-4 py-2.5 text-xs font-bold border-brand-300 text-brand-700 hover:bg-brand-50/80 shadow-2xs"
          >
            {addLabel}
          </Button>
        )}

        {items.length > 0 && onDuplicateLast && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDuplicateLast}
            leftIcon={<Copy className="w-4 h-4 text-slate-500" />}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            title="Salin spesifikasi dari item terakhir"
          >
            {duplicateLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default RepeaterAccordion;
