import { useState, useCallback } from 'react';
import type { OSILayer, OSILayerNumber } from '../../osi-types';
import { calculateLayerCompletion, initializeLayers } from '../utils';

export const useLayerState = (onProgressUpdate?: (progress: number) => void) => {
  const [layers, setLayers] = useState<OSILayer[]>(initializeLayers());

  const updateLayer = useCallback(
    (layerNumber: OSILayerNumber, updates: Partial<OSILayer>) => {
      setLayers((prev) => {
        const newLayers = prev.map((layer) => {
          if (layer.number === layerNumber) {
            const updatedLayer = { ...layer, ...updates };
            updatedLayer.status = calculateLayerCompletion(updatedLayer);
            return updatedLayer;
          }
          return layer;
        });

        // Calculate overall progress
        const completedCount = newLayers.filter((l) => l.status === 'complete').length;
        const progress = (completedCount / 7) * 100;
        onProgressUpdate?.(progress);

        return newLayers;
      });
    },
    [onProgressUpdate]
  );

  const toggleProtocol = useCallback(
    (layerNumber: OSILayerNumber, protocolName: string) => {
      const layer = layers.find((l) => l.number === layerNumber);
      if (!layer) {
        return;
      }

      const isSelected = layer.selectedProtocols.includes(protocolName);
      const newProtocols = isSelected
        ? layer.selectedProtocols.filter((p) => p !== protocolName)
        : [...layer.selectedProtocols, protocolName];

      updateLayer(layerNumber, { selectedProtocols: newProtocols });
    },
    [layers, updateLayer]
  );

  return {
    layers,
    updateLayer,
    toggleProtocol,
  };
};
