import { db } from '@/config/database.js';
import { users, workerProfiles, bookings, reviews } from '@/db/schema/index.js';
import { hashPassword } from '@/utils/password.js';
import { logger } from '@/utils/logger.js';
import { SEED_USERS, SEED_WORKER_PROFILES } from '@/db/seeds/data.js';
import { eq, sql } from 'drizzle-orm';

async function seed() {
  logger.info('🌱 Starting ChowkSpot high-coverage regional database seeding...');

  try {
    await db.transaction(async (tx) => {
      // 1. Wipe existing tables in cascade order
      logger.info('🧹 Clearing old database records...');
      await tx.delete(reviews);
      await tx.delete(bookings);
      await tx.delete(workerProfiles);
      await tx.delete(users);

      // 2. Insert Users (Admin, Workers & Friends Crew)
      logger.info('👤 Inserting Users & Friends...');
      const createdUsersMap = new Map<string, string>();

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

      // 3. Insert Worker Profiles with Multi-City Coverage
      logger.info('🛠️ Inserting Worker Profiles with Regional Coverage...');
      const createdWorkerMap = new Map<string, string>();

      for (const workerData of SEED_WORKER_PROFILES) {
        const userId = createdUsersMap.get(workerData.email);
        if (!userId) {
          throw new Error(`User account for ${workerData.email} missing.`);
        }

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

      // 4. Seed Diverse State-Machine Bookings
      logger.info(
        '📅 Seeding Comprehensive Regional Bookings across Lifecycle States...',
      );

      // Workers
      const smarthWorkerId = createdWorkerMap.get('smarth.sharda@chowkspot.com')!;
      const rudarWorkerId = createdWorkerMap.get('rudar.partap@chowkspot.com')!;
      const mohitWorkerId = createdWorkerMap.get('mohit.thakur@chowkspot.com')!;
      const bipinWorkerId = createdWorkerMap.get('bipin.awasthi@chowkspot.com')!;
      const rohanWorkerId = createdWorkerMap.get('rohan.chandel@chowkspot.com')!;
      const kartikWorkerId = createdWorkerMap.get('kartik.kumar@chowkspot.com')!;

      // Customers
      const sachitId = createdUsersMap.get('sachit.rajpal@gmail.com')!;
      const safalId = createdUsersMap.get('safal.varadhan@gmail.com')!;
      const sachinId = createdUsersMap.get('sachin.thakur@gmail.com')!;
      const shaivId = createdUsersMap.get('shaiv.sood@gmail.com')!;
      const rudarAttriId = createdUsersMap.get('rudar.attri@gmail.com')!;
      // const tusharId = createdUsersMap.get('tushar.karwal@gmail.com')!;
      const shivaniId = createdUsersMap.get('shivani.vedwall@gmail.com')!;
      const anjuId = createdUsersMap.get('anju.rani@gmail.com')!;
      const vivekId = createdUsersMap.get('vivek.dhiman@gmail.com')!;
      const sumitId = createdUsersMap.get('sumit.chhalotre@gmail.com')!;

      // 1. COMPLETED - Shaiv -> Mohit (Parwanoo Carpenter Job)
      const [b1] = await tx
        .insert(bookings)
        .values({
          userId: shaivId,
          workerId: mohitWorkerId,
          status: 'COMPLETED',
          requestedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          address: 'Sector 1A, Near Timber Trail, Parwanoo',
          notes: 'Wooden main door lock replacement and hinge alignment.',
        })
        .returning();

      // 2. COMPLETED - Anju -> Bipin (Parwanoo/Kalka AC Service)
      const [b2] = await tx
        .insert(bookings)
        .values({
          userId: anjuId,
          workerId: bipinWorkerId,
          status: 'COMPLETED',
          requestedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          address: 'Housing Board Colony, Kalka',
          notes: 'Split AC deep foam jet service and gas top-up.',
        })
        .returning();

      // 3. COMPLETED - Vivek -> Rohan (Baddi Industrial Repair)
      const [b3] = await tx
        .insert(bookings)
        .values({
          userId: vivekId,
          workerId: rohanWorkerId,
          status: 'COMPLETED',
          requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          address: 'Phase 1 Industrial Area, Baddi',
          notes: 'Factory main motor starter panel rewiring.',
        })
        .returning();

      // 4. COMPLETED - Sachit -> Smarth (Chandigarh Inverter Setup)
      const [b4] = await tx
        .insert(bookings)
        .values({
          userId: sachitId,
          workerId: smarthWorkerId,
          status: 'COMPLETED',
          requestedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          address: 'House #402, Sector 15-D, Chandigarh',
          notes: 'Dual battery inverter installation and heavy load wiring.',
        })
        .returning();

      // 5. IN_PROGRESS - Shivani -> Kartik (Parwanoo CCTV)
      await tx.insert(bookings).values({
        userId: shivaniId,
        workerId: kartikWorkerId,
        status: 'IN_PROGRESS',
        requestedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        address: 'Sector 4, Parwanoo',
        notes: 'Installation of 4 HD outdoor IP cameras with NVR configuration.',
      });

      // 6. COUNTER_PROPOSED - Sumit -> Rohan (Nalagarh / Baddi)
      await tx.insert(bookings).values({
        userId: sumitId,
        workerId: rohanWorkerId,
        status: 'COUNTER_PROPOSED',
        requestedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        counterDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        address: 'Nalagarh Road, Baddi',
        notes: 'Generator panel sync setup.',
      });

      // 7. ACCEPTED - Safal -> Rudar Partap (Mohali Plumbing)
      await tx.insert(bookings).values({
        userId: safalId,
        workerId: rudarWorkerId,
        status: 'ACCEPTED',
        requestedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        address: 'Flat 12B, Homeland Heights, Sector 70, Mohali',
        notes: 'Bathroom mixer tap replacement & geyser inlet pipeline.',
      });

      // 8. PENDING - Rudar Attri -> Mohit (Solan Furniture)
      await tx.insert(bookings).values({
        userId: rudarAttriId,
        workerId: mohitWorkerId,
        status: 'PENDING',
        requestedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        address: 'Mall Road, Solan',
        notes: 'Repair study table and assemble TV unit cabinet.',
      });

      // 9. CANCELLED - Sachin -> Bipin
      await tx.insert(bookings).values({
        userId: sachinId,
        workerId: bipinWorkerId,
        status: 'CANCELLED',
        requestedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        address: 'Sector 6, Panchkula',
        notes: 'Washing machine motor noise fix.',
      });

      // 5. Seed Reviews & Recalculate Atomic Ratings
      logger.info('⭐ Submitting Verified Reviews & Updating Worker Average Ratings...');

      const seedReviewsList = [
        {
          booking: b1,
          rating: 5,
          comment:
            'Mohit came to Parwanoo right on schedule! Very skilled carpenter and clean work.',
        },
        {
          booking: b2,
          rating: 5,
          comment: 'Bipin serviced the AC quickly. Cooling works perfectly now.',
        },
        {
          booking: b3,
          rating: 5,
          comment:
            'Rohan is a true expert in industrial wiring. Solved our factory panel tripping issue.',
        },
        {
          booking: b4,
          rating: 4,
          comment: 'Smarth did a solid job with the inverter wiring setup in Chandigarh.',
        },
      ];

      for (const item of seedReviewsList) {
        if (!item.booking) continue;

        await tx.insert(reviews).values({
          bookingId: item.booking.id,
          userId: item.booking.userId,
          workerId: item.booking.workerId,
          rating: item.rating,
          comment: item.comment,
        });

        // Atomic recalculation of average rating
        await tx
          .update(workerProfiles)
          .set({
            totalReviews: sql`${workerProfiles.totalReviews} + 1`,
            avgRating: sql`ROUND(
              ((${workerProfiles.avgRating} * ${workerProfiles.totalReviews}) + ${item.rating}) / (${workerProfiles.totalReviews} + 1),
              2
            )`,
          })
          .where(eq(workerProfiles.id, item.booking.workerId));
      }
    });

    logger.info('🎉 ChowkSpot database expanded & seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(error, '❌ Seeding failed:');
    process.exit(1);
  }
}

void seed();
