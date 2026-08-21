import React from 'react';
import { User, Wrench } from 'lucide-react';
import styles from './StepRoleSelect.module.css';

interface StepRoleSelectProps {
  role: 'USER' | 'WORKER';
  totalSteps: number;
  onRoleSelect: (role: 'USER' | 'WORKER') => void;
}

export const StepRoleSelect: React.FC<StepRoleSelectProps> = ({
  role,
  totalSteps,
  onRoleSelect,
}) => {
  return (
    <div className={styles.stepBody}>
      <div className={styles.stepHeader}>
        <span className={styles.stepSubheading}>Step 1 of {totalSteps}</span>
        <h3 className={styles.stepTitle}>Select Account Type</h3>
        <p className={styles.stepDescription}>Choose how you will be using ChowkSpot.</p>
      </div>

      <div className={styles.roleSelectionGrid}>
        <div
          className={`${styles.roleCard} ${role === 'USER' ? styles.roleCardActive : ''}`}
          onClick={() => onRoleSelect('USER')}
          role='button'
          tabIndex={0}
        >
          <div className={styles.roleIconWrapper}>
            <User size={22} />
          </div>
          <div className={styles.roleInfo}>
            <h4 className={styles.roleTitle}>Customer</h4>
            <p className={styles.roleDescription}>
              Hire verified electricians, plumbers, and local pros with 0% platform fee.
            </p>
          </div>
        </div>

        <div
          className={`${styles.roleCard} ${role === 'WORKER' ? styles.roleCardActive : ''}`}
          onClick={() => onRoleSelect('WORKER')}
          role='button'
          tabIndex={0}
        >
          <div className={styles.roleIconWrapper}>
            <Wrench size={22} />
          </div>
          <div className={styles.roleInfo}>
            <h4 className={styles.roleTitle}>Skilled Worker</h4>
            <p className={styles.roleDescription}>
              List services, receive direct local booking requests, and get paid 100% via
              UPI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
