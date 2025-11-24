/**
 * Mobile Detection Hook
 * Detects mobile devices and provides responsive state management
 */

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface MobileDetectionState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  screenWidth: number;
  isTouchDevice: boolean;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

/**
 * Detects if the device is a mobile device based on user agent
 */
const detectMobileUserAgent = (): boolean => {
  if (typeof navigator === 'undefined') {return false;}

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Comprehensive mobile device detection
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  return mobileRegex.test(userAgent);
};

/**
 * Detects if the device has touch capabilities
 */
const detectTouchDevice = (): boolean => {
  if (typeof window === 'undefined') {return false;}

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

/**
 * Determines device type based on screen width
 */
const getDeviceType = (width: number): DeviceType => {
  if (width < MOBILE_BREAKPOINT) {return 'mobile';}
  if (width < TABLET_BREAKPOINT) {return 'tablet';}
  return 'desktop';
};

/**
 * Custom hook for mobile device detection
 *
 * @returns {MobileDetectionState} Current mobile detection state
 *
 * @example
 * const { isMobile, isTablet, deviceType } = useMobileDetection();
 *
 * if (isMobile) {
 *   // Show mobile warning
 * }
 */
export const useMobileDetection = (): MobileDetectionState => {
  const [screenWidth, setScreenWidth] = useState<number>(() => {
    if (typeof window === 'undefined') {return 1920;}
    return window.innerWidth;
  });

  const [isTouchDevice] = useState<boolean>(() => detectTouchDevice());
  const [hasMobileUserAgent] = useState<boolean>(() => detectMobileUserAgent());

  // Update screen width on resize
  useEffect(() => {
    if (typeof window === 'undefined') {return;}

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Use throttled resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize);

    // Initial measurement
    handleResize();

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Calculate device state
  const deviceType = getDeviceType(screenWidth);
  const isMobile = deviceType === 'mobile' || (hasMobileUserAgent && screenWidth < TABLET_BREAKPOINT);
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    screenWidth,
    isTouchDevice,
  };
};

/**
 * Hook for checking if device meets minimum width requirement
 *
 * @param {number} minWidth - Minimum required width in pixels
 * @returns {boolean} Whether device meets minimum width
 *
 * @example
 * const meetsMinWidth = useMinimumWidth(1024);
 */
export const useMinimumWidth = (minWidth: number): boolean => {
  const { screenWidth } = useMobileDetection();
  return screenWidth >= minWidth;
};

/**
 * Hook for orientation detection
 *
 * @returns {{ isPortrait: boolean, isLandscape: boolean, orientation: 'portrait' | 'landscape' }}
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') {return 'landscape';}
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {return;}

    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return {
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    orientation,
  };
};

export default useMobileDetection;
