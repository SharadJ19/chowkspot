import React from 'react';
import { HeroSection } from './components/HeroSection';
import { StatsStrip } from './components/StatsStrip';
import { CategoryGrid } from './components/CategoryGrid';
import { HowItWorks } from './components/HowItWorks';
import { CtaBanner } from './components/CtaBanner';
import styles from '@/pages/Pages.module.css';

export const HomeModule: React.FC = () => {
  return (
    <div className={styles.homeWrapper}>
      <HeroSection />
      <StatsStrip />
      <CategoryGrid />
      <HowItWorks />
      <CtaBanner />
    </div>
  );
};
