import React from 'react';
import { useNavigate } from 'react-router';
import {
  Zap,
  Droplet,
  Hammer,
  Wind,
  Paintbrush,
  Car,
  Shield,
  Sun,
  Sparkles,
  Flame,
  LayoutGrid,
  ArrowRight,
  Search,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Button } from '@/components/ui/Button/Button';
import styles from './Pages.module.css';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Electrician: <Zap size={20} />,
  Plumber: <Droplet size={20} />,
  Carpenter: <Hammer size={20} />,
  'AC & Appliance Technician': <Wind size={20} />,
  Painter: <Paintbrush size={20} />,
  'Mechanic & Auto Expert': <Car size={20} />,
  'Industrial Electrician': <Zap size={20} />,
  'CCTV & Security Specialist': <Shield size={20} />,
  'Solar & Inverter Technician': <Sun size={20} />,
  'Home Cleaning & Pest Control': <Sparkles size={20} />,
  'Welder & Fabrication Expert': <Flame size={20} />,
  'Mason & Tiler': <LayoutGrid size={20} />,
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.homeContainer}`}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Direct Access to Verified Local Skilled Workers
        </h1>
        <p className={styles.heroSubtitle}>
          Find electricians, plumbers, carpenters, and technicians across Himachal &
          Tricity with zero platform commissions.
        </p>
        <div className={styles.heroActions}>
          <Button size='lg' onClick={() => navigate('/search')}>
            <Search size={18} />
            <span>Find Workers Now</span>
          </Button>
          <Button size='lg' variant='outline' onClick={() => navigate('/register')}>
            <UserPlus size={18} />
            <span>Join as a Skilled Worker</span>
          </Button>
        </div>
      </section>

      {/* Category Grid */}
      <section
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Service Categories</h2>
          <p className={styles.sectionSubtitle}>
            Browse available professionals by domain
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {APP_CONSTANTS.CATEGORIES.map((cat) => (
            <div
              key={cat}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              className={styles.categoryCard}
            >
              <div className={styles.categoryInfo}>
                <div className={styles.categoryIconWrapper}>
                  {CATEGORY_ICONS[cat] || <Wrench size={20} />}
                </div>
                <span className={styles.categoryName}>{cat}</span>
              </div>
              <ArrowRight size={16} className={styles.arrowIcon} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
