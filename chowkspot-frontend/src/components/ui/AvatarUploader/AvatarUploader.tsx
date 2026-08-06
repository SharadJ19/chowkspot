import React, { useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar/Avatar';
import { uploadToCloudinary } from '@/utils/cloudinary';
import styles from './AvatarUploader.module.css';

export interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  name: string;
  onAvatarChange: (url: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  name,
  onAvatarChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be under 5MB');
      return;
    }

    try {
      setError(null);
      setIsUploading(true);
      const secureUrl = await uploadToCloudinary(file);
      onAvatarChange(secureUrl);
    } catch {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploaderContainer}>
      <div className={styles.previewWrapper}>
        <Avatar name={name} src={currentAvatarUrl} size='xl' />
      </div>

      <div className={styles.uploadInfo}>
        <span className={styles.uploadTitle}>Profile Picture</span>
        <p className={styles.uploadDesc}>
          Upload a clean headshot or logo. Supported formats: PNG, JPG, WEBP up to 5MB.
        </p>

        <div className={styles.uploadActionRow}>
          <label
            className={`${styles.uploadBtnLabel} ${isUploading ? styles.uploadBtnLabelDisabled : ''}`}
          >
            {isUploading ? <Loader2 size={14} className='spin' /> : <Camera size={14} />}
            <span>{isUploading ? 'Uploading...' : 'Change Avatar'}</span>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              disabled={isUploading}
              className={styles.fileInput}
            />
          </label>

          {currentAvatarUrl && (
            <button
              type='button'
              onClick={() => onAvatarChange('')}
              className={styles.uploadBtnLabel}
              style={{ color: 'var(--color-error)' }}
              disabled={isUploading}
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          )}
        </div>

        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    </div>
  );
};
