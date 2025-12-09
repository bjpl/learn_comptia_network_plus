/**
 * Custom hook for managing OSIEnhanced component state
 */

import { useState } from 'react';
import type { OSILayerNumber } from '../../osi-types';
import type { TabType } from '../types';

export const useOSIEnhancedState = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedLayer, setSelectedLayer] = useState<OSILayerNumber | null>(null);
  const [showPortNumbers, setShowPortNumbers] = useState(true);

  const toggleLayer = (layer: OSILayerNumber) => {
    setSelectedLayer(layer === selectedLayer ? null : layer);
  };

  const togglePortNumbers = () => {
    setShowPortNumbers((prev) => !prev);
  };

  return {
    activeTab,
    setActiveTab,
    selectedLayer,
    setSelectedLayer,
    toggleLayer,
    showPortNumbers,
    setShowPortNumbers,
    togglePortNumbers,
  };
};
