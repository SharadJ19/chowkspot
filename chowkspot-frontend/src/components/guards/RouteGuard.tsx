import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types';

export interface RouteGuardProps {
  allowedRoles?: Role[];
  requireVerified?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  allowedRoles,
  requireVerified = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // If initial auth refresh request is still in-flight, let the Outlet/Suspense skeleton handle view presentation
  if (isLoading) {
    return <Outlet />;
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
