import React, { useState } from 'react';
import { Star } from 'lucide-react';
import styles from './RatingStars.module.css';

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={styles.container}>
      <div className={styles.starsWrapper}>
        {Array.from({ length: maxRating }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={starValue}
              type='button'
              className={`${styles.starBtn} ${interactive ? styles.interactive : ''}`}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              disabled={!interactive}
              aria-label={`Rate ${starValue} of ${maxRating}`}
            >
              <Star
                size={16}
                className={`${styles.starIcon} ${isFilled ? styles.filled : ''}`}
              />
            </button>
          );
        })}
      </div>
      {showValue && <span className={styles.valueText}>{rating.toFixed(1)}</span>}
    </div>
  );
};
