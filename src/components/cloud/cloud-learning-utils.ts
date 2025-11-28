/**
 * Learning utilities and educational content for Cloud Architecture Designer
 * Provides tooltips, explanations, templates, and cost estimations
 */

import type { ArchitectureComponent, ArchitectureDesign, ComponentType } from './cloud-types';

/**
 * Tooltip system for educational context
 */
export interface Tooltip {
  title: string;
  description: string;
  learnMore?: string;
  example?: string;
  bestPractice?: string;
}

/**
 * Architecture template for common patterns
 */
export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Web' | 'Data' | 'Enterprise' | 'Serverless' | 'Hybrid';
  components: Partial<ArchitectureComponent>[];
  learningObjectives: string[];
  estimatedCost: string;
  icon: string;
}

/**
 * Cost estimation data
 */
export interface CostEstimate {
  monthlyMin: number;
  monthlyMax: number;
  breakdown: {
    component: string;
    cost: string;
    factor: string;
  }[];
  recommendations: string[];
}

/**
 * Security consideration
 */
export interface SecurityHint {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  remediation: string;
  affectedComponents?: string[];
}

/**
 * Comprehensive tooltip library for cloud concepts
 */
export const cloudTooltips: Record<string, Tooltip> = {
  // Deployment Models
  'Public Cloud': {
    title: 'Public Cloud Deployment',
    description:
      'Multi-tenant infrastructure operated by third-party providers (AWS, Azure, GCP). Resources are shared across multiple organizations.',
    learnMore:
      'Public clouds offer the highest scalability and cost-effectiveness through economies of scale. Pay only for what you use.',
    example: 'Hosting a web application on AWS EC2 with S3 storage',
    bestPractice:
      'Use for non-sensitive workloads, development/test environments, and applications that benefit from global scale.',
  },
  'Private Cloud': {
    title: 'Private Cloud Deployment',
    description:
      'Dedicated cloud infrastructure for a single organization. Can be on-premises or hosted by a provider.',
    learnMore:
      'Private clouds provide maximum control, customization, and data sovereignty but require higher upfront investment.',
    example: 'On-premises VMware infrastructure for banking applications',
    bestPractice:
      'Use for regulated industries (healthcare, finance), sensitive data, and when custom configurations are required.',
  },
  'Hybrid Zone': {
    title: 'Hybrid Cloud Architecture',
    description:
      'Combination of public and private cloud resources, connected through networking solutions.',
    learnMore:
      'Hybrid clouds balance flexibility, compliance, and cost by placing workloads where they make the most sense.',
    example: 'Sensitive data on-premises with burst capacity to public cloud',
    bestPractice:
      'Use for data sovereignty requirements, cloud migration strategies, and optimizing workload placement.',
  },

  // Service Models
  'SaaS Application': {
    title: 'Software as a Service (SaaS)',
    description:
      'Fully managed applications delivered over the internet. Provider manages everything from infrastructure to application.',
    learnMore:
      'SaaS requires zero infrastructure management, automatic updates, and easy collaboration but offers limited customization.',
    example: 'Salesforce, Office 365, Slack, Google Workspace',
    bestPractice: 'Use for standard business applications where customization needs are minimal.',
  },
  'PaaS Platform': {
    title: 'Platform as a Service (PaaS)',
    description:
      'Managed runtime environment for building and deploying applications. You manage the application and data.',
    learnMore:
      'PaaS accelerates development by providing built-in services (databases, caching, messaging) without infrastructure management.',
    example: 'Heroku, AWS Lambda, Azure App Service, Google Cloud Run',
    bestPractice:
      'Use for rapid application development, microservices, and when you want to focus on code, not infrastructure.',
  },
  'IaaS Infrastructure': {
    title: 'Infrastructure as a Service (IaaS)',
    description:
      'Virtual machines, storage, and networking. You manage OS, middleware, and applications.',
    learnMore:
      'IaaS provides maximum flexibility and control but requires managing operating systems, patches, and security.',
    example: 'AWS EC2, Azure VMs, GCP Compute Engine, DigitalOcean Droplets',
    bestPractice:
      'Use when you need complete control over the environment, for legacy applications, or specialized configurations.',
  },

  // Connectivity
  'VPN Tunnel': {
    title: 'VPN (Virtual Private Network)',
    description: 'Encrypted connection over the internet between your network and the cloud.',
    learnMore:
      'VPNs are cost-effective ($50-200/month) but have variable latency (20-100ms) and limited bandwidth (50-500 Mbps).',
    example: 'IPSec tunnel from office router to AWS VPC',
    bestPractice:
      'Use for small offices, remote access, backup connectivity, or when dedicated connections are cost-prohibitive.',
  },
  'Direct Connect Link': {
    title: 'Direct Connect / Dedicated Connection',
    description:
      'Private, dedicated network connection (1-100 Gbps) between your data center and cloud provider.',
    learnMore:
      'Direct connections offer consistent low latency (<10ms), high bandwidth, and enhanced security but cost $500-5000+/month.',
    example: 'AWS Direct Connect, Azure ExpressRoute, GCP Dedicated Interconnect',
    bestPractice:
      'Use for mission-critical workloads, large data transfers, hybrid architectures requiring low latency.',
  },
  'Internet Connection': {
    title: 'Public Internet Gateway',
    description:
      'Standard internet connectivity for public-facing services and general internet access.',
    learnMore:
      'Internet connections are simple and cost-effective but have variable performance and security relies on application-level encryption.',
    example: 'Public website hosted on cloud with HTTPS',
    bestPractice:
      'Use for public web services, APIs, and when users connect from anywhere on the internet.',
  },

  // VPC Elements
  Subnet: {
    title: 'VPC Subnet',
    description:
      'Isolated network segment within a VPC with its own IP address range (CIDR block).',
    learnMore:
      'Subnets enable network segmentation for security and organization. Public subnets have internet access; private subnets do not.',
    example:
      'Public subnet (10.0.1.0/24) for web servers, Private subnet (10.0.2.0/24) for databases',
    bestPractice:
      'Use multiple subnets to separate tiers (web, app, database) and implement defense in depth.',
  },
  'Security Group': {
    title: 'Security Group (Firewall Rules)',
    description: 'Stateful firewall that controls inbound and outbound traffic for resources.',
    learnMore:
      'Security groups act as virtual firewalls at the instance level. They are stateful (return traffic automatically allowed).',
    example: 'Allow HTTPS (443) from internet, allow SSH (22) from admin subnet only',
    bestPractice:
      'Follow principle of least privilege: only open required ports to required sources.',
  },
  'Network List': {
    title: 'Network ACL (Access Control List)',
    description:
      'Stateless firewall at the subnet level that controls traffic in and out of subnets.',
    learnMore:
      'NACLs are stateless (must explicitly allow return traffic) and evaluated before security groups.',
    example: 'Deny all traffic from suspicious IP ranges at subnet boundary',
    bestPractice: 'Use NACLs for subnet-level protection and to explicitly deny known bad actors.',
  },

  // Gateways
  'Internet Gateway': {
    title: 'Internet Gateway (IGW)',
    description:
      'Allows resources in public subnets to connect to the internet for inbound and outbound traffic.',
    learnMore:
      'IGW is horizontally scaled, redundant, and highly available. Required for any internet-facing resources.',
    example: 'Web servers in public subnet receive traffic from internet via IGW',
    bestPractice: 'Only attach IGW to subnets that need direct internet access. One IGW per VPC.',
  },
  'NAT Gateway': {
    title: 'NAT Gateway (Network Address Translation)',
    description:
      'Enables resources in private subnets to access the internet for outbound traffic while remaining private.',
    learnMore:
      'NAT Gateway allows downloading updates, accessing external APIs, but blocks inbound connections from internet.',
    example: 'Database servers download patches from internet without exposing public IP',
    bestPractice: 'Deploy NAT Gateway in public subnet. Use one per AZ for high availability.',
  },

  // NFV Components
  'Virtual Router': {
    title: 'Virtual Router (Software-Defined Routing)',
    description:
      'Software-based router that routes traffic between networks without physical hardware.',
    learnMore:
      'Virtual routers use protocols like BGP, OSPF for dynamic routing and can be scaled or configured instantly.',
    example: 'Transit VPC routing traffic between multiple VPCs',
    bestPractice:
      'Use for complex routing scenarios, multi-VPC architectures, and hybrid cloud connectivity.',
  },
  'Virtual Firewall': {
    title: 'Virtual Firewall (NFV Security)',
    description:
      'Software-based firewall providing advanced security features like IPS, DPI, and URL filtering.',
    learnMore:
      'Virtual firewalls offer enterprise security features without physical appliances: deep packet inspection, intrusion prevention.',
    example: 'Palo Alto VM-Series, Cisco Firepower Virtual',
    bestPractice: 'Deploy in inline mode for production traffic, monitor mode for testing.',
  },
  'Virtual Load Balancer': {
    title: 'Virtual Load Balancer (Application Delivery)',
    description:
      'Distributes incoming traffic across multiple servers for high availability and performance.',
    learnMore:
      'Load balancers perform health checks, SSL termination, session persistence, and can auto-scale.',
    example: 'AWS Application Load Balancer, Azure Load Balancer, GCP Load Balancing',
    bestPractice: 'Use L7 (Application) load balancers for HTTP/HTTPS, L4 (Network) for TCP/UDP.',
  },

  // Architecture Concepts
  Scalability: {
    title: 'Cloud Scalability',
    description:
      'Ability to increase or decrease resources based on demand (vertical, horizontal, auto-scaling).',
    learnMore:
      'Vertical scaling adds resources to existing instances. Horizontal scaling adds more instances. Auto-scaling does this automatically.',
    example: 'Auto Scaling Group adds EC2 instances when CPU > 70%',
    bestPractice:
      'Design stateless applications for horizontal scaling. Use auto-scaling policies based on multiple metrics.',
  },
  Elasticity: {
    title: 'Cloud Elasticity',
    description: 'Automatic adjustment of resources in real-time based on current demand.',
    learnMore:
      'Elasticity is scalability with automation. Resources scale up during peaks and scale down during lulls to optimize costs.',
    example: 'Lambda functions scale from 0 to 1000+ concurrent executions automatically',
    bestPractice:
      'Combine predictive (scheduled) and reactive (metric-based) scaling for optimal elasticity.',
  },
  Multitenancy: {
    title: 'Multi-Tenancy in Cloud',
    description:
      'Multiple customers (tenants) share the same infrastructure while remaining isolated.',
    learnMore:
      'Multi-tenancy can be at shared instance level (most efficient) or dedicated instance level (most isolated).',
    example: 'SaaS application with separate database schema per customer',
    bestPractice: 'Choose tenancy model based on security requirements and cost constraints.',
  },
};

