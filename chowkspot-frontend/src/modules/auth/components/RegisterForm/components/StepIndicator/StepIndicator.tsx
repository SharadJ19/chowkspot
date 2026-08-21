import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './StepIndicator.module.css';

export interface StepItem {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className={styles.stepIndicatorList}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''} ${
                isCompleted ? styles.stepCircleCompleted : ''
              }`}
            >
              {isCompleted ? <CheckCircle2 size={15} /> : step.id}
            </div>
            <span
              className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && <div className={styles.stepConnector} />}
          </div>
        );
      })}
    </div>
  );
};
