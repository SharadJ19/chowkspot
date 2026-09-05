import { db } from '@/db/index.js';
import { bookings, workerProfiles, users } from '@/db/schema/index.js';
import { userAddresses } from '@/db/schema/addresses.js';
import { eq, and, ilike } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS, BookingStatus } from '@/config/constants.js';
import {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from '@/modules/bookings/bookings.schema.js';
import { sendRealtimeNotification } from '@/sockets/socket.engine.js';

export class BookingService {
  // Use constants for state transition map
  private static allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    [CONSTANTS.BOOKING_STATUS.PENDING]: [
      CONSTANTS.BOOKING_STATUS.ACCEPTED,
      CONSTANTS.BOOKING_STATUS.REJECTED,
      CONSTANTS.BOOKING_STATUS.COUNTER_PROPOSED,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.COUNTER_PROPOSED]: [
      CONSTANTS.BOOKING_STATUS.ACCEPTED,
      CONSTANTS.BOOKING_STATUS.REJECTED,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.ACCEPTED]: [
      CONSTANTS.BOOKING_STATUS.IN_PROGRESS,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.IN_PROGRESS]: [CONSTANTS.BOOKING_STATUS.COMPLETED],
    [CONSTANTS.BOOKING_STATUS.COMPLETED]: [],
    [CONSTANTS.BOOKING_STATUS.REJECTED]: [],
    [CONSTANTS.BOOKING_STATUS.CANCELLED]: [],
  };

  static async createBooking(userId: string, input: CreateBookingInput) {
    // 1. Verify user exists and block ADMIN accounts from booking
    const [requestingUser] = await db
      .select({ role: users.role, city: users.city })
      .from(users)
      .where(eq(users.id, userId));

    if (!requestingUser) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    if (requestingUser.role === CONSTANTS.ROLES.ADMIN) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.FORBIDDEN,
        'Administrators cannot create service bookings. Please use a regular customer account.',
      );
    }

    // 2. Verify worker profile exists
    const [worker] = await db
      .select()
      .from(workerProfiles)
      .where(eq(workerProfiles.id, input.workerId));

    if (!worker) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'Worker profile not found');
    }

    // 3. Prevent user from booking themselves
    if (worker.userId === userId) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'You cannot book your own service profile',
      );
    }

    // 3. Auto-save address if not previously registered
    const normalizedAddress = input.address.trim();
    const [existingAddress] = await db
      .select({ id: userAddresses.id })
      .from(userAddresses)
      .where(
        and(
          eq(userAddresses.userId, userId),
          ilike(userAddresses.addressLine, normalizedAddress),
        ),
      );

    if (!existingAddress) {
      await db.insert(userAddresses).values({
        userId,
        addressLine: normalizedAddress,
        city: input.city || requestingUser.city || 'Chandigarh',
        label: input.addressLabel?.trim() || 'Saved Location',
        isDefault: false,
      });
    }

    // 4. Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        userId,
        workerId: input.workerId,
        requestedDate: new Date(input.requestedDate),
        address: normalizedAddress,
        notes: input.notes,
        status: CONSTANTS.BOOKING_STATUS.PENDING,
      })
      .returning();

    if (!newBooking) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to create booking record',
      );
    }

    // Realtime notification dispatch to worker
    sendRealtimeNotification(worker.userId, 'NEW_BOOKING_REQUEST', {
      bookingId: newBooking.id,
      userId,
      requestedDate: newBooking.requestedDate,
    });

    return newBooking;
  }

  static async updateBookingStatus(
    bookingId: string,
    currentUserId: string,
    input: UpdateBookingStatusInput,
  ) {
    const updatedBooking = await db.transaction(async (tx) => {
      // Fetch booking record with pessimistic locking
      const [existingBooking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId))
        .for('update');

      if (!existingBooking) {
        throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'Booking record not found');
      }

      // Validate State Machine Transition
      const currentStatus = existingBooking.status;
      const validNextStates = this.allowedTransitions[currentStatus];

      if (!validNextStates || !validNextStates.includes(input.status)) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.BAD_REQUEST,
          `Invalid state transition. Cannot move from ${currentStatus} to ${input.status}`,
        );
      }

      if (input.status === 'COUNTER_PROPOSED' && !input.counterDate) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.BAD_REQUEST,
          'counterDate is required when submitting a counter-proposal',
        );
      }

      const [updated] = await tx
        .update(bookings)
        .set({
          status: input.status,
          counterDate: input.counterDate
            ? new Date(input.counterDate)
            : existingBooking.counterDate,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, bookingId))
        .returning();

      // FIX: Guard check ensures updated record exists inside transaction
      if (!updated) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
          'Failed to update booking status',
        );
      }

      return updated;
    });

    // ⚡ REALTIME NOTIFICATION: Determine target recipient
    // Fetch worker details to identify who needs to be notified
    const [worker] = await db
      .select({ userId: workerProfiles.userId })
      .from(workerProfiles)
      .where(eq(workerProfiles.id, updatedBooking.workerId));

    // If current actor is the worker, notify the customer; otherwise notify the worker
    const targetUserId =
      worker && currentUserId === worker.userId ? updatedBooking.userId : worker?.userId;

    if (targetUserId) {
      sendRealtimeNotification(targetUserId, 'BOOKING_STATUS_UPDATED', {
        bookingId: updatedBooking.id,
        status: updatedBooking.status,
        counterDate: updatedBooking.counterDate,
      });
    }

    return updatedBooking;
  }

  static async getUserOrWorkerBookings(userId: string, role: string) {
    if (role === CONSTANTS.ROLES.WORKER) {
      const [profile] = await db
        .select()
        .from(workerProfiles)
        .where(eq(workerProfiles.userId, userId));

      if (!profile) {
        return [];
      }

      return await db
        .select({
          booking: bookings,
          user: {
            name: users.name,
            phone: users.phone,
            city: users.city,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(bookings)
        .innerJoin(users, eq(bookings.userId, users.id))
        .where(eq(bookings.workerId, profile.id));
    }

    return await db
      .select({
        booking: bookings,
        workerProfile: workerProfiles,
      })
      .from(bookings)
      .innerJoin(workerProfiles, eq(bookings.workerId, workerProfiles.id))
      .where(eq(bookings.userId, userId));
  }
}
