import { db } from '@/db/index.js';
import { workerProfiles, users } from '@/db/schema/index.js';
import { arrayContains, ilike, eq, and } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import { CreateWorkerProfileInput } from '@/modules/workers/workers.schema.js';
export class WorkerService {
  static async createOrUpdateProfile(userId: string, input: CreateWorkerProfileInput) {
    // 1. Check if user exists
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // 2. Insert or update worker profile
    const [existingProfile] = await db.select().from(workerProfiles).where(eq(workerProfiles.userId, userId));

    if (existingProfile) {
      const [updated] = await db
        .update(workerProfiles)
        .set({ ...input })
        .where(eq(workerProfiles.userId, userId))
        .returning();
      return updated;
    }

    // First time setup - update user role to WORKER
    await db.update(users).set({ role: CONSTANTS.ROLES.WORKER }).where(eq(users.id, userId));

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
    const [updated] = await db.update(workerProfiles).set({ isAvailable }).where(eq(workerProfiles.userId, userId)).returning();

    if (!updated) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'Worker profile not found');
    }

    return updated;
  }

  static async searchWorkers(category?: string, city?: string, availableOnly?: boolean) {
    let query = db
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
      .innerJoin(users, eq(workerProfiles.userId, users.id));

    const conditions = [];

    if (category) {
      conditions.push(ilike(workerProfiles.category, `%${category}%`));
    }

    if (city) {
      // Pure type-safe Drizzle array contains helper
      conditions.push(arrayContains(workerProfiles.serviceCities, [city]));
    }

    if (availableOnly) {
      conditions.push(eq(workerProfiles.isAvailable, true));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  }
}
