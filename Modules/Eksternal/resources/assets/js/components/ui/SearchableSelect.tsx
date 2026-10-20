import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  options: SearchableSelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number, selectedOption?: SearchableSelectOption) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
  containerClassName?: string;
  noOptionsMessage?: string;
  id?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  helperText,
  error,
  required = false,
  options = [],
  value,
  onChange,
  onClear,
  placeholder = '-- Pilih Opsi --',
  searchPlaceholder = 'Ketik untuk mencari...',
  disabled = false,
  isClearable = true,
  className,
  containerClassName,
  noOptionsMessage = 'Data tidak ditemukan',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  // Cari opsi yang terpilih berdasarkan value
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    return options.find((opt) => String(opt.value) === String(value)) || null;
  }, [options, value]);

  // Filter opsi sesuai input pencarian
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lowerQuery = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        (opt.description && opt.description.toLowerCase().includes(lowerQuery))
    );
  }, [options, searchTerm]);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight dan search term saat dropdown buka/tutup
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setHighlightedIndex(
        filteredOptions.findIndex((opt) => selectedOption && opt.value === selectedOption.value)
      );
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Pilih item
  const handleSelectOption = useCallback(
    (option: SearchableSelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value, option);
      setIsOpen(false);
    },
    [onChange]
  );

  // Clear nilai terpilih
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear?.();
      onChange?.('', undefined);
    },
    [onChange, onClear]
  );

  // Keyboard navigation (Panah Bawah, Atas, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < filteredOptions.length - 1 ? prev + 1 : 0;
          scrollIntoView(next);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : filteredOptions.length - 1;
          scrollIntoView(next);
          return next;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const scrollIntoView = (index: number) => {
    const list = optionsListRef.current;
    if (!list) return;
    const items = list.getElementsByTagName('button');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  };

  return (
    <div className={cn('w-full space-y-1.5', containerClassName)} ref={containerRef}>
      {/* Label Komponen */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button Input Box */}
      <div className="relative">
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 py-2.5 px-3.5 text-left flex items-center justify-between transition-all duration-200 shadow-xs outline-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200 shadow-none',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            isOpen && 'ring-2 ring-brand-500/20 border-brand-500',
            className
          )}
        >
          <span className={cn('truncate mr-2', !selectedOption && 'text-slate-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
            {isClearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="hover:text-slate-600 transition-colors p-0.5 rounded"
                title="Hapus pilihan"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180 text-brand-600')}
            />
          </div>
        </button>

        {/* Panel Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Input Pencarian */}
            <div className="p-2 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 ml-1 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List Opsi Dropdown */}
            <div
              ref={optionsListRef}
              role="listbox"
              className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const isSelected = selectedOption?.value === opt.value;
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled}
                      onClick={() => handleSelectOption(opt)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors',
                        opt.disabled
                          ? 'opacity-50 cursor-not-allowed bg-transparent text-slate-400'
                          : isSelected
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : isHighlighted
                          ? 'bg-slate-100 text-slate-800'
                          : 'hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      <div className="truncate pr-2">
                        <div className="truncate">{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                            {opt.description}
                          </div>
                        )}
                      </div>

                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 font-normal">
                  {noOptionsMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper text atau Pesan Error */}
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium tracking-wide">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
