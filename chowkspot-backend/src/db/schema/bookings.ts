import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users.js';
import { workerProfiles } from '@/db/schema/workers.js';
import { bookingStatusEnum } from '@/db/schema/enums.js';

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    workerId: uuid('worker_id')
      .references(() => workerProfiles.id, { onDelete: 'cascade' })
      .notNull(),
    status: bookingStatusEnum('status').default('PENDING').notNull(),
    requestedDate: timestamp('requested_date', { withTimezone: true }).notNull(),
    counterDate: timestamp('counter_date', { withTimezone: true }),
    address: text('address').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('bookings_user_id_idx').on(table.userId),
    index('bookings_worker_id_idx').on(table.workerId),
    index('bookings_status_idx').on(table.status),
  ],
);
