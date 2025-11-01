/**
 * Cloud scenarios, component library, and validation rules
 * CompTIA Network+ Learning Objective 1.2
 */

import type { CloudScenario, ComponentLibraryItem } from './cloud-types';

export const cloudScenarios: CloudScenario[] = [
  {
    id: 'aws-hybrid-enterprise',
    title: 'AWS Hybrid Enterprise Migration',
    provider: 'AWS',
    description: `A large financial institution is migrating 40% of their workloads to AWS while maintaining critical systems on-premises due to regulatory requirements.

    They need to establish a hybrid cloud architecture that provides secure, low-latency connectivity between their on-premises data center and AWS. The solution must support 500 internal users accessing both cloud and on-premises applications seamlessly.

    Key requirements include: maintaining existing Active Directory infrastructure, implementing least-privilege access controls, ensuring data sovereignty compliance, and supporting burst capacity for end-of-month reporting workloads that can spike to 5x normal usage.

    The architecture must include isolated network segments for different sensitivity levels (public-facing web tier, application tier, database tier) with appropriate security controls. They also need to implement network function virtualization for firewall and load balancing to reduce hardware costs.

    The cloud environment will host SaaS applications (Salesforce, Office 365), custom PaaS applications (containerized microservices), and IaaS infrastructure (Windows/Linux VMs for legacy applications). Internet access from cloud resources must be controlled through centralized gateways with NAT functionality.`,
    requirements: [
      'Hybrid deployment maintaining on-premises infrastructure',
      'Secure low-latency connectivity to AWS',
      'Multi-tier network isolation',
      'Elastic scaling for batch workloads',
      'Centralized security controls',
      'Network function virtualization',
      'Multiple service models (SaaS/PaaS/IaaS)',
      'Controlled internet access with NAT'
    ],
    idealSolution: {
      deploymentModel: 'Hybrid',
      deploymentJustification: 'Regulatory requirements mandate on-premises data storage while cloud provides scalability',
      serviceModel: 'PaaS',
      serviceExamples: ['Containerized microservices on ECS/EKS', 'RDS managed databases', 'Legacy VMs on EC2'],
      connectivityMethod: 'Direct Connect',
      connectivityReasoning: 'Low-latency, high-bandwidth requirement for 500 users accessing both environments',
      nfvImplementation: 'Virtual firewalls and load balancers replace physical appliances, reducing CapEx',
      vpcConfiguration: {
        subnets: ['Public subnet for web tier', 'Private subnet for app tier', 'Isolated subnet for database tier'],
        securityGroups: ['Web-SG (allow 80/443)', 'App-SG (allow from Web-SG)', 'DB-SG (allow from App-SG)'],
        networkLists: ['Allow on-premises CIDR', 'Deny all other traffic']
      },
      cloudGateways: {
        internetGateway: true,
        natGateway: true,
        usage: 'IGW for public subnet inbound; NAT Gateway for private subnet outbound internet'
      },
      scalabilityFeatures: {
        type: 'Auto',
        description: 'Auto Scaling Groups respond to CloudWatch metrics',
        triggers: ['CPU > 70%', 'Queue depth > 1000', 'Scheduled (end-of-month)']
      },
      elasticityImplementation: 'Auto Scaling policies automatically add/remove instances; Lambda for serverless burst capacity',
      multitenancyConsiderations: ['VPC isolation per department', 'IAM role separation', 'Separate AWS accounts per business unit']
    }
  },
  {
    id: 'azure-saas-startup',
    title: 'Azure SaaS Startup Platform',
    provider: 'Azure',
    description: `A SaaS startup is building a multi-tenant customer relationship management (CRM) platform on Azure. They expect rapid growth from 10 to 10,000 customers within 18 months and need an architecture that scales efficiently.

    The platform must provide complete tenant isolation for data security and compliance. Each customer's data must be logically separated with no risk of cross-tenant data leakage. The application tier will use Azure App Service (PaaS) for hosting the web application and APIs.

    They require a public cloud deployment to minimize upfront infrastructure costs and leverage Azure's global presence for low-latency access worldwide. Connectivity will be through standard internet connections with SSL/TLS encryption.

    The architecture needs to implement virtual network functions for traffic management, including Azure Application Gateway for SSL termination and Web Application Firewall for security. Azure VNets must be configured with network security groups to control traffic between application tiers.

    Scalability is critical - the platform must automatically scale from 10 concurrent users to 100,000+ during peak hours. This requires elastic compute (App Service auto-scale), elastic storage (Azure SQL elastic pools), and elastic networking (Azure Load Balancer).`,
    requirements: [
      'Public cloud deployment for global reach',
      'PaaS services for reduced management overhead',
      'Multi-tenant data isolation',
      'Automatic scaling 10x-1000x',
      'Virtual network security controls',
      'SSL/TLS encrypted connectivity',
      'WAF and application-level security',
      'Cost optimization for startup budget'
    ],
    idealSolution: {
      deploymentModel: 'Public',
      deploymentJustification: 'Minimize CapEx; leverage global Azure infrastructure; pay-as-you-grow OpEx model',
      serviceModel: 'SaaS',
      serviceExamples: ['Azure App Service for web app', 'Azure SQL Database elastic pools', 'Azure AD B2C for authentication'],
      connectivityMethod: 'VPN',
      connectivityReasoning: 'Internet-based access sufficient for SaaS; VPN for admin access to management plane',
      nfvImplementation: 'Azure Application Gateway (virtual ADC), Azure Firewall, Traffic Manager (virtual load balancer)',
      vpcConfiguration: {
        subnets: ['Frontend subnet for App Gateway', 'Backend subnet for App Service', 'Data subnet for SQL'],
        securityGroups: ['Frontend-NSG (allow 443)', 'Backend-NSG (allow from Frontend)', 'Data-NSG (allow from Backend)'],
        networkLists: ['Allow Azure Load Balancer probes', 'Allow Azure infrastructure services']
      },
      cloudGateways: {
        internetGateway: true,
        natGateway: false,
        usage: 'Internet Gateway for inbound HTTPS traffic; App Service has outbound internet access by default'
      },
      scalabilityFeatures: {
        type: 'Auto',
        description: 'App Service Plan auto-scale based on HTTP queue length and CPU',
        triggers: ['HTTP queue > 100', 'CPU > 75%', 'Memory > 80%']
      },
      elasticityImplementation: 'Automatic scale-out/in based on metrics; SQL elastic pools share resources across tenants; CDN for static content',
      multitenancyConsiderations: ['Row-level security in SQL for tenant isolation', 'Separate App Service instances per tier', 'Azure AD tenant separation', 'Encryption at rest with customer-managed keys']
    }
  },
  {
    id: 'gcp-ml-research',
    title: 'GCP Machine Learning Research Platform',
    provider: 'GCP',
    description: `A university research department is building a machine learning platform on Google Cloud Platform for analyzing genomic data. The platform needs to process massive datasets (petabytes) with bursty compute requirements.

    The deployment is purely public cloud to leverage GCP's specialized AI/ML hardware (TPUs) and managed services. Researchers will use IaaS (Compute Engine VMs with GPUs), PaaS (Cloud AI Platform for training), and SaaS (BigQuery for data warehousing).

    Security is critical due to HIPAA compliance requirements for genomic data. The VPC must implement strict network isolation with private IP addressing and no direct internet access for compute resources. A Cloud NAT gateway will provide outbound internet for package downloads.

    Connectivity for researchers will use Cloud VPN for secure access from campus, with Direct Connect (Dedicated Interconnect) planned for transferring large datasets from on-premises sequencing equipment.

    The platform must scale horizontally from 10 VMs to 1,000+ VMs when training large models, then scale back to zero during idle periods to minimize costs. Network function virtualization will implement virtual firewalls for compliance controls and virtual load balancers for distributed training workloads.`,
    requirements: [
      'Public cloud for AI/ML specialized hardware',
      'IaaS with GPU/TPU support',
      'HIPAA-compliant network isolation',
      'Burst scaling 0-1000+ VMs',
      'Secure campus connectivity',
      'Private networking with controlled internet',
      'Virtual security appliances',
      'Cost optimization during idle periods'
    ],
    idealSolution: {
      deploymentModel: 'Public',
      deploymentJustification: 'Access to TPU/GPU hardware unavailable on-premises; elastic scaling for bursty workloads',
      serviceModel: 'IaaS',
      serviceExamples: ['Compute Engine VMs with A100 GPUs', 'Cloud AI Platform for distributed training', 'BigQuery for analytics'],
      connectivityMethod: 'Direct Connect',
      connectivityReasoning: 'Dedicated Interconnect required for multi-TB dataset transfers from sequencing equipment',
      nfvImplementation: 'Virtual firewalls enforce HIPAA controls; virtual load balancers distribute training across GPU clusters',
      vpcConfiguration: {
        subnets: ['Private subnet for compute (no external IPs)', 'Management subnet for admin access', 'Data subnet for Cloud Storage'],
        securityGroups: ['Compute-FW (deny all inbound)', 'Management-FW (allow VPN only)', 'Data-FW (allow from Compute)'],
        networkLists: ['Allow campus VPN subnet', 'Allow Google API ranges', 'Deny internet']
      },
      cloudGateways: {
        internetGateway: false,
        natGateway: true,
        usage: 'Cloud NAT for outbound package downloads; no inbound internet access'
      },
      scalabilityFeatures: {
        type: 'Horizontal',
        description: 'Managed Instance Groups scale VM count based on training queue depth',
        triggers: ['Job queue > 0 (scale to 1000)', 'Job queue = 0 (scale to 0)', 'Training completion (deallocate)']
      },
      elasticityImplementation: 'Preemptible VMs reduce costs; auto-scaling to zero during idle; Cloud Functions trigger VM creation on data arrival',
      multitenancyConsiderations: ['Separate projects per research team', 'VPC Service Controls for data perimeter', 'Encryption with customer-supplied keys', 'Audit logging for compliance']
    }
  },
  {
    id: 'multicloud-disaster-recovery',
    title: 'Multi-Cloud Disaster Recovery Strategy',
    provider: 'Multi-Cloud',
    description: `A healthcare provider is implementing a disaster recovery strategy across AWS (primary) and Azure (DR site) to meet 99.99% uptime SLA requirements.

    The primary production environment runs on AWS with a hybrid deployment model - patient records on-premises (compliance), application tier in AWS. The DR site on Azure must maintain synchronized copies of critical data and be able to activate within 15 minutes (RTO) with maximum 5 minutes of data loss (RPO).

    The architecture uses IaaS in both clouds to maintain application compatibility and simplify failover. Virtual network functions (virtual firewalls, load balancers) must be pre-deployed in both environments with identical configurations.

    Cross-cloud connectivity uses VPN tunnels between AWS VPC and Azure VNet, with Direct Connect to on-premises from AWS and ExpressRoute from Azure. This provides multiple redundant paths.

    The VPC configuration must mirror security controls across both clouds - same segmentation, same security group rules, same network ACLs. Cloud gateways are configured identically with internet gateways for public web tier and NAT gateways for private tier outbound access.

    Scalability is designed for normal loads with ability to burst during failover scenarios. Elasticity features include auto-scaling groups pre-configured but scaled to minimum capacity in DR site until activation.`,
    requirements: [
      'Multi-cloud deployment (AWS + Azure)',
      'Hybrid on-premises integration',
      '15-minute RTO, 5-minute RPO',
      'Identical security controls across clouds',
      'Redundant connectivity paths',
      'Pre-deployed DR infrastructure',
      'Synchronized data replication',
      'Cost-optimized DR site (minimal capacity)'
    ],
    idealSolution: {
      deploymentModel: 'Hybrid',
      deploymentJustification: 'On-premises for compliance; multi-cloud for disaster recovery resilience',
      serviceModel: 'IaaS',
      serviceExamples: ['AWS EC2 and Azure VMs for application compatibility', 'AWS RDS and Azure SQL for databases', 'Cross-region replication'],
      connectivityMethod: 'Direct Connect',
      connectivityReasoning: 'AWS Direct Connect + Azure ExpressRoute provide redundant low-latency paths; VPN as backup',
      nfvImplementation: 'Identical virtual firewall configs in AWS and Azure; virtual load balancers with synchronized rules',
      vpcConfiguration: {
        subnets: ['Public-DMZ (mirrored AWS/Azure)', 'Private-App (mirrored)', 'Private-Data (mirrored)'],
        securityGroups: ['Web-SG (identical rules)', 'App-SG (identical rules)', 'DB-SG (identical rules)'],
        networkLists: ['Mirror of on-premises allowed ranges', 'Cross-cloud VPN subnets']
      },
      cloudGateways: {
        internetGateway: true,
        natGateway: true,
        usage: 'Mirrored configuration: IGW for public tier, NAT Gateway for private tier outbound'
      },
      scalabilityFeatures: {
        type: 'Auto',
        description: 'DR site pre-scaled to minimum; auto-scale to production capacity on failover',
        triggers: ['Failover event (scale DR to 100%)', 'Health check failures (trigger failover)', 'Manual activation']
      },
      elasticityImplementation: 'DR site runs minimal instances (20% capacity); automation scales to 100% within RTO; post-failback scales down',
      multitenancyConsiderations: ['Separate AWS accounts for prod/DR', 'Separate Azure subscriptions', 'Identical IAM/RBAC policies', 'Cross-cloud encryption key management']
    }
  },
  {
    id: 'aws-gaming-platform',
    title: 'AWS Global Gaming Platform',
    provider: 'AWS',
    description: `A game development studio is launching a multiplayer online game with expected 1 million concurrent players worldwide. The platform must provide low-latency gameplay (< 50ms) for players across North America, Europe, and Asia-Pacific.

    The deployment is public cloud only, using AWS global infrastructure with regional deployments in us-east-1, eu-west-1, and ap-southeast-1. The service model is primarily PaaS (Elastic Container Service for game servers, DynamoDB for player data, ElastiCache for session state) with some IaaS (EC2 for matchmaking servers).

    Connectivity for players is through standard internet connections with optimized routing via AWS Global Accelerator. Game servers communicate with each other across regions using VPC peering with encryption in transit.

    The VPC architecture implements network segmentation: public subnets for Application Load Balancers (internet-facing), private subnets for ECS game servers (no public IPs), and isolated subnets for databases. Network function virtualization includes AWS Network Firewall for DDoS protection and traffic inspection.

    Scalability is critical - the platform must handle launch day spikes (10x normal capacity) and scale based on player count. Each region must independently scale while maintaining cross-region player data consistency. Elasticity features include ECS Service Auto Scaling based on CPU/memory and custom metrics (player count per server).

    Multitenancy considerations include isolating game sessions in separate ECS tasks, implementing rate limiting per player, and using separate DynamoDB tables per region with global tables for cross-region replication.`,
    requirements: [
      'Public cloud with global regional presence',
      'Low-latency gameplay (< 50ms)',
      'PaaS for containerized game servers',
      'Launch day scaling (10x capacity)',
      'Cross-region data replication',
      'DDoS protection and traffic inspection',
      'Session isolation per player',
      'Cost optimization post-launch'
    ],
    idealSolution: {
      deploymentModel: 'Public',
      deploymentJustification: 'Global AWS presence provides low-latency access; elastic scaling for unpredictable player counts',
      serviceModel: 'PaaS',
      serviceExamples: ['ECS Fargate for game servers', 'DynamoDB Global Tables for player data', 'ElastiCache Redis for sessions', 'S3 for game assets'],
      connectivityMethod: 'Internet Gateway',
      connectivityReasoning: 'Players connect via internet; AWS Global Accelerator optimizes routing; VPC peering for inter-region',
      nfvImplementation: 'AWS Network Firewall for DDoS mitigation; Application Load Balancer for L7 routing; NAT Gateway for outbound',
      vpcConfiguration: {
        subnets: ['Public (ALB in 3 AZs)', 'Private-App (ECS in 3 AZs)', 'Private-Data (DynamoDB VPC endpoints)', 'Isolated-Cache (ElastiCache)'],
        securityGroups: ['ALB-SG (allow 443, 80, UDP game ports)', 'ECS-SG (allow from ALB)', 'Cache-SG (allow from ECS)', 'DB-SG (allow from ECS)'],
        networkLists: ['Allow all player IPs', 'Rate limit per source IP', 'Block known malicious ranges']
      },
      cloudGateways: {
        internetGateway: true,
        natGateway: true,
        usage: 'IGW for ALB inbound player traffic; NAT Gateway for ECS outbound (patches, telemetry)'
      },
      scalabilityFeatures: {
        type: 'Auto',
        description: 'ECS Service Auto Scaling based on target tracking and step policies',
        triggers: ['CPU > 70% (scale out)', 'Custom metric: players per server > 100', 'Launch event (pre-scale)', 'Post-launch (scale in)']
      },
      elasticityImplementation: 'Target tracking auto-scaling maintains optimal player density; scheduled scaling for daily peaks; spot instances for cost optimization',
      multitenancyConsiderations: ['Separate ECS task per game session', 'DynamoDB partition key by player ID', 'Rate limiting via API Gateway', 'Separate CloudWatch log groups per region']
    }
  }
];

