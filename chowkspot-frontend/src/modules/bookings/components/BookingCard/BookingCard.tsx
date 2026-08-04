import React from 'react';
import {
  MapPin,
  FileText,
  Calendar,
  Clock,
  CreditCard,
  Star,
  Check,
  X,
  Play,
} from 'lucide-react';
import type { CustomerBookingItem, WorkerBookingItem, BookingStatus } from '@/types';
import { BookingStatusBadge } from '../BookingStatusBadge/BookingStatusBadge';
import { Button } from '@/components/ui/Button/Button';
import { formatDateTime } from '@/utils/formatDate';
import styles from './BookingCard.module.css';

export interface BookingCardProps {
  item: CustomerBookingItem | WorkerBookingItem;
  isWorkerRole: boolean;
  onStatusChange: (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string,
  ) => void;
  onPayClick?: (upiId: string, payeeName: string) => void;
  onReviewClick?: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  item,
  isWorkerRole,
  onStatusChange,
  onPayClick,
  onReviewClick,
}) => {
  const { booking } = item;
  const isCustomer = !isWorkerRole;

  const targetName = isCustomer
    ? (item as CustomerBookingItem).workerProfile?.category || 'Worker'
    : (item as WorkerBookingItem).user?.name || 'Customer';

  const upiId = isCustomer
    ? (item as CustomerBookingItem).workerProfile?.paymentIdentifier
    : null;

  return (
    <div className={styles.card} data-status={booking.status}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>{targetName}</h4>
          <span className={styles.date}>
            <Calendar size={13} />
            <span>Requested: {formatDateTime(booking.requestedDate)}</span>
          </span>
          {booking.counterDate && (
            <span className={styles.counterDate}>
              <Clock size={13} />
              <span>Counter: {formatDateTime(booking.counterDate)}</span>
            </span>
          )}
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className={styles.body}>
        <div className={styles.detailRow}>
          <MapPin size={14} className={styles.detailIcon} />
          <span className={styles.detailText}>
            <strong>Address:</strong> {booking.address}
          </span>
        </div>
        {booking.notes && (
          <div className={styles.detailRow}>
            <FileText size={14} className={styles.detailIcon} />
            <span className={styles.detailText}>
              <strong>Notes:</strong> {booking.notes}
            </span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {/* Worker Actions */}
        {isWorkerRole && booking.status === 'PENDING' && (
          <>
            <Button
              size='sm'
              variant='primary'
              onClick={() => onStatusChange(booking.id, 'ACCEPTED')}
            >
              <Check size={14} />
              <span>Accept</span>
            </Button>
            <Button
              size='sm'
              variant='danger'
              onClick={() => onStatusChange(booking.id, 'REJECTED')}
            >
              <X size={14} />
              <span>Reject</span>
            </Button>
          </>
        )}

        {isWorkerRole && booking.status === 'ACCEPTED' && (
          <Button
            size='sm'
            variant='secondary'
            onClick={() => onStatusChange(booking.id, 'IN_PROGRESS')}
          >
            <Play size={14} />
            <span>Start Work</span>
          </Button>
        )}

        {isWorkerRole && booking.status === 'IN_PROGRESS' && (
          <Button
            size='sm'
            variant='primary'
            onClick={() => onStatusChange(booking.id, 'COMPLETED')}
          >
            <Check size={14} />
            <span>Complete Job</span>
          </Button>
        )}

        {/* Customer Actions */}
        {isCustomer &&
          (booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
            <Button
              size='sm'
              variant='outline'
              onClick={() => onStatusChange(booking.id, 'CANCELLED')}
            >
              <X size={14} />
              <span>Cancel Request</span>
            </Button>
          )}

        {isCustomer && booking.status === 'COMPLETED' && (
          <>
            {upiId && (
              <Button
                size='sm'
                variant='primary'
                onClick={() => onPayClick?.(upiId, targetName)}
              >
                <CreditCard size={14} />
                <span>Pay via UPI</span>
              </Button>
            )}
            <Button
              size='sm'
              variant='outline'
              onClick={() => onReviewClick?.(booking.id)}
            >
              <Star size={14} />
              <span>Leave Review</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
