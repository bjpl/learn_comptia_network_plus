import React from 'react';
import type { OSILayerNumber } from '../types';
import { LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

interface LayerSelectionProps {
  selectedLayer: OSILayerNumber | null;
  onLayerSelect: (layer: OSILayerNumber) => void;
}

export const LayerSelection: React.FC<LayerSelectionProps> = ({ selectedLayer, onLayerSelect }) => {
  return (
    <div className="layer-selection" style={{ marginBottom: '25px' }}>
      <div
        className="text-gray-900 dark:text-gray-100"
        style={{
          display: 'block',
          fontWeight: 'bold',
          marginBottom: '10px',
          fontSize: '16px',
        }}
      >
        1. Identify the OSI Layer (20% of score):
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
        }}
      >
        {[7, 6, 5, 4, 3, 2, 1].map((layer) => (
          <button
            key={layer}
            onClick={() => onLayerSelect(layer as OSILayerNumber)}
            style={{
              padding: '15px',
              backgroundColor: selectedLayer === layer ? LAYER_COLORS[layer] : '#f5f5f5',
              border: `2px solid ${selectedLayer === layer ? '#000' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: selectedLayer === layer ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            <div className="text-gray-900 dark:text-gray-100" style={{ fontSize: '18px' }}>
              Layer {layer}
            </div>
            <div
              className="text-gray-900 dark:text-gray-100"
              style={{ fontSize: '12px', marginTop: '5px' }}
            >
              {LAYER_NAMES[layer as OSILayerNumber]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
