// User domain types

import type { AuthUser } from './auth';
import type { WorkerProfile } from './worker';

export interface UserProfileResponse {
  user: AuthUser;
  workerProfile: WorkerProfile | null;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  city?: string;
  avatarUrl?: string;
}
