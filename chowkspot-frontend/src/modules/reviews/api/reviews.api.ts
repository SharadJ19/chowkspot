import { fetchClient } from '@/lib/fetchClient';
import type { Review, WorkerReviewItem, CreateReviewInput } from '@/types';

export const reviewsApi = {
  createReview: (data: CreateReviewInput) =>
    fetchClient<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWorkerReviews: (workerId: string) =>
    fetchClient<WorkerReviewItem[]>(`/reviews/worker/${workerId}`),
};
