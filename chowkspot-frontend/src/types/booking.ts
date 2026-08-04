import type { APP_CONSTANTS } from '@/config/constants';
import type { WorkerProfile } from './worker';

export type BookingStatus =
  (typeof APP_CONSTANTS.BOOKING_STATUS)[keyof typeof APP_CONSTANTS.BOOKING_STATUS];

export interface Booking {
  id: string;
  userId: string;
  workerId: string;
  status: BookingStatus;
  requestedDate: string;
  counterDate?: string | null | undefined;
  address: string;
  notes?: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerBookingItem {
  booking: Booking;
  workerProfile: WorkerProfile;
}

export interface WorkerBookingItem {
  booking: Booking;
  user: {
    name: string;
    phone: string;
    city: string;
    avatarUrl?: string | null | undefined;
  };
}

export interface CreateBookingInput {
  workerId: string;
  requestedDate: string;
  address: string;
  notes?: string | undefined;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
  counterDate?: string | undefined; // Added explicit | undefined
}
