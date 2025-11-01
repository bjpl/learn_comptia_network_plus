/**
 * SkipLink Component
 * WCAG 2.4.1 Bypass Blocks (Level A)
 *
 * Provides keyboard users a way to skip repetitive navigation
 * and jump directly to main content.
 */

import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-link absolute -top-10 left-0 z-[9999] bg-gray-900 text-white px-4 py-2 text-sm font-medium focus:top-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Skip to main content
    </a>
  );
};
