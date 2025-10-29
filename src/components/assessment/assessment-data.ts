/**
 * Assessment Data
 * Integrated scenarios, badges, and assessment configurations
 */

import type { IntegratedScenario, Badge, LearningObjective } from './assessment-types';

export const learningObjectives: LearningObjective[] = [
  { id: 'lo-1.0', code: '1.0', title: 'OSI Model', category: 'fundamentals' },
  { id: 'lo-1.1', code: '1.1', title: 'Network Appliances', category: 'infrastructure' },
  { id: 'lo-1.2', code: '1.2', title: 'Cloud Concepts', category: 'infrastructure' },
  { id: 'lo-1.3', code: '1.3', title: 'Ports and Protocols', category: 'fundamentals' },
  { id: 'lo-1.4', code: '1.4', title: 'Network Media', category: 'infrastructure' },
  { id: 'lo-1.5', code: '1.5', title: 'Network Topologies', category: 'infrastructure' },
  { id: 'lo-1.7', code: '1.7', title: 'IPv4 Addressing', category: 'fundamentals' },
  { id: 'lo-1.8', code: '1.8', title: 'Modern Networking', category: 'infrastructure' },
];

export const integratedScenarios: IntegratedScenario[] = [
  {
    id: 'hybrid-cloud-enterprise',
    title: 'Hybrid Cloud Enterprise Network Design',
    description: 'Design a complete hybrid cloud network for a multi-location enterprise with modern security and connectivity requirements',
    difficulty: 'expert',
    estimatedTime: 90,
    learningObjectives: ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.7', '1.8'],
    context: {
      company: 'GlobalTech Solutions',
      locations: 3,
      users: 1000,
      requirements: [
        'SD-WAN connectivity between all locations',
        'Zero trust security architecture',
        'Hybrid cloud with AWS and on-premises data centers',
        'Support for modern containerized applications',
        'High availability and disaster recovery',
        'Secure remote access for 300 remote workers'
      ],
      constraints: [
        'Budget: $500,000 for infrastructure',
        'Must use existing fiber connections between buildings',
        'Compliance: PCI-DSS and HIPAA requirements',
        'Maximum acceptable latency: 50ms between locations'
      ]
    },
    totalPoints: 500,
    phases: [
      {
        id: 'requirements-analysis',
        title: 'Phase 1: Requirements Analysis',
        description: 'Analyze requirements and identify key architectural considerations',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.0',
            loCode: '1.0',
            description: 'Identify OSI layer considerations for each requirement',
            maxScore: 50,
            criteria: [
              'Correctly identify Layer 2 requirements (VLAN segmentation)',
              'Correctly identify Layer 3 requirements (routing, subnetting)',
              'Correctly identify Layer 4-7 requirements (application delivery)',
              'Explain how each layer contributes to security',
              'Identify layer-specific troubleshooting points'
            ]
          },
          {
            loId: 'lo-1.2',
            loCode: '1.2',
            description: 'Define hybrid cloud architecture',
            maxScore: 60,
            criteria: [
              'Explain IaaS vs PaaS vs SaaS components needed',
              'Design VPC architecture in AWS',
              'Plan connectivity between cloud and on-premises',
              'Address multi-cloud considerations',
              'Define disaster recovery strategy using cloud'
            ]
          },
          {
            loId: 'lo-1.5',
            loCode: '1.5',
            description: 'Select appropriate network topology',
            maxScore: 40,
            criteria: [
              'Justify topology selection (mesh, star, etc.)',
              'Plan for redundancy and high availability',
              'Consider scalability requirements',
              'Address single points of failure'
            ]
          }
        ],
        hints: [
          'Consider zero trust principles when analyzing security requirements',
          'Think about how containerized apps affect network design',
          'SD-WAN requires specific considerations for traffic routing'
        ]
      },
      {
        id: 'architecture-design',
        title: 'Phase 2: Architecture Design',
        description: 'Create detailed network architecture with appliance placement',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.1',
            loCode: '1.1',
            description: 'Select and position network appliances',
            maxScore: 70,
            criteria: [
              'Place firewalls appropriately (perimeter, internal)',
              'Position load balancers for application delivery',
              'Design IDS/IPS deployment',
              'Plan SD-WAN appliance placement',
              'Include web application firewalls (WAF)',
              'Consider network access control (NAC)',
              'Plan for network monitoring appliances'
            ]
          },
          {
            loId: 'lo-1.4',
            loCode: '1.4',
            description: 'Select appropriate network media',
            maxScore: 50,
            criteria: [
              'Choose fiber types for inter-building links',
              'Select copper cabling for horizontal distribution',
              'Plan wireless infrastructure (Wi-Fi 6)',
              'Consider bandwidth requirements per link',
              'Address distance limitations'
            ]
          },
          {
            loId: 'lo-1.8',
            loCode: '1.8',
            description: 'Incorporate modern networking technologies',
            maxScore: 60,
            criteria: [
              'Design SD-WAN architecture',
              'Plan for software-defined networking (SDN)',
              'Include zero trust network access (ZTNA)',
              'Design for containerized workloads',
              'Plan API gateway infrastructure',
              'Consider intent-based networking'
            ]
          }
        ],
        hints: [
          'SD-WAN appliances should be at each location',
          'Consider east-west traffic for containerized apps',
          'Zero trust requires micro-segmentation'
        ]
      },
      {
        id: 'addressing-design',
        title: 'Phase 3: IP Addressing and Subnetting',
        description: 'Design comprehensive IPv4 addressing scheme with VLSM',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.7',
            loCode: '1.7',
            description: 'Design IP addressing scheme for all locations',
            maxScore: 80,
            criteria: [
              'Use VLSM efficiently for 1000 users across 3 locations',
              'Allocate appropriate subnet sizes per department',
              'Reserve IP ranges for servers and infrastructure',
              'Plan for growth (20% capacity overhead)',
              'Design IP scheme for cloud VPC',
              'Include DMZ subnetting',
              'Plan management network subnets',
              'Calculate and document all subnet masks'
            ]
          },
          {
            loId: 'lo-1.5',
            loCode: '1.5',
            description: 'Map topology to IP addressing',
            maxScore: 30,
            criteria: [
              'Align subnets with physical/logical topology',
              'Plan routing between subnets',
              'Address summarization opportunities'
            ]
          }
        ],
        hints: [
          'Consider using /22 or /23 for main user subnets',
          'Server subnets typically need /26 or /27',
          'Don\'t forget point-to-point links (/30 or /31)'
        ]
      },
      {
        id: 'configuration-planning',
        title: 'Phase 4: Configuration and Protocols',
        description: 'Plan detailed configurations including ports, protocols, and services',
        requiredForNext: false,
        assessmentPoints: [
          {
            loId: 'lo-1.3',
            loCode: '1.3',
            description: 'Configure ports and protocols',
            maxScore: 60,
            criteria: [
              'Document all required ports for applications',
              'Plan firewall rules with specific ports',
              'Configure VPN protocols (IPsec, SSL VPN)',
              'Plan for encrypted protocols (HTTPS, SSH)',
              'Configure routing protocols (OSPF, BGP)',
              'Plan DNS and DHCP services',
              'Document security group rules for cloud'
            ]
          },
          {
            loId: 'lo-1.1',
            loCode: '1.1',
            description: 'Configure appliances',
            maxScore: 40,
            criteria: [
              'Create firewall rule sets',
              'Configure load balancer pools',
              'Set up SD-WAN policies',
              'Configure NAC policies'
            ]
          }
        ],
        hints: [
          'Remember to allow management protocols (SSH, HTTPS)',
          'SD-WAN typically uses UDP ports for tunnels',
          'Consider application-specific protocols'
        ]
      },
      {
        id: 'validation-review',
        title: 'Phase 5: Validation and Review',
        description: 'Validate design against requirements and identify potential issues',
        requiredForNext: false,
        assessmentPoints: [
          {
            loId: 'lo-1.0',
            loCode: '1.0',
            description: 'Validate layer-by-layer design',
            maxScore: 30,
            criteria: [
              'Verify Layer 1/2 redundancy',
              'Validate Layer 3 routing design',
              'Check Layer 4-7 service delivery',
              'Identify potential layer-specific bottlenecks'
            ]
          },
          {
            loId: 'lo-1.2',
            loCode: '1.2',
            description: 'Review cloud integration',
            maxScore: 20,
            criteria: [
              'Validate cloud connectivity design',
              'Review disaster recovery plan',
              'Check cloud security controls'
            ]
          }
        ],
        hints: [
          'Look for single points of failure',
          'Verify all requirements are met',
          'Check compliance considerations'
        ]
      }
    ]
  },
  {
    id: 'smb-network-upgrade',
    title: 'Small Business Network Modernization',
    description: 'Upgrade a small business network from legacy infrastructure to modern standards',
    difficulty: 'intermediate',
    estimatedTime: 45,
    learningObjectives: ['1.0', '1.1', '1.3', '1.4', '1.5', '1.7'],
    context: {
      company: 'Local Manufacturing Co.',
      locations: 1,
      users: 50,
      requirements: [
        'Replace aging network infrastructure',
        'Add wireless access for floor workers',
        'Implement basic security (firewall, segmentation)',
        'Support cloud email and file storage',
        'Remote access for 5 executives'
      ],
      constraints: [
        'Budget: $25,000',
        'Minimal downtime during upgrade',
        'Must use existing Cat5e cabling where possible',
        'No dedicated IT staff'
      ]
    },
    totalPoints: 300,
    phases: [
      {
        id: 'assessment',
        title: 'Phase 1: Current State Assessment',
        description: 'Document existing infrastructure and identify upgrade needs',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.4',
            loCode: '1.4',
            description: 'Assess existing cabling and media',
            maxScore: 40,
            criteria: [
              'Determine if Cat5e supports Gigabit Ethernet',
              'Identify where new cabling is required',
              'Plan wireless coverage areas',
              'Select appropriate wireless standards'
            ]
          },
          {
            loId: 'lo-1.5',
            loCode: '1.5',
            description: 'Analyze current topology',
            maxScore: 30,
            criteria: [
              'Document existing topology',
              'Identify topology weaknesses',
              'Recommend modern topology approach'
            ]
          }
        ]
      },
      {
        id: 'design',
        title: 'Phase 2: Upgrade Design',
        description: 'Design the upgraded network',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.1',
            loCode: '1.1',
            description: 'Select appropriate appliances',
            maxScore: 60,
            criteria: [
              'Choose firewall within budget',
              'Select managed switches',
              'Plan wireless access points',
              'Include basic network monitoring'
            ]
          },
          {
            loId: 'lo-1.7',
            loCode: '1.7',
            description: 'Design IP addressing scheme',
            maxScore: 50,
            criteria: [
              'Create subnet for users',
              'Separate subnet for servers/printers',
              'Guest Wi-Fi subnet',
              'Proper VLSM usage'
            ]
          },
          {
            loId: 'lo-1.3',
            loCode: '1.3',
            description: 'Plan required services',
            maxScore: 40,
            criteria: [
              'Configure firewall ports for cloud services',
              'Plan VPN for remote access',
              'Configure DNS and DHCP',
              'Document security protocols'
            ]
          }
        ]
      },
      {
        id: 'implementation-plan',
        title: 'Phase 3: Implementation Planning',
        description: 'Create phased implementation plan',
        requiredForNext: false,
        assessmentPoints: [
          {
            loId: 'lo-1.0',
            loCode: '1.0',
            description: 'Plan layer-by-layer implementation',
            maxScore: 50,
            criteria: [
              'Plan physical layer changes',
              'Configure Layer 2 VLANs',
              'Set up Layer 3 routing',
              'Test Layer 7 application access'
            ]
          },
          {
            loId: 'lo-1.1',
            loCode: '1.1',
            description: 'Create cutover plan',
            maxScore: 30,
            criteria: [
              'Minimize downtime strategy',
              'Rollback plan if issues arise',
              'Testing and validation steps'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'datacenter-migration',
    title: 'Data Center Cloud Migration',
    description: 'Plan migration of on-premises data center to cloud infrastructure',
    difficulty: 'advanced',
    estimatedTime: 60,
    learningObjectives: ['1.0', '1.1', '1.2', '1.3', '1.5', '1.7', '1.8'],
    context: {
      company: 'FinServe Inc.',
      locations: 2,
      users: 500,
      requirements: [
        'Migrate 80% of workloads to AWS',
        'Maintain hybrid connectivity for remaining 20%',
        'Zero downtime during migration',
        'Meet financial services compliance',
        'Support containerized microservices'
      ],
      constraints: [
        'Must complete within 6 months',
        'Budget: $300,000',
        'Maintain existing SLAs',
        'SOC 2 Type II compliance required'
      ]
    },
    totalPoints: 400,
    phases: [
      {
        id: 'cloud-architecture',
        title: 'Phase 1: Cloud Architecture Design',
        description: 'Design AWS cloud architecture',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.2',
            loCode: '1.2',
            description: 'Design cloud infrastructure',
            maxScore: 80,
            criteria: [
              'Design multi-AZ VPC architecture',
              'Plan hybrid connectivity (Direct Connect or VPN)',
              'Select appropriate cloud services',
              'Design for high availability',
              'Plan disaster recovery in cloud'
            ]
          },
          {
            loId: 'lo-1.8',
            loCode: '1.8',
            description: 'Plan for modern workloads',
            maxScore: 60,
            criteria: [
              'Design container orchestration (EKS)',
              'Plan service mesh architecture',
              'Configure API gateway',
              'Implement infrastructure as code'
            ]
          }
        ]
      },
      {
        id: 'network-design',
        title: 'Phase 2: Network Design',
        description: 'Design cloud and hybrid network',
        requiredForNext: true,
        assessmentPoints: [
          {
            loId: 'lo-1.7',
            loCode: '1.7',
            description: 'Design cloud IP addressing',
            maxScore: 70,
            criteria: [
              'Plan VPC CIDR blocks',
              'Design subnet strategy per AZ',
              'Plan IP ranges for containers',
              'Address hybrid network routing'
            ]
          },
          {
            loId: 'lo-1.1',
            loCode: '1.1',
            description: 'Configure cloud network services',
            maxScore: 60,
            criteria: [
              'Configure security groups',
              'Set up network ACLs',
              'Plan load balancer architecture',
              'Configure WAF rules'
            ]
          }
        ]
      },
      {
        id: 'migration-execution',
        title: 'Phase 3: Migration Execution',
        description: 'Plan phased migration approach',
        requiredForNext: false,
        assessmentPoints: [
          {
            loId: 'lo-1.3',
            loCode: '1.3',
            description: 'Configure protocols and services',
            maxScore: 70,
            criteria: [
              'Plan DNS migration strategy',
              'Configure VPN tunnels',
              'Set up monitoring and logging',
              'Configure application ports'
            ]
          },
          {
            loId: 'lo-1.0',
            loCode: '1.0',
            description: 'Validate connectivity',
            maxScore: 60,
            criteria: [
              'Test Layer 3 connectivity',
              'Validate application access',
              'Verify security controls',
              'Test failover scenarios'
            ]
          }
        ]
      }
    ]
  }
];

