import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/modules/auth/api/auth.api';
import styles from './EmailVerificationBanner.module.css';

export const EmailVerificationBanner: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated || !user || user.isVerified) {
    return null;
  }

  const handleResend = async () => {
    try {
      setIsSending(true);
      setError(null);
      await authApi.forgotPassword({ email: user.email });
      setIsSent(true);
    } catch (err) {
      setError((err as Error).message || 'Failed to resend verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.banner} role='alert'>
      <div className={styles.leftGroup}>
        <AlertTriangle size={16} className={styles.icon} />
        <span>
          Your email (<strong>{user.email}</strong>) is not verified. Please check your
          inbox for the link.
        </span>
      </div>

      <div>
        {isSent ? (
          <span className={styles.successText}>
            <CheckCircle2 size={13} style={{ display: 'inline', marginRight: 4 }} />
            Verification Link Sent!
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isSending}
            className={styles.resendBtn}
          >
            {isSending ? 'Sending Link...' : 'Resend Email'}
          </button>
        )}
        {error && (
          <span style={{ color: 'var(--color-error)', marginLeft: 8 }}>{error}</span>
        )}
      </div>
    </div>
  );
};
