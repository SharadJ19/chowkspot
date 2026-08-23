import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/Button/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div
      className='container flex-center flex-col'
      style={{ minHeight: '60vh', gap: 'var(--spacing-md)', textAlign: 'center' }}
    >
      <h1 style={{ fontSize: 'var(--font-size-4xl)' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        The page you are looking for does not exist.
      </p>
      <Link to='/'>
        <Button variant='primary'>Return Home</Button>
      </Link>
    </div>
  );
};
