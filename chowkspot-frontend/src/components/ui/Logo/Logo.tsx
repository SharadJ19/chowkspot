import React from 'react';
import { LogoFull } from './LogoFull';
import { LogoIcon } from './LogoIcon';
import { LogoWordmark } from './LogoWordmark';
import styles from './Logo.module.css';

export type LogoVariant = 'full' | 'icon' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LogoVariant;
  size?: LogoSize;
  color?: string;
  className?: string;
}

const LOGO_COMPONENTS: Record<
  LogoVariant,
  React.FC<{ color?: string } & React.SVGProps<SVGSVGElement>>
> = {
  full: LogoFull,
  icon: LogoIcon,
  wordmark: LogoWordmark,
};

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  color,
  className = '',
  ...props
}) => {
  const Component = LOGO_COMPONENTS[variant];
  const combinedClasses = [styles.logo, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClasses} {...props}>
      <Component color={color} />
    </div>
  );
};
