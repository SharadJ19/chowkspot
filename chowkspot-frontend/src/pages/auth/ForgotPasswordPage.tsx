import React, { useState } from 'react';
import { Link } from 'react-router';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/modules/auth/api/auth.api';
import { AuthLayout } from '@/modules/auth/components/AuthLayout/AuthLayout';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import loginStyles from '@/modules/auth/components/LoginForm/LoginForm.module.css';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      setSuccessMessage(
        res.message || 'If an account exists, a reset link has been sent.',
      );
    } catch (err) {
      setError((err as Error).message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Reset Password'
      subtitle="Enter your email and we'll send you a secure link to reset your password."
    >
      <form className={loginStyles.form} onSubmit={handleSubmit}>
        {successMessage && (
          <div
            className={loginStyles.errorBanner}
            style={{
              backgroundColor: 'var(--color-status-completed-bg)',
              color: 'var(--color-status-completed-text)',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className={loginStyles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <Input
          label='Email Address'
          type='email'
          placeholder='you@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          type='submit'
          isLoading={isLoading}
          fullWidth
          className={loginStyles.submitBtn}
        >
          Send Reset Link
        </Button>

        <p className={loginStyles.footerText}>
          Remember your password?{' '}
          <Link to='/login' className={loginStyles.link}>
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
