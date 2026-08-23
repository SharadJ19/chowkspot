import React from 'react';
import { CheckCircle2, Shield, Wrench } from 'lucide-react';
import { useProfileForm } from '@/modules/users/hooks/useProfileForm';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { AvatarUploader } from '@/components/ui/AvatarUploader/AvatarUploader';
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete';
import { APP_CONSTANTS } from '@/config/constants';

import { ProfileAvailabilityCard } from './components/ProfileAvailabilityCard/ProfileAvailabilityCard';
import { ProfileWorkerTradeConfig } from './components/ProfileWorkerTradeConfig/ProfileWorkerTradeConfig';
import { ProfileAccountActions } from './components/ProfileAccountActions/ProfileAccountActions';

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
    isAvailable,
    serviceCities,
    isSaving,
    isTogglingAvailability,
    isLoggingOut,
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
    handleAddServiceCity,
    handleRemoveServiceCity,
    handleToggleAvailability,
    setIsDeleteModalOpen,
    setDeleteConfirmationText,
    handleProfileSubmit,
    handleLogout,
    handleSelfAccountDelete,
  } = useProfileForm();

  return (
    <div className={`container ${styles.profileContainer}`}>
      <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
        <div className={styles.formHeaderRow}>
          <div>
            <h2 className={styles.formTitle}>Account Profile</h2>
            <p className={styles.formSubtitle}>
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

        {isWorker && (
          <ProfileAvailabilityCard
            isAvailable={isAvailable}
            isToggling={isTogglingAvailability}
            onToggle={handleToggleAvailability}
          />
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
          <Autocomplete
            label='Primary Base City'
            options={APP_CONSTANTS.CITIES}
            value={city}
            onChange={(selectedCity) => {
              setCity(selectedCity);
              if (isWorker) handleAddServiceCity(selectedCity);
            }}
            placeholder='Select primary base city...'
          />
        </div>

        {isWorker && (
          <ProfileWorkerTradeConfig
            category={category}
            rateType={rateType}
            baseRate={baseRate}
            experienceYears={experienceYears}
            paymentIdentifier={paymentIdentifier}
            bio={bio}
            serviceCities={serviceCities}
            onCategoryChange={setCategory}
            onRateTypeChange={setRateType}
            onBaseRateChange={setBaseRate}
            onExperienceYearsChange={setExperienceYears}
            onPaymentIdentifierChange={setPaymentIdentifier}
            onBioChange={setBio}
            onAddCity={handleAddServiceCity}
            onRemoveCity={handleRemoveServiceCity}
          />
        )}

        <Button type='submit' isLoading={isSaving} fullWidth>
          Save All Changes
        </Button>
      </form>

      <ProfileAccountActions
        isLoggingOut={isLoggingOut}
        isDeleting={isDeleting}
        isDeleteModalOpen={isDeleteModalOpen}
        deleteConfirmationText={deleteConfirmationText}
        onLogout={handleLogout}
        onOpenDeleteModal={() => {
          setDeleteConfirmationText('');
          setIsDeleteModalOpen(true);
        }}
        onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
        onConfirmationTextChange={setDeleteConfirmationText}
        onConfirmDelete={handleSelfAccountDelete}
      />
    </div>
  );
};