/**
 * Pre-built architecture templates for learning
 */
export const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: 'basic-web-app',
    name: '3-Tier Web Application',
    description:
      'Classic web application with load balancer, web servers, and database in separate security zones.',
    difficulty: 'Beginner',
    category: 'Web',
    icon: '🌐',
    estimatedCost: '$150-400/month',
    learningObjectives: [
      'Understand multi-tier architecture',
      'Learn VPC subnet segmentation',
      'Practice security group configuration',
      'Implement basic high availability',
    ],
    components: [
      {
        type: 'deployment-zone',
        subtype: 'Public Cloud',
        x: 50,
        y: 50,
        width: 700,
        height: 600,
      },
      {
        type: 'gateway',
        subtype: 'Internet Gateway',
        x: 100,
        y: 100,
      },
      {
        type: 'nfv-component',
        subtype: 'Virtual Load Balancer',
        x: 100,
        y: 200,
      },
      {
        type: 'vpc-element',
        subtype: 'Subnet',
        x: 100,
        y: 320,
        properties: { type: 'Public', cidr: '10.0.1.0/24' },
      },
      {
        type: 'service-layer',
        subtype: 'PaaS Platform',
        x: 120,
        y: 350,
      },
      {
        type: 'vpc-element',
        subtype: 'Subnet',
        x: 400,
        y: 320,
        properties: { type: 'Private', cidr: '10.0.2.0/24' },
      },
      {
        type: 'service-layer',
        subtype: 'IaaS Infrastructure',
        x: 420,
        y: 350,
      },
      {
        type: 'vpc-element',
        subtype: 'Security Group',
        x: 100,
        y: 500,
      },
    ],
  },
  {
    id: 'serverless-api',
    name: 'Serverless API Architecture',
    description:
      'Event-driven serverless application using managed services for APIs, compute, and storage.',
    difficulty: 'Intermediate',
    category: 'Serverless',
    icon: '⚡',
    estimatedCost: '$50-150/month',
    learningObjectives: [
      'Understand serverless paradigm',
      'Learn event-driven architecture',
      'Optimize for cost with pay-per-use',
      'Implement automatic scaling',
    ],
    components: [
      {
        type: 'deployment-zone',
        subtype: 'Public Cloud',
        x: 50,
        y: 50,
        width: 600,
        height: 500,
      },
      {
        type: 'gateway',
        subtype: 'Internet Gateway',
        x: 100,
        y: 100,
      },
      {
        type: 'service-layer',
        subtype: 'PaaS Platform',
        x: 100,
        y: 200,
      },
      {
        type: 'vpc-element',
        subtype: 'Security Group',
        x: 350,
        y: 200,
      },
    ],
  },
  {
    id: 'hybrid-enterprise',
    name: 'Hybrid Enterprise Setup',
    description:
      'Connect on-premises data center to cloud with Direct Connect for hybrid workload distribution.',
    difficulty: 'Advanced',
    category: 'Hybrid',
    icon: '🔗',
    estimatedCost: '$1000-3000/month',
    learningObjectives: [
      'Design hybrid cloud architecture',
      'Implement secure connectivity',
      'Plan workload distribution',
      'Configure cross-environment security',
    ],
    components: [
      {
        type: 'deployment-zone',
        subtype: 'Private Cloud',
        x: 50,
        y: 50,
        width: 350,
        height: 500,
      },
      {
        type: 'deployment-zone',
        subtype: 'Hybrid Zone',
        x: 420,
        y: 200,
        width: 150,
        height: 200,
      },
      {
        type: 'connectivity',
        subtype: 'Direct Connect Link',
        x: 450,
        y: 250,
      },
      {
        type: 'deployment-zone',
        subtype: 'Public Cloud',
        x: 590,
        y: 50,
        width: 400,
        height: 500,
      },
      {
        type: 'nfv-component',
        subtype: 'Virtual Firewall',
        x: 600,
        y: 200,
      },
    ],
  },
  {
    id: 'multi-az-ha',
    name: 'Multi-AZ High Availability',
    description:
      'Highly available architecture across multiple availability zones with automatic failover.',
    difficulty: 'Intermediate',
    category: 'Enterprise',
    icon: '🏢',
    estimatedCost: '$500-1200/month',
    learningObjectives: [
      'Design for high availability',
      'Implement multi-AZ deployment',
      'Configure automatic failover',
      'Understand fault tolerance',
    ],
    components: [
      {
        type: 'deployment-zone',
        subtype: 'Public Cloud',
        x: 50,
        y: 50,
        width: 800,
        height: 600,
      },
      {
        type: 'nfv-component',
        subtype: 'Virtual Load Balancer',
        x: 400,
        y: 100,
      },
      {
        type: 'vpc-element',
        subtype: 'Subnet',
        x: 100,
        y: 250,
        properties: { type: 'Public', az: 'AZ-1' },
      },
      {
        type: 'service-layer',
        subtype: 'IaaS Infrastructure',
        x: 120,
        y: 300,
      },
      {
        type: 'vpc-element',
        subtype: 'Subnet',
        x: 500,
        y: 250,
        properties: { type: 'Public', az: 'AZ-2' },
      },
      {
        type: 'service-layer',
        subtype: 'IaaS Infrastructure',
        x: 520,
        y: 300,
      },
    ],
  },
  {
    id: 'data-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Big data architecture with ingestion, processing, and analytics layers.',
    difficulty: 'Advanced',
    category: 'Data',
    icon: '📊',
    estimatedCost: '$800-2500/month',
    learningObjectives: [
      'Design data pipelines',
      'Implement ETL workflows',
      'Optimize for data processing',
      'Configure data security',
    ],
    components: [
      {
        type: 'deployment-zone',
        subtype: 'Public Cloud',
        x: 50,
        y: 50,
        width: 900,
        height: 500,
      },
      {
        type: 'gateway',
        subtype: 'Internet Gateway',
        x: 100,
        y: 100,
      },
      {
        type: 'service-layer',
        subtype: 'PaaS Platform',
        x: 100,
        y: 220,
      },
      {
        type: 'service-layer',
        subtype: 'IaaS Infrastructure',
        x: 400,
        y: 220,
      },
      {
        type: 'vpc-element',
        subtype: 'Subnet',
        x: 700,
        y: 200,
        properties: { type: 'Private' },
      },
      {
        type: 'vpc-element',
        subtype: 'Security Group',
        x: 100,
        y: 380,
      },
    ],
  },
];

