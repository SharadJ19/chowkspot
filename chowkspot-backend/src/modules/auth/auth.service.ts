import { db } from '@/db/index.js';
import { users } from '@/db/schema/index.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/utils/password.js';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/mailer.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt.js';
import { ApiError } from '@/utils/ApiError.js';
import { CONSTANTS } from '@/config/constants.js';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/modules/auth/auth.schema.js';

export class AuthService {
  static async register(input: RegisterInput) {
    // 1. Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email));

    if (existingUser) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.CONFLICT,
        'User with this email already exists',
      );
    }

    // 2. Hash Password & Create User (Auto-verified: true)
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
        isVerified: true, // 👈 Auto-verify all newly registered accounts
      })
      .returning();

    // Guard against undefined
    if (!newUser) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Failed to create user',
      );
    }

    // 3. Tokens
    const accessToken = generateAccessToken({ userId: newUser.id, role: newUser.role });
    const refreshToken = generateRefreshToken({ userId: newUser.id, role: newUser.role });

    // 4. Store hashed refresh token in DB
    const refreshTokenHash = await hashPassword(refreshToken);
    await db
      .update(users)
      .set({
        refreshTokenHash,
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      })
      .where(eq(users.id, newUser.id));

    const {
      passwordHash: _,
      refreshTokenHash: __,
      emailVerifyTokenHash: ___,
      ...userWithoutSecrets
    } = newUser;

    return {
      user: { ...userWithoutSecrets, isVerified: true },
      accessToken,
      refreshToken,
    };
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

  static async verifyEmail(token: string, email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || !user.emailVerifyTokenHash || !user.emailVerifyExpiresAt) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'Invalid verification request',
      );
    }

    if (new Date() > user.emailVerifyExpiresAt) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'Verification link has expired',
      );
    }

    const isValidToken = await verifyPassword(user.emailVerifyTokenHash, token);
    if (!isValidToken) {
      throw new ApiError(CONSTANTS.HTTP_STATUS.BAD_REQUEST, 'Invalid verification token');
    }

    await db
      .update(users)
      .set({
        isVerified: true,
        emailVerifyTokenHash: null,
        emailVerifyExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    return { message: 'Email successfully verified' };
  }

  static async forgotPassword(input: ForgotPasswordInput) {
    // 1. Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, input.email));

    // CRITICAL SECURITY (Anti-Enumeration):
    // Always return a generic success message even if the user doesn't exist.
    if (!user) {
      return {
        message: 'If an account exists with this email, a reset link has been sent.',
      };
    }

    // 2. Generate secure token & short 15-minute expiry
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenHash = await hashPassword(rawResetToken);
    const passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Save hash and expiry to database
    await db
      .update(users)
      .set({ passwordResetTokenHash, passwordResetExpiresAt })
      .where(eq(users.id, user.id));

    // 4. Asynchronously dispatch email
    void sendPasswordResetEmail(user.email, rawResetToken, user.name);

    return {
      message: 'If an account exists with this email, a reset link has been sent.',
    };
  }

  static async resetPassword(input: ResetPasswordInput) {
    // 1. Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, input.email));

    if (!user || !user.passwordResetTokenHash || !user.passwordResetExpiresAt) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'Invalid or expired password reset request',
      );
    }

    // 2. Check expiration
    if (new Date() > user.passwordResetExpiresAt) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'Password reset link has expired',
      );
    }

    // 3. Verify token match
    const isValidToken = await verifyPassword(user.passwordResetTokenHash, input.token);
    if (!isValidToken) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.BAD_REQUEST,
        'Invalid password reset token',
      );
    }

    // 4. Hash new password & clear reset token + revoke active refresh sessions
    const passwordHash = await hashPassword(input.newPassword);

    await db
      .update(users)
      .set({
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
        refreshTokenHash: null,
      })
      .where(eq(users.id, user.id));

    return {
      message: 'Password successfully reset. Please log in with your new password.',
    };
  }

  static async refreshTokens(refreshToken: string) {
    // 1. Verify Refresh Token JWT signature
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (_err) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
        'Invalid or expired refresh token',
      );
    }

    // 2. Fetch User from DB
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId));

    if (!user || !user.refreshTokenHash) {
      throw new ApiError(
        CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
        'Refresh token revoked or user not found',
      );
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
    await db
      .update(users)
      .set({ refreshTokenHash: newRefreshTokenHash })
      .where(eq(users.id, user.id));

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
