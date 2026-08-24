import React, { useState, useMemo, useEffect } from 'react';
import { useBookingsPageLogic } from '@/modules/bookings/hooks/useBookingsPageLogic';
import { BookingHeaderBar } from '@/modules/bookings/components/BookingHeaderBar/BookingHeaderBar';
import { BookingFilterTabs } from '@/modules/bookings/components/BookingFilterTabs/BookingFilterTabs';
import { BookingMasterFeed } from '@/modules/bookings/components/BookingMasterFeed/BookingMasterFeed';
import { BookingDetailCanvas } from '@/modules/bookings/components/BookingDetailCanvas/BookingDetailCanvas';
import { UpiQrModal } from '@/modules/payments/components/UpiQrModal/UpiQrModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './BookingsPage.module.css';

export const BookingsPage: React.FC = () => {
  const {
    isWorkerRole,
    isLoading,
    items,
    activeTab,
    activePayment,
    rating,
    comment,
    isReviewPending,
    handleTabChange,
    handleStatusChange,
    initiatePayment,
    clearPayment,
    setRating,
    setComment,
    handleReviewSubmit,
  } = useBookingsPageLogic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= 960 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth <= 960);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredFeed = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === 'ALL' || item.booking.status === activeTab;

      // Safely extract name depending on actual object shape
      const customerName = 'user' in item ? item.user?.name : undefined;
      const workerCategory =
        'workerProfile' in item ? item.workerProfile?.category : undefined;
      const targetName = customerName || workerCategory || '';

      const matchesSearch =
        targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.booking.address || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, searchQuery]);

  const activeItem = useMemo(() => {
    if (!filteredFeed.length) return null;
    return (
      filteredFeed.find((i) => i.booking.id === selectedBookingId) || filteredFeed[0]
    );
  }, [filteredFeed, selectedBookingId]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Spinner size='lg' />
      </div>
    );
  }

  const showFeedOnMobile = !selectedBookingId || !isMobileScreen;
  const showDetailOnMobile =
    (Boolean(selectedBookingId) || !isMobileScreen) && Boolean(activeItem);

  return (
    <div className={styles.consoleContainer}>
      <BookingHeaderBar isWorkerRole={isWorkerRole} totalCount={items.length} />

      <BookingFilterTabs
        activeTab={activeTab}
        items={items}
        onTabChange={handleTabChange}
      />

      <div className={styles.splitLayout}>
        {showFeedOnMobile && (
          <BookingMasterFeed
            feed={filteredFeed}
            selectedId={activeItem ? activeItem.booking.id : null}
            searchQuery={searchQuery}
            isWorkerRole={isWorkerRole}
            onSearchChange={setSearchQuery}
            onSelect={(id) => setSelectedBookingId(id)}
          />
        )}

        {showDetailOnMobile && activeItem && (
          <BookingDetailCanvas
            item={activeItem}
            isWorkerRole={isWorkerRole}
            rating={rating}
            comment={comment}
            isReviewPending={isReviewPending}
            onStatusChange={handleStatusChange}
            onInitiatePayment={initiatePayment}
            onRatingChange={setRating}
            onCommentChange={setComment}
            onReviewSubmit={handleReviewSubmit}
            onBackToFeed={isMobileScreen ? () => setSelectedBookingId(null) : undefined}
          />
        )}
      </div>

      {activePayment && (
        <UpiQrModal
          isOpen={Boolean(activePayment)}
          onClose={clearPayment}
          upiId={activePayment.upiId}
          payeeName={activePayment.payeeName}
          amount={activePayment.amount}
          upiUri={activePayment.uri}
        />
      )}
    </div>
  );
};
