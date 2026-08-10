// FILE: src/modules/workers/components/WorkerSidebarFilters/WorkerSidebarFilters.tsx
import React from 'react';
import { Filter, RotateCcw, X } from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete'; // 👈 Import component
import styles from './WorkerSidebarFilters.module.css';

export interface WorkerSidebarFiltersProps {
  searchName: string;
  selectedCategory: string;
  selectedCity: string;
  availableOnly: boolean;
  minExperience: number;
  maxPrice: number;
  onSearchNameChange: (name: string) => void;
  onCategoryChange: (cat: string) => void;
  onCityChange: (city: string) => void;
  onAvailableOnlyChange: (available: boolean) => void;
  onMinExperienceChange: (exp: number) => void;
  onMaxPriceChange: (price: number) => void;
  onReset: () => void;
  currentPage: number;
  itemsPerPage: number;
  totalResults: number;
  onCloseMobileDrawer?: () => void;
}

export const WorkerSidebarFilters: React.FC<WorkerSidebarFiltersProps> = ({
  searchName,
  selectedCategory,
  selectedCity,
  availableOnly,
  minExperience,
  maxPrice,
  onSearchNameChange,
  onCategoryChange,
  onCityChange,
  onAvailableOnlyChange,
  onMinExperienceChange,
  onMaxPriceChange,
  onReset,
  currentPage,
  itemsPerPage,
  totalResults,
  onCloseMobileDrawer,
}) => {
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h3 className={styles.title}>Filter Marketplace</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Button variant='ghost' size='sm' onClick={onReset} title='Reset Filters'>
            <RotateCcw size={14} />
          </Button>
          {onCloseMobileDrawer && (
            <Button
              variant='outline'
              size='sm'
              className={styles.mobileCloseBtn}
              onClick={onCloseMobileDrawer}
            >
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* 1. Search Provider Name */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Search Provider</label>
        <Input
          placeholder='Search by name...'
          value={searchName}
          onChange={(e) => onSearchNameChange(e.target.value)}
        />
      </div>

      {/* 2. Experience Years Slider */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Minimum Experience: <strong>{minExperience} Years</strong>
        </label>
        <input
          type='range'
          min={0}
          max={15}
          step={1}
          value={minExperience}
          onChange={(e) => onMinExperienceChange(Number(e.target.value))}
          className={styles.rangeSlider}
        />
        <div className={styles.rangeValues}>
          <span>0 Yrs</span>
          <span>15+ Yrs</span>
        </div>
      </div>

      {/* 3. Price Range Slider */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>
          Max Rate: <strong>₹{maxPrice}</strong>
        </label>
        <input
          type='range'
          min={100}
          max={3000}
          step={50}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className={styles.rangeSlider}
        />
        <div className={styles.rangeValues}>
          <span>₹100</span>
          <span>₹3,000+</span>
        </div>
      </div>

      {/* 4. Availability Toggle */}
      <div className={styles.section}>
        <label className={styles.checkboxItem}>
          <input
            type='checkbox'
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            className={styles.checkbox}
          />
          <span>Show Available Providers Only</span>
        </label>
      </div>

      {/* 5. Autocomplete Category Search */}
      <div className={styles.section}>
        <Autocomplete
          label='Service Trade'
          options={APP_CONSTANTS.CATEGORIES}
          value={selectedCategory}
          onChange={onCategoryChange}
          placeholder='Type to search skills...'
        />
      </div>

      {/* 6. Autocomplete City Search */}
      <div className={styles.section}>
        <Autocomplete
          label='Service City'
          options={APP_CONSTANTS.CITIES}
          value={selectedCity}
          onChange={onCityChange}
          placeholder='Type to search cities...'
        />
      </div>

      {/* Footer Info Displaying Paginated Range */}
      <div
        style={{
          paddingTop: '8px',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <span
          style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
        >
          {totalResults === 0 ? (
            'No matching professionals found'
          ) : (
            <>
              Showing{' '}
              <strong>
                {startItem}–{endItem}
              </strong>{' '}
              of <strong>{totalResults.toLocaleString()}</strong> matching professionals
            </>
          )}
        </span>
      </div>
    </aside>
  );
};