export const componentLibrary: ComponentLibraryItem[] = [
  // Deployment Models
  {
    type: 'deployment-zone',
    subtype: 'Public Cloud',
    name: 'Public Cloud Zone',
    description: 'Multi-tenant cloud infrastructure operated by third-party provider (AWS, Azure, GCP)',
    icon: '☁️',
    color: '#3B82F6',
    defaultWidth: 300,
    defaultHeight: 400,
    allowedConnections: ['connectivity', 'service-layer', 'gateway'],
    properties: [
      { key: 'provider', label: 'Cloud Provider', type: 'select', options: ['AWS', 'Azure', 'GCP', 'Oracle Cloud'], required: true },
      { key: 'region', label: 'Region', type: 'text', default: 'us-east-1' },
      { key: 'availabilityZones', label: 'Availability Zones', type: 'number', default: 3 }
    ]
  },
  {
    type: 'deployment-zone',
    subtype: 'Private Cloud',
    name: 'Private Cloud Zone',
    description: 'Dedicated cloud infrastructure for single organization (on-premises or hosted)',
    icon: '🏢',
    color: '#8B5CF6',
    defaultWidth: 300,
    defaultHeight: 400,
    allowedConnections: ['connectivity', 'service-layer', 'gateway'],
    properties: [
      { key: 'location', label: 'Location', type: 'select', options: ['On-Premises', 'Hosted Private', 'Colo'], required: true },
      { key: 'hypervisor', label: 'Hypervisor', type: 'select', options: ['VMware', 'Hyper-V', 'KVM', 'Proxmox'] },
      { key: 'complianceLevel', label: 'Compliance', type: 'select', options: ['HIPAA', 'PCI-DSS', 'FedRAMP', 'None'] }
    ]
  },
  {
    type: 'deployment-zone',
    subtype: 'Hybrid Zone',
    name: 'Hybrid Cloud Connector',
    description: 'Bridge between public and private cloud environments',
    icon: '🔗',
    color: '#10B981',
    defaultWidth: 150,
    defaultHeight: 200,
    allowedConnections: ['deployment-zone', 'connectivity'],
    properties: [
      { key: 'orchestration', label: 'Orchestration Platform', type: 'select', options: ['VMware Cloud', 'Azure Arc', 'Anthos', 'Custom'] },
      { key: 'workloadType', label: 'Workload Distribution', type: 'select', options: ['Data Locality', 'Burst to Cloud', 'DR/Backup', 'Compliance Split'] }
    ]
  },

  // Service Layers
  {
    type: 'service-layer',
    subtype: 'SaaS Application',
    name: 'SaaS Application',
    description: 'Software as a Service - fully managed applications (Salesforce, Office 365)',
    icon: '📱',
    color: '#EF4444',
    defaultWidth: 200,
    defaultHeight: 100,
    allowedConnections: ['deployment-zone', 'connectivity', 'gateway'],
    properties: [
      { key: 'application', label: 'Application Type', type: 'select', options: ['CRM', 'Email', 'Collaboration', 'Analytics', 'Custom'] },
      { key: 'licensing', label: 'Licensing Model', type: 'select', options: ['Per User', 'Per Feature', 'Consumption', 'Enterprise'] },
      { key: 'multitenancy', label: 'Tenancy Model', type: 'select', options: ['Shared', 'Dedicated Instance', 'Private Tenant'] }
    ]
  },
  {
    type: 'service-layer',
    subtype: 'PaaS Platform',
    name: 'PaaS Platform',
    description: 'Platform as a Service - managed runtime environments (App Service, Cloud Run)',
    icon: '⚙️',
    color: '#F59E0B',
    defaultWidth: 200,
    defaultHeight: 100,
    allowedConnections: ['deployment-zone', 'vpc-element', 'nfv-component'],
    properties: [
      { key: 'runtime', label: 'Runtime', type: 'select', options: ['Containers', 'Serverless', 'Web App', 'API Platform'] },
      { key: 'scaling', label: 'Auto-Scaling', type: 'boolean', default: true },
      { key: 'instances', label: 'Instance Count', type: 'number', default: 2 }
    ]
  },
  {
    type: 'service-layer',
    subtype: 'IaaS Infrastructure',
    name: 'IaaS Infrastructure',
    description: 'Infrastructure as a Service - virtual machines and storage (EC2, Compute Engine)',
    icon: '🖥️',
    color: '#6366F1',
    defaultWidth: 200,
    defaultHeight: 100,
    allowedConnections: ['deployment-zone', 'vpc-element', 'nfv-component'],
    properties: [
      { key: 'instanceType', label: 'Instance Type', type: 'select', options: ['General Purpose', 'Compute Optimized', 'Memory Optimized', 'GPU'] },
      { key: 'os', label: 'Operating System', type: 'select', options: ['Linux', 'Windows', 'Container OS'] },
      { key: 'storage', label: 'Storage Type', type: 'select', options: ['SSD', 'HDD', 'NVMe', 'Network Storage'] }
    ]
  },

  // Connectivity Options
  {
    type: 'connectivity',
    subtype: 'VPN Tunnel',
    name: 'VPN Tunnel',
    description: 'Site-to-site VPN for encrypted connectivity over internet',
    icon: '🔐',
    color: '#14B8A6',
    defaultWidth: 150,
    defaultHeight: 80,
    allowedConnections: ['deployment-zone', 'gateway'],
    properties: [
      { key: 'encryption', label: 'Encryption', type: 'select', options: ['IPSec', 'SSL/TLS', 'WireGuard'], default: 'IPSec' },
      { key: 'bandwidth', label: 'Bandwidth (Mbps)', type: 'number', default: 100 },
      { key: 'redundancy', label: 'Redundant Tunnel', type: 'boolean', default: false }
    ]
  },
  {
    type: 'connectivity',
    subtype: 'Direct Connect Link',
    name: 'Direct Connect Link',
    description: 'Dedicated private connection (AWS Direct Connect, Azure ExpressRoute)',
    icon: '⚡',
    color: '#F97316',
    defaultWidth: 150,
    defaultHeight: 80,
    allowedConnections: ['deployment-zone', 'deployment-zone'],
    properties: [
      { key: 'speed', label: 'Port Speed', type: 'select', options: ['1 Gbps', '10 Gbps', '100 Gbps'], default: '10 Gbps' },
      { key: 'provider', label: 'Provider Type', type: 'select', options: ['Direct', 'Partner', 'Hosted'] },
      { key: 'vlan', label: 'VLAN Count', type: 'number', default: 1 }
    ]
  },
  {
    type: 'connectivity',
    subtype: 'Internet Connection',
    name: 'Internet Connection',
    description: 'Public internet connectivity',
    icon: '🌐',
    color: '#06B6D4',
    defaultWidth: 150,
    defaultHeight: 80,
    allowedConnections: ['gateway', 'service-layer'],
    properties: [
      { key: 'security', label: 'Security', type: 'multiselect', options: ['TLS', 'WAF', 'DDoS Protection', 'CDN'] },
      { key: 'bandwidth', label: 'Expected Bandwidth', type: 'text', default: 'Best effort' }
    ]
  },

  // VPC Elements
  {
    type: 'vpc-element',
    subtype: 'Subnet',
    name: 'VPC Subnet',
    description: 'Isolated network segment within VPC',
    icon: '📦',
    color: '#84CC16',
    defaultWidth: 180,
    defaultHeight: 120,
    allowedConnections: ['service-layer', 'nfv-component', 'gateway'],
    properties: [
      { key: 'cidr', label: 'CIDR Block', type: 'text', default: '10.0.1.0/24', required: true },
      { key: 'type', label: 'Subnet Type', type: 'select', options: ['Public', 'Private', 'Isolated'] },
      { key: 'az', label: 'Availability Zone', type: 'text' }
    ]
  },
  {
    type: 'vpc-element',
    subtype: 'Security Group',
    name: 'Security Group',
    description: 'Stateful firewall rules for resources',
    icon: '🛡️',
    color: '#DC2626',
    defaultWidth: 160,
    defaultHeight: 100,
    allowedConnections: ['service-layer', 'vpc-element'],
    properties: [
      { key: 'inboundRules', label: 'Inbound Rules', type: 'text', default: 'Allow 443 from 0.0.0.0/0' },
      { key: 'outboundRules', label: 'Outbound Rules', type: 'text', default: 'Allow all' },
      { key: 'stateful', label: 'Stateful', type: 'boolean', default: true }
    ]
  },
  {
    type: 'vpc-element',
    subtype: 'Network List',
    name: 'Network ACL',
    description: 'Stateless subnet-level access control list',
    icon: '📋',
    color: '#7C3AED',
    defaultWidth: 160,
    defaultHeight: 100,
    allowedConnections: ['vpc-element'],
    properties: [
      { key: 'rules', label: 'Rule Count', type: 'number', default: 5 },
      { key: 'defaultAction', label: 'Default Action', type: 'select', options: ['Deny', 'Allow'], default: 'Deny' }
    ]
  },

  // Gateways
  {
    type: 'gateway',
    subtype: 'Internet Gateway',
    name: 'Internet Gateway',
    description: 'Allows VPC resources to access internet',
    icon: '🚪',
    color: '#0EA5E9',
    defaultWidth: 140,
    defaultHeight: 90,
    allowedConnections: ['vpc-element', 'connectivity'],
    properties: [
      { key: 'publicIPs', label: 'Public IP Allocation', type: 'boolean', default: true },
      { key: 'ipv6', label: 'IPv6 Support', type: 'boolean', default: false }
    ]
  },
  {
    type: 'gateway',
    subtype: 'NAT Gateway',
    name: 'NAT Gateway',
    description: 'Enables outbound internet for private subnets',
    icon: '🔄',
    color: '#EC4899',
    defaultWidth: 140,
    defaultHeight: 90,
    allowedConnections: ['vpc-element', 'gateway'],
    properties: [
      { key: 'highAvailability', label: 'HA Deployment', type: 'boolean', default: false },
      { key: 'bandwidth', label: 'Bandwidth (Gbps)', type: 'select', options: ['5', '10', '45', '100'], default: '5' }
    ]
  },

  // NFV Components
  {
    type: 'nfv-component',
    subtype: 'Virtual Router',
    name: 'Virtual Router',
    description: 'Software-defined routing for cloud networks',
    icon: '🔀',
    color: '#A855F7',
    defaultWidth: 140,
    defaultHeight: 90,
    allowedConnections: ['vpc-element', 'connectivity'],
    properties: [
      { key: 'routingProtocol', label: 'Routing Protocol', type: 'select', options: ['BGP', 'OSPF', 'Static', 'Policy-Based'] },
      { key: 'throughput', label: 'Throughput (Gbps)', type: 'number', default: 10 }
    ]
  },
  {
    type: 'nfv-component',
    subtype: 'Virtual Firewall',
    name: 'Virtual Firewall',
    description: 'Software-based network security appliance',
    icon: '🔥',
    color: '#EF4444',
    defaultWidth: 140,
    defaultHeight: 90,
    allowedConnections: ['vpc-element', 'service-layer'],
    properties: [
      { key: 'features', label: 'Features', type: 'multiselect', options: ['IPS', 'DPI', 'URL Filtering', 'Malware Protection'] },
      { key: 'mode', label: 'Deployment Mode', type: 'select', options: ['Inline', 'Monitor', 'Tap'], default: 'Inline' }
    ]
  },
  {
    type: 'nfv-component',
    subtype: 'Virtual Load Balancer',
    name: 'Virtual Load Balancer',
    description: 'Software load balancer for traffic distribution',
    icon: '⚖️',
    color: '#22C55E',
    defaultWidth: 140,
    defaultHeight: 90,
    allowedConnections: ['vpc-element', 'service-layer'],
    properties: [
      { key: 'algorithm', label: 'Algorithm', type: 'select', options: ['Round Robin', 'Least Connections', 'IP Hash', 'Weighted'], default: 'Round Robin' },
      { key: 'healthCheck', label: 'Health Check Interval', type: 'number', default: 30 },
      { key: 'sslOffload', label: 'SSL Offloading', type: 'boolean', default: true }
    ]
  }
];

