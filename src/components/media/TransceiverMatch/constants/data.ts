import type { TransceiverSpec, WDMType, TroubleshootingTip, UseCaseCard } from '../types';

export const TRANSCEIVER_SPECS: TransceiverSpec[] = [
  {
    formFactor: 'GBIC',
    fullName: 'Gigabit Interface Converter',
    speed: '1G',
    channels: 1,
    size: 'Large',
    introduced: 1995,
    useCase: 'Legacy gigabit connections',
    keyFeature: 'First hot-swappable transceiver',
  },
  {
    formFactor: 'SFP',
    fullName: 'Small Form-Factor Pluggable',
    speed: '1G',
    channels: 1,
    size: 'Small (Mini-GBIC)',
    introduced: 2001,
    useCase: 'Standard gigabit, copper or fiber',
    keyFeature: 'Replaced GBIC, hot-swappable',
  },
  {
    formFactor: 'SFP+',
    fullName: 'Enhanced Small Form-Factor Pluggable',
    speed: '10G',
    channels: 1,
    size: 'Same as SFP',
    introduced: 2006,
    useCase: '10G datacenter, servers, storage',
    keyFeature: 'Same size as SFP but 10x speed',
  },
  {
    formFactor: 'SFP28',
    fullName: 'SFP 28Gbps',
    speed: '25G',
    channels: 1,
    size: 'Same as SFP',
    introduced: 2014,
    useCase: '25G datacenter, cloud infrastructure',
    keyFeature: '25G single lane',
  },
  {
    formFactor: 'QSFP',
    fullName: 'Quad Small Form-Factor Pluggable',
    speed: '4G',
    channels: 4,
    size: 'Slightly larger',
    introduced: 2006,
    useCase: '4x1G aggregation',
    keyFeature: '4 channels in one module',
  },
  {
    formFactor: 'QSFP+',
    fullName: 'Quad SFP Plus',
    speed: '40G',
    channels: 4,
    size: 'Same as QSFP',
    introduced: 2009,
    useCase: '40G spine-leaf datacenter',
    keyFeature: '4x10G = 40G total',
  },
  {
    formFactor: 'QSFP28',
    fullName: 'Quad SFP 28Gbps',
    speed: '100G',
    channels: 4,
    size: 'Same as QSFP',
    introduced: 2014,
    useCase: '100G modern datacenter, hyperscale',
    keyFeature: '4x25G = 100G total',
  },
  {
    formFactor: 'QSFP-DD',
    fullName: 'Quad SFP Double Density',
    speed: '400G',
    channels: 8,
    size: 'Double density',
    introduced: 2017,
    useCase: '400G cloud, AI/ML workloads',
    keyFeature: '8x50G = 400G total',
  },
  {
    formFactor: 'CFP',
    fullName: 'C Form-Factor Pluggable',
    speed: '100G+',
    channels: 1,
    size: 'Very large',
    introduced: 2009,
    useCase: '100G+ WAN, metro networks',
    keyFeature: 'High power, long reach',
  },
];

export const WDM_TYPES: WDMType[] = [
  {
    name: 'BiDi',
    fullName: 'Bidirectional',
    channels: '2 (Tx/Rx)',
    wavelengthRange: '1270-1330nm / 1490-1550nm',
    spacing: '160-220nm',
    useCase: 'Single fiber cost savings',
    capacity: '2x capacity on 1 fiber',
  },
  {
    name: 'CWDM',
    fullName: 'Coarse Wavelength Division Multiplexing',
    channels: '8-18',
    wavelengthRange: '1270-1610nm',
    spacing: '20nm',
    useCase: 'Metro networks, campus backbone',
    capacity: '8-18 channels on 1 fiber',
  },
  {
    name: 'DWDM',
    fullName: 'Dense Wavelength Division Multiplexing',
    channels: '40-96+',
    wavelengthRange: '1530-1565nm (C-band)',
    spacing: '0.4-0.8nm',
    useCase: 'Long-haul, submarine cables',
    capacity: '40+ channels on 1 fiber',
  },
];

