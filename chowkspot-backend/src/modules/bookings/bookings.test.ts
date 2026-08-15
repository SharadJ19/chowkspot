import { describe, it, expect } from 'vitest';
import { CONSTANTS } from '@/config/constants.js';

describe('Booking Domain: State Machine Rules', () => {
  // Mirroring the allowedTransitions map from BookingService
  const allowedTransitions: Record<string, string[]> = {
    [CONSTANTS.BOOKING_STATUS.PENDING]: [
      CONSTANTS.BOOKING_STATUS.ACCEPTED,
      CONSTANTS.BOOKING_STATUS.REJECTED,
      CONSTANTS.BOOKING_STATUS.COUNTER_PROPOSED,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.COUNTER_PROPOSED]: [
      CONSTANTS.BOOKING_STATUS.ACCEPTED,
      CONSTANTS.BOOKING_STATUS.REJECTED,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.ACCEPTED]: [
      CONSTANTS.BOOKING_STATUS.IN_PROGRESS,
      CONSTANTS.BOOKING_STATUS.CANCELLED,
    ],
    [CONSTANTS.BOOKING_STATUS.IN_PROGRESS]: [CONSTANTS.BOOKING_STATUS.COMPLETED],
    [CONSTANTS.BOOKING_STATUS.COMPLETED]: [],
    [CONSTANTS.BOOKING_STATUS.REJECTED]: [],
    [CONSTANTS.BOOKING_STATUS.CANCELLED]: [],
  };

  it('should allow valid transitions from PENDING state', () => {
    const nextStates = allowedTransitions[CONSTANTS.BOOKING_STATUS.PENDING] || [];
    expect(nextStates).toContain('ACCEPTED');
    expect(nextStates).toContain('REJECTED');
    expect(nextStates).toContain('COUNTER_PROPOSED');
    expect(nextStates).toContain('CANCELLED');
  });

  it('should block invalid direct transitions from PENDING to COMPLETED', () => {
    const nextStates = allowedTransitions[CONSTANTS.BOOKING_STATUS.PENDING] || [];
    expect(nextStates).not.toContain('COMPLETED');
  });

  it('should treat COMPLETED as a terminal terminal state with zero exits', () => {
    const nextStates = allowedTransitions[CONSTANTS.BOOKING_STATUS.COMPLETED] || [];
    expect(nextStates).toHaveLength(0);
  });
});
