import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { BookingCard } from '@/modules/bookings/components/BookingCard/BookingCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UpiQrModal } from '@/modules/payments/components/UpiQrModal/UpiQrModal';
import { useUpiPayment } from '@/modules/payments/hooks/useUpiPayment';
import { Modal } from '@/components/ui/Modal/Modal';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import type { BookingStatus } from '@/types';
import styles from './Pages.module.css';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const isWorkerRole = user?.role === 'WORKER';

  const { bookingsQuery, updateStatusMutation } = useBookingQueries();
  const { activePayment, initiatePayment, clearPayment } = useUpiPayment();
  const { createReviewMutation } = useReviewQueries();

  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleStatusChange = (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string | undefined,
  ) => {
    updateStatusMutation.mutate({ bookingId, data: { status, counterDate } });
  };

  const handleReviewSubmit = async () => {
    if (!reviewBookingId) return;
    await createReviewMutation.mutateAsync({
      bookingId: reviewBookingId,
      rating,
      comment,
    });
    setReviewBookingId(null);
    setRating(5);
    setComment('');
  };

  if (bookingsQuery.isLoading) {
    return (
      <div className={styles.centerLoading}>
        <Spinner size='lg' />
      </div>
    );
  }

  const items = bookingsQuery.data || [];

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div>
        <h1 className={styles.sectionTitle}>
          {isWorkerRole ? 'Incoming Job Requests' : 'My Service Bookings'}
        </h1>
        <p className={styles.sectionSubtitle}>
          Track and manage active booking lifecycles
        </p>
      </div>

      {items.length === 0 ? (
        <p className={styles.emptyMessage}>No booking records found.</p>
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          {items.map((item) => (
            <BookingCard
              key={item.booking.id}
              item={item}
              isWorkerRole={isWorkerRole}
              onStatusChange={handleStatusChange}
              onPayClick={(upiId, payeeName) => initiatePayment(upiId, payeeName)}
              onReviewClick={(id) => setReviewBookingId(id)}
            />
          ))}
        </div>
      )}

      {activePayment && (
        <UpiQrModal
          isOpen={!!activePayment}
          onClose={clearPayment}
          upiId={activePayment.upiId}
          payeeName={activePayment.payeeName}
          upiUri={activePayment.uri}
        />
      )}

      <Modal
        isOpen={!!reviewBookingId}
        onClose={() => setReviewBookingId(null)}
        title='Leave a Verified Review'
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
            }}
          >
            <span className={styles.formLabel}>Rating</span>
            <RatingStars rating={rating} interactive onChange={(r) => setRating(r)} />
          </div>

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Written Review</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your experience...'
              className={styles.textareaInput}
            />
          </div>

          <Button
            onClick={handleReviewSubmit}
            isLoading={createReviewMutation.isPending}
            fullWidth
          >
            Submit Review
          </Button>
        </div>
      </Modal>
    </div>
  );
};
