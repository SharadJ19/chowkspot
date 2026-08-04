import React from 'react';
import { Badge } from '@/components/ui/Badge/Badge';
import { APP_CONSTANTS } from '@/config/constants';
import type { BookingStatus } from '@/types';

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const variant = APP_CONSTANTS.STATUS_BADGE_VARIANTS[status] || 'muted';
  return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
};
