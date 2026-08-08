// FILE: src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';
import { EmailVerificationBanner } from '@/components/ui/EmailVerificationBanner/EmailVerificationBanner';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const authPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
  ];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <EmailVerificationBanner />
      <main className={`${styles.mainContent} ${isAuthPage ? styles.authMain : ''}`}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};
