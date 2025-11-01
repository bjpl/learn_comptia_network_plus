/**
 * Comprehensive networking appliance database with 25+ devices
 * Aligned with CompTIA Network+ N10-008 LO 1.1
 */

import type { ComparisonDevice, ExamQuestion } from './appliances-types';

export const enhancedNetworkDevices: ComparisonDevice[] = [
  // LAYER 1 DEVICES
  {
    id: 'ethernet-hub-16port',
    name: 'Generic 16-Port Ethernet Hub',
    type: 'hub',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Legacy Hub',

    osiLayers: [1],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical layer only - broadcasts to all ports',

    collisionDomains: 'single',
    broadcastDomains: 'single',
    domainNotes: 'All ports share one collision domain - major limitation',

    specs: {
      throughput: '10-100 Mbps (shared)',
      maxConnections: 16,
      portCount: 16,
      rackUnits: 0,
      powerConsumption: '10W',
      memoryGB: 0,
      storageGB: 0,
      redundancy: false,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 25,
      annualMaintenanceCost: 0,
      powerCostPerYear: 11,
      totalCostYear1: 36,
      totalCost3Years: 58,
      totalCost5Years: 80,
    },

    examFocus: [
      'Single collision domain shared by all ports',
      'Half-duplex operation only',
      'Broadcasts to all ports (inefficient)',
      'Obsolete technology - know limitations for exam',
      'Difference between hub and switch is critical exam topic',
    ],

    commonMisconceptions: [
      'Hub is NOT a switch - no MAC address learning',
      'Hub does NOT create collision domains per port',
      'Hub operates at Layer 1, not Layer 2',
    ],

    realWorldScenarios: [
      {
        title: 'Educational Lab - Demonstrating Collisions',
        description: 'Network engineering classroom',
        requirements: ['Show collision behavior', 'Budget constraint'],
        whyThisDevice: 'Demonstrates collision domains for teaching purposes',
        alternatives: ['Packet capture with switch in promiscuous mode'],
      },
    ],

    whenToUse: [
      'Educational demonstrations only',
      'Temporary network monitoring (promiscuous mode)',
      'Extremely cost-sensitive legacy scenarios',
    ],

    whenNotToUse: [
      'Any production environment',
      'Networks requiring performance',
      'Modern deployments (always use switch instead)',
    ],

    useCase: ['Educational labs', 'Legacy demonstration'],

    pros: [
      'Very inexpensive',
      'Simple operation',
      'No configuration required',
      'Useful for teaching collision concepts',
    ],

    cons: [
      'Single collision domain (major performance issue)',
      'Half-duplex only',
      'Inefficient - broadcasts to all ports',
      'Obsolete technology',
      'No security features',
      'Poor performance with multiple devices',
    ],
  },

  {
    id: 'ethernet-repeater',
    name: 'Ethernet Repeater',
    type: 'repeater',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Signal Extender',

    osiLayers: [1],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical layer - regenerates and amplifies signals',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Does not create or separate domains - transparent signal amplification',

    specs: {
      throughput: 'Up to 1 Gbps',
      maxConnections: 2,
      portCount: 2,
      rackUnits: 0,
      powerConsumption: '5W',
      redundancy: false,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 30,
      annualMaintenanceCost: 0,
      powerCostPerYear: 5,
      totalCostYear1: 35,
      totalCost3Years: 45,
      totalCost5Years: 55,
    },

    examFocus: [
      'Extends cable distance by regenerating signals',
      'Layer 1 only - no filtering',
      'Amplifies noise along with signal',
      'Maximum distance extension: 100m per segment (Ethernet)',
    ],

    commonMisconceptions: [
      'Repeater does NOT filter traffic',
      'Does NOT reduce collisions',
      'Cannot connect different network types',
    ],

    realWorldScenarios: [
      {
        title: 'Long Cable Run Extension',
        description: 'Warehouse with devices beyond 100m limit',
        requirements: ['Extend Ethernet beyond 100m', 'Simple solution'],
        whyThisDevice: 'Extends signal reach without complex configuration',
        alternatives: ['Fiber optic link', 'Switch placement'],
      },
    ],

    whenToUse: [
      'Extend Ethernet cable runs beyond 100m',
      'Simple signal amplification needed',
      'Cost-effective distance extension',
    ],

    whenNotToUse: [
      'When filtering is needed',
      'High-performance requirements',
      'Modern networks (use switch instead)',
    ],

    useCase: ['Cable distance extension', 'Legacy network support'],

    pros: ['Extends network reach', 'Simple operation', 'Inexpensive', 'No configuration'],

    cons: [
      'No filtering capability',
      'Amplifies noise',
      'Does not reduce collisions',
      'Limited use in modern networks',
    ],
  },

  {
    id: 'media-converter-fiber',
    name: 'Fiber to Ethernet Media Converter',
    type: 'media-converter',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Fiber-Copper Converter',

    osiLayers: [1],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical layer - converts between media types',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Transparent media conversion - no impact on domains',

    specs: {
      throughput: '1 Gbps',
      maxConnections: 2,
      portCount: 2,
      rackUnits: 0,
      powerConsumption: '3W',
      redundancy: false,
      hotSwappable: true,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 75,
      annualMaintenanceCost: 0,
      powerCostPerYear: 3,
      totalCostYear1: 78,
      totalCost3Years: 84,
      totalCost5Years: 90,
    },

    examFocus: [
      'Converts between fiber and copper Ethernet',
      'Enables distance extension via fiber',
      'Layer 1 only - transparent conversion',
      'Common types: multimode to singlemode, fiber to copper',
    ],

    commonMisconceptions: [
      'Does NOT route or switch traffic',
      'Transparent to upper layers',
      'Cannot change speed (1G to 10G)',
    ],

    realWorldScenarios: [
      {
        title: 'Building-to-Building Connectivity',
        description: 'Campus with fiber backbone, copper access',
        requirements: ['Connect fiber to copper devices', 'Long distance (>100m)'],
        whyThisDevice: 'Bridges different physical media types',
        alternatives: ['Switches with SFP ports', 'Replace cabling'],
      },
    ],

    whenToUse: [
      'Convert fiber to copper or vice versa',
      'Extend distance beyond copper limits',
      'Connect mixed media networks',
    ],

    whenNotToUse: [
      'When native fiber support exists',
      'Speed conversion needed',
      'Layer 2/3 functionality required',
    ],

    useCase: ['Fiber-copper connectivity', 'Distance extension', 'Media type bridging'],

    pros: [
      'Enables distance extension',
      'Simple deployment',
      'Hot-swappable',
      'Transparent operation',
    ],

    cons: [
      'Additional failure point',
      'Requires power',
      'Cannot change speeds',
      'Limited to physical layer',
    ],
  },

  // LAYER 2 DEVICES
  {
    id: 'managed-switch-24port',
    name: 'Managed Gigabit Switch 24-Port',
    type: 'switch',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Enterprise Switch',

    osiLayers: [2],
    primaryOsiLayer: 2,
    osiLayerDescription: 'Data link layer - MAC address forwarding',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-vlan',
    domainNotes: 'Each port = 1 collision domain. VLANs create separate broadcast domains',

    specs: {
      throughput: '48 Gbps',
      maxConnections: 8000,
      portCount: 24,
      rackUnits: 1,
      powerConsumption: '25W',
      memoryGB: 2,
      storageGB: 1,
      redundancy: true,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 300,
      annualMaintenanceCost: 50,
      powerCostPerYear: 27,
      totalCostYear1: 377,
      totalCost3Years: 477,
      totalCost5Years: 577,
    },

    examFocus: [
      'Creates collision domain per port (24 ports = 24 collision domains)',
      'VLANs create separate broadcast domains',
      'MAC address learning and forwarding',
      'Full-duplex operation',
      'Layer 2 only - no IP routing',
    ],

    commonMisconceptions: [
      'Managed switch is NOT a router',
      'VLANs require Layer 3 device for inter-VLAN routing',
      'Broadcast domain = all ports unless VLANs configured',
    ],

    realWorldScenarios: [
      {
        title: 'Small Business LAN Access Layer',
        description: 'Office with 20 workstations',
        requirements: ['VLAN segmentation', 'QoS for VoIP', 'Manageable'],
        whyThisDevice: 'Provides VLAN isolation and quality of service',
        alternatives: ['Unmanaged switch (no VLANs)', 'Layer 3 switch (overkill)'],
      },
    ],

    whenToUse: [
      'LAN access layer switching',
      'VLAN segmentation needed',
      'QoS requirements',
      'Port mirroring for monitoring',
    ],

    whenNotToUse: [
      'Inter-VLAN routing needed (use Layer 3 switch)',
      'Very simple deployments (unmanaged cheaper)',
      'PoE required (use PoE switch)',
    ],

    useCase: ['LAN switching', 'VLAN segmentation', 'Access layer'],

    pros: [
      'One collision domain per port',
      'VLAN support',
      'QoS capabilities',
      'Port mirroring',
      'Manageable via CLI/GUI',
    ],

    cons: [
      'No Layer 3 routing',
      'Requires configuration expertise',
      'Higher cost than unmanaged',
      'No PoE (this model)',
    ],
  },

  {
    id: 'poe-switch-48port',
    name: 'PoE+ Switch 48-Port',
    type: 'poe-switch',
    category: 'physical',
    manufacturer: 'Cisco',
    model: 'Catalyst 2960X-48FPD-L',

    osiLayers: [2],
    primaryOsiLayer: 2,
    osiLayerDescription: 'Data link layer with Power over Ethernet delivery',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-vlan',
    domainNotes: '48 collision domains, VLANs create broadcast domain separation',

    specs: {
      throughput: '176 Gbps',
      maxConnections: 16000,
      portCount: 48,
      rackUnits: 1,
      powerConsumption: '740W (with full PoE)',
      memoryGB: 4,
      storageGB: 8,
      redundancy: true,
      hotSwappable: true,
      poeSupport: {
        standard: '802.3at',
        powerPerPort: 30,
        totalPoeBudget: 740,
        poePortCount: 48,
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 3500,
      annualMaintenanceCost: 400,
      powerCostPerYear: 810,
      totalCostYear1: 4710,
      totalCost3Years: 5910,
      totalCost5Years: 7110,
    },

    examFocus: [
      '802.3at (PoE+) provides 30W per port',
      'Total PoE budget: 740W must be managed across all ports',
      'Powers IP phones, cameras, APs, IoT devices',
      'PoE standards: 802.3af (15.4W), 802.3at (30W), 802.3bt (60-100W)',
    ],

    commonMisconceptions: [
      'Cannot power all 48 ports at maximum wattage simultaneously',
      'PoE budget is shared across all ports',
      'Devices negotiate power requirements',
    ],

    realWorldScenarios: [
      {
        title: 'VoIP Deployment',
        description: 'Office with 40 IP phones and 8 wireless APs',
        requirements: ['Power 48 PoE devices', 'VLAN for voice', 'QoS'],
        whyThisDevice: 'Single cable delivers data and power to endpoints',
        alternatives: ['Non-PoE switch + individual power adapters', 'PoE injectors'],
      },
    ],

    whenToUse: [
      'Powering IP phones, cameras, APs',
      'Simplify cabling (one cable for data + power)',
      'IoT device deployment',
    ],

    whenNotToUse: [
      'Few PoE devices (use PoE injectors)',
      'Very high-power devices beyond PoE++ (100W)',
      'Budget-constrained (non-PoE cheaper)',
    ],

    useCase: ['VoIP deployment', 'Wireless infrastructure', 'Surveillance cameras', 'IoT'],

    pros: [
      'Single cable for data and power',
      'Simplified installation',
      'Centralized power management',
      'PoE+ standard (30W per port)',
      'High port density',
    ],

    cons: [
      'Expensive upfront cost',
      'High power consumption',
      'PoE budget limitations',
      'Requires cooling',
    ],
  },

  {
    id: 'poe-injector-single',
    name: 'Single-Port PoE Injector',
    type: 'poe-injector',
    category: 'physical',
    manufacturer: 'Various',
    model: 'PoE Injector 802.3at',

    osiLayers: [1],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical layer - adds PoE to existing cable',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Transparent pass-through - no impact on domains',

    specs: {
      throughput: '1 Gbps',
      maxConnections: 1,
      portCount: 2,
      rackUnits: 0,
      powerConsumption: '35W',
      redundancy: false,
      hotSwappable: false,
      poeSupport: {
        standard: '802.3at',
        powerPerPort: 30,
        poePortCount: 1,
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 25,
      annualMaintenanceCost: 0,
      powerCostPerYear: 38,
      totalCostYear1: 63,
      totalCost3Years: 139,
      totalCost5Years: 215,
    },

    examFocus: [
      'Midspan PoE injection - adds power between switch and device',
      'Use when existing switch lacks PoE',
      'More cost-effective for 1-3 devices than PoE switch',
      'Transparent to network - operates at physical layer',
    ],

    commonMisconceptions: [
      'Injector does NOT switch or route traffic',
      'One injector per device required',
      'Not scalable for many devices',
    ],

    realWorldScenarios: [
      {
        title: 'Adding Single Wireless AP',
        description: 'Existing non-PoE switch needs to power one AP',
        requirements: ['Single PoE device', 'Existing non-PoE infrastructure'],
        whyThisDevice: 'Cost-effective for single device without replacing switch',
        alternatives: ['Replace switch with PoE switch', 'Separate power adapter'],
      },
    ],

    whenToUse: [
      'Adding PoE to 1-3 devices',
      'Existing non-PoE switch',
      'Cost-effective single-device solution',
    ],

    whenNotToUse: [
      'Many PoE devices needed (use PoE switch)',
      'New deployment (include PoE switch)',
      'Clean cable management required',
    ],

    useCase: ['Retrofit PoE to existing infrastructure', 'Single device power'],

    pros: [
      'Very cost-effective for few devices',
      'No switch replacement needed',
      'Simple installation',
    ],

    cons: [
      'Cable clutter with many devices',
      'One power supply per injector',
      'Not scalable',
      'Multiple failure points',
    ],
  },

  {
    id: 'autonomous-wireless-ap',
    name: 'Autonomous Wireless Access Point',
    type: 'wireless-ap-autonomous',
    category: 'physical',
    manufacturer: 'Ubiquiti',
    model: 'UAP-AC-PRO',

    osiLayers: [2],
    primaryOsiLayer: 2,
    osiLayerDescription: 'Data link layer - bridges wireless to wired LAN',

    collisionDomains: 'none',
    broadcastDomains: 'single',
    domainNotes: 'Wireless = collision-free (CSMA/CA). Extends wired broadcast domain',

    specs: {
      throughput: '1.3 Gbps (450+867 Mbps)',
      maxConnections: 200,
      portCount: 2,
      rackUnits: 0,
      powerConsumption: '9W',
      redundancy: false,
      hotSwappable: false,
      wirelessSpecs: {
        standard: '802.11ac',
        maxClients: 200,
        range: '122m indoor',
        architecture: 'autonomous',
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 150,
      annualMaintenanceCost: 0,
      powerCostPerYear: 10,
      totalCostYear1: 160,
      totalCost3Years: 180,
      totalCost5Years: 200,
    },

    examFocus: [
      'Autonomous = standalone, individually configured',
      'No controller required',
      'Each AP configured independently (CLI, GUI, or cloud)',
      'Best for small deployments (1-5 APs)',
      'Compare to controller-based (centralized management)',
    ],

    commonMisconceptions: [
      'Autonomous does NOT mean no management',
      'Can still be cloud-managed (like UniFi)',
      'Not inherently worse than controller-based',
    ],

    realWorldScenarios: [
      {
        title: 'Small Office Wireless',
        description: 'Office with 1-2 access points',
        requirements: ['Simple wireless', 'No controller budget', 'Easy management'],
        whyThisDevice: 'Standalone operation, no controller cost',
        alternatives: ['Controller-based (overkill)', 'Consumer router (limited features)'],
      },
    ],

    whenToUse: [
      'Small deployments (1-5 APs)',
      'No controller infrastructure',
      'Simple wireless requirements',
      'Budget-constrained',
    ],

    whenNotToUse: [
      'Large deployments (10+ APs)',
      'Centralized management needed',
      'Fast roaming required',
      'Enterprise features needed',
    ],

    useCase: ['Small office wireless', 'SOHO', 'Branch office'],

    pros: [
      'No controller cost',
      'Simple deployment',
      'Standalone operation',
      'Lower total cost for small deployments',
    ],

    cons: [
      'Individual configuration',
      'Difficult to manage many APs',
      'No centralized policy',
      'Limited roaming optimization',
    ],
  },

  {
    id: 'controller-based-wireless-ap',
    name: 'Controller-Based Wireless AP',
    type: 'wireless-ap-controller',
    category: 'physical',
    manufacturer: 'Cisco',
    model: 'Aironet 2802i',

    osiLayers: [2],
    primaryOsiLayer: 2,
    osiLayerDescription: 'Lightweight AP - controlled by WLC',

    collisionDomains: 'none',
    broadcastDomains: 'single',
    domainNotes: 'Wireless collision-free. CAPWAP tunnel to controller',

    specs: {
      throughput: '1.7 Gbps (800+867 Mbps)',
      maxConnections: 200,
      portCount: 1,
      rackUnits: 0,
      powerConsumption: '15W',
      redundancy: true,
      hotSwappable: false,
      wirelessSpecs: {
        standard: '802.11ac',
        maxClients: 200,
        range: '100m indoor',
        architecture: 'controller-based',
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: false,
      loadBalancing: true,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 600,
      annualMaintenanceCost: 100,
      powerCostPerYear: 16,
      totalCostYear1: 716,
      totalCost3Years: 916,
      totalCost5Years: 1116,
    },

    examFocus: [
      'Controller-based = centralized WLC management',
      'CAPWAP/LWAPP tunnel to controller',
      'Lightweight AP - minimal local intelligence',
      'Enterprise scalability (100+ APs per controller)',
      'Fast roaming, load balancing, centralized policy',
    ],

    commonMisconceptions: [
      'AP is NOT standalone - requires WLC',
      'CAPWAP tunnel carries control, not all data',
      'APs can operate with local switching (FlexConnect)',
    ],

    realWorldScenarios: [
      {
        title: 'Enterprise Campus Wireless',
        description: 'University with 100+ access points',
        requirements: ['Centralized management', 'Fast roaming', 'Policy enforcement'],
        whyThisDevice: 'WLC provides unified management and advanced features',
        alternatives: ['Autonomous APs (management nightmare)', 'Cloud-managed APs'],
      },
    ],

    whenToUse: [
      'Large deployments (10+ APs)',
      'Centralized management required',
      'Fast roaming needed',
      'Enterprise features',
    ],

    whenNotToUse: ['Small deployments (1-5 APs)', 'No controller budget', 'Simple requirements'],

    useCase: ['Enterprise wireless', 'Campus networks', 'Large deployments'],

    pros: [
      'Centralized management',
      'Fast roaming',
      'Load balancing',
      'Scalable (100+ APs)',
      'Advanced features',
    ],

    cons: [
      'Requires WLC (additional cost)',
      'More complex',
      'Higher per-AP cost',
      'Controller = single point of failure without HA',
    ],
  },

  {
    id: 'network-bridge',
    name: 'Ethernet Bridge',
    type: 'bridge',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Legacy Bridge',

    osiLayers: [2],
    primaryOsiLayer: 2,
    osiLayerDescription: 'Data link layer - connects two LAN segments',

    collisionDomains: 'per-port',
    broadcastDomains: 'single',
    domainNotes: 'Separates collision domains, passes broadcasts',

    specs: {
      throughput: '100 Mbps',
      maxConnections: 2,
      portCount: 2,
      rackUnits: 0,
      powerConsumption: '5W',
      redundancy: false,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 100,
      annualMaintenanceCost: 0,
      powerCostPerYear: 5,
      totalCostYear1: 105,
      totalCost3Years: 115,
      totalCost5Years: 125,
    },

    examFocus: [
      'Connects two LAN segments',
      'Creates separate collision domains (one per segment)',
      'Passes broadcasts between segments',
      'MAC address filtering',
      'Largely obsolete - replaced by switches',
    ],

    commonMisconceptions: [
      'Bridge is NOT a router - no IP awareness',
      'Does NOT separate broadcast domains',
      'Modern switches are multi-port bridges',
    ],

    realWorldScenarios: [
      {
        title: 'Legacy LAN Segmentation',
        description: 'Historical context only',
        requirements: ['Reduce collision domain size', 'Pre-switch era'],
        whyThisDevice: 'Reduced collisions in legacy networks',
        alternatives: ['Modern switch (always preferred)'],
      },
    ],

    whenToUse: ['Historical exam knowledge only', 'Specialized legacy scenarios'],

    whenNotToUse: ['Any modern deployment (use switch)'],

    useCase: ['Educational/historical reference', 'Legacy network support'],

    pros: ['Reduces collision domain size', 'Simple operation', 'MAC filtering'],

    cons: [
      'Obsolete technology',
      'Limited scalability (2 ports)',
      'Switches are superior',
      'No VLAN support',
    ],
  },

  // LAYER 3 DEVICES
  {
    id: 'cisco-router-4331',
    name: 'Cisco ISR 4331 Router',
    type: 'router',
    category: 'physical',
    manufacturer: 'Cisco',
    model: 'ISR 4331',

    osiLayers: [1, 2, 3],
    primaryOsiLayer: 3,
    osiLayerDescription: 'Network layer - IP routing between networks',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Router separates broadcast domains - each interface = separate network',

    specs: {
      throughput: '100-300 Mbps',
      maxConnections: 5000,
      portCount: 3,
      rackUnits: 1,
      powerConsumption: '50-75W',
      memoryGB: 4,
      storageGB: 8,
      redundancy: true,
      hotSwappable: false,
      vpnSpecs: {
        types: ['ipsec', 'ssl'],
        maxTunnels: 250,
        throughputEncrypted: '100 Mbps',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: true,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 3500,
      annualMaintenanceCost: 500,
      powerCostPerYear: 65,
      totalCostYear1: 4065,
      totalCost3Years: 5565,
      totalCost5Years: 6565,
    },

    examFocus: [
      'Router operates at Layer 3 (Network)',
      'Each interface = separate broadcast domain',
      'Default gateway for end devices',
      'Routing protocols: OSPF, EIGRP, BGP',
      'NAT, ACLs, VPN capabilities',
    ],

    commonMisconceptions: [
      'Router is NOT a switch - different purpose',
      'Routers DO separate broadcast domains',
      'Inter-VLAN routing requires Layer 3 device',
    ],

    realWorldScenarios: [
      {
        title: 'Branch Office WAN Connectivity',
        description: 'Remote office connecting to headquarters',
        requirements: ['WAN routing', 'VPN', 'NAT', 'Firewall ACLs'],
        whyThisDevice: 'Enterprise router with WAN interfaces and security',
        alternatives: ['Layer 3 switch (no WAN)', 'UTM (SMB alternative)'],
      },
    ],

    whenToUse: [
      'WAN connectivity',
      'Inter-network routing',
      'Branch office',
      'Internet gateway',
      'VPN termination',
    ],

    whenNotToUse: [
      'LAN switching only (use switch)',
      'Simple inter-VLAN (use Layer 3 switch)',
      'Budget-constrained SMB (consider UTM)',
    ],

    useCase: ['Branch office', 'WAN aggregation', 'VPN termination', 'Internet edge'],

    pros: [
      'Proven reliability',
      'Extensive protocol support',
      'Security features (ACLs, VPN)',
      'WAN interfaces',
      'High availability',
    ],

    cons: [
      'Expensive',
      'Complex configuration',
      'Requires specialized knowledge',
      'Higher latency than Layer 2 switching',
    ],
  },

  {
    id: 'layer3-switch-48port',
    name: 'Layer 3 Switch 48-Port',
    type: 'layer3-switch',
    category: 'physical',
    manufacturer: 'Cisco',
    model: 'Catalyst 3850-48P',

    osiLayers: [2, 3],
    primaryOsiLayer: 3,
    osiLayerDescription: 'Data link + Network - wire-speed inter-VLAN routing',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-vlan',
    domainNotes: 'VLANs create broadcast domains. SVIs provide inter-VLAN routing',

    specs: {
      throughput: '176 Gbps',
      maxConnections: 32000,
      portCount: 48,
      rackUnits: 1,
      powerConsumption: '740W (with PoE)',
      memoryGB: 8,
      storageGB: 32,
      redundancy: true,
      hotSwappable: true,
      poeSupport: {
        standard: '802.3at',
        powerPerPort: 30,
        totalPoeBudget: 740,
        poePortCount: 48,
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 8000,
      annualMaintenanceCost: 1000,
      powerCostPerYear: 810,
      totalCostYear1: 9810,
      totalCost3Years: 11810,
      totalCost5Years: 13810,
    },

    examFocus: [
      'Multilayer switch = Layer 2 + Layer 3',
      'Wire-speed inter-VLAN routing (hardware ASIC)',
      'SVIs (Switch Virtual Interfaces) provide Layer 3 routing',
      'Faster than router-on-a-stick for inter-VLAN',
      'Distribution/core layer use',
    ],

    commonMisconceptions: [
      'Layer 3 switch is NOT a full router replacement',
      'Limited WAN interface support vs router',
      'Excels at inter-VLAN, not WAN routing',
    ],

    realWorldScenarios: [
      {
        title: 'Campus Distribution Layer',
        description: 'University with 10 VLANs, heavy inter-VLAN traffic',
        requirements: ['Fast inter-VLAN routing', 'PoE for APs', 'High throughput'],
        whyThisDevice: 'Hardware-accelerated routing between VLANs',
        alternatives: ['Router-on-a-stick (slow)', 'Separate router + switch (complex)'],
      },
    ],

    whenToUse: [
      'Inter-VLAN routing',
      'Campus distribution/core',
      'High-performance LAN routing',
      'PoE for infrastructure',
    ],

    whenNotToUse: [
      'WAN connectivity (limited WAN support)',
      'Small networks (Layer 2 switch sufficient)',
      'Budget-constrained',
    ],

    useCase: ['Campus distribution', 'Inter-VLAN routing', 'Data center access'],

    pros: [
      'Wire-speed inter-VLAN routing',
      'High port density',
      'PoE support',
      'Stackable',
      'ASIC-based forwarding',
    ],

    cons: [
      'Expensive',
      'Limited WAN features',
      'Complex configuration',
      'Overkill for small networks',
    ],
  },

  // SECURITY DEVICES
  {
    id: 'stateless-firewall',
    name: 'Stateless Firewall (ACL-based)',
    type: 'firewall-stateless',
    category: 'physical',
    manufacturer: 'Various',
    model: 'Packet Filter',

    osiLayers: [3, 4],
    primaryOsiLayer: 3,
    osiLayerDescription: 'Network/Transport - packet filtering without state tracking',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Acts as router - separates broadcast domains',

    specs: {
      throughput: '1 Gbps',
      maxConnections: 10000,
      portCount: 4,
      rackUnits: 1,
      powerConsumption: '40W',
      memoryGB: 2,
      redundancy: false,
      hotSwappable: false,
      securitySpecs: {
        inspectionType: 'stateless',
        deploymentMode: 'routed',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 500,
      annualMaintenanceCost: 50,
      powerCostPerYear: 44,
      totalCostYear1: 594,
      totalCost3Years: 694,
      totalCost5Years: 794,
    },

    examFocus: [
      'Stateless = no connection tracking',
      'Filters based on 5-tuple (src IP, dst IP, src port, dst port, protocol)',
      'Each packet evaluated independently',
      'Fast but less secure than stateful',
      'Compare to stateful inspection',
    ],

    commonMisconceptions: [
      'Stateless is NOT always inferior',
      'Faster processing than stateful',
      'Cannot detect out-of-sequence attacks',
    ],

    realWorldScenarios: [
      {
        title: 'High-Speed Packet Filtering',
        description: 'ISP edge routing with simple filtering',
        requirements: ['Very high throughput', 'Simple allow/deny rules'],
        whyThisDevice: 'Minimal processing overhead for maximum speed',
        alternatives: ['Stateful firewall (lower throughput)'],
      },
    ],

    whenToUse: [
      'High-performance requirements',
      'Simple filtering rules',
      'Low-complexity scenarios',
    ],

    whenNotToUse: [
      'Security-critical environments',
      'Session-aware filtering needed',
      'Modern threats',
    ],

    useCase: ['Simple packet filtering', 'High-speed scenarios', 'Legacy networks'],

    pros: ['Very fast', 'Low overhead', 'Simple rules', 'Predictable performance'],

    cons: [
      'No session tracking',
      'Vulnerable to spoofing',
      'Cannot detect attacks spanning packets',
      'Less secure',
    ],
  },

  {
    id: 'stateful-firewall-fortigate',
    name: 'FortiGate 100F Stateful Firewall',
    type: 'firewall-stateful',
    category: 'physical',
    manufacturer: 'Fortinet',
    model: 'FG-100F',

    osiLayers: [3, 4],
    primaryOsiLayer: 4,
    osiLayerDescription: 'Network/Transport - stateful packet inspection',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Routed firewall - separates networks and broadcast domains',

    specs: {
      throughput: '10 Gbps',
      maxConnections: 500000,
      portCount: 18,
      rackUnits: 1,
      powerConsumption: '35W',
      memoryGB: 4,
      storageGB: 240,
      redundancy: true,
      hotSwappable: true,
      securitySpecs: {
        inspectionType: 'stateful',
        deploymentMode: 'routed',
        threatsPerSecond: 50000,
      },
      vpnSpecs: {
        types: ['ipsec', 'ssl'],
        maxTunnels: 200,
        throughputEncrypted: '1.5 Gbps',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: true,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 1800,
      annualMaintenanceCost: 650,
      powerCostPerYear: 38,
      totalCostYear1: 2488,
      totalCost3Years: 3788,
      totalCost5Years: 5088,
    },

    examFocus: [
      'Stateful = maintains connection state tables',
      'SPI (Stateful Packet Inspection)',
      'Tracks TCP connections, UDP pseudo-sessions',
      'More secure than stateless',
      'Return traffic automatically allowed for established connections',
    ],

    commonMisconceptions: [
      'Stateful does NOT equal NGFW',
      'State table has size limits',
      'Does NOT perform deep packet inspection (DPI)',
    ],

    realWorldScenarios: [
      {
        title: 'SMB Perimeter Security',
        description: 'Company with 50 users, internet gateway',
        requirements: ['Secure perimeter', 'VPN', 'NAT', 'Session awareness'],
        whyThisDevice: 'Balances security and performance for SMB',
        alternatives: ['Stateless (less secure)', 'NGFW (more expensive)'],
      },
    ],

    whenToUse: [
      'Perimeter security',
      'Session-aware filtering',
      'VPN termination',
      'SMB to enterprise',
    ],

    whenNotToUse: [
      'Advanced threat prevention needed (use NGFW)',
      'Very simple scenarios (stateless sufficient)',
    ],

    useCase: ['Perimeter firewall', 'VPN gateway', 'NAT', 'DMZ protection'],

    pros: [
      'Session-aware security',
      'Automatic return traffic',
      'VPN support',
      'NAT capabilities',
      'High performance',
    ],

    cons: [
      'State table memory limits',
      'Higher overhead than stateless',
      'No application awareness',
      'No IPS/threat prevention',
    ],
  },

  {
    id: 'ngfw-palo-alto',
    name: 'Palo Alto PA-220 NGFW',
    type: 'firewall-ngfw',
    category: 'physical',
    manufacturer: 'Palo Alto',
    model: 'PA-220',

    osiLayers: [3, 4, 5, 6, 7],
    primaryOsiLayer: 7,
    osiLayerDescription: 'All layers - application-aware next-gen firewall',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Acts as router/firewall - full network segmentation',

    specs: {
      throughput: '500 Mbps (with all features)',
      maxConnections: 50000,
      portCount: 8,
      rackUnits: 1,
      powerConsumption: '25W',
      memoryGB: 4,
      storageGB: 128,
      redundancy: true,
      hotSwappable: false,
      securitySpecs: {
        inspectionType: 'deep-packet',
        deploymentMode: 'routed',
        threatsPerSecond: 10000,
      },
      vpnSpecs: {
        types: ['ipsec', 'ssl'],
        maxTunnels: 50,
        throughputEncrypted: '200 Mbps',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: true,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: true,
      threatPrevention: true,
      webFiltering: true,
      applicationControl: true,
    },

    pricing: {
      initialCost: 3000,
      annualMaintenanceCost: 1200,
      powerCostPerYear: 27,
      totalCostYear1: 4227,
      totalCost3Years: 6627,
      totalCost5Years: 9027,
    },

    examFocus: [
      'NGFW = Stateful FW + IPS + App Control + Threat Intel',
      'Deep packet inspection (DPI)',
      'Application identification (not just port numbers)',
      'SSL/TLS inspection',
      'Integrated threat prevention',
      'Most advanced firewall type',
    ],

    commonMisconceptions: [
      'NGFW is not just a faster firewall',
      'Performance decreases with all features enabled',
      'Requires subscription for threat updates',
    ],

    realWorldScenarios: [
      {
        title: 'Enterprise Perimeter Security',
        description: 'Company with advanced threat landscape',
        requirements: ['App-level control', 'Threat prevention', 'Visibility'],
        whyThisDevice: 'Unified security platform with deep visibility',
        alternatives: ['Stateful FW + separate IPS (complex)', 'UTM (less capable)'],
      },
    ],

    whenToUse: [
      'Advanced threat environments',
      'Application-level control needed',
      'Comprehensive security',
      'Enterprise perimeter',
    ],

    whenNotToUse: [
      'Budget-constrained',
      'Simple security requirements',
      'Performance-critical (DPI impacts throughput)',
    ],

    useCase: ['Enterprise perimeter', 'Data center security', 'Advanced threats'],

    pros: [
      'Application awareness',
      'Integrated IPS',
      'Threat intelligence',
      'SSL inspection',
      'Unified platform',
    ],

    cons: [
      'Expensive (hardware + subscriptions)',
      'Complex configuration',
      'Performance impact with all features',
      'Requires expertise',
    ],
  },

  {
    id: 'ids-snort',
    name: 'Intrusion Detection System (Snort)',
    type: 'ids',
    category: 'virtual',
    manufacturer: 'Cisco (Snort)',
    model: 'Snort IDS',

    osiLayers: [3, 4, 5, 6, 7],
    primaryOsiLayer: 7,
    osiLayerDescription: 'All layers - passive monitoring and detection',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Out-of-band - no impact on domains (monitoring only)',

    specs: {
      throughput: 'N/A (passive)',
      maxConnections: 0,
      portCount: 0,
      rackUnits: 0,
      powerConsumption: '0W (VM)',
      memoryGB: 8,
      storageGB: 100,
      redundancy: false,
      hotSwappable: true,
      securitySpecs: {
        inspectionType: 'deep-packet',
        deploymentMode: 'out-of-band',
        threatsPerSecond: 5000,
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: true,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 0,
      annualMaintenanceCost: 500,
      powerCostPerYear: 0,
      totalCostYear1: 500,
      totalCost3Years: 1500,
      totalCost5Years: 2500,
    },

    examFocus: [
      'IDS = Intrusion Detection System (passive)',
      'Out-of-band deployment - monitors copy of traffic',
      'Port mirroring or network TAP',
      'Alerts only - CANNOT block',
      'Compare to IPS (active prevention)',
    ],

    commonMisconceptions: [
      'IDS CANNOT block traffic',
      'Does not sit in-line',
      'Relies on SPAN/mirror ports or TAPs',
    ],

    realWorldScenarios: [
      {
        title: 'Security Monitoring and Forensics',
        description: 'Enterprise needing visibility without blocking risk',
        requirements: ['Threat detection', 'No blocking', 'Forensic analysis'],
        whyThisDevice: 'Passive monitoring without disrupting traffic',
        alternatives: ['IPS (active blocking)', 'NGFW (integrated)'],
      },
    ],

    whenToUse: [
      'Monitoring without blocking',
      'Forensic analysis',
      'Compliance requirements',
      'Low-risk deployments',
    ],

    whenNotToUse: ['Active blocking required (use IPS)', 'Real-time prevention needed'],

    useCase: ['Security monitoring', 'Compliance', 'Forensics', 'Threat research'],

    pros: [
      'No risk of blocking legitimate traffic',
      'Comprehensive visibility',
      'Free (Snort open-source)',
      'No performance impact',
    ],

    cons: [
      'Cannot block attacks',
      'Reactive only',
      'Requires separate blocking mechanism',
      'Alert fatigue',
    ],
  },

  {
    id: 'ips-suricata',
    name: 'Intrusion Prevention System (Suricata)',
    type: 'ips',
    category: 'virtual',
    manufacturer: 'OISF',
    model: 'Suricata IPS',

    osiLayers: [3, 4, 5, 6, 7],
    primaryOsiLayer: 7,
    osiLayerDescription: 'All layers - inline threat prevention',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Inline deployment - acts as transparent bridge or router',

    specs: {
      throughput: '2 Gbps',
      maxConnections: 100000,
      portCount: 0,
      rackUnits: 0,
      powerConsumption: '0W (VM)',
      memoryGB: 16,
      storageGB: 200,
      redundancy: true,
      hotSwappable: true,
      securitySpecs: {
        inspectionType: 'deep-packet',
        deploymentMode: 'inline',
        threatsPerSecond: 20000,
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: true,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: true,
      threatPrevention: true,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 0,
      annualMaintenanceCost: 1000,
      powerCostPerYear: 0,
      totalCostYear1: 1000,
      totalCost3Years: 3000,
      totalCost5Years: 5000,
    },

    examFocus: [
      'IPS = Intrusion Prevention System (active)',
      'Inline deployment - traffic flows through device',
      'Can DROP malicious packets',
      'Signature-based + anomaly detection',
      'Critical difference: IDS detects, IPS prevents',
    ],

    commonMisconceptions: [
      'IPS is not just faster IDS',
      'False positives can block legitimate traffic',
      'Requires careful tuning',
    ],

    realWorldScenarios: [
      {
        title: 'Data Center Threat Prevention',
        description: 'Protecting critical servers from attacks',
        requirements: ['Active blocking', 'Zero-day protection', 'Inline deployment'],
        whyThisDevice: 'Automatically blocks detected threats',
        alternatives: ['IDS (detection only)', 'NGFW (all-in-one)'],
      },
    ],

    whenToUse: [
      'Active threat prevention',
      'Inline protection',
      'Data center security',
      'Critical asset protection',
    ],

    whenNotToUse: ['Monitoring only (use IDS)', 'Cannot tolerate false positive blocks'],

    useCase: ['Threat prevention', 'Data center security', 'Zero-day protection'],

    pros: [
      'Active blocking',
      'Real-time prevention',
      'Signature + anomaly detection',
      'Free (Suricata open-source)',
    ],

    cons: [
      'False positive risk',
      'Impacts throughput',
      'Single point of failure',
      'Requires tuning',
    ],
  },

  {
    id: 'proxy-squid',
    name: 'Squid Proxy Server',
    type: 'proxy',
    category: 'virtual',
    manufacturer: 'Squid Cache',
    model: 'Squid Proxy',

    osiLayers: [7],
    primaryOsiLayer: 7,
    osiLayerDescription: 'Application layer - HTTP/HTTPS proxy',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Application-level proxy - no Layer 2/3 impact',

    specs: {
      throughput: '1 Gbps',
      maxConnections: 10000,
      portCount: 0,
      rackUnits: 0,
      powerConsumption: '0W (VM)',
      memoryGB: 8,
      storageGB: 500,
      redundancy: true,
      hotSwappable: true,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: true,
      applicationControl: true,
    },

    pricing: {
      initialCost: 0,
      annualMaintenanceCost: 300,
      powerCostPerYear: 0,
      totalCostYear1: 300,
      totalCost3Years: 900,
      totalCost5Years: 1500,
    },

    examFocus: [
      'Proxy = intermediary for client requests',
      'Forward proxy (client-side) vs Reverse proxy (server-side)',
      'Content caching improves performance',
      'URL filtering and content control',
      'SSL/TLS inspection',
    ],

    commonMisconceptions: [
      'Proxy is not a firewall',
      'Can be bypassed if not enforced',
      'Transparent vs explicit proxy',
    ],

    realWorldScenarios: [
      {
        title: 'Corporate Web Filtering',
        description: 'Company enforcing acceptable use policy',
        requirements: ['Block inappropriate sites', 'Cache content', 'Monitor usage'],
        whyThisDevice: 'Centralized web access control and caching',
        alternatives: ['NGFW with web filtering', 'DNS filtering'],
      },
    ],

    whenToUse: [
      'Web content filtering',
      'Caching for performance',
      'Bandwidth optimization',
      'Usage monitoring',
    ],

    whenNotToUse: [
      'All protocols (proxy is HTTP/HTTPS only)',
      'Transparent security (can be bypassed)',
    ],

    useCase: ['Web filtering', 'Content caching', 'Bandwidth optimization'],

    pros: [
      'Content caching',
      'URL filtering',
      'Bandwidth savings',
      'Free (Squid)',
      'Detailed logging',
    ],

    cons: [
      'HTTP/HTTPS only',
      'Can be bypassed',
      'SSL inspection complexity',
      'Maintenance overhead',
    ],
  },

  {
    id: 'utm-fortigate-60f',
    name: 'FortiGate 60F UTM',
    type: 'utm',
    category: 'physical',
    manufacturer: 'Fortinet',
    model: 'FG-60F',

    osiLayers: [3, 4, 5, 6, 7],
    primaryOsiLayer: 7,
    osiLayerDescription: 'All layers - unified threat management',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'All-in-one security appliance with routing',

    specs: {
      throughput: '2 Gbps (firewall), 300 Mbps (UTM)',
      maxConnections: 200000,
      portCount: 10,
      rackUnits: 0,
      powerConsumption: '18W',
      memoryGB: 4,
      storageGB: 128,
      redundancy: true,
      hotSwappable: false,
      securitySpecs: {
        inspectionType: 'deep-packet',
        deploymentMode: 'routed',
        threatsPerSecond: 5000,
      },
      vpnSpecs: {
        types: ['ipsec', 'ssl'],
        maxTunnels: 100,
        throughputEncrypted: '500 Mbps',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: true,
      loadBalancing: true,
      highAvailability: true,
      deepPacketInspection: true,
      threatPrevention: true,
      webFiltering: true,
      applicationControl: true,
    },

    pricing: {
      initialCost: 1200,
      annualMaintenanceCost: 500,
      powerCostPerYear: 20,
      totalCostYear1: 1720,
      totalCost3Years: 2720,
      totalCost5Years: 3720,
    },

    examFocus: [
      'UTM = Unified Threat Management (all-in-one)',
      'Combines: Firewall + IPS + AV + VPN + Web Filter + App Control',
      'Best for SMB - simplifies management',
      'Single device, single vendor, single pane of glass',
      'Trade-off: performance vs features',
    ],

    commonMisconceptions: [
      'UTM is not enterprise-class NGFW',
      'Performance degrades with all features enabled',
      'Single point of failure',
    ],

    realWorldScenarios: [
      {
        title: 'Small Business Complete Security',
        description: 'SMB with 25 users, limited IT staff',
        requirements: ['All security features', 'Simple management', 'Budget-friendly'],
        whyThisDevice: 'Single device provides all security functions',
        alternatives: ['Separate devices (complex)', 'NGFW (expensive)'],
      },
    ],

    whenToUse: [
      'Small to medium business',
      'Simplified management',
      'Limited IT staff',
      'Budget constraints',
    ],

    whenNotToUse: [
      'Enterprise scale',
      'High-performance requirements',
      'Critical environments (single point of failure)',
    ],

    useCase: ['SMB security', 'Branch office', 'SOHO', 'Retail'],

    pros: [
      'All-in-one solution',
      'Simplified management',
      'Lower total cost',
      'Single vendor support',
      'Quick deployment',
    ],

    cons: [
      'Single point of failure',
      'Performance bottleneck',
      'Limited scalability',
      'Feature trade-offs',
    ],
  },

  // APPLICATION DELIVERY DEVICES
  {
    id: 'load-balancer-haproxy',
    name: 'HAProxy Load Balancer',
    type: 'load-balancer',
    category: 'virtual',
    manufacturer: 'HAProxy Technologies',
    model: 'HAProxy',

    osiLayers: [4, 7],
    primaryOsiLayer: 4,
    osiLayerDescription: 'Transport/Application - load distribution',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'Application delivery - operates above Layer 2/3',

    specs: {
      throughput: '10 Gbps',
      maxConnections: 1000000,
      portCount: 0,
      rackUnits: 0,
      powerConsumption: '0W (VM)',
      memoryGB: 16,
      storageGB: 50,
      redundancy: true,
      hotSwappable: true,
      loadBalancerSpecs: {
        algorithms: ['round-robin', 'least-connections', 'ip-hash', 'weighted', 'leasttime'],
        sessionPersistence: true,
        sslOffload: true,
        healthChecks: true,
      },
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: true,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 0,
      annualMaintenanceCost: 500,
      powerCostPerYear: 0,
      totalCostYear1: 500,
      totalCost3Years: 1500,
      totalCost5Years: 2500,
    },

    examFocus: [
      'Load balancer distributes traffic across servers',
      'Algorithms: round-robin, least connections, IP hash',
      'Session persistence (sticky sessions)',
      'Health checks and automatic failover',
      'SSL offloading',
    ],

    commonMisconceptions: [
      'Load balancer is not a firewall',
      'Session persistence is critical for stateful apps',
      'Health checks prevent traffic to failed servers',
    ],

    realWorldScenarios: [
      {
        title: 'Web Application Scaling',
        description: 'E-commerce site with 3 web servers',
        requirements: ['Distribute load', 'SSL offload', 'Session persistence'],
        whyThisDevice: 'Scales application across multiple servers',
        alternatives: ['DNS round-robin (no health checks)', 'Hardware LB (expensive)'],
      },
    ],

    whenToUse: ['Application scaling', 'High availability', 'SSL offloading', 'Web farms'],

    whenNotToUse: ['Single server (no scaling benefit)', 'Very simple scenarios'],

    useCase: ['Web application scaling', 'HA', 'SSL offload', 'API gateway'],

    pros: [
      'Application scalability',
      'High availability',
      'Health checks',
      'SSL offloading',
      'Free (HAProxy)',
    ],

    cons: [
      'Complex configuration',
      'Single point of failure without HA',
      'Application-specific tuning required',
    ],
  },

  {
    id: 'vpn-concentrator-cisco-asa',
    name: 'Cisco ASA 5506-X VPN Concentrator',
    type: 'vpn-concentrator',
    category: 'physical',
    manufacturer: 'Cisco',
    model: 'ASA 5506-X',

    osiLayers: [3, 7],
    primaryOsiLayer: 3,
    osiLayerDescription: 'Network (IPsec) / Application (SSL VPN)',

    collisionDomains: 'per-port',
    broadcastDomains: 'per-port',
    domainNotes: 'Acts as firewall/router - separates domains',

    specs: {
      throughput: '750 Mbps (firewall), 100 Mbps (VPN)',
      maxConnections: 50000,
      portCount: 8,
      rackUnits: 1,
      powerConsumption: '40W',
      memoryGB: 4,
      storageGB: 8,
      redundancy: true,
      hotSwappable: false,
      vpnSpecs: {
        types: ['ipsec', 'ssl'],
        maxTunnels: 250,
        throughputEncrypted: '100 Mbps',
      },
    },

    features: {
      layer3Routing: true,
      vlanSupport: true,
      qosCapabilities: true,
      vpnSupport: true,
      loadBalancing: false,
      highAvailability: true,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 2000,
      annualMaintenanceCost: 400,
      powerCostPerYear: 44,
      totalCostYear1: 2444,
      totalCost3Years: 3244,
      totalCost5Years: 4044,
    },

    examFocus: [
      'VPN Concentrator = centralized VPN termination',
      'IPsec VPN: Layer 3, requires client software, site-to-site',
      'SSL VPN: Browser-based, port 443, no client required',
      'Authentication: RADIUS, LDAP, 2FA/MFA',
      'Use cases: remote access, site-to-site',
    ],

    commonMisconceptions: [
      'VPN concentrator is not just a router with VPN',
      'SSL VPN ≠ HTTPS (different purposes)',
      'IPsec requires client, SSL does not',
    ],

    realWorldScenarios: [
      {
        title: 'Remote Workforce VPN Access',
        description: 'Company with 200 remote workers',
        requirements: ['Secure remote access', 'Scalable VPN', 'No client for contractors'],
        whyThisDevice: 'Dedicated VPN with both IPsec and SSL options',
        alternatives: ['Router with VPN (limited scale)', 'Cloud VPN service'],
      },
    ],

    whenToUse: [
      'Many remote users',
      'Site-to-site VPN',
      'Dedicated VPN appliance',
      'Scalable remote access',
    ],

    whenNotToUse: ['Few users (router VPN sufficient)', 'Cloud-only (use cloud VPN service)'],

    useCase: ['Remote access VPN', 'Site-to-site VPN', 'Secure connectivity'],

    pros: [
      'Both IPsec and SSL VPN',
      'Scalable (250 tunnels)',
      'Integrated firewall',
      'MFA support',
    ],

    cons: ['Licensing costs', 'Complex configuration', 'Performance impact with encryption'],
  },

  // WAN DEVICES
  {
    id: 'cable-modem-docsis',
    name: 'DOCSIS 3.1 Cable Modem',
    type: 'modem',
    category: 'physical',
    manufacturer: 'Motorola',
    model: 'MB8600',

    osiLayers: [1, 2],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical/Data link - modulate/demodulate signals',

    collisionDomains: 'none',
    broadcastDomains: 'single',
    domainNotes: 'Bridges cable network to Ethernet',

    specs: {
      throughput: '1 Gbps',
      maxConnections: 1,
      portCount: 1,
      rackUnits: 0,
      powerConsumption: '12W',
      redundancy: false,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 150,
      annualMaintenanceCost: 0,
      powerCostPerYear: 13,
      totalCostYear1: 163,
      totalCost3Years: 189,
      totalCost5Years: 215,
    },

    examFocus: [
      'Modem = modulator/demodulator',
      'Converts analog (cable/DSL) to digital (Ethernet)',
      'Types: Cable (coax), DSL (phone), Fiber (ONT), Cellular',
      'Layer 1/2 device - no routing',
      'Requires router for multiple devices',
    ],

    commonMisconceptions: [
      'Modem is not a router',
      'Modem does not provide WiFi',
      'Connects single device (add router for multiple)',
    ],

    realWorldScenarios: [
      {
        title: 'Home Internet Connection',
        description: 'Residential cable internet',
        requirements: ['Cable ISP connection', 'Gigabit speeds'],
        whyThisDevice: 'Connects cable service to home network',
        alternatives: ['ISP-provided modem (rental fee)', 'Modem/router combo'],
      },
    ],

    whenToUse: ['Cable/DSL/Fiber internet connection', 'ISP termination', 'Avoid ISP rental fees'],

    whenNotToUse: ['Multiple devices without router', 'WiFi needed (add router/AP)'],

    useCase: ['Internet connectivity', 'WAN access', 'ISP termination'],

    pros: [
      'Essential for internet access',
      'Own vs rent from ISP',
      'Simple operation',
      'DOCSIS 3.1 = gigabit capable',
    ],

    cons: [
      'ISP-specific compatibility',
      'No routing or WiFi',
      'Single device connection',
      'Provider dependency',
    ],
  },

  {
    id: 'csu-dsu-t1',
    name: 'CSU/DSU T1 Interface',
    type: 'csu-dsu',
    category: 'physical',
    manufacturer: 'Various',
    model: 'T1 CSU/DSU',

    osiLayers: [1],
    primaryOsiLayer: 1,
    osiLayerDescription: 'Physical - digital circuit termination',

    collisionDomains: 'none',
    broadcastDomains: 'none',
    domainNotes: 'DTE/DCE interface - transparent to domains',

    specs: {
      throughput: '1.544 Mbps (T1)',
      maxConnections: 1,
      portCount: 2,
      rackUnits: 1,
      powerConsumption: '15W',
      redundancy: false,
      hotSwappable: false,
    },

    features: {
      layer3Routing: false,
      vlanSupport: false,
      qosCapabilities: false,
      vpnSupport: false,
      loadBalancing: false,
      highAvailability: false,
      deepPacketInspection: false,
      threatPrevention: false,
      webFiltering: false,
      applicationControl: false,
    },

    pricing: {
      initialCost: 500,
      annualMaintenanceCost: 100,
      powerCostPerYear: 16,
      totalCostYear1: 616,
      totalCost3Years: 816,
      totalCost5Years: 1016,
    },

    examFocus: [
      'CSU/DSU = Channel Service Unit / Data Service Unit',
      'Interfaces between DTE (router) and digital circuit (T1/T3)',
      'T1 = 1.544 Mbps, T3 = 44.736 Mbps',
      'CSU: line termination, signal regen, error checking',
      'DSU: frame conversion, timing, clock recovery',
      'Mostly obsolete - replaced by fiber/Ethernet',
    ],

    commonMisconceptions: [
      'CSU and DSU are separate functions in one device',
      'Not a router - just physical interface',
      'Legacy technology - rarely deployed new',
    ],

    realWorldScenarios: [
      {
        title: 'Legacy T1 Leased Line',
        description: 'Historical or existing T1 connection',
        requirements: ['T1 circuit termination', 'Legacy WAN'],
        whyThisDevice: 'Required for T1 connectivity',
        alternatives: ['Modern fiber/Ethernet WAN', 'MPLS'],
      },
    ],

    whenToUse: [
      'Existing T1/T3 circuits',
      'Legacy WAN connectivity',
      'Exam knowledge (historical)',
    ],

    whenNotToUse: ['New deployments (use fiber/Ethernet)', 'High bandwidth needs'],

    useCase: ['Legacy T1/T3 circuits', 'Leased line termination', 'Exam reference'],

    pros: ['Dedicated bandwidth', 'Reliable (when deployed)', 'SLA-backed'],

    cons: [
      'Obsolete technology',
      'Expensive vs modern alternatives',
      'Low bandwidth (1.544 Mbps)',
      'Rarely deployed new',
    ],
  },
];

// Exam practice questions
export const examQuestions: ExamQuestion[] = [
  {
    id: 'q001',
    difficulty: 'easy',
    category: 'osi-layers',
    question: 'At which OSI layer does a hub operate?',
    options: [
      { id: 'a', text: 'Layer 1 (Physical)', correct: true },
      { id: 'b', text: 'Layer 2 (Data Link)', correct: false },
      { id: 'c', text: 'Layer 3 (Network)', correct: false },
      { id: 'd', text: 'Layer 4 (Transport)', correct: false },
    ],
    explanation:
      'A hub operates at Layer 1 (Physical) because it simply repeats electrical signals to all ports without any intelligence about MAC addresses or IP addresses.',
    relatedDevices: ['ethernet-hub-16port', 'ethernet-repeater'],
    examTip: 'Remember: Hub = Layer 1, Switch = Layer 2, Router = Layer 3',
  },

  {
    id: 'q002',
    difficulty: 'medium',
    category: 'collision-broadcast-domains',
    question: 'A network has one 24-port switch. How many collision domains are present?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '12', correct: false },
      { id: 'c', text: '24', correct: true },
      { id: 'd', text: '48', correct: false },
    ],
    explanation:
      'Each port on a switch creates its own collision domain. With 24 ports, there are 24 collision domains. This is a key difference from a hub, which has only 1 collision domain for all ports.',
    relatedDevices: ['managed-switch-24port', 'ethernet-hub-16port'],
    examTip: 'Switch = collision domain per port, Hub = 1 collision domain total',
  },

  {
    id: 'q003',
    difficulty: 'medium',
    category: 'security-devices',
    question: 'Which device can detect malicious traffic but cannot block it?',
    options: [
      { id: 'a', text: 'IDS', correct: true },
      { id: 'b', text: 'IPS', correct: false },
      { id: 'c', text: 'Firewall', correct: false },
      { id: 'd', text: 'UTM', correct: false },
    ],
    explanation:
      'IDS (Intrusion Detection System) operates in passive mode (out-of-band) and can only detect and alert on threats. IPS (Intrusion Prevention System) operates in-line and can block threats.',
    relatedDevices: ['ids-snort', 'ips-suricata'],
    examTip: 'IDS = Detection only (passive), IPS = Prevention (active blocking)',
  },

  {
    id: 'q004',
    difficulty: 'hard',
    category: 'vpn',
    question:
      'A company needs to provide secure remote access to traveling employees from any device without installing VPN client software. Which VPN type is most appropriate?',
    options: [
      { id: 'a', text: 'IPsec VPN', correct: false },
      { id: 'b', text: 'SSL VPN', correct: true },
      { id: 'c', text: 'L2TP VPN', correct: false },
      { id: 'd', text: 'PPTP VPN', correct: false },
    ],
    explanation:
      'SSL VPN is browser-based and does not require client software installation. It operates on port 443 and works from any device with a modern web browser. IPsec VPN requires dedicated client software.',
    relatedDevices: ['vpn-concentrator-cisco-asa'],
    examTip: 'SSL VPN = browser-based, no client. IPsec VPN = client software required',
  },

  {
    id: 'q005',
    difficulty: 'hard',
    category: 'load-balancing',
    question:
      'Which load balancing algorithm ensures a user always connects to the same backend server for the duration of their session?',
    options: [
      { id: 'a', text: 'Round-robin', correct: false },
      { id: 'b', text: 'Least connections', correct: false },
      { id: 'c', text: 'Sticky sessions (session persistence)', correct: true },
      { id: 'd', text: 'Weighted round-robin', correct: false },
    ],
    explanation:
      'Sticky sessions (also called session persistence or session affinity) ensure that a client is always directed to the same backend server, maintaining session state. This is essential for stateful applications like e-commerce shopping carts.',
    relatedDevices: ['load-balancer-haproxy'],
    examTip: 'Sticky sessions = session persistence = same server for entire session',
  },

  {
    id: 'q006',
    difficulty: 'easy',
    category: 'wireless',
    question:
      'What is the main advantage of controller-based wireless access points over autonomous APs?',
    options: [
      { id: 'a', text: 'Lower cost per AP', correct: false },
      { id: 'b', text: 'Centralized management and configuration', correct: true },
      { id: 'c', text: 'No need for PoE', correct: false },
      { id: 'd', text: 'Better signal strength', correct: false },
    ],
    explanation:
      'Controller-based APs are managed centrally by a Wireless LAN Controller (WLC), making it easy to configure and update many APs simultaneously. Autonomous APs must be configured individually.',
    relatedDevices: [
      'autonomous-wireless-ap',
      'controller-based-wireless-ap',
      'wireless-controller',
    ],
    examTip: 'Controller-based = centralized management, Autonomous = individual configuration',
  },

  {
    id: 'q007',
    difficulty: 'medium',
    category: 'poe',
    question: 'How much power does the 802.3at (PoE+) standard provide per port?',
    options: [
      { id: 'a', text: '15.4W', correct: false },
      { id: 'b', text: '30W', correct: true },
      { id: 'c', text: '60W', correct: false },
      { id: 'd', text: '100W', correct: false },
    ],
    explanation:
      '802.3at (PoE+) provides 30W per port. 802.3af (PoE) provides 15.4W. 802.3bt (PoE++/UPoE) provides 60-100W.',
    relatedDevices: ['poe-switch-48port', 'poe-injector-single'],
    examTip: 'PoE standards: 802.3af = 15.4W, 802.3at = 30W, 802.3bt = 60-100W',
  },

  {
    id: 'q008',
    difficulty: 'hard',
    category: 'routing',
    question:
      'A network has 3 routers connecting 4 different subnets. How many broadcast domains are present?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '3', correct: false },
      { id: 'c', text: '4', correct: true },
      { id: 'd', text: '12', correct: false },
    ],
    explanation:
      'Each subnet is a separate broadcast domain. Routers separate broadcast domains, so 4 subnets = 4 broadcast domains, regardless of the number of routers.',
    relatedDevices: ['cisco-router-4331', 'layer3-switch-48port'],
    examTip: 'Routers separate broadcast domains - each interface = separate broadcast domain',
  },

  {
    id: 'q009',
    difficulty: 'medium',
    category: 'security-devices',
    question: 'What is the primary difference between a stateful and stateless firewall?',
    options: [
      { id: 'a', text: 'Stateful firewalls are faster', correct: false },
      { id: 'b', text: 'Stateful firewalls track connection state', correct: true },
      { id: 'c', text: 'Stateless firewalls provide better security', correct: false },
      { id: 'd', text: 'Stateless firewalls support VPN', correct: false },
    ],
    explanation:
      'Stateful firewalls maintain connection state tables and track the state of network connections. Stateless firewalls examine each packet independently without tracking connections.',
    relatedDevices: ['stateless-firewall', 'stateful-firewall-fortigate'],
    examTip: 'Stateful = tracks connections, Stateless = evaluates each packet independently',
  },

  {
    id: 'q010',
    difficulty: 'easy',
    category: 'layer-devices',
    question: 'Which device is used to extend Ethernet cable runs beyond 100 meters?',
    options: [
      { id: 'a', text: 'Hub', correct: false },
      { id: 'b', text: 'Repeater or Media Converter', correct: true },
      { id: 'c', text: 'Switch', correct: false },
      { id: 'd', text: 'Router', correct: false },
    ],
    explanation:
      'A repeater regenerates signals to extend distance beyond the 100m Ethernet limit. Media converters can also extend distance by converting to fiber optic.',
    relatedDevices: ['ethernet-repeater', 'media-converter-fiber'],
    examTip: 'Ethernet copper limit = 100m. Use repeater or fiber conversion for longer runs',
  },

  {
    id: 'q011',
    difficulty: 'medium',
    category: 'ngfw',
    question:
      'Which feature is unique to Next-Generation Firewalls (NGFW) compared to traditional stateful firewalls?',
    options: [
      { id: 'a', text: 'NAT support', correct: false },
      { id: 'b', text: 'Application-level awareness and control', correct: true },
      { id: 'c', text: 'VPN capabilities', correct: false },
      { id: 'd', text: 'Stateful packet inspection', correct: false },
    ],
    explanation:
      'NGFWs add application-level awareness, deep packet inspection, integrated IPS, and threat intelligence on top of traditional stateful firewall capabilities.',
    relatedDevices: ['ngfw-palo-alto', 'stateful-firewall-fortigate'],
    examTip: 'NGFW = Stateful FW + App Control + IPS + Threat Intel',
  },

  {
    id: 'q012',
    difficulty: 'hard',
    category: 'utm',
    question: 'What is the main disadvantage of UTM (Unified Threat Management) appliances?',
    options: [
      { id: 'a', text: 'Lack of security features', correct: false },
      { id: 'b', text: 'Single point of failure and performance bottleneck', correct: true },
      { id: 'c', text: 'Complex management', correct: false },
      { id: 'd', text: 'High cost', correct: false },
    ],
    explanation:
      'UTM devices combine many security functions in one appliance, creating a single point of failure. Performance can also degrade when all features are enabled simultaneously.',
    relatedDevices: ['utm-fortigate-60f'],
    examTip: 'UTM = All-in-one convenience but single point of failure',
  },

  {
    id: 'q013',
    difficulty: 'easy',
    category: 'layer3-switch',
    question: 'What is the primary purpose of a Layer 3 switch?',
    options: [
      { id: 'a', text: 'WAN routing', correct: false },
      { id: 'b', text: 'Inter-VLAN routing at wire speed', correct: true },
      { id: 'c', text: 'Wireless connectivity', correct: false },
      { id: 'd', text: 'Security filtering', correct: false },
    ],
    explanation:
      'Layer 3 switches perform wire-speed inter-VLAN routing using hardware ASICs. This is much faster than router-on-a-stick for LAN routing between VLANs.',
    relatedDevices: ['layer3-switch-48port', 'managed-switch-24port'],
    examTip: 'Layer 3 switch = fast inter-VLAN routing, not WAN routing',
  },

  {
    id: 'q014',
    difficulty: 'medium',
    category: 'deployment-modes',
    question: 'How is an IPS typically deployed in a network?',
    options: [
      { id: 'a', text: 'Out-of-band using port mirroring', correct: false },
      { id: 'b', text: 'Inline between segments', correct: true },
      { id: 'c', text: 'Parallel to the firewall', correct: false },
      { id: 'd', text: 'Behind the web servers', correct: false },
    ],
    explanation:
      'IPS must be deployed inline (in the traffic path) to actively block threats. IDS is deployed out-of-band (monitoring only). This is a critical difference.',
    relatedDevices: ['ips-suricata', 'ids-snort'],
    examTip: 'IPS = inline (can block), IDS = out-of-band (monitor only)',
  },

  {
    id: 'q015',
    difficulty: 'hard',
    category: 'poe',
    question:
      'A PoE+ switch has a 740W PoE budget and 48 ports. What happens if you try to power 48 devices requiring 20W each?',
    options: [
      { id: 'a', text: 'All devices will be powered normally', correct: false },
      { id: 'b', text: 'The switch will fail', correct: false },
      { id: 'c', text: 'Some devices will not receive power (budget exceeded)', correct: true },
      { id: 'd', text: 'Each device will receive reduced power', correct: false },
    ],
    explanation:
      '48 devices × 20W = 960W, which exceeds the 740W PoE budget. The switch will power devices based on priority until the budget is exhausted. Remaining devices will not receive PoE.',
    relatedDevices: ['poe-switch-48port'],
    examTip: 'PoE budget is shared across all ports - total watts, not per-port',
  },

  {
    id: 'q016',
    difficulty: 'medium',
    category: 'modem-types',
    question: 'What is the primary function of a modem?',
    options: [
      { id: 'a', text: 'Route traffic between networks', correct: false },
      { id: 'b', text: 'Modulate and demodulate signals', correct: true },
      { id: 'c', text: 'Provide wireless connectivity', correct: false },
      { id: 'd', text: 'Filter malicious traffic', correct: false },
    ],
    explanation:
      'Modem stands for modulator-demodulator. It converts analog signals (cable/DSL) to digital signals (Ethernet) and vice versa.',
    relatedDevices: ['cable-modem-docsis'],
    examTip: 'Modem = MOdulator/DEModulator - analog to digital conversion',
  },

  {
    id: 'q017',
    difficulty: 'easy',
    category: 'proxy',
    question: 'What is a forward proxy primarily used for?',
    options: [
      { id: 'a', text: 'Load balancing web servers', correct: false },
      { id: 'b', text: 'Client-side web filtering and caching', correct: true },
      { id: 'c', text: 'Protecting web servers from attacks', correct: false },
      { id: 'd', text: 'Routing traffic between networks', correct: false },
    ],
    explanation:
      'A forward proxy sits between clients and the internet, providing web filtering, content caching, and bandwidth optimization. A reverse proxy protects web servers.',
    relatedDevices: ['proxy-squid'],
    examTip: 'Forward proxy = client-side, Reverse proxy = server-side',
  },

  {
    id: 'q018',
    difficulty: 'hard',
    category: 'load-balancing',
    question:
      'Which load balancing algorithm would best serve a scenario where you want to route requests based on the client IP address to ensure the same client always reaches the same server?',
    options: [
      { id: 'a', text: 'Round-robin', correct: false },
      { id: 'b', text: 'Least connections', correct: false },
      { id: 'c', text: 'IP hash', correct: true },
      { id: 'd', text: 'Random', correct: false },
    ],
    explanation:
      'IP hash algorithm uses the client IP address to calculate which server to use, ensuring the same client always reaches the same server. This is different from sticky sessions which maintain state.',
    relatedDevices: ['load-balancer-haproxy'],
    examTip: 'IP hash = consistent server selection based on source IP',
  },

  {
    id: 'q019',
    difficulty: 'medium',
    category: 'wireless',
    question:
      'In a controller-based wireless deployment, what protocol is used for communication between lightweight APs and the WLC?',
    options: [
      { id: 'a', text: 'SNMP', correct: false },
      { id: 'b', text: 'CAPWAP or LWAPP', correct: true },
      { id: 'c', text: 'RADIUS', correct: false },
      { id: 'd', text: 'TACACS+', correct: false },
    ],
    explanation:
      'CAPWAP (Control and Provisioning of Wireless Access Points) is the modern standard protocol for AP-to-WLC communication. LWAPP is the legacy protocol.',
    relatedDevices: ['controller-based-wireless-ap'],
    examTip: 'CAPWAP = modern, LWAPP = legacy, both for AP-to-WLC communication',
  },

  {
    id: 'q020',
    difficulty: 'medium',
    category: 'csu-dsu',
    question: 'What is the throughput of a T1 circuit?',
    options: [
      { id: 'a', text: '1.544 Mbps', correct: true },
      { id: 'b', text: '10 Mbps', correct: false },
      { id: 'c', text: '44.736 Mbps', correct: false },
      { id: 'd', text: '100 Mbps', correct: false },
    ],
    explanation:
      'T1 provides 1.544 Mbps of bandwidth. T3 provides 44.736 Mbps. These are legacy leased line technologies, largely replaced by fiber/Ethernet.',
    relatedDevices: ['csu-dsu-t1'],
    examTip: 'T1 = 1.544 Mbps, T3 = 44.736 Mbps (legacy WAN technologies)',
  },
];
