import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
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
  currentPage: number; // 👈 Added
  itemsPerPage: number; // 👈 Added
  totalResults: number;
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
}) => {
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const filteredCategories = APP_CONSTANTS.CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(skillSearchQuery.toLowerCase()),
  );

  const filteredCities = APP_CONSTANTS.CITIES.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase()),
  );

  // Calculate current range (e.g. 1–12, 13–24)
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalResults);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} style={{ color: 'var(--color-primary-600)' }} />
          <h3 className={styles.title}>Filter Marketplace</h3>
        </div>
        <Button variant='ghost' size='sm' onClick={onReset} title='Reset Filters'>
          <RotateCcw size={14} />
        </Button>
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

      {/* 5. Categories Picker */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Skills &amp; Trades</label>
        <Input
          placeholder='Filter 80+ skills...'
          value={skillSearchQuery}
          onChange={(e) => setSkillSearchQuery(e.target.value)}
          style={{ marginBottom: '4px', fontSize: '12px', padding: '6px 10px' }}
        />
        <div className={styles.scrollableList}>
          <label className={styles.checkboxItem}>
            <input
              type='radio'
              name='category_radio'
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
              className={styles.checkbox}
            />
            <strong>All Skills ({APP_CONSTANTS.CATEGORIES.length})</strong>
          </label>
          {filteredCategories.map((cat) => (
            <label key={cat} className={styles.checkboxItem}>
              <input
                type='radio'
                name='category_radio'
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className={styles.checkbox}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. Cities Picker */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Service City</label>
        <Input
          placeholder='Filter 85+ cities...'
          value={citySearchQuery}
          onChange={(e) => setCitySearchQuery(e.target.value)}
          style={{ marginBottom: '4px', fontSize: '12px', padding: '6px 10px' }}
        />
        <div className={styles.scrollableList}>
          <label className={styles.checkboxItem}>
            <input
              type='radio'
              name='city_radio'
              checked={!selectedCity}
              onChange={() => onCityChange('')}
              className={styles.checkbox}
            />
            <strong>All Cities ({APP_CONSTANTS.CITIES.length})</strong>
          </label>
          {filteredCities.map((city) => (
            <label key={city} className={styles.checkboxItem}>
              <input
                type='radio'
                name='city_radio'
                checked={selectedCity === city}
                onChange={() => onCityChange(city)}
                className={styles.checkbox}
              />
              <span>{city}</span>
            </label>
          ))}
        </div>
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
