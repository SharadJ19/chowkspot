import { db } from '@/db/index.js';
import { users } from '@/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import { RegisterInput, LoginInput } from '@/modules/auth/auth.schema.js';

export class AuthService {
  static async register(input: RegisterInput) {
    // 1. Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, input.email));

    if (existingUser) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }

    // 2. Hash Password & Create User
    const passwordHash = await hashPassword(input.password);

    const [newUser] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
        phone: input.phone,
        city: input.city,
        role: input.role,
        avatarUrl: input.avatarUrl,
      })
      .returning();

    // Guard against undefined
    if (!newUser) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create user');
    }

    // 3. Tokens
    const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role });
    const refreshToken = generateRefreshToken({ userId: newUser.id, role: newUser.role });

    // 4. Store hashed refresh token in db for revocation
    const refreshTokenHash = await hashPassword(refreshToken);
    await db.update(users).set({ refreshTokenHash }).where(eq(users.id, newUser.id));

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = newUser;
    return { user: userWithoutSecrets, accessToken, refreshToken };
  }

  static async login(input: LoginInput) {
    // 1. Find User
    const [user] = await db.select().from(users).where(eq(users.email, input.email));

    if (!user) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    // 2. Verify Password
    const isValidPassword = await verifyPassword(user.passwordHash, input.password);
    if (!isValidPassword) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    // 3. Tokens
    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const refreshTokenHash = await hashPassword(refreshToken);
    await db.update(users).set({ refreshTokenHash }).where(eq(users.id, user.id));

    const { passwordHash: _, refreshTokenHash: __, ...userWithoutSecrets } = user;

    return { user: userWithoutSecrets, accessToken, refreshToken };
  }

  static async logout(userId: string) {
    await db.update(users).set({ refreshTokenHash: null }).where(eq(users.id, userId));
  }

  static async refreshTokens(refreshToken: string) {
    // 1. Verify Refresh Token JWT signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    // 2. Fetch User from DB
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));

    if (!user || !user.refreshTokenHash) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Refresh token revoked or user not found');
    }

    // 3. Verify Refresh Token matches DB hash
    const isValidToken = await verifyPassword(user.refreshTokenHash, refreshToken);
    if (!isValidToken) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
    }

    // 4. Issue new Access Token and rotate Refresh Token
    const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });
    const newRefreshToken = generateRefreshToken({ userId: user.id, role: user.role });

    const newRefreshTokenHash = await hashPassword(newRefreshToken);
    await db.update(users).set({ refreshTokenHash: newRefreshTokenHash }).where(eq(users.id, user.id));

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
