// FILE: src/modules/workers/api/workers.api.ts
import { fetchClient } from '@/lib/fetchClient';
import type {
  PaginatedWorkersResponse,
  WorkerSearchQueryParams,
  WorkerProfile,
  CreateWorkerProfileInput,
  UpdateAvailabilityInput,
  WorkerSearchResult,
} from '@/types';

export const workersApi = {
  searchWorkers: (params: WorkerSearchQueryParams) => {
    const query = new URLSearchParams();
    if (params.name) query.append('name', params.name);
    if (params.category) query.append('category', params.category);
    if (params.city) query.append('city', params.city);
    if (params.availableOnly !== undefined)
      query.append('availableOnly', params.availableOnly ? 'true' : 'false');
    if (params.minExperience !== undefined)
      query.append('minExperience', params.minExperience.toString());
    if (params.maxPrice !== undefined)
      query.append('maxPrice', params.maxPrice.toString());
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return fetchClient<PaginatedWorkersResponse>(`/workers/search?${query.toString()}`);
  },
  getWorkerById: (id: string) => fetchClient<WorkerSearchResult>(`/workers/${id}`),
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
