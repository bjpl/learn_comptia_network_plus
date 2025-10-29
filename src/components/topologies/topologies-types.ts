/**
 * Network Topologies Types
 * TypeScript type definitions for topology components
 */

export type TopologyType =
  | 'mesh'
  | 'hybrid'
  | 'star'
  | 'hub-and-spoke'
  | 'spine-and-leaf'
  | 'point-to-point'
  | 'three-tier'
  | 'collapsed-core';

export type TrafficFlowType = 'north-south' | 'east-west';

export type ThreeTierLayer = 'core' | 'distribution' | 'access';

export interface TopologyNode {
  id: string;
  type: 'switch' | 'router' | 'host' | 'server' | 'core' | 'distribution' | 'access';
  label: string;
  position: { x: number; y: number };
  layer?: ThreeTierLayer;
  metadata?: {
    capacity?: string;
    redundancy?: boolean;
    role?: string;
  };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  type?: 'primary' | 'redundant' | 'uplink' | 'downlink';
  bandwidth?: string;
  label?: string;
}

export interface TopologyDefinition {
  id: TopologyType;
  name: string;
  description: string;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  characteristics: TopologyCharacteristics;
  useCases: string[];
}

export interface TopologyCharacteristics {
  cableRequirements: {
    formula: string;
    example: string;
    forNodes: (n: number) => number;
  };
  faultTolerance: {
    level: 'low' | 'medium' | 'high' | 'very-high';
    singlePointOfFailure: boolean;
    description: string;
  };
  scalability: {
    level: 'low' | 'medium' | 'high';
    maxNodes: number | 'unlimited';
    limitations: string[];
  };
  cost: {
    initial: 'low' | 'medium' | 'high' | 'very-high';
    maintenance: 'low' | 'medium' | 'high';
    breakdown: {
      hardware: number; // percentage
      cabling: number;
      installation: number;
      maintenance: number;
    };
  };
  trafficFlow: {
    northSouth: number; // percentage
    eastWest: number;
    bottlenecks: string[];
  };
}

export interface ThreeTierModel {
  layers: {
    core: {
      name: string;
      functions: string[];
      requirements: string[];
      devices: string[];
    };
    distribution: {
      name: string;
      responsibilities: string[];
      features: string[];
      devices: string[];
    };
    access: {
      name: string;
      characteristics: string[];
      functions: string[];
      devices: string[];
    };
  };
  collapsedCore: {
    description: string;
    whenToUse: string[];
    benefits: string[];
    limitations: string[];
  };
}

export interface TransformationStep {
  id: string;
  title: string;
  description: string;
  action: 'add-node' | 'remove-node' | 'add-edge' | 'remove-edge' | 'modify-node';
  nodeId?: string;
  edgeId?: string;
  changes: {
    redundancy?: 'increase' | 'decrease' | 'maintain';
    trafficPattern?: string;
    scalability?: 'improve' | 'reduce' | 'maintain';
    cost?: 'increase' | 'decrease' | 'maintain';
  };
}

export interface TopologyTransformation {
  id: string;
  name: string;
  fromTopology: TopologyType;
  toTopology: TopologyType;
  description: string;
  steps: TransformationStep[];
  analysis: {
    redundancy: {
      before: string;
      after: string;
      change: string;
    };
    trafficPatterns: {
      before: string;
      after: string;
      improvement: string;
    };
    scalability: {
      before: string;
      after: string;
      improvement: string;
    };
    cost: {
      before: string;
      after: string;
      change: string;
    };
  };
  benefits: string[];
  considerations: string[];
}

export interface ComparisonMetrics {
  topology: TopologyType;
  scores: {
    faultTolerance: number; // 0-100
    scalability: number;
    cost: number; // inverted, higher is cheaper
    performance: number;
    complexity: number; // inverted, higher is simpler
  };
  nodeCount: number;
  edgeCount: number;
  avgPathLength: number;
}

export interface TrafficFlowAnimation {
  id: string;
  name: string;
  type: TrafficFlowType;
  path: string[]; // node IDs
  duration: number; // ms
  color: string;
  description: string;
}
