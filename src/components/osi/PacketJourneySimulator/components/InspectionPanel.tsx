import React from 'react';
import type { PacketState, OSILayerNumber } from '../../osi-types';
import { LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

interface InspectionPanelProps {
  inspectedLayer: OSILayerNumber;
  packetState: PacketState;
  onClose: () => void;
}

export const InspectionPanel: React.FC<InspectionPanelProps> = ({
  inspectedLayer,
  packetState,
  onClose,
}) => {
  const headerData = packetState.headers.find((h) => h.layer === inspectedLayer)?.data || {};

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `3px solid ${LAYER_COLORS[inspectedLayer]}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h3 style={{ margin: 0 }}>
          Layer {inspectedLayer}: {LAYER_NAMES[inspectedLayer]} Header Details
        </h3>
        <button
          onClick={onClose}
          style={{
            padding: '5px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ✕ Close
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}
      >
        {Object.entries(headerData).map(([key, value]) => (
          <div
            key={key}
            style={{
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <div
              className="text-gray-800 dark:text-gray-200"
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
  );
};
