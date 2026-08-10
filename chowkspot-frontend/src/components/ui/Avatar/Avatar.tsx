import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string | null | undefined;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  const containerClasses = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} title={name}>
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials || 'U'}</span>
      )}
    </div>
  );
};
