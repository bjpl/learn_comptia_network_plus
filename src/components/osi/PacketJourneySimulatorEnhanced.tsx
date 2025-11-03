import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { PacketState, HeaderInfo, AnimationState, OSILayerNumber } from './osi-types';
import {
  LAYER_COLORS,
  LAYER_NAMES,
  TCP_FLAGS,
  TCP_HANDSHAKE,
  MTU_VALUES,
  ENCAPSULATION_EXAMPLE,
} from './osi-data';

interface PacketJourneySimulatorProps {
  onComplete?: () => void;
}

type ViewMode = 'journey' | 'headers' | 'hexdump' | 'scenarios' | 'tcp-flags' | 'mtu';
type ProtocolType =
  | 'HTTP'
  | 'HTTPS'
  | 'DNS'
  | 'DHCP'
  | 'FTP'
  | 'SMTP'
  | 'SSH'
  | 'TCP'
  | 'UDP'
  | 'ICMP'
  | 'ARP';

interface TCPFlagState {
  SYN: boolean;
  ACK: boolean;
  FIN: boolean;
  RST: boolean;
  PSH: boolean;
  URG: boolean;
}

export const PacketJourneySimulatorEnhanced: React.FC<PacketJourneySimulatorProps> = ({
  onComplete,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('journey');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('HTTP');
  const [selectedMTU, setSelectedMTU] = useState(1500);
  const [tcpScenario, setTcpScenario] = useState<'handshake' | 'termination' | 'custom'>(
    'handshake'
  );
  const [tcpFlags, setTcpFlags] = useState<TCPFlagState>({
    SYN: false,
    ACK: false,
    FIN: false,
    RST: false,
    PSH: false,
    URG: false,
  });

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

  // Enhanced protocol header data based on selected protocol
  const getHeaderDataForLayer = useCallback(
    (layer: OSILayerNumber, protocol: 'TCP' | 'UDP'): Record<string, string | number> => {
      switch (layer) {
        case 7:
          switch (selectedProtocol) {
            case 'HTTP':
              return {
                Protocol: 'HTTP',
                Method: 'GET',
                URI: '/index.html',
                Version: 'HTTP/1.1',
                Host: 'www.example.com',
                Port: 80,
              };
            case 'HTTPS':
              return {
                Protocol: 'HTTPS',
                Method: 'GET',
                URI: '/secure/data',
                Version: 'HTTP/1.1',
                'TLS Version': 'TLS 1.3',
                Port: 443,
              };
            case 'DNS':
              return {
                Protocol: 'DNS',
                'Transaction ID': '0x4a2f',
                Type: 'Standard Query',
                Question: 'www.example.com',
                'Query Type': 'A (IPv4)',
                Port: 53,
              };
            case 'DHCP':
              return {
                Protocol: 'DHCP',
                'Message Type': 'DHCPDISCOVER',
                'Transaction ID': '0x3903f326',
                'Client MAC': '00:1A:2B:3C:4D:5E',
                Broadcast: 'Yes',
                Port: '67/68',
              };
            case 'FTP':
              return {
                Protocol: 'FTP',
                Command: 'USER',
                'Control Port': 21,
                'Data Port': 20,
                Mode: 'Passive',
              };
            case 'SMTP':
              return {
                Protocol: 'SMTP',
                Command: 'MAIL FROM',
                From: 'sender@example.com',
                Port: 25,
              };
            case 'SSH':
              return {
                Protocol: 'SSH',
                Version: 'SSH-2.0',
                Port: 22,
                Encryption: 'AES-256-GCM',
              };
            default:
              return {
                Protocol: 'Application Data',
                Type: 'User Data',
              };
          }
        case 6:
          return selectedProtocol === 'HTTPS'
            ? {
                'TLS Record': 'Handshake',
                'Cipher Suite': 'TLS_AES_256_GCM_SHA384',
                Encryption: 'Enabled',
                Compression: 'None',
              }
            : {
                Encoding: 'UTF-8',
                Compression: 'gzip',
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
          if (protocol === 'TCP') {
            const flags = Object.entries(tcpFlags)
              .filter(([, value]) => value)
              .map(([key]) => key)
              .join(', ');
            return {
              Protocol: 'TCP',
              'Source Port': 54321,
              'Dest Port':
                selectedProtocol === 'HTTP'
                  ? 80
                  : selectedProtocol === 'HTTPS'
                    ? 443
                    : selectedProtocol === 'SSH'
                      ? 22
                      : 80,
              Sequence: 1000,
              Ack: tcpFlags.ACK ? 2000 : 0,
              Window: 65535,
              Flags: flags || 'None',
            };
          } else {
            return {
              Protocol: 'UDP',
              'Source Port': 54321,
              'Dest Port': selectedProtocol === 'DNS' ? 53 : selectedProtocol === 'DHCP' ? 67 : 53,
              Length: 512,
              Checksum: '0x3a4f',
            };
          }
        case 3:
          return {
            Protocol: 'IPv4',
            'Source IP': '192.168.1.100',
            'Dest IP': '203.0.113.50',
            TTL: 64,
            'Protocol Number': protocol === 'TCP' ? 6 : 17,
            'Total Length': 1500,
            Flags: `DF=${selectedMTU < 1500 ? 1 : 0}`,
            Checksum: '0x7f3a',
          };
        case 2:
          return {
            Protocol: 'Ethernet II',
            'Source MAC': '00:1A:2B:3C:4D:5E',
            'Dest MAC': 'AA:BB:CC:DD:EE:FF',
            EtherType: '0x0800',
            FCS: '0x9c4e3f2a',
            'Frame Size': '64-1518 bytes',
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
    [selectedProtocol, tcpFlags, selectedMTU]
  );

  const buildPacketHeaders = useCallback(
    (
      targetLayer: OSILayerNumber,
      direction: 'encapsulation' | 'decapsulation',
      protocol: 'TCP' | 'UDP'
    ): HeaderInfo[] => {
      const headers: HeaderInfo[] = [];

      if (direction === 'encapsulation') {
        for (let layer = 7; layer >= targetLayer; layer--) {
          headers.push({
            layer: layer as OSILayerNumber,
            layerName: LAYER_NAMES[layer as OSILayerNumber],
            data: getHeaderDataForLayer(layer as OSILayerNumber, protocol),
            color: LAYER_COLORS[layer as OSILayerNumber],
          });
        }
      } else {
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

      if (currentStep < 7) {
        const currentLayer = (7 - currentStep) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'encapsulation',
          headers: buildPacketHeaders(currentLayer, 'encapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else if (currentStep < 14) {
        const currentLayer = (currentStep - 6) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'decapsulation',
          headers: buildPacketHeaders(currentLayer, 'decapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else {
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

  const toggleTCPFlag = (flag: keyof TCPFlagState) => {
    setTcpFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const loadTCPScenario = (scenario: 'handshake' | 'termination') => {
    setTcpScenario(scenario);
    if (scenario === 'handshake') {
      // First step of handshake
      setTcpFlags({ SYN: true, ACK: false, FIN: false, RST: false, PSH: false, URG: false });
    } else {
      // First step of termination
      setTcpFlags({ SYN: false, ACK: true, FIN: true, RST: false, PSH: false, URG: false });
    }
  };

  // Calculate fragmentation info
  const fragmentationInfo = useMemo(() => {
    const payloadSize = ENCAPSULATION_EXAMPLE.originalData.length;
    const ipHeaderSize = 20;
    const tcpHeaderSize = 20;
    const ethernetHeaderSize = 18;
    const totalPacketSize = payloadSize + ipHeaderSize + tcpHeaderSize;
    const totalFrameSize = totalPacketSize + ethernetHeaderSize;

    const needsFragmentation = totalFrameSize > selectedMTU;
    const fragmentCount = needsFragmentation
      ? Math.ceil(totalPacketSize / (selectedMTU - ipHeaderSize))
      : 1;

    return {
      needsFragmentation,
      fragmentCount,
      totalPacketSize,
      totalFrameSize,
      mtu: selectedMTU,
    };
  }, [selectedMTU]);

  // Future enhancement: Application layer protocols dropdown
  // const applicationProtocols = useMemo(
  //   () => PROTOCOLS.filter((p) => p.layer === 7 && p.port).slice(0, 20),
  //   []
  // );

  return (
    <div
      className="packet-journey-simulator-enhanced"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
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
          <strong>Current Layer:</strong> Layer {packetState.currentLayer} (
          {LAYER_NAMES[packetState.currentLayer]}) |<strong> Direction:</strong>{' '}
          {packetState.direction === 'encapsulation'
            ? 'Encapsulation (Adding Headers)'
            : 'Decapsulation (Removing Headers)'}{' '}
          |<strong> Step:</strong> {animationState.currentStep}/14
        </div>
      </div>

      {/* Journey View */}
      {viewMode === 'journey' && (
        <div
          className="visualization-panels"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            gap: '20px',
            marginTop: '30px',
          }}
        >
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
      )}

      {/* TCP Flags View */}
      {viewMode === 'tcp-flags' && (
        <div className="tcp-flags-view" style={{ marginTop: '30px' }}>
          <div
            className="bg-white dark:bg-gray-800"
            style={{
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          >
            <h3 style={{ marginTop: 0 }}>TCP Flag Visualizer</h3>

            {/* Scenario Selector */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Common Scenarios:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => loadTCPScenario('handshake')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: tcpScenario === 'handshake' ? '#4CAF50' : '#e0e0e0',
                    color: tcpScenario === 'handshake' ? 'white' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  3-Way Handshake
                </button>
                <button
                  onClick={() => loadTCPScenario('termination')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: tcpScenario === 'termination' ? '#4CAF50' : '#e0e0e0',
                    color: tcpScenario === 'termination' ? 'white' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Connection Termination
                </button>
                <button
                  onClick={() => setTcpScenario('custom')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: tcpScenario === 'custom' ? '#4CAF50' : '#e0e0e0',
                    color: tcpScenario === 'custom' ? 'white' : '#000',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Custom Flags
                </button>
              </div>
            </div>

            {/* Flag Toggles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginTop: '20px',
              }}
            >
              {TCP_FLAGS.map((flag) => (
                <div
                  key={flag.abbreviation}
                  onClick={() => toggleTCPFlag(flag.abbreviation as keyof TCPFlagState)}
                  style={{
                    padding: '15px',
                    backgroundColor: tcpFlags[flag.abbreviation as keyof TCPFlagState]
                      ? '#4CAF50'
                      : '#f5f5f5',
                    color: tcpFlags[flag.abbreviation as keyof TCPFlagState] ? 'white' : '#000',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: tcpFlags[flag.abbreviation as keyof TCPFlagState]
                      ? '#388E3C'
                      : '#ddd',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Toggle ${flag.name} flag`}
                  title={flag.description}
                >
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {flag.abbreviation}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>{flag.name}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>
                    {tcpFlags[flag.abbreviation as keyof TCPFlagState] ? '✓ Set' : '○ Clear'}
                  </div>
                </div>
              ))}
            </div>

            {/* TCP Handshake Visualization */}
            {tcpScenario === 'handshake' && (
              <div
                style={{
                  marginTop: '30px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                }}
              >
                <h4>TCP 3-Way Handshake Sequence</h4>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    marginTop: '15px',
                  }}
                >
                  {TCP_HANDSHAKE.establishment.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800"
                      style={{
                        padding: '15px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <strong>Step {step.step}:</strong>
                        <div
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {step.flags.join(' + ')}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '14px' }}>
                        {step.from} → {step.to}
                      </div>
                      <div
                        className="text-gray-600 dark:text-gray-400"
                        style={{ marginTop: '5px', fontSize: '12px' }}
                      >
                        {step.description}
                      </div>
                      {step.seqNum && (
                        <div
                          className="text-gray-500 dark:text-gray-500"
                          style={{
                            marginTop: '5px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                          }}
                        >
                          Seq: {step.seqNum}
                          {step.ackNum && `, Ack: ${step.ackNum}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flag Descriptions */}
            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
              }}
            >
              <h4>Exam Tips:</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
                {TCP_FLAGS.map((flag) => (
                  <li key={flag.abbreviation}>
                    <strong>{flag.abbreviation}:</strong> {flag.examScenario}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MTU/Fragmentation View */}
      {viewMode === 'mtu' && (
        <div className="mtu-view" style={{ marginTop: '30px' }}>
          <div
            className="bg-white dark:bg-gray-800"
            style={{
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          >
            <h3 style={{ marginTop: 0 }}>MTU and Fragmentation Scenarios</h3>

            {/* MTU Selector */}
            <div style={{ marginBottom: '20px' }}>
              <h4>Select MTU Size:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                {Object.entries(MTU_VALUES).map(([key, { size, description }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMTU(size)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: selectedMTU === size ? '#FF9800' : '#e0e0e0',
                      color: selectedMTU === size ? 'white' : '#000',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    title={description}
                  >
                    {size} bytes
                  </button>
                ))}
              </div>

              {/* Custom MTU Slider */}
              <div style={{ marginTop: '15px' }}>
                <label
                  htmlFor="mtu-slider"
                  style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
                >
                  Custom MTU:
                </label>
                <input
                  id="mtu-slider"
                  type="range"
                  min="576"
                  max="9000"
                  step="8"
                  value={selectedMTU}
                  onChange={(e) => setSelectedMTU(Number(e.target.value))}
                  style={{ width: '100%' }}
                  aria-label="Custom MTU size"
                />
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '5px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {selectedMTU} bytes
                </div>
              </div>
            </div>

            {/* Fragmentation Analysis */}
            <div
              style={{
                padding: '20px',
                backgroundColor: fragmentationInfo.needsFragmentation ? '#fff3e0' : '#e8f5e9',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: fragmentationInfo.needsFragmentation ? '#FF9800' : '#4CAF50',
              }}
            >
              <h4 style={{ marginTop: 0 }}>Fragmentation Analysis</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                }}
              >
                <div>
                  <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                    MTU Limit
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {fragmentationInfo.mtu} bytes
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                    Packet Size
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {fragmentationInfo.totalPacketSize} bytes
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                    Frame Size
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {fragmentationInfo.totalFrameSize} bytes
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400" style={{ fontSize: '12px' }}>
                    Fragmentation
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: fragmentationInfo.needsFragmentation ? '#FF9800' : '#4CAF50',
                    }}
                  >
                    {fragmentationInfo.needsFragmentation
                      ? `Yes (${fragmentationInfo.fragmentCount} fragments)`
                      : 'No'}
                  </div>
                </div>
              </div>

              {fragmentationInfo.needsFragmentation && (
                <div
                  className="bg-white dark:bg-gray-800"
                  style={{
                    marginTop: '20px',
                    padding: '15px',
                    borderRadius: '4px',
                  }}
                >
                  <strong>⚠ Fragmentation Required!</strong>
                  <p style={{ marginTop: '10px', fontSize: '14px' }}>
                    The packet size ({fragmentationInfo.totalPacketSize} bytes) exceeds the MTU (
                    {fragmentationInfo.mtu} bytes).
                    <br />
                    This will require fragmentation into {fragmentationInfo.fragmentCount}{' '}
                    fragments.
                    <br />
                    <br />
                    <strong>Exam Note:</strong> If the DF (Don&apos;t Fragment) bit is set, the
                    packet will be dropped and an ICMP Type 3 Code 4 (Fragmentation Needed and DF
                    Set) message will be sent back to the source.
                  </p>
                </div>
              )}
            </div>

            {/* MTU Common Values */}
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <h4>Common MTU Values (Exam Knowledge)</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
                {Object.entries(MTU_VALUES).map(([key, { size, description }]) => (
                  <li key={key}>
                    <strong>{size} bytes:</strong> {description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Header Details View */}
      {viewMode === 'headers' && (
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
                      <div
                        style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hex Dump View */}
      {viewMode === 'hexdump' && (
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
      )}

      {/* Scenarios View */}
      {viewMode === 'scenarios' && (
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
      )}

      {/* Inspection Panel */}
      {inspectedLayer !== null && viewMode === 'journey' && (
        <div
          className="bg-white dark:bg-gray-800"
          style={{
            marginTop: '30px',
            padding: '20px',
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
              aria-label="Close inspection panel"
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
      )}

      {/* Legend */}
      <div
        className="bg-white dark:bg-gray-800"
        style={{
          marginTop: '30px',
          padding: '15px',
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

export default PacketJourneySimulatorEnhanced;
