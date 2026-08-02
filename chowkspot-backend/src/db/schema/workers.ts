import { pgTable, uuid, text, integer, decimal, boolean, index } from 'drizzle-orm/pg-core';
import { users } from '@/db/schema/users.js';
import { rateTypeEnum } from '@/db/schema/enums.js';
import { sql } from 'drizzle-orm';

export const workerProfiles = pgTable(
  'worker_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    category: text('category').notNull(), // e.g., "Electrician", "Plumber"
    bio: text('bio'),
    experienceYears: integer('experience_years').default(0).notNull(),
    rateType: rateTypeEnum('rate_type').default('FIXED').notNull(),
    baseRate: decimal('base_rate', { precision: 10, scale: 2 }).notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    serviceCities: text('service_cities').array().notNull(), // Array of Indian cities
    paymentIdentifier: text('payment_identifier'), // // UPI ID (e.g., worker@upi)
    avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).default('0.00').notNull(),
    totalReviews: integer('total_reviews').default(0).notNull(),
  },
  (table) => [
    index('worker_category_avail_idx').on(table.category, table.isAvailable),
    index('worker_category_trgm_idx').using('gin', sql`${table.category} gin_trgm_ops`),
  ],
);
