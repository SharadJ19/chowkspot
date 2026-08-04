import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
