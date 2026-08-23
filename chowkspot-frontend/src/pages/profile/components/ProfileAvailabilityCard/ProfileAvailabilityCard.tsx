import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './ProfileAvailabilityCard.module.css';

interface ProfileAvailabilityCardProps {
  isAvailable: boolean;
  isToggling: boolean;
  onToggle: (targetState: boolean) => void;
}

export const ProfileAvailabilityCard: React.FC<ProfileAvailabilityCardProps> = ({
  isAvailable,
  isToggling,
  onToggle,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.statusGroup}>
        <span
          className={`${styles.indicatorDot} ${
            isAvailable ? styles.dotAvailable : styles.dotBusy
          }`}
        />
        <span className={styles.statusLabel}>
          {isAvailable ? 'Available for Work' : 'Currently Busy'}
        </span>
      </div>

      <label className={styles.switchLabel} aria-label='Toggle availability status'>
        <input
          type='checkbox'
          checked={isAvailable}
          disabled={isToggling}
          onChange={(e) => onToggle(e.target.checked)}
          className={styles.nativeInput}
        />
        <span className={styles.slider}>
          {isToggling && <Loader2 size={12} className={styles.spinner} />}
        </span>
      </label>
    </div>
  );
};
