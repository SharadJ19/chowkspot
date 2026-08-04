// Review & rating types

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  workerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface WorkerReviewItem {
  review: Review;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}
