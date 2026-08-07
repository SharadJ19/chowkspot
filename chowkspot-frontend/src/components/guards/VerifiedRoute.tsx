import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import styles from './Guards.module.css';

export const VerifiedRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/profile?verify_prompt=true' replace />;
  }

  return <Outlet />;
};
