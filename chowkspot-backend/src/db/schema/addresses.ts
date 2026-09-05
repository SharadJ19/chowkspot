import { pgTable, uuid, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users.js';

export const userAddresses = pgTable(
  'user_addresses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    label: text('label').default('Home').notNull(), // 'Home', 'Work', 'Site', etc.
    addressLine: text('address_line').notNull(),
    city: text('city').notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('user_addresses_user_id_idx').on(table.userId)],
);
