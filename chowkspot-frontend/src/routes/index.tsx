import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteGuard } from '@/components/guards/RouteGuard';

// Direct Skeleton Imports
import { SearchPageSkeleton } from '@/pages/search/SearchPageSkeleton';
import { ProfilePageSkeleton } from '@/pages/profile/ProfilePageSkeleton';
import { WorkerDetailPageSkeleton } from '@/pages/workers/WorkerDetailPageSkeleton';
import { BookingsPageSkeleton } from '@/pages/bookings/BookingsPageSkeleton';
import { AuthLayoutSkeleton } from '@/modules/auth/components/AuthLayout/AuthLayoutSkeleton';
import { AdminDashboardSkeleton } from '@/modules/admin/components/AdminDashboardSkeleton';

// Lazy Pages
const HomePage = lazy(() =>
  import('@/pages/home/HomePage').then((m) => ({ default: m.HomePage })),
);
const SearchPage = lazy(() =>
  import('@/pages/search/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const WorkerDetailPage = lazy(() =>
  import('@/pages/workers/WorkerDetailPage').then((m) => ({
    default: m.WorkerDetailPage,
  })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const VerifyEmailPage = lazy(() =>
  import('@/pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth/ResetPasswordPage').then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const TermsOfServicePage = lazy(() =>
  import('@/pages/static/TermsOfServicePage').then((m) => ({
    default: m.TermsOfServicePage,
  })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/static/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);
const HelpCenterPage = lazy(() =>
  import('@/pages/static/HelpCenterPage').then((m) => ({ default: m.HelpCenterPage })),
);
const BookingsPage = lazy(() =>
  import('@/pages/bookings/BookingsPage').then((m) => ({ default: m.BookingsPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const AdminPage = lazy(() =>
  import('@/pages/admin/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 1. Public Discovery & Marketplace */}
        // src/routes/index.tsx
        <Route
          path='/'
          element={
            <Suspense
              fallback={
                <div style={{ minHeight: 'calc(100vh - var(--navbar-height))' }} />
              }
            >
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
        {/* 2. Public Authentication & Recovery */}
        <Route
          path='/login'
          element={
            <Suspense fallback={<AuthLayoutSkeleton />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<AuthLayoutSkeleton />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path='/verify-email'
          element={
            <Suspense fallback={<AuthLayoutSkeleton />}>
              <VerifyEmailPage />
            </Suspense>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <Suspense fallback={<AuthLayoutSkeleton />}>
              <ForgotPasswordPage />
            </Suspense>
          }
        />
        <Route
          path='/reset-password'
          element={
            <Suspense fallback={<AuthLayoutSkeleton />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />
        {/* 3. Static Pages */}
        <Route
          path='/terms'
          element={
            <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
              <TermsOfServicePage />
            </Suspense>
          }
        />
        <Route
          path='/privacy'
          element={
            <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
              <PrivacyPolicyPage />
            </Suspense>
          }
        />
        <Route
          path='/help'
          element={
            <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
              <HelpCenterPage />
            </Suspense>
          }
        />
        {/* 4. Protected Customer & Worker Bookings */}
        <Route element={<RouteGuard allowedRoles={['USER', 'WORKER']} />}>
          <Route
            path='/bookings'
            element={
              <Suspense fallback={<BookingsPageSkeleton />}>
                <BookingsPage />
              </Suspense>
            }
          />
        </Route>
        {/* 5. Protected User & Worker Profile */}
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
        {/* 6. Protected Admin Panel */}
        <Route element={<RouteGuard allowedRoles={['ADMIN']} />}>
          <Route
            path='/admin'
            element={
              <Suspense fallback={<AdminDashboardSkeleton />}>
                <AdminPage />
              </Suspense>
            }
          />
        </Route>
        {/* 7. Fallback */}
        <Route
          path='*'
          element={
            <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
