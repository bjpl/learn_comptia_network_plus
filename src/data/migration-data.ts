/**
 * Migration Data - Cloud Migration Scenarios and Strategies
 * Comprehensive data for the CloudMigrationSimulator component
 */

export interface MigrationStrategy {
  id: string;
  name: string;
  shortName: string;
  description: string;
  useCases: string[];
  benefits: string[];
  challenges: string[];
  complexity: 'Low' | 'Medium' | 'High';
  costImpact: 'Low' | 'Medium' | 'High';
  timeframe: string;
  icon: string;
}

export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // in weeks
  checklist: ChecklistItem[];
  risks: RiskItem[];
  dependencies: string[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  responsible: string;
  completed: boolean;
}

export interface RiskItem {
  id: string;
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface MigrationScenario {
  id: string;
  name: string;
  description: string;
  sourceEnvironment: string;
  targetEnvironment: string;
  applicationCount: number;
  dataVolume: string;
  recommendedStrategy: string;
  estimatedDuration: string;
  estimatedCost: string;
  complexity: 'Low' | 'Medium' | 'High';
  phases: MigrationPhase[];
}

export interface CostModel {
  onPremise: {
    hardware: number;
    software: number;
    datacenter: number;
    personnel: number;
    maintenance: number;
  };
  cloud: {
    compute: number;
    storage: number;
    networking: number;
    services: number;
    support: number;
  };
}

// The 6 R's of Cloud Migration
export const migrationStrategies: MigrationStrategy[] = [
  {
    id: 'rehost',
    name: 'Rehost (Lift and Shift)',
    shortName: 'Rehost',
    description:
      'Move applications to the cloud without making any changes. Virtual machines are migrated as-is to cloud infrastructure.',
    useCases: [
      'Quick migration needed',
      'Minimal downtime required',
      'Applications work well in current state',
      'Limited cloud expertise',
      'Meeting compliance deadlines',
    ],
    benefits: [
      'Fastest migration approach',
      'Lowest initial complexity',
      'Minimal application changes',
      'Immediate cloud benefits (reliability, scale)',
      'Phased optimization possible',
    ],
    challenges: [
      'May not optimize cloud costs',
      'Limited cloud-native benefits',
      'Legacy architecture preserved',
      'Potential licensing issues',
      'Suboptimal performance',
    ],
    complexity: 'Low',
    costImpact: 'Medium',
    timeframe: '2-6 months',
    icon: '🚀',
  },
  {
    id: 'replatform',
    name: 'Replatform (Lift, Tinker, and Shift)',
    shortName: 'Replatform',
    description:
      'Make minimal cloud optimizations without changing core architecture. Leverage managed services where possible.',
    useCases: [
      'Balance speed and optimization',
      'Reduce operational overhead',
      'Leverage managed databases',
      'Improve scalability slightly',
      'Modernize without full refactor',
    ],
    benefits: [
      'Some cloud optimization',
      'Reduced operational burden',
      'Better performance than rehost',
      'Managed service benefits',
      'Moderate complexity increase',
    ],
    challenges: [
      'Requires testing and validation',
      'Some application changes needed',
      'Vendor lock-in considerations',
      'Migration complexity increases',
      'Staff training required',
    ],
    complexity: 'Medium',
    costImpact: 'Medium',
    timeframe: '4-9 months',
    icon: '🔧',
  },
  {
    id: 'refactor',
    name: 'Refactor (Re-architect)',
    shortName: 'Refactor',
    description:
      'Redesign applications to be cloud-native, using microservices, containers, and serverless architectures.',
    useCases: [
      'Maximum cloud benefits needed',
      'Application modernization required',
      'Scalability is critical',
      'Long-term cloud strategy',
      'Competitive advantage sought',
    ],
    benefits: [
      'Full cloud-native capabilities',
      'Maximum scalability and resilience',
      'Optimal cost efficiency',
      'Modern development practices',
      'Best long-term value',
    ],
    challenges: [
      'Highest complexity and cost',
      'Longest timeline',
      'Significant code changes',
      'Requires skilled developers',
      'Business disruption risk',
    ],
    complexity: 'High',
    costImpact: 'High',
    timeframe: '12-24 months',
    icon: '⚙️',
  },
  {
    id: 'repurchase',
    name: 'Repurchase (Drop and Shop)',
    shortName: 'Repurchase',
    description: 'Replace existing applications with cloud-based SaaS solutions.',
    useCases: [
      'SaaS alternative available',
      'Custom solution not needed',
      'Reduce maintenance burden',
      'Standard functionality sufficient',
      'Quick wins desired',
    ],
    benefits: [
      'Minimal migration effort',
      'Vendor manages updates',
      'Known pricing model',
      'Rapid deployment',
      'Modern features included',
    ],
    challenges: [
      'Feature gaps possible',
      'Data migration required',
      'Integration complexity',
      'Vendor dependency',
      'Customization limitations',
    ],
    complexity: 'Low',
    costImpact: 'Low',
    timeframe: '1-3 months',
    icon: '🛒',
  },
  {
    id: 'retire',
    name: 'Retire',
    shortName: 'Retire',
    description: 'Decommission applications that are no longer needed or have been replaced.',
    useCases: [
      'Application no longer used',
      'Redundant functionality',
      'Business process changed',
      'Cost reduction initiative',
      'Consolidation opportunity',
    ],
    benefits: [
      'Immediate cost savings',
      'Reduced complexity',
      'Lower security risk',
      'Simplified portfolio',
      'No migration needed',
    ],
    challenges: [
      'Stakeholder buy-in required',
      'Data retention compliance',
      'Dependency identification',
      'User impact management',
      'Archive strategy needed',
    ],
    complexity: 'Low',
    costImpact: 'Low',
    timeframe: '1-2 months',
    icon: '🗑️',
  },
  {
    id: 'retain',
    name: 'Retain (Revisit)',
    shortName: 'Retain',
    description:
      'Keep applications on-premises, either temporarily or permanently, due to various constraints.',
    useCases: [
      'Compliance requirements',
      'Not ready for migration',
      'Recent investment in infrastructure',
      'Performance requirements',
      'Future migration planned',
    ],
    benefits: [
      'No immediate change needed',
      'Preserve current investments',
      'Meet compliance requirements',
      'Allow time for planning',
      'Reduce migration risk',
    ],
    challenges: [
      'No cloud benefits',
      'Hybrid complexity',
      'Delayed modernization',
      'Ongoing maintenance costs',
      'Technical debt accumulation',
    ],
    complexity: 'Low',
    costImpact: 'Low',
    timeframe: 'Indefinite',
    icon: '🏠',
  },
];

// Pre-built Migration Scenarios
export const migrationScenarios: MigrationScenario[] = [
  {
    id: 'legacy-to-aws',
    name: 'Legacy Datacenter to AWS',
    description:
      'Migrate a traditional on-premises datacenter with mixed workloads to AWS cloud infrastructure',
    sourceEnvironment: 'On-Premises Datacenter',
    targetEnvironment: 'Amazon Web Services (AWS)',
    applicationCount: 45,
    dataVolume: '50 TB',
    recommendedStrategy: 'replatform',
    estimatedDuration: '6-12 months',
    estimatedCost: '$500K - $1.2M',
    complexity: 'High',
    phases: [
      {
        id: 'assessment',
        name: 'Assessment & Discovery',
        description: 'Inventory applications, analyze dependencies, and assess cloud readiness',
        duration: 4,
        checklist: [
          {
            id: 'inv-1',
            task: 'Application inventory',
            description: 'Complete inventory of all applications, databases, and workloads',
            responsible: 'Infrastructure Team',
            completed: false,
          },
          {
            id: 'dep-1',
            task: 'Dependency mapping',
            description: 'Map all application dependencies and interconnections',
            responsible: 'Application Team',
            completed: false,
          },
          {
            id: 'perf-1',
            task: 'Performance baseline',
            description: 'Establish current performance metrics and SLAs',
            responsible: 'Operations Team',
            completed: false,
          },
          {
            id: 'comp-1',
            task: 'Compliance review',
            description: 'Identify compliance and regulatory requirements',
            responsible: 'Security Team',
            completed: false,
          },
          {
            id: 'cost-1',
            task: 'Cost analysis',
            description: 'Calculate current TCO and project cloud costs',
            responsible: 'Finance Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-1',
            risk: 'Incomplete application inventory',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Use automated discovery tools and conduct stakeholder interviews',
          },
          {
            id: 'risk-2',
            risk: 'Hidden dependencies discovered late',
            probability: 'High',
            impact: 'High',
            mitigation: 'Perform network traffic analysis and application profiling',
          },
        ],
        dependencies: [],
      },
      {
        id: 'planning',
        name: 'Migration Planning',
        description: 'Develop detailed migration strategy, timeline, and resource allocation',
        duration: 6,
        checklist: [
          {
            id: 'strat-1',
            task: 'Strategy selection',
            description: "Assign migration strategy (6 R's) to each application",
            responsible: 'Architecture Team',
            completed: false,
          },
          {
            id: 'wave-1',
            task: 'Wave planning',
            description: 'Group applications into migration waves',
            responsible: 'Project Manager',
            completed: false,
          },
          {
            id: 'arch-1',
            task: 'Target architecture',
            description: 'Design AWS landing zone and target architecture',
            responsible: 'Cloud Architect',
            completed: false,
          },
          {
            id: 'sec-1',
            task: 'Security design',
            description: 'Design security controls, IAM, and network architecture',
            responsible: 'Security Team',
            completed: false,
          },
          {
            id: 'train-1',
            task: 'Training plan',
            description: 'Develop training program for staff on AWS services',
            responsible: 'HR/Training',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-3',
            risk: 'Unrealistic timeline expectations',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Build buffer time and plan for contingencies',
          },
          {
            id: 'risk-4',
            risk: 'Resource availability constraints',
            probability: 'High',
            impact: 'High',
            mitigation: 'Secure resource commitments early and consider external consultants',
          },
        ],
        dependencies: ['assessment'],
      },
      {
        id: 'migration',
        name: 'Migration Execution',
        description: 'Execute migration in planned waves with testing and validation',
        duration: 16,
        checklist: [
          {
            id: 'env-1',
            task: 'AWS environment setup',
            description: 'Configure AWS accounts, VPCs, and core services',
            responsible: 'Cloud Team',
            completed: false,
          },
          {
            id: 'pilot-1',
            task: 'Pilot migration',
            description: 'Migrate pilot application to validate process',
            responsible: 'Migration Team',
            completed: false,
          },
          {
            id: 'data-1',
            task: 'Data migration',
            description: 'Migrate data using AWS DataSync or Snowball',
            responsible: 'Database Team',
            completed: false,
          },
          {
            id: 'app-1',
            task: 'Application migration',
            description: 'Migrate applications by wave using chosen strategy',
            responsible: 'Application Team',
            completed: false,
          },
          {
            id: 'test-1',
            task: 'Testing and validation',
            description: 'Comprehensive testing of migrated workloads',
            responsible: 'QA Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-5',
            risk: 'Data loss during migration',
            probability: 'Low',
            impact: 'High',
            mitigation: 'Implement backup and validation procedures for all data transfers',
          },
          {
            id: 'risk-6',
            risk: 'Application downtime exceeds window',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Use blue-green deployment and have rollback plans ready',
          },
        ],
        dependencies: ['planning'],
      },
      {
        id: 'validation',
        name: 'Validation & Cutover',
        description: 'Final testing, user acceptance, and production cutover',
        duration: 4,
        checklist: [
          {
            id: 'uat-1',
            task: 'User acceptance testing',
            description: 'Conduct UAT with business stakeholders',
            responsible: 'Business Users',
            completed: false,
          },
          {
            id: 'perf-2',
            task: 'Performance validation',
            description: 'Verify performance meets or exceeds baseline',
            responsible: 'Operations Team',
            completed: false,
          },
          {
            id: 'sec-2',
            task: 'Security validation',
            description: 'Security assessment and penetration testing',
            responsible: 'Security Team',
            completed: false,
          },
          {
            id: 'cut-1',
            task: 'Production cutover',
            description: 'Execute cutover to AWS production environment',
            responsible: 'Migration Team',
            completed: false,
          },
          {
            id: 'mon-1',
            task: 'Monitoring setup',
            description: 'Configure CloudWatch and monitoring dashboards',
            responsible: 'Operations Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-7',
            risk: 'User acceptance issues',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Engage users early and provide adequate training',
          },
          {
            id: 'risk-8',
            risk: 'Rollback required post-cutover',
            probability: 'Low',
            impact: 'High',
            mitigation: 'Maintain on-premises environment until stable period achieved',
          },
        ],
        dependencies: ['migration'],
      },
      {
        id: 'optimization',
        name: 'Optimization & Closure',
        description: 'Optimize costs and performance, decommission on-premises infrastructure',
        duration: 8,
        checklist: [
          {
            id: 'opt-1',
            task: 'Cost optimization',
            description: 'Right-size instances and implement Reserved Instances',
            responsible: 'FinOps Team',
            completed: false,
          },
          {
            id: 'opt-2',
            task: 'Performance tuning',
            description: 'Optimize application performance and resource usage',
            responsible: 'Operations Team',
            completed: false,
          },
          {
            id: 'doc-1',
            task: 'Documentation',
            description: 'Complete runbooks and operational documentation',
            responsible: 'Technical Writers',
            completed: false,
          },
          {
            id: 'decomm-1',
            task: 'Decommission on-prem',
            description: 'Safely decommission legacy datacenter resources',
            responsible: 'Infrastructure Team',
            completed: false,
          },
          {
            id: 'close-1',
            task: 'Project closure',
            description: 'Lessons learned and project sign-off',
            responsible: 'Project Manager',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-9',
            risk: 'Unexpected cost overruns',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Implement cost monitoring and alerting from day one',
          },
          {
            id: 'risk-10',
            risk: 'Knowledge loss during transition',
            probability: 'High',
            impact: 'Medium',
            mitigation: 'Document extensively and conduct knowledge transfer sessions',
          },
        ],
        dependencies: ['validation'],
      },
    ],
  },
  {
    id: 'hybrid-azure',
    name: 'On-Premises to Azure Hybrid',
    description:
      'Establish hybrid cloud architecture with Azure, maintaining some workloads on-premises',
    sourceEnvironment: 'On-Premises Infrastructure',
    targetEnvironment: 'Microsoft Azure (Hybrid)',
    applicationCount: 30,
    dataVolume: '25 TB',
    recommendedStrategy: 'rehost',
    estimatedDuration: '4-8 months',
    estimatedCost: '$300K - $700K',
    complexity: 'Medium',
    phases: [
      {
        id: 'assessment',
        name: 'Hybrid Assessment',
        description: 'Assess workloads for hybrid cloud suitability',
        duration: 3,
        checklist: [
          {
            id: 'work-1',
            task: 'Workload classification',
            description: 'Classify workloads as cloud, hybrid, or on-premises',
            responsible: 'Architecture Team',
            completed: false,
          },
          {
            id: 'conn-1',
            task: 'Connectivity assessment',
            description: 'Evaluate network connectivity requirements (ExpressRoute/VPN)',
            responsible: 'Network Team',
            completed: false,
          },
          {
            id: 'id-1',
            task: 'Identity strategy',
            description: 'Design Azure AD integration with on-premises AD',
            responsible: 'Identity Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-h1',
            risk: 'Inadequate bandwidth for hybrid connectivity',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Conduct bandwidth assessment and upgrade if necessary',
          },
        ],
        dependencies: [],
      },
      {
        id: 'planning',
        name: 'Hybrid Architecture Design',
        description: 'Design hybrid connectivity and workload placement',
        duration: 4,
        checklist: [
          {
            id: 'net-1',
            task: 'Network design',
            description: 'Design Azure virtual networks and hybrid connectivity',
            responsible: 'Network Architect',
            completed: false,
          },
          {
            id: 'place-1',
            task: 'Workload placement',
            description: 'Determine which workloads migrate and which stay on-prem',
            responsible: 'Cloud Architect',
            completed: false,
          },
          {
            id: 'sync-1',
            task: 'Data synchronization',
            description: 'Design data sync strategy for hybrid scenarios',
            responsible: 'Database Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-h2',
            risk: 'Latency issues between on-prem and cloud',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Design for eventual consistency and minimize cross-environment calls',
          },
        ],
        dependencies: ['assessment'],
      },
      {
        id: 'migration',
        name: 'Hybrid Implementation',
        description: 'Implement hybrid connectivity and migrate selected workloads',
        duration: 12,
        checklist: [
          {
            id: 'conn-2',
            task: 'ExpressRoute setup',
            description: 'Configure Azure ExpressRoute for private connectivity',
            responsible: 'Network Team',
            completed: false,
          },
          {
            id: 'id-2',
            task: 'Azure AD Connect',
            description: 'Deploy and configure Azure AD Connect for identity sync',
            responsible: 'Identity Team',
            completed: false,
          },
          {
            id: 'mig-1',
            task: 'Migrate cloud workloads',
            description: 'Migrate selected applications to Azure',
            responsible: 'Migration Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-h3',
            risk: 'Identity synchronization failures',
            probability: 'Low',
            impact: 'High',
            mitigation: 'Implement monitoring and alerts for AD Connect sync status',
          },
        ],
        dependencies: ['planning'],
      },
      {
        id: 'validation',
        name: 'Hybrid Validation',
        description: 'Test hybrid scenarios and validate connectivity',
        duration: 3,
        checklist: [
          {
            id: 'test-h1',
            task: 'Connectivity testing',
            description: 'Verify hybrid connectivity performance and reliability',
            responsible: 'Network Team',
            completed: false,
          },
          {
            id: 'test-h2',
            task: 'Failover testing',
            description: 'Test failover scenarios between on-prem and cloud',
            responsible: 'Operations Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-h4',
            risk: 'Failover mechanisms not working as expected',
            probability: 'Low',
            impact: 'High',
            mitigation: 'Regular failover drills and automated testing',
          },
        ],
        dependencies: ['migration'],
      },
      {
        id: 'optimization',
        name: 'Hybrid Optimization',
        description: 'Optimize hybrid architecture for cost and performance',
        duration: 4,
        checklist: [
          {
            id: 'opt-h1',
            task: 'Traffic optimization',
            description: 'Optimize data flow between on-prem and Azure',
            responsible: 'Network Team',
            completed: false,
          },
          {
            id: 'opt-h2',
            task: 'Cost review',
            description: 'Review hybrid costs and optimize resource allocation',
            responsible: 'FinOps Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-h5',
            risk: 'Higher than expected hybrid operational costs',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Implement cost monitoring and regular optimization reviews',
          },
        ],
        dependencies: ['validation'],
      },
    ],
  },
  {
    id: 'multi-cloud',
    name: 'Multi-Cloud Strategy',
    description:
      'Distribute workloads across AWS, Azure, and GCP for resilience and vendor diversification',
    sourceEnvironment: 'Single Cloud Provider',
    targetEnvironment: 'AWS + Azure + GCP',
    applicationCount: 60,
    dataVolume: '100 TB',
    recommendedStrategy: 'refactor',
    estimatedDuration: '12-18 months',
    estimatedCost: '$1.5M - $3M',
    complexity: 'High',
    phases: [
      {
        id: 'assessment',
        name: 'Multi-Cloud Assessment',
        description: 'Assess workload placement and define multi-cloud strategy',
        duration: 6,
        checklist: [
          {
            id: 'mc-1',
            task: 'Provider evaluation',
            description: 'Evaluate strengths of each cloud provider for different workloads',
            responsible: 'Architecture Team',
            completed: false,
          },
          {
            id: 'mc-2',
            task: 'Governance framework',
            description: 'Establish multi-cloud governance and standards',
            responsible: 'Cloud Governance',
            completed: false,
          },
          {
            id: 'mc-3',
            task: 'Tool selection',
            description: 'Select multi-cloud management and monitoring tools',
            responsible: 'Operations Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-mc1',
            risk: 'Complexity overwhelming team capabilities',
            probability: 'High',
            impact: 'High',
            mitigation: 'Hire experienced multi-cloud architects and provide extensive training',
          },
        ],
        dependencies: [],
      },
      {
        id: 'planning',
        name: 'Multi-Cloud Architecture',
        description: 'Design standardized architectures across cloud providers',
        duration: 8,
        checklist: [
          {
            id: 'mc-4',
            task: 'Reference architectures',
            description: 'Create reference architectures for each cloud provider',
            responsible: 'Cloud Architects',
            completed: false,
          },
          {
            id: 'mc-5',
            task: 'IaC templates',
            description: 'Develop Terraform/IaC templates for multi-cloud deployment',
            responsible: 'DevOps Team',
            completed: false,
          },
          {
            id: 'mc-6',
            task: 'Data strategy',
            description: 'Design multi-cloud data synchronization and backup strategy',
            responsible: 'Data Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-mc2',
            risk: 'Inconsistent implementations across clouds',
            probability: 'High',
            impact: 'Medium',
            mitigation: 'Use Infrastructure as Code and automated deployment pipelines',
          },
        ],
        dependencies: ['assessment'],
      },
      {
        id: 'migration',
        name: 'Multi-Cloud Migration',
        description: 'Migrate workloads to optimal cloud providers',
        duration: 24,
        checklist: [
          {
            id: 'mc-7',
            task: 'AWS workloads',
            description: 'Migrate compute-intensive workloads to AWS',
            responsible: 'AWS Team',
            completed: false,
          },
          {
            id: 'mc-8',
            task: 'Azure workloads',
            description: 'Migrate enterprise apps and hybrid workloads to Azure',
            responsible: 'Azure Team',
            completed: false,
          },
          {
            id: 'mc-9',
            task: 'GCP workloads',
            description: 'Migrate data analytics and ML workloads to GCP',
            responsible: 'GCP Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-mc3',
            risk: 'Cross-cloud networking complexity',
            probability: 'High',
            impact: 'High',
            mitigation: 'Use cloud interconnects and SD-WAN solutions',
          },
        ],
        dependencies: ['planning'],
      },
      {
        id: 'validation',
        name: 'Multi-Cloud Testing',
        description: 'Validate cross-cloud functionality and failover',
        duration: 6,
        checklist: [
          {
            id: 'mc-10',
            task: 'Cross-cloud testing',
            description: 'Test applications spanning multiple cloud providers',
            responsible: 'QA Team',
            completed: false,
          },
          {
            id: 'mc-11',
            task: 'Disaster recovery',
            description: 'Test cross-cloud DR and failover scenarios',
            responsible: 'Operations Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-mc4',
            risk: 'Failover latency exceeds SLAs',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Design for active-active multi-cloud where possible',
          },
        ],
        dependencies: ['migration'],
      },
      {
        id: 'optimization',
        name: 'Multi-Cloud Optimization',
        description: 'Optimize costs and workload placement across clouds',
        duration: 8,
        checklist: [
          {
            id: 'mc-12',
            task: 'Cost optimization',
            description: 'Optimize spend across all cloud providers',
            responsible: 'FinOps Team',
            completed: false,
          },
          {
            id: 'mc-13',
            task: 'Workload rebalancing',
            description: 'Rebalance workloads based on performance and cost data',
            responsible: 'Architecture Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-mc5',
            risk: 'Higher operational costs than expected',
            probability: 'High',
            impact: 'High',
            mitigation: 'Implement comprehensive cost monitoring and optimization processes',
          },
        ],
        dependencies: ['validation'],
      },
    ],
  },
  {
    id: 'disaster-recovery',
    name: 'Disaster Recovery Setup',
    description: 'Implement cloud-based disaster recovery for business continuity',
    sourceEnvironment: 'Production On-Premises',
    targetEnvironment: 'AWS DR Site',
    applicationCount: 20,
    dataVolume: '30 TB',
    recommendedStrategy: 'rehost',
    estimatedDuration: '3-6 months',
    estimatedCost: '$200K - $500K',
    complexity: 'Medium',
    phases: [
      {
        id: 'assessment',
        name: 'DR Assessment',
        description: 'Assess business continuity requirements and define RTO/RPO',
        duration: 2,
        checklist: [
          {
            id: 'dr-1',
            task: 'Business impact analysis',
            description: 'Identify critical applications and their recovery requirements',
            responsible: 'Business Continuity',
            completed: false,
          },
          {
            id: 'dr-2',
            task: 'RTO/RPO definition',
            description: 'Define Recovery Time and Recovery Point Objectives',
            responsible: 'Executive Team',
            completed: false,
          },
          {
            id: 'dr-3',
            task: 'DR strategy selection',
            description:
              'Select appropriate DR strategy (backup/restore, pilot light, warm standby, hot standby)',
            responsible: 'Architecture Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-dr1',
            risk: 'Unrealistic RTO/RPO expectations',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Educate stakeholders on costs vs. benefits of aggressive targets',
          },
        ],
        dependencies: [],
      },
      {
        id: 'planning',
        name: 'DR Design',
        description: 'Design disaster recovery architecture and procedures',
        duration: 3,
        checklist: [
          {
            id: 'dr-4',
            task: 'DR architecture',
            description: 'Design AWS DR site architecture',
            responsible: 'Cloud Architect',
            completed: false,
          },
          {
            id: 'dr-5',
            task: 'Replication strategy',
            description: 'Design data replication mechanism',
            responsible: 'Database Team',
            completed: false,
          },
          {
            id: 'dr-6',
            task: 'Runbook creation',
            description: 'Create detailed DR activation runbooks',
            responsible: 'Operations Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-dr2',
            risk: 'Data replication lag exceeds RPO',
            probability: 'Medium',
            impact: 'High',
            mitigation: 'Use synchronous replication for critical databases',
          },
        ],
        dependencies: ['assessment'],
      },
      {
        id: 'migration',
        name: 'DR Implementation',
        description: 'Implement DR infrastructure and replication',
        duration: 8,
        checklist: [
          {
            id: 'dr-7',
            task: 'DR site provisioning',
            description: 'Provision AWS DR infrastructure',
            responsible: 'Cloud Team',
            completed: false,
          },
          {
            id: 'dr-8',
            task: 'Replication setup',
            description: 'Configure data replication to AWS',
            responsible: 'Database Team',
            completed: false,
          },
          {
            id: 'dr-9',
            task: 'Automation',
            description: 'Automate DR failover and failback procedures',
            responsible: 'DevOps Team',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-dr3',
            risk: 'Replication failures not detected',
            probability: 'Low',
            impact: 'High',
            mitigation: 'Implement continuous monitoring and alerting for replication health',
          },
        ],
        dependencies: ['planning'],
      },
      {
        id: 'validation',
        name: 'DR Testing',
        description: 'Test disaster recovery procedures and validate RTO/RPO',
        duration: 4,
        checklist: [
          {
            id: 'dr-10',
            task: 'Failover test',
            description: 'Conduct DR failover test',
            responsible: 'Operations Team',
            completed: false,
          },
          {
            id: 'dr-11',
            task: 'Failback test',
            description: 'Test failback to primary site',
            responsible: 'Operations Team',
            completed: false,
          },
          {
            id: 'dr-12',
            task: 'RTO/RPO validation',
            description: 'Validate actual RTO/RPO against targets',
            responsible: 'Business Continuity',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-dr4',
            risk: 'DR test reveals gaps in procedures',
            probability: 'High',
            impact: 'Medium',
            mitigation: 'Iterative testing and continuous improvement of procedures',
          },
        ],
        dependencies: ['migration'],
      },
      {
        id: 'optimization',
        name: 'DR Optimization',
        description: 'Optimize DR costs and improve procedures',
        duration: 3,
        checklist: [
          {
            id: 'dr-13',
            task: 'Cost optimization',
            description: 'Right-size DR infrastructure and optimize replication',
            responsible: 'FinOps Team',
            completed: false,
          },
          {
            id: 'dr-14',
            task: 'Regular drills',
            description: 'Establish regular DR drill schedule',
            responsible: 'Business Continuity',
            completed: false,
          },
        ],
        risks: [
          {
            id: 'risk-dr5',
            risk: 'DR costs exceed budget',
            probability: 'Medium',
            impact: 'Medium',
            mitigation: 'Regular cost reviews and optimization of DR resource usage',
          },
        ],
        dependencies: ['validation'],
      },
    ],
  },
];

// Default cost model for comparison
export const defaultCostModel: CostModel = {
  onPremise: {
    hardware: 500000,
    software: 150000,
    datacenter: 200000,
    personnel: 400000,
    maintenance: 100000,
  },
  cloud: {
    compute: 300000,
    storage: 100000,
    networking: 50000,
    services: 150000,
    support: 75000,
  },
};

// Calculate total costs
export const calculateTotalCost = (model: CostModel) => {
  const onPremTotal = Object.values(model.onPremise).reduce((sum, val) => sum + val, 0);
  const cloudTotal = Object.values(model.cloud).reduce((sum, val) => sum + val, 0);
  return { onPremTotal, cloudTotal, savings: onPremTotal - cloudTotal };
};

// Risk severity calculation
export const calculateRiskSeverity = (probability: string, impact: string): number => {
  const probValue = { Low: 1, Medium: 2, High: 3 }[probability] || 2;
  const impactValue = { Low: 1, Medium: 2, High: 3 }[impact] || 2;
  return probValue * impactValue;
};

// Progress calculation for phases
export const calculatePhaseProgress = (phase: MigrationPhase): number => {
  const completed = phase.checklist.filter((item) => item.completed).length;
  return Math.round((completed / phase.checklist.length) * 100);
};
