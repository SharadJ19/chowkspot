import { db } from '@/db/index.js';
import { users, bookings, reviews } from '@/db/schema/index.js';
import { sql, eq, desc } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

export class AdminService {
  static async getPlatformStats() {
    const [userCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users)
      .where(eq(users.role, 'USER'));
    const [workerCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users)
      .where(eq(users.role, 'WORKER'));
    const [bookingCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(bookings);
    const [completedBookingRes] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(bookings)
      .where(eq(bookings.status, 'COMPLETED'));
    const [reviewCountRes] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(reviews);

    const recentBookings = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        requestedDate: bookings.requestedDate,
        createdAt: bookings.createdAt,
        address: bookings.address,
      })
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(5);

    return {
      totalUsers: userCountRes?.count ?? 0,
      totalWorkers: workerCountRes?.count ?? 0,
      totalBookings: bookingCountRes?.count ?? 0,
      completedBookings: completedBookingRes?.count ?? 0,
      totalReviews: reviewCountRes?.count ?? 0,
      recentBookings,
    };
  }

  static async getAllUsers() {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        city: users.city,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  static async deleteUser(userId: string) {
    const [deleted] = await db.delete(users).where(eq(users.id, userId)).returning();
    if (!deleted) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return { message: 'User successfully deleted' };
  }
}
