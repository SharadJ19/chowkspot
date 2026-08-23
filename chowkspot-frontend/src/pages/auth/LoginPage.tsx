import React from 'react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout/AuthLayout';
import { LoginForm } from '@/modules/auth/components/LoginForm/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title='Welcome Back'
      subtitle='Log in to manage your active bookings, direct UPI settlements, and service requests.'
    >
      <LoginForm />
    </AuthLayout>
  );
};
