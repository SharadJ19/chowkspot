import { Routes, Route } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteGuard } from '@/components/guards/RouteGuard';
import { HomePage } from '@/pages/HomePage';
import { SearchPage } from '@/pages/SearchPage';
import { WorkerDetailPage } from '@/pages/WorkerDetailPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/worker/:id' element={<WorkerDetailPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />

        {/* Standard Protected Authenticated Routes */}
        <Route element={<RouteGuard />}>
          <Route path='/bookings' element={<BookingsPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>

        {/* Admin Role-Guarded Route */}
        <Route element={<RouteGuard allowedRoles={['ADMIN']} />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
