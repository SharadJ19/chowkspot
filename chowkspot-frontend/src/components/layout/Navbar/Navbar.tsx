import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router';
import { Search, Calendar, ShieldAlert, LogOut, Menu, X, User, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Button } from '@/components/ui/Button/Button';
import { Logo } from '@/components/ui/Logo/Logo';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
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

          {isAuthenticated && user?.role === 'ADMIN' && (
            <NavLink
              to='/admin'
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.activeLink : ''}`
              }
              style={{ color: 'var(--color-error)', fontWeight: 'bold' }}
            >
              <ShieldAlert size={16} />
              <span>Admin Panel</span>
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
        <button
          className={styles.hamburgerBtn}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label='Open Mobile Navigation Menu'
        >
          <Menu size={24} />
        </button>
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className={styles.mobileDrawerOverlay}
            onClick={closeMenu}
            aria-hidden='true'
          />
          <div className={styles.mobileDrawer} role='dialog' aria-modal='true'>
            <div className={styles.mobileDrawerHeader}>
              <Logo variant='wordmark' size='sm' />
              <button
                onClick={closeMenu}
                style={{ padding: 4, cursor: 'pointer', color: 'var(--color-slate-500)' }}
                aria-label='Close menu'
              >
                <X size={20} />
              </button>
            </div>

            {isAuthenticated && user && (
              <Link
                to='/profile'
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: 'var(--color-slate-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Avatar name={user.name} src={user.avatarUrl} size='md' />
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontWeight: 800,
                      fontSize: 'var(--font-size-sm)',
                    }}
                  >
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--color-primary-700)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {user.role} Hub
                  </span>
                </div>
              </Link>
            )}

            <nav className={styles.mobileNavLinks}>
              <Link
                to='/'
                onClick={closeMenu}
                className={styles.mobileLink}
                data-active={location.pathname === '/' ? 'true' : 'false'}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                to='/search'
                onClick={closeMenu}
                className={styles.mobileLink}
                data-active={location.pathname === '/search' ? 'true' : 'false'}
              >
                <Search size={18} />
                <span>Find Workers</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to='/bookings'
                  onClick={closeMenu}
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
                  onClick={closeMenu}
                  className={styles.mobileLink}
                  style={{ color: 'var(--color-error)' }}
                >
                  <ShieldAlert size={18} />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>

            <div className={styles.mobileAuthSection}>
              {isAuthenticated ? (
                <>
                  <Link to='/profile' onClick={closeMenu}>
                    <Button variant='outline' fullWidth>
                      <User size={16} /> Edit Profile
                    </Button>
                  </Link>
                  <Button variant='danger' onClick={handleLogout} fullWidth>
                    <LogOut size={16} /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to='/login' onClick={closeMenu}>
                    <Button variant='outline' fullWidth>
                      Log in
                    </Button>
                  </Link>
                  <Link to='/register' onClick={closeMenu}>
                    <Button variant='primary' fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
