/**
 * Component 10: Traffic Type Demonstrator
 * Animated 10-node network showing unicast, multicast, anycast, and broadcast
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TRAFFIC_TYPES } from './protocols-data';
import type { TrafficType, TrafficAnimationState } from './protocols-types';

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
  active: boolean;
}

export const TrafficTypeDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState<TrafficType>(TRAFFIC_TYPES[0]);
  const [animationState, setAnimationState] = useState<TrafficAnimationState>({
    activeType: 'unicast',
    animating: false,
    packets: [],
  });
  const [userExplanation, setUserExplanation] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const animationFrameRef = useRef<number>();

  // Create 10 nodes in a circular layout
  const nodes: Node[] = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: 400 + 250 * Math.cos((i * 2 * Math.PI) / 10 - Math.PI / 2),
    y: 300 + 250 * Math.sin((i * 2 * Math.PI) / 10 - Math.PI / 2),
    label: `Node ${i}`,
    active: false,
  }));

  const getPacketColor = useCallback((typeId: string): string => {
    const colors: Record<string, string> = {
      unicast: '#9b59b6',
      multicast: '#e67e22',
      anycast: '#16a085',
      broadcast: '#c0392b',
    };
    return colors[typeId] || '#3498db';
  }, []);

  const drawNetwork = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Draw connections between nodes
      ctx.strokeStyle = '#dfe6e9';
      ctx.lineWidth = 2;
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
        const isSource = selectedType.visual.sourceNodes.includes(node.id);
        const isDestination = selectedType.visual.destinationNodes.includes(node.id);

        // Node circle
        ctx.fillStyle = isSource ? '#e74c3c' : isDestination ? '#2ecc71' : '#3498db';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        ctx.fill();

        // Node border
        ctx.strokeStyle = isSource || isDestination ? '#f39c12' : '#2c3e50';
        ctx.lineWidth = isSource || isDestination ? 4 : 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id.toString(), node.x, node.y);

        // Role label
        if (isSource || isDestination) {
          ctx.fillStyle = '#2c3e50';
          ctx.font = '11px Arial';
          ctx.fillText(isSource ? 'Source' : 'Dest', node.x, node.y + 40);
        }
      });
    },
    [nodes, selectedType.visual.sourceNodes, selectedType.visual.destinationNodes]
  );

  const animateTraffic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw network background
    drawNetwork(ctx);

    // Draw packets
    animationState.packets.forEach((packet) => {
      const fromNode = nodes[packet.from];
      const toNode = nodes[packet.to];

      const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
      const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

      // Draw packet
      ctx.fillStyle = getPacketColor(selectedType.id);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Update packet positions
    const updatedPackets = animationState.packets
      .map((p) => ({ ...p, progress: p.progress + 0.02 }))
      .filter((p) => p.progress <= 1);

    setAnimationState((prev) => ({
      ...prev,
      packets: updatedPackets,
      animating: updatedPackets.length > 0,
    }));

    if (updatedPackets.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateTraffic);
    }
  }, [animationState.packets, nodes, selectedType.id, drawNetwork, getPacketColor]);

  useEffect(() => {
    if (animationState.animating) {
      animateTraffic();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationState.animating, animateTraffic]);

  const startAnimation = () => {
    const sourceNodes = selectedType.visual.sourceNodes;
    const destNodes = selectedType.visual.destinationNodes;

    const newPackets = sourceNodes.flatMap((source) =>
      destNodes.map((dest) => ({
        id: `${source}-${dest}-${Date.now()}`,
        from: source,
        to: dest,
        progress: 0,
      }))
    );

    setAnimationState({
      activeType: selectedType.id,
      animating: true,
      packets: newPackets,
    });
  };

  const resetAnimation = () => {
    setAnimationState({
      activeType: selectedType.id,
      animating: false,
      packets: [],
    });
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="traffic-type-demo">
      <div className="demo-header">
        <h2>Traffic Type Demonstrator</h2>
        <p className="subtitle">Visualize how different traffic patterns flow through networks</p>
      </div>

      <div className="demo-container">
        <div className="traffic-selector">
          <h3>Select Traffic Type:</h3>
          <div className="traffic-buttons">
            {TRAFFIC_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedType(type);
                  resetAnimation();
                }}
                className={`traffic-btn ${selectedType.id === type.id ? 'active' : ''}`}
                style={{
                  borderColor: getPacketColor(type.id),
                }}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div className="network-canvas-container">
          <canvas ref={canvasRef} width={800} height={600} className="network-canvas" />

          <div className="animation-controls">
            <button onClick={startAnimation} className="control-btn start">
              Start Animation
            </button>
            <button onClick={resetAnimation} className="control-btn reset">
              Reset
            </button>
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="legend-dot source"></span>
              <span>Source Node</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot destination"></span>
              <span>Destination Node</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot normal"></span>
              <span>Normal Node</span>
            </div>
          </div>
        </div>

        <div className="traffic-info">
          <h3>{selectedType.name}</h3>
          <p className="description">{selectedType.description}</p>

          <div className="characteristics">
            <h4>Characteristics:</h4>
            <ul>
              {selectedType.characteristics.map((char, idx) => (
                <li key={idx}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="use-cases">
            <h4>Common Use Cases:</h4>
            <ul>
              {selectedType.useCases.map((useCase, idx) => (
                <li key={idx}>{useCase}</li>
              ))}
            </ul>
          </div>

          <div className="example">
            <h4>Real-World Example:</h4>
            <p>{selectedType.example}</p>
          </div>
        </div>

        <div className="explanation-section">
          <h3>Explain in Your Own Words:</h3>
          <textarea
            value={userExplanation}
            onChange={(e) => setUserExplanation(e.target.value)}
            placeholder={`Explain how ${selectedType.name} works and when you would use it...`}
            rows={5}
          />
          <div className="word-count">
            Words:{' '}
            {
              userExplanation
                .trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length
            }
          </div>
        </div>

        <div className="comparison-section">
          <button onClick={() => setShowComparison(!showComparison)} className="comparison-btn">
            {showComparison ? 'Hide' : 'Show'} Traffic Type Comparison
          </button>

          {showComparison && (
            <div className="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Traffic Type</th>
                    <th>Source → Destination</th>
                    <th>Path Style</th>
                    <th>Primary Benefit</th>
                    <th>Primary Drawback</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Unicast</strong>
                    </td>
                    <td>One → One</td>
                    <td>Single direct path</td>
                    <td>Efficient, private, targeted</td>
                    <td>Doesn&apos;t scale for many recipients</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Multicast</strong>
                    </td>
                    <td>One → Many (group)</td>
                    <td>Multiple paths, one stream</td>
                    <td>Bandwidth efficient for groups</td>
                    <td>Requires group management, router support</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Anycast</strong>
                    </td>
                    <td>One → Nearest</td>
                    <td>Shortest path to closest</td>
                    <td>Automatic failover, load balancing</td>
                    <td>Less control over destination</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Broadcast</strong>
                    </td>
                    <td>One → All</td>
                    <td>All paths to all nodes</td>
                    <td>Simple discovery mechanism</td>
                    <td>Network congestion, doesn&apos;t cross routers</td>
                  </tr>
                </tbody>
              </table>

              <div className="when-to-use">
                <h4>When to Use Each Type:</h4>
                <div className="use-grid">
                  <div className="use-card">
                    <h5>Unicast</h5>
                    <p>
                      Use when you need direct, private communication between two specific devices.
                      Examples: SSH, HTTPS, email delivery.
                    </p>
                  </div>
                  <div className="use-card">
                    <h5>Multicast</h5>
                    <p>
                      Use when sending identical data to multiple interested parties. Examples:
                      IPTV, stock tickers, software updates to multiple servers.
                    </p>
                  </div>
                  <div className="use-card">
                    <h5>Anycast</h5>
                    <p>
                      Use when you want requests routed to nearest available service. Examples: DNS,
                      CDN, DDoS mitigation.
                    </p>
                  </div>
                  <div className="use-card">
                    <h5>Broadcast</h5>
                    <p>
                      Use when you need to discover or announce to all local devices. Examples: DHCP
                      discovery, ARP requests, network announcements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .traffic-type-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .demo-header h2 {
          color: #2c3e50;
          font-size: 32px;
        }

        .subtitle {
          color: #7f8c8d;
          font-style: italic;
        }

        .demo-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 30px;
        }

        .traffic-selector {
          margin-bottom: 30px;
        }

        .traffic-selector h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .traffic-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .traffic-btn {
          padding: 12px 25px;
          background: white;
          border: 3px solid #bdc3c7;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .traffic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .traffic-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #764ba2;
        }

        .network-canvas-container {
          position: relative;
          margin: 30px 0;
          text-align: center;
        }

        .network-canvas {
          border: 2px solid #ecf0f1;
          border-radius: 8px;
          background: #f8f9fa;
          max-width: 100%;
        }

        .animation-controls {
          margin: 20px 0;
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .control-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .control-btn.start {
          background: #2ecc71;
          color: white;
        }

        .control-btn.start:hover {
          background: #27ae60;
        }

        .control-btn.reset {
          background: #e74c3c;
          color: white;
        }

        .control-btn.reset:hover {
          background: #c0392b;
        }

        .legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          padding: 15px;
          background: #ecf0f1;
          border-radius: 5px;
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

        .traffic-info {
          margin: 30px 0;
          padding: 25px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 5px solid #3498db;
        }

        .traffic-info h3 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 15px;
        }

        .description {
          font-size: 16px;
          line-height: 1.6;
          color: #34495e;
          margin-bottom: 20px;
        }

        .characteristics, .use-cases {
          margin: 20px 0;
        }

        .characteristics h4, .use-cases h4, .example h4 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .characteristics ul, .use-cases ul {
          list-style-position: inside;
          line-height: 1.8;
          color: #34495e;
        }

        .example {
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 5px;
          border: 2px solid #3498db;
        }

        .example p {
          font-style: italic;
          color: #34495e;
        }

        .explanation-section {
          margin: 30px 0;
          padding: 25px;
          background: #e8f5e9;
          border-radius: 8px;
        }

        .explanation-section h3 {
          color: #27ae60;
          margin-bottom: 15px;
        }

        .explanation-section textarea {
          width: 100%;
          padding: 15px;
          border: 2px solid #27ae60;
          border-radius: 5px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
        }

        .word-count {
          margin-top: 10px;
          text-align: right;
          color: #7f8c8d;
          font-weight: bold;
        }

        .comparison-section {
          margin-top: 30px;
        }

        .comparison-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .comparison-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .comparison-table {
          margin-top: 25px;
          animation: slideDown 0.5s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: bold;
        }

        td {
          padding: 12px 15px;
          border-bottom: 1px solid #ecf0f1;
        }

        tbody tr:hover {
          background: #f8f9fa;
        }

        .when-to-use {
          margin-top: 30px;
        }

        .when-to-use h4 {
          color: #2c3e50;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .use-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .use-card {
          padding: 20px;
          background: white;
          border-radius: 8px;
          border-left: 5px solid #3498db;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .use-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .use-card h5 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 18px;
        }

        .use-card p {
          color: #34495e;
          line-height: 1.6;
        }

        .use-card:nth-child(1) {
          border-left-color: #9b59b6;
        }

        .use-card:nth-child(2) {
          border-left-color: #e67e22;
        }

        .use-card:nth-child(3) {
          border-left-color: #16a085;
        }

        .use-card:nth-child(4) {
          border-left-color: #c0392b;
        }

        @media (max-width: 768px) {
          .network-canvas {
            width: 100%;
            height: auto;
          }

          .traffic-buttons {
            flex-direction: column;
          }

          .traffic-btn {
            width: 100%;
          }

          .legend {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .use-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TrafficTypeDemo;