/**
 * Estimate monthly cost for an architecture design
 */
export function estimateArchitectureCost(design: ArchitectureDesign): CostEstimate {
  const breakdown: CostEstimate['breakdown'] = [];
  const recommendations: string[] = [];
  let monthlyMin = 0;
  let monthlyMax = 0;

  // Analyze each component type
  const componentCounts = new Map<string, number>();
  design.components.forEach((comp) => {
    const key = `${comp.type}-${comp.subtype}`;
    componentCounts.set(key, (componentCounts.get(key) || 0) + 1);
  });

  componentCounts.forEach((count, key) => {
    const [, subtype] = key.split('-');
    let minCost = 0;
    let maxCost = 0;
    let factor = '';

    // Cost estimation logic based on component types
    switch (subtype) {
      case 'IaaS Infrastructure':
        minCost = count * 30; // $30/month per small instance
        maxCost = count * 500; // $500/month per large instance
        factor = `${count} instance(s) × $30-500 (varies by size)`;
        if (count > 5) {
          recommendations.push('Consider Reserved Instances for 40-60% savings on IaaS workloads');
        }
        break;

      case 'PaaS Platform':
        minCost = count * 25;
        maxCost = count * 300;
        factor = `${count} service(s) × $25-300 (varies by usage)`;
        recommendations.push('PaaS auto-scales, monitor usage to optimize costs');
        break;

      case 'SaaS Application':
        minCost = count * 10;
        maxCost = count * 100;
        factor = `${count} subscription(s) × $10-100/user`;
        break;

      case 'Virtual Load Balancer':
        minCost = count * 20;
        maxCost = count * 150;
        factor = `${count} load balancer(s) × $20-150 (varies by throughput)`;
        break;

      case 'Virtual Firewall':
        minCost = count * 100;
        maxCost = count * 800;
        factor = `${count} firewall(s) × $100-800 (enterprise features)`;
        break;

      case 'NAT Gateway':
        minCost = count * 45;
        maxCost = count * 150;
        factor = `${count} NAT Gateway(s) × $45 + data transfer`;
        if (count > 1) {
          recommendations.push(
            'Multiple NAT Gateways detected - consider consolidation for cost savings'
          );
        }
        break;

      case 'Direct Connect Link':
        minCost = count * 500;
        maxCost = count * 5000;
        factor = `${count} connection(s) × $500-5000 (varies by bandwidth)`;
        recommendations.push('Direct Connect has high fixed costs but low data transfer fees');
        break;

      case 'VPN Tunnel':
        minCost = count * 36;
        maxCost = count * 72;
        factor = `${count} VPN(s) × $36-72/month`;
        break;

      default:
        // No cost for logical components like subnets, security groups
        factor = 'No additional cost';
    }

    if (minCost > 0 || maxCost > 0) {
      breakdown.push({
        component: subtype,
        cost: `$${minCost}-${maxCost}`,
        factor,
      });
      monthlyMin += minCost;
      monthlyMax += maxCost;
    }
  });

  // Add data transfer estimate (typically 10-20% of compute costs)
  const dataTransferMin = Math.round(monthlyMin * 0.1);
  const dataTransferMax = Math.round(monthlyMax * 0.2);
  breakdown.push({
    component: 'Data Transfer',
    cost: `$${dataTransferMin}-${dataTransferMax}`,
    factor: 'Estimated 10-20% of infrastructure costs',
  });
  monthlyMin += dataTransferMin;
  monthlyMax += dataTransferMax;

  // General recommendations
  if (monthlyMax > 1000) {
    recommendations.push(
      'Consider AWS Savings Plans or Azure Reservations for significant discounts'
    );
  }
  if (design.components.length < 3) {
    recommendations.push(
      'Architecture seems minimal - ensure all required components are included'
    );
  }
  recommendations.push('Enable cost monitoring and set budget alerts');
  recommendations.push('Review and remove unused resources regularly');

  return {
    monthlyMin,
    monthlyMax,
    breakdown,
    recommendations,
  };
}

