/**
 * TypeScript types for networking appliances components
 */

export type DeviceType =
  // Layer 1
  | 'hub'
  | 'repeater'
  | 'media-converter'
  // Layer 2
  | 'switch'
  | 'bridge'
  | 'poe-switch'
  | 'wireless-ap-autonomous'
  | 'wireless-ap-controller'
  | 'poe-injector'
  // Layer 3
  | 'router'
  | 'layer3-switch'
  // Security
  | 'firewall-stateless'
  | 'firewall-stateful'
  | 'firewall-ngfw'
  | 'ids'
  | 'ips'
  | 'proxy'
  | 'content-filter'
  | 'utm'
  // Application Delivery
  | 'load-balancer'
  | 'vpn-concentrator'
  | 'voip-gateway'
  // WAN
  | 'modem'
  | 'csu-dsu'
  // Controller
  | 'wireless-controller';

export interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  category: 'physical' | 'virtual' | 'cloud';
  manufacturer?: string;
  model?: string;
}

export interface PoESpecs {
  standard: '802.3af' | '802.3at' | '802.3bt';
  powerPerPort: number;
  totalPoeBudget?: number;
  poePortCount?: number;
}

export interface WirelessSpecs {
  standard: '802.11ac' | '802.11ax' | '802.11be';
  maxClients: number;
  range: string;
  architecture: 'autonomous' | 'controller-based';
}

export interface SecuritySpecs {
  inspectionType: 'stateless' | 'stateful' | 'deep-packet';
  deploymentMode: 'inline' | 'out-of-band' | 'transparent' | 'routed';
  threatsPerSecond?: number;
}

export interface LoadBalancerSpecs {
  algorithms: string[];
  sessionPersistence: boolean;
  sslOffload: boolean;
  healthChecks: boolean;
}

export interface VpnSpecs {
  types: ('ipsec' | 'ssl' | 'l2tp')[];
  maxTunnels: number;
  throughputEncrypted: string;
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
  poeSupport?: PoESpecs;
  wirelessSpecs?: WirelessSpecs;
  securitySpecs?: SecuritySpecs;
  loadBalancerSpecs?: LoadBalancerSpecs;
  vpnSpecs?: VpnSpecs;
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

export interface Scenario {
  title: string;
  description: string;
  requirements: string[];
  whyThisDevice: string;
  alternatives?: string[];
}

export interface ComparisonDevice extends NetworkDevice {
  // OSI Layer Information (optional for backward compatibility)
  osiLayers?: number[];
  primaryOsiLayer?: number;
  osiLayerDescription?: string;

  // Domain Analysis (optional for backward compatibility)
  collisionDomains?: 'single' | 'per-port' | 'none';
  broadcastDomains?: 'single' | 'per-port' | 'per-vlan' | 'none';
  domainNotes?: string;

  specs: DeviceSpecs;
  features: DeviceFeatures;
  pricing: DevicePricing;

  // Educational Content (optional for backward compatibility)
  examFocus?: string[];
  commonMisconceptions?: string[];
  realWorldScenarios?: Scenario[];
  whenToUse?: string[];
  whenNotToUse?: string[];

  useCase: string[];
  pros: string[];
  cons: string[];
}

export interface ExamQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
  }[];
  explanation: string;
  relatedDevices: string[];
  examTip: string;
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

export interface TroubleshootingScenario {
  id: string;
  name: string;
  description: string;
  setup: () => { devices: SimulatedDevice[]; connections: NetworkConnection[] };
  expectedIssue: string;
  hint: string;
}
