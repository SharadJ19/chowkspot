import React from 'react';
import { CheckCircle2, Shield, Wrench, Trash2, AlertTriangle } from 'lucide-react';
import { useProfileForm } from '@/modules/users/hooks/useProfileForm';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { Modal } from '@/components/ui/Modal/Modal';
import { AvatarUploader } from '@/components/ui/AvatarUploader/AvatarUploader';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const {
    user,
    isWorker,
    name,
    phone,
    city,
    avatarUrl,
    category,
    bio,
    experienceYears,
    rateType,
    baseRate,
    paymentIdentifier,
    isSaving,
    successMessage,
    isDeleteModalOpen,
    isDeleting,
    deleteConfirmationText,
    setName,
    setPhone,
    setCity,
    setAvatarUrl,
    setCategory,
    setBio,
    setExperienceYears,
    setRateType,
    setBaseRate,
    setPaymentIdentifier,
    setIsDeleteModalOpen,
    setDeleteConfirmationText,
    handleProfileSubmit,
    handleSelfAccountDelete,
  } = useProfileForm();

  return (
    <div className={`container ${styles.profileContainer}`}>
      <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
        <div className={styles.flexBetween} style={{ alignItems: 'flex-start' }}>
          <div>
            <h2
              className={styles.formTitle}
              style={{ borderBottom: 'none', paddingBottom: 0 }}
            >
              Account Profile
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                marginTop: 2,
              }}
            >
              Manage your personal details and avatar settings
            </p>
          </div>
          <Badge variant={isWorker ? 'primary' : 'secondary'}>
            {isWorker ? <Wrench size={12} /> : <Shield size={12} />}
            <span>Role: {user?.role}</span>
          </Badge>
        </div>

        {successMessage && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className={styles.formArea}>
          <label className={styles.formLabel}>Profile Photo / Avatar</label>
          <AvatarUploader
            currentAvatarUrl={avatarUrl}
            name={name || 'User'}
            onAvatarChange={(url) => setAvatarUrl(url)}
          />
        </div>

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

        {isWorker && (
          <>
            <h3 className={styles.formTitle} style={{ marginTop: 'var(--spacing-md)' }}>
              Professional Trade Configuration &amp; Direct P2P Payments
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
              label='UPI ID or Linked Phone Number for Direct P2P Settlement'
              placeholder='e.g. 9876543210@paytm or 9876543210'
              value={paymentIdentifier}
              onChange={(e) => setPaymentIdentifier(e.target.value)}
              helperText='Customers will scan a live QR code or use this to pay you directly with 0% commission.'
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

        <Button type='submit' isLoading={isSaving} fullWidth>
          Save All Changes
        </Button>
      </form>

      <div className={styles.dangerZoneCard}>
        <h3 className={styles.dangerZoneTitle}>Danger Zone</h3>
        <p className={styles.dangerZoneDesc}>
          Permanently delete your account and all associated data from ChowkSpot.
        </p>
        <Button
          variant='danger'
          onClick={() => {
            setDeleteConfirmationText('');
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 size={16} />
          <span>Delete My Account</span>
        </Button>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Confirm Account Deletion'
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--color-status-rejected-bg)',
              color: 'var(--color-status-rejected-text)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <AlertTriangle size={24} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
              This action is permanent and irreversible. All your profile data, booking
              history, ratings, and active listings will be wiped.
            </p>
          </div>

          <Input
            label='Type "DELETE" to confirm'
            placeholder='DELETE'
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
          />

          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              justifyContent: 'flex-end',
              marginTop: 'var(--spacing-xs)',
            }}
          >
            <Button
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              isLoading={isDeleting}
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={handleSelfAccountDelete}
            >
              Permanently Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
