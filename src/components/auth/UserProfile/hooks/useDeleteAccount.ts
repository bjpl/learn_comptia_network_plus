/**
 * Hook for managing account deletion functionality
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDeleteAccount = (logout: () => void, userEmail: string) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const deleteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showDeleteModal && deleteInputRef.current) {
      deleteInputRef.current.focus();
    }
  }, [showDeleteModal]);

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteConfirmation('');
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingAccount) return;
    setShowDeleteModal(false);
    setDeleteConfirmation('');
  };

  const handleDeleteAccount = async (): Promise<void> => {
    if (deleteConfirmation !== 'DELETE' && deleteConfirmation !== userEmail) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setIsDeletingAccount(false);
    }
  };

  return {
    showDeleteModal,
    deleteConfirmation,
    isDeletingAccount,
    deleteInputRef,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteAccount,
    setDeleteConfirmation,
  };
};
