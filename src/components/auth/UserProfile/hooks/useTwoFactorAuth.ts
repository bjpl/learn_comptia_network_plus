/**
 * Hook for managing two-factor authentication functionality
 */

import { useState, useEffect } from 'react';
import type { TwoFactorStatus } from '../../../../types/security';

export const useTwoFactorAuth = () => {
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('twoFactorStatus');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TwoFactorStatus;
        setTwoFactorStatus(parsed);
      } catch (error) {
        console.error('Error loading 2FA status:', error);
      }
    }
  }, []);

  const handleTwoFactorComplete = (enabled: boolean): string => {
    setShowTwoFactorSetup(false);

    const stored = localStorage.getItem('twoFactorStatus');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TwoFactorStatus;
        setTwoFactorStatus(parsed);
      } catch (error) {
        console.error('Error loading 2FA status:', error);
      }
    } else {
      setTwoFactorStatus({ enabled: false });
    }

    return enabled
      ? 'Two-factor authentication has been enabled successfully!'
      : 'Two-factor authentication has been disabled.';
  };

  return {
    showTwoFactorSetup,
    twoFactorStatus,
    setShowTwoFactorSetup,
    handleTwoFactorComplete,
  };
};
