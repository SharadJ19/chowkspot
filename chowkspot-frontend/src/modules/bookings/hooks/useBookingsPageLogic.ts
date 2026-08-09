import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from './useBookingQueries';
import { useUpiPayment } from '@/modules/payments/hooks/useUpiPayment';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { toast } from 'sonner';
import type { BookingStatus, CustomerBookingItem, WorkerBookingItem } from '@/types';

const ITEMS_PER_PAGE = 6;

export const useBookingsPageLogic = () => {
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
    setCurrentPage(1);
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

  return {
    user,
    isWorkerRole,
    isLoading: bookingsQuery.isLoading,
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
    isReviewPending: createReviewMutation.isPending,
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
  };
};
