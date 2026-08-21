import React from 'react';
import { NavLink } from 'react-router';
import { Search, Calendar, ShieldAlert } from 'lucide-react';
import type { AuthUser } from '@/types';
import styles from './NavbarDesktopLinks.module.css';

interface NavbarDesktopLinksProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  user,
  isAuthenticated,
}) => {
  const isCustomerOrWorker =
    isAuthenticated && (user?.role === 'USER' || user?.role === 'WORKER');

  return (
    <nav className={styles.navLinks}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.activeLink : ''}`
        }
      >
        Home
      </NavLink>

      <NavLink
        to='/search'
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.activeLink : ''}`
        }
      >
        <Search size={16} />
        <span>Find Workers</span>
      </NavLink>

      {isCustomerOrWorker && (
        <NavLink
          to='/bookings'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.activeLink : ''}`
          }
        >
          <Calendar size={16} />
          <span>My Bookings</span>
        </NavLink>
      )}

      {isAuthenticated && user?.role === 'ADMIN' && (
        <NavLink
          to='/admin'
          className={({ isActive }) =>
            `${styles.link} ${styles.adminLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          <ShieldAlert size={16} />
          <span>Admin Panel</span>
        </NavLink>
      )}
    </nav>
  );
};
