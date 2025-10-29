/**
 * TypeScript types for networking appliances components
 */

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'load-balancer' | 'ids-ips' | 'wireless-controller' | 'proxy' | 'vpn-concentrator';
  category: 'physical' | 'virtual' | 'cloud';
  manufacturer?: string;
  model?: string;
}

export interface DeviceSpecs {
  throughput: string;
  maxConnections: number;
  portCount?: number;
  rackUnits?: number;
  powerConsumption: string;
  memoryGB?: number;
  storageGB?: number;
  redundancy: boolean;
  hotSwappable: boolean;
}

export interface DeviceFeatures {
  layer3Routing: boolean;
  vlanSupport: boolean;
  qosCapabilities: boolean;
  vpnSupport: boolean;
  loadBalancing: boolean;
  highAvailability: boolean;
  deepPacketInspection: boolean;
  threatPrevention: boolean;
  webFiltering: boolean;
  applicationControl: boolean;
}

export interface DevicePricing {
  initialCost: number;
  annualMaintenanceCost: number;
  powerCostPerYear: number;
  totalCostYear1: number;
  totalCost3Years: number;
  totalCost5Years: number;
}

export interface ComparisonDevice extends NetworkDevice {
  specs: DeviceSpecs;
  features: DeviceFeatures;
  pricing: DevicePricing;
  useCase: string[];
  pros: string[];
  cons: string[];
}

export interface DecisionNode {
  id: string;
  type: 'question' | 'recommendation';
  text: string;
  yesPath?: string;
  noPath?: string;
  devices?: string[];
  rationale?: string;
}

export interface DecisionTree {
  nodes: Map<string, DecisionNode>;
  startNodeId: string;
}

export interface NetworkPosition {
  x: number;
  y: number;
}

export interface NetworkConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'ethernet' | 'fiber' | 'wireless' | 'vpn';
  bandwidth: string;
  latency?: number;
  trafficLoad?: number;
}

export interface SimulatedDevice extends NetworkDevice {
  position: NetworkPosition;
  specs: DeviceSpecs;
  status: 'active' | 'warning' | 'error' | 'inactive';
  connections: string[];
  currentLoad?: number;
  maxLoad?: number;
}

export interface NetworkTopology {
  devices: SimulatedDevice[];
  connections: NetworkConnection[];
}

export interface TrafficFlow {
  id: string;
  sourceDeviceId: string;
  targetDeviceId: string;
  connectionIds: string[];
  protocol: string;
  bandwidth: number;
  color: string;
  animated: boolean;
}

export interface SimulationState {
  isRunning: boolean;
  time: number;
  trafficFlows: TrafficFlow[];
  alerts: SimulationAlert[];
}

export interface SimulationAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  deviceId?: string;
  timestamp: number;
}

export interface VirtualVsPhysicalCriteria {
  scalabilityNeeds: 'low' | 'medium' | 'high';
  budgetConstraints: 'tight' | 'moderate' | 'flexible';
  performanceRequirements: 'basic' | 'standard' | 'enterprise';
  redundancyNeeds: 'none' | 'basic' | 'full';
  deploymentSpeed: 'slow' | 'moderate' | 'rapid';
  existingInfrastructure: 'legacy' | 'mixed' | 'modern';
}

export interface RecommendationResult {
  recommendation: 'physical' | 'virtual' | 'hybrid';
  confidence: number;
  reasoning: string[];
  suggestedDevices: ComparisonDevice[];
  estimatedCost: {
    year1: number;
    year3: number;
    year5: number;
  };
}
