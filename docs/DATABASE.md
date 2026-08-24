# 🗄️ ChowkSpot — Database & Concurrency Documentation

[← Back to Main README](../README.md)

## 📌 Engine Overview

**ChowkSpot** runs on **PostgreSQL** configured via **Drizzle ORM** for type-safe schema definitions, deterministic migrations, and explicit transaction control.

## 📊 Entity Relationship Diagram

```plaintext
┌──────────────────┐        1:1        ┌──────────────────────┐
│      users       │ ─────────────────►│   worker_profiles    │
└────────┬─────────┘                   └──────────┬───────────┘
         │                                        │
         │ 1:N                                    │ 1:N
         ▼                                        ▼
┌─────────────────────────────────────────────────────────────┐
│                          bookings                           │
└─────────────────────────────┬───────────────────────────────┘
                              │ 1:1 (Where status = COMPLETED)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                          reviews                            │
└─────────────────────────────────────────────────────────────┘
```

## ⚡ Indexing & Search Optimization

To ensure sub-millisecond searches across 85+ regional cities:

```ts
export const workerProfiles = pgTable(
  'worker_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    category: text('category').notNull(),
    serviceCities: text('service_cities').array().notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    baseRate: decimal('base_rate', { precision: 10, scale: 2 }).notNull(),
    avgRating: decimal('avg_rating', { precision: 3, scale: 2 })
      .default('0.00')
      .notNull(),
    totalReviews: integer('total_reviews').default(0).notNull(),
  },
  (table) => [
    // Composite B-Tree index for filtered marketplace discovery
    index('worker_category_avail_idx').on(table.category, table.isAvailable),

    // GIN Trigram index for fuzzy text category matching ("electrcian" -> "Electrician")
    index('worker_category_trgm_idx').using('gin', sql`${table.category} gin_trgm_ops`),
  ],
);
```

## 🔄 Booking Deterministic State Machine

Bookings follow a strict transition matrix:

```
               ┌──────────┐
               │ PENDING  │
               └────┬─────┘
                    │
    ┌───────────────┼───────────────┬────────────────┐
    ▼               ▼               ▼                ▼
┌──────────┐  ┌──────────┐  ┌────────────────┐  ┌───────────┐
│ ACCEPTED │  │ REJECTED │  │COUNTER_PROPOSED│  │ CANCELLED │
└────┬─────┘  └──────────┘  └───────┬────────┘  └───────────┘
     │                              │
     │     ┌────────────────────────┘
     ▼     ▼
┌──────────────┐
│ IN_PROGRESS  │
└──────┬───────┘
       ▼
┌──────────────┐
│  COMPLETED   │
└──────────────┘

```

### Concurrency Protection & Row Locking

State modifications run inside PostgreSQL transactions using pessimistic locking (`FOR UPDATE`) to prevent race conditions during concurrent counter-proposals or cancellations:

```ts
return await db.transaction(async (tx) => {
  const [existingBooking] = await tx
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .for('update');

  if (!existingBooking) {
    throw new ApiError(404, 'Booking record not found');
  }

  const validNextStates = this.allowedTransitions[existingBooking.status];
  if (!validNextStates || !validNextStates.includes(input.status)) {
    throw new ApiError(
      400,
      `Invalid state transition: Cannot move from ${existingBooking.status} to ${input.status}`,
    );
  }

  // Update status safely...
});
```

## ⭐ Atomic Review & Score Calculation

Customer reviews require a `COMPLETED` booking status. Average ratings and review counts are updated atomically in the same database transaction:

```ts
await tx
  .update(workerProfiles)
  .set({
    totalReviews: sql`${workerProfiles.totalReviews} + 1`,
    avgRating: sql`ROUND(
      ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${input.rating}) / (${workerProfiles.totalReviews} + 1),
      2
    )`,
  })
  .where(eq(workerProfiles.id, booking.workerId));
```
