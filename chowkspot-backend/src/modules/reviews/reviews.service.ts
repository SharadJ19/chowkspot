import { db } from '@/db/index.js';
import { reviews, bookings, workerProfiles, users } from '@/db/schema/index.js';
import { eq, and, sql } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import { CreateReviewInput } from '@/modules/reviews/reviews.schema.js';

export class ReviewService {
  static async createReview(userId: string, input: CreateReviewInput) {
    return await db.transaction(async (tx) => {
      // 1. Fetch booking and verify it belongs to this user and is COMPLETED
      const [booking] = await tx
        .select()
        .from(bookings)
        .where(and(eq(bookings.id, input.bookingId), eq(bookings.userId, userId)));

      if (!booking) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.NOT_FOUND,
          'Booking not found or access denied',
        );
      }

      if (booking.status !== CONSTANTS.BOOKING_STATUS.COMPLETED) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.BAD_REQUEST,
          'Reviews can only be submitted for COMPLETED bookings',
        );
      }

      // 2. Check if a review already exists for this booking
      const [existingReview] = await tx
        .select()
        .from(reviews)
        .where(eq(reviews.bookingId, input.bookingId));

      if (existingReview) {
        throw new ApiError(
          CONSTANTS.HTTP_STATUS.BAD_REQUEST,
          'A review has already been submitted for this booking',
        );
      }

      // 3. Insert review
      const [newReview] = await tx
        .insert(reviews)
        .values({
          bookingId: input.bookingId,
          userId,
          workerId: booking.workerId,
          rating: input.rating,
          comment: input.comment,
        })
        .returning();

      // 4. Atomically recalculate worker average rating and increment total reviews count
      await tx
        .update(workerProfiles)
        .set({
          totalReviews: sql`${workerProfiles.totalReviews} + 1`,
          avgRating: sql`ROUND(
            ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${input.rating}) / (${workerProfiles.totalReviews} + 1),
            2
          )`,
        })
        .where(eq(workerProfiles.id, booking.workerId));

      return newReview;
    });
  }

  static async getWorkerReviews(workerId: string) {
    return await db
      .select({
        review: reviews,
        user: {
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.workerId, workerId));
  }
}
