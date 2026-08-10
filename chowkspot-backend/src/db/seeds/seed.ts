import { db } from '@/config/database.js';
import { users, workerProfiles, bookings, reviews } from '@/db/schema/index.js';
import { hashPassword } from '@/utils/password.js';
import { logger } from '@/utils/logger.js';
import { SEED_USERS } from '@/db/seeds/data.js';
import { eq, sql } from 'drizzle-orm';

async function seed() {
  const startTime = performance.now();

  logger.info('[DB_SEED]: Executing unified seed sequence for users and workers...');

  try {
    await db.transaction(async (tx) => {
      // 1. Clear existing records in cascade order
      await tx.delete(reviews);
      await tx.delete(bookings);
      await tx.delete(workerProfiles);
      await tx.delete(users);

      const mockCustomerIds: string[] = [];
      const createdWorkerMap = new Map<string, string>();

      // 2. Insert Users and Worker Profiles cleanly in one loop
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
            isVerified: true,
          })
          .returning();

        if (insertedUser) {
          if (userData.role === 'USER') {
            mockCustomerIds.push(insertedUser.id);
          } else if (userData.role === 'WORKER' && 'category' in userData) {
            // Insert corresponding worker profile immediately
            const [insertedProfile] = await tx
              .insert(workerProfiles)
              .values({
                userId: insertedUser.id,
                category: userData.category,
                bio: userData.bio,
                experienceYears: userData.experienceYears,
                rateType: userData.rateType,
                baseRate: userData.baseRate,
                isAvailable: userData.isAvailable,
                serviceCities: userData.serviceCities,
                paymentIdentifier: userData.paymentIdentifier,
              })
              .returning();

            if (insertedProfile) {
              createdWorkerMap.set(insertedUser.email, insertedProfile.id);
            }
          }
        }
      }

      if (mockCustomerIds.length === 0) {
        throw new Error('Mock customer users missing from seed config.');
      }

      // 3. Populate Exactly 5 Unique, Detailed Long Reviews for Each Worker
      for (const [email, workerProfileId] of createdWorkerMap.entries()) {
        const workerUserRecord = SEED_USERS.find((u) => u.email === email);
        const workerName = workerUserRecord ? workerUserRecord.name : 'The professional';
        const categoryKey =
          'category' in workerUserRecord! ? workerUserRecord.category : 'Electrician';

        const workerSpecificLongReviews = [
          {
            rating: 5,
            comment: `We recently hired ${workerName} for a complex ${categoryKey.toLowerCase()} installation at our residence, and we were thoroughly impressed by the level of professionalism shown. From the initial booking confirmation to the final execution, he arrived punctually with all necessary professional tools. He patiently listened to our requirements, inspected the site thoroughly, and completed the work cleanly without creating any mess. Highly recommend his services to anyone in the region!`,
          },
          {
            rating: 5,
            comment: `Finding a reliable ${categoryKey.toLowerCase()} expert can be quite challenging, but working with ${workerName} completely restored our confidence. He diagnosed the underlying issue within minutes and explained the repair process in simple terms. The work was finished ahead of schedule, and the pricing was completely transparent with zero hidden charges. Settling the payment directly via his UPI handle was extremely seamless.`,
          },
          {
            rating: 4,
            comment: `Overall, a very pleasant experience hiring ${workerName}. He came prepared to handle our pending maintenance work and executed the ${categoryKey.toLowerCase()} tasks with great attention to detail. Although there was a brief delay in procuring an extra fitting, he managed his time efficiently and stayed back until everything was thoroughly tested and functioning perfectly. Very polite and respectful behavior.`,
          },
          {
            rating: 5,
            comment: `Absolute perfection! ${workerName} is exceptionally skilled at what he does. We booked him for an urgent repair job, and he responded promptly through the ChowkSpot platform. He worked with absolute focus, double-checked all connections before wrapping up, and even shared a few practical maintenance tips for the future. It is hard to find such genuine and trustworthy trade professionals nowadays.`,
          },
          {
            rating: 5,
            comment: `Outstanding craftsmanship and wonderful attitude! ${workerName} transformed our space with his expert ${categoryKey.toLowerCase()} work. He kept the work area tidy throughout the process, respected our home guidelines, and charged the exact agreed-upon rate without any bargaining drama. We are definitely saving his contact and will be booking him exclusively for all future maintenance needs.`,
          },
        ];

        for (let i = 0; i < workerSpecificLongReviews.length; i++) {
          const reviewData = workerSpecificLongReviews[i];
          const customerId = mockCustomerIds[i % mockCustomerIds.length];
          if (!reviewData || !customerId) continue;

          const requestedDate = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000);

          const [booking] = await tx
            .insert(bookings)
            .values({
              userId: customerId,
              workerId: workerProfileId,
              status: 'COMPLETED',
              requestedDate,
              address: `House #42, Sector 22, Chandigarh`,
              notes: `Detailed long review audit booking for ${workerName}`,
            })
            .returning();

          if (booking) {
            await tx.insert(reviews).values({
              bookingId: booking.id,
              userId: customerId,
              workerId: workerProfileId,
              rating: reviewData.rating,
              comment: reviewData.comment,
            });

            await tx
              .update(workerProfiles)
              .set({
                totalReviews: sql`${workerProfiles.totalReviews} + 1`,
                avgRating: sql`ROUND(
                  ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${reviewData.rating}) / (${workerProfiles.totalReviews} + 1),
                  2
                )`,
              })
              .where(eq(workerProfiles.id, workerProfileId));
          }
        }

        // --- Inject exactly 2 Bookings for each non-completed state (PENDING, ACCEPTED, IN_PROGRESS, CANCELLED) ---
        const activeStates: ('PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'CANCELLED')[] = [
          'PENDING',
          'ACCEPTED',
          'IN_PROGRESS',
          'CANCELLED',
        ];

        for (const state of activeStates) {
          for (let b = 0; b < 2; b++) {
            const customerId = mockCustomerIds[b % mockCustomerIds.length];
            if (!customerId) continue;

            await tx.insert(bookings).values({
              userId: customerId,
              workerId: workerProfileId,
              status: state,
              requestedDate: new Date(Date.now() + (b + 1) * 24 * 60 * 60 * 1000),
              address: `Sector 17, Chandigarh`,
              notes: `State machine test booking for ${state}`,
            });
          }
        }
      }
    });

    const executionTimeMs = Math.round(performance.now() - startTime);
    logger.info(
      `[DB_SEED]: Unified dataset committed successfully in ${executionTimeMs}ms.`,
    );

    process.exit(0);
  } catch (error) {
    logger.error(
      { err: error },
      '[DB_SEED]: Fatal execution error during seed transaction.',
    );
    process.exit(1);
  }
}

void seed();
