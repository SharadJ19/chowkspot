// Worker profile & search filter types

import { APP_CONSTANTS } from '@/config/constants';

export type RateType =
  (typeof APP_CONSTANTS.RATE_TYPES)[keyof typeof APP_CONSTANTS.RATE_TYPES];

export interface WorkerProfile {
  id: string;
  userId: string;
  category: string;
  bio?: string | null;
  experienceYears: number;
  rateType: RateType;
  baseRate: string;
  isAvailable: boolean;
  serviceCities: string[];
  paymentIdentifier?: string | null;
  avgRating: string;
  totalReviews: number;
}

export interface WorkerSearchResult extends WorkerProfile {
  user: {
    name: string;
    phone: string;
    city: string;
    avatarUrl?: string | null;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedWorkersResponse {
  workers: WorkerSearchResult[];
  pagination: PaginationMeta;
}

export interface CreateWorkerProfileInput {
  category: string;
  bio?: string;
  experienceYears: number;
  rateType: RateType;
  baseRate: string;
  serviceCities: string[];
  paymentIdentifier?: string;
}

export interface WorkerSearchQueryParams {
  name?: string | undefined;
  category?: string | undefined;
  city?: string | undefined;
  availableOnly?: boolean | undefined;
  minExperience?: number | undefined;
  maxPrice?: number | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface UpdateAvailabilityInput {
  isAvailable: boolean;
}
