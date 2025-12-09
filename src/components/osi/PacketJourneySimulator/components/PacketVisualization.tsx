import React from 'react';
import type { PacketState, AnimationState, OSILayerNumber } from '../../osi-types';

interface PacketVisualizationProps {
  packetState: PacketState;
  animationState: AnimationState;
  inspectedLayer: OSILayerNumber | null;
  onLayerClick: (layer: OSILayerNumber) => void;
}

export const PacketVisualization: React.FC<PacketVisualizationProps> = ({
  packetState,
  animationState,
  inspectedLayer,
  onLayerClick,
}) => {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '2px solid #9e9e9e',
      }}
    >
      <h3 style={{ marginTop: 0, textAlign: 'center' }}>Packet Structure</h3>

      <div
        className="packet-visual"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        {packetState.headers.map((header, index) => (
          <div
            key={`${header.layer}-${index}`}
            onClick={() => onLayerClick(header.layer)}
            style={{
              padding: '12px',
              backgroundColor: header.color,
              borderRadius: '4px',
              border: inspectedLayer === header.layer ? '3px solid #000' : '1px solid #999',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'all 0.3s',
              opacity: animationState.isPlaying ? 0.9 : 1,
              color: 'white',
            }}
          >
            L{header.layer}: {header.layerName}
          </div>
        ))}

        <div
          style={{
            padding: '15px',
            backgroundColor: '#fff9c4',
            borderRadius: '4px',
            border: '2px dashed #FFC107',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          📦 Payload: {packetState.payload}
        </div>
      </div>

      <div
        className="text-gray-800 dark:text-gray-200"
        style={{ marginTop: '15px', fontSize: '12px', textAlign: 'center' }}
      >
        Click any layer to inspect its contents
      </div>
    </div>
  );
};
