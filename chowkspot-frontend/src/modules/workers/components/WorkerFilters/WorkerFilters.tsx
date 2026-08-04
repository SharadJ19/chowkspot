import React from 'react';
import { RotateCcw } from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Button } from '@/components/ui/Button/Button';
import styles from './WorkerFilters.module.css';

export interface WorkerFiltersProps {
  selectedCategory: string;
  selectedCity: string;
  availableOnly: boolean;
  onCategoryChange: (cat: string) => void;
  onCityChange: (city: string) => void;
  onAvailableOnlyChange: (available: boolean) => void;
  onReset: () => void;
}

export const WorkerFilters: React.FC<WorkerFiltersProps> = ({
  selectedCategory,
  selectedCity,
  availableOnly,
  onCategoryChange,
  onCityChange,
  onAvailableOnlyChange,
  onReset,
}) => {
  return (
    <div className={styles.filterBar}>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.selectInput}
      >
        <option value=''>All Categories</option>
        {APP_CONSTANTS.CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className={styles.selectInput}
      >
        <option value=''>All Cities</option>
        {APP_CONSTANTS.CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <label className={styles.checkboxLabel}>
        <input
          type='checkbox'
          checked={availableOnly}
          onChange={(e) => onAvailableOnlyChange(e.target.checked)}
        />
        <span>Available Only</span>
      </label>

      <Button variant='ghost' size='sm' onClick={onReset} className={styles.resetBtn}>
        <RotateCcw size={14} />
        <span>Reset Filters</span>
      </Button>
    </div>
  );
};
