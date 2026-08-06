import { db } from '@/db/index.js';
import { users, workerProfiles } from '@/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import { UpdateProfileInput } from '@/modules/users/users.schema.js';

export class UserService {
  static async getProfile(userId: string) {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        role: users.role,
        city: users.city,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User profile not found');
    }

    let workerProfile = null;
    if (user.role === CONSTANTS.ROLES.WORKER) {
      [workerProfile] = await db
        .select()
        .from(workerProfiles)
        .where(eq(workerProfiles.userId, userId));
    }

    return { user, workerProfile };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    return await db.transaction(async (tx) => {
      const [currentUser] = await tx.select().from(users).where(eq(users.id, userId));
      if (!currentUser) {
        throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User profile not found');
      }

      // Separate core user fields from worker profile fields
      const {
        name,
        phone,
        city,
        avatarUrl,
        category,
        bio,
        experienceYears,
        rateType,
        baseRate,
        serviceCities,
        paymentIdentifier,
      } = input;

      const userUpdateData: Record<string, unknown> = { updatedAt: new Date() };
      if (name !== undefined) userUpdateData.name = name;
      if (phone !== undefined) userUpdateData.phone = phone;
      if (city !== undefined) userUpdateData.city = city;
      if (avatarUrl !== undefined) userUpdateData.avatarUrl = avatarUrl;

      const [updatedUser] = await tx
        .update(users)
        .set(userUpdateData)
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          avatarUrl: users.avatarUrl,
          role: users.role,
          city: users.city,
          updatedAt: users.updatedAt,
        });

      let updatedWorkerProfile = null;
      if (currentUser.role === CONSTANTS.ROLES.WORKER) {
        const workerUpdateData: Record<string, unknown> = {};
        if (category !== undefined) workerUpdateData.category = category;
        if (bio !== undefined) workerUpdateData.bio = bio;
        if (experienceYears !== undefined)
          workerUpdateData.experienceYears = experienceYears;
        if (rateType !== undefined) workerUpdateData.rateType = rateType;
        if (baseRate !== undefined) workerUpdateData.baseRate = baseRate;
        if (serviceCities !== undefined) workerUpdateData.serviceCities = serviceCities;
        if (paymentIdentifier !== undefined)
          workerUpdateData.paymentIdentifier = paymentIdentifier;

        if (Object.keys(workerUpdateData).length > 0) {
          [updatedWorkerProfile] = await tx
            .update(workerProfiles)
            .set(workerUpdateData)
            .where(eq(workerProfiles.userId, userId))
            .returning();
        }
      }

      return { user: updatedUser, workerProfile: updatedWorkerProfile };
    });
  }
}
