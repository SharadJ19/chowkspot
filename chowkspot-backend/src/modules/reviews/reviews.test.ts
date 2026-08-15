import { describe, it, expect } from 'vitest';

/**
 * Simulates the exact SQL calculation used in ReviewService:
 * ROUND(( (currentAvg * currentTotal) + newRating ) / (currentTotal + 1), 2)
 */
const calculateNewAverageRating = (
  currentAvg: number,
  totalReviews: number,
  newRating: number,
): number => {
  const calculated = (currentAvg * totalReviews + newRating) / (totalReviews + 1);
  return Math.round(calculated * 100) / 100;
};

describe('Review Domain: Atomic Rating Recalculation', () => {
  it('should compute the correct new average for the first review', () => {
    const currentAvg = 0.0;
    const totalReviews = 0;
    const newRating = 5;

    const updatedAvg = calculateNewAverageRating(currentAvg, totalReviews, newRating);
    expect(updatedAvg).toBe(5.0);
  });

  it('should accurately compute a moving average across multiple reviews', () => {
    // Worker currently has 4.0 average across 2 reviews (sum = 8)
    const currentAvg = 4.0;
    const totalReviews = 2;
    const newRating = 1; // New incoming low rating

    // Expected: (8 + 1) / 3 = 3.0
    const updatedAvg = calculateNewAverageRating(currentAvg, totalReviews, newRating);
    expect(updatedAvg).toBe(3.0);
  });

  it('should handle decimal rounding precision up to 2 decimal places', () => {
    const currentAvg = 4.67;
    const totalReviews = 3;
    const newRating = 4;

    // Expected sum = (4.67 * 3) + 4 = 18.01 / 4 = 4.5025 -> 4.50
    const updatedAvg = calculateNewAverageRating(currentAvg, totalReviews, newRating);
    expect(updatedAvg).toBe(4.5);
  });
});
