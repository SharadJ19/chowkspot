import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary' }) => {
  const spinnerClasses = [styles.spinner, styles[size], styles[color]].join(' ');
  return <div className={spinnerClasses} role='status' aria-label='Loading' />;
};
