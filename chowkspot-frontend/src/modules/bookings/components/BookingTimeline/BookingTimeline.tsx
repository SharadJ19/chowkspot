import React from 'react';
import { Clock, CheckCircle2, ShieldCheck, PlayCircle, AlertCircle } from 'lucide-react';
import type { BookingStatus } from '@/types';
import styles from './BookingTimeline.module.css';

interface BookingTimelineProps {
  status: BookingStatus;
  isWorkerRole?: boolean;
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  status,
  isWorkerRole = false,
}) => {
  if (status === 'CANCELLED' || status === 'REJECTED') {
    return (
      <div
        className={styles.trackerCard}
        style={{ borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
      >
        <div className={styles.topRow}>
          <span className={styles.statusIndicator} style={{ color: '#991b1b' }}>
            <AlertCircle size={16} />
            <span>
              Booking {status === 'CANCELLED' ? 'Cancelled' : 'Declined by Professional'}
            </span>
          </span>
        </div>
        <p className={styles.instructionText} style={{ color: '#7f1d1d' }}>
          This service request is closed. You can explore and book other verified
          professionals anytime.
        </p>
      </div>
    );
  }

  const getStatusDetails = () => {
    switch (status) {
      case 'PENDING':
        return {
          stepName: 'Awaiting Professional Confirmation',
          progressWidth: '25%',
          instruction: isWorkerRole
            ? 'Review the requested slot and address details, then accept or counter-propose.'
            : 'Your request has been dispatched via real-time socket. The professional will review and accept shortly.',
          icon: <Clock size={16} style={{ color: 'var(--color-warning)' }} />,
        };
      case 'COUNTER_PROPOSED':
        return {
          stepName: 'Counter-Proposal Pending',
          progressWidth: '40%',
          instruction:
            'The professional proposed an alternative time slot. Please review and respond.',
          icon: <Clock size={16} style={{ color: 'var(--color-status-counter-text)' }} />,
        };
      case 'ACCEPTED':
        return {
          stepName: 'Job Confirmed & Scheduled',
          progressWidth: '60%',
          instruction: isWorkerRole
            ? 'Proceed to the location at the scheduled time and tap "Start Work" upon arrival.'
            : 'The professional has accepted your booking and is preparing for dispatch.',
          icon: <ShieldCheck size={16} style={{ color: 'var(--color-info)' }} />,
        };
      case 'IN_PROGRESS':
        return {
          stepName: 'Service In Progress',
          progressWidth: '85%',
          instruction: isWorkerRole
            ? 'Complete the requested tasks safely and tap "Mark Complete" when finished.'
            : 'The professional is currently at your service location executing the task.',
          icon: <PlayCircle size={16} style={{ color: 'var(--color-primary-600)' }} />,
        };
      case 'COMPLETED':
        return {
          stepName: 'Service Completed Successfully',
          progressWidth: '100%',
          instruction: isWorkerRole
            ? 'Job successfully finished and logged in your history records.'
            : 'Service successfully completed! Please settle payment via UPI and leave a verified review.',
          icon: <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />,
        };
      default:
        return {
          stepName: 'Processing',
          progressWidth: '10%',
          instruction: 'Updating booking state...',
          icon: <Clock size={16} />,
        };
    }
  };

  const details = getStatusDetails();

  return (
    <div className={styles.trackerCard}>
      <div className={styles.topRow}>
        <div className={styles.statusIndicator}>
          <span className={styles.pulseDot} />
          {details.icon}
          <span>{details.stepName}</span>
        </div>
      </div>
      <p className={styles.instructionText}>{details.instruction}</p>
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: details.progressWidth }} />
      </div>
    </div>
  );
};
