import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { roleEnum } from '@/db/schema/enums.js';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    phone: text('phone').notNull(),
    avatarUrl: text('avatar_url'), // Receives Cloudinary URL from frontend
    role: roleEnum('role').default('USER').notNull(),
    city: text('city').notNull(),
    refreshTokenHash: text('refresh_token_hash'), // For token revocation
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('users_city_idx').on(table.city),
    index('users_email_idx').on(table.email),
  ],
);
