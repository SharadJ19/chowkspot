import React from 'react';
import {
  Clock,
  MapPin,
  Phone,
  FileText,
  ShieldCheck,
  CreditCard,
  Check,
  X,
  Play,
  ArrowLeft,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { BookingPipelineStepper } from '../BookingPipelineStepper/BookingPipelineStepper';
import { BookingInlineReview } from '../BookingInlineReview/BookingInlineReview';
import { formatDate } from '@/utils/formatDate';
import type { CustomerBookingItem, WorkerBookingItem, BookingStatus } from '@/types';
import styles from './BookingDetailCanvas.module.css';

export interface BookingDetailCanvasProps {
  item: CustomerBookingItem | WorkerBookingItem;
  isWorkerRole: boolean;
  rating: number;
  comment: string;
  isReviewPending: boolean;
  onStatusChange: (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string | undefined,
  ) => void;
  onInitiatePayment: (
    upiId: string,
    payeeName: string,
    amount?: number | undefined,
  ) => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onReviewSubmit: (bookingId: string) => void;
  onBackToFeed?: (() => void) | undefined;
}

export const BookingDetailCanvas: React.FC<BookingDetailCanvasProps> = ({
  item,
  isWorkerRole,
  rating,
  comment,
  isReviewPending,
  onStatusChange,
  onInitiatePayment,
  onRatingChange,
  onCommentChange,
  onReviewSubmit,
  onBackToFeed,
}) => {
  const isCustomer = !isWorkerRole;

  // Safe extraction regardless of timing race conditions
  const workerProf = 'workerProfile' in item ? item.workerProfile : null;
  const customerUser = 'user' in item ? item.user : null;

  const currentTitle = isCustomer
    ? workerProf?.category || 'Professional Service'
    : customerUser?.name || 'Customer';

  const currentSubtitle = isCustomer
    ? `${workerProf?.rateType || 'Standard'} • Verified Local Pro`
    : `Customer • ${customerUser?.city || 'Local Hub'}`;

  const currentPhone = isCustomer ? null : customerUser?.phone;
  const currentUpi = isCustomer ? workerProf?.paymentIdentifier : null;

  return (
    <div className={styles.canvas}>
      {onBackToFeed && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onBackToFeed}
          className={styles.mobileBackButton}
        >
          <ArrowLeft size={14} />
          <span>Back to Bookings</span>
        </Button>
      )}

      <div className={styles.canvasHeader}>
        <div className={styles.targetProfileHeader}>
          <Avatar name={currentTitle} size='md' />
          <div>
            <h2 className={styles.targetTitle}>{currentTitle}</h2>
            <span className={styles.targetSubtitle}>{currentSubtitle}</span>
          </div>
        </div>

        <div className={styles.actionButtonCluster}>
          {isWorkerRole && item.booking.status === 'PENDING' && (
            <>
              <Button
                size='sm'
                variant='primary'
                onClick={() => onStatusChange(item.booking.id, 'ACCEPTED')}
              >
                <Check size={14} />
                <span>Accept</span>
              </Button>
              <Button
                size='sm'
                variant='danger'
                onClick={() => onStatusChange(item.booking.id, 'REJECTED')}
              >
                <X size={14} />
                <span>Decline</span>
              </Button>
            </>
          )}

          {isWorkerRole && item.booking.status === 'ACCEPTED' && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => onStatusChange(item.booking.id, 'IN_PROGRESS')}
            >
              <Play size={14} />
              <span>Start Work (Arrived)</span>
            </Button>
          )}

          {isWorkerRole && item.booking.status === 'IN_PROGRESS' && (
            <Button
              size='sm'
              variant='primary'
              onClick={() => onStatusChange(item.booking.id, 'COMPLETED')}
            >
              <Check size={14} />
              <span>Mark Complete</span>
            </Button>
          )}

          {isCustomer &&
            (item.booking.status === 'PENDING' || item.booking.status === 'ACCEPTED') && (
              <Button
                size='sm'
                variant='outline'
                onClick={() => onStatusChange(item.booking.id, 'CANCELLED')}
              >
                <X size={14} />
                <span>Cancel</span>
              </Button>
            )}
        </div>
      </div>

      <BookingPipelineStepper status={item.booking.status} />

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            <Clock size={12} /> Appointment
          </span>
          <span className={styles.infoValue}>
            {formatDate(item.booking.requestedDate, 'datetime')}
          </span>
        </div>

        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            <MapPin size={12} /> Address
          </span>
          <span className={styles.infoValue}>{item.booking.address}</span>
        </div>

        {currentPhone && (
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>
              <Phone size={12} /> Contact
            </span>
            <a
              href={`tel:${currentPhone}`}
              className={styles.infoValue}
              style={{ color: 'var(--color-primary-600)' }}
            >
              {currentPhone}
            </a>
          </div>
        )}
      </div>

      {item.booking.notes && (
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>
            <FileText size={12} /> Notes / Instructions
          </span>
          <p
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-slate-700)',
              marginTop: '2px',
            }}
          >
            {item.booking.notes}
          </p>
        </div>
      )}

      {isCustomer && item.booking.status === 'COMPLETED' && currentUpi && (
        <div className={styles.settlementPanel}>
          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ShieldCheck size={15} style={{ color: '#34d399' }} /> Direct 0% Commission
              UPI Settlement
            </div>
            <p
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-slate-300)',
                marginTop: '2px',
              }}
            >
              Pay directly to {currentTitle} via {currentUpi}
            </p>
          </div>
          <Button
            size='sm'
            variant='primary'
            onClick={() => onInitiatePayment(currentUpi, currentTitle)}
          >
            <CreditCard size={14} />
            <span>Launch UPI QR</span>
          </Button>
        </div>
      )}

      {isCustomer && item.booking.status === 'COMPLETED' && (
        <BookingInlineReview
          workerName={currentTitle}
          bookingId={item.booking.id}
          rating={rating}
          comment={comment}
          isPending={isReviewPending}
          onRatingChange={onRatingChange}
          onCommentChange={onCommentChange}
          onSubmit={onReviewSubmit}
        />
      )}
    </div>
  );
};
