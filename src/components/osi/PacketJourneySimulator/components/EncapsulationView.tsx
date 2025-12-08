import React from 'react';
import type { OSILayerNumber } from '../types';
import { LAYER_COLORS } from '../constants';
import { ENCAPSULATION_EXAMPLE } from '../../osi-data';

export const EncapsulationView: React.FC = () => {
  return (
    <div className="scenarios-view" style={{ marginTop: '30px' }}>
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Encapsulation Process - Step by Step</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {ENCAPSULATION_EXAMPLE.steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                padding: '15px',
                backgroundColor: LAYER_COLORS[step.layer as OSILayerNumber] || '#f5f5f5',
                borderRadius: '8px',
                border: '2px solid #ddd',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <strong>
                  Layer {step.layer}: {step.layerName}
                </strong>
                <div
                  style={{
                    padding: '4px 8px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {step.pdu}
                </div>
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                <strong>Action:</strong> {step.action}
              </div>
              <div
                className="text-gray-600 dark:text-gray-400"
                style={{ fontSize: '12px', marginBottom: '5px' }}
              >
                {step.description}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                {step.content}
              </div>
              <div
                className="text-gray-500 dark:text-gray-500"
                style={{ fontSize: '11px', marginTop: '5px' }}
              >
                Total Size: {step.size} bytes
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
