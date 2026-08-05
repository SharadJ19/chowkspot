import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={`${styles.mainContent} ${isAuthPage ? styles.authMain : ''}`}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};
