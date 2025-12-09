/**
 * Hook for managing password change functionality
 */

import { useState, useEffect, useRef } from 'react';
import { validatePasswordStrength } from '../../../../utils/auth';
import type { PasswordStrength } from '../../../../types/auth';
import type { PasswordChangeData, PasswordErrors } from '../types';
import { validatePasswordForm } from '../utils/validation';

export const usePasswordChange = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const firstPasswordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (passwordData.newPassword) {
      const strength = validatePasswordStrength(passwordData.newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, [passwordData.newPassword]);

  useEffect(() => {
    if (showPasswordModal && firstPasswordInputRef.current) {
      firstPasswordInputRef.current.focus();
    }
  }, [showPasswordModal]);

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordStrength(null);
  };

  const handleClosePasswordModal = () => {
    if (isChangingPassword) return;
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordStrength(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (passwordErrors[name as keyof PasswordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleChangePassword = async (): Promise<boolean> => {
    const validation = validatePasswordForm(passwordData);
    setPasswordErrors(validation.errors);

    if (!validation.isValid) {
      return false;
    }

    setIsChangingPassword(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleClosePasswordModal();
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: 'Current password is incorrect',
      }));
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    showPasswordModal,
    passwordData,
    passwordErrors,
    passwordStrength,
    isChangingPassword,
    firstPasswordInputRef,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handlePasswordChange,
    handleChangePassword,
  };
};
