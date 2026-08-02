import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/config/env.js';

// Connection client configured with connection pooling
const queryClient = postgres(env.DATABASE_URL);

// Export type-safe Drizzle instance
export const db = drizzle(queryClient);
