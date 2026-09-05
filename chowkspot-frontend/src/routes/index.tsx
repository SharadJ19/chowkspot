import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

// Layouts & Route Guards
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteGuard } from '@/components/guards/RouteGuard';

// Data-Fetching Page Skeletons
import { SearchPageSkeleton } from '@/pages/search/SearchPageSkeleton';
import { ProfilePageSkeleton } from '@/pages/profile/ProfilePageSkeleton';
import { WorkerDetailPageSkeleton } from '@/pages/workers/WorkerDetailPageSkeleton';
import { BookingsPageSkeleton } from '@/pages/bookings/BookingsPageSkeleton';
import { CreateBookingPageSkeleton } from '@/pages/bookings/CreateBookingPageSkeleton';
import { AdminDashboardSkeleton } from '@/modules/admin/components/AdminDashboardSkeleton';

// Lazy-Loaded Page Chunks: Public Discovery
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

// Lazy-Loaded Page Chunks: Authentication & Account Recovery
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

// Lazy-Loaded Page Chunks: Static & Legal Support
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

// Lazy-Loaded Page Chunks: Protected User & Worker Workspaces
const CreateBookingPage = lazy(() =>
  import('@/pages/bookings/CreateBookingPage').then((m) => ({
    default: m.CreateBookingPage,
  })),
);
const BookingsPage = lazy(() =>
  import('@/pages/bookings/BookingsPage').then((m) => ({ default: m.BookingsPage })),
);
const ProfilePage = lazy(() =>
  import('@/pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

// Lazy-Loaded Page Chunks: Protected Admin & Fallback
const AdminPage = lazy(() =>
  import('@/pages/admin/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/not-found/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

// Zero-Shift Static Layout Fallback Container
const StaticLayoutFallback = () => (
  <div
    style={{
      minHeight: 'calc(100vh - var(--navbar-height))',
      backgroundColor: 'var(--color-bg-app)',
    }}
  />
);

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 1. Public Discovery & Marketplace Routes */}
        <Route
          path='/'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
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

        {/* 2. Public Authentication & Account Recovery Routes */}
        <Route
          path='/login'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path='/verify-email'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <VerifyEmailPage />
            </Suspense>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <ForgotPasswordPage />
            </Suspense>
          }
        />
        <Route
          path='/reset-password'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />

        {/* 3. Static Support & Legal Routes */}
        <Route
          path='/terms'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <TermsOfServicePage />
            </Suspense>
          }
        />
        <Route
          path='/privacy'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <PrivacyPolicyPage />
            </Suspense>
          }
        />
        <Route
          path='/help'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <HelpCenterPage />
            </Suspense>
          }
        />

        {/* 4. Protected Customer & Worker Bookings Workspace */}
        <Route element={<RouteGuard allowedRoles={['USER', 'WORKER']} />}>
          <Route
            path='/bookings'
            element={
              <Suspense fallback={<BookingsPageSkeleton />}>
                <BookingsPage />
              </Suspense>
            }
          />
          <Route
            path='/worker/:id/book'
            element={
              <Suspense fallback={<CreateBookingPageSkeleton />}>
                <CreateBookingPage />
              </Suspense>
            }
          />
        </Route>

        {/* 5. Protected User Profile Management */}
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

        {/* 6. Protected Admin Command Center */}
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

        {/* 7. Catch-All 404 Route */}
        <Route
          path='*'
          element={
            <Suspense fallback={<StaticLayoutFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};
