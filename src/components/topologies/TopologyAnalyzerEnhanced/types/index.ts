/**
 * TypeScript types and interfaces for TopologyAnalyzerEnhanced
 */

import type { TopologyType } from '../../topologies-types';

export interface TopologyAnalyzerProps {
  className?: string;
}

export interface Tooltip {
  id: string;
  content: string;
  examTip: string;
  position: { x: number; y: number };
}

export interface AnalyzerState {
  selectedTopologies: TopologyType[];
  nodeCount: number;
  showAnalysis: boolean;
  activeTooltip: Tooltip | null;
  hoveredTopology: TopologyType | null;
}
