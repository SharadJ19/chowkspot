import React from 'react';
import { useNavigate } from 'react-router';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import styles from '@/pages/Pages.module.css';

export const CtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};
