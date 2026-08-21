import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/Input/Input';
import styles from './StepSecurity.module.css';

interface StepSecurityProps {
  email: string;
  password: string;
  totalSteps: number;
  fieldErrors: Record<string, string>;
  onChange: (fields: Partial<{ email: string; password: string }>) => void;
}

export const StepSecurity: React.FC<StepSecurityProps> = ({
  email,
  password,
  totalSteps,
  fieldErrors,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.stepBody}>
      <div className={styles.stepHeader}>
        <span className={styles.stepSubheading}>
          Step {totalSteps} of {totalSteps}
        </span>
        <h3 className={styles.stepTitle}>Account Security</h3>
        <p className={styles.stepDescription}>
          Set up your credentials for secure dashboard access.
        </p>
      </div>

      <Input
        label='Email Address'
        type='email'
        placeholder='you@example.com'
        value={email}
        onChange={(e) => onChange({ email: e.target.value })}
        error={fieldErrors.email}
        autoFocus
      />

      <Input
        label='Password'
        type={showPassword ? 'text' : 'password'}
        placeholder='At least 8 characters'
        value={password}
        onChange={(e) => onChange({ password: e.target.value })}
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
    </div>
  );
};
