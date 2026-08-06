import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='Previous page'
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        // Show first, last, and pages around current page
        if (
          pageNum === 1 ||
          pageNum === totalPages ||
          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
        ) {
          return (
            <button
              key={pageNum}
              className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
          return (
            <span key={pageNum} className={styles.pageInfo}>
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='Next page'
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
