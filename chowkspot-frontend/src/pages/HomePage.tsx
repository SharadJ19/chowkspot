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
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  CalendarCheck,
  Clock,
  Sparkle,
  Star,
  CheckCircle,
  MapPin,
  Users,
} from 'lucide-react';
import { APP_CONSTANTS } from '@/config/constants';
import { Button } from '@/components/ui/Button/Button';

// ---------------------------------------------------------------------------
// 1. Barrel Image Imports
// ---------------------------------------------------------------------------
import { WORKER_IMAGES } from '@/assets/images/workers';
import { CATEGORY_IMAGES } from '@/assets/images/categories';

import styles from './Pages.module.css';

// ---------------------------------------------------------------------------
// 2. Category Media Map (Mapped to available local asset images)
// ---------------------------------------------------------------------------
const CATEGORY_MEDIA: Record<string, { icon: React.ReactNode; image: string }> = {
  Electrician: {
    icon: <Zap size={18} />,
    image: CATEGORY_IMAGES.electrician,
  },
  Plumber: {
    icon: <Droplet size={18} />,
    image: CATEGORY_IMAGES.plumber,
  },
  Carpenter: {
    icon: <Hammer size={18} />,
    image: CATEGORY_IMAGES.carpenter,
  },
  'HVAC & AC Service': {
    icon: <Wind size={18} />,
    image: CATEGORY_IMAGES.acAppliance,
  },
  Painter: {
    icon: <Paintbrush size={18} />,
    image: CATEGORY_IMAGES.painter,
  },
  'Car Mechanic': {
    icon: <Car size={18} />,
    image: CATEGORY_IMAGES.autoMechanic,
  },
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
  'Home Cleaning': {
    icon: <Sparkles size={18} />,
    image: CATEGORY_IMAGES.homeCleaning,
  },
  'Welder & Fabricator': {
    icon: <Flame size={18} />,
    image: CATEGORY_IMAGES.welder,
  },
  'Flooring & Tiling': {
    icon: <LayoutGrid size={18} />,
    image: CATEGORY_IMAGES.tiler,
  },
};

// Filter out any global categories that do not have dedicated asset images
const DISPLAY_CATEGORIES = APP_CONSTANTS.CATEGORIES.filter(
  (cat) => cat in CATEGORY_MEDIA,
);

// ---------------------------------------------------------------------------
// 3. Featured Worker Data
// ---------------------------------------------------------------------------
const FEATURED_WORKER = {
  name: 'Safal Varadhan',
  trade: 'Master Electrician',
  city: 'Mohali',
  rate: '₹400/hr',
  rating: '4.9',
  reviews: 52,
  image: WORKER_IMAGES.safalVaradhan,
};

