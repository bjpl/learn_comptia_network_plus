/**
 * Type definitions for TopologyAnalyzer
 * Extracted from original TopologyAnalyzer.tsx
 */

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
  topologyType: string;
}
