/**
 * Enhanced header component for TopologyAnalyzer
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="analyzer-header">
      <div className="header-content">
        <h2 className="header-title">Network Topology Comparison Analyzer</h2>
        <p className="header-subtitle">
          Compare different network topologies based on cost, scalability, fault tolerance, and
          traffic patterns. Interactive tool designed for CompTIA Network+ exam preparation.
        </p>
      </div>
      <div className="header-badge">
        <span className="badge-icon">📊</span>
        <span className="badge-text">Learning Objective 1.2</span>
      </div>
    </div>
  );
};
