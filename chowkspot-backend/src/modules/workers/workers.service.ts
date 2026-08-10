// FILE: src/modules/workers/workers.service.ts
import { db } from '@/db/index.js';
import { workerProfiles, users } from '@/db/schema/index.js';
import { arrayContains, ilike, eq, and, gte, lte, or, sql } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import {
  CreateWorkerProfileInput,
  SearchWorkersQueryInput,
} from '@/modules/workers/workers.schema.js';

export class WorkerService {
  static async getWorkerById(workerId: string) {
    const [worker] = await db
      .select({
        id: workerProfiles.id,
        category: workerProfiles.category,
        bio: workerProfiles.bio,
        experienceYears: workerProfiles.experienceYears,
        rateType: workerProfiles.rateType,
        baseRate: workerProfiles.baseRate,
        isAvailable: workerProfiles.isAvailable,
        serviceCities: workerProfiles.serviceCities,
        paymentIdentifier: workerProfiles.paymentIdentifier,
        avgRating: workerProfiles.avgRating,
        totalReviews: workerProfiles.totalReviews,
        user: {
          name: users.name,
          phone: users.phone,
          city: users.city,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(workerProfiles)
      .innerJoin(users, eq(workerProfiles.userId, users.id))
      .where(eq(workerProfiles.id, workerId));

    if (!worker) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'Worker profile not found');
    }

    return worker;
  }

  static async createOrUpdateProfile(userId: string, input: CreateWorkerProfileInput) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const [existingProfile] = await db
      .select()
      .from(workerProfiles)
      .where(eq(workerProfiles.userId, userId));

    if (existingProfile) {
      const [updated] = await db
        .update(workerProfiles)
        .set({ ...input })
        .where(eq(workerProfiles.userId, userId))
        .returning();
      return updated;
    }

    await db
      .update(users)
      .set({ role: CONSTANTS.ROLES.WORKER })
      .where(eq(users.id, userId));

    const [newProfile] = await db
      .insert(workerProfiles)
      .values({
        userId,
        ...input,
      })
      .returning();

    return newProfile;
  }

  static async toggleAvailability(userId: string, isAvailable: boolean) {
    const [updated] = await db
      .update(workerProfiles)
      .set({ isAvailable })
      .where(eq(workerProfiles.userId, userId))
      .returning();

    if (!updated) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'Worker profile not found');
    }

    return updated;
  }

  static async searchWorkers(filters: SearchWorkersQueryInput) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = (page - 1) * limit;

    const conditions = [];

    // 1. Search by Name or Category keyword
    if (filters.name) {
      conditions.push(
        or(
          ilike(users.name, `%${filters.name}%`),
          ilike(workerProfiles.category, `%${filters.name}%`),
        ),
      );
    }

    // 2. Exact/Partial Category match
    if (filters.category) {
      conditions.push(ilike(workerProfiles.category, `%${filters.category}%`));
    }

    // 3. PostgreSQL Array Contains for City
    if (filters.city) {
      conditions.push(arrayContains(workerProfiles.serviceCities, [filters.city]));
    }

    // 4. Availability Filter
    if (filters.availableOnly) {
      conditions.push(eq(workerProfiles.isAvailable, true));
    }

    // 5. Minimum Experience Threshold
    if (filters.minExperience !== undefined && !isNaN(filters.minExperience)) {
      conditions.push(gte(workerProfiles.experienceYears, filters.minExperience));
    }

    // 6. Max Price Cap
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      conditions.push(
        lte(sql`CAST(${workerProfiles.baseRate} AS numeric)`, filters.maxPrice),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Execute total count and paginated queries concurrently
    const [countResult, workers] = await Promise.all([
      db
        .select({ total: sql<number>`cast(count(*) as integer)` })
        .from(workerProfiles)
        .innerJoin(users, eq(workerProfiles.userId, users.id))
        .where(whereClause),
      db
        .select({
          id: workerProfiles.id,
          category: workerProfiles.category,
          bio: workerProfiles.bio,
          experienceYears: workerProfiles.experienceYears,
          rateType: workerProfiles.rateType,
          baseRate: workerProfiles.baseRate,
          isAvailable: workerProfiles.isAvailable,
          serviceCities: workerProfiles.serviceCities,
          paymentIdentifier: workerProfiles.paymentIdentifier,
          avgRating: workerProfiles.avgRating,
          totalReviews: workerProfiles.totalReviews,
          user: {
            name: users.name,
            phone: users.phone,
            city: users.city,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(workerProfiles)
        .innerJoin(users, eq(workerProfiles.userId, users.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      workers,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
