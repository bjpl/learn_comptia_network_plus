/**
 * Lazy-loaded wrapper for Connector3DViewer
 * Implements code splitting for Three.js dependencies
 */

import React, { lazy, Suspense } from 'react';
import { ThreeDLoadingFallback } from './ThreeDLoadingFallback';
import type { ConnectorType } from './media-types';

// Dynamically import the 3D viewer component with all Three.js dependencies
const Connector3DViewer = lazy(() => import('./Connector3DViewer'));

interface Connector3DViewerLazyProps {
  connectorType: ConnectorType;
  autoRotate?: boolean;
  showLabels?: boolean;
  showControls?: boolean;
  height?: string;
  onToggleFullscreen?: () => void;
}

export const Connector3DViewerLazy: React.FC<Connector3DViewerLazyProps> = (props) => {
  return (
    <Suspense fallback={<ThreeDLoadingFallback height={props.height} />}>
      <Connector3DViewer {...props} />
    </Suspense>
  );
};

export default Connector3DViewerLazy;
