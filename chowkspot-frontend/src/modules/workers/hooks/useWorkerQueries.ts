// FILE: src/modules/workers/hooks/useWorkerQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workersApi } from '../api/workers.api';
import type { WorkerSearchQueryParams, CreateWorkerProfileInput } from '@/types';

export const WORKERS_QUERY_KEY = 'workers_search';

export const useWorkerQueries = (params?: WorkerSearchQueryParams) => {
  const queryClient = useQueryClient();

  const searchWorkersQuery = useQuery({
    queryKey: [WORKERS_QUERY_KEY, params],
    queryFn: async () => {
      const res = await workersApi.searchWorkers(params || {});
      return (
        res.data || {
          workers: [],
          pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
        }
      );
    },
  });

  const upsertProfileMutation = useMutation({
    mutationFn: (data: CreateWorkerProfileInput) => workersApi.upsertProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: (isAvailable: boolean) => workersApi.toggleAvailability({ isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WORKERS_QUERY_KEY] });
    },
  });

  return {
    searchWorkersQuery,
    upsertProfileMutation,
    toggleAvailabilityMutation,
  };
};
