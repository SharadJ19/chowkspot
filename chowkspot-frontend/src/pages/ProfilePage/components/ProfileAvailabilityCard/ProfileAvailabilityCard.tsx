import React from 'react';
import { Clock } from 'lucide-react';
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
    <div className={styles.availabilityCard}>
      <div className={styles.availabilityTextGroup}>
        <div className={styles.titleRow}>
          <Clock
            size={16}
            style={{
              color: isAvailable ? 'var(--color-success)' : 'var(--color-error)',
            }}
          />
          <span className={styles.availabilityTitle}>
            Dispatch Availability: {isAvailable ? 'AVAILABLE' : 'BUSY'}
          </span>
        </div>
        <span className={styles.availabilityDesc}>
          {isAvailable
            ? 'Your profile is visible and receiving new booking requests.'
            : 'Booking requests are paused. You appear as busy in search.'}
        </span>
      </div>

      <div className={styles.toggleButtonGroup}>
        <button
          type='button'
          disabled={isToggling}
          className={`${styles.toggleBtn} ${
            isAvailable ? styles.toggleBtnActiveAvailable : ''
          }`}
          onClick={() => onToggle(true)}
        >
          Available
        </button>
        <button
          type='button'
          disabled={isToggling}
          className={`${styles.toggleBtn} ${
            !isAvailable ? styles.toggleBtnActiveBusy : ''
          }`}
          onClick={() => onToggle(false)}
        >
          Busy
        </button>
      </div>
    </div>
  );
};
