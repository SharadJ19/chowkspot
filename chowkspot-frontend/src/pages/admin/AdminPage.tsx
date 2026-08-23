import React, { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner/Spinner';

// Lazy load the full Admin dashboard module
const AdminDashboard = lazy(() =>
  import('@/modules/admin/components/AdminDashboard').then((m) => ({
    default: m.AdminDashboard,
  })),
);

const AdminLoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <Spinner size='lg' />
  </div>
);

export const AdminPage: React.FC = () => {
  return (
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminDashboard />
    </Suspense>
  );
};
