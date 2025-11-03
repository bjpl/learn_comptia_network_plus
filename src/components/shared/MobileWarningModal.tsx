/**
 * Mobile Warning Modal Component
 * Alerts users that the platform is optimized for desktop viewing
 */

import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import useMobileDetection from '../../hooks/useMobileDetection';

const STORAGE_KEY = 'network-plus-mobile-dismissed';
const DESKTOP_MIN_WIDTH = 1024;

export interface MobileWarningModalProps {
  /**
   * Override auto-detection and force modal display
   */
  forceShow?: boolean;

  /**
   * Callback when user dismisses modal
   */
  onDismiss?: () => void;

  /**
   * Allow users to continue anyway (recommended for tablets)
   */
  allowContinue?: boolean;

  /**
   * Custom message override
   */
  customMessage?: string;
}

/**
 * Modal that warns mobile/tablet users about desktop-optimized experience
 *
 * Features:
 * - Auto-detects mobile and tablet devices
 * - Remembers user's "Continue Anyway" choice via localStorage
 * - Accessible with keyboard navigation and focus trap
 * - Smooth animations with Tailwind
 * - Allows tablets to continue with warning
 *
 * @example
 * <MobileWarningModal allowContinue={true} />
 */
export const MobileWarningModal: React.FC<MobileWarningModalProps> = ({
  forceShow = false,
  onDismiss,
  allowContinue = true,
  customMessage,
}) => {
  const { isMobile, isTablet, screenWidth } = useMobileDetection();
  const [isOpen, setIsOpen] = useState(false);
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Check localStorage and determine if modal should show
  useEffect(() => {
    if (hasCheckedStorage) {return;}

    const shouldShow = forceShow || isMobile || (isTablet && screenWidth < DESKTOP_MIN_WIDTH);

    if (!shouldShow) {
      setHasCheckedStorage(true);
      return;
    }

    // Check if user previously dismissed
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === 'true') {
        setHasCheckedStorage(true);
        return;
      }
    } catch (error) {
      // LocalStorage not available, show modal anyway
      console.warn('localStorage not available:', error);
    }

    setIsOpen(true);
    setHasCheckedStorage(true);
  }, [forceShow, isMobile, isTablet, screenWidth, hasCheckedStorage]);

  // Focus management - trap focus in modal
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) {return;}

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  const handleContinueAnyway = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
    handleClose();
  };

  const isTabletDevice = isTablet && !isMobile;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="animate-slide-up max-w-md mx-auto"
        role="alertdialog"
        aria-labelledby="mobile-warning-title"
        aria-describedby="mobile-warning-description"
      >
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
          {/* Desktop Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 rounded-full p-4 backdrop-blur-sm">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2
            id="mobile-warning-title"
            className="text-2xl font-bold text-white text-center mb-2"
          >
            {isTabletDevice ? 'Best Viewed on Desktop' : 'Desktop Required'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6" id="mobile-warning-description">
          <div className="space-y-4 text-gray-700">
            <p className="text-center leading-relaxed">
              {customMessage || (
                isTabletDevice
                  ? 'This platform is optimized for desktop devices with a minimum screen width of 1024px for the best learning experience.'
                  : 'This interactive learning platform requires a desktop computer for the full experience.'
              )}
            </p>

            {/* Feature Highlights */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Desktop Features Include:
              </h3>
              <ul className="space-y-1.5 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Interactive 3D connector models and network simulators</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Advanced troubleshooting scenarios with visual feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Comprehensive subnet calculators and network designers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Side-by-side code editors and terminal simulators</span>
                </li>
              </ul>
            </div>

            {/* Minimum Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 text-center">
              <span className="font-semibold">Minimum Required:</span> {DESKTOP_MIN_WIDTH}px width
              <br />
              <span className="text-xs text-gray-500">
                Current Screen: {screenWidth}px
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
          {allowContinue && isTabletDevice ? (
            <>
              <button
                ref={closeButtonRef}
                onClick={handleContinueAnyway}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Continue to platform anyway"
              >
                Continue Anyway
              </button>
              <p className="text-xs text-center text-gray-500">
                Some features may not work optimally on smaller screens
              </p>
            </>
          ) : (
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Acknowledge and close"
            >
              Understand
            </button>
          )}
        </div>

        {/* Helpful Tip */}
        <div className="px-6 pb-6 pt-0">
          <p className="text-xs text-center text-gray-500 italic">
            💡 Tip: Access this platform from a laptop or desktop computer for the best CompTIA Network+ learning experience
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarningModal;