/**
 * Analyze architecture for security issues and provide hints
 */
export function analyzeSecurityHints(design: ArchitectureDesign): SecurityHint[] {
  const hints: SecurityHint[] = [];

  // Check for public subnets without security groups
  const publicSubnets = design.components.filter(
    (c) => c.type === 'vpc-element' && c.subtype === 'Subnet' && c.properties?.type === 'Public'
  );
  const securityGroups = design.components.filter((c) => c.subtype === 'Security Group');

  if (publicSubnets.length > 0 && securityGroups.length === 0) {
    hints.push({
      type: 'critical',
      title: 'Missing Security Groups',
      description: 'Public subnets detected without security group protection.',
      remediation:
        'Add security groups to control inbound and outbound traffic. Follow principle of least privilege.',
      affectedComponents: publicSubnets.map((s) => s.id),
    });
  }

  // Check for internet-facing services without encryption
  const hasInternetGateway = design.components.some((c) => c.subtype === 'Internet Gateway');
  const hasLoadBalancer = design.components.some((c) => c.subtype === 'Virtual Load Balancer');

  if (hasInternetGateway && !hasLoadBalancer) {
    hints.push({
      type: 'warning',
      title: 'No Load Balancer for Internet Traffic',
      description: 'Internet gateway detected without load balancer for SSL/TLS termination.',
      remediation:
        'Add a load balancer to handle SSL/TLS termination and distribute traffic securely.',
    });
  }

  // Check for private subnets without NAT Gateway
  const privateSubnets = design.components.filter(
    (c) => c.type === 'vpc-element' && c.subtype === 'Subnet' && c.properties?.type === 'Private'
  );
  const natGateways = design.components.filter((c) => c.subtype === 'NAT Gateway');

  if (privateSubnets.length > 0 && natGateways.length === 0) {
    hints.push({
      type: 'info',
      title: 'Private Subnets Without NAT',
      description: 'Private subnets cannot access internet for updates without NAT Gateway.',
      remediation:
        'Add NAT Gateway in public subnet to allow private instances to download updates securely.',
      affectedComponents: privateSubnets.map((s) => s.id),
    });
  }

  // Check for firewall in critical paths
  const hasFirewall = design.components.some((c) => c.subtype === 'Virtual Firewall');
  if (!hasFirewall && design.components.length > 5) {
    hints.push({
      type: 'warning',
      title: 'No Virtual Firewall Detected',
      description: 'Complex architecture without virtual firewall for advanced threat protection.',
      remediation:
        'Consider adding virtual firewall with IPS/DPI for enhanced security in production.',
    });
  }

  // Check for multi-tenancy without isolation
  const hasSaas = design.components.some((c) => c.subtype === 'SaaS Application');
  if (hasSaas && securityGroups.length < 2) {
    hints.push({
      type: 'info',
      title: 'Multi-Tenancy Isolation',
      description: 'SaaS application should implement strong tenant isolation.',
      remediation:
        'Use separate security groups, database schemas, or VPCs per tenant depending on security requirements.',
    });
  }

  return hints;
}

