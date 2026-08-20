import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '../api/users.api';
import { toast } from 'sonner';
import { APP_CONSTANTS } from '@/config/constants';
import type { AuthUser, WorkerProfile, ApiResponse } from '@/types';

export const useProfileForm = () => {
  const { user, refetchUser, logout } = useAuth();
  const navigate = useNavigate();
  const isWorker = user?.role === 'WORKER';

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState<string>(user?.city || APP_CONSTANTS.CITIES[0]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);

  const [category, setCategory] = useState<string>(APP_CONSTANTS.CATEGORIES[0]);
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  const [rateType, setRateType] = useState<'HOURLY' | 'FIXED' | 'INSPECTION_FIRST'>(
    'FIXED',
  );
  const [baseRate, setBaseRate] = useState('500.00');
  const [paymentIdentifier, setPaymentIdentifier] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

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
      toast.success('Profile details updated successfully!');
      setSuccessMessage('Profile details successfully updated!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSelfAccountDelete = async () => {
    if (deleteConfirmationText !== 'DELETE') return;
    setIsDeleting(true);
    try {
      await usersApi.deleteMe();
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return {
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
    setIsDeleteModalOpen,
    setDeleteConfirmationText,
    handleProfileSubmit,
    handleLogout,
    handleSelfAccountDelete,
  };
};
