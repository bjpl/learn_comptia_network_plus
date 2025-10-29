/**
 * Network Topologies Data
 * Comprehensive topology specifications and transformation scenarios
 */

import type {
  TopologyDefinition,
  TopologyTransformation,
  ThreeTierModel,
  TrafficFlowAnimation,
} from './topologies-types';

export const threeTierModel: ThreeTierModel = {
  layers: {
    core: {
      name: 'Core Layer',
      functions: [
        'High-speed packet switching',
        'Route traffic between distribution layers',
        'Provide fault tolerance through redundancy',
        'Minimize latency',
        'Maintain high availability',
      ],
      requirements: [
        'Fastest switching/routing possible',
        'Minimal or no packet manipulation',
        'No access control lists (ACLs)',
        'Redundant paths',
        'Load balancing capabilities',
      ],
      devices: [
        'High-end multilayer switches',
        'Core routers',
        'Layer 3 switches with advanced routing',
      ],
    },
    distribution: {
      name: 'Distribution Layer',
      responsibilities: [
        'Route traffic between VLANs',
        'Implement routing policies',
        'Apply access control lists (ACLs)',
        'Aggregate multiple access layer switches',
        'Provide QoS (Quality of Service)',
      ],
      features: [
        'Routing between subnets',
        'Policy-based connectivity',
        'Security filtering',
        'Address or area aggregation',
        'Broadcast domain definition',
      ],
      devices: [
        'Layer 3 switches',
        'Distribution routers',
        'Multilayer switches with routing capabilities',
      ],
    },
    access: {
      name: 'Access Layer',
      characteristics: [
        'End-user connectivity',
        'Port security',
        'VLAN assignment',
        'Power over Ethernet (PoE)',
        'High port density',
      ],
      functions: [
        'Connect end devices to network',
        'Implement port security',
        'Provide VLAN access',
        'QoS marking and classification',
        'Basic switching functions',
      ],
      devices: [
        'Access switches',
        'Layer 2 switches',
        'PoE switches',
        'Wireless access points',
      ],
    },
  },
  collapsedCore: {
    description:
      'Combines core and distribution layers into a single layer, reducing complexity and cost for smaller networks',
    whenToUse: [
      'Small to medium-sized networks',
      'Limited budget constraints',
      'Single building or campus',
      'Less than 200 end devices',
      'Simple routing requirements',
    ],
    benefits: [
      'Reduced hardware costs',
      'Simplified management',
      'Lower power consumption',
      'Easier troubleshooting',
      'Adequate for smaller deployments',
    ],
    limitations: [
      'Limited scalability',
      'Reduced redundancy options',
      'Potential performance bottlenecks',
      'Less flexible policy implementation',
      'Harder to upgrade incrementally',
    ],
  },
};

