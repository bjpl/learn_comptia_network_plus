/**
 * TrafficFlowVisualization Component
 * Visualize north-south and east-west traffic patterns
 */

import React, { useState } from 'react';
import type { TrafficFlowType } from '../../topologies-types';
import { trafficFlowAnimations } from '../../topologies-data';

export const TrafficFlowVisualization: React.FC = () => {
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [activeTrafficType, setActiveTrafficType] = useState<TrafficFlowType>('north-south');

  return (
    <div className="traffic-visualizer">
      <h3>Traffic Flow Visualizer</h3>
      <div className="traffic-controls">
        <button
          className={activeTrafficType === 'north-south' ? 'active' : ''}
          onClick={() => setActiveTrafficType('north-south')}
        >
          North-South Traffic
        </button>
        <button
          className={activeTrafficType === 'east-west' ? 'active' : ''}
          onClick={() => setActiveTrafficType('east-west')}
        >
          East-West Traffic
        </button>
        <button onClick={() => setShowTrafficFlow(!showTrafficFlow)}>
          {showTrafficFlow ? 'Stop' : 'Start'} Animation
        </button>
      </div>

      <div className="traffic-description">
        {activeTrafficType === 'north-south' ? (
          <div>
            <h4>North-South Traffic</h4>
            <p>
              Client-to-server communication flowing vertically through network layers. Typical for web
              requests, API calls, and external access.
            </p>
          </div>
        ) : (
          <div>
            <h4>East-West Traffic</h4>
            <p>
              Server-to-server communication flowing horizontally within data center. Dominant in modern
              microservices and distributed applications.
            </p>
          </div>
        )}
      </div>

      <div className="traffic-animations">
        {trafficFlowAnimations
          .filter((anim) => anim.type === activeTrafficType)
          .map((anim) => (
            <div key={anim.id} className="animation-item">
              <div className="animation-header">
                <span className="name">{anim.name}</span>
                <span className="duration">{anim.duration}ms</span>
              </div>
              <div className="path">
                {anim.path.map((node, idx) => (
                  <React.Fragment key={idx}>
                    <span className="node" style={{ borderColor: anim.color }}>
                      {node}
                    </span>
                    {idx < anim.path.length - 1 && (
                      <span className="arrow" style={{ color: anim.color }}>
                        →
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="description">{anim.description}</p>
              {showTrafficFlow && (
                <div
                  className="traffic-pulse"
                  style={{
                    backgroundColor: anim.color,
                    animationDuration: `${anim.duration}ms`,
                  }}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
