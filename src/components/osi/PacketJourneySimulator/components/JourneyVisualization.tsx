import React from 'react';
import type { PacketState, OSILayerNumber } from '../types';

interface JourneyVisualizationProps {
  packetState: PacketState;
  inspectedLayer: OSILayerNumber | null;
  setInspectedLayer: (layer: OSILayerNumber | null) => void;
  isPlaying: boolean;
}

export const JourneyVisualization: React.FC<JourneyVisualizationProps> = ({
  packetState,
  inspectedLayer,
  setInspectedLayer,
  isPlaying,
}) => {
  return (
    <div
      className="visualization-panels"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: '20px',
        marginTop: '30px',
      }}
    >
      {/* Source Device */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4CAF50',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Source Device</h3>
        <div style={{ fontSize: '48px', textAlign: 'center', margin: '20px 0' }}>💻</div>
        <div style={{ fontSize: '12px', textAlign: 'center' }}>
          {packetState.direction === 'encapsulation' ? 'Sending data...' : 'Data received!'}
        </div>
      </div>

      {/* Packet Structure */}
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
              onClick={() => setInspectedLayer(header.layer)}
              style={{
                padding: '12px',
                backgroundColor: header.color,
                borderRadius: '4px',
                border: inspectedLayer === header.layer ? '3px solid #000' : '1px solid #999',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                transition: 'all 0.3s',
                opacity: isPlaying ? 0.9 : 1,
                color: 'white',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${header.layerName} header`}
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
          className="text-gray-600 dark:text-gray-400"
          style={{ marginTop: '15px', fontSize: '12px', textAlign: 'center' }}
        >
          Click any layer to inspect its contents
        </div>
      </div>

      {/* Destination Device */}
      <div
        style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #2196F3',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Destination Device</h3>
        <div style={{ fontSize: '48px', textAlign: 'center', margin: '20px 0' }}>🖥️</div>
        <div style={{ fontSize: '12px', textAlign: 'center' }}>
          {packetState.direction === 'decapsulation'
            ? 'Processing data...'
            : 'Waiting for data...'}
        </div>
      </div>
    </div>
  );
};
