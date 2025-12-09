/**
 * LayerSelection Component
 */

import React from 'react';
import type { LayerSelectionProps } from '../types';
import type { OSILayerNumber } from '../../osi-types';
import { LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

export const LayerSelection: React.FC<LayerSelectionProps> = ({ selected, onSelect }) => {
  return (
    <div style={{ marginBottom: '25px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>
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
            onClick={() => onSelect(layer as OSILayerNumber)}
            style={{
              padding: '15px',
              backgroundColor:
                selected === layer ? LAYER_COLORS[layer as OSILayerNumber] : '#f5f5f5',
              border: `2px solid ${selected === layer ? '#000' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: selected === layer ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '18px' }}>Layer {layer}</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {LAYER_NAMES[layer as OSILayerNumber]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
