import { fetchClient } from '@/lib/fetchClient';
import type {
  Booking,
  CustomerBookingItem,
  WorkerBookingItem,
  CreateBookingInput,
  UpdateBookingStatusInput,
} from '@/types';

export const bookingsApi = {
  createBooking: (data: CreateBookingInput) =>
    fetchClient<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyBookings: () =>
    fetchClient<(CustomerBookingItem | WorkerBookingItem)[]>('/bookings'),

  updateStatus: (bookingId: string, data: UpdateBookingStatusInput) =>
    fetchClient<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
