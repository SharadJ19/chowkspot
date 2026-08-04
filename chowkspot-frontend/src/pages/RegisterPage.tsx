import React from 'react';
import { RegisterForm } from '@/modules/auth/components/RegisterForm/RegisterForm';
import styles from './Pages.module.css';

export const RegisterPage: React.FC = () => {
  return (
    <div className='container flex-center' style={{ minHeight: 'calc(100vh - 220px)' }}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Create Account</h2>
        <RegisterForm />
      </div>
    </div>
  );
};
