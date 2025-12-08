import React from 'react';
import type { OSILayerNumber } from '../types';
import { ENCAPSULATION_EXAMPLE } from '../../osi-data';

export const HexDumpView: React.FC = () => {
  return (
    <div className="hexdump-view" style={{ marginTop: '30px' }}>
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Wireshark-Style Packet View</h3>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            backgroundColor: '#000',
            color: '#0f0',
            padding: '15px',
            borderRadius: '4px',
          }}
        >
          <div style={{ marginBottom: '10px', color: '#fff' }}>
            Packet Byte Stream (Simulated):
          </div>
          {ENCAPSULATION_EXAMPLE.steps
            .filter((step) => step.layer !== 7)
            .map((step, idx) => (
              <div key={idx} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                <div style={{ color: '#ff0' }}>
                  {step.layerName} ({step.size} bytes):
                </div>
                <div style={{ paddingLeft: '20px' }}>{step.content}</div>
                <div
                  className="text-gray-500 dark:text-gray-500"
                  style={{ paddingLeft: '20px', fontSize: '10px' }}
                >
                  {step.description}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
