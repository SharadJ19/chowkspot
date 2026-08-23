import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteGuard } from '@/components/guards/RouteGuard';
import { Spinner } from '@/components/ui/Spinner/Spinner';

// Route Skeletons
import { SearchPageSkeleton } from '@/pages/SearchPageSkeleton';
import { ProfilePageSkeleton } from '@/pages/ProfilePageSkeleton';
import { WorkerDetailPageSkeleton } from '@/pages/WorkerDetailPageSkeleton';

// --- Public Marketplace & Discovery ---
const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
);
const SearchPage = lazy(() =>
  import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })),
);
const WorkerDetailPage = lazy(() =>
  import('@/pages/WorkerDetailPage').then((m) => ({ default: m.WorkerDetailPage })),
);

// --- Public Authentication & Account Recovery ---
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

// --- Public Legal & Support ---
const TermsOfServicePage = lazy(() =>
  import('@/pages/TermsOfServicePage').then((m) => ({ default: m.TermsOfServicePage })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
);
const HelpCenterPage = lazy(() =>
  import('@/pages/HelpCenterPage').then((m) => ({ default: m.HelpCenterPage })),
);

// --- Authenticated & Role-Guarded ---
const BookingsPage = lazy(() =>
  import('@/pages/BookingsPage').then((m) => ({ default: m.BookingsPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);

// --- Fallback ---
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
        {/* 1. Public Discovery & Marketplace */}
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

        {/* 2. Public Authentication & Recovery */}
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

        {/* 3. Public Legal, Policies & Help */}
        <Route
          path='/terms'
          element={
            <Suspense fallback={<GenericFallback />}>
              <TermsOfServicePage />
            </Suspense>
          }
        />
        <Route
          path='/privacy'
          element={
            <Suspense fallback={<GenericFallback />}>
              <PrivacyPolicyPage />
            </Suspense>
          }
        />
        <Route
          path='/help'
          element={
            <Suspense fallback={<GenericFallback />}>
              <HelpCenterPage />
            </Suspense>
          }
        />

        {/* 4. Customer & Worker Service Bookings */}
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

        {/* 5. General Profile Management */}
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

        {/* 6. Admin Panel */}
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

        {/* 7. 404 Catch-All */}
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
