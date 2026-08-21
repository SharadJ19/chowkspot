import React from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import type { AuthUser } from '@/types';
import styles from './AdminUserTable.module.css';

interface AdminUserTableProps {
  users: AuthUser[];
  isLoading: boolean;
  onSelectDelete: (user: AuthUser) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  isLoading,
  onSelectDelete,
}) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Account</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className={styles.tableEmptyCell}>
                <Spinner size='sm' /> Searching directory...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.tableEmptyCell}>
                No accounts match your filter criteria.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className={styles.userCell}>
                    <Avatar name={u.name} src={u.avatarUrl} size='sm' />
                    <span className={styles.userNameText}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.city}</td>
                <td>
                  <Badge
                    variant={
                      u.role === 'ADMIN'
                        ? 'danger'
                        : u.role === 'WORKER'
                          ? 'primary'
                          : 'secondary'
                    }
                  >
                    {u.role}
                  </Badge>
                </td>
                <td>
                  {u.isVerified ? (
                    <span className={styles.verifiedTag}>
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  ) : (
                    <span className={styles.unverifiedTag}>
                      <XCircle size={13} /> Unverified
                    </span>
                  )}
                </td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <Button variant='danger' size='sm' onClick={() => onSelectDelete(u)}>
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
