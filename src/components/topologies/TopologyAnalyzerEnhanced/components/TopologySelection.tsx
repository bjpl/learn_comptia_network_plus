/**
 * Topology selection component
 */

import React from 'react';
import { topologyDefinitions } from '../../topologies-data';
import type { TopologyType } from '../../topologies-types';

interface TopologySelectionProps {
  selectedTopologies: TopologyType[];
  hoveredTopology: TopologyType | null;
  onToggleTopology: (topology: TopologyType) => void;
  onHoverTopology: (topology: TopologyType | null) => void;
  onShowTooltip: (id: string, content: string, examTip: string, event: React.MouseEvent) => void;
  onHideTooltip: () => void;
}

export const TopologySelection = React.memo<TopologySelectionProps>(
  ({
    selectedTopologies,
    hoveredTopology,
    onToggleTopology,
    onHoverTopology,
    onShowTooltip,
    onHideTooltip,
  }) => {
    return (
      <div className="topology-selection-card">
        <div className="card-header">
          <h3 className="card-title">Select Topologies to Compare (max 3)</h3>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              onShowTooltip(
                'selection-tip',
                'Select up to 3 topologies for side-by-side comparison',
                'Exam Tip: Know the differences between star, mesh, and hybrid topologies for scenario-based questions',
                e
              )
            }
            onMouseLeave={onHideTooltip}
          >
            ℹ️
          </div>
        </div>
        <div className="topology-buttons">
          {topologyDefinitions.map((topology) => (
            <button
              key={topology.id}
              className={`topology-btn ${selectedTopologies.includes(topology.id) ? 'active' : ''} ${
                hoveredTopology === topology.id ? 'hovered' : ''
              }`}
              onClick={() => onToggleTopology(topology.id)}
              onMouseEnter={() => onHoverTopology(topology.id)}
              onMouseLeave={() => onHoverTopology(null)}
              disabled={selectedTopologies.length >= 3 && !selectedTopologies.includes(topology.id)}
              aria-pressed={selectedTopologies.includes(topology.id)}
              aria-label={`${topology.name} topology`}
            >
              <span className="btn-icon">🔷</span>
              <span className="btn-text">{topology.name}</span>
              {selectedTopologies.includes(topology.id) && (
                <span className="btn-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

TopologySelection.displayName = 'TopologySelection';
