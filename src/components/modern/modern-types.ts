/**
 * TypeScript types for modern network technology components
 */

// Technology Summarizer Types
export interface TechnologyArticle {
  id: string;
  title: string;
  category: TechnologyCategory;
  content: string;
  wordCount: number;
  keyTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type TechnologyCategory = 'sdn-sdwan' | 'vxlan' | 'zero-trust' | 'sase-sse' | 'iac' | 'ipv6';

export interface TechnologyFeature {
  name: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  examples: string[];
}

export interface SummarySection {
  category: string;
  features: string[];
  completed: boolean;
  wordCount: number;
  accuracy: number;
}

export interface TechnologySummary {
  articleId: string;
  sections: SummarySection[];
  totalWordCount: number;
  completenessScore: number;
  accuracyScore: number;
  overallScore: number;
  feedback: string[];
}

// IPv6 Migration Planner Types
export interface IPv6MigrationScenario {
  id: string;
  name: string;
  description: string;
  currentState: NetworkState;
  targetState: NetworkState;
  constraints: MigrationConstraint[];
  complexity: 'low' | 'medium' | 'high' | 'critical';
}

export interface NetworkState {
  ipv4Addresses: number;
  ipv6Addresses: number;
  devices: number;
  subnets: number;
  applications: ApplicationInfo[];
  infrastructure: InfrastructureInfo;
}

export interface ApplicationInfo {
  name: string;
  ipv6Ready: boolean;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  dependsOn: string[];
}

export interface InfrastructureInfo {
  routers: { total: number; ipv6Capable: number };
  switches: { total: number; ipv6Capable: number };
  firewalls: { total: number; ipv6Capable: number };
  servers: { total: number; ipv6Capable: number };
}

export interface MigrationConstraint {
  type: 'budget' | 'timeline' | 'compatibility' | 'expertise' | 'business';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export type MigrationMethod = 'dual-stack' | 'tunneling' | 'nat64' | 'hybrid';

export interface MigrationPhase {
  id: string;
  name: string;
  method: MigrationMethod;
  duration: number; // days
  cost: number;
  tasks: MigrationTask[];
  dependencies: string[];
  risks: Risk[];
}

export interface MigrationTask {
  id: string;
  description: string;
  method: MigrationMethod;
  duration: number;
  resources: string[];
  validation: string[];
  completed: boolean;
}

export interface Risk {
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface TunnelingConfig {
  type: '6to4' | 'teredo' | 'isatap';
  endpoints: {
    ipv4: string;
    ipv6: string;
  }[];
  encapsulation: string;
  limitations: string[];
}

export interface NAT64Config {
  translationRules: TranslationRule[];
  addressPool: string;
  limitations: string[];
}

export interface TranslationRule {
  ipv6Prefix: string;
  ipv4Pool: string;
  protocol: string;
  direction: 'inbound' | 'outbound' | 'bidirectional';
}

export interface MigrationPlan {
  scenarioId: string;
  method: MigrationMethod;
  phases: MigrationPhase[];
  timeline: {
    start: Date;
    end: Date;
    totalDays: number;
  };
  budget: {
    hardware: number;
    software: number;
    training: number;
    consulting: number;
    total: number;
  };
  successMetrics: SuccessMetric[];
  riskAssessment: Risk[];
}

export interface SuccessMetric {
  name: string;
  target: number;
  unit: string;
  measurement: string;
  priority: 'low' | 'medium' | 'high';
}

// IaC Automation Builder Types
export interface IaCTemplate {
  id: string;
  name: string;
  description: string;
  category: IaCCategory;
  platform: IaCPlatform;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  parameters: TemplateParameter[];
  tasks: AutomationTask[];
  tags: string[];
}

export type IaCCategory =
  | 'configuration'
  | 'deployment'
  | 'security'
  | 'monitoring'
  | 'backup'
  | 'upgrade';

export type IaCPlatform =
  | 'ansible'
  | 'terraform'
  | 'puppet'
  | 'chef'
  | 'saltstack'
  | 'cloudformation';

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'list' | 'map';
  description: string;
  required: boolean;
  default?: string | number | boolean | string[] | Record<string, unknown>;
  validation?: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  type: TaskType;
  description: string;
  order: number;
  dependencies: string[];
  parameters: Record<string, unknown>;
  rollback?: AutomationTask;
  validation: ValidationCheck[];
}

export type TaskType =
  | 'configure'
  | 'deploy'
  | 'validate'
  | 'backup'
  | 'restore'
  | 'upgrade'
  | 'patch'
  | 'monitor';

export interface ValidationCheck {
  name: string;
  type: 'connectivity' | 'configuration' | 'service' | 'performance';
  command: string;
  expectedResult: string;
  timeout: number;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  platform: IaCPlatform;
  version: string;
  tasks: AutomationTask[];
  variables: Record<string, unknown>;
  inventory: InventoryGroup[];
  handlers: Handler[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryGroup {
  name: string;
  hosts: HostInfo[];
  variables: Record<string, unknown>;
  children?: string[];
}

export interface HostInfo {
  hostname: string;
  ipAddress: string;
  platform: string;
  credentials: string;
  variables: Record<string, unknown>;
}

export interface Handler {
  name: string;
  action: string;
  condition: string;
}

export interface ConfigurationDrift {
  hostId: string;
  hostname: string;
  detectedAt: Date;
  drifts: DriftItem[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFixable: boolean;
}

export interface DriftItem {
  parameter: string;
  expected: unknown;
  actual: unknown;
  category: 'configuration' | 'security' | 'performance' | 'compliance';
  impact: string;
  recommendation: string;
}

export interface VersionControlInfo {
  repository: string;
  branch: string;
  commit: string;
  author: string;
  timestamp: Date;
  message: string;
  changes: FileChange[];
}

export interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  diff?: string;
}

export interface ExecutionResult {
  playbookId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: 'success' | 'failed' | 'partial';
  hostsSucceeded: number;
  hostsFailed: number;
  tasksCompleted: number;
  tasksFailed: number;
  changes: ConfigurationChange[];
  errors: ExecutionError[];
}

export interface ConfigurationChange {
  hostId: string;
  taskId: string;
  parameter: string;
  before: unknown;
  after: unknown;
  timestamp: Date;
}

export interface ExecutionError {
  hostId: string;
  taskId: string;
  message: string;
  timestamp: Date;
  severity: 'warning' | 'error' | 'critical';
}

export interface AutomationSchedule {
  id: string;
  playbookId: string;
  enabled: boolean;
  schedule: ScheduleConfig;
  lastRun?: Date;
  nextRun?: Date;
  runHistory: ExecutionResult[];
}

export interface ScheduleConfig {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'cron';
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  cronExpression?: string;
}
