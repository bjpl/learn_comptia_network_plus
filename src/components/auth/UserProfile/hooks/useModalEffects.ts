/**
 * Hook for managing modal effects (keyboard, focus, scroll)
 */

import { useEffect } from 'react';

export const useModalEffects = (
  showPasswordModal: boolean,
  showDeleteModal: boolean,
  onClosePassword: () => void,
  onCloseDelete: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPasswordModal) {
          onClosePassword();
        }
        if (showDeleteModal) {
          onCloseDelete();
        }
      }
    };

    if (showPasswordModal || showDeleteModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showPasswordModal, showDeleteModal, onClosePassword, onCloseDelete]);
};
