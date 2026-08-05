# 🗄️ ChowkSpot — Database & Concurrency Documentation

[← Back to Main README](../README.md)

## 📌 Engine Overview

**ChowkSpot** utilizes **PostgreSQL** paired with **Drizzle ORM** for type-safe queries, explicit schema migrations, and zero-overhead SQL performance.

## 📊 Entity Relationship & Schema Layout

```

┌─────────────────┐       1:1       ┌─────────────────────┐
│      users      │ ───────────────►│   worker_profiles   │
└────────┬────────┘                 └──────────┬──────────┘
│                                     │
│ 1:N                                 │ 1:N
▼                                     ▼
┌─────────────────────────────────────────────────────────┐
│                        bookings                         │
└────────────────────────────┬────────────────────────────┘
│ 1:1 (Where Status = COMPLETED)
▼
┌─────────────────┐
│     reviews     │
└─────────────────┘

```

## ⚡ Indexing & Search Optimization

To handle multi-city filter queries and fuzzy service searches efficiently across growing datasets:

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
    // ...
  },
  (table) => [
    // Composite B-Tree index for filtered marketplace queries
    index('worker_category_avail_idx').on(table.category, table.isAvailable),

    // GIN Trigram index for fuzzy text category matching ("electrcian" -> "Electrician")
    index('worker_category_trgm_idx').using('gin', sql`${table.category} gin_trgm_ops`),
  ],
);
```

## 🔄 Booking Deterministic State Machine

Bookings follow a strict state transition matrix to prevent illegal state jumps:

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
     │      ┌───────────────────────┘
     ▼      ▼
┌──────────────┐
│ IN_PROGRESS  │
└──────┬───────┘
       ▼
┌──────────────┐
│  COMPLETED   │
└──────────────┘

```

### Concurrency Protection & Row Locking

State updates execute within PostgreSQL transactions using pessimistic row locking (`FOR UPDATE`) to prevent race conditions during concurrent counter-offers or cancellations:

```ts
return await db.transaction(async (tx) => {
  const [existingBooking] = await tx
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .for('update'); // Locks row during state verification

  if (!allowedTransitions[existingBooking.status].includes(newStatus)) {
    throw new ApiError(400, 'Invalid state transition');
  }

  // Update status safely...
});
```

## ⭐ Atomic Review & Score Calculation

When a customer submits a review for a completed job, average rating scores are recalculated atomically inside a transaction:

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