export const TROUBLESHOOTING_TIPS: TroubleshootingTip[] = [
  {
    symptom: 'No link light / Link down',
    causes: [
      'Dirty fiber connector',
      'Wrong transceiver type',
      'Incompatible wavelength',
      'Fiber not connected',
      'Damaged cable',
    ],
    solutions: [
      'Clean fiber with approved cleaner',
      'Verify transceiver compatibility',
      'Check wavelength matches (850nm vs 1310nm)',
      'Reseat connections',
      'Test with different cable',
    ],
  },
  {
    symptom: 'Intermittent connectivity / Packet loss',
    causes: [
      'Low optical power (dBm)',
      'EMI interference',
      'Loose connection',
      'Temperature issues',
      'Fiber bend radius exceeded',
    ],
    solutions: [
      'Check dBm levels (should be -3 to -20 dBm)',
      'Shield cables properly',
      'Secure all connections',
      'Improve ventilation',
      'Ensure proper cable routing',
    ],
  },
  {
    symptom: 'Incompatible transceiver error',
    causes: [
      'Non-approved vendor module',
      'Wrong form factor',
      'Speed mismatch',
      'Firmware incompatibility',
    ],
    solutions: [
      'Use vendor-approved transceivers',
      'Verify SFP vs SFP+ vs QSFP',
      'Match speed requirements',
      'Update switch firmware',
    ],
  },
  {
    symptom: 'Distance limitation errors',
    causes: [
      'Wrong transceiver type (-SR vs -LR)',
      'Multimode vs single-mode mismatch',
      'Power budget exceeded',
      'Wrong fiber grade (OM3 vs OM4)',
    ],
    solutions: [
      'Use -LR for long distances',
      'Match fiber type to transceiver',
      'Calculate power budget',
      'Upgrade to OM4 for 10G',
    ],
  },
];

export const generateUseCases = (): UseCaseCard[] => {
  return [
    {
      id: 'uc1',
      description: 'Connect servers within a rack to Top-of-Rack switch (400m, multimode fiber)',
      requirements: { speed: 10, distance: 400, protocol: 'Ethernet', formFactor: 'SFP+' },
    },
    {
      id: 'uc2',
      description: 'Campus building interconnect (500m, multimode fiber, 1Gbps)',
      requirements: { speed: 1, distance: 500, protocol: 'Ethernet', formFactor: 'SFP' },
    },
    {
      id: 'uc3',
      description: 'Long-range datacenter spine-leaf (10km, single-mode fiber, 10Gbps)',
      requirements: { speed: 10, distance: 10000, protocol: 'Ethernet' },
    },
    {
      id: 'uc4',
      description: 'High-performance SAN storage array (100m, multimode fiber, 16Gbps)',
      requirements: { speed: 16, distance: 100, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc5',
      description: 'Modern datacenter spine switching (100m, 100Gbps, OM4 fiber)',
      requirements: { speed: 100, distance: 100, protocol: 'Ethernet', formFactor: 'QSFP28' },
    },
    {
      id: 'uc6',
      description: 'Rack-to-rack connection in same row (10m, 10Gbps, copper)',
      requirements: { speed: 10, distance: 10, protocol: 'Ethernet' },
    },
    {
      id: 'uc7',
      description: 'Fibre Channel SAN backbone (150m, 8Gbps, multimode)',
      requirements: { speed: 8, distance: 150, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc8',
      description: 'High-density 40G spine-leaf (150m, multimode fiber)',
      requirements: { speed: 40, distance: 150, protocol: 'Ethernet', formFactor: 'QSFP+' },
    },
    {
      id: 'uc9',
      description: 'Long-range WAN link (10km, 100Gbps, single-mode fiber)',
      requirements: { speed: 100, distance: 10000, protocol: 'Ethernet' },
    },
    {
      id: 'uc10',
      description: 'Server uplink to copper switch (100m, 1Gbps)',
      requirements: { speed: 1, distance: 100, protocol: 'Ethernet', formFactor: 'SFP' },
    },
    {
      id: 'uc11',
      description: 'NVMe over Fibre Channel (100m, 32Gbps, multimode)',
      requirements: { speed: 32, distance: 100, protocol: 'Fibre Channel' },
    },
    {
      id: 'uc12',
      description: 'Metro network backbone (10km, 40Gbps, single-mode)',
      requirements: { speed: 40, distance: 10000, protocol: 'Ethernet' },
    },
  ];
};
