import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookingQueries } from './useBookingQueries';
import { useUpiPayment } from '@/modules/payments/hooks/useUpiPayment';
import { useReviewQueries } from '@/modules/reviews/hooks/useReviewQueries';
import { toast } from 'sonner';
import type { BookingStatus } from '@/types';

export const useBookingsPageLogic = () => {
  const { user } = useAuth();
  const isWorkerRole = user?.role === 'WORKER';

  const { bookingsQuery, updateStatusMutation } = useBookingQueries();
  const { activePayment, initiatePayment, clearPayment } = useUpiPayment();
  const { createReviewMutation } = useReviewQueries();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const items = useMemo(() => {
    return bookingsQuery.data || [];
  }, [bookingsQuery.data]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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

  const handleReviewSubmit = async (bookingId: string) => {
    try {
      await createReviewMutation.mutateAsync({
        bookingId,
        rating,
        comment,
      });
      toast.success('Thank you! Verified review posted successfully.');
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
    activePayment,
    rating,
    comment,
    isReviewPending: createReviewMutation.isPending,
    handleTabChange,
    handleStatusChange,
    initiatePayment,
    clearPayment,
    setRating,
    setComment,
    handleReviewSubmit,
  };
};
