import React from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className={styles.authViewport}>
      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.formTitle}>{title}</h1>
          <p className={styles.formSubtitle}>{subtitle}</p>
        </div>

        <div className={styles.formContent}>{children}</div>
      </div>
    </div>
  );
};
