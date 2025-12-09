/**
 * Loading Fallback for 3D Components
 * Displays a loading state while Three.js bundles are loaded
 */

import React from 'react';

interface ThreeDLoadingFallbackProps {
  message?: string;
  height?: string;
}

export const ThreeDLoadingFallback: React.FC<ThreeDLoadingFallbackProps> = ({
  message = 'Loading 3D viewer...',
  height = '500px',
}) => {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-gray-100"
      style={{ height }}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
        <p className="text-sm text-gray-700">{message}</p>
        <p className="mt-2 text-xs text-gray-500">Loading 3D rendering engine...</p>
      </div>
    </div>
  );
};

export default ThreeDLoadingFallback;