/**
 * Get contextual help based on component type
 */
export function getComponentHelp(_componentType: ComponentType, subtype: string): Tooltip | null {
  return cloudTooltips[subtype] || null;
}

/**
 * Generate guided tutorial steps for beginners
 */
export const tutorialSteps = [
  {
    step: 1,
    title: 'Choose Deployment Model',
    description: 'Start by selecting a deployment model: Public, Private, or Hybrid Cloud.',
    highlight: 'deployment-zone',
    helpText:
      'Public clouds are most common for learning. They offer easy scalability and pay-as-you-go pricing.',
    action: 'Drag a Public Cloud zone onto the canvas',
  },
  {
    step: 2,
    title: 'Add Internet Connectivity',
    description:
      'Add an Internet Gateway to allow your cloud resources to communicate with the internet.',
    highlight: 'gateway',
    helpText: 'Internet Gateways are free and provide two-way internet access for public subnets.',
    action: 'Drag an Internet Gateway into your cloud zone',
  },
  {
    step: 3,
    title: 'Create Network Segments',
    description: 'Add subnets to segment your network for security.',
    highlight: 'vpc-element',
    helpText:
      'Use public subnets for web servers and private subnets for databases. This is called defense in depth.',
    action: 'Drag a Subnet (Public) for web tier',
  },
  {
    step: 4,
    title: 'Add Security Controls',
    description: 'Add a Security Group to control traffic to your resources.',
    highlight: 'vpc-element',
    helpText:
      'Security groups act as virtual firewalls. Only allow traffic you need (e.g., HTTPS on port 443).',
    action: 'Drag a Security Group and configure rules',
  },
  {
    step: 5,
    title: 'Deploy Services',
    description: 'Add your application services (IaaS, PaaS, or SaaS).',
    highlight: 'service-layer',
    helpText:
      'PaaS is easiest for beginners as it handles infrastructure automatically. IaaS gives more control.',
    action: 'Drag a PaaS Platform into your subnet',
  },
  {
    step: 6,
    title: 'Create Connections',
    description: 'Connect components to show data flow.',
    helpText:
      'Click the chain icon on a component, then click another component to create a connection.',
    action: 'Connect Internet Gateway → Security Group → Service',
  },
  {
    step: 7,
    title: 'Validate Architecture',
    description: 'Click Validate to check your architecture against best practices.',
    helpText:
      'Validation checks for common mistakes like missing security groups or improper connectivity.',
    action: 'Click the Validate button in the toolbar',
  },
];
