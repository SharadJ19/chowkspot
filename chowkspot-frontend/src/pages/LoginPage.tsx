import React from 'react';
import { LoginForm } from '@/modules/auth/components/LoginForm/LoginForm';
import styles from './Pages.module.css';

export const LoginPage: React.FC = () => {
  return (
    <div className='container flex-center' style={{ minHeight: 'calc(100vh - 220px)' }}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Welcome Back</h2>
        <LoginForm />
      </div>
    </div>
  );
};
