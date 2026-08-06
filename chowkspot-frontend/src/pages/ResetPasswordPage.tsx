import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/modules/auth/api/auth.api';
import { AuthLayout } from '@/modules/auth/components/AuthLayout/AuthLayout';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import loginStyles from '@/modules/auth/components/LoginForm/LoginForm.module.css';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !email) {
      setError('Invalid or missing reset token / email parameters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await authApi.resetPassword({ token, email, newPassword });
      setSuccessMessage(res.message || 'Password successfully updated.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Create New Password'
      subtitle='Please enter your new secure password below.'
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
            <span>{successMessage} Redirecting to login...</span>
          </div>
        )}

        {error && (
          <div className={loginStyles.errorBanner}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <Input
          label='New Password'
          type={showPassword ? 'text' : 'password'}
          placeholder='At least 8 characters'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          rightElement={
            <button
              type='button'
              className={loginStyles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <Button
          type='submit'
          isLoading={isLoading}
          fullWidth
          className={loginStyles.submitBtn}
        >
          Update Password
        </Button>

        <p className={loginStyles.footerText}>
          <Link to='/login' className={loginStyles.link}>
            Return to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
