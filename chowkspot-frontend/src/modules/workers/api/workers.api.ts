import { fetchClient } from '@/lib/fetchClient';
import type {
  WorkerSearchResult,
  WorkerSearchQueryParams,
  WorkerProfile,
  CreateWorkerProfileInput,
  UpdateAvailabilityInput,
} from '@/types';

export const workersApi = {
  searchWorkers: (params: WorkerSearchQueryParams) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.city) query.append('city', params.city);
    if (params.availableOnly !== undefined)
      query.append('availableOnly', params.availableOnly ? 'true' : 'false');

    return fetchClient<WorkerSearchResult[]>(`/workers/search?${query.toString()}`);
  },

  upsertProfile: (data: CreateWorkerProfileInput) =>
    fetchClient<WorkerProfile>('/workers/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleAvailability: (data: UpdateAvailabilityInput) =>
    fetchClient<WorkerProfile>('/workers/availability', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
