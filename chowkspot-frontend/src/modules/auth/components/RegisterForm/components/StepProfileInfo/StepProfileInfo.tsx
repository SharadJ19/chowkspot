import React from 'react';
import { Input } from '@/components/ui/Input/Input';
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './StepProfileInfo.module.css';

interface StepProfileInfoProps {
  name: string;
  phone: string;
  city: string;
  totalSteps: number;
  fieldErrors: Record<string, string>;
  onChange: (fields: Partial<{ name: string; phone: string; city: string }>) => void;
}

export const StepProfileInfo: React.FC<StepProfileInfoProps> = ({
  name,
  phone,
  city,
  totalSteps,
  fieldErrors,
  onChange,
}) => {
  return (
    <div className={styles.stepBody}>
      <div className={styles.stepHeader}>
        <span className={styles.stepSubheading}>Step 2 of {totalSteps}</span>
        <h3 className={styles.stepTitle}>Profile Details</h3>
        <p className={styles.stepDescription}>
          Enter your name, contact phone, and primary city hub.
        </p>
      </div>

      <Input
        label='Full Name'
        placeholder='e.g. Sharad Chandel'
        value={name}
        onChange={(e) => onChange({ name: e.target.value })}
        error={fieldErrors.name}
        autoFocus
      />

      <Input
        label='Phone Number'
        placeholder='+919876543210'
        value={phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        error={fieldErrors.phone}
      />

      <div className={styles.fieldGroup}>
        <Autocomplete
          label='Primary City'
          options={APP_CONSTANTS.CITIES}
          value={city}
          onChange={(newCity) => onChange({ city: newCity })}
          placeholder='Search 85+ regional cities...'
        />
        {fieldErrors.city && (
          <span className={styles.inlineError}>{fieldErrors.city}</span>
        )}
      </div>
    </div>
  );
};
