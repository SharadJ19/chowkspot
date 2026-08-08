// FILE: src/components/guards/RouteGuard.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import type { Role } from '@/types';
import styles from './RouteGuard.module.css';

export interface RouteGuardProps {
  allowedRoles?: Role[];
  requireVerified?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  allowedRoles,
  requireVerified = false,
}) => {
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

  if (requireVerified && !user.isVerified) {
    return <Navigate to='/profile?verify_prompt=true' replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
