import { db } from '@/db/index.js';
import { users, workerProfiles } from '@/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import { UpdateProfileInput } from '@/modules/users/users.schema.js';

export class UserService {
  static async getProfile(userId: string) {
    // 1. Fetch user core record
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

    // 2. If user is a WORKER, include worker profile details
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
    if (Object.keys(input).length === 0) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'At least one field must be provided for update',
      );
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
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

    if (!updatedUser) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.NOT_FOUND, 'User profile not found');
    }

    return updatedUser;
  }
}
