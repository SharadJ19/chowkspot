import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthMutations } from '../../hooks/useAuthMutations';
import { workersApi } from '@/modules/workers/api/workers.api';
import { Button } from '@/components/ui/Button/Button';
import { registerSchema } from '../../schemas/auth.schema';
import { APP_CONSTANTS } from '@/config/constants';

import { StepIndicator } from './components/StepIndicator/StepIndicator';
import { StepRoleSelect } from './components/StepRoleSelect/StepRoleSelect';
import { StepProfileInfo } from './components/StepProfileInfo/StepProfileInfo';
import { StepWorkerTrade } from './components/StepWorkerTrade/StepWorkerTrade';
import { StepSecurity } from './components/StepSecurity/StepSecurity';

import loginStyles from '../LoginForm/LoginForm.module.css';
import styles from './RegisterForm.module.css';

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  role: 'USER' | 'WORKER';
}

interface WorkerFormState {
  category: string;
  rateType: 'FIXED' | 'HOURLY' | 'INSPECTION_FIRST';
  baseRate: string;
  experienceYears: number;
  paymentIdentifier: string;
}

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerMutation } = useAuthMutations();

  const initialRole = searchParams.get('role') === 'WORKER' ? 'WORKER' : 'USER';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<RegisterFormState>({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Chandigarh',
    role: initialRole,
  });

  const [workerData, setWorkerData] = useState<WorkerFormState>({
    category: APP_CONSTANTS.CATEGORIES[0] || 'Electrician',
    rateType: 'FIXED',
    baseRate: '500.00',
    experienceYears: 2,
    paymentIdentifier: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const isWorker = formData.role === 'WORKER';
  const totalSteps = isWorker ? 4 : 3;

  const steps = isWorker
    ? [
        { id: 1, title: 'Role' },
        { id: 2, title: 'Profile' },
        { id: 3, title: 'Trade' },
        { id: 4, title: 'Security' },
      ]
    : [
        { id: 1, title: 'Role' },
        { id: 2, title: 'Profile' },
        { id: 3, title: 'Security' },
      ];

  const validateCurrentStep = (): boolean => {
    setFieldErrors({});
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.role) errors.role = 'Please select an account type';
    } else if (currentStep === 2) {
      if (formData.name.trim().length < 2)
        errors.name = 'Full name must be at least 2 characters';
      if (!formData.city) errors.city = 'Please choose a primary city';
      if (formData.phone.trim().length < 10)
        errors.phone = 'Phone number must be at least 10 digits';
    } else if (isWorker && currentStep === 3) {
      if (!workerData.category) errors.category = 'Please select a trade category';
      if (
        !workerData.baseRate ||
        isNaN(Number(workerData.baseRate)) ||
        Number(workerData.baseRate) <= 0
      ) {
        errors.baseRate = 'Please provide a valid rate (e.g. 500.00)';
      }
      if (
        workerData.paymentIdentifier.trim() &&
        !workerData.paymentIdentifier.includes('@') &&
        !/^\d{10}$/.test(workerData.paymentIdentifier.trim())
      ) {
        errors.paymentIdentifier =
          'Enter a valid UPI ID (e.g. name@upi) or 10-digit number';
      }
    } else if ((!isWorker && currentStep === 3) || (isWorker && currentStep === 4)) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
      if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setFieldErrors({});
    setApiError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    if (!validateCurrentStep()) return;

    const userResult = registerSchema.safeParse(formData);
    if (!userResult.success) {
      const formatted: Record<string, string> = {};
      for (const issue of userResult.error.issues) {
        if (issue.path[0]) formatted[issue.path[0].toString()] = issue.message;
      }
      setFieldErrors(formatted);
      return;
    }

    try {
      setIsSubmitting(true);
      await registerMutation.mutateAsync(formData);

      if (isWorker) {
        await workersApi.upsertProfile({
          category: workerData.category,
          rateType: workerData.rateType,
          baseRate: workerData.baseRate,
          experienceYears: workerData.experienceYears,
          serviceCities: [formData.city],
          paymentIdentifier: workerData.paymentIdentifier.trim() || undefined,
        });
        navigate('/profile');
      } else {
        navigate('/search');
      }
    } catch (err) {
      setApiError((err as Error).message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.wizardContainer} onSubmit={handleSubmit}>
      <StepIndicator steps={steps} currentStep={currentStep} />

      {apiError && (
        <div className={loginStyles.errorBanner}>
          <AlertCircle size={16} />
          <span>{apiError}</span>
        </div>
      )}

      {currentStep === 1 && (
        <StepRoleSelect
          role={formData.role}
          totalSteps={totalSteps}
          onRoleSelect={(role) => {
            setFormData((prev) => ({ ...prev, role }));
            if (currentStep > 3) setCurrentStep(3);
          }}
        />
      )}

      {currentStep === 2 && (
        <StepProfileInfo
          name={formData.name}
          phone={formData.phone}
          city={formData.city}
          totalSteps={totalSteps}
          fieldErrors={fieldErrors}
          onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))}
        />
      )}

      {isWorker && currentStep === 3 && (
        <StepWorkerTrade
          category={workerData.category}
          rateType={workerData.rateType}
          baseRate={workerData.baseRate}
          paymentIdentifier={workerData.paymentIdentifier}
          fieldErrors={fieldErrors}
          onChange={(fields) => setWorkerData((prev) => ({ ...prev, ...fields }))}
        />
      )}

      {((!isWorker && currentStep === 3) || (isWorker && currentStep === 4)) && (
        <StepSecurity
          email={formData.email}
          password={formData.password}
          totalSteps={totalSteps}
          fieldErrors={fieldErrors}
          onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))}
        />
      )}

      <div className={styles.buttonActionRow}>
        {currentStep > 1 && (
          <Button
            type='button'
            variant='outline'
            onClick={handleBack}
            className={styles.backBtn}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            type='button'
            variant='primary'
            onClick={handleNext}
            className={styles.nextBtn}
          >
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            type='submit'
            variant='primary'
            isLoading={isSubmitting || registerMutation.isPending}
            className={styles.nextBtn}
          >
            Create Account
          </Button>
        )}
      </div>

      <p className={loginStyles.footerText}>
        Already have an account?{' '}
        <Link to='/login' className={loginStyles.link}>
          Log in
        </Link>
      </p>
    </form>
  );
};
