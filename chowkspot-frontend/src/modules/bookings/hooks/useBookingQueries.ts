import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookings.api';
import type { CreateBookingInput, UpdateBookingStatusInput } from '@/types';

export const BOOKINGS_QUERY_KEY = 'my_bookings';

export const useBookingQueries = () => {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: [BOOKINGS_QUERY_KEY],
    queryFn: async () => {
      const res = await bookingsApi.getMyBookings();
      return res.data || [];
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingInput) => bookingsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: UpdateBookingStatusInput;
    }) => bookingsApi.updateStatus(bookingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
    },
  });

  return {
    bookingsQuery,
    createBookingMutation,
    updateStatusMutation,
  };
};
