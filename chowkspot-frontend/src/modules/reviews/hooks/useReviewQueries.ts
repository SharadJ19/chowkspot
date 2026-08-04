import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';
import type { CreateReviewInput } from '@/types';

export const REVIEWS_QUERY_KEY = 'worker_reviews';

export const useReviewQueries = (workerId?: string) => {
  const queryClient = useQueryClient();

  const reviewsQuery = useQuery({
    queryKey: [REVIEWS_QUERY_KEY, workerId],
    queryFn: async () => {
      if (!workerId) return [];
      const res = await reviewsApi.getWorkerReviews(workerId);
      return res.data || [];
    },
    enabled: !!workerId,
  });

  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewInput) => reviewsApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEWS_QUERY_KEY] });
    },
  });

  return {
    reviewsQuery,
    createReviewMutation,
  };
};
