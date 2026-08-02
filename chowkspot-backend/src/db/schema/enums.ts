import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['USER', 'WORKER', 'ADMIN']);

export const bookingStatusEnum = pgEnum('booking_status', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'COUNTER_PROPOSED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const rateTypeEnum = pgEnum('rate_type', ['HOURLY', 'FIXED', 'INSPECTION_FIRST']);
