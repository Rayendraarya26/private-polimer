import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TwoRowSelectOption {
  value: string | number;
  label: string;       // Baris 1: Judul / Nama Utama (misal: Nama Alat)
  subLabel?: string;   // Baris 2: Sub-keterangan / Tarif (misal: Rp 1.250.000)
  disabled?: boolean;
}

export interface TwoRowSelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  options: TwoRowSelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number, selectedOption?: TwoRowSelectOption) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  className?: string;
  containerClassName?: string;
  noOptionsMessage?: string;
  id?: string;
}

export const TwoRowSelect: React.FC<TwoRowSelectProps> = ({
  label,
  helperText,
  error,
  required = false,
  options = [],
  value,
  onChange,
  onClear,
  placeholder = '-- Pilih Opsi --',
  searchPlaceholder = 'Cari berdasarkan nama atau keterangan...',
  disabled = false,
  isClearable = true,
  isSearchable = true,
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

  // Filter opsi sesuai input pencarian (mencari di label baris 1 dan subLabel baris 2)
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchTerm.trim()) return options;
    const lowerQuery = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(lowerQuery))
    );
  }, [options, searchTerm, isSearchable]);

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
      if (isSearchable) {
        setTimeout(() => searchInputRef.current?.focus(), 40);
      }
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, isSearchable]);

  // Pilih item
  const handleSelectOption = useCallback(
    (option: TwoRowSelectOption) => {
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
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className={cn("relative", isOpen && "z-30")}>
        {/* Tombol Pemicu Dropdown Utama */}
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'w-full flex items-center justify-between text-left text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 transition-all outline-none shadow-xs',
            'hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
            disabled && 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200 shadow-none',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            isOpen && 'ring-2 ring-brand-500/20 border-brand-500',
            className
          )}
        >
          <div className="truncate mr-2 leading-tight">
            {selectedOption ? (
              <span className="font-medium text-slate-800">{selectedOption.label}</span>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>

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
            className="absolute z-50 mt-1.5 w-full left-0 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Input Pencarian */}
            {isSearchable && (
              <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                <div className="relative flex items-center w-full rounded-lg border border-slate-200 bg-white px-3 h-10 transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    style={{ height: '100%', lineHeight: '1.5' }}
                    className="w-full h-full bg-transparent text-xs leading-normal text-slate-800 placeholder:text-slate-400 border-0 px-0 py-1.5 focus:ring-0 focus:outline-none shadow-none"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        searchInputRef.current?.focus();
                      }}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors shrink-0 ml-1.5"
                      title="Hapus pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* List Opsi Dropdown 2 Baris */}
            <div
              ref={optionsListRef}
              role="listbox"
              className="max-h-60 overflow-y-auto p-1.5 space-y-1"
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
                          ? 'bg-brand-50 text-brand-800'
                          : isHighlighted
                          ? 'bg-slate-100 text-slate-800'
                          : 'hover:bg-slate-50 text-slate-700'
                      )}
                    >
                      {/* Tampilan 2 Baris */}
                      <div className="flex flex-col min-w-0 pr-2">
                        {/* Baris 1: Label Utama */}
                        <span
                          className={cn(
                            'truncate leading-tight',
                            isSelected ? 'font-semibold text-brand-800' : 'font-medium text-slate-800'
                          )}
                        >
                          {opt.label}
                        </span>

                        {/* Baris 2: Sub-keterangan / Tarif */}
                        {opt.subLabel && (
                          <span
                            className={cn(
                              'text-[11px] truncate mt-1',
                              isSelected ? 'text-brand-600 font-medium' : 'text-slate-500 font-normal'
                            )}
                          >
                            {opt.subLabel}
                          </span>
                        )}
                      </div>

                      {/* Ikon Centang Opsi Terpilih */}
                      {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0 ml-2" />}
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

      {/* Pesan Bantuan atau Error */}
      {error ? (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 font-normal">{helperText}</p>
      ) : null}
    </div>
  );
};
