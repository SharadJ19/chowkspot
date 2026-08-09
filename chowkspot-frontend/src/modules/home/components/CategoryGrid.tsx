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
} from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { CATEGORY_IMAGES } from '@/assets/images/categories';
import styles from '@/pages/Pages.module.css';

const CATEGORY_MEDIA: Record<string, { icon: React.ReactNode; image: string }> = {
  Electrician: { icon: <Zap size={18} />, image: CATEGORY_IMAGES.electrician },
  Plumber: { icon: <Droplet size={18} />, image: CATEGORY_IMAGES.plumber },
  Carpenter: { icon: <Hammer size={18} />, image: CATEGORY_IMAGES.carpenter },
  'HVAC & AC Service': { icon: <Wind size={18} />, image: CATEGORY_IMAGES.acAppliance },
  Painter: { icon: <Paintbrush size={18} />, image: CATEGORY_IMAGES.painter },
  'Car Mechanic': { icon: <Car size={18} />, image: CATEGORY_IMAGES.autoMechanic },
  'Generator Mechanic': {
    icon: <Zap size={18} />,
    image: CATEGORY_IMAGES.industrialElec,
  },
  'CCTV & Security Tech': {
    icon: <Shield size={18} />,
    image: CATEGORY_IMAGES.cctvSecurity,
  },
  'Solar Panel Installer': {
    icon: <Sun size={18} />,
    image: CATEGORY_IMAGES.solarInverter,
  },
  'Home Cleaning': { icon: <Sparkles size={18} />, image: CATEGORY_IMAGES.homeCleaning },
  'Welder & Fabricator': { icon: <Flame size={18} />, image: CATEGORY_IMAGES.welder },
  'Flooring & Tiling': { icon: <LayoutGrid size={18} />, image: CATEGORY_IMAGES.tiler },
};

const DISPLAY_CATEGORIES = APP_CONSTANTS.CATEGORIES.filter(
  (cat) => cat in CATEGORY_MEDIA,
);

export const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className={`container ${styles.sectionBlock}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Popular Service Categories</h2>
        <p className={styles.sectionSubtitle}>
          Browse available local professionals by trade domain
        </p>
      </div>

      <div className={styles.categoryGrid}>
        {DISPLAY_CATEGORIES.map((cat) => {
          const media = CATEGORY_MEDIA[cat];
          if (!media) return null;

          return (
            <div
              key={cat}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              className={styles.categoryCard}
            >
              <div className={styles.categoryImageContainer}>
                <img
                  src={media.image}
                  alt={`${cat} service category`}
                  className={styles.categoryBgImage}
                  loading='lazy'
                  decoding='async'
                />
                <div className={styles.categoryImageDarkOverlay} />
                <div className={styles.categoryIconBadge}>{media.icon}</div>
              </div>
              <div className={styles.categoryCardContent}>
                <span className={styles.categoryTitle}>{cat}</span>
                <div className={styles.categoryActionRow}>
                  <span className={styles.categoryExploreText}>Explore Providers</span>
                  <ArrowRight size={14} className={styles.arrowIcon} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
