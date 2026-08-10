import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  CreditCard,
  Star,
  Check,
  X,
  Play,
  FileText,
  UserCheck,
} from 'lucide-react';
import type { CustomerBookingItem, WorkerBookingItem, BookingStatus } from '@/types';
import { BookingStatusBadge } from '../BookingStatusBadge/BookingStatusBadge';
import { BookingTimeline } from '../BookingTimeline/BookingTimeline';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { formatDate } from '@/utils/formatDate';
import styles from './BookingCard.module.css';

export interface BookingCardProps {
  item: CustomerBookingItem | WorkerBookingItem;
  isWorkerRole: boolean;
  onStatusChange: (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string,
  ) => void;
  onPayClick?: (upiId: string, payeeName: string, amount?: number) => void;
  onReviewClick?: (bookingId: string) => void;
  onViewDetails?: (item: CustomerBookingItem | WorkerBookingItem) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  item,
  isWorkerRole,
  onStatusChange,
  onPayClick,
  onReviewClick,
  onViewDetails,
}) => {
  const { booking } = item;
  const isCustomer = !isWorkerRole;

  const workerProf = (item as CustomerBookingItem).workerProfile;
  const customerUser = (item as WorkerBookingItem).user;

  const title = isCustomer
    ? workerProf?.category || 'Professional Service'
    : customerUser?.name || 'Customer';

  const subtitle = isCustomer
    ? workerProf?.rateType
      ? `${workerProf.rateType} Service`
      : 'Verified Pro'
    : `Customer Hub • ${customerUser?.city || 'Local'}`;

  const avatarSrc = isCustomer ? undefined : customerUser?.avatarUrl;

  const contactPhone = isCustomer ? undefined : customerUser?.phone;
  const upiId = isCustomer ? workerProf?.paymentIdentifier : undefined;

  return (
    <div className={styles.card} data-status={booking.status}>
      <div className={styles.topRow}>
        <div className={styles.participantInfo}>
          <Avatar name={title} src={avatarSrc} size='lg' />
          <div className={styles.detailsGroup}>
            <h4 className={styles.targetName}>{title}</h4>
            <span className={styles.categoryOrRole}>{subtitle}</span>
          </div>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <BookingTimeline status={booking.status} isWorkerRole={isWorkerRole} />

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <Calendar size={14} className={styles.metaIcon} />
          <div className={styles.metaText}>
            <strong>Requested Slot</strong>
            <span>{formatDate(booking.requestedDate, 'datetime')}</span>
          </div>
        </div>

        {booking.counterDate && (
          <div
            className={styles.metaItem}
            style={{ color: 'var(--color-status-counter-text)' }}
          >
            <Clock size={14} className={styles.metaIcon} />
            <div className={styles.metaText}>
              <strong>Counter-Proposed Slot</strong>
              <span>{formatDate(booking.counterDate, 'datetime')}</span>
            </div>
          </div>
        )}

        <div className={styles.metaItem}>
          <MapPin size={14} className={styles.metaIcon} />
          <div className={styles.metaText}>
            <strong>Service Location</strong>
            <span>{booking.address}</span>
          </div>
        </div>

        {contactPhone && (
          <div className={styles.metaItem}>
            <Phone size={14} className={styles.metaIcon} />
            <div className={styles.metaText}>
              <strong>Customer Phone</strong>
              <a
                href={`tel:${contactPhone}`}
                style={{ color: 'var(--color-primary-600)', fontWeight: 'bold' }}
              >
                {contactPhone}
              </a>
            </div>
          </div>
        )}
      </div>

      {booking.notes && (
        <div className={styles.notesBox}>
          <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />
          <strong>Instructions / Notes:</strong> {booking.notes}
        </div>
      )}

      <div className={styles.actionsRow}>
        <Button variant='ghost' size='sm' onClick={() => onViewDetails?.(item)}>
          <UserCheck size={14} />
          <span>View Full Summary</span>
        </Button>

        <div className={styles.actionButtonGroup}>
          {isWorkerRole && booking.status === 'PENDING' && (
            <>
              <Button
                size='sm'
                variant='primary'
                onClick={() => onStatusChange(booking.id, 'ACCEPTED')}
              >
                <Check size={14} />
                <span>Accept Job</span>
              </Button>
              <Button
                size='sm'
                variant='danger'
                onClick={() => onStatusChange(booking.id, 'REJECTED')}
              >
                <X size={14} />
                <span>Decline Request</span>
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
              <span>Start Work (Arrived)</span>
            </Button>
          )}

          {isWorkerRole && booking.status === 'IN_PROGRESS' && (
            <Button
              size='sm'
              variant='primary'
              onClick={() => onStatusChange(booking.id, 'COMPLETED')}
            >
              <Check size={14} />
              <span>Mark Job Complete</span>
            </Button>
          )}

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
                  onClick={() => onPayClick?.(upiId, title)}
                >
                  <CreditCard size={14} />
                  <span>Pay via UPI (0% Fee)</span>
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
    </div>
  );
};
