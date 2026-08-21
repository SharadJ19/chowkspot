import React from 'react';
import { Input } from '@/components/ui/Input/Input';
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './StepWorkerTrade.module.css';

interface StepWorkerTradeProps {
  category: string;
  rateType: 'FIXED' | 'HOURLY' | 'INSPECTION_FIRST';
  baseRate: string;
  paymentIdentifier: string;
  fieldErrors: Record<string, string>;
  onChange: (
    fields: Partial<{
      category: string;
      rateType: 'FIXED' | 'HOURLY' | 'INSPECTION_FIRST';
      baseRate: string;
      paymentIdentifier: string;
    }>,
  ) => void;
}

export const StepWorkerTrade: React.FC<StepWorkerTradeProps> = ({
  category,
  rateType,
  baseRate,
  paymentIdentifier,
  fieldErrors,
  onChange,
}) => {
  return (
    <div className={styles.stepBody}>
      <div className={styles.stepHeader}>
        <span className={styles.stepSubheading}>Step 3 of 4</span>
        <h3 className={styles.stepTitle}>Trade &amp; Pricing</h3>
        <p className={styles.stepDescription}>
          Configure your service skill, base pricing, and direct UPI payout details.
        </p>
      </div>

      <div className={styles.fieldGroup}>
        <Autocomplete
          label='Service Trade Category'
          options={APP_CONSTANTS.CATEGORIES}
          value={category}
          onChange={(newCategory) => onChange({ category: newCategory })}
          placeholder='Select trade skill...'
        />
        {fieldErrors.category && (
          <span className={styles.inlineError}>{fieldErrors.category}</span>
        )}
      </div>

      <div className={styles.formRowTwoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Pricing Model</label>
          <select
            value={rateType}
            onChange={(e) =>
              onChange({
                rateType: e.target.value as 'FIXED' | 'HOURLY' | 'INSPECTION_FIRST',
              })
            }
            className={styles.selectInput}
          >
            <option value='FIXED'>Fixed per Job</option>
            <option value='HOURLY'>Hourly Rate</option>
            <option value='INSPECTION_FIRST'>Quote on Visit</option>
          </select>
        </div>

        <Input
          label='Base Rate (₹)'
          value={baseRate}
          onChange={(e) => onChange({ baseRate: e.target.value })}
          error={fieldErrors.baseRate}
          placeholder='500.00'
        />
      </div>

      <Input
        label='Direct UPI Handle (Optional)'
        placeholder='e.g. yourname@okaxis'
        value={paymentIdentifier}
        onChange={(e) => onChange({ paymentIdentifier: e.target.value })}
        error={fieldErrors.paymentIdentifier}
        helperText='Customers can scan a QR code to pay you directly with 0% platform fee.'
      />
    </div>
  );
};
