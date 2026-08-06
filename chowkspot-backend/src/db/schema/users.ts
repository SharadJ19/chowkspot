// src/db/schema/users.ts
import { pgTable, uuid, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { roleEnum } from '@/db/schema/enums.js';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    phone: text('phone').notNull(),
    avatarUrl: text('avatar_url'),
    role: roleEnum('role').default('USER').notNull(),
    city: text('city').notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    emailVerifyTokenHash: text('email_verify_token_hash'),
    emailVerifyExpiresAt: timestamp('email_verify_expires_at', { withTimezone: true }),
    passwordResetTokenHash: text('password_reset_token_hash'),
    passwordResetExpiresAt: timestamp('password_reset_expires_at', {
      withTimezone: true,
    }),
    refreshTokenHash: text('refresh_token_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('users_city_idx').on(table.city),
    index('users_email_idx').on(table.email),
  ],
);
