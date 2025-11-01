/**
 * TypeScript type definitions for Cloud Concepts components
 * CompTIA Network+ Learning Objective 1.2
 */

export type DeploymentModel = 'Public' | 'Private' | 'Hybrid';
export type ServiceModel = 'SaaS' | 'IaaS' | 'PaaS';
export type ConnectivityMethod = 'VPN' | 'Direct Connect' | 'Internet Gateway';
export type GatewayType = 'Internet Gateway' | 'NAT Gateway';
export type ScalabilityType = 'Vertical' | 'Horizontal' | 'Auto';

export interface CloudScenario {
  id: string;
  title: string;
  provider: 'AWS' | 'Azure' | 'GCP' | 'Multi-Cloud';
  description: string;
  requirements: string[];
  idealSolution: CloudSummary;
}

export interface CloudSummary {
  deploymentModel: DeploymentModel;
  deploymentJustification: string;
  serviceModel: ServiceModel;
  serviceExamples: string[];
  connectivityMethod: ConnectivityMethod;
  connectivityReasoning: string;
  nfvImplementation: string;
  vpcConfiguration: VPCConfig;
  cloudGateways: GatewayConfig;
  scalabilityFeatures: ScalabilityConfig;
  elasticityImplementation: string;
  multitenancyConsiderations: string[];
}

export interface VPCConfig {
  subnets: string[];
  securityGroups: string[];
  networkLists: string[];
}

export interface GatewayConfig {
  internetGateway: boolean;
  natGateway: boolean;
  usage: string;
}

export interface ScalabilityConfig {
  type: ScalabilityType;
  description: string;
  triggers: string[];
}

export interface SummaryCardData {
  scenario: CloudScenario;
  userSummary: Partial<CloudSummary>;
  score?: ScoreBreakdown;
  wordCount: number;
}

export interface ScoreBreakdown {
  modelsAndConcepts: number; // 40%
  conciseness: number; // 20%
  coverage: number; // 40%
  total: number;
  feedback: string[];
}

// Cloud Architecture Designer Types
export type ComponentType =
  | 'deployment-zone'
  | 'service-layer'
  | 'connectivity'
  | 'vpc-element'
  | 'gateway'
  | 'nfv-component';

export type DeploymentZone = 'Public Cloud' | 'Private Cloud' | 'Hybrid Zone';
export type ServiceLayer = 'SaaS Application' | 'PaaS Platform' | 'IaaS Infrastructure';
export type ConnectivityOption = 'VPN Tunnel' | 'Direct Connect Link' | 'Internet Connection';
export type VPCElement = 'Subnet' | 'Security Group' | 'Network List';
export type Gateway = 'Internet Gateway' | 'NAT Gateway';
export type NFVComponent = 'Virtual Router' | 'Virtual Firewall' | 'Virtual Load Balancer';

export interface ArchitectureComponent {
  id: string;
  type: ComponentType;
  subtype: DeploymentZone | ServiceLayer | ConnectivityOption | VPCElement | Gateway | NFVComponent;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon: string;
  properties: Record<string, unknown>;
  connections: string[]; // IDs of connected components
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'network' | 'control' | 'data';
  label?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
}

export interface ValidationError {
  componentId?: string;
  message: string;
  severity: 'error' | 'critical';
  suggestion: string;
}

export interface ValidationWarning {
  componentId?: string;
  message: string;
  type: 'best-practice' | 'optimization' | 'security';
}

export interface ArchitectureDesign {
  id: string;
  name: string;
  description: string;
  components: ArchitectureComponent[];
  connections: Connection[];
  validation?: ValidationResult;
  metadata: {
    created: Date;
    modified: Date;
    author: string;
  };
}

export interface ComponentLibraryItem {
  type: ComponentType;
  subtype: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  allowedConnections: ComponentType[];
  properties: ComponentProperty[];
}

export interface ComponentProperty {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'boolean' | 'multiselect';
  options?: string[];
  default?: unknown;
  required?: boolean;
}

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  selectedComponentId?: string;
  isDragging: boolean;
  isConnecting: boolean;
  connectionStart?: string;
  gridSize: number;
  snapToGrid: boolean;
}

export interface UserProgress {
  scenariosCompleted: string[];
  averageScore: number;
  totalTime: number;
  architecturesCreated: number;
  bestPracticesFollowed: number;
}
