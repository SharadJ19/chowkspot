import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Search, Calendar, ShieldAlert, X } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import type { AuthUser } from '@/types';
import styles from './NavbarMobileDrawer.module.css';

interface NavbarMobileDrawerProps {
  isOpen: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  onClose: () => void;
}

export const NavbarMobileDrawer: React.FC<NavbarMobileDrawerProps> = ({
  isOpen,
  user,
  isAuthenticated,
  onClose,
}) => {
  const location = useLocation();

  if (!isOpen) return null;

  const isCustomerOrWorker =
    isAuthenticated && (user?.role === 'USER' || user?.role === 'WORKER');

  return (
    <>
      <div className={styles.mobileDrawerOverlay} onClick={onClose} aria-hidden='true' />
      <div className={styles.mobileDrawer} role='dialog' aria-modal='true'>
        <div className={styles.mobileDrawerHeader} style={{ justifyContent: 'flex-end' }}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close menu'
          >
            <X size={20} />
          </button>
        </div>

        {isAuthenticated && user && (
          <Link to='/profile' onClick={onClose} className={styles.userProfileSnippet}>
            <Avatar name={user.name} src={user.avatarUrl} size='md' />
            <div>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role} Hub</span>
            </div>
          </Link>
        )}

        <nav className={styles.mobileNavLinks}>
          <Link
            to='/'
            onClick={onClose}
            className={styles.mobileLink}
            data-active={location.pathname === '/' ? 'true' : 'false'}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link
            to='/search'
            onClick={onClose}
            className={styles.mobileLink}
            data-active={location.pathname === '/search' ? 'true' : 'false'}
          >
            <Search size={18} />
            <span>Find Workers</span>
          </Link>

          {isCustomerOrWorker && (
            <Link
              to='/bookings'
              onClick={onClose}
              className={styles.mobileLink}
              data-active={location.pathname === '/bookings' ? 'true' : 'false'}
            >
              <Calendar size={18} />
              <span>My Bookings</span>
            </Link>
          )}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to='/admin'
              onClick={onClose}
              className={`${styles.mobileLink} ${styles.adminLink}`}
            >
              <ShieldAlert size={18} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {!isAuthenticated && (
          <div className={styles.mobileAuthSection}>
            <Link to='/login' onClick={onClose}>
              <Button variant='outline' fullWidth>
                Log in
              </Button>
            </Link>
            <Link to='/register' onClick={onClose}>
              <Button variant='primary' fullWidth>
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
