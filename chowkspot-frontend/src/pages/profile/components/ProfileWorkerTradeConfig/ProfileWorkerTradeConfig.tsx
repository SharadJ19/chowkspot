import React from 'react';
import { Input } from '@/components/ui/Input/Input';
import { ProfileCityChips } from '../ProfileCityChips/ProfileCityChips';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './ProfileWorkerTradeConfig.module.css';

interface ProfileWorkerTradeConfigProps {
  category: string;
  rateType: 'HOURLY' | 'FIXED' | 'INSPECTION_FIRST';
  baseRate: string;
  experienceYears: number;
  paymentIdentifier: string;
  bio: string;
  serviceCities: string[];
  onCategoryChange: (category: string) => void;
  onRateTypeChange: (rateType: 'HOURLY' | 'FIXED' | 'INSPECTION_FIRST') => void;
  onBaseRateChange: (baseRate: string) => void;
  onExperienceYearsChange: (years: number) => void;
  onPaymentIdentifierChange: (identifier: string) => void;
  onBioChange: (bio: string) => void;
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

export const ProfileWorkerTradeConfig: React.FC<ProfileWorkerTradeConfigProps> = ({
  category,
  rateType,
  baseRate,
  experienceYears,
  paymentIdentifier,
  bio,
  serviceCities,
  onCategoryChange,
  onRateTypeChange,
  onBaseRateChange,
  onExperienceYearsChange,
  onPaymentIdentifierChange,
  onBioChange,
  onAddCity,
  onRemoveCity,
}) => {
  return (
    <>
      <h3 className={styles.formTitle}>
        Professional Trade Configuration &amp; Direct P2P Payments
      </h3>

      <div className={styles.formArea}>
        <label className={styles.formLabel}>Service Category</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.selectInput}
        >
          {APP_CONSTANTS.CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <ProfileCityChips
        serviceCities={serviceCities}
        onAddCity={onAddCity}
        onRemoveCity={onRemoveCity}
      />

      <div className={styles.formArea}>
        <label className={styles.formLabel}>Rate Calculation Model</label>
        <select
          value={rateType}
          onChange={(e) =>
            onRateTypeChange(e.target.value as 'HOURLY' | 'FIXED' | 'INSPECTION_FIRST')
          }
          className={styles.selectInput}
        >
          <option value='FIXED'>Fixed Rate per Job</option>
          <option value='HOURLY'>Hourly Rate</option>
          <option value='INSPECTION_FIRST'>Inspection First (Quote on Visit)</option>
        </select>
      </div>

      <Input
        label='Experience (Years)'
        type='number'
        min={0}
        value={experienceYears}
        onChange={(e) => onExperienceYearsChange(parseInt(e.target.value, 10) || 0)}
      />

      <Input
        label='Base Rate Amount (₹)'
        value={baseRate}
        onChange={(e) => onBaseRateChange(e.target.value)}
      />

      <Input
        label='UPI ID or Linked Phone Number for Direct P2P Settlement'
        placeholder='e.g. 9876543210@paytm or 9876543210'
        value={paymentIdentifier}
        onChange={(e) => onPaymentIdentifierChange(e.target.value)}
        helperText='Customers will scan a live QR code or use this to pay you directly with 0% commission.'
      />

      <div className={styles.formArea}>
        <label className={styles.formLabel}>Professional Bio</label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          className={styles.textareaInput}
        />
      </div>
    </>
  );
};
