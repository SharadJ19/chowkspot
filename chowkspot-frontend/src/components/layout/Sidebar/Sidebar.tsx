import React from 'react';
import { NavLink } from 'react-router';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  label: string;
  to: string;
  icon?: string;
}

export interface SidebarProps {
  title?: string;
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ title = 'Dashboard', items }) => {
  return (
    <aside className={styles.sidebar}>
      {title && <span className={styles.title}>{title}</span>}
      <nav className={styles.menuList}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