export const topologyDefinitions: TopologyDefinition[] = [
  {
    id: 'mesh',
    name: 'Mesh Topology',
    description: 'Every node connects to every other node, providing maximum redundancy',
    nodes: [
      { id: 'n1', type: 'switch', label: 'Switch 1', position: { x: 100, y: 100 } },
      { id: 'n2', type: 'switch', label: 'Switch 2', position: { x: 300, y: 100 } },
      { id: 'n3', type: 'switch', label: 'Switch 3', position: { x: 300, y: 300 } },
      { id: 'n4', type: 'switch', label: 'Switch 4', position: { x: 100, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', type: 'primary', bandwidth: '10 Gbps' },
      { id: 'e2', source: 'n1', target: 'n3', type: 'primary', bandwidth: '10 Gbps' },
      { id: 'e3', source: 'n1', target: 'n4', type: 'primary', bandwidth: '10 Gbps' },
      { id: 'e4', source: 'n2', target: 'n3', type: 'primary', bandwidth: '10 Gbps' },
      { id: 'e5', source: 'n2', target: 'n4', type: 'primary', bandwidth: '10 Gbps' },
      { id: 'e6', source: 'n3', target: 'n4', type: 'primary', bandwidth: '10 Gbps' },
    ],
    characteristics: {
      cableRequirements: {
        formula: 'n(n-1)/2',
        example: 'For 4 nodes: 4(4-1)/2 = 6 cables',
        forNodes: (n) => (n * (n - 1)) / 2,
      },
      faultTolerance: {
        level: 'very-high',
        singlePointOfFailure: false,
        description: 'Multiple redundant paths ensure network continues operation even with multiple failures',
      },
      scalability: {
        level: 'low',
        maxNodes: 10,
        limitations: [
          'Cable requirements grow exponentially',
          'Complex configuration management',
          'High port requirements on each device',
        ],
      },
      cost: {
        initial: 'very-high',
        maintenance: 'high',
        breakdown: {
          hardware: 30,
          cabling: 40,
          installation: 20,
          maintenance: 10,
        },
      },
      trafficFlow: {
        northSouth: 30,
        eastWest: 70,
        bottlenecks: ['Limited by individual switch capacity'],
      },
    },
    useCases: [
      'Critical infrastructure requiring maximum uptime',
      'Military and defense networks',
      'Financial trading platforms',
      'Emergency services networks',
    ],
  },
  {
    id: 'star',
    name: 'Star Topology',
    description: 'All nodes connect to a central hub or switch',
    nodes: [
      { id: 'center', type: 'switch', label: 'Central Switch', position: { x: 200, y: 200 } },
      { id: 'h1', type: 'host', label: 'Host 1', position: { x: 100, y: 100 } },
      { id: 'h2', type: 'host', label: 'Host 2', position: { x: 300, y: 100 } },
      { id: 'h3', type: 'host', label: 'Host 3', position: { x: 300, y: 300 } },
      { id: 'h4', type: 'host', label: 'Host 4', position: { x: 100, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'center', target: 'h1', bandwidth: '1 Gbps' },
      { id: 'e2', source: 'center', target: 'h2', bandwidth: '1 Gbps' },
      { id: 'e3', source: 'center', target: 'h3', bandwidth: '1 Gbps' },
      { id: 'e4', source: 'center', target: 'h4', bandwidth: '1 Gbps' },
    ],
    characteristics: {
      cableRequirements: {
        formula: 'n',
        example: 'For 4 hosts + 1 switch: 4 cables',
        forNodes: (n) => n,
      },
      faultTolerance: {
        level: 'low',
        singlePointOfFailure: true,
        description: 'Central switch failure brings down entire network',
      },
      scalability: {
        level: 'medium',
        maxNodes: 48,
        limitations: [
          'Limited by central switch port count',
          'Performance degrades with high node count',
          'Requires switch upgrade for expansion',
        ],
      },
      cost: {
        initial: 'low',
        maintenance: 'low',
        breakdown: {
          hardware: 40,
          cabling: 30,
          installation: 20,
          maintenance: 10,
        },
      },
      trafficFlow: {
        northSouth: 80,
        eastWest: 20,
        bottlenecks: ['Central switch becomes bottleneck', 'Uplink saturation'],
      },
    },
    useCases: [
      'Small office networks',
      'Home networks',
      'Single floor deployments',
      'Budget-constrained environments',
    ],
  },
  {
    id: 'spine-and-leaf',
    name: 'Spine-and-Leaf Topology',
    description: 'Modern data center architecture with spine and leaf layers',
    nodes: [
      { id: 'spine1', type: 'switch', label: 'Spine 1', position: { x: 150, y: 50 } },
      { id: 'spine2', type: 'switch', label: 'Spine 2', position: { x: 250, y: 50 } },
      { id: 'leaf1', type: 'switch', label: 'Leaf 1', position: { x: 100, y: 200 } },
      { id: 'leaf2', type: 'switch', label: 'Leaf 2', position: { x: 200, y: 200 } },
      { id: 'leaf3', type: 'switch', label: 'Leaf 3', position: { x: 300, y: 200 } },
    ],
    edges: [
      { id: 'e1', source: 'spine1', target: 'leaf1', type: 'uplink', bandwidth: '40 Gbps' },
      { id: 'e2', source: 'spine1', target: 'leaf2', type: 'uplink', bandwidth: '40 Gbps' },
      { id: 'e3', source: 'spine1', target: 'leaf3', type: 'uplink', bandwidth: '40 Gbps' },
      { id: 'e4', source: 'spine2', target: 'leaf1', type: 'uplink', bandwidth: '40 Gbps' },
      { id: 'e5', source: 'spine2', target: 'leaf2', type: 'uplink', bandwidth: '40 Gbps' },
      { id: 'e6', source: 'spine2', target: 'leaf3', type: 'uplink', bandwidth: '40 Gbps' },
    ],
    characteristics: {
      cableRequirements: {
        formula: 'spine_count × leaf_count',
        example: 'For 2 spines and 3 leaves: 2 × 3 = 6 cables',
        forNodes: (n) => Math.ceil(n / 2) * Math.floor(n / 2),
      },
      faultTolerance: {
        level: 'high',
        singlePointOfFailure: false,
        description: 'Multiple paths ensure continued operation with spine or leaf failures',
      },
      scalability: {
        level: 'high',
        maxNodes: 'unlimited',
        limitations: [
          'Limited by spine switch port density',
          'Requires careful capacity planning',
          'May need additional spine layer for very large deployments',
        ],
      },
      cost: {
        initial: 'high',
        maintenance: 'medium',
        breakdown: {
          hardware: 50,
          cabling: 20,
          installation: 20,
          maintenance: 10,
        },
      },
      trafficFlow: {
        northSouth: 20,
        eastWest: 80,
        bottlenecks: ['Spine layer bandwidth', 'Leaf-to-spine uplinks'],
      },
    },
    useCases: [
      'Modern data centers',
      'Cloud infrastructure',
      'High-performance computing',
      'East-west traffic-heavy applications',
    ],
  },
  {
    id: 'three-tier',
    name: 'Three-Tier Topology',
    description: 'Hierarchical design with core, distribution, and access layers',
    nodes: [
      {
        id: 'core1',
        type: 'core',
        label: 'Core 1',
        position: { x: 150, y: 50 },
        layer: 'core',
      },
      {
        id: 'core2',
        type: 'core',
        label: 'Core 2',
        position: { x: 250, y: 50 },
        layer: 'core',
      },
      {
        id: 'dist1',
        type: 'distribution',
        label: 'Distribution 1',
        position: { x: 100, y: 150 },
        layer: 'distribution',
      },
      {
        id: 'dist2',
        type: 'distribution',
        label: 'Distribution 2',
        position: { x: 300, y: 150 },
        layer: 'distribution',
      },
      {
        id: 'acc1',
        type: 'access',
        label: 'Access 1',
        position: { x: 50, y: 250 },
        layer: 'access',
      },
      {
        id: 'acc2',
        type: 'access',
        label: 'Access 2',
        position: { x: 150, y: 250 },
        layer: 'access',
      },
      {
        id: 'acc3',
        type: 'access',
        label: 'Access 3',
        position: { x: 250, y: 250 },
        layer: 'access',
      },
      {
        id: 'acc4',
        type: 'access',
        label: 'Access 4',
        position: { x: 350, y: 250 },
        layer: 'access',
      },
    ],
    edges: [
      { id: 'e1', source: 'core1', target: 'core2', type: 'redundant' },
      { id: 'e2', source: 'core1', target: 'dist1', type: 'downlink' },
      { id: 'e3', source: 'core1', target: 'dist2', type: 'downlink' },
      { id: 'e4', source: 'core2', target: 'dist1', type: 'downlink' },
      { id: 'e5', source: 'core2', target: 'dist2', type: 'downlink' },
      { id: 'e6', source: 'dist1', target: 'acc1', type: 'downlink' },
      { id: 'e7', source: 'dist1', target: 'acc2', type: 'downlink' },
      { id: 'e8', source: 'dist2', target: 'acc3', type: 'downlink' },
      { id: 'e9', source: 'dist2', target: 'acc4', type: 'downlink' },
    ],
    characteristics: {
      cableRequirements: {
        formula: 'core_links + dist_links + access_links',
        example: 'Varies by redundancy requirements',
        forNodes: (n) => Math.ceil(n * 1.5),
      },
      faultTolerance: {
        level: 'high',
        singlePointOfFailure: false,
        description: 'Redundancy at each layer ensures high availability',
      },
      scalability: {
        level: 'high',
        maxNodes: 1000,
        limitations: [
          'Complexity increases with scale',
          'Requires careful IP addressing',
          'Layer 2 boundaries to manage',
        ],
      },
      cost: {
        initial: 'high',
        maintenance: 'medium',
        breakdown: {
          hardware: 45,
          cabling: 25,
          installation: 20,
          maintenance: 10,
        },
      },
      trafficFlow: {
        northSouth: 60,
        eastWest: 40,
        bottlenecks: ['Core-to-distribution links', 'Distribution layer capacity'],
      },
    },
    useCases: [
      'Enterprise campus networks',
      'Large office buildings',
      'Traditional data centers',
      'Multi-building campuses',
    ],
  },
  {
    id: 'hub-and-spoke',
    name: 'Hub-and-Spoke Topology',
    description: 'Central hub connecting multiple remote sites',
    nodes: [
      { id: 'hub', type: 'router', label: 'HQ Router', position: { x: 200, y: 200 } },
      { id: 'spoke1', type: 'router', label: 'Branch 1', position: { x: 100, y: 100 } },
      { id: 'spoke2', type: 'router', label: 'Branch 2', position: { x: 300, y: 100 } },
      { id: 'spoke3', type: 'router', label: 'Branch 3', position: { x: 300, y: 300 } },
      { id: 'spoke4', type: 'router', label: 'Branch 4', position: { x: 100, y: 300 } },
    ],
    edges: [
      { id: 'e1', source: 'hub', target: 'spoke1', label: 'VPN Tunnel' },
      { id: 'e2', source: 'hub', target: 'spoke2', label: 'VPN Tunnel' },
      { id: 'e3', source: 'hub', target: 'spoke3', label: 'VPN Tunnel' },
      { id: 'e4', source: 'hub', target: 'spoke4', label: 'VPN Tunnel' },
    ],
    characteristics: {
      cableRequirements: {
        formula: 'n (WAN links)',
        example: 'For 4 branches: 4 WAN connections',
        forNodes: (n) => n,
      },
      faultTolerance: {
        level: 'low',
        singlePointOfFailure: true,
        description: 'Hub failure disconnects all spokes',
      },
      scalability: {
        level: 'medium',
        maxNodes: 100,
        limitations: [
          'Hub capacity limits',
          'WAN bandwidth constraints',
          'Spoke-to-spoke traffic inefficiency',
        ],
      },
      cost: {
        initial: 'medium',
        maintenance: 'medium',
        breakdown: {
          hardware: 30,
          cabling: 20,
          installation: 30,
          maintenance: 20,
        },
      },
      trafficFlow: {
        northSouth: 90,
        eastWest: 10,
        bottlenecks: ['Hub router capacity', 'WAN link bandwidth'],
      },
    },
    useCases: [
      'Multi-site enterprise networks',
      'Retail chains',
      'Branch office connectivity',
      'VPN-based networks',
    ],
  },
];

export const transformationScenarios: TopologyTransformation[] = [
  {
    id: 'star-to-mesh',
    name: 'Star to Mesh Migration',
    fromTopology: 'star',
    toTopology: 'mesh',
    description: 'Transform a star topology into mesh by adding redundant connections between nodes',
    steps: [
      {
        id: 'step1',
        title: 'Initial Star Configuration',
        description: 'Starting with basic star topology - all nodes connected to central switch',
        action: 'add-node',
        changes: {
          redundancy: 'maintain',
          trafficPattern: 'All traffic flows through central switch',
          scalability: 'maintain',
          cost: 'maintain',
        },
      },
      {
        id: 'step2',
        title: 'Add First Redundant Link',
        description: 'Connect two edge nodes directly to create first redundant path',
        action: 'add-edge',
        changes: {
          redundancy: 'increase',
          trafficPattern: 'Alternative path created for specific node pair',
          scalability: 'maintain',
          cost: 'increase',
        },
      },
      {
        id: 'step3',
        title: 'Complete Mesh Connections',
        description: 'Add remaining links to create full mesh topology',
        action: 'add-edge',
        changes: {
          redundancy: 'increase',
          trafficPattern: 'Direct paths between all nodes',
          scalability: 'reduce',
          cost: 'increase',
        },
      },
    ],
    analysis: {
      redundancy: {
        before: 'Single point of failure at central switch',
        after: 'Multiple paths available between any two nodes',
        change: '+400% path redundancy',
      },
      trafficPatterns: {
        before: 'All traffic flows through central switch',
        after: 'Direct node-to-node communication available',
        improvement: 'Reduced latency, eliminated central bottleneck',
      },
      scalability: {
        before: 'Limited by central switch ports (up to 48 devices)',
        after: 'Severely limited by cable requirements (practical max 10 nodes)',
        improvement: 'Reduced scalability - only for critical small networks',
      },
      cost: {
        before: 'n cables, n switch ports',
        after: 'n(n-1)/2 cables, much higher port requirements',
        change: '+500% for 4-node network',
      },
    },
    benefits: [
      'Maximum redundancy and fault tolerance',
      'Multiple paths prevent single point of failure',
      'Reduced latency for direct connections',
      'Excellent for mission-critical systems',
    ],
    considerations: [
      'Exponential increase in cabling costs',
      'Complex configuration and management',
      'Higher power consumption',
      'Difficult to troubleshoot',
      'Only practical for small networks',
    ],
  },
  {
    id: 'three-tier-to-collapsed',
    name: 'Three-Tier to Collapsed Core',
    fromTopology: 'three-tier',
    toTopology: 'collapsed-core',
    description: 'Simplify network by combining core and distribution layers',
    steps: [
      {
        id: 'step1',
        title: 'Original Three-Tier Design',
        description: 'Separate core, distribution, and access layers',
        action: 'add-node',
        changes: {
          redundancy: 'maintain',
          trafficPattern: 'Traffic flows through three distinct layers',
          scalability: 'maintain',
          cost: 'maintain',
        },
      },
      {
        id: 'step2',
        title: 'Identify Core-Distribution Overlap',
        description: 'Analyze which functions can be combined',
        action: 'modify-node',
        changes: {
          redundancy: 'maintain',
          trafficPattern: 'Planning for reduced hop count',
          scalability: 'maintain',
          cost: 'maintain',
        },
      },
      {
        id: 'step3',
        title: 'Combine Layers',
        description: 'Merge core and distribution into unified layer',
        action: 'remove-node',
        changes: {
          redundancy: 'decrease',
          trafficPattern: 'Direct path from collapsed core to access',
          scalability: 'reduce',
          cost: 'decrease',
        },
      },
    ],
    analysis: {
      redundancy: {
        before: 'Redundancy at core and distribution layers',
        after: 'Redundancy at collapsed core layer only',
        change: 'Reduced redundancy options but still adequate',
      },
      trafficPatterns: {
        before: 'Access → Distribution → Core → Distribution → Access',
        after: 'Access → Collapsed Core → Access',
        improvement: 'Reduced hop count, lower latency',
      },
      scalability: {
        before: 'Highly scalable up to 1000+ devices',
        after: 'Suitable for up to 200-300 devices',
        improvement: 'Reduced but adequate for smaller networks',
      },
      cost: {
        before: 'High initial investment, separate core and distribution switches',
        after: '40-50% reduction in hardware costs',
        change: 'Significant cost savings',
      },
    },
    benefits: [
      'Reduced hardware costs',
      'Simplified management and configuration',
      'Lower power and cooling requirements',
      'Easier troubleshooting',
      'Adequate performance for SMB',
    ],
    considerations: [
      'Limited future growth capacity',
      'Reduced redundancy options',
      'Potential performance bottleneck',
      'Less flexible policy implementation',
      'Harder to scale incrementally',
    ],
  },
  {
    id: 'hub-spoke-to-spine-leaf',
    name: 'Hub-and-Spoke to Spine-and-Leaf',
    fromTopology: 'hub-and-spoke',
    toTopology: 'spine-and-leaf',
    description: 'Modernize WAN architecture to data center-optimized spine-leaf',
    steps: [
      {
        id: 'step1',
        title: 'Original Hub-and-Spoke',
        description: 'Central hub with star-connected spokes',
        action: 'add-node',
        changes: {
          redundancy: 'maintain',
          trafficPattern: 'Spoke-to-spoke traffic flows through hub',
          scalability: 'maintain',
          cost: 'maintain',
        },
      },
      {
        id: 'step2',
        title: 'Add Spine Layer',
        description: 'Introduce spine switches for redundancy',
        action: 'add-node',
        changes: {
          redundancy: 'increase',
          trafficPattern: 'Multiple paths available',
          scalability: 'improve',
          cost: 'increase',
        },
      },
      {
        id: 'step3',
        title: 'Connect Leaves to All Spines',
        description: 'Create full mesh between spine and leaf layers',
        action: 'add-edge',
        changes: {
          redundancy: 'increase',
          trafficPattern: 'Equal-cost multipath routing',
          scalability: 'improve',
          cost: 'increase',
        },
      },
      {
        id: 'step4',
        title: 'Optimize for East-West Traffic',
        description: 'Configure for modern application patterns',
        action: 'modify-node',
        changes: {
          redundancy: 'maintain',
          trafficPattern: 'Efficient east-west communication',
          scalability: 'improve',
          cost: 'maintain',
        },
      },
    ],
    analysis: {
      redundancy: {
        before: 'Single hub creates single point of failure',
        after: 'Multiple spines provide path diversity',
        change: '+300% path availability',
      },
      trafficPatterns: {
        before: '90% north-south, spoke-to-spoke inefficient',
        after: '80% east-west, optimized server-to-server',
        improvement: 'Reduced latency for intra-datacenter traffic',
      },
      scalability: {
        before: 'Limited by hub capacity (~100 spokes)',
        after: 'Easily scales by adding leaf switches',
        improvement: 'Linear scalability with predictable performance',
      },
      cost: {
        before: 'Lower initial cost, high WAN circuit costs',
        after: 'Higher initial infrastructure, lower operational costs',
        change: 'ROI achieved within 18-24 months',
      },
    },
    benefits: [
      'Optimized for modern application architectures',
      'Predictable performance characteristics',
      'Easy to scale horizontally',
      'Excellent for virtualization and containers',
      'Supports ECMP and advanced routing',
    ],
    considerations: [
      'Requires significant upfront investment',
      'More complex initial setup',
      'Requires skilled network engineers',
      'Best suited for data center environments',
      'May be overkill for simple networks',
    ],
  },
];

export const trafficFlowAnimations: TrafficFlowAnimation[] = [
  {
    id: 'ns-web-traffic',
    name: 'North-South Web Traffic',
    type: 'north-south',
    path: ['internet', 'firewall', 'core1', 'dist1', 'acc1', 'webserver'],
    duration: 2000,
    color: '#3b82f6',
    description: 'Client accessing web server from internet',
  },
  {
    id: 'ew-database-query',
    name: 'East-West Database Query',
    type: 'east-west',
    path: ['webserver', 'acc1', 'dist1', 'dist2', 'acc3', 'database'],
    duration: 1500,
    color: '#10b981',
    description: 'Application server querying database server',
  },
  {
    id: 'ew-microservices',
    name: 'East-West Microservices',
    type: 'east-west',
    path: ['service-a', 'leaf1', 'spine1', 'leaf2', 'service-b'],
    duration: 1000,
    color: '#f59e0b',
    description: 'Microservice-to-microservice communication',
  },
];
