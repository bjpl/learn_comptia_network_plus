import React from 'react';
import type { PacketState } from '../types';

interface PacketBuilderProps {
  packetState: PacketState;
}

export const PacketBuilder: React.FC<PacketBuilderProps> = ({ packetState }) => {
  return (
    <div className="headers-view" style={{ marginTop: '30px' }}>
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Detailed Header Breakdown</h3>
        {packetState.headers.map((header, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '20px',
              padding: '15px',
              backgroundColor: header.color,
              borderRadius: '8px',
              border: '2px solid #999',
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              Layer {header.layer}: {header.layerName}
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
              }}
            >
              {Object.entries(header.data).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    padding: '10px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontSize: '12px', marginBottom: '5px' }}
                  >
                    {key}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
