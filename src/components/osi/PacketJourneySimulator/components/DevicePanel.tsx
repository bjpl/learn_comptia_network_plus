import React from 'react';
import type { PacketState } from '../../osi-types';

interface DevicePanelProps {
  type: 'source' | 'destination';
  packetState: PacketState;
}

export const DevicePanel: React.FC<DevicePanelProps> = ({ type, packetState }) => {
  const isSource = type === 'source';
  const backgroundColor = isSource ? '#e8f5e9' : '#e3f2fd';
  const borderColor = isSource ? '#4CAF50' : '#2196F3';
  const icon = isSource ? '💻' : '🖥️';
  const title = isSource ? 'Source Device' : 'Destination Device';

  const getMessage = () => {
    if (isSource) {
      return packetState.direction === 'encapsulation' ? 'Sending data...' : 'Data received!';
    } else {
      return packetState.direction === 'decapsulation' ? 'Processing data...' : 'Waiting for data...';
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor,
        borderRadius: '8px',
        border: `2px solid ${borderColor}`,
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ fontSize: '48px', textAlign: 'center', margin: '20px 0' }}>{icon}</div>
      <div style={{ fontSize: '12px', textAlign: 'center' }}>{getMessage()}</div>
    </div>
  );
};
