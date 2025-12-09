import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { LAYER_COLORS, LAYER_NAMES } from '../../osi-data';
import { getLayerProtocols } from '../utils';

export const ProtocolMaster: React.FC = () => {
  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Match Protocols to Layers</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
          const layer = layerNum as OSILayerNumber;
          return (
            <div
              key={layer}
              style={{
                border: `2px solid ${LAYER_COLORS[layer]}`,
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: `${LAYER_COLORS[layer]}15`,
              }}
            >
              <h4 className="text-gray-800 dark:text-gray-200" style={{ marginBottom: '10px' }}>
                Layer {layer}: {LAYER_NAMES[layer]}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {getLayerProtocols(layer).map((protocol) => (
                  <span
                    key={protocol.name}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: LAYER_COLORS[layer],
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {protocol.name}
                    {protocol.port && ` :${protocol.port}`}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
