import { describe, it, expect } from 'vitest';
/**
 * Simulates the metrics computation logic returned by AdminService.getPlatformStats
 **/
const computeAdminStatsSummary = (stats: {
  totalUsers: number;
  totalWorkers: number;
  totalBookings: number;
  completedBookings: number;
  totalReviews: number;
}) => {
  const completionRate =
    stats.totalBookings > 0
      ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
      : 0;

  return {
    ...stats,
    completionRate: `${completionRate}%`,
  };
};

describe('Admin Domain: Platform Metrics & Directory Controls', () => {
  it('should accurately compute booking completion percentages', () => {
    const rawStats = {
      totalUsers: 15,
      totalWorkers: 8,
      totalBookings: 20,
      completedBookings: 15,
      totalReviews: 12,
    };

    const summary = computeAdminStatsSummary(rawStats);
    expect(summary.completionRate).toBe('75%');
  });

  it('should safely handle zero bookings without division errors', () => {
    const zeroStats = {
      totalUsers: 2,
      totalWorkers: 1,
      totalBookings: 0,
      completedBookings: 0,
      totalReviews: 0,
    };

    const summary = computeAdminStatsSummary(zeroStats);
    expect(summary.completionRate).toBe('0%');
  });

  it('should validate role filter options for directory searches', () => {
    const validRoles = ['ALL', 'USER', 'WORKER', 'ADMIN'] as const;
    const filterRole = (role: string) => validRoles.includes(role as any);

    expect(filterRole('WORKER')).toBe(true);
    expect(filterRole('SUPERADMIN')).toBe(false);
  });
});
