import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { AlertCircle, User, Wrench } from 'lucide-react';
import { useAuthMutations } from '../../hooks/useAuthMutations';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { registerSchema } from '../../schemas/auth.schema';
import { APP_CONSTANTS } from '@/config/constants';
import styles from '../LoginForm/LoginForm.module.css';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerMutation } = useAuthMutations();

  // Read initial role from query param ?role=WORKER
  const initialRole = searchParams.get('role') === 'WORKER' ? 'WORKER' : 'USER';

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    role: 'USER' | 'WORKER';
  }>({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: APP_CONSTANTS.CITIES[0],
    role: initialRole,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const formatted: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) formatted[issue.path[0].toString()] = issue.message;
      }
      setFieldErrors(formatted);
      return;
    }

    try {
      await registerMutation.mutateAsync(formData);
      navigate(formData.role === 'WORKER' ? '/profile' : '/search');
    } catch (err) {
      setApiError((err as Error).message || 'Registration failed');
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
        label='Full Name'
        placeholder='e.g. Sharad Chandel'
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={fieldErrors.name}
      />

      <Input
        label='Email Address'
        type='email'
        placeholder='you@example.com'
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={fieldErrors.email}
      />

      <Input
        label='Phone Number'
        placeholder='+919876543210'
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        error={fieldErrors.phone}
      />

      <Input
        label='Password'
        type='password'
        placeholder='At least 8 characters'
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={fieldErrors.password}
      />

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>City Location</label>
        <select
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className={styles.selectInput}
        >
          {APP_CONSTANTS.CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Account Type</label>
        <div className={styles.roleToggleGroup}>
          <Button
            type='button'
            variant={formData.role === 'USER' ? 'primary' : 'outline'}
            onClick={() => setFormData({ ...formData, role: 'USER' })}
            className={styles.roleBtn}
          >
            <User size={16} />
            <span>Customer</span>
          </Button>
          <Button
            type='button'
            variant={formData.role === 'WORKER' ? 'primary' : 'outline'}
            onClick={() => setFormData({ ...formData, role: 'WORKER' })}
            className={styles.roleBtn}
          >
            <Wrench size={16} />
            <span>Skilled Worker</span>
          </Button>
        </div>
      </div>

      <Button
        type='submit'
        isLoading={registerMutation.isPending}
        fullWidth
        className={styles.submitBtn}
      >
        Create Account
      </Button>

      <p className={styles.footerText}>
        Already have an account?{' '}
        <Link to='/login' className={styles.link}>
          Log in
        </Link>
      </p>
    </form>
  );
};
