import { db } from '@/db/index.js';
import { users, bookings, reviews } from '@/db/schema/index.js';
import { sql, eq, desc, ilike, and, or } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';

export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

export class AdminService {
  static async getAllUsers(params: AdminUsersQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    // Role filter
    if (params.role && params.role !== 'ALL') {
      const validRoles = ['USER', 'WORKER', 'ADMIN'] as const;
      if (validRoles.includes(params.role as (typeof validRoles)[number])) {
        conditions.push(eq(users.role, params.role as 'USER' | 'WORKER' | 'ADMIN'));
      }
    }

    // Search query (name, email, phone, city)
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      conditions.push(
        or(
          ilike(users.name, searchTerm),
          ilike(users.email, searchTerm),
          ilike(users.city, searchTerm),
          ilike(users.phone, searchTerm),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute count and paginated data queries concurrently
    const [countResult, paginatedUsers] = await Promise.all([
      db
        .select({ total: sql<number>`cast(count(*) as integer)` })
        .from(users)
        .where(whereClause),
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          city: users.city,
          avatarUrl: users.avatarUrl,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      users: paginatedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

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

  static async deleteUser(userId: string) {
    const [deleted] = await db.delete(users).where(eq(users.id, userId)).returning();
    if (!deleted) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User not found');
    }
    return { message: 'User successfully deleted' };
  }
}
