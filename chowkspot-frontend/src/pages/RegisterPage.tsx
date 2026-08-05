import React from 'react';
import { AuthLayout } from '@/modules/auth/components/AuthLayout/AuthLayout';
import { RegisterForm } from '@/modules/auth/components/RegisterForm/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title='Create an Account'
      subtitle='Join ChowkSpot today to connect directly with verified skilled professionals or start offering your services with zero platform fees.'
    >
      <RegisterForm />
    </AuthLayout>
  );
};
