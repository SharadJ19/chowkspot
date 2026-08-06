import React, { useState, useEffect } from 'react';
import { CheckCircle2, Shield, Wrench, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/modules/users/api/users.api';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { Badge } from '@/components/ui/Badge/Badge';
import { APP_CONSTANTS } from '@/config/constants';
import { uploadToCloudinary } from '@/utils/cloudinary';
import type { AuthUser, WorkerProfile, ApiResponse } from '@/types';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const { user, refetchUser } = useAuth();
  const isWorker = user?.role === 'WORKER';

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState<string>(user?.city || APP_CONSTANTS.CITIES[0]);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Worker specific fields with explicit string typing
  const [category, setCategory] = useState<string>(APP_CONSTANTS.CATEGORIES[0]);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [rateType, setRateType] = useState<'HOURLY' | 'FIXED' | 'INSPECTION_FIRST'>(
    'FIXED',
  );
  const [baseRate, setBaseRate] = useState('500.00');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    usersApi
      .getMe()
      .then(
        (res: ApiResponse<{ user: AuthUser; workerProfile: WorkerProfile | null }>) => {
          if (res.success && res.data) {
            setName(res.data.user.name);
            setPhone(res.data.user.phone);
            setCity(res.data.user.city);
            setAvatarUrl(res.data.user.avatarUrl || '');

            if (res.data.workerProfile) {
              setCategory(res.data.workerProfile.category);
              setBio(res.data.workerProfile.bio || '');
              setExperienceYears(res.data.workerProfile.experienceYears);
              setRateType(res.data.workerProfile.rateType);
              setBaseRate(res.data.workerProfile.baseRate);
              setPaymentIdentifier(res.data.workerProfile.paymentIdentifier || '');
            }
          }
        },
      );
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const secureUrl = await uploadToCloudinary(file);
      setAvatarUrl(secureUrl);
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name,
        phone,
        city,
        avatarUrl,
      };

      if (isWorker) {
        payload.category = category;
        payload.bio = bio;
        payload.experienceYears = experienceYears;
        payload.rateType = rateType;
        payload.baseRate = baseRate;
        payload.serviceCities = [city, 'Chandigarh', 'Mohali'];
        payload.paymentIdentifier = paymentIdentifier;
      }

      await usersApi.updateMe(payload);
      await refetchUser();
      setSuccessMessage('Profile details successfully updated!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`container ${styles.profileContainer}`}>
      <div className={styles.profileHeader}>
        <div style={{ position: 'relative' }}>
          <Avatar name={name || 'User'} src={avatarUrl} size='xl' />
          <label
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'var(--color-primary-600)',
              color: '#fff',
              borderRadius: '50%',
              padding: '6px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
            title='Upload Avatar'
          >
            <Upload size={14} />
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>{name}</h1>
          <p className={styles.userMeta}>
            {user?.email} • {phone} • {city}
          </p>
          <div className={styles.roleBadgeWrapper}>
            <Badge variant={isWorker ? 'primary' : 'secondary'}>
              {isWorker ? <Wrench size={12} /> : <Shield size={12} />}
              <span>Role: {user?.role}</span>
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
        <h3 className={styles.formTitle}>General Account Information</h3>

        {successMessage && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <Input
          label='Full Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label='Phone Number'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className={styles.formArea}>
          <label className={styles.formLabel}>Primary Base City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.selectInput}
          >
            {APP_CONSTANTS.CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {isUploading && (
          <p
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-600)' }}
          >
            Uploading avatar image to Cloudinary...
          </p>
        )}

        {/* Worker Specific Configuration Fields */}
        {isWorker && (
          <>
            <h3 className={styles.formTitle} style={{ marginTop: 'var(--spacing-md)' }}>
              Professional Trade Configuration
            </h3>

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
                <option value='INSPECTION_FIRST'>
                  Inspection First (Quote on Visit)
                </option>
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
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
            />

            <Input
              label='UPI ID for Direct P2P Settlement'
              placeholder='e.g. name@upi'
              value={paymentIdentifier}
              onChange={(e) => setPaymentIdentifier(e.target.value)}
            />

            <div className={styles.formArea}>
              <label className={styles.formLabel}>Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.textareaInput}
              />
            </div>
          </>
        )}

        <Button type='submit' isLoading={isSaving || isUploading} fullWidth>
          Save All Changes
        </Button>
      </form>
    </div>
  );
};
