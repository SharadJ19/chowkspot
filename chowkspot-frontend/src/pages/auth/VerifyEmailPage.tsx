import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '@/modules/auth/api/auth.api';
import { AuthLayout } from '@/modules/auth/components/AuthLayout/AuthLayout';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Button } from '@/components/ui/Button/Button';
import loginStyles from '@/modules/auth/components/LoginForm/LoginForm.module.css';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!token || !email) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Missing verification token or email parameters.');
        }
        return;
      }

      try {
        await authApi.verifyEmail({ token, email });
        if (isMounted) {
          setStatus('success');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(
            (err as Error).message || 'Verification failed or link expired.',
          );
        }
      }
    };

    void verify();

    return () => {
      isMounted = false;
    };
  }, [token, email]);

  return (
    <AuthLayout
      title='Email Verification'
      subtitle='Confirming your email address to unlock full marketplace features.'
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        {status === 'loading' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '2rem 0',
            }}
          >
            <Spinner size='lg' />
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
              }}
            >
              Verifying your credentials...
            </p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div
              className={loginStyles.errorBanner}
              style={{
                backgroundColor: 'var(--color-status-completed-bg)',
                color: 'var(--color-status-completed-text)',
              }}
            >
              <CheckCircle2 size={18} />
              <span>Your email has been successfully verified!</span>
            </div>
            <Button onClick={() => navigate('/login')} fullWidth>
              Proceed to Login
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={loginStyles.errorBanner}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <Link to='/login'>
              <Button variant='outline' fullWidth>
                Back to Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
