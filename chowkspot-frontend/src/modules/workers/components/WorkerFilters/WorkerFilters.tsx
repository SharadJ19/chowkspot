import React from 'react';
import { RotateCcw } from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Button } from '@/components/ui/Button/Button';
import styles from './WorkerFilters.module.css';

export interface WorkerFiltersProps {
  selectedCategory: string;
  selectedCity: string;
  availableOnly: boolean;
  rateType: string;
  minRating: string;
  onCategoryChange: (cat: string) => void;
  onCityChange: (city: string) => void;
  onAvailableOnlyChange: (available: boolean) => void;
  onRateTypeChange: (type: string) => void;
  onMinRatingChange: (rating: string) => void;
  onReset: () => void;
  totalResults: number;
}

export const WorkerFilters: React.FC<WorkerFiltersProps> = ({
  selectedCategory,
  selectedCity,
  availableOnly,
  rateType,
  minRating,
  onCategoryChange,
  onCityChange,
  onAvailableOnlyChange,
  onRateTypeChange,
  onMinRatingChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGrid}>
        {/* Category Filter */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Service Trade</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={styles.selectInput}
          >
            <option value=''>All Categories ({APP_CONSTANTS.CATEGORIES.length})</option>
            {APP_CONSTANTS.CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Service City / Hub</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className={styles.selectInput}
          >
            <option value=''>All Cities ({APP_CONSTANTS.CITIES.length})</option>
            {APP_CONSTANTS.CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Rate Type Filter */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Pricing Model</label>
          <select
            value={rateType}
            onChange={(e) => onRateTypeChange(e.target.value)}
            className={styles.selectInput}
          >
            <option value=''>All Pricing Models</option>
            <option value='FIXED'>Fixed Rate</option>
            <option value='HOURLY'>Hourly Rate</option>
            <option value='INSPECTION_FIRST'>Inspection First</option>
          </select>
        </div>

        {/* Minimum Rating Filter */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Minimum Rating</label>
          <select
            value={minRating}
            onChange={(e) => onMinRatingChange(e.target.value)}
            className={styles.selectInput}
          >
            <option value=''>Any Rating</option>
            <option value='4.5'>4.5+ Stars &amp; Above</option>
            <option value='4.0'>4.0+ Stars &amp; Above</option>
            <option value='3.0'>3.0+ Stars &amp; Above</option>
          </select>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <label className={styles.checkboxLabel}>
          <input
            type='checkbox'
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
          />
          <span>Show Available Providers Only</span>
        </label>

        <span className={styles.resultsCount}>
          Found <strong>{totalResults}</strong> skilled professional
          {totalResults === 1 ? '' : 's'}
        </span>

        <Button variant='ghost' size='sm' onClick={onReset}>
          <RotateCcw size={14} />
          <span>Reset All Filters</span>
        </Button>
      </div>
    </div>
  );
};
