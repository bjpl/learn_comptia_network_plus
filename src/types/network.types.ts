/**
 * Type definitions for network components
 * Comprehensive types for IPv6Planner and PacketJourneySimulator
 */

// Re-export existing IPv4 types
export type {
  SubnetRequirement,
  SubnetAllocation,
  SubnetScenario,
  SubnetDesignResult,
  ProblemType,
  DiagnosticOutput,
  NetworkDevice,
  NetworkConnection,
  TroubleshootingScenario,
  TroubleshootingStep,
  TroubleshootingResult,
  AddressClassification,
  VLSMAllocation,
} from '../components/ipv4/ipv4-types';

// Re-export modern network types (IPv6, IaC, etc.)
export type {
  TechnologyArticle,
  TechnologyCategory,
  TechnologyFeature,
  SummarySection,
  TechnologySummary,
  IPv6MigrationScenario,
  NetworkState,
  ApplicationInfo,
  InfrastructureInfo,
  MigrationConstraint,
  MigrationMethod,
  MigrationPhase,
  MigrationTask,
  Risk,
  TunnelingConfig,
  NAT64Config,
  TranslationRule,
  MigrationPlan,
  SuccessMetric,
  IaCTemplate,
  IaCCategory,
  IaCPlatform,
  TemplateParameter,
  AutomationTask,
  TaskType,
  ValidationCheck,
  Playbook,
  InventoryGroup,
  HostInfo,
  Handler,
  ConfigurationDrift,
  DriftItem,
  VersionControlInfo,
  FileChange,
  ExecutionResult,
  ConfigurationChange,
  ExecutionError,
  AutomationSchedule,
  ScheduleConfig,
} from '../components/modern/modern-types';

/**
 * IPv6 address configuration
 */
export interface IPv6Config {
  address: string;
  prefix: number;
  type: 'unicast' | 'multicast' | 'anycast' | 'link-local' | 'unique-local' | 'global';
  scope: 'interface-local' | 'link-local' | 'site-local' | 'global';
  compressed: string;
  expanded: string;
  binary: string;
  isValid: boolean;
  version: 6;
}

/**
 * IPv6 subnet plan
 */
export interface IPv6SubnetPlan {
  basePrefix: string;
  prefixLength: number;
  subnets: IPv6Subnet[];
  totalSubnets: number;
  addressesPerSubnet: string; // Could be very large number
  hierarchicalStructure: SubnetHierarchy[];
}

/**
 * IPv6 subnet
 */
export interface IPv6Subnet {
  id: string;
  name: string;
  network: string;
  prefixLength: number;
  firstAddress: string;
  lastAddress: string;
  totalAddresses: string;
  purpose: string;
  slaacEnabled: boolean;
  dhcpv6Enabled: boolean;
  vlan?: number;
}

/**
 * Subnet hierarchy for IPv6
 */
export interface SubnetHierarchy {
  level: number;
  prefix: string;
  prefixLength: number;
  children: SubnetHierarchy[];
  allocation: string;
}

/**
 * IPv6 addressing scheme
 */
export interface IPv6AddressingScheme {
  provider: string;
  allocation: string;
  scheme: {
    global: IPv6AllocationPlan;
    sites: SiteAllocation[];
    subnets: SubnetAllocation[];
  };
}

/**
 * IPv6 allocation plan
 */
export interface IPv6AllocationPlan {
  prefix: string;
  purpose: string;
  usage: string;
  reserved: boolean;
}

/**
 * Site allocation for IPv6
 */
export interface SiteAllocation {
  siteId: string;
  name: string;
  prefix: string;
  location: string;
  subnets: IPv6Subnet[];
}

/**
 * Subnet allocation for sites
 */
export interface SubnetAllocation {
  subnetId: string;
  prefix: string;
  vlan: number;
  description: string;
}

/**
 * Packet journey simulation step
 */
export interface JourneyStep {
  id: string;
  order: number;
  device: string;
  deviceType: 'host' | 'switch' | 'router' | 'firewall' | 'load-balancer' | 'proxy';
  layer: 1 | 2 | 3 | 4 | 5 | 6 | 7; // OSI layer
  action: string;
  description: string;
  packetState: PacketState;
  timing: {
    arrivalTime: number; // milliseconds
    processingTime: number;
    departureTime: number;
  };
  decisions: Decision[];
  modifications: Modification[];
}

/**
 * Packet state at each step
 */
export interface PacketState {
  layer1?: Layer1Info;
  layer2?: Layer2Info;
  layer3?: Layer3Info;
  layer4?: Layer4Info;
  layer7?: Layer7Info;
  payload: string;
  size: number; // bytes
}

/**
 * Layer 1 (Physical) information
 */
export interface Layer1Info {
  medium: 'copper' | 'fiber' | 'wireless';
  signal: string;
  encoding: string;
  bitrate: number; // bps
}

/**
 * Layer 2 (Data Link) information
 */
export interface Layer2Info {
  sourceMac: string;
  destMac: string;
  ethertype: string;
  vlan?: number;
  qos?: number;
}

