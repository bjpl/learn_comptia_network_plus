import React from 'react';
import type { AnimationState, ProtocolType, ViewMode, OSILayerNumber } from '../types';
import { LAYER_NAMES } from '../constants';

interface AnimationControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedProtocol: ProtocolType;
  setSelectedProtocol: (protocol: ProtocolType) => void;
  animationState: AnimationState;
  togglePlayPause: () => void;
  resetAnimation: () => void;
  changeSpeed: (speed: 0.5 | 1 | 2) => void;
  changeProtocol: (protocol: 'TCP' | 'UDP') => void;
  currentLayer: number;
  direction: 'encapsulation' | 'decapsulation';
  currentStep: number;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  viewMode,
  setViewMode,
  selectedProtocol,
  setSelectedProtocol,
  animationState,
  togglePlayPause,
  resetAnimation,
  changeSpeed,
  changeProtocol,
  currentLayer,
  direction,
  currentStep,
}) => {
  return (
    <div className="header" style={{ marginBottom: '20px' }}>
      <h2>Packet Journey Simulator - Enhanced</h2>

      {/* View Mode Tabs */}
      <div
        className="view-tabs"
        style={{ display: 'flex', gap: '5px', marginTop: '15px', flexWrap: 'wrap' }}
      >
        {(['journey', 'headers', 'hexdump', 'tcp-flags', 'mtu', 'scenarios'] as ViewMode[]).map(
          (mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === mode ? '#2196F3' : '#e0e0e0',
                color: viewMode === mode ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === mode ? 'bold' : 'normal',
              }}
              aria-label={`View ${mode}`}
            >
              {mode === 'journey'
                ? 'Packet Journey'
                : mode === 'headers'
                  ? 'Header Details'
                  : mode === 'hexdump'
                    ? 'Hex View'
                    : mode === 'tcp-flags'
                      ? 'TCP Flags'
                      : mode === 'mtu'
                        ? 'MTU/Fragmentation'
                        : 'Scenarios'}
            </button>
          )
        )}
      </div>

      {/* Protocol Selector */}
      <div
        className="protocol-selector"
        style={{
          marginTop: '15px',
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <label htmlFor="protocol-select" style={{ fontWeight: 'bold' }}>
          Application Protocol:
        </label>
        <select
          id="protocol-select"
          value={selectedProtocol}
          onChange={(e) => setSelectedProtocol(e.target.value as ProtocolType)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
          aria-label="Select application protocol"
        >
          <option value="HTTP">HTTP (Port 80)</option>
          <option value="HTTPS">HTTPS (Port 443)</option>
          <option value="DNS">DNS (Port 53)</option>
          <option value="DHCP">DHCP (Port 67/68)</option>
          <option value="FTP">FTP (Port 20/21)</option>
          <option value="SMTP">SMTP (Port 25)</option>
          <option value="SSH">SSH (Port 22)</option>
        </select>

        <span style={{ fontWeight: 'bold' }}>Transport:</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['TCP', 'UDP'].map((proto) => (
            <button
              key={proto}
              onClick={() => changeProtocol(proto as 'TCP' | 'UDP')}
              style={{
                padding: '8px 15px',
                backgroundColor: animationState.protocol === proto ? '#9C27B0' : '#e0e0e0',
                color: animationState.protocol === proto ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label={`Select ${proto}`}
            >
              {proto}
            </button>
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div
        className="controls"
        style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}
      >
        <button
          onClick={togglePlayPause}
          style={{
            padding: '10px 20px',
            backgroundColor: animationState.isPlaying ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          aria-label={animationState.isPlaying ? 'Pause animation' : 'Play animation'}
        >
          {animationState.isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button
          onClick={resetAnimation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          aria-label="Reset animation"
        >
          🔄 Reset
        </button>

        <div style={{ display: 'flex', gap: '5px' }}>
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => changeSpeed(speed as 0.5 | 1 | 2)}
              style={{
                padding: '10px 15px',
                backgroundColor: animationState.speed === speed ? '#FF9800' : '#e0e0e0',
                color: animationState.speed === speed ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              aria-label={`Speed ${speed}x`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      <div
        className="text-gray-600 dark:text-gray-400"
        style={{ marginTop: '10px', fontSize: '14px' }}
      >
        <strong>Current Layer:</strong> Layer {currentLayer} ({LAYER_NAMES[currentLayer as OSILayerNumber]}) |
        <strong> Direction:</strong>{' '}
        {direction === 'encapsulation'
          ? 'Encapsulation (Adding Headers)'
          : 'Decapsulation (Removing Headers)'}{' '}
        |<strong> Step:</strong> {currentStep}/14
      </div>
    </div>
  );
};
