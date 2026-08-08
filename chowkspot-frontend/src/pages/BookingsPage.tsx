// FILE: src/pages/BookingsPage.tsx
import React, { useState, useMemo } from 'react';
import { Wrench, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from '@/modules/bookings/hooks/useBookingQueries';
import { BookingCard } from '@/modules/bookings/components/BookingCard/BookingCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UpiQrModal } from '@/modules/payments/components/UpiQrModal/UpiQrModal';
import { useUpiPayment } from '@/modules/payments/hooks/useUpiPayment';
import { Modal } from '@/components/ui/Modal/Modal';
import { Pagination } from '@/components/ui/Pagination/Pagination'; // 👈 Import Pagination
import { toast } from 'sonner';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import type { BookingStatus, CustomerBookingItem, WorkerBookingItem } from '@/types';
import { formatDate } from '@/utils/formatDate';
import styles from './Pages.module.css';
import modStyles from './BookingsPage.module.css';

const ITEMS_PER_PAGE = 6; // 👈 Limit bookings per page to eliminate clutter

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const isWorkerRole = user?.role === 'WORKER';

  const { bookingsQuery, updateStatusMutation } = useBookingQueries();
  const { activePayment, initiatePayment, clearPayment } = useUpiPayment();
  const { createReviewMutation } = useReviewQueries();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<
    CustomerBookingItem | WorkerBookingItem | null
  >(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const items = useMemo(() => {
    return bookingsQuery.data || [];
  }, [bookingsQuery.data]);

  const filteredItems = useMemo(() => {
    if (activeTab === 'ALL') return items;
    return items.filter((item) => item.booking.status === activeTab);
  }, [items, activeTab]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page counter on tab switch
  };

  const handleStatusChange = (
    bookingId: string,
    status: BookingStatus,
    counterDate?: string | undefined,
  ) => {
    updateStatusMutation.mutate(
      { bookingId, data: { status, counterDate } },
      {
        onSuccess: () => {
          toast.success(`Booking successfully marked as ${status.replace('_', ' ')}!`);
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
      toast.success('Thank you! Verified review posted successfully.');
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
        <div
          style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-primary-50)',
              color: 'var(--color-primary-600)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-primary-200)',
              flexShrink: 0,
            }}
          >
            {isWorkerRole ? <Wrench size={24} /> : <CalendarIcon size={24} />}
          </div>
          <div>
            <h1 className={styles.sectionTitle}>
              {isWorkerRole
                ? 'Incoming Job Requests Command Center'
                : 'My Service Bookings'}
            </h1>
            <p className={styles.sectionSubtitle}>
              {isWorkerRole
                ? 'Accept customer service requests, manage active job lifecycles, and coordinate with clients'
                : 'Track active repair requests, settle direct UPI payments with 0% commission, and review completed jobs'}
            </p>
          </div>
        </div>
        <Badge variant={isWorkerRole ? 'primary' : 'secondary'}>
          <span>
            {isWorkerRole ? 'Worker Mode Active' : 'Customer Mode Active'} •{' '}
            {items.length} Records
          </span>
        </Badge>
      </div>

      <div className={modStyles.tabsContainer}>
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
                onClick={() => handleTabChange(tab)}
              >
                {tab.replace('_', ' ')} ({count})
              </Button>
            );
          },
        )}
      </div>

      {paginatedItems.length === 0 ? (
        <p className={styles.emptyMessage}>
          {isWorkerRole
            ? 'No incoming job requests match this filter right now.'
            : 'You have no service bookings under this filter category.'}
        </p>
      ) : (
        <div
          className={modStyles.cardsList}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}
        >
          {paginatedItems.map((item) => (
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

      {/* Pagination component controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

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
        <div className={modStyles.reviewModalContent}>
          <div className={modStyles.ratingCenterBox}>
            <span className={styles.formLabel}>Rating (1 to 5 Stars)</span>
            <RatingStars rating={rating} interactive onChange={(r) => setRating(r)} />
          </div>

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Written Review (Verified Booking)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share how the service went...'
              className={styles.textareaInput}
            />
          </div>

          <Button
            onClick={handleReviewSubmit}
            isLoading={createReviewMutation.isPending}
            fullWidth
          >
            Submit Verified Review
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        title='Booking Full Summary & Audit'
      >
        {selectedDetailItem && (
          <div className={modStyles.detailModalContent}>
            <div className={modStyles.detailHeaderRow}>
              <strong>Current Status:</strong>
              <Badge variant='success'>{selectedDetailItem.booking.status}</Badge>
            </div>
            <div>
              <strong>Service Address:</strong>
              <p className={modStyles.detailSubText}>
                {selectedDetailItem.booking.address}
              </p>
            </div>
            <div>
              <strong>Requested Slot Timestamp:</strong>
              <p className={modStyles.detailSubText}>
                {formatDate(selectedDetailItem.booking.requestedDate, 'datetime')}
              </p>
            </div>
            {selectedDetailItem.booking.notes && (
              <div>
                <strong>Task Instructions / Notes:</strong>
                <p className={modStyles.detailSubText}>
                  {selectedDetailItem.booking.notes}
                </p>
              </div>
            )}
            <div className={modStyles.detailDivider}>
              <span className={modStyles.detailIdText}>
                Booking ID: {selectedDetailItem.booking.id}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