/**
 * Layer 3 (Network) information
 */
export interface Layer3Info {
  sourceIp: string;
  destIp: string;
  protocol: string;
  ttl: number;
  tos?: number;
  flags?: string[];
}

/**
 * Layer 4 (Transport) information
 */
export interface Layer4Info {
  sourcePort: number;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'SCTP';
  sequenceNumber?: number;
  acknowledgmentNumber?: number;
  flags?: string[];
  windowSize?: number;
}

/**
 * Layer 7 (Application) information
 */
export interface Layer7Info {
  protocol: string;
  method?: string;
  uri?: string;
  headers?: Record<string, string>;
  contentType?: string;
}

/**
 * Decision made by network device
 */
export interface Decision {
  type: 'routing' | 'switching' | 'filtering' | 'nat' | 'qos';
  description: string;
  criteria: string[];
  result: string;
  tableUsed?: string;
  matchedRule?: string;
}

/**
 * Modification made to packet
 */
export interface Modification {
  layer: number;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

/**
 * Packet route through network
 */
export interface PacketRoute {
  id: string;
  source: NetworkEndpoint;
  destination: NetworkEndpoint;
  steps: JourneyStep[];
  totalTime: number; // milliseconds
  totalHops: number;
  pathType: 'direct' | 'routed' | 'tunneled' | 'proxied';
  success: boolean;
  errorMessage?: string;
}

/**
 * Network endpoint
 */
export interface NetworkEndpoint {
  name: string;
  ipAddress: string;
  macAddress?: string;
  port?: number;
  type: 'host' | 'server' | 'router' | 'gateway';
  location?: string;
}

/**
 * Network path analysis
 */
export interface NetworkPathAnalysis {
  route: PacketRoute;
  bottlenecks: PathBottleneck[];
  latencyBreakdown: LatencyBreakdown[];
  recommendations: string[];
  efficiency: number; // 0-100
}

/**
 * Path bottleneck
 */
export interface PathBottleneck {
  stepId: string;
  device: string;
  type: 'bandwidth' | 'processing' | 'congestion' | 'policy';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: number; // milliseconds added
  resolution: string;
}

/**
 * Latency breakdown
 */
export interface LatencyBreakdown {
  component: string;
  latency: number; // milliseconds
  percentage: number;
  type: 'propagation' | 'transmission' | 'processing' | 'queuing';
}

/**
 * Network topology for packet simulation
 */
export interface NetworkTopologyMap {
  devices: NetworkDeviceInfo[];
  links: NetworkLink[];
  subnets: SubnetInfo[];
  routingTables: RoutingTable[];
  arpTables: ARPTable[];
}

/**
 * Network device information
 */
export interface NetworkDeviceInfo {
  id: string;
  name: string;
  type: 'host' | 'switch' | 'router' | 'firewall' | 'load-balancer';
  interfaces: NetworkInterface[];
  position: { x: number; y: number };
  capabilities: string[];
}

/**
 * Network interface
 */
export interface NetworkInterface {
  id: string;
  name: string;
  macAddress: string;
  ipAddresses: string[];
  status: 'up' | 'down';
  speed: number; // Mbps
  duplex: 'half' | 'full';
  vlan?: number;
}

/**
 * Network link
 */
export interface NetworkLink {
  id: string;
  source: string; // device ID
  target: string; // device ID
  sourceInterface: string;
  targetInterface: string;
  bandwidth: number; // Mbps
  latency: number; // ms
  utilization: number; // percentage
  status: 'up' | 'down' | 'degraded';
}

/**
 * Subnet info
 */
export interface SubnetInfo {
  network: string;
  cidr: number;
  gateway: string;
  vlan?: number;
  devices: string[]; // device IDs
}

/**
 * Routing table
 */
export interface RoutingTable {
  deviceId: string;
  routes: Route[];
}

/**
 * Route entry
 */
export interface Route {
  destination: string;
  mask: string;
  gateway: string;
  interface: string;
  metric: number;
  protocol: 'static' | 'connected' | 'ospf' | 'bgp' | 'eigrp' | 'rip';
}

/**
 * ARP table
 */
export interface ARPTable {
  deviceId: string;
  entries: ARPEntry[];
}

/**
 * ARP entry
 */
export interface ARPEntry {
  ipAddress: string;
  macAddress: string;
  interface: string;
  age: number; // seconds
  type: 'static' | 'dynamic';
}

/**
 * Packet capture filter
 */
export interface PacketCaptureFilter {
  protocol?: string[];
  sourceIp?: string;
  destIp?: string;
  sourcePort?: number;
  destPort?: number;
  layer?: number[];
  keywords?: string[];
}

/**
 * Simulation configuration
 */
export interface SimulationConfig {
  speed: number; // 1x, 2x, 4x
  showDetails: boolean;
  highlightLayer: number | 'all';
  pauseAtSteps: boolean;
  capturePackets: boolean;
  filter?: PacketCaptureFilter;
}