export const badges: Badge[] = [
  {
    id: 'port-master',
    name: 'Port Master',
    description: 'Achieve 100% accuracy on all port and protocol exercises',
    icon: '🔌',
    category: 'protocols',
    requirement: 'Perfect score on 10+ port/protocol exercises',
    earned: false
  },
  {
    id: 'subnet-ninja',
    name: 'Subnet Ninja',
    description: 'Complete all VLSM challenges with expert-level performance',
    icon: '🥷',
    category: 'addressing',
    requirement: 'Complete 15+ subnet exercises with 90%+ average',
    earned: false
  },
  {
    id: 'osi-expert',
    name: 'OSI Expert',
    description: 'Master all OSI model layer explanations',
    icon: '📚',
    category: 'fundamentals',
    requirement: '100% on all OSI layer exercises',
    earned: false
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    description: 'Master all cloud scenario simulations',
    icon: '☁️',
    category: 'cloud',
    requirement: 'Complete all cloud scenarios with 85%+ score',
    earned: false
  },
  {
    id: 'security-specialist',
    name: 'Security Specialist',
    description: 'Excel in all security-related exercises',
    icon: '🛡️',
    category: 'security',
    requirement: 'Complete 20+ security exercises with 90%+ average',
    earned: false
  },
  {
    id: 'troubleshooter',
    name: 'Troubleshooter',
    description: 'Solve complex network troubleshooting scenarios',
    icon: '🔧',
    category: 'troubleshooting',
    requirement: 'Complete 10+ troubleshooting scenarios successfully',
    earned: false
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete exercises in record time',
    icon: '⚡',
    category: 'performance',
    requirement: 'Complete 5+ exercises in top 10% time',
    earned: false
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Maintain a 30-day study streak',
    icon: '🔥',
    category: 'engagement',
    requirement: '30 consecutive days of practice',
    earned: false
  },
  {
    id: 'well-rounded',
    name: 'Well-Rounded',
    description: 'Achieve competent level in all domains',
    icon: '🎯',
    category: 'overall',
    requirement: 'Competent or higher in all 5 domains',
    earned: false
  },
  {
    id: 'exam-ready',
    name: 'Exam Ready',
    description: 'Achieve exam readiness score of 85+',
    icon: '🎓',
    category: 'overall',
    requirement: 'Overall readiness score of 85%+',
    earned: false
  }
];

export const masteryThresholds = {
  novice: 0,
  competent: 50,
  proficient: 75,
  expert: 90
} as const;

export const domainWeights = {
  fundamentals: 0.25,
  infrastructure: 0.30,
  operations: 0.20,
  security: 0.15,
  troubleshooting: 0.10
} as const;
