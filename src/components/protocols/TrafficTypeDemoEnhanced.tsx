/**
 * Component #7: Traffic Type Demo Enhancement
 * Comprehensive interactive demonstrations of network traffic types for CompTIA Network+ exam
 * Location: /ports/traffic-demo route
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';
import { Tabs } from '../ui/tabs';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  macAddress: string;
  ipAddress: string;
  active: boolean;
}

interface Packet {
  id: string;
  from: number;
  to: number;
  progress: number;
  type: 'unicast' | 'multicast' | 'broadcast' | 'anycast';
  destinationMAC: string;
}

interface MACTableEntry {
  macAddress: string;
  port: number;
  learned: number;
  state: 'learning' | 'forwarding' | 'flooding';
}

interface MulticastGroup {
  address: string;
  members: number[];
  description: string;
}

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  examTip: string;
}

// =============================================================================
// DATA CONSTANTS
// =============================================================================

const MULTICAST_GROUPS: MulticastGroup[] = [
  {
    address: '224.0.0.1',
    members: [],
    description: 'All Systems on this Subnet (IGMP)',
  },
  {
    address: '224.0.0.2',
    members: [],
    description: 'All Routers on this Subnet',
  },
  {
    address: '224.0.0.5',
    members: [],
    description: 'OSPF AllSPFRouters',
  },
  {
    address: '224.0.0.22',
    members: [],
    description: 'IGMPv3 Membership Reports',
  },
  {
    address: '239.255.255.250',
    members: [],
    description: 'SSDP (Simple Service Discovery)',
  },
];

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    question: 'Which traffic type is used when a DHCP client needs to discover a DHCP server?',
    options: ['Unicast', 'Multicast', 'Broadcast', 'Anycast'],
    correctAnswer: 2,
    explanation: 'DHCP Discovery uses broadcast (255.255.255.255) because the client doesn\'t know the server\'s address yet.',
    examTip: 'Remember: DHCP Discovery and ARP requests both use broadcast. They need to reach all devices on the local network.',
  },
  {
    id: 'q2',
    question: 'What is the IPv4 multicast address range?',
    options: ['192.168.0.0 - 192.168.255.255', '224.0.0.0 - 239.255.255.255', '240.0.0.0 - 255.255.255.254', '169.254.0.0 - 169.254.255.255'],
    correctAnswer: 1,
    explanation: 'Class D addresses (224.0.0.0 - 239.255.255.255) are reserved for multicast traffic.',
    examTip: 'Critical for the exam: 224.0.0.0/4 is the multicast range. Know that 224.0.0.0/24 is reserved for local network control.',
  },
  {
    id: 'q3',
    question: 'Why doesn\'t broadcast traffic cross routers?',
    options: [
      'Routers don\'t have enough bandwidth',
      'Broadcast is a Layer 2 function limited to the local segment',
      'It would be too expensive',
      'Broadcast packets are too large'
    ],
    correctAnswer: 1,
    explanation: 'Broadcast is a Layer 2 (Data Link) function. Routers operate at Layer 3 and do not forward broadcast frames, preventing broadcast storms across networks.',
    examTip: 'Key concept: Broadcast domain vs. collision domain. Routers separate broadcast domains; switches separate collision domains.',
  },
  {
    id: 'q4',
    question: 'In anycast routing, how is the destination determined?',
    options: [
      'First device alphabetically',
      'Device with highest IP address',
      'Nearest/closest device based on routing metrics',
      'Random selection'
    ],
    correctAnswer: 2,
    explanation: 'Anycast routes to the nearest instance of a service based on routing protocol metrics (hops, latency, etc.).',
    examTip: 'Anycast is commonly used for DNS root servers and CDNs. Same IP, multiple locations, automatic failover.',
  },
  {
    id: 'q5',
    question: 'What protocol manages multicast group membership in IPv4?',
    options: ['ICMP', 'IGMP', 'ARP', 'RARP'],
    correctAnswer: 1,
    explanation: 'IGMP (Internet Group Management Protocol) allows hosts to join and leave multicast groups and routers to discover which groups have members.',
    examTip: 'IGMP is to multicast what ARP is to unicast - it manages group membership at Layer 3.',
  },
  {
    id: 'q6',
    question: 'What happens when a switch receives a frame with an unknown destination MAC address?',
    options: [
      'Drops the frame',
      'Floods the frame out all ports except the source port',
      'Sends it to the default gateway',
      'Stores it in a queue'
    ],
    correctAnswer: 1,
    explanation: 'When the destination MAC is not in the MAC address table, the switch floods the frame out all ports (except source) to ensure it reaches the destination.',
    examTip: 'This is called "flooding" - important for understanding switch behavior and potential MAC flooding attacks.',
  },
];

const TRAFFIC_SCENARIOS = [
  {
    id: 'scenario-1',
    title: 'Web Server Request',
    description: 'Client requests a web page',
    trafficType: 'unicast' as const,
    protocol: 'HTTP/HTTPS',
    source: [0],
    destinations: [5],
    explanation: 'Direct communication between client and server uses unicast. One sender, one receiver.',
  },
  {
    id: 'scenario-2',
    title: 'IPTV Stream',
    description: 'Live TV broadcast to subscribers',
    trafficType: 'multicast' as const,
    protocol: 'RTP/UDP',
    source: [0],
    destinations: [2, 4, 6, 8],
    explanation: 'Multicast efficiently delivers one stream to multiple subscribers. Bandwidth-efficient for live media.',
  },
  {
    id: 'scenario-3',
    title: 'DNS Query',
    description: 'Resolve domain name',
    trafficType: 'anycast' as const,
    protocol: 'DNS',
    source: [0],
    destinations: [3, 7, 9],
    explanation: 'Anycast routes to nearest DNS server. Provides redundancy and improved response time.',
  },
  {
    id: 'scenario-4',
    title: 'ARP Request',
    description: 'Find MAC address for IP',
    trafficType: 'broadcast' as const,
    protocol: 'ARP',
    source: [0],
    destinations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    explanation: 'ARP broadcasts to all devices on local network to find which device owns an IP address.',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const TrafficTypeDemoEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'mac-learning' | 'broadcast-storm' | 'multicast' | 'analysis' | 'exam'>('visualizer');

  return (
    <div className="traffic-demo-enhanced">
      <div className="demo-header">
        <h1>Network Traffic Types - CompTIA Network+ Mastery</h1>
        <p className="subtitle">
          Interactive demonstrations of unicast, multicast, broadcast, and anycast traffic patterns
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'visualizer', label: 'Traffic Visualizer' },
          { id: 'mac-learning', label: 'MAC Address Learning' },
          { id: 'broadcast-storm', label: 'Broadcast Storm Simulator' },
          { id: 'multicast', label: 'Multicast Groups' },
          { id: 'analysis', label: 'Traffic Analysis' },
          { id: 'exam', label: 'Exam Practice' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      <div className="tab-content">
        {activeTab === 'visualizer' && <TrafficVisualizer />}
        {activeTab === 'mac-learning' && <MACLearningDemo />}
        {activeTab === 'broadcast-storm' && <BroadcastStormSimulator />}
        {activeTab === 'multicast' && <MulticastGroupsDemo />}
        {activeTab === 'analysis' && <TrafficAnalysisTool />}
        {activeTab === 'exam' && <ExamPractice />}
      </div>

      <style jsx>{`
        .traffic-demo-enhanced {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .demo-header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.95;
        }

        .tab-content {
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 1: TRAFFIC VISUALIZER
// =============================================================================

const TrafficVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedScenario, setSelectedScenario] = useState(TRAFFIC_SCENARIOS[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [showDetails, setShowDetails] = useState(true);
  const animationFrameRef = useRef<number>();

  // Create 10 nodes in circular layout
  const nodes: Node[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 400 + 250 * Math.cos((i * 2 * Math.PI) / 10 - Math.PI / 2),
    y: 300 + 250 * Math.sin((i * 2 * Math.PI) / 10 - Math.PI / 2),
    label: `Node ${i}`,
    macAddress: `00:1A:2B:3C:4D:${i.toString(16).toUpperCase().padStart(2, '0')}`,
    ipAddress: `192.168.1.${10 + i}`,
    active: false,
  }));

  const getTrafficColor = (type: string): string => {
    const colors: Record<string, string> = {
      unicast: '#9b59b6',
      multicast: '#e67e22',
      anycast: '#16a085',
      broadcast: '#c0392b',
    };
    return colors[type] || '#3498db';
  };

  const drawNetwork = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, 800, 600);

    // Draw connections (mesh network)
    ctx.strokeStyle = '#dfe6e9';
    ctx.lineWidth = 1;
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i < j) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(otherNode.x, otherNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      const isSource = selectedScenario.source.includes(node.id);
      const isDestination = selectedScenario.destinations.includes(node.id);

      // Node circle
      ctx.fillStyle = isSource ? '#e74c3c' : isDestination ? '#2ecc71' : '#3498db';
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fill();

      // Node border
      ctx.strokeStyle = isSource || isDestination ? '#f39c12' : '#34495e';
      ctx.lineWidth = isSource || isDestination ? 3 : 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.x, node.y);

      // Role label
      if (isSource || isDestination) {
        ctx.fillStyle = '#2c3e50';
        ctx.font = '11px Arial';
        ctx.fillText(isSource ? 'SOURCE' : 'DEST', node.x, node.y + 40);
      }
    });

    // Draw packets
    packets.forEach((packet) => {
      const fromNode = nodes[packet.from];
      const toNode = nodes[packet.to];
      const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
      const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

      // Packet circle
      ctx.fillStyle = getTrafficColor(packet.type);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Packet glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
      gradient.addColorStop(0, getTrafficColor(packet.type) + '80');
      gradient.addColorStop(1, getTrafficColor(packet.type) + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [nodes, selectedScenario, packets]);

  const animateTraffic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawNetwork(ctx);

    // Update packet positions
    const updatedPackets = packets
      .map((p) => ({ ...p, progress: p.progress + 0.015 }))
      .filter((p) => p.progress <= 1);

    setPackets(updatedPackets);

    if (updatedPackets.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateTraffic);
    } else {
      setIsAnimating(false);
    }
  }, [packets, drawNetwork]);

  useEffect(() => {
    if (isAnimating) {
      animateTraffic();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animateTraffic]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawNetwork(ctx);
    }
  }, [drawNetwork]);

  const startAnimation = () => {
    const newPackets: Packet[] = selectedScenario.source.flatMap((source) =>
      selectedScenario.destinations.map((dest) => ({
        id: `${source}-${dest}-${Date.now()}-${Math.random()}`,
        from: source,
        to: dest,
        progress: 0,
        type: selectedScenario.trafficType,
        destinationMAC: nodes[dest].macAddress,
      }))
    );

    setPackets(newPackets);
    setIsAnimating(true);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setPackets([]);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="traffic-visualizer">
      <Card>
        <div className="visualizer-content">
          <div className="scenario-selector">
            <h3>Select Scenario:</h3>
            <div className="scenario-grid">
              {TRAFFIC_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    stopAnimation();
                  }}
                  className={`scenario-btn ${selectedScenario.id === scenario.id ? 'active' : ''}`}
                  style={{
                    borderColor: getTrafficColor(scenario.trafficType),
                  }}
                >
                  <div className="scenario-title">{scenario.title}</div>
                  <div className="scenario-type">{scenario.trafficType.toUpperCase()}</div>
                  <div className="scenario-protocol">{scenario.protocol}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="canvas-container">
            <canvas ref={canvasRef} width={800} height={600} className="network-canvas" />

            <div className="animation-controls">
              <Button onClick={startAnimation} disabled={isAnimating} variant="primary">
                Start Animation
              </Button>
              <Button onClick={stopAnimation} disabled={!isAnimating} variant="secondary">
                Stop
              </Button>
            </div>

            <div className="legend">
              <div className="legend-item">
                <span className="legend-dot source"></span>
                <span>Source</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot destination"></span>
                <span>Destination</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot normal"></span>
                <span>Normal Node</span>
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="scenario-details">
              <h3>{selectedScenario.title}</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <strong>Traffic Type:</strong>
                  <span
                    className="traffic-badge"
                    style={{ backgroundColor: getTrafficColor(selectedScenario.trafficType) }}
                  >
                    {selectedScenario.trafficType.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Protocol:</strong>
                  <span>{selectedScenario.protocol}</span>
                </div>
                <div className="detail-item">
                  <strong>Description:</strong>
                  <span>{selectedScenario.description}</span>
                </div>
              </div>
              <div className="explanation">
                <strong>Explanation:</strong>
                <p>{selectedScenario.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <style jsx>{`
        .traffic-visualizer {
          padding: 20px;
        }

        .visualizer-content {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .scenario-selector h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .scenario-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .scenario-btn {
          padding: 20px;
          background: white;
          border: 3px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .scenario-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .scenario-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .scenario-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .scenario-type {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 5px;
        }

        .scenario-protocol {
          font-size: 12px;
          opacity: 0.8;
        }

        .canvas-container {
          text-align: center;
        }

        .network-canvas {
          border: 2px solid #ecf0f1;
          border-radius: 12px;
          background: #f8f9fa;
          max-width: 100%;
        }

        .animation-controls {
          margin: 20px 0;
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          padding: 15px;
          background: #ecf0f1;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .legend-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #2c3e50;
        }

        .legend-dot.source {
          background: #e74c3c;
        }

        .legend-dot.destination {
          background: #2ecc71;
        }

        .legend-dot.normal {
          background: #3498db;
        }

        .scenario-details {
          padding: 25px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 5px solid #667eea;
        }

        .scenario-details h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-item strong {
          color: #2c3e50;
          font-size: 14px;
        }

        .traffic-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 12px;
        }

        .explanation {
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }

        .explanation strong {
          color: #2c3e50;
          display: block;
          margin-bottom: 10px;
        }

        .explanation p {
          color: #34495e;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 2: MAC ADDRESS LEARNING DEMO
// =============================================================================

const MACLearningDemo: React.FC = () => {
  const [macTable, setMacTable] = useState<MACTableEntry[]>([]);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [stepNumber, setStepNumber] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);

  const simulateFrameArrival = (sourceMac: string, destMac: string, sourcePort: number) => {
    setStepNumber((prev) => prev + 1);

    // Step 1: Learn source MAC
    const existingEntry = macTable.find((entry) => entry.macAddress === sourceMac);
    if (!existingEntry) {
      setMacTable((prev) => [
        ...prev,
        {
          macAddress: sourceMac,
          port: sourcePort,
          learned: Date.now(),
          state: 'learning',
        },
      ]);
      setCurrentAction(`✓ Learned ${sourceMac} on port ${sourcePort}`);
      setTimeout(() => {
        setMacTable((prev) =>
          prev.map((entry) =>
            entry.macAddress === sourceMac ? { ...entry, state: 'forwarding' } : entry
          )
        );
      }, 1000);
    } else {
      setCurrentAction(`✓ ${sourceMac} already in table on port ${existingEntry.port}`);
    }

    // Step 2: Forward or flood based on destination MAC
    setTimeout(() => {
      const destEntry = macTable.find((entry) => entry.macAddress === destMac);
      if (destEntry) {
        setCurrentAction(`→ Forwarding to port ${destEntry.port} (${destMac} known)`);
      } else if (destMac === 'FF:FF:FF:FF:FF:FF') {
        setCurrentAction(`→ Broadcasting to all ports (broadcast address)`);
      } else {
        setCurrentAction(`→ Flooding to all ports (${destMac} unknown)`);
        setMacTable((prev) => [
          ...prev,
          {
            macAddress: destMac,
            port: Math.floor(Math.random() * 8) + 1,
            learned: Date.now(),
            state: 'flooding',
          },
        ]);
      }
    }, 1500);
  };

  const scenarios = [
    {
      title: 'PC A sends to PC B (first time)',
      sourceMac: '00:1A:2B:3C:4D:01',
      destMac: '00:1A:2B:3C:4D:02',
      sourcePort: 1,
      description: 'Switch learns PC A on port 1, floods frame because PC B unknown',
    },
    {
      title: 'PC B replies to PC A',
      sourceMac: '00:1A:2B:3C:4D:02',
      destMac: '00:1A:2B:3C:4D:01',
      sourcePort: 2,
      description: 'Switch learns PC B on port 2, forwards to PC A on port 1 (already learned)',
    },
    {
      title: 'PC C sends broadcast',
      sourceMac: '00:1A:2B:3C:4D:03',
      destMac: 'FF:FF:FF:FF:FF:FF',
      sourcePort: 3,
      description: 'Switch learns PC C, broadcasts to all ports (broadcast address)',
    },
  ];

  const clearTable = () => {
    setMacTable([]);
    setCurrentAction('MAC table cleared');
    setStepNumber(0);
  };

  return (
    <div className="mac-learning-demo">
      <Card>
        <h2>MAC Address Learning Simulator</h2>
        <p className="description">
          Watch how switches build their MAC address tables and make forwarding decisions
        </p>

        <Alert variant="info">
          <strong>How it works:</strong> When a frame arrives, the switch:
          <ol>
            <li>Records the source MAC address and input port (learning)</li>
            <li>Checks if destination MAC is in the table</li>
            <li>Forwards to specific port if known, or floods to all ports if unknown</li>
          </ol>
        </Alert>

        <div className="demo-section">
          <h3>Simulate Frame Arrivals:</h3>
          <div className="scenario-buttons">
            {scenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() =>
                  simulateFrameArrival(scenario.sourceMac, scenario.destMac, scenario.sourcePort)
                }
                className="scenario-button"
              >
                <div className="scenario-number">Scenario {idx + 1}</div>
                <div className="scenario-title-text">{scenario.title}</div>
                <div className="scenario-desc">{scenario.description}</div>
              </button>
            ))}
          </div>
          <Button onClick={clearTable} variant="secondary" style={{ marginTop: '15px' }}>
            Clear MAC Table
          </Button>
        </div>

        <div className="action-display">
          <h3>Current Action (Step {stepNumber}):</h3>
          <div className="action-message">{currentAction || 'Click a scenario to start'}</div>
        </div>

        <div className="mac-table-display">
          <h3>MAC Address Table (CAM Table):</h3>
          {macTable.length === 0 ? (
            <p className="empty-table">Table is empty. Send frames to populate.</p>
          ) : (
            <table className="mac-table">
              <thead>
                <tr>
                  <th>MAC Address</th>
                  <th>Port</th>
                  <th>State</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {macTable.map((entry, idx) => (
                  <tr key={idx} className={entry.state}>
                    <td className="mac-address">{entry.macAddress}</td>
                    <td>Port {entry.port}</td>
                    <td>
                      <span className={`state-badge ${entry.state}`}>
                        {entry.state.toUpperCase()}
                      </span>
                    </td>
                    <td>{Math.floor((Date.now() - entry.learned) / 1000)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showExplanation && (
          <div className="exam-tips">
            <h3>CompTIA Network+ Exam Tips:</h3>
            <ul>
              <li>
                <strong>Learning:</strong> Switch records source MAC + port for all incoming frames
              </li>
              <li>
                <strong>Forwarding:</strong> If destination MAC is known, send only to that port
              </li>
              <li>
                <strong>Flooding:</strong> If destination MAC unknown, send to all ports except
                source
              </li>
              <li>
                <strong>Broadcast:</strong> FF:FF:FF:FF:FF:FF always floods to all ports
              </li>
              <li>
                <strong>Aging:</strong> Entries expire after 300 seconds (5 minutes) by default
              </li>
              <li>
                <strong>Security:</strong> MAC flooding attacks overflow the table, causing switch
                to act like a hub
              </li>
            </ul>
          </div>
        )}
      </Card>

      <style jsx>{`
        .mac-learning-demo {
          padding: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .description {
          color: #7f8c8d;
          margin-bottom: 25px;
        }

        .demo-section {
          margin: 30px 0;
        }

        .demo-section h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .scenario-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .scenario-button {
          padding: 20px;
          background: white;
          border: 2px solid #3498db;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .scenario-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
          border-color: #2980b9;
        }

        .scenario-number {
          font-size: 12px;
          color: #3498db;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .scenario-title-text {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .scenario-desc {
          font-size: 13px;
          color: #7f8c8d;
          line-height: 1.4;
        }

        .action-display {
          margin: 30px 0;
          padding: 20px;
          background: #e8f5e9;
          border-radius: 10px;
          border-left: 5px solid #27ae60;
        }

        .action-display h3 {
          color: #27ae60;
          margin-bottom: 10px;
        }

        .action-message {
          font-size: 16px;
          color: #2c3e50;
          font-weight: 500;
          font-family: 'Courier New', monospace;
        }

        .mac-table-display {
          margin: 30px 0;
        }

        .mac-table-display h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .empty-table {
          padding: 40px;
          text-align: center;
          color: #95a5a6;
          font-style: italic;
          background: #ecf0f1;
          border-radius: 8px;
        }

        .mac-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .mac-table th {
          background: #34495e;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .mac-table td {
          padding: 12px;
          border-bottom: 1px solid #ecf0f1;
        }

        .mac-table tbody tr:hover {
          background: #f8f9fa;
        }

        .mac-table tbody tr.learning {
          background: #fff3cd;
        }

        .mac-table tbody tr.forwarding {
          background: #d4edda;
        }

        .mac-table tbody tr.flooding {
          background: #f8d7da;
        }

        .mac-address {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #2c3e50;
        }

        .state-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
        }

        .state-badge.learning {
          background: #ffc107;
          color: #000;
        }

        .state-badge.forwarding {
          background: #28a745;
          color: white;
        }

        .state-badge.flooding {
          background: #dc3545;
          color: white;
        }

        .exam-tips {
          margin-top: 30px;
          padding: 25px;
          background: #fff3cd;
          border-radius: 10px;
          border-left: 5px solid #ffc107;
        }

        .exam-tips h3 {
          color: #856404;
          margin-bottom: 15px;
        }

        .exam-tips ul {
          list-style-position: inside;
          color: #856404;
          line-height: 2;
        }

        .exam-tips strong {
          color: #000;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 3: BROADCAST STORM SIMULATOR
// =============================================================================

const BroadcastStormSimulator: React.FC = () => {
  const [hasLoop, setHasLoop] = useState(false);
  const [stpEnabled, setStpEnabled] = useState(false);
  const [stormActive, setStormActive] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startStorm = () => {
    if (!hasLoop) {
      alert('Enable "Network Loop" first to simulate a broadcast storm!');
      return;
    }

    if (stpEnabled) {
      alert('STP is enabled and will block the loop. Disable STP to see the storm effect.');
      return;
    }

    setStormActive(true);
    setPacketCount(0);
    setCpuUsage(0);

    let count = 0;
    intervalRef.current = setInterval(() => {
      count += Math.floor(Math.random() * 1000) + 500;
      const cpu = Math.min(100, count / 100);
      setPacketCount(count);
      setCpuUsage(cpu);

      if (cpu >= 100) {
        stopStorm();
        alert('Network collapsed! CPU usage reached 100%. This is a broadcast storm.');
      }
    }, 100);
  };

  const stopStorm = () => {
    setStormActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const enableSTP = () => {
    setStpEnabled(true);
    stopStorm();
    setPacketCount(0);
    setCpuUsage(0);
  };

  return (
    <div className="broadcast-storm-sim">
      <Card>
        <h2>Broadcast Storm Simulator</h2>
        <p className="description">
          Understand how network loops cause broadcast storms and how STP prevents them
        </p>

        <Alert variant="warning">
          <strong>Warning:</strong> Broadcast storms can bring down entire networks. Spanning Tree
          Protocol (STP) is essential for preventing loops in redundant network topologies.
        </Alert>

        <div className="network-diagram">
          <div className="diagram-title">Network Topology</div>
          <div className="topology-visual">
            <div className="switch">Switch A</div>
            <div className={`connection ${hasLoop ? 'loop-active' : ''}`}>
              {stpEnabled && hasLoop && <span className="stp-block">STP BLOCKED</span>}
            </div>
            <div className="switch">Switch B</div>
            <div className="connection"></div>
            <div className="switch">Switch C</div>
            {hasLoop && (
              <>
                <div className={`redundant-link ${stpEnabled ? 'blocked' : 'active'}`}>
                  Redundant Link {stpEnabled ? '(Blocked by STP)' : '(LOOP!)'}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="controls">
          <h3>Simulation Controls:</h3>
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={hasLoop}
                onChange={(e) => {
                  setHasLoop(e.target.checked);
                  stopStorm();
                }}
              />
              Enable Network Loop (Redundant Connection)
            </label>
          </div>
          <div className="control-row">
            <label>
              <input
                type="checkbox"
                checked={stpEnabled}
                onChange={(e) => {
                  if (e.target.checked) {
                    enableSTP();
                  } else {
                    setStpEnabled(false);
                  }
                }}
                disabled={!hasLoop}
              />
              Enable Spanning Tree Protocol (STP)
            </label>
          </div>
          <div className="button-row">
            <Button
              onClick={startStorm}
              disabled={stormActive || !hasLoop || stpEnabled}
              variant="danger"
            >
              {stormActive ? 'Storm Running...' : 'Start Broadcast Storm'}
            </Button>
            <Button onClick={stopStorm} disabled={!stormActive} variant="secondary">
              Stop Storm
            </Button>
          </div>
        </div>

        <div className="metrics">
          <h3>Network Performance Metrics:</h3>
          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-label">Broadcast Packets/sec</div>
              <div className={`metric-value ${packetCount > 10000 ? 'danger' : ''}`}>
                {packetCount.toLocaleString()}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">CPU Usage</div>
              <div className={`metric-value ${cpuUsage > 80 ? 'danger' : ''}`}>
                {cpuUsage.toFixed(1)}%
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${cpuUsage}%`,
                    backgroundColor: cpuUsage > 80 ? '#e74c3c' : '#3498db',
                  }}
                ></div>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Network Status</div>
              <div
                className="metric-value"
                style={{
                  color: stormActive
                    ? '#e74c3c'
                    : stpEnabled && hasLoop
                      ? '#27ae60'
                      : '#3498db',
                }}
              >
                {stormActive
                  ? 'STORM DETECTED!'
                  : stpEnabled && hasLoop
                    ? 'Protected by STP'
                    : 'Normal'}
              </div>
            </div>
          </div>
        </div>

        <div className="explanation-section">
          <h3>How Broadcast Storms Occur:</h3>
          <ol>
            <li>
              <strong>Redundant Links Create Loop:</strong> Two or more paths exist between
              switches
            </li>
            <li>
              <strong>Broadcast Frame Enters Loop:</strong> A broadcast frame (ARP, DHCP) is sent
              on the network
            </li>
            <li>
              <strong>Infinite Forwarding:</strong> Switches forward broadcasts out all ports,
              including redundant paths
            </li>
            <li>
              <strong>Exponential Growth:</strong> Each copy creates more copies, multiplying
              rapidly
            </li>
            <li>
              <strong>Network Collapse:</strong> CPU and bandwidth saturate, network becomes
              unusable
            </li>
          </ol>

          <h3>Spanning Tree Protocol (STP) Solution:</h3>
          <ul>
            <li>
              <strong>Loop Detection:</strong> STP detects all physical loops in the network
              topology
            </li>
            <li>
              <strong>Port Blocking:</strong> Automatically blocks redundant ports to create a
              loop-free logical topology
            </li>
            <li>
              <strong>Automatic Failover:</strong> If primary path fails, blocked port activates
              (convergence)
            </li>
            <li>
              <strong>BPDU Packets:</strong> Switches exchange Bridge Protocol Data Units to
              coordinate
            </li>
            <li>
              <strong>Root Bridge Election:</strong> One switch becomes the root, others calculate
              best paths
            </li>
          </ul>

          <Alert variant="info">
            <strong>Exam Tip:</strong> Know the STP port states: Blocking → Listening → Learning →
            Forwarding. Also be familiar with RSTP (Rapid STP) which converges faster than original
            STP.
          </Alert>
        </div>
      </Card>

      <style jsx>{`
        .broadcast-storm-sim {
          padding: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .description {
          color: #7f8c8d;
          margin-bottom: 25px;
        }

        .network-diagram {
          margin: 30px 0;
          padding: 30px;
          background: #ecf0f1;
          border-radius: 12px;
        }

        .diagram-title {
          text-align: center;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .topology-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .switch {
          padding: 20px 40px;
          background: #3498db;
          color: white;
          border-radius: 10px;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .connection {
          width: 4px;
          height: 40px;
          background: #34495e;
        }

        .connection.loop-active {
          background: #e74c3c;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stp-block {
          background: #27ae60;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          font-weight: bold;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .redundant-link {
          position: absolute;
          top: 50%;
          right: -150px;
          padding: 15px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 14px;
        }

        .redundant-link.active {
          background: #e74c3c;
          color: white;
          animation: flash 0.5s infinite;
        }

        .redundant-link.blocked {
          background: #27ae60;
          color: white;
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .controls {
          margin: 30px 0;
        }

        .controls h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .control-row {
          margin: 15px 0;
        }

        .control-row label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          cursor: pointer;
        }

        .control-row input[type='checkbox'] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .button-row {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .metrics {
          margin: 30px 0;
        }

        .metrics h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .metric-card {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .metric-label {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 10px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .metric-value.danger {
          color: #e74c3c;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .progress-bar {
          width: 100%;
          height: 10px;
          background: #ecf0f1;
          border-radius: 5px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s, background-color 0.3s;
          border-radius: 5px;
        }

        .explanation-section {
          margin-top: 30px;
          padding: 25px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .explanation-section h3 {
          color: #2c3e50;
          margin: 20px 0 15px 0;
        }

        .explanation-section ol, .explanation-section ul {
          line-height: 1.8;
          color: #34495e;
        }

        .explanation-section strong {
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 4: MULTICAST GROUPS DEMO
// =============================================================================

const MulticastGroupsDemo: React.FC = () => {
  const [groups, setGroups] = useState<MulticastGroup[]>(MULTICAST_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<MulticastGroup | null>(null);
  const [availableNodes] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const toggleNodeMembership = (groupAddress: string, nodeId: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.address === groupAddress) {
          const isMember = group.members.includes(nodeId);
          return {
            ...group,
            members: isMember
              ? group.members.filter((id) => id !== nodeId)
              : [...group.members, nodeId],
          };
        }
        return group;
      })
    );
  };

  const sendMulticast = (group: MulticastGroup) => {
    if (group.members.length === 0) {
      alert(`No members have joined group ${group.address} yet!`);
      return;
    }
    alert(
      `Multicast sent to ${group.members.length} member(s) in group ${group.address}:\nNodes: ${group.members.join(', ')}\n\nOnly subscribed members receive the traffic!`
    );
  };

  return (
    <div className="multicast-demo">
      <Card>
        <h2>Multicast Groups Interactive Demo</h2>
        <p className="description">
          Learn about IGMP and how devices join multicast groups to receive group traffic
        </p>

        <Alert variant="info">
          <strong>Key Concept:</strong> Multicast uses Class D IP addresses (224.0.0.0 -
          239.255.255.255). Devices use IGMP (Internet Group Management Protocol) to join/leave
          groups. Only group members receive the multicast traffic.
        </Alert>

        <div className="groups-section">
          <h3>Available Multicast Groups:</h3>
          <div className="groups-grid">
            {groups.map((group) => (
              <div
                key={group.address}
                className={`group-card ${selectedGroup?.address === group.address ? 'selected' : ''}`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="group-address">{group.address}</div>
                <div className="group-description">{group.description}</div>
                <div className="group-members">
                  {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    sendMulticast(group);
                  }}
                  variant="primary"
                  disabled={group.members.length === 0}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  Send Multicast
                </Button>
              </div>
            ))}
          </div>
        </div>

        {selectedGroup && (
          <div className="group-management">
            <h3>Manage Group: {selectedGroup.address}</h3>
            <p>{selectedGroup.description}</p>

            <div className="node-grid">
              {availableNodes.map((nodeId) => {
                const isMember = selectedGroup.members.includes(nodeId);
                return (
                  <button
                    key={nodeId}
                    onClick={() => toggleNodeMembership(selectedGroup.address, nodeId)}
                    className={`node-button ${isMember ? 'member' : 'non-member'}`}
                  >
                    <div className="node-id">Node {nodeId}</div>
                    <div className="node-status">
                      {isMember ? '✓ Subscribed' : '+ Join Group'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="current-members">
              <strong>Current Members:</strong>{' '}
              {selectedGroup.members.length > 0
                ? selectedGroup.members.map((id) => `Node ${id}`).join(', ')
                : 'None'}
            </div>
          </div>
        )}

        <div className="multicast-explanation">
          <h3>IGMP Protocol Basics:</h3>
          <div className="explanation-grid">
            <div className="explanation-card">
              <h4>IGMP Membership Query</h4>
              <p>
                Routers periodically send queries to discover which groups have active members on
                each network segment.
              </p>
            </div>
            <div className="explanation-card">
              <h4>IGMP Membership Report</h4>
              <p>
                Hosts send reports when joining a group or responding to queries. Informs routers of
                group membership.
              </p>
            </div>
            <div className="explanation-card">
              <h4>IGMP Leave Group</h4>
              <p>
                In IGMPv2+, hosts send leave messages when exiting a group. Allows faster
                convergence.
              </p>
            </div>
          </div>

          <Alert variant="warning">
            <strong>Exam Tips:</strong>
            <ul>
              <li>224.0.0.0/24 - Reserved for local network control traffic (don't route)</li>
              <li>224.0.1.0 - 238.255.255.255 - Globally scoped multicast addresses</li>
              <li>239.0.0.0/8 - Administratively scoped (private/organization multicast)</li>
              <li>IGMP operates at Layer 3 (Network layer)</li>
              <li>
                Common uses: IPTV, stock tickers, video conferencing, routing protocols (OSPF, EIGRP)
              </li>
            </ul>
          </Alert>
        </div>
      </Card>

      <style jsx>{`
        .multicast-demo {
          padding: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .description {
          color: #7f8c8d;
          margin-bottom: 25px;
        }

        .groups-section {
          margin: 30px 0;
        }

        .groups-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .group-card {
          padding: 20px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .group-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .group-card.selected {
          border-color: #e67e22;
          background: #fef5e7;
        }

        .group-address {
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 18px;
          color: #e67e22;
          margin-bottom: 10px;
        }

        .group-description {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 10px;
          min-height: 40px;
        }

        .group-members {
          font-size: 13px;
          color: #27ae60;
          font-weight: 600;
        }

        .group-management {
          margin: 30px 0;
          padding: 25px;
          background: #fef5e7;
          border-radius: 12px;
          border-left: 5px solid #e67e22;
        }

        .group-management h3 {
          color: #d35400;
          margin-bottom: 10px;
        }

        .group-management p {
          color: #7f8c8d;
          margin-bottom: 20px;
        }

        .node-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .node-button {
          padding: 15px 10px;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .node-button:hover {
          transform: scale(1.05);
        }

        .node-button.member {
          background: #d4edda;
          border-color: #28a745;
        }

        .node-button.non-member {
          background: #f8f9fa;
          border-color: #dee2e6;
        }

        .node-id {
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }

        .node-status {
          font-size: 12px;
          color: #7f8c8d;
        }

        .node-button.member .node-status {
          color: #28a745;
          font-weight: 600;
        }

        .current-members {
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          color: #2c3e50;
        }

        .multicast-explanation {
          margin-top: 30px;
        }

        .multicast-explanation h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .explanation-card {
          padding: 20px;
          background: white;
          border-radius: 10px;
          border-left: 4px solid #e67e22;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .explanation-card h4 {
          color: #e67e22;
          margin-bottom: 10px;
          font-size: 16px;
        }

        .explanation-card p {
          color: #34495e;
          line-height: 1.6;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 5: TRAFFIC ANALYSIS TOOL
// =============================================================================

const TrafficAnalysisTool: React.FC = () => {
  const [selectedPacket, setSelectedPacket] = useState<number | null>(null);

  const packetCaptures = [
    {
      id: 1,
      timestamp: '12:34:56.123',
      source: '192.168.1.10',
      destination: '192.168.1.50',
      protocol: 'TCP',
      info: 'HTTP GET /index.html',
      type: 'Unicast',
      destMac: '00:1A:2B:3C:4D:50',
      explanation: 'Standard unicast TCP traffic. One sender, one specific receiver.',
    },
    {
      id: 2,
      timestamp: '12:34:57.456',
      source: '192.168.1.15',
      destination: '224.0.0.251',
      protocol: 'UDP',
      info: 'mDNS Service Discovery',
      type: 'Multicast',
      destMac: '01:00:5E:00:00:FB',
      explanation:
        'Multicast to 224.0.0.251 (mDNS). MAC starts with 01:00:5E for IPv4 multicast.',
    },
    {
      id: 3,
      timestamp: '12:34:58.789',
      source: '192.168.1.20',
      destination: '192.168.1.255',
      protocol: 'UDP',
      info: 'DHCP Discover',
      type: 'Broadcast',
      destMac: 'FF:FF:FF:FF:FF:FF',
      explanation:
        'Broadcast to find DHCP server. Destination IP is subnet broadcast (255), MAC is all-Fs.',
    },
    {
      id: 4,
      timestamp: '12:34:59.012',
      source: '10.0.0.5',
      destination: '8.8.8.8',
      protocol: 'UDP',
      info: 'DNS Query for example.com',
      type: 'Anycast',
      destMac: '00:1A:2B:3C:4D:AA',
      explanation:
        '8.8.8.8 is an anycast address. Routed to nearest Google DNS server instance.',
    },
    {
      id: 5,
      timestamp: '12:35:00.345',
      source: '192.168.1.30',
      destination: '239.192.0.1',
      protocol: 'UDP',
      info: 'IPTV Stream Data',
      type: 'Multicast',
      destMac: '01:00:5E:40:00:01',
      explanation:
        'Organization-scoped multicast (239.x.x.x). Used for private multicast applications.',
    },
    {
      id: 6,
      timestamp: '12:35:01.678',
      source: '192.168.1.40',
      destination: '192.168.1.1',
      protocol: 'ICMP',
      info: 'Echo Request (ping)',
      type: 'Unicast',
      destMac: '00:1A:2B:3C:4D:01',
      explanation: 'ICMP ping to default gateway. Direct unicast communication.',
    },
  ];

  const analyzeAddress = (packet: typeof packetCaptures[0]) => {
    const parts: string[] = [];

    // Analyze destination IP
    const destOctets = packet.destination.split('.').map(Number);
    if (packet.destination === '255.255.255.255') {
      parts.push('Limited broadcast address - sends to all devices on local network');
    } else if (destOctets[3] === 255) {
      parts.push('Subnet directed broadcast - sends to all devices in subnet');
    } else if (destOctets[0] >= 224 && destOctets[0] <= 239) {
      parts.push(`Class D multicast address (${destOctets[0]}.x.x.x range)`);
      if (destOctets[0] === 224 && destOctets[1] === 0 && destOctets[2] === 0) {
        parts.push('Reserved for local network control (don\'t route beyond subnet)');
      } else if (destOctets[0] === 239) {
        parts.push('Administratively scoped (organization/private multicast)');
      }
    }

    // Analyze MAC address
    if (packet.destMac === 'FF:FF:FF:FF:FF:FF') {
      parts.push('Broadcast MAC address - all devices process this frame');
    } else if (packet.destMac.startsWith('01:00:5E')) {
      parts.push('IPv4 multicast MAC (starts with 01:00:5E) - mapped from multicast IP');
    } else {
      parts.push('Unicast MAC address - specific network interface');
    }

    return parts;
  };

  return (
    <div className="traffic-analysis">
      <Card>
        <h2>Traffic Analysis Tool</h2>
        <p className="description">
          Analyze packet captures to identify traffic types from headers and addresses
        </p>

        <Alert variant="info">
          <strong>Exam Skill:</strong> Being able to identify traffic types from packet captures is
          critical for the CompTIA Network+ exam. Focus on destination IP and MAC addresses.
        </Alert>

        <div className="packet-table-container">
          <h3>Simulated Packet Capture:</h3>
          <table className="packet-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Info</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {packetCaptures.map((packet) => (
                <tr
                  key={packet.id}
                  onClick={() => setSelectedPacket(packet.id)}
                  className={selectedPacket === packet.id ? 'selected' : ''}
                >
                  <td className="timestamp">{packet.timestamp}</td>
                  <td className="ip-address">{packet.source}</td>
                  <td className="ip-address">{packet.destination}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.info}</td>
                  <td>
                    <span className={`type-badge ${packet.type.toLowerCase()}`}>
                      {packet.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedPacket && (
          <div className="packet-details">
            {(() => {
              const packet = packetCaptures.find((p) => p.id === selectedPacket)!;
              const analysis = analyzeAddress(packet);
              return (
                <>
                  <h3>Packet Analysis (#{packet.id}):</h3>
                  <div className="details-grid">
                    <div className="detail-section">
                      <h4>Packet Information:</h4>
                      <dl>
                        <dt>Timestamp:</dt>
                        <dd>{packet.timestamp}</dd>
                        <dt>Source IP:</dt>
                        <dd className="mono">{packet.source}</dd>
                        <dt>Destination IP:</dt>
                        <dd className="mono">{packet.destination}</dd>
                        <dt>Destination MAC:</dt>
                        <dd className="mono">{packet.destMac}</dd>
                        <dt>Protocol:</dt>
                        <dd>{packet.protocol}</dd>
                        <dt>Traffic Type:</dt>
                        <dd>
                          <span className={`type-badge ${packet.type.toLowerCase()}`}>
                            {packet.type}
                          </span>
                        </dd>
                      </dl>
                    </div>
                    <div className="detail-section">
                      <h4>Traffic Analysis:</h4>
                      <ul className="analysis-list">
                        {analysis.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                      <div className="explanation-box">
                        <strong>Explanation:</strong>
                        <p>{packet.explanation}</p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="address-reference">
          <h3>Quick Reference - Identifying Traffic Types:</h3>
          <div className="reference-grid">
            <div className="reference-card">
              <h4>Unicast</h4>
              <ul>
                <li>
                  <strong>IP:</strong> Standard host address (not broadcast/multicast)
                </li>
                <li>
                  <strong>MAC:</strong> Specific device MAC address
                </li>
                <li>
                  <strong>Example:</strong> 192.168.1.10 → 192.168.1.50
                </li>
              </ul>
            </div>
            <div className="reference-card">
              <h4>Broadcast</h4>
              <ul>
                <li>
                  <strong>IP:</strong> 255.255.255.255 or x.x.x.255 (subnet broadcast)
                </li>
                <li>
                  <strong>MAC:</strong> FF:FF:FF:FF:FF:FF
                </li>
                <li>
                  <strong>Example:</strong> DHCP Discover, ARP requests
                </li>
              </ul>
            </div>
            <div className="reference-card">
              <h4>Multicast</h4>
              <ul>
                <li>
                  <strong>IP:</strong> 224.0.0.0 - 239.255.255.255 (Class D)
                </li>
                <li>
                  <strong>MAC:</strong> 01:00:5E:xx:xx:xx (IPv4 multicast)
                </li>
                <li>
                  <strong>Example:</strong> IPTV, OSPF routing, mDNS
                </li>
              </ul>
            </div>
            <div className="reference-card">
              <h4>Anycast</h4>
              <ul>
                <li>
                  <strong>IP:</strong> Same as unicast (determined by routing)
                </li>
                <li>
                  <strong>Behavior:</strong> Routes to nearest instance
                </li>
                <li>
                  <strong>Example:</strong> DNS root servers (8.8.8.8)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        .traffic-analysis {
          padding: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .description {
          color: #7f8c8d;
          margin-bottom: 25px;
        }

        .packet-table-container {
          margin: 30px 0;
        }

        .packet-table-container h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .packet-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .packet-table th {
          background: #34495e;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }

        .packet-table td {
          padding: 12px;
          border-bottom: 1px solid #ecf0f1;
          font-size: 13px;
        }

        .packet-table tbody tr {
          cursor: pointer;
          transition: background 0.2s;
        }

        .packet-table tbody tr:hover {
          background: #f8f9fa;
        }

        .packet-table tbody tr.selected {
          background: #d6eaf8;
        }

        .timestamp {
          font-family: 'Courier New', monospace;
          color: #7f8c8d;
          font-size: 12px;
        }

        .ip-address {
          font-family: 'Courier New', monospace;
          color: #2c3e50;
          font-weight: 500;
        }

        .type-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          color: white;
        }

        .type-badge.unicast {
          background: #9b59b6;
        }

        .type-badge.multicast {
          background: #e67e22;
        }

        .type-badge.broadcast {
          background: #c0392b;
        }

        .type-badge.anycast {
          background: #16a085;
        }

        .packet-details {
          margin-top: 30px;
          padding: 25px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 5px solid #3498db;
        }

        .packet-details h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-section h4 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .detail-section dl {
          background: white;
          padding: 15px;
          border-radius: 8px;
        }

        .detail-section dt {
          color: #7f8c8d;
          font-size: 13px;
          margin-top: 10px;
        }

        .detail-section dd {
          color: #2c3e50;
          font-weight: 500;
          margin-left: 0;
          margin-bottom: 5px;
        }

        .mono {
          font-family: 'Courier New', monospace;
        }

        .analysis-list {
          background: white;
          padding: 20px;
          border-radius: 8px;
          line-height: 1.8;
          color: #34495e;
        }

        .analysis-list li {
          margin-bottom: 10px;
        }

        .explanation-box {
          margin-top: 15px;
          padding: 15px;
          background: #d1f2eb;
          border-radius: 8px;
          border-left: 4px solid #1abc9c;
        }

        .explanation-box strong {
          color: #117a65;
          display: block;
          margin-bottom: 8px;
        }

        .explanation-box p {
          color: #145a4f;
          line-height: 1.6;
          margin: 0;
        }

        .address-reference {
          margin-top: 30px;
        }

        .address-reference h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .reference-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .reference-card {
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .reference-card h4 {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #ecf0f1;
        }

        .reference-card:nth-child(1) h4 {
          color: #9b59b6;
        }

        .reference-card:nth-child(2) h4 {
          color: #c0392b;
        }

        .reference-card:nth-child(3) h4 {
          color: #e67e22;
        }

        .reference-card:nth-child(4) h4 {
          color: #16a085;
        }

        .reference-card ul {
          list-style: none;
          padding: 0;
        }

        .reference-card li {
          padding: 8px 0;
          color: #34495e;
          line-height: 1.5;
          font-size: 14px;
        }

        .reference-card strong {
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// TAB 6: EXAM PRACTICE
// =============================================================================

const ExamPractice: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const question = EXAM_QUESTIONS[currentQuestion];

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowExplanation(true);
    if (selectedAnswer === question.correctAnswer && !answeredQuestions.has(currentQuestion)) {
      setScore((prev) => prev + 1);
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < EXAM_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  return (
    <div className="exam-practice">
      <Card>
        <h2>CompTIA Network+ Exam Practice</h2>
        <p className="description">Test your knowledge of network traffic types</p>

        <div className="progress-bar-container">
          <div className="progress-info">
            <span>
              Question {currentQuestion + 1} of {EXAM_QUESTIONS.length}
            </span>
            <span>
              Score: {score}/{answeredQuestions.size}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentQuestion + 1) / EXAM_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="question-card">
          <div className="question-number">Question {currentQuestion + 1}</div>
          <div className="question-text">{question.question}</div>

          <div className="options-list">
            {question.options.map((option, index) => {
              let className = 'option';
              if (showExplanation) {
                if (index === question.correctAnswer) {
                  className += ' correct';
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  className += ' incorrect';
                }
              } else if (selectedAnswer === index) {
                className += ' selected';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={className}
                  disabled={showExplanation}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                    .
                  </span>
                  <span className="option-text">{option}</span>
                  {showExplanation && index === question.correctAnswer && (
                    <span className="check-mark">✓</span>
                  )}
                  {showExplanation &&
                    index === selectedAnswer &&
                    index !== question.correctAnswer && <span className="x-mark">✗</span>}
                </button>
              );
            })}
          </div>

          <div className="question-actions">
            {!showExplanation ? (
              <Button onClick={submitAnswer} disabled={selectedAnswer === null} variant="primary">
                Submit Answer
              </Button>
            ) : (
              <div className="navigation-buttons">
                <Button onClick={previousQuestion} disabled={currentQuestion === 0}>
                  Previous
                </Button>
                {currentQuestion < EXAM_QUESTIONS.length - 1 ? (
                  <Button onClick={nextQuestion} variant="primary">
                    Next Question
                  </Button>
                ) : (
                  <Button onClick={resetQuiz} variant="success">
                    Restart Quiz
                  </Button>
                )}
              </div>
            )}
          </div>

          {showExplanation && (
            <div className="explanation-panel">
              <div className="result-message">
                {selectedAnswer === question.correctAnswer ? (
                  <Alert variant="success">
                    <strong>Correct!</strong> Great job!
                  </Alert>
                ) : (
                  <Alert variant="error">
                    <strong>Incorrect.</strong> The correct answer is{' '}
                    {String.fromCharCode(65 + question.correctAnswer)}.
                  </Alert>
                )}
              </div>

              <div className="explanation-content">
                <h4>Explanation:</h4>
                <p>{question.explanation}</p>
              </div>

              <div className="exam-tip-content">
                <h4>Exam Tip:</h4>
                <p>{question.examTip}</p>
              </div>
            </div>
          )}
        </div>

        {answeredQuestions.size === EXAM_QUESTIONS.length && showExplanation && (
          <div className="final-score">
            <h3>Quiz Complete!</h3>
            <div className="score-display">
              <div className="score-number">
                {score} / {EXAM_QUESTIONS.length}
              </div>
              <div className="score-percentage">
                {Math.round((score / EXAM_QUESTIONS.length) * 100)}%
              </div>
            </div>
            <p className="score-message">
              {score === EXAM_QUESTIONS.length
                ? 'Perfect score! You have mastered network traffic types!'
                : score >= EXAM_QUESTIONS.length * 0.7
                  ? 'Good job! Review the questions you missed.'
                  : 'Keep studying! Review the material and try again.'}
            </p>
          </div>
        )}
      </Card>

      <style jsx>{`
        .exam-practice {
          padding: 20px;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .description {
          color: #7f8c8d;
          margin-bottom: 25px;
        }

        .progress-bar-container {
          margin-bottom: 30px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #2c3e50;
          font-weight: 600;
        }

        .progress-bar-track {
          width: 100%;
          height: 12px;
          background: #ecf0f1;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.3s;
        }

        .question-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .question-number {
          color: #667eea;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .question-text {
          font-size: 20px;
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 25px;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          position: relative;
        }

        .option:hover:not(:disabled) {
          background: #e9ecef;
          transform: translateX(5px);
        }

        .option.selected {
          background: #e7f3ff;
          border-color: #667eea;
        }

        .option.correct {
          background: #d4edda;
          border-color: #28a745;
        }

        .option.incorrect {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .option:disabled {
          cursor: not-allowed;
        }

        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          flex-shrink: 0;
        }

        .option.correct .option-letter {
          background: #28a745;
        }

        .option.incorrect .option-letter {
          background: #dc3545;
        }

        .option-text {
          flex: 1;
          color: #2c3e50;
          font-size: 16px;
        }

        .check-mark, .x-mark {
          font-size: 24px;
          font-weight: bold;
        }

        .check-mark {
          color: #28a745;
        }

        .x-mark {
          color: #dc3545;
        }

        .question-actions {
          display: flex;
          justify-content: center;
        }

        .navigation-buttons {
          display: flex;
          gap: 15px;
        }

        .explanation-panel {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #ecf0f1;
        }

        .result-message {
          margin-bottom: 20px;
        }

        .explanation-content, .exam-tip-content {
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .explanation-content {
          background: #e7f3ff;
          border-left: 4px solid #667eea;
        }

        .exam-tip-content {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
        }

        .explanation-content h4, .exam-tip-content h4 {
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .explanation-content p, .exam-tip-content p {
          color: #34495e;
          line-height: 1.6;
          margin: 0;
        }

        .final-score {
          margin-top: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          text-align: center;
        }

        .final-score h3 {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .score-display {
          margin: 25px 0;
        }

        .score-number {
          font-size: 48px;
          font-weight: bold;
        }

        .score-percentage {
          font-size: 32px;
          opacity: 0.9;
        }

        .score-message {
          font-size: 18px;
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
};

export default TrafficTypeDemoEnhanced;
