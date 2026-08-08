import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { BookingCard } from '@/modules/bookings/components/BookingCard/BookingCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UpiQrModal } from '@/modules/payments/components/UpiQrModal/UpiQrModal';
import { useUpiPayment } from '@/modules/payments/hooks/useUpiPayment';
import { Modal } from '@/components/ui/Modal/Modal';
import { toast } from 'sonner';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import type { BookingStatus, CustomerBookingItem, WorkerBookingItem } from '@/types';
import { formatDateTime } from '@/utils/formatDate';
import styles from './Pages.module.css';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const isWorkerRole = user?.role === 'WORKER';

  const { bookingsQuery, updateStatusMutation } = useBookingQueries();
  const { activePayment, initiatePayment, clearPayment } = useUpiPayment();
  const { createReviewMutation } = useReviewQueries();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<
    CustomerBookingItem | WorkerBookingItem | null
  >(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const items = bookingsQuery.data || [];

  // Filter items by status tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'ALL') return items;
    return items.filter((item) => item.booking.status === activeTab);
  }, [items, activeTab]);

  const handleStatusChange = (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string | undefined,
  ) => {
    updateStatusMutation.mutate(
      { bookingId, data: { status, counterDate } },
      {
        onSuccess: () => {
          toast.success(`Booking marked as ${status.replace('_', ' ')}!`);
        },
        onError: (err) => {
          toast.error('Failed to update booking status', {
            description: (err as Error).message,
          });
        },
      },
    );
  };

  const handleReviewSubmit = async () => {
    if (!reviewBookingId) return;
    try {
      await createReviewMutation.mutateAsync({
        bookingId: reviewBookingId,
        rating,
        comment,
      });
      toast.success('Thank you! Review submitted successfully.');
      setReviewBookingId(null);
      setRating(5);
      setComment('');
    } catch (err) {
      toast.error('Failed to submit review', {
        description: (err as Error).message,
      });
    }
  };

  if (bookingsQuery.isLoading) {
    return (
      <div className={styles.centerLoading}>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.flexBetween} style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className={styles.sectionTitle}>
            {isWorkerRole
              ? 'Incoming Job Requests Command Center'
              : 'My Service Bookings'}
          </h1>
          <p className={styles.sectionSubtitle}>
            Manage job lifecycles, direct P2P payments, and service tracking
          </p>
        </div>
        <Badge variant='primary'>
          <span>Total Records: {items.length}</span>
        </Badge>
      </div>

      {/* Filter Tabs Bar */}
      <div
        style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}
      >
        {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
          (tab) => {
            const count =
              tab === 'ALL'
                ? items.length
                : items.filter((i) => i.booking.status === tab).length;
            return (
              <Button
                key={tab}
                size='sm'
                variant={activeTab === tab ? 'primary' : 'outline'}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('_', ' ')} ({count})
              </Button>
            );
          },
        )}
      </div>

      {filteredItems.length === 0 ? (
        <p className={styles.emptyMessage}>No booking records found for this filter.</p>
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          {filteredItems.map((item) => (
            <BookingCard
              key={item.booking.id}
              item={item}
              isWorkerRole={isWorkerRole}
              onStatusChange={handleStatusChange}
              onPayClick={(upiId, payeeName) => initiatePayment(upiId, payeeName)}
              onReviewClick={(id) => setReviewBookingId(id)}
              onViewDetails={(it) => setSelectedDetailItem(it)}
            />
          ))}
        </div>
      )}

      {/* UPI Payment Modal */}
      {activePayment && (
        <UpiQrModal
          isOpen={!!activePayment}
          onClose={clearPayment}
          upiId={activePayment.upiId}
          payeeName={activePayment.payeeName}
          upiUri={activePayment.uri}
        />
      )}

      {/* Review Submission Modal */}
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

      {/* Detailed Booking Summary Modal */}
      <Modal
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        title='Booking Full Summary & Audit'
      >
        {selectedDetailItem && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <strong>Status:</strong>
              <Badge variant='success'>{selectedDetailItem.booking.status}</Badge>
            </div>
            <div>
              <strong>Service Address:</strong>
              <p
                style={{
                  color: 'var(--color-slate-600)',
                  fontSize: '14px',
                  marginTop: '2px',
                }}
              >
                {selectedDetailItem.booking.address}
              </p>
            </div>
            <div>
              <strong>Requested Slot Timestamp:</strong>
              <p
                style={{
                  color: 'var(--color-slate-600)',
                  fontSize: '14px',
                  marginTop: '2px',
                }}
              >
                {formatDateTime(selectedDetailItem.booking.requestedDate)}
              </p>
            </div>
            {selectedDetailItem.booking.notes && (
              <div>
                <strong>Task Instructions / Notes:</strong>
                <p
                  style={{
                    color: 'var(--color-slate-600)',
                    fontSize: '14px',
                    marginTop: '2px',
                  }}
                >
                  {selectedDetailItem.booking.notes}
                </p>
              </div>
            )}
            <div
              style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}
            >
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Booking ID: {selectedDetailItem.booking.id}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
