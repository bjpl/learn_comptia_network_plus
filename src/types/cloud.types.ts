/**
 * Type definitions for cloud computing components
 * Comprehensive types for CloudSummaryBuilder and CloudMigrationSimulator
 */

// Re-export existing cloud types
export type {
  DeploymentModel,
  ServiceModel,
  ConnectivityMethod,
  GatewayType,
  ScalabilityType,
  CloudScenario,
  CloudSummary,
  VPCConfig,
  GatewayConfig,
  ScalabilityConfig,
  SummaryCardData,
  ScoreBreakdown,
  ComponentType,
  DeploymentZone,
  ServiceLayer,
  ConnectivityOption,
  VPCElement,
  Gateway,
  NFVComponent,
  DRComponent,
  HAComponent,
  AvailabilityZone,
  ArchitectureComponent,
  Connection,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ArchitectureDesign,
  ComponentLibraryItem,
  ComponentProperty,
  CanvasState,
  UserProgress,
  DRStrategy,
  BackupType,
  HAPattern,
} from '../components/cloud/cloud-types';

/**
 * Cloud migration scenario
 */
export interface CloudMigrationScenario {
  id: string;
  name: string;
  description: string;
  currentEnvironment: EnvironmentInfo;
  targetCloud: CloudProvider;
  migrationGoals: MigrationGoal[];
  constraints: MigrationConstraint[];
  estimatedComplexity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Current environment information
 */
export interface EnvironmentInfo {
  infrastructure: InfrastructureInventory;
  applications: ApplicationInventory[];
  data: DataInventory;
  dependencies: DependencyMap;
  compliance: ComplianceRequirement[];
}

/**
 * Infrastructure inventory
 */
export interface InfrastructureInventory {
  servers: ServerInfo[];
  storage: StorageInfo[];
  networking: NetworkInfo[];
  databases: DatabaseInfo[];
  totalCost: number; // monthly cost
}

/**
 * Server information
 */
export interface ServerInfo {
  id: string;
  name: string;
  type: 'physical' | 'virtual';
  os: string;
  cpu: number; // cores
  memory: number; // GB
  storage: number; // GB
  applications: string[];
  utilization: {
    cpu: number; // percentage
    memory: number;
    storage: number;
  };
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Storage information
 */
export interface StorageInfo {
  id: string;
  type: 'block' | 'file' | 'object';
  capacity: number; // TB
  used: number; // TB
  iops: number;
  throughput: number; // MB/s
  tier: 'hot' | 'warm' | 'cold' | 'archive';
}

/**
 * Network information
 */
export interface NetworkInfo {
  bandwidth: number; // Mbps
  latency: number; // ms
  subnets: string[];
  firewallRules: number;
  vpnConnections: number;
  directConnections: boolean;
}

/**
 * Database information
 */
export interface DatabaseInfo {
  id: string;
  type: 'relational' | 'nosql' | 'graph' | 'timeseries';
  engine: string;
  size: number; // GB
  transactions: number; // per second
  replication: boolean;
  backup: {
    frequency: string;
    retention: number; // days
  };
}

/**
 * Application inventory
 */
export interface ApplicationInventory {
  id: string;
  name: string;
  tier: 'frontend' | 'backend' | 'middleware' | 'database';
  cloudReadiness: number; // 0-100
  dependencies: string[];
  dataResidency: string[];
  complianceRequirements: string[];
  users: number;
  sla: {
    uptime: number; // percentage
    rto: number; // minutes
    rpo: number; // minutes
  };
}

/**
 * Data inventory
 */
export interface DataInventory {
  totalSize: number; // TB
  categories: DataCategory[];
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  retention: number; // years
  backupSize: number; // TB
}

/**
 * Data category
 */
export interface DataCategory {
  name: string;
  size: number; // GB
  type: 'structured' | 'unstructured' | 'semi-structured';
  growthRate: number; // percentage per year
  accessPattern: 'frequent' | 'occasional' | 'rare';
}

/**
 * Dependency map
 */
export interface DependencyMap {
  applications: Record<string, string[]>; // app ID -> dependent app IDs
  services: Record<string, string[]>;
  databases: Record<string, string[]>;
  criticality: Record<string, 'low' | 'medium' | 'high' | 'critical'>;
}

/**
 * Compliance requirement
 */
export interface ComplianceRequirement {
  standard: string; // e.g., "HIPAA", "PCI-DSS", "GDPR"
  description: string;
  requirements: string[];
  applicableTo: string[]; // application/data IDs
  auditFrequency: string;
}

/**
 * Cloud provider
 */
export type CloudProvider = 'AWS' | 'Azure' | 'GCP' | 'Multi-Cloud' | 'Hybrid';

/**
 * Migration goal
 */
export interface MigrationGoal {
  category: 'cost' | 'performance' | 'scalability' | 'reliability' | 'security';
  description: string;
  target: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  measurable: boolean;
  metrics?: string[];
}

/**
 * Migration constraint
 */
export interface MigrationConstraint {
  type: 'budget' | 'timeline' | 'compliance' | 'technical' | 'business';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation?: string;
}

/**
 * Migration step
 */
export interface MigrationStep {
  id: string;
  phase: number;
  name: string;
  description: string;
  type: 'assessment' | 'planning' | 'migration' | 'validation' | 'optimization';
  duration: number; // days
  cost: number;
  resources: ResourceRequirement[];
  dependencies: string[]; // step IDs
  tasks: MigrationTask[];
  risks: RiskAssessment[];
  successCriteria: string[];
}

/**
 * Resource requirement
 */
export interface ResourceRequirement {
  type: 'personnel' | 'tools' | 'infrastructure';
  description: string;
  quantity: number;
  cost: number;
  duration: number; // days
}

/**
 * Migration task
 */
export interface MigrationTask {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  startDate?: Date;
  endDate?: Date;
  dependencies: string[];
  checklist: ChecklistItem[];
}

/**
 * Checklist item
 */
export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  required: boolean;
  notes?: string;
}

/**
 * Risk assessment
 */
export interface RiskAssessment {
  id: string;
  description: string;
  category: 'technical' | 'security' | 'compliance' | 'business' | 'financial';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  severity: number; // probability * impact (0-100)
  mitigation: string;
  contingency: string;
  owner: string;
}

/**
 * Service comparison for cloud migration
 */
export interface ServiceComparison {
  serviceType: string;
  onPremise: {
    name: string;
    features: string[];
    cost: number;
    limitations: string[];
  };
  cloudOptions: CloudServiceOption[];
  recommendation: string;
  reasoning: string;
  migrationComplexity: 'low' | 'medium' | 'high';
}

/**
 * Cloud service option
 */
export interface CloudServiceOption {
  provider: CloudProvider;
  serviceName: string;
  serviceModel: 'SaaS' | 'IaaS' | 'PaaS';
  features: string[];
  pricing: PricingInfo;
  advantages: string[];
  disadvantages: string[];
  sla: SLAInfo;
}

/**
 * Pricing information
 */
export interface PricingInfo {
  model: 'pay-as-you-go' | 'reserved' | 'spot' | 'committed';
  costPerMonth: number;
  costPerYear: number;
  breakdown: {
    compute?: number;
    storage?: number;
    network?: number;
    support?: number;
    other?: number;
  };
  savingsOptions: string[];
}

/**
 * SLA information
 */
export interface SLAInfo {
  uptime: number; // percentage
  support: string;
  responseTime: string;
  credits: string;
}

/**
 * Cost optimization recommendation
 */
export interface CostOptimizationRecommendation {
  id: string;
  category: 'compute' | 'storage' | 'network' | 'database' | 'general';
  description: string;
  currentCost: number;
  estimatedSavings: number;
  savingsPercentage: number;
  effort: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
  implementation: string[];
  risks: string[];
}

/**
 * Migration plan
 */
export interface MigrationPlan {
  scenarioId: string;
  strategy: 'rehost' | 'replatform' | 'refactor' | 'hybrid';
  phases: MigrationPhase[];
  timeline: MigrationTimeline;
  budget: MigrationBudget;
  risks: RiskAssessment[];
  successMetrics: SuccessMetric[];
}

/**
 * Migration phase
 */
export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  steps: MigrationStep[];
  duration: number; // days
  cost: number;
  startDate?: Date;
  endDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

/**
 * Migration timeline
 */
export interface MigrationTimeline {
  totalDuration: number; // days
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

/**
 * Milestone
 */
export interface Milestone {
  id: string;
  name: string;
  date: Date;
  description: string;
  deliverables: string[];
  status: 'pending' | 'completed' | 'delayed';
}

/**
 * Migration budget
 */
export interface MigrationBudget {
  total: number;
  breakdown: {
    assessment: number;
    planning: number;
    migration: number;
    validation: number;
    training: number;
    contingency: number;
  };
  ongoingCosts: {
    monthly: number;
    yearly: number;
  };
  roi: {
    breakEvenPoint: number; // months
    threeYearSavings: number;
    fiveYearSavings: number;
  };
}

/**
 * Success metric
 */
export interface SuccessMetric {
  id: string;
  name: string;
  category: 'performance' | 'cost' | 'reliability' | 'security' | 'user-satisfaction';
  target: number;
  actual?: number;
  unit: string;
  measurement: string;
  status: 'on-track' | 'at-risk' | 'achieved' | 'missed';
}
