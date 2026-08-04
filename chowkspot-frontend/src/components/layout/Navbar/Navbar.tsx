import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { Search, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { Logo } from '@/components/ui/Logo/Logo';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.container}`}>
        <Link to='/' className={styles.brand} aria-label='ChowkSpot Home'>
          <Logo variant='full' size='md' />
        </Link>

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

          {isAuthenticated && (
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
        </nav>

        <div className={styles.authGroup}>
          {isAuthenticated && user ? (
            <div className={styles.authGroup}>
              <Link to='/profile' className={styles.userMenu}>
                <Avatar name={user.name} src={user.avatarUrl} size='sm' />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userRole}>{user.role}</span>
                </div>
              </Link>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className={styles.logoutBtn}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
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
      </div>
    </header>
  );
};
