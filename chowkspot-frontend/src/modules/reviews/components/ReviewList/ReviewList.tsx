import React from 'react';
import type { WorkerReviewItem } from '@/types';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import styles from './ReviewList.module.css';

export interface ReviewListProps {
  reviews: WorkerReviewItem[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        No reviews yet for this worker profile.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {reviews.map(({ review, user }) => (
        <div key={review.id} className={styles.item}>
          <div className={styles.header}>
            <Avatar name={user.name} src={user.avatarUrl} size='sm' />
            <span className={styles.userName}>{user.name}</span>
            <div style={{ marginLeft: 'auto' }}>
              <RatingStars rating={review.rating} />
            </div>
          </div>
          {review.comment && <p className={styles.comment}>{review.comment}</p>}
        </div>
      ))}
    </div>
  );
};
