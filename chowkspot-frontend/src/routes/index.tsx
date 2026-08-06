// React Router v8 tree setup

import { Routes, Route } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
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
        // Inside AppRouter in src/routes/index.tsx
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/bookings' element={<BookingsPage />} />
          <Route path='/profile' element={<ProfilePage />} />

          {/* Admin Role Guard Route */}
          <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
            <Route path='/admin' element={<AdminPage />} />
          </Route>
        </Route>
        {/* 404 Fallback */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
