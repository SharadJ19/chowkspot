import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './Pages.module.css';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { upsertProfileMutation } = useWorkerQueries();

  const isWorker = user?.role === 'WORKER';

  const [category, setCategory] = useState<string>(APP_CONSTANTS.CATEGORIES[0]);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [rateType, setRateType] = useState<'HOURLY' | 'FIXED' | 'INSPECTION_FIRST'>(
    'FIXED',
  );
  const [baseRate, setBaseRate] = useState('400.00');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  const handleWorkerSetup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await upsertProfileMutation.mutateAsync({
      category,
      bio,
      experienceYears,
      rateType,
      baseRate,
      serviceCities: [user?.city || 'Parwanoo'],
      paymentIdentifier,
    });
  };

  return (
    <div className={`container ${styles.profileContainer}`}>
      <div className={styles.profileHeader}>
        <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size='xl' />
        <div>
          <h2>{user?.name}</h2>
          <p
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}
          >
            {user?.email} | {user?.phone}
          </p>
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'bold',
              color: 'var(--color-primary-600)',
            }}
          >
            Role: {user?.role}
          </span>
        </div>
      </div>

      {isWorker && (
        <form onSubmit={handleWorkerSetup} className={styles.profileForm}>
          <h3>Worker Profile Configuration</h3>

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Service Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.textareaInput}
            >
              {APP_CONSTANTS.CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label='Experience (Years)'
            type='number'
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
          />

          <Input
            label='Base Rate (₹)'
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
          />

          <Input
            label='UPI ID for Peer-to-Peer Settlement'
            placeholder='e.g. name@upi'
            value={paymentIdentifier}
            onChange={(e) => setPaymentIdentifier(e.target.value)}
          />

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Bio Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.textareaInput}
            />
          </div>

          <Button type='submit' isLoading={upsertProfileMutation.isPending}>
            Save Profile Configuration
          </Button>
        </form>
      )}
    </div>
  );
};
