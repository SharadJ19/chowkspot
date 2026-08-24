import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import type { BookingStatus } from '@/types';
import styles from './BookingPipelineStepper.module.css';

interface BookingPipelineStepperProps {
  status: BookingStatus;
}

export const BookingPipelineStepper: React.FC<BookingPipelineStepperProps> = ({
  status,
}) => {
  if (status === 'CANCELLED' || status === 'REJECTED') {
    return (
      <div
        className={styles.pipelineStepper}
        style={{ background: '#fef2f2', borderColor: '#fca5a5' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#991b1b',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          <AlertCircle size={16} />
          <span>Booking {status === 'CANCELLED' ? 'Cancelled' : 'Declined'}</span>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Requested', done: true, active: status === 'PENDING' },
    {
      label: 'Accepted',
      done: ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(status),
      active: status === 'ACCEPTED',
    },
    {
      label: 'In Progress',
      done: ['IN_PROGRESS', 'COMPLETED'].includes(status),
      active: status === 'IN_PROGRESS',
    },
    { label: 'Completed', done: status === 'COMPLETED', active: status === 'COMPLETED' },
  ];

  return (
    <div className={styles.pipelineStepper}>
      {steps.map((step, idx) => (
        <div key={step.label} className={styles.stepNode}>
          <div
            className={`${styles.stepDot} ${step.active ? styles.stepDotActive : ''} ${step.done ? styles.stepDotCompleted : ''}`}
          >
            {step.done ? <Check size={13} /> : idx + 1}
          </div>
          <span
            className={`${styles.stepText} ${step.active ? styles.stepTextActive : ''}`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};