export const validationRules = {
  internetAccess: {
    rule: 'Public subnets must have Internet Gateway for inbound access',
    check: (components: any[]) => {
      const publicSubnets = components.filter(c =>
        c.type === 'vpc-element' &&
        c.subtype === 'Subnet' &&
        c.properties?.type === 'Public'
      );
      const internetGateways = components.filter(c => c.subtype === 'Internet Gateway');

      if (publicSubnets.length > 0 && internetGateways.length === 0) {
        return { valid: false, message: 'Public subnets require Internet Gateway' };
      }
      return { valid: true };
    }
  },

  natGatewayPlacement: {
    rule: 'NAT Gateway must be in public subnet',
    check: (components: any[]) => {
      const natGateways = components.filter(c => c.subtype === 'NAT Gateway');
      // In a real implementation, check NAT Gateway connections to public subnets
      return { valid: true };
    }
  },

  securityGroupCoverage: {
    rule: 'All service layers should have security group protection',
    check: (components: any[]) => {
      const serviceLayers = components.filter(c => c.type === 'service-layer');
      const securityGroups = components.filter(c => c.subtype === 'Security Group');

      if (serviceLayers.length > 0 && securityGroups.length === 0) {
        return { valid: false, message: 'Service layers should be protected by security groups' };
      }
      return { valid: true };
    }
  },

  connectivityRequired: {
    rule: 'Hybrid deployments require connectivity components',
    check: (components: any[]) => {
      const hybridZones = components.filter(c => c.subtype === 'Hybrid Zone');
      const connectivity = components.filter(c => c.type === 'connectivity');

      if (hybridZones.length > 0 && connectivity.length === 0) {
        return { valid: false, message: 'Hybrid deployments need VPN or Direct Connect' };
      }
      return { valid: true };
    }
  }
};
