import React from 'react';
import { Link } from 'react-router';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import type { AuthUser } from '@/types';
import styles from './NavbarUserActions.module.css';

interface NavbarUserActionsProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const NavbarUserActions: React.FC<NavbarUserActionsProps> = ({
  user,
  isAuthenticated,
}) => {
  return (
    <div className={styles.authGroup}>
      {isAuthenticated && user ? (
        <Link to='/profile' className={styles.userMenu}>
          <Avatar name={user.name} src={user.avatarUrl} size='sm' />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </Link>
      ) : (
        <>
          <Link to='/login'>
            <Button variant='ghost' size='sm'>
              Log in
            </Button>
          </Link>
          <Link to='/register'>
            <Button variant='primary' size='sm'>
              Get Started
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};
