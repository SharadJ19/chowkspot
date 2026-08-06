import React, { useState } from 'react';
import { CheckCircle2, Shield, Wrench } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWorkerQueries } from '@/modules/workers/hooks/useWorkerQueries';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const { user, refetchUser } = useAuth();
  const { upsertProfileMutation } = useWorkerQueries();

  const isWorker = user?.role === 'WORKER';

  // Form states pre-populated with sensible defaults
  const [category, setCategory] = useState<string>(APP_CONSTANTS.CATEGORIES[0]);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [rateType, setRateType] = useState<'HOURLY' | 'FIXED' | 'INSPECTION_FIRST'>(
    'FIXED',
  );
  const [baseRate, setBaseRate] = useState('500.00');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleWorkerSetup = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);

    try {
      await upsertProfileMutation.mutateAsync({
        category,
        bio,
        experienceYears,
        rateType,
        baseRate,
        serviceCities: [user?.city || 'Parwanoo', 'Chandigarh', 'Mohali'],
        paymentIdentifier,
      });

      await refetchUser();
      setSuccessMessage('Worker profile configuration updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`container ${styles.profileContainer}`}>
      {/* User Overview Header Card */}
      <div className={styles.profileHeader}>
        <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size='xl' />
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{user?.name}</h1>
          <p className={styles.userMeta}>
            {user?.email} • {user?.phone} • {user?.city}
          </p>
          <div className={styles.roleBadgeWrapper}>
            <Badge variant={isWorker ? 'primary' : 'secondary'}>
              {isWorker ? <Wrench size={12} /> : <Shield size={12} />}
              <span>Role: {user?.role}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Worker Professional Configuration Section */}
      {isWorker && (
        <form onSubmit={handleWorkerSetup} className={styles.profileForm}>
          <h3 className={styles.formTitle}>Professional Trade Configuration</h3>

          {successMessage && (
            <div className={styles.successBanner}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Service Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.selectInput}
            >
              {APP_CONSTANTS.CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Rate Calculation Model</label>
            <select
              value={rateType}
              onChange={(e) =>
                setRateType(e.target.value as 'HOURLY' | 'FIXED' | 'INSPECTION_FIRST')
              }
              className={styles.selectInput}
            >
              <option value='FIXED'>Fixed Rate per Job</option>
              <option value='HOURLY'>Hourly Rate</option>
              <option value='INSPECTION_FIRST'>Inspection First (Quote on Visit)</option>
            </select>
          </div>

          <Input
            label='Experience (Years)'
            type='number'
            min={0}
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
          />

          <Input
            label='Base Rate Amount (₹)'
            placeholder='e.g. 500.00'
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            helperText='Set your baseline service charge or hourly wage.'
          />

          <Input
            label='UPI ID for Direct P2P Settlement'
            placeholder='e.g. yourname@upi'
            value={paymentIdentifier}
            onChange={(e) => setPaymentIdentifier(e.target.value)}
            helperText='Required for zero-commission direct QR payments from customers.'
          />

          <div className={styles.formArea}>
            <label className={styles.formLabel}>Professional Bio &amp; Expertise</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Describe your expertise, tools, or specializations...'
              className={styles.textareaInput}
            />
          </div>

          <Button type='submit' isLoading={upsertProfileMutation.isPending} fullWidth>
            Save Profile Settings
          </Button>
        </form>
      )}
    </div>
  );
};
