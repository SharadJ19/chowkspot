import React from 'react';
import { Wrench, Calendar as CalendarIcon } from 'lucide-react';
import { useBookingsPageLogic } from '@/modules/bookings/hooks/useBookingsPageLogic';
import { BookingCard } from '@/modules/bookings/components/BookingCard/BookingCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { UpiQrModal } from '@/modules/payments/components/UpiQrModal/UpiQrModal';
import { Modal } from '@/components/ui/Modal/Modal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { formatDate } from '@/utils/formatDate';
import styles from './BookingsPage.module.css';

export const BookingsPage: React.FC = () => {
  const {
    isWorkerRole,
    isLoading,
    items,
    activeTab,
    currentPage,
    paginatedItems,
    totalPages,
    activePayment,
    reviewBookingId,
    selectedDetailItem,
    rating,
    comment,
    isReviewPending,
    handleTabChange,
    setCurrentPage,
    handleStatusChange,
    initiatePayment,
    clearPayment,
    setReviewBookingId,
    setSelectedDetailItem,
    setRating,
    setComment,
    handleReviewSubmit,
  } = useBookingsPageLogic();

  if (isLoading) {
    return (
      <div className={styles.centerLoading}>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.headerRow}>
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

      <div className={styles.tabsContainer}>
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
        <div className={styles.cardsList}>
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
        <div className={styles.reviewModalContent}>
          <div className={styles.ratingCenterBox}>
            <span className={styles.formLabel}>Rating (1 to 5 Stars)</span>
            <RatingStars rating={rating} interactive onChange={(r) => setRating(r)} />
          </div>

          <div className={styles.reviewModalContent}>
            <label className={styles.formLabel}>Written Review (Verified Booking)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share how the service went...'
              className={styles.textareaInput}
            />
          </div>

          <Button onClick={handleReviewSubmit} isLoading={isReviewPending} fullWidth>
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
          <div className={styles.detailModalContent}>
            <div className={styles.detailHeaderRow}>
              <strong>Current Status:</strong>
              <Badge variant='success'>{selectedDetailItem.booking.status}</Badge>
            </div>
            <div>
              <strong>Service Address:</strong>
              <p className={styles.detailSubText}>{selectedDetailItem.booking.address}</p>
            </div>
            <div>
              <strong>Requested Slot Timestamp:</strong>
              <p className={styles.detailSubText}>
                {formatDate(selectedDetailItem.booking.requestedDate, 'datetime')}
              </p>
            </div>
            {selectedDetailItem.booking.notes && (
              <div>
                <strong>Task Instructions / Notes:</strong>
                <p className={styles.detailSubText}>{selectedDetailItem.booking.notes}</p>
              </div>
            )}
            <div className={styles.detailDivider}>
              <span className={styles.detailIdText}>
                Booking ID: {selectedDetailItem.booking.id}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
