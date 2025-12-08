/**
 * Cloud terminology and service definitions
 */

import type { CloudTermCategory, ServiceComparisonRow, UseCaseMatch } from '../types';

export const CLOUD_TERMS: CloudTermCategory = {
  'Deployment Models': {
    Public: 'Cloud resources accessible to general public. Shared infrastructure, lower cost.',
    Private: 'Cloud resources exclusively for one organization. Higher control and security.',
    Hybrid: 'Combination of public and private clouds with integrated connectivity.',
  },
  'Service Models': {
    SaaS: 'Software as a Service - ready-to-use applications (e.g., Office 365, Salesforce)',
    PaaS: 'Platform as a Service - development environment (e.g., Azure App Service, Heroku)',
    IaaS: 'Infrastructure as a Service - compute/storage/networking (e.g., EC2, Azure VMs)',
  },
  'Key Concepts': {
    Scalability: 'Ability to handle increased workload by adding resources',
    Elasticity: 'Automatic adjustment of resources based on demand',
    Multitenancy: 'Multiple customers sharing same resources with logical separation',
    NFV: 'Network Function Virtualization - replace hardware appliances with virtual functions',
  },
};

export const SERVICE_COMPARISON: ServiceComparisonRow[] = [
  {
    aspect: 'What you manage',
    SaaS: 'Nothing - fully managed',
    PaaS: 'Code and data',
    IaaS: 'OS, middleware, runtime, data',
  },
  {
    aspect: 'Deployment flexibility',
    SaaS: 'None - pre-configured',
    PaaS: 'High within platform constraints',
    IaaS: 'Maximum flexibility',
  },
  {
    aspect: 'Cost model',
    SaaS: 'Per-user subscription',
    PaaS: 'Pay-per-use + reserved instances',
    IaaS: 'Pay-per-resource hourly/monthly',
  },
  {
    aspect: 'Best for',
    SaaS: 'Business applications, email',
    PaaS: 'Web apps, APIs, microservices',
    IaaS: 'Large infrastructure, customization',
  },
];

export const USE_CASE_MATCHES: UseCaseMatch[] = [
  {
    scenario: 'Company needs enterprise email and collaboration',
    deployment: 'Public',
    service: 'SaaS',
    examples: 'Microsoft 365, Google Workspace',
  },
  {
    scenario: 'Building containerized microservices API',
    deployment: 'Public',
    service: 'PaaS',
    examples: 'Azure App Service, Cloud Run',
  },
  {
    scenario: 'Legacy app requiring Windows Server OS',
    deployment: 'Any',
    service: 'IaaS',
    examples: 'EC2, Azure VMs',
  },
  {
    scenario: 'Healthcare system with data residency requirements',
    deployment: 'Private/Hybrid',
    service: 'Any',
    examples: 'On-premises + VPN to public cloud',
  },
  {
    scenario: 'Startup needing rapid scaling (0-1M users)',
    deployment: 'Public',
    service: 'PaaS',
    examples: 'Elastic load balancing + auto-scaling',
  },
  {
    scenario: 'Multi-tenant SaaS application',
    deployment: 'Public',
    service: 'PaaS + IaaS',
    examples: 'Microservices with managed DB',
  },
];
