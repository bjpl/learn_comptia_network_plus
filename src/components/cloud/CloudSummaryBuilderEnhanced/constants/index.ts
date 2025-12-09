/**
 * Constants for Cloud Summary Builder Enhanced
 */

import type {
  CloudTerms,
  ServiceComparisonRow,
  UseCase,
  CostProfiles,
  ExamQuestion,
} from '../types';

// Cloud terminology
export const CLOUD_TERMS: CloudTerms = {
  'Deployment Models': {
    Public: 'Accessible to general public. Shared infrastructure, lower cost.',
    Private: 'Exclusively for one organization. Higher control and security.',
    Hybrid: 'Combination of public and private clouds with integrated connectivity.',
  },
  'Service Models': {
    SaaS: 'Software as a Service - ready-to-use applications (Office 365, Salesforce)',
    PaaS: 'Platform as a Service - development environment (Azure App Service, Heroku)',
    IaaS: 'Infrastructure as a Service - compute/storage/networking (EC2, Azure VMs)',
  },
  'Key Concepts': {
    Scalability: 'Ability to handle increased workload by adding resources',
    Elasticity: 'Automatic adjustment of resources based on real-time demand',
    Multitenancy: 'Multiple customers sharing same resources with logical separation',
    NFV: 'Network Function Virtualization - replace hardware appliances with virtual functions',
  },
};

// Service comparison data
export const SERVICE_COMPARISON: ServiceComparisonRow[] = [
  { aspect: 'Management', SaaS: 'Fully managed', PaaS: 'Code and data', IaaS: 'OS, runtime, data' },
  { aspect: 'Flexibility', SaaS: 'None', PaaS: 'High', IaaS: 'Maximum' },
  { aspect: 'Cost Model', SaaS: 'Per-user', PaaS: 'Pay-per-use', IaaS: 'Per-resource' },
  { aspect: 'Best For', SaaS: 'Business apps', PaaS: 'Web APIs', IaaS: 'Large infra' },
];

// Real-world use cases
export const USE_CASES: UseCase[] = [
  {
    scenario: 'Enterprise email system',
    deployment: 'Public',
    service: 'SaaS',
    example: 'Microsoft 365',
  },
  {
    scenario: 'Containerized microservices',
    deployment: 'Public',
    service: 'PaaS',
    example: 'Cloud Run',
  },
  { scenario: 'Legacy Windows app', deployment: 'Any', service: 'IaaS', example: 'EC2 instances' },
  {
    scenario: 'Healthcare with data residency',
    deployment: 'Hybrid',
    service: 'Any',
    example: 'On-prem + VPN',
  },
  {
    scenario: 'Startup rapid scaling',
    deployment: 'Public',
    service: 'PaaS',
    example: 'Auto-scaling groups',
  },
  {
    scenario: 'Multi-tenant SaaS',
    deployment: 'Public',
    service: 'PaaS+IaaS',
    example: 'Microservices',
  },
];

// Cost calculator profiles
export const COST_PROFILES: CostProfiles = {
  'Small website': { compute: 50, storage: 5, bandwidth: 10, total: 65 },
  'Medium app': { compute: 300, storage: 100, bandwidth: 50, total: 450 },
  Enterprise: { compute: 2000, storage: 1000, bandwidth: 500, total: 3500 },
};

// Exam questions
export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    question:
      'A company needs to deploy applications without managing servers. Which service model?',
    options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
    correct: 'PaaS',
    explanation:
      'PaaS provides platform without server management - deploy code and platform handles infrastructure.',
  },
  {
    id: 'q2',
    question: 'What is hybrid cloud best for?',
    options: [
      'Unlimited scalability',
      'Data residency requirements',
      'Cost reduction',
      'Simplified management',
    ],
    correct: 'Data residency requirements',
    explanation:
      'Hybrid clouds allow sensitive data on-premises (meeting regulations) while using public cloud for other workloads.',
  },
  {
    id: 'q3',
    question: 'Which allows automatic resource adjustment based on demand?',
    options: ['Scalability', 'Elasticity', 'Multitenancy', 'Virtualization'],
    correct: 'Elasticity',
    explanation:
      'Elasticity is automatic scaling based on real-time demand, while scalability is capacity to handle load.',
  },
  {
    id: 'q4',
    question: 'How is customer data isolated in multi-tenant clouds?',
    options: [
      'Separate servers',
      'Separate regions',
      'VPCs and security groups',
      'Only encryption',
    ],
    correct: 'VPCs and security groups',
    explanation:
      'Multi-tenant uses logical isolation (VPCs, network policies) to separate customer data in shared infrastructure.',
  },
];
