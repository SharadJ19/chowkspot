import { db } from '@/config/database.js';
import { users, workerProfiles, bookings, reviews } from '@/db/schema/index.js';
import { hashPassword } from '@/utils/password.js';
import { logger } from '@/utils/logger.js';
import {
  SEED_CITIES,
  SEED_CATEGORIES,
  SEED_USERS,
  SEED_WORKER_PROFILES,
  FIRST_NAMES,
  LAST_NAMES,
  LOCALITY_PREFIXES,
  GOOD_COMMENTS,
  BAD_COMMENTS,
} from '@/db/seeds/data.js';
import { eq, sql } from 'drizzle-orm';

// --- SEEDING SCALE CONFIGURATION CONSTANTS ---
const TOTAL_EXTRA_WORKERS = 1500;
const TOTAL_EXTRA_CUSTOMERS = 900;
const TOTAL_BOOKINGS = 3500;
const BASE_WORKER_REVIEW_COUNT = 25;

function getRandomElement<T>(arr: readonly T[] | T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) {
    throw new Error('Array lookup returned undefined.');
  }
  return item;
}

function getRandomElements<T>(arr: readonly T[] | T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  logger.info(
    `🌱 Seeding ChowkSpot with massive scale (~${1 + SEED_USERS.length + TOTAL_EXTRA_WORKERS + TOTAL_EXTRA_CUSTOMERS} Users & ${TOTAL_BOOKINGS} Bookings)...`,
  );

  try {
    await db.transaction(async (tx) => {
      logger.info('🧹 Clearing old table entries...');
      await tx.delete(reviews);
      await tx.delete(bookings);
      await tx.delete(workerProfiles);
      await tx.delete(users);

      const defaultPasswordHash = await hashPassword('Password123!');
      const createdUsersMap = new Map<string, string>();
      const createdWorkerMap = new Map<string, string>();

      // 1. Insert Base Template Users (Admin, Crew & Base Customers) FIRST
      logger.info('👤 Inserting Base Template Users & Admin...');
      for (const userData of SEED_USERS) {
        const passwordHash = await hashPassword(userData.password);
        const [insertedUser] = await tx
          .insert(users)
          .values({
            name: userData.name,
            email: userData.email,
            passwordHash,
            phone: userData.phone,
            city: userData.city,
            role: userData.role,
            avatarUrl: userData.avatarUrl,
          })
          .returning();

        if (insertedUser) {
          createdUsersMap.set(insertedUser.email, insertedUser.id);
        }
      }

      // 2. Insert Base Worker Profiles SECOND (Ensures Smarth appears first in search results)
      logger.info('🛠️ Inserting Base Worker Profiles...');
      for (const workerData of SEED_WORKER_PROFILES) {
        const userId = createdUsersMap.get(workerData.email);
        if (!userId) continue;

        const [insertedProfile] = await tx
          .insert(workerProfiles)
          .values({
            userId,
            category: workerData.category,
            bio: workerData.bio,
            experienceYears: workerData.experienceYears,
            rateType: workerData.rateType,
            baseRate: workerData.baseRate,
            isAvailable: workerData.isAvailable,
            serviceCities: workerData.serviceCities,
            paymentIdentifier: workerData.paymentIdentifier,
          })
          .returning();

        if (insertedProfile) {
          createdWorkerMap.set(workerData.email, insertedProfile.id);
        }
      }

      // 3. Generate Extra Customer Accounts
      logger.info(
        `👥 Expanding dataset with ~${TOTAL_EXTRA_CUSTOMERS} customer accounts...`,
      );
      const createdCustomersList: { id: string; name: string; city: string }[] = [];

      for (const userData of SEED_USERS) {
        if (userData.role === 'USER') {
          const userId = createdUsersMap.get(userData.email);
          if (userId) {
            createdCustomersList.push({
              id: userId,
              name: userData.name,
              city: userData.city,
            });
          }
        }
      }

      for (let j = 0; j < TOTAL_EXTRA_CUSTOMERS; j++) {
        const firstName = getRandomElement(FIRST_NAMES);
        const lastName = getRandomElement(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        const email = `customer.${j + 1}.${firstName.toLowerCase()}@gmail.com`;
        const phone = `+9197${getRandomNumber(10000000, 99999999)}`;
        const city = getRandomElement(SEED_CITIES);

        const [cust] = await tx
          .insert(users)
          .values({
            name: fullName,
            email,
            passwordHash: defaultPasswordHash,
            phone,
            city,
            role: 'USER',
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
          })
          .returning();

        if (cust) {
          createdCustomersList.push({ id: cust.id, name: cust.name, city: cust.city });
        }
      }

      // 4. GUARANTEED REVIEWS FOR EACH EXPLICIT BASE WORKER
      logger.info('⭐ Generating guaranteed reviews for each base worker profile...');
      for (const [email, workerProfileId] of createdWorkerMap.entries()) {
        const workerUserId = createdUsersMap.get(email);
        if (!workerUserId) continue;

        for (let r = 0; r < BASE_WORKER_REVIEW_COUNT; r++) {
          const customer = getRandomElement(createdCustomersList);
          const daysAgo = getRandomNumber(1, 30);
          const requestedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

          const [booking] = await tx
            .insert(bookings)
            .values({
              userId: customer.id,
              workerId: workerProfileId,
              status: 'COMPLETED',
              requestedDate,
              address: `${getRandomElement(LOCALITY_PREFIXES)}, ${customer.city}`,
              notes: 'Priority service request.',
            })
            .returning();

          if (booking) {
            const isBadReview = Math.random() < 0.3;
            let rating: number;
            let comment: string;

            if (isBadReview) {
              rating = getRandomNumber(1, 3);
              comment = getRandomElement(BAD_COMMENTS);
            } else {
              rating = Math.random() < 0.1 ? 5 : 4;
              comment = getRandomElement(GOOD_COMMENTS);
            }

            await tx.insert(reviews).values({
              bookingId: booking.id,
              userId: customer.id,
              workerId: workerProfileId,
              rating,
              comment,
            });

            await tx
              .update(workerProfiles)
              .set({
                totalReviews: sql`${workerProfiles.totalReviews} + 1`,
                avgRating: sql`ROUND(
                  ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${rating}) / (${workerProfiles.totalReviews} + 1),
                  2
                )`,
              })
              .where(eq(workerProfiles.id, workerProfileId));
          }
        }
      }

      // 5. Dynamic Expansion: Generate Extra Workers
      logger.info(
        `🚀 Expanding dataset with ~${TOTAL_EXTRA_WORKERS} generated workers across 80+ flat skills...`,
      );
      const createdWorkerProfilesList: { id: string; userId: string; email: string }[] =
        [];

      for (const [email, id] of createdWorkerMap.entries()) {
        const userId = createdUsersMap.get(email);
        if (userId) {
          createdWorkerProfilesList.push({ id, userId, email });
        }
      }

      for (let i = 0; i < TOTAL_EXTRA_WORKERS; i++) {
        const firstName = getRandomElement(FIRST_NAMES);
        const lastName = getRandomElement(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        const email = `worker.${i + 1}.${firstName.toLowerCase()}.${lastName.toLowerCase()}@chowkspot.com`;
        const phone = `+9198${getRandomNumber(10000000, 99999999)}`;

        const primaryCity =
          i % 5 === 0
            ? 'Parwanoo'
            : i % 5 === 1
              ? 'Chandigarh'
              : i % 5 === 2
                ? 'Mohali'
                : i % 5 === 3
                  ? 'Panchkula'
                  : getRandomElement(SEED_CITIES);

        const [userRecord] = await tx
          .insert(users)
          .values({
            name: fullName,
            email,
            passwordHash: defaultPasswordHash,
            phone,
            city: primaryCity,
            role: 'WORKER',
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
          })
          .returning();

        if (!userRecord) continue;

        const categoryIndex = i % SEED_CATEGORIES.length;
        const category = SEED_CATEGORIES[categoryIndex] ?? 'Handyman & Odd Jobs';

        const nearbyCities = getRandomElements(
          SEED_CITIES.filter((c) => c !== primaryCity),
          getRandomNumber(3, 6),
        );
        const serviceCities = Array.from(
          new Set([primaryCity, 'Parwanoo', ...nearbyCities]),
        );

        const rateTypes: ('HOURLY' | 'FIXED' | 'INSPECTION_FIRST')[] = [
          'HOURLY',
          'FIXED',
          'INSPECTION_FIRST',
        ];
        const rateType = getRandomElement(rateTypes);
        const baseRate = getRandomNumber(150, 1200).toFixed(2);

        const [profile] = await tx
          .insert(workerProfiles)
          .values({
            userId: userRecord.id,
            category,
            bio: `Available for ${category} services in ${primaryCity} and nearby areas. Direct booking with zero commission.`,
            experienceYears: getRandomNumber(2, 16),
            rateType,
            baseRate,
            isAvailable: Math.random() > 0.15,
            serviceCities,
            paymentIdentifier: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@upi`,
            avgRating: '0.00',
            totalReviews: 0,
          })
          .returning();

        if (profile) {
          createdWorkerProfilesList.push({
            id: profile.id,
            userId: userRecord.id,
            email,
          });
        }
      }

      // 6. Generate Bookings Across Various Lifecycle States
      logger.info(`📅 Generating ${TOTAL_BOOKINGS} Bookings...`);
      const createdCompletedBookings: { id: string; userId: string; workerId: string }[] =
        [];
      const bookingStatuses: (
        | 'PENDING'
        | 'ACCEPTED'
        | 'REJECTED'
        | 'COUNTER_PROPOSED'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'CANCELLED'
      )[] = [
        'COMPLETED',
        'COMPLETED',
        'COMPLETED',
        'PENDING',
        'ACCEPTED',
        'IN_PROGRESS',
        'COUNTER_PROPOSED',
        'CANCELLED',
      ];

      for (let k = 0; k < TOTAL_BOOKINGS; k++) {
        const customer = getRandomElement(createdCustomersList);
        const worker = getRandomElement(createdWorkerProfilesList);
        const status = getRandomElement(bookingStatuses);

        const daysAgo = getRandomNumber(1, 60);
        const requestedDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const counterDate =
          status === 'COUNTER_PROPOSED'
            ? new Date(requestedDate.getTime() + 24 * 60 * 60 * 1000)
            : null;

        const address = `${getRandomElement(LOCALITY_PREFIXES)}, ${customer.city}`;

        const [booking] = await tx
          .insert(bookings)
          .values({
            userId: customer.id,
            workerId: worker.id,
            status,
            requestedDate,
            counterDate,
            address,
            notes: `Service request in ${customer.city}. Please confirm slot availability.`,
          })
          .returning();

        if (booking && status === 'COMPLETED') {
          createdCompletedBookings.push({
            id: booking.id,
            userId: customer.id,
            workerId: worker.id,
          });
        }
      }

      // 7. Generate Extra Verified Reviews and Recalculate Ratings for General Bookings
      logger.info('⭐ Submitting General Verified Reviews and recalculating ratings...');
      for (const compBooking of createdCompletedBookings) {
        if (Math.random() < 0.8) {
          const isBadReview = Math.random() < 0.3;
          let rating: number;
          let comment: string;

          if (isBadReview) {
            rating = getRandomNumber(1, 3);
            comment = getRandomElement(BAD_COMMENTS);
          } else {
            rating = Math.random() < 0.1 ? 5 : 4;
            comment = getRandomElement(GOOD_COMMENTS);
          }

          await tx.insert(reviews).values({
            bookingId: compBooking.id,
            userId: compBooking.userId,
            workerId: compBooking.workerId,
            rating,
            comment,
          });

          await tx
            .update(workerProfiles)
            .set({
              totalReviews: sql`${workerProfiles.totalReviews} + 1`,
              avgRating: sql`ROUND(
                ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${rating}) / (${workerProfiles.totalReviews} + 1),
                2
              )`,
            })
            .where(eq(workerProfiles.id, compBooking.workerId));
        }
      }
    });

    logger.info(
      '🎉 Massive database seeding complete! 2,500+ users & diverse reviews successfully generated.',
    );
    process.exit(0);
  } catch (error) {
    logger.error(error, '❌ Seeding failed:');
    process.exit(1);
  }
}

void seed();
