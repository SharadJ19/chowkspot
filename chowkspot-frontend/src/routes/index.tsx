import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteGuard } from '@/components/guards/RouteGuard';
import { Spinner } from '@/components/ui/Spinner/Spinner';

// Skeleton Loading
import { SearchPageSkeleton } from '@/pages/SearchPageSkeleton';
import { ProfilePageSkeleton } from '@/pages/ProfilePageSkeleton';
import { WorkerDetailPageSkeleton } from '@/pages/WorkerDetailPageSkeleton';

// Route-level code-split components
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const WorkerDetailPage = lazy(() =>
  import('@/pages/WorkerDetailPage').then((m) => ({ default: m.WorkerDetailPage })),
);
const BookingsPage = lazy(() =>
  import('@/pages/BookingsPage').then((m) => ({ default: m.BookingsPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const VerifyEmailPage = lazy(() =>
  import('@/pages/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

const GenericFallback = () => (
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

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route
          path='/'
          element={
            <Suspense fallback={<GenericFallback />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path='/search'
          element={
            <Suspense fallback={<SearchPageSkeleton />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path='/worker/:id'
          element={
            <Suspense fallback={<WorkerDetailPageSkeleton />}>
              <WorkerDetailPage />
            </Suspense>
          }
        />
        <Route
          path='/login'
          element={
            <Suspense fallback={<GenericFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<GenericFallback />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path='/verify-email'
          element={
            <Suspense fallback={<GenericFallback />}>
              <VerifyEmailPage />
            </Suspense>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <Suspense fallback={<GenericFallback />}>
              <ForgotPasswordPage />
            </Suspense>
          }
        />
        <Route
          path='/reset-password'
          element={
            <Suspense fallback={<GenericFallback />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />

        {/* Customer & Worker Booking Management Route */}
        <Route element={<RouteGuard allowedRoles={['USER', 'WORKER']} />}>
          <Route
            path='/bookings'
            element={
              <Suspense fallback={<GenericFallback />}>
                <BookingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* General Authenticated Profile Management */}
        <Route element={<RouteGuard />}>
          <Route
            path='/profile'
            element={
              <Suspense fallback={<ProfilePageSkeleton />}>
                <ProfilePage />
              </Suspense>
            }
          />
        </Route>

        {/* Admin Role-Guarded Route */}
        <Route element={<RouteGuard allowedRoles={['ADMIN']} />}>
          <Route
            path='/admin'
            element={
              <Suspense fallback={<GenericFallback />}>
                <AdminPage />
              </Suspense>
            }
          />
        </Route>

        {/* 404 Fallback */}
        <Route
          path='*'
          element={
            <Suspense fallback={<GenericFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
