import React, { lazy, Suspense } from 'react';
import { AdminDashboardSkeleton } from '@/modules/admin/components/AdminDashboardSkeleton';

const AdminDashboard = lazy(() =>
  import('@/modules/admin/components/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  })),
);

export const AdminPage: React.FC = () => {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
};