// ---------------------------------------------------------------------------
// 4. Component Definition
// ---------------------------------------------------------------------------
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeWrapper}>
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className={`container ${styles.heroSection}`}>
        <div className={styles.heroContent}>
          <div className={styles.badgePill}>
            <Sparkle size={14} className={styles.sparkleIcon} />
            <span>Zero Platform Commissions • 100% Direct P2P Settlement</span>
          </div>
          <h1 className={styles.heroTitle}>
            Direct Access to Verified Local{' '}
            <span className={styles.highlightText}>Skilled Workers</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Find trusted electricians, plumbers, carpenters, and technicians across
            Himachal & Tricity with transparent rates and zero intermediary fees.
          </p>
          <div className={styles.heroActions}>
            <Button size='lg' onClick={() => navigate('/search')}>
              <Search size={18} />
              <span>Find Workers Now</span>
            </Button>
            <Button
              size='lg'
              variant='outline'
              onClick={() => navigate('/register?role=WORKER')}
            >
              <UserPlus size={18} />
              <span>Join as a Worker</span>
            </Button>
          </div>
        </div>

        {/* Hero Visual Showcase Frame */}
        <div className={styles.heroVisualShowcase}>
          <div className={styles.showcaseGlow} />

          {/* Main Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroImgWrapper}>
              <img
                src={FEATURED_WORKER.image}
                alt={`${FEATURED_WORKER.name} - ${FEATURED_WORKER.trade}`}
                className={styles.heroImg}
                loading='eager'
                fetchPriority='high'
              />
              <span className={styles.verifiedBadge}>
                <CheckCircle size={13} /> Verified Pro
              </span>
            </div>

            <div className={styles.heroCardBody}>
              <div className={styles.heroCardHeader}>
                <div>
                  <h3 className={styles.workerName}>{FEATURED_WORKER.name}</h3>
                  <span className={styles.workerTrade}>
                    <Zap size={14} /> {FEATURED_WORKER.trade}
                  </span>
                </div>
                <span className={styles.workerRate}>{FEATURED_WORKER.rate}</span>
              </div>

              <div className={styles.heroCardMeta}>
                <span className={styles.metaLocation}>
                  <MapPin size={13} /> {FEATURED_WORKER.city}
                </span>
                <span className={styles.metaRating}>
                  <Star size={13} fill='currentColor' /> {FEATURED_WORKER.rating} (
                  {FEATURED_WORKER.reviews} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Floating Feature Badges */}
          <div className={`${styles.floatingPill} ${styles.pillTopLeft}`}>
            <div className={styles.pillIconGreen}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <span className={styles.pillTitle}>Direct Contact</span>
              <span className={styles.pillSub}>Call & WhatsApp instantly</span>
            </div>
          </div>

          <div className={`${styles.floatingPill} ${styles.pillBottomRight}`}>
            <div className={styles.pillIconBlue}>
              <Users size={16} />
            </div>
            <div>
              <span className={styles.pillTitle}>500+ Local Pros</span>
              <span className={styles.pillSub}>Active in Himachal & Tricity</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. PLATFORM STATS STRIP ==================== */}
      <section className={styles.statsStrip}>
        <div className={`container ${styles.statsContainer}`}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>0%</span>
            <span className={styles.statLabel}>Platform Fees or Cut</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNumber}>80+</span>
            <span className={styles.statLabel}>Cities Across Regional Belt</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Direct Peer-to-Peer Settlement</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statBox}>
            <span className={styles.statNumber}>80+</span>
            <span className={styles.statLabel}>Unique Service Skills</span>
          </div>
        </div>
      </section>

      {/* ==================== 3. CATEGORIES GRID ==================== */}
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

      {/* ==================== 4. HOW IT WORKS & VALUE PROPOSITION ==================== */}
      <section className={styles.howItWorksSection}>
        <div className={`container ${styles.sectionBlock}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How ChowkSpot Works</h2>
            <p className={styles.sectionSubtitle}>
              Three simple steps to discover, hire, and settle with local skilled workers
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumberBadge}>01</div>
              <div className={styles.stepIconWrapper}>
                <Search size={22} />
              </div>
              <h3 className={styles.stepTitle}>Discover Providers</h3>
              <p className={styles.stepDescription}>
                Filter workers by specific trade category, regional city coverage, and
                real-time availability status.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumberBadge}>02</div>
              <div className={styles.stepIconWrapper}>
                <CalendarCheck size={22} />
              </div>
              <h3 className={styles.stepTitle}>Direct Booking Request</h3>
              <p className={styles.stepDescription}>
                Submit request times with work notes. Workers can accept, reject, or
                propose alternative slot counter-offers.
              </p>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumberBadge}>03</div>
              <div className={styles.stepIconWrapper}>
                <CreditCard size={22} />
              </div>
              <h3 className={styles.stepTitle}>Fee-Free Direct UPI Pay</h3>
              <p className={styles.stepDescription}>
                Settle payments directly to the worker via deep-linked UPI or scannable QR
                codes with zero platform deductions.
              </p>
            </div>
          </div>

          {/* Value Highlights Bar */}
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <ShieldCheck size={24} className={styles.valueIcon} />
              <div>
                <h3 className={styles.valueTitle}>100% Direct P2P Settlement</h3>
                <p className={styles.valueDesc}>
                  Zero escrow holds or platform cuts. Payments transfer straight to the
                  worker.
                </p>
              </div>
            </div>

            <div className={styles.valueCard}>
              <Clock size={24} className={styles.valueIcon} />
              <div>
                <h3 className={styles.valueTitle}>Real-time Socket Updates</h3>
                <p className={styles.valueDesc}>
                  Instant live notifications when workers accept, counter-offer, or
                  complete jobs.
                </p>
              </div>
            </div>

            <div className={styles.valueCard}>
              <CheckCircle2 size={24} className={styles.valueIcon} />
              <div>
                <h3 className={styles.valueTitle}>Verified Customer Reviews</h3>
                <p className={styles.valueDesc}>
                  Ratings can only be posted for completed booking records, guaranteeing
                  real feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. CALL TO ACTION BANNER ==================== */}
      <section className={styles.ctaBannerSection}>
        <div className={`container ${styles.ctaContainer}`}>
          <div className={styles.ctaTextContent}>
            <h2 className={styles.ctaTitle}>
              Are you a skilled worker in Himachal or Tricity?
            </h2>
            <p className={styles.ctaSubtitle}>
              List your services on ChowkSpot for free. Connect directly with nearby
              customers and keep 100% of your earnings.
            </p>
          </div>
          <Button size='lg' onClick={() => navigate('/register?role=WORKER')}>
            <UserPlus size={18} />
            <span>Create Worker Profile</span>
          </Button>
        </div>
      </section>
    </div>
  );
};
