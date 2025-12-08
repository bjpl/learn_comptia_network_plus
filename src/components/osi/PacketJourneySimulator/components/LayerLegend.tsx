import React from 'react';
import type { OSILayerNumber } from '../types';
import { LAYER_COLORS, LAYER_NAMES } from '../constants';

export const LayerLegend: React.FC = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800"
      style={{
        marginTop: '30px',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}
    >
      <h4 style={{ marginTop: 0 }}>Layer Color Legend:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {Object.entries(LAYER_NAMES).map(([num, name]) => (
          <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: LAYER_COLORS[parseInt(num) as OSILayerNumber],
                borderRadius: '4px',
                border: '1px solid #999',
              }}
            />
            <span style={{ fontSize: '14px' }}>
              L{num}: {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
