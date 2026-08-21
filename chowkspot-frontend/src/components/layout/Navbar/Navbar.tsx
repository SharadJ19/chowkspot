import React, { useState } from 'react';
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui/Logo/Logo';

import { NavbarDesktopLinks } from './components/NavbarDesktopLinks/NavbarDesktopLinks';
import { NavbarUserActions } from './components/NavbarUserActions/NavbarUserActions';
import { NavbarMobileDrawer } from './components/NavbarMobileDrawer/NavbarMobileDrawer';

import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link to='/' className={styles.brand} aria-label='ChowkSpot Home'>
          <Logo variant='full' size='md' />
        </Link>

        <div className={styles.desktopOnly}>
          <NavbarDesktopLinks user={user} isAuthenticated={isAuthenticated} />
        </div>

        <div className={styles.desktopOnly}>
          <NavbarUserActions user={user} isAuthenticated={isAuthenticated} />
        </div>

        <button
          className={styles.hamburgerBtn}
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label='Open Mobile Navigation Menu'
        >
          <Menu size={24} />
        </button>
      </div>

      <NavbarMobileDrawer
        isOpen={isMobileMenuOpen}
        user={user}
        isAuthenticated={isAuthenticated}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};
