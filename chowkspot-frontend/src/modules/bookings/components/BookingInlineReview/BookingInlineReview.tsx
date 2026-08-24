import React from 'react';
import { Star } from 'lucide-react';
import { RatingStars } from '@/components/ui/RatingStars/RatingStars';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './BookingInlineReview.module.css';

interface BookingInlineReviewProps {
  workerName: string;
  bookingId: string;
  rating: number;
  comment: string;
  isPending: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (bookingId: string) => void;
}

export const BookingInlineReview: React.FC<BookingInlineReviewProps> = ({
  workerName,
  bookingId,
  rating,
  comment,
  isPending,
  onRatingChange,
  onCommentChange,
  onSubmit,
}) => {
  return (
    <div className={styles.reviewContainer}>
      <span className={styles.reviewTitle}>Leave Verified Review for {workerName}</span>
      <RatingStars rating={rating} interactive onChange={onRatingChange} />
      <Input
        placeholder='How was the craftsmanship, behavior, and punctuality?'
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
      />
      <Button
        size='sm'
        variant='primary'
        isLoading={isPending}
        onClick={() => onSubmit(bookingId)}
      >
        <Star size={14} />
        <span>Publish Verified Review</span>
      </Button>
    </div>
  );
};
