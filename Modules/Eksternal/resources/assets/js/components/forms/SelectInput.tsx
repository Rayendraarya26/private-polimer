import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectInputProps {
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number, selectedOption?: SelectOption) => void;
  onClear?: () => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  hasError?: boolean;
  className?: string;
  noOptionsMessage?: string;
  id?: string;
  name?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  options = [],
  value,
  onChange,
  onClear,
  placeholder = '-- Pilih Opsi --',
  searchPlaceholder = 'Ketik kata kunci pencarian...',
  disabled = false,
  isClearable = true,
  hasError = false,
  className,
  noOptionsMessage = 'Data tidak ditemukan',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [openUpward, setOpenUpward] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Selected option lookup
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    return options.find((opt) => String(opt.value) === String(value)) || null;
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const lowerQuery = searchTerm.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerQuery) ||
        (opt.description && opt.description.toLowerCase().includes(lowerQuery))
    );
  }, [options, searchTerm]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Viewport collision detection (auto-flip up if near bottom of screen)
  const checkPlacement = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 280px below and more space above, open upwards
      setOpenUpward(spaceBelow < 280 && spaceAbove > spaceBelow);
    }
  }, []);

  // Handle open state change
  useEffect(() => {
    if (isOpen) {
      checkPlacement();
      setSearchTerm('');
      setHighlightedIndex(
        filteredOptions.findIndex((opt) => selectedOption && opt.value === selectedOption.value)
      );
      setTimeout(() => searchInputRef.current?.focus(), 40);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, checkPlacement, filteredOptions, selectedOption]);

  // Select item
  const handleSelectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value, option);
      setIsOpen(false);
    },
    [onChange]
  );

  // Clear selected item
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onClear?.();
      onChange?.('', undefined);
    },
    [onChange, onClear]
  );

  // Keyboard navigation
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
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'w-full h-[42px] bg-white text-slate-900 text-sm rounded-xl border border-slate-300 px-4 text-left flex items-center justify-between transition-all duration-200 shadow-2xs cursor-pointer',
          'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 hover:border-slate-400',
          disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200 shadow-none',
          hasError && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20',
          isOpen && 'ring-2 ring-brand-500/20 border-brand-600',
          className
        )}
      >
        <span className={cn('truncate mr-2 leading-normal', !selectedOption && 'text-slate-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
          {isClearable && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="hover:text-slate-600 p-1 rounded-md transition-colors"
              title="Hapus pilihan"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isOpen && 'rotate-180 text-brand-600'
            )}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full left-0 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150',
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Search Header */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 bg-white px-3 h-10 transition-all focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm leading-normal text-slate-800 placeholder:text-slate-400 border-0 p-0 focus:ring-0 focus:outline-none"
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
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Listbox */}
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
                      'w-full text-left px-3.5 py-2.5 text-sm rounded-xl flex items-center justify-between transition-colors cursor-pointer',
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-400'
                        : isSelected
                        ? 'bg-brand-50 text-brand-700 font-semibold'
                        : isHighlighted
                        ? 'bg-slate-100 text-slate-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate">{opt.label}</div>
                      {opt.description && (
                        <div className="text-xs text-slate-400 font-normal truncate mt-0.5">
                          {opt.description}
                        </div>
                      )}
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-normal">
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectInput;
