/**
 * Type definitions for network topology components
 * Comprehensive types for TopologyTransformer, TopologyBuilder, and TopologyAnalyzer
 */

// Import types for use in this file
import type {
  TopologyType as TopologyTypeImport,
  TrafficFlowType as TrafficFlowTypeImport,
  ComparisonMetrics as ComparisonMetricsImport,
} from '../components/topologies/topologies-types';

import type {
  SPOFAnalysis as SPOFAnalysisImport,
  RedundancyMetrics as RedundancyMetricsImport,
} from '../components/topologies/TopologyAnalyzer/types';

// Re-export existing topology types
export type {
  TopologyType,
  TrafficFlowType,
  ThreeTierLayer,
  TopologyNode,
  TopologyEdge,
  TopologyDefinition,
  TopologyCharacteristics,
  ThreeTierModel,
  TransformationStep,
  TopologyTransformation,
  ComparisonMetrics,
  TrafficFlowAnimation,
} from '../components/topologies/topologies-types';

// Additional types for TopologyAnalyzer
export type {
  SPOFAnalysis,
  RedundancyMetrics,
  ExamQuestion,
} from '../components/topologies/TopologyAnalyzer/types';

// Type aliases for internal use
type TopologyType = TopologyTypeImport;
type TrafficFlowType = TrafficFlowTypeImport;
type ComparisonMetrics = ComparisonMetricsImport;
type SPOFAnalysis = SPOFAnalysisImport;
type RedundancyMetrics = RedundancyMetricsImport;

/**
 * Topology transformation configuration
 */
export interface TransformOptions {
  animationSpeed: number; // milliseconds per step
  highlightChanges: boolean;
  showComparison: boolean;
  pauseBetweenSteps: number; // milliseconds
  autoAdvance: boolean;
}

/**
 * Topology builder configuration
 */
export interface TopologyBuilderConfig {
  gridSize: number;
  snapToGrid: boolean;
  autoLayout: boolean;
  validateConnections: boolean;
  maxNodes: number;
  maxEdges: number;
}

/**
 * Topology analysis result
 */
export interface AnalysisResult {
  topology: TopologyType;
  nodeCount: number;
  edgeCount: number;
  redundancy: RedundancyMetrics;
  spofAnalysis: SPOFAnalysis[];
  performanceMetrics: PerformanceMetrics;
  recommendations: string[];
  score: number; // 0-100
}

/**
 * Performance metrics for topology
 */
export interface PerformanceMetrics {
  averagePathLength: number;
  networkDiameter: number;
  clusteringCoefficient: number;
  efficiency: number;
  bottlenecks: BottleneckInfo[];
}

/**
 * Bottleneck information
 */
export interface BottleneckInfo {
  nodeId: string;
  label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedActions: string[];
  impact: {
    bandwidth: number; // percentage reduction
    latency: number; // milliseconds added
    affectedPaths: string[][]; // array of node IDs
  };
}

/**
 * Node position for graph layout
 */
export interface NodePosition {
  x: number;
  y: number;
  fixed?: boolean;
}

/**
 * Graph layout algorithm type
 */
export type LayoutAlgorithm = 'force-directed' | 'hierarchical' | 'circular' | 'grid' | 'custom';

/**
 * Layout configuration
 */
export interface LayoutConfig {
  algorithm: LayoutAlgorithm;
  width: number;
  height: number;
  padding: number;
  nodeSpacing: number;
  levelSpacing?: number; // for hierarchical
  radius?: number; // for circular
}

/**
 * Topology comparison result
 */
export interface TopologyComparisonResult {
  topologies: TopologyType[];
  metrics: ComparisonMetrics[];
  bestFor: {
    faultTolerance: TopologyType;
    scalability: TopologyType;
    cost: TopologyType;
    performance: TopologyType;
    simplicity: TopologyType;
  };
  tradeoffs: string[];
  recommendations: {
    useCase: string;
    recommended: TopologyType;
    reasoning: string;
  }[];
}

/**
 * Traffic flow simulation state
 */
export interface TrafficFlowState {
  active: boolean;
  currentFlow: TrafficFlowType;
  packets: PacketState[];
  startTime: number;
  elapsedTime: number;
}

/**
 * Packet state in animation
 */
export interface PacketState {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  currentPosition: NodePosition;
  progress: number; // 0-1
  path: string[]; // node IDs
  color: string;
  size: number;
}

/**
 * Topology validation result
 */
export interface TopologyValidationResult {
  valid: boolean;
  errors: TopologyValidationError[];
  warnings: TopologyValidationWarning[];
}

/**
 * Topology validation error
 */
export interface TopologyValidationError {
  type: 'missing-node' | 'invalid-edge' | 'disconnected-component' | 'cyclic-dependency' | 'duplicate-id';
  message: string;
  nodeId?: string;
  edgeId?: string;
  severity: 'error' | 'critical';
}

/**
 * Topology validation warning
 */
export interface TopologyValidationWarning {
  type: 'suboptimal' | 'best-practice' | 'performance' | 'scalability';
  message: string;
  nodeId?: string;
  edgeId?: string;
  recommendation: string;
}

/**
 * Topology export format
 */
export type TopologyExportFormat = 'json' | 'graphml' | 'dot' | 'svg' | 'png';

/**
 * Topology export options
 */
export interface TopologyExportOptions {
  format: TopologyExportFormat;
  includeMetadata: boolean;
  includeAnalysis: boolean;
  includeVisualization: boolean;
  fileName?: string;
}
