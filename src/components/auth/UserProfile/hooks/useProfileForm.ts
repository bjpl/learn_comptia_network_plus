/**
 * Hook for managing profile form state and actions
 */

import { useState } from 'react';
import type { User } from '../../../../types/auth';
import type { FormData, FormErrors } from '../types';
import { validateProfileForm } from '../utils/validation';

export const useProfileForm = (user: User | null, updateUser: (updates: Partial<User>) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (!user) return;
    setIsEditing(false);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async (): Promise<boolean> => {
    const validation = validateProfileForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return false;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updates: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
      };

      updateUser(updates);
      setIsEditing(false);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    formData,
    errors,
    isSaving,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
  };
};
