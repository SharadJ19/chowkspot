import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { bookings } from '@/db/schema/bookings.js';
import { users } from '@/db/schema/users.js';
import { workerProfiles } from '@/db/schema/workers.js';

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
      .references(() => bookings.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    workerId: uuid('worker_id')
      .references(() => workerProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('reviews_worker_id_idx').on(table.workerId)],
);
