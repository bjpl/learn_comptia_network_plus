/**
 * Custom hook for managing TopologyAnalyzer state
 */

import { useState } from 'react';
import type { TopologyType } from '../../topologies-types';
import type { Tooltip } from '../types';

export const useAnalyzerState = () => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<Tooltip | null>(null);
  const [hoveredTopology, setHoveredTopology] = useState<TopologyType | null>(null);

  const toggleTopology = (topology: TopologyType) => {
    setSelectedTopologies((prev) =>
      prev.includes(topology) ? prev.filter((t) => t !== topology) : [...prev, topology].slice(-3)
    );
  };

  const showTooltip = (id: string, content: string, examTip: string, event: React.MouseEvent) => {
    setActiveTooltip({
      id,
      content,
      examTip,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return {
    selectedTopologies,
    nodeCount,
    showAnalysis,
    activeTooltip,
    hoveredTopology,
    setNodeCount,
    setShowAnalysis,
    setHoveredTopology,
    toggleTopology,
    showTooltip,
    hideTooltip,
  };
};
