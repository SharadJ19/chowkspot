import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthMutations } from '../../hooks/useAuthMutations';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { loginSchema } from '../../schemas/auth.schema';
import styles from './LoginForm.module.css';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginMutation } = useAuthMutations();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formatted: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === 'email') formatted.email = issue.message;
        if (issue.path[0] === 'password') formatted.password = issue.message;
      }
      setFieldErrors(formatted);
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate('/search');
    } catch (err) {
      setApiError((err as Error).message || 'Invalid credentials');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {apiError && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          <span>{apiError}</span>
        </div>
      )}

      <Input
        label='Email Address'
        type='email'
        placeholder='you@example.com'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
      />

      <Input
        label='Password'
        type={showPassword ? 'text' : 'password'}
        placeholder='••••••••'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        rightElement={
          <button
            type='button'
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label='Toggle password visibility'
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Button
        type='submit'
        isLoading={loginMutation.isPending}
        fullWidth
        className={styles.submitBtn}
      >
        Log In
      </Button>

      <p className={styles.footerText}>
        Don't have an account?{' '}
        <Link to='/register' className={styles.link}>
          Sign up
        </Link>
      </p>
    </form>
  );
};
