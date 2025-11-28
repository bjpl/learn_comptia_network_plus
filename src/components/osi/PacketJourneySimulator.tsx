import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PacketState, HeaderInfo, AnimationState, OSILayerNumber } from './osi-types';
import { LAYER_COLORS, LAYER_NAMES } from './osi-data';

interface PacketJourneySimulatorProps {
  onComplete?: () => void;
}

export const PacketJourneySimulator: React.FC<PacketJourneySimulatorProps> = ({ onComplete }) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    speed: 1,
    currentStep: 0,
    protocol: 'TCP',
  });

  const [packetState, setPacketState] = useState<PacketState>({
    currentLayer: 7,
    direction: 'encapsulation',
    headers: [],
    payload: 'Hello, Network!',
  });

  const [inspectedLayer, setInspectedLayer] = useState<OSILayerNumber | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const getHeaderDataForLayer = useCallback(
    (layer: OSILayerNumber, protocol: 'TCP' | 'UDP'): Record<string, string | number> => {
      switch (layer) {
        case 7:
          return {
            Protocol: 'HTTP',
            Method: 'GET',
            URI: '/index.html',
            Version: 'HTTP/1.1',
          };
        case 6:
          return {
            Encoding: 'UTF-8',
            Compression: 'gzip',
            Encryption: 'TLS 1.3',
            Format: 'JSON',
          };
        case 5:
          return {
            'Session ID': '8a3f2c1b',
            State: 'Established',
            Dialog: 'Full-duplex',
            'Sync Point': '1024',
          };
        case 4:
          return protocol === 'TCP'
            ? {
                Protocol: 'TCP',
                'Source Port': 54321,
                'Dest Port': 80,
                Sequence: 1000,
                Ack: 2000,
                Window: 65535,
                Flags: 'PSH, ACK',
              }
            : {
                Protocol: 'UDP',
                'Source Port': 54321,
                'Dest Port': 53,
                Length: 512,
                Checksum: '0x3a4f',
              };
        case 3:
          return {
            Protocol: 'IPv4',
            'Source IP': '192.168.1.100',
            'Dest IP': '203.0.113.50',
            TTL: 64,
            'Protocol Number': protocol === 'TCP' ? 6 : 17,
            Checksum: '0x7f3a',
          };
        case 2:
          return {
            Protocol: 'Ethernet II',
            'Source MAC': '00:1A:2B:3C:4D:5E',
            'Dest MAC': 'AA:BB:CC:DD:EE:FF',
            EtherType: '0x0800',
            FCS: '0x9c4e3f2a',
            VLAN: 100,
          };
        case 1:
          return {
            Medium: 'Cat6 UTP',
            Signal: 'Electrical',
            Encoding: '8B/10B',
            'Bit Rate': '1 Gbps',
            Voltage: '±2.5V',
          };
        default:
          return {};
      }
    },
    []
  );

  const buildPacketHeaders = useCallback(
    (
      targetLayer: OSILayerNumber,
      direction: 'encapsulation' | 'decapsulation',
      protocol: 'TCP' | 'UDP'
    ): HeaderInfo[] => {
      const headers: HeaderInfo[] = [];

      if (direction === 'encapsulation') {
        // Going down the stack, add headers from current to Layer 1
        for (let layer = 7; layer >= targetLayer; layer--) {
          headers.push({
            layer: layer as OSILayerNumber,
            layerName: LAYER_NAMES[layer as OSILayerNumber],
            data: getHeaderDataForLayer(layer as OSILayerNumber, protocol),
            color: LAYER_COLORS[layer as OSILayerNumber],
          });
        }
      } else {
        // Going up the stack, remove headers from Layer 1 to current
        for (let layer = targetLayer; layer <= 7; layer++) {
          headers.push({
            layer: layer,
            layerName: LAYER_NAMES[layer],
            data: getHeaderDataForLayer(layer, protocol),
            color: LAYER_COLORS[layer],
          });
        }
      }

      return headers;
    },
    [getHeaderDataForLayer]
  );

  const stepAnimation = useCallback(() => {
    setAnimationState((prev) => {
      const { currentStep, protocol } = prev;

      // Encapsulation: 7 -> 1 (7 steps)
      // Decapsulation: 1 -> 7 (7 steps)
      // Total: 14 steps

      if (currentStep < 7) {
        // Encapsulation phase
        const currentLayer = (7 - currentStep) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'encapsulation',
          headers: buildPacketHeaders(currentLayer, 'encapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else if (currentStep < 14) {
        // Decapsulation phase
        const currentLayer = (currentStep - 6) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'decapsulation',
          headers: buildPacketHeaders(currentLayer, 'decapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else {
        // Animation complete
        onComplete?.();
        return { ...prev, isPlaying: false, currentStep: 0 };
      }
    });
  }, [buildPacketHeaders, onComplete]);

  useEffect(() => {
    if (animationState.isPlaying) {
      const interval = 1000 / animationState.speed;
      animationRef.current = setInterval(stepAnimation, interval);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [animationState.isPlaying, animationState.speed, stepAnimation]);

  const togglePlayPause = () => {
    setAnimationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const resetAnimation = () => {
    setAnimationState((prev) => ({ ...prev, isPlaying: false, currentStep: 0 }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  };

  const changeSpeed = (speed: 0.5 | 1 | 2) => {
    setAnimationState((prev) => ({ ...prev, speed }));
  };

  const changeProtocol = (protocol: 'TCP' | 'UDP') => {
    setAnimationState((prev) => ({ ...prev, protocol, currentStep: 0, isPlaying: false }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  };

  return (
    <div
      className="packet-journey-simulator"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
      <div className="header" style={{ marginBottom: '20px' }}>
        <h2>Packet Journey Simulator</h2>
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
            aria-pressed={animationState.isPlaying}
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
            aria-label="Reset animation to beginning"
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
              >
                {speed}x
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            {['TCP', 'UDP'].map((proto) => (
              <button
                key={proto}
                onClick={() => changeProtocol(proto as 'TCP' | 'UDP')}
                style={{
                  padding: '10px 15px',
                  backgroundColor: animationState.protocol === proto ? '#9C27B0' : '#e0e0e0',
                  color: animationState.protocol === proto ? 'white' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>

        <div
          className="text-gray-800 dark:text-gray-200"
          style={{ marginTop: '10px', fontSize: '14px' }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>Current Layer:</strong> Layer {packetState.currentLayer} (
          {LAYER_NAMES[packetState.currentLayer]}) |<strong> Direction:</strong>{' '}
          {packetState.direction === 'encapsulation'
            ? ' Encapsulation (Adding Headers)'
            : ' Decapsulation (Removing Headers)'}{' '}
          |<strong> Step:</strong> {animationState.currentStep}/14
        </div>
      </div>

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

        {/* Transit View (Packet Visualization) */}
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

      {/* Inspection Panel */}
      {inspectedLayer !== null && (
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
              onClick={() => setInspectedLayer(null)}
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
            {Object.entries(
              packetState.headers.find((h) => h.layer === inspectedLayer)?.data || {}
            ).map(([key, value]) => (
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
      )}

      {/* Legend */}
      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff',
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
    </div>
  );
};

export default PacketJourneySimulator;
