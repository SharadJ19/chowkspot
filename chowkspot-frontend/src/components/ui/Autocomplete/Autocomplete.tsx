// FILE: src/components/ui/Autocomplete/Autocomplete.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import styles from './Autocomplete.module.css';

export interface AutocompleteProps {
  options: readonly string[] | string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Type to search...',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [typedQuery, setTypedQuery] = useState<string | null>(null);
  const query = typedQuery !== null ? typedQuery : value;

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setTypedQuery(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setTypedQuery(null);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setTypedQuery('');
    setHighlightedIndex(0);
    setIsOpen(false);
  };

  // 💡 Keyboard navigation handler (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredOptions[highlightedIndex];
      if (selected) {
        handleSelect(selected);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <Input
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setTypedQuery(e.target.value);
          setHighlightedIndex(0); // 👈 Reset index inline on change instead of using an effect!
          setIsOpen(true);
          if (e.target.value === '') onChange('');
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        rightElement={
          value ? (
            <button
              type='button'
              onClick={handleClear}
              className={styles.clearSelectionBtn}
            >
              <X size={16} />
            </button>
          ) : (
            <Search size={16} />
          )
        }
      />

      {isOpen && (
        <div className={styles.dropdownList}>
          {filteredOptions.length === 0 ? (
            <div className={styles.emptyState}>No matches found</div>
          ) : (
            filteredOptions.map((opt, idx) => {
              const isSelected = value === opt;
              const isHighlighted = highlightedIndex === idx;
              return (
                <div
                  key={opt}
                  className={`${styles.dropdownItem} ${
                    isHighlighted ? styles.dropdownItemHighlighted : ''
                  }`}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  <span>{opt}</span>
                  {isSelected && (
                    <Check size={14} style={{ color: 'var(--color-primary-600)' }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
