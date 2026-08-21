import React from 'react';
import { HeroSection } from './components/HeroSection/HeroSection';
import { StatsStrip } from './components/StatsStrip/StatsStrip';
import { CategoryGrid } from './components/CategoryGrid/CategoryGrid';
import { HowItWorks } from './components/HowItWorks/HowItWorks';
import { CtaBanner } from './components/CtaBanner/CtaBanner';
import styles from './HomeModule.module.css';

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
