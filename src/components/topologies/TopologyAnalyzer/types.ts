/**
 * TopologyAnalyzer Types
 * Type definitions specific to the TopologyAnalyzer component
 */

import type { TopologyType } from '../topologies-types';

export interface TopologyAnalyzerProps {
  className?: string;
}

export interface SPOFAnalysis {
  nodeId: string;
  label: string;
  isSPOF: boolean;
  impact: string;
  affectedNodes: string[];
  redundancy: number;
}

export interface RedundancyMetrics {
  pathRedundancy: number;
  linkRedundancy: number;
  overallRedundancy: number;
  criticalPaths: string[];
}

export interface ExamQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topologyType: TopologyType;
}
