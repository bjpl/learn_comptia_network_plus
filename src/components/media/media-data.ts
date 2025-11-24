/**
 * Comprehensive data for transmission media components
 */

import type {
  MediaOption,
  ScenarioRequirement,
  Connector3DModel,
  Transceiver,
  PinLayout,
  MediaScore
} from './media-types';

// T568A and T568B pin layouts for RJ45
export const T568A_LAYOUT: PinLayout = {
  standard: 'T568A',
  pins: [
    { number: 1, color: 'white-green', function: 'Tx+', position: { x: -3.5, y: 0, z: 0 } },
    { number: 2, color: 'green', function: 'Tx-', position: { x: -2.5, y: 0, z: 0 } },
    { number: 3, color: 'white-orange', function: 'Rx+', position: { x: -1.5, y: 0, z: 0 } },
    { number: 4, color: 'blue', function: 'Unused', position: { x: -0.5, y: 0, z: 0 } },
    { number: 5, color: 'white-blue', function: 'Unused', position: { x: 0.5, y: 0, z: 0 } },
    { number: 6, color: 'orange', function: 'Rx-', position: { x: 1.5, y: 0, z: 0 } },
    { number: 7, color: 'white-brown', function: 'Unused', position: { x: 2.5, y: 0, z: 0 } },
    { number: 8, color: 'brown', function: 'Unused', position: { x: 3.5, y: 0, z: 0 } }
  ]
};

export const T568B_LAYOUT: PinLayout = {
  standard: 'T568B',
  pins: [
    { number: 1, color: 'white-orange', function: 'Tx+', position: { x: -3.5, y: 0, z: 0 } },
    { number: 2, color: 'orange', function: 'Tx-', position: { x: -2.5, y: 0, z: 0 } },
    { number: 3, color: 'white-green', function: 'Rx+', position: { x: -1.5, y: 0, z: 0 } },
    { number: 4, color: 'blue', function: 'Unused', position: { x: -0.5, y: 0, z: 0 } },
    { number: 5, color: 'white-blue', function: 'Unused', position: { x: 0.5, y: 0, z: 0 } },
    { number: 6, color: 'green', function: 'Rx-', position: { x: 1.5, y: 0, z: 0 } },
    { number: 7, color: 'white-brown', function: 'Unused', position: { x: 2.5, y: 0, z: 0 } },
    { number: 8, color: 'brown', function: 'Unused', position: { x: 3.5, y: 0, z: 0 } }
  ]
};

// Media options database
export const MEDIA_OPTIONS: MediaOption[] = [
  // Wireless options - Complete 802.11 standards
  {
    id: 'wifi-a',
    type: 'wireless',
    name: '802.11a',
    standard: '802.11a',
    maxDistance: 35,
    bandwidth: 54,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low',
    frequency: 5000, // 5 GHz
    wavelength: 5000, // MHz
    emiResistance: 'Low - Subject to interference from weather/obstacles'
  },
  {
    id: 'wifi-b',
    type: 'wireless',
    name: '802.11b',
    standard: '802.11b',
    maxDistance: 45,
    bandwidth: 11,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'high',
    frequency: 2400, // 2.4 GHz
    wavelength: 2400, // MHz
    emiResistance: 'Low - High interference from microwaves, Bluetooth'
  },
  {
    id: 'wifi-g',
    type: 'wireless',
    name: '802.11g (Wi-Fi 3)',
    standard: '802.11g',
    maxDistance: 45,
    bandwidth: 54,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'high',
    frequency: 2400, // 2.4 GHz
    wavelength: 2400, // MHz
    emiResistance: 'Low - High interference on 2.4 GHz band'
  },
  {
    id: 'wifi-n',
    type: 'wireless',
    name: '802.11n (Wi-Fi 4)',
    standard: '802.11n',
    maxDistance: 70,
    bandwidth: 600,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'medium',
    frequency: 2400, // 2.4/5 GHz dual-band
    wavelength: 2400, // MHz
    emiResistance: 'Low-Medium - Dual-band reduces some interference'
  },
  {
    id: 'wifi-ac',
    type: 'wireless',
    name: '802.11ac (Wi-Fi 5)',
    standard: '802.11ac',
    maxDistance: 100,
    bandwidth: 3500,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low',
    frequency: 5000, // 5 GHz only
    wavelength: 5000, // MHz
    emiResistance: 'Medium - 5 GHz less congested'
  },
  {
    id: 'wifi-ax',
    type: 'wireless',
    name: '802.11ax (Wi-Fi 6)',
    standard: '802.11ax',
    maxDistance: 100,
    bandwidth: 9600,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low',
    frequency: 2400, // 2.4/5/6 GHz tri-band
    wavelength: 2400, // MHz
    emiResistance: 'Medium - OFDMA improves efficiency in congested areas'
  },
  {
    id: 'wifi-be',
    type: 'wireless',
    name: '802.11be (Wi-Fi 7)',
    standard: '802.11be',
    maxDistance: 120,
    bandwidth: 40000,
    costPerMeter: 0,
    environmentalResistance: 'low',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low',
    frequency: 6000, // 2.4/5/6 GHz tri-band
    wavelength: 6000, // MHz
    emiResistance: 'High - 320 MHz channels, MLO, advanced interference mitigation'
  },
  {
    id: '5g',
    type: 'wireless',
    name: '5G Cellular',
    standard: '5G',
    maxDistance: 500,
    bandwidth: 20000,
    costPerMeter: 0,
    environmentalResistance: 'medium',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low'
  },
  {
    id: '4g',
    type: 'wireless',
    name: '4G/LTE',
    standard: '4G',
    maxDistance: 1000,
    bandwidth: 300,
    costPerMeter: 0,
    environmentalResistance: 'medium',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'low'
  },
  {
    id: 'satellite',
    type: 'wireless',
    name: 'Satellite',
    standard: 'Satellite',
    maxDistance: 100000,
    bandwidth: 100,
    costPerMeter: 0,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'medium'
  },
  // Copper options - Complete Cat standards
  {
    id: 'cat5e',
    type: 'copper',
    name: 'Cat 5e',
    standard: '1000BASE-T',
    maxDistance: 100,
    bandwidth: 1000,
    costPerMeter: 0.20,
    environmentalResistance: 'medium',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'medium',
    characteristics: ['unshielded', 'non-plenum'],
    frequency: 100, // MHz
    coreSize: '24 AWG',
    emiResistance: 'Low - UTP susceptible to EMI/RFI'
  },
  {
    id: 'cat6',
    type: 'copper',
    name: 'Cat 6',
    standard: '1000BASE-T / 10GBASE-T',
    maxDistance: 100,
    bandwidth: 1000, // 10000 at 55m
    costPerMeter: 0.30,
    environmentalResistance: 'medium',
    installationComplexity: 'moderate',
    interferenceSusceptibility: 'medium',
    characteristics: ['unshielded', 'plenum'],
    frequency: 250, // MHz
    coreSize: '23 AWG',
    emiResistance: 'Low-Medium - Tighter twist reduces crosstalk'
  },
  {
    id: 'cat6a',
    type: 'copper',
    name: 'Cat 6a',
    standard: '10GBASE-T',
    maxDistance: 100,
    bandwidth: 10000,
    costPerMeter: 0.50,
    environmentalResistance: 'high',
    installationComplexity: 'moderate',
    interferenceSusceptibility: 'low',
    characteristics: ['shielded', 'plenum'],
    frequency: 500, // MHz
    coreSize: '23 AWG',
    emiResistance: 'Medium - Eliminates alien crosstalk (A-NEXT)'
  },
  {
    id: 'cat7',
    type: 'copper',
    name: 'Cat 7',
    standard: '10GBASE-T',
    maxDistance: 100,
    bandwidth: 10000, // 40 Gbps at 50m
    costPerMeter: 0.75,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    characteristics: ['shielded'],
    frequency: 600, // MHz
    coreSize: '23 AWG',
    emiResistance: 'High - Individual pair shielding + overall shield'
  },
  {
    id: 'cat8',
    type: 'copper',
    name: 'Cat 8',
    standard: '25GBASE-T / 40GBASE-T',
    maxDistance: 30,
    bandwidth: 40000,
    costPerMeter: 1.20,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    characteristics: ['shielded'],
    frequency: 2000, // MHz
    coreSize: '22 AWG',
    emiResistance: 'Very High - Foil wrap per pair eliminates crosstalk'
  },
  {
    id: 'dac',
    type: 'copper',
    name: 'Twinaxial (DAC)',
    standard: '10GBASE-CR',
    maxDistance: 10,
    bandwidth: 10000,
    costPerMeter: 15.00,
    environmentalResistance: 'high',
    installationComplexity: 'easy',
    interferenceSusceptibility: 'none',
    characteristics: ['shielded'],
    frequency: 0, // Direct attach
    coreSize: 'Varies',
    emiResistance: 'Very High - Thick shielding, datacenter only'
  },
  // Fiber options - Complete OM and OS specifications
  {
    id: 'mmf-om1',
    type: 'fiber',
    name: 'OM1 Multimode',
    standard: '1000BASE-SX',
    maxDistance: 300,
    bandwidth: 1000,
    costPerMeter: 0.60,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '62.5µm',
    wavelength: 850, // nm
    lightSource: 'LED',
    jacketColor: 'Orange',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'mmf-om2',
    type: 'fiber',
    name: 'OM2 Multimode',
    standard: '1000BASE-SX',
    maxDistance: 550,
    bandwidth: 1000,
    costPerMeter: 0.70,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '50µm',
    wavelength: 850, // nm
    lightSource: 'LED',
    jacketColor: 'Orange',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'mmf-om3',
    type: 'fiber',
    name: 'OM3 Multimode',
    standard: '10GBASE-SR',
    maxDistance: 300,
    bandwidth: 10000,
    costPerMeter: 0.80,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '50µm',
    wavelength: 850, // nm
    lightSource: 'VCSEL',
    jacketColor: 'Aqua',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'mmf-om4',
    type: 'fiber',
    name: 'OM4 Multimode',
    standard: '10GBASE-SR',
    maxDistance: 550,
    bandwidth: 10000,
    costPerMeter: 1.00,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '50µm',
    wavelength: 850, // nm
    lightSource: 'VCSEL',
    jacketColor: 'Aqua',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'mmf-om5',
    type: 'fiber',
    name: 'OM5 Multimode (Wideband)',
    standard: '10GBASE-SR / 40GBASE-SR4',
    maxDistance: 550,
    bandwidth: 40000,
    costPerMeter: 1.30,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '50µm',
    wavelength: 953, // nm (850-953 range)
    lightSource: 'VCSEL',
    jacketColor: 'Lime Green',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'smf-os1',
    type: 'fiber',
    name: 'OS1 Single-mode',
    standard: '10GBASE-LR',
    maxDistance: 10000,
    bandwidth: 10000,
    costPerMeter: 1.80,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '9µm',
    wavelength: 1310, // nm
    lightSource: 'Laser',
    jacketColor: 'Yellow',
    emiResistance: 'Immune - No electrical signal'
  },
  {
    id: 'smf-os2',
    type: 'fiber',
    name: 'OS2 Single-mode',
    standard: '10GBASE-ER / 40GBASE-ER4',
    maxDistance: 40000,
    bandwidth: 40000,
    costPerMeter: 2.00,
    environmentalResistance: 'high',
    installationComplexity: 'difficult',
    interferenceSusceptibility: 'none',
    coreSize: '9µm',
    wavelength: 1550, // nm
    lightSource: 'Laser',
    jacketColor: 'Yellow',
    emiResistance: 'Immune - No electrical signal'
  },
  // Coaxial options
  {
    id: 'rg6',
    type: 'coaxial',
    name: 'RG-6 Coaxial',
    maxDistance: 300,
    bandwidth: 1000,
    costPerMeter: 0.40,
    environmentalResistance: 'medium',
    installationComplexity: 'moderate',
    interferenceSusceptibility: 'low'
  },
  {
    id: 'rg59',
    type: 'coaxial',
    name: 'RG-59 Coaxial',
    maxDistance: 200,
    bandwidth: 100,
    costPerMeter: 0.25,
    environmentalResistance: 'medium',
    installationComplexity: 'moderate',
    interferenceSusceptibility: 'medium'
  }
];

// Scenario requirements (50 realistic scenarios)
export const SCENARIOS: ScenarioRequirement[] = [
  {
    id: 'sc01',
    title: 'Office Desktop Connectivity',
    description: 'Connect 50 desktop workstations in a single-floor office',
    requiredDistance: 80,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.50,
    specialConditions: ['Standard office environment', 'Ceiling-mounted cable runs']
  },
  {
    id: 'sc02',
    title: 'Datacenter Server Rack',
    description: 'Connect servers within a single rack to ToR switch',
    requiredDistance: 5,
    requiredBandwidth: 10000,
    environment: 'datacenter',
    budgetPerMeter: 20.00,
    specialConditions: ['High-density environment', 'Short distances', 'Maximum performance']
  },
  {
    id: 'sc03',
    title: 'Building-to-Building Campus Link',
    description: 'Connect two buildings 500m apart on a corporate campus',
    requiredDistance: 500,
    requiredBandwidth: 10000,
    environment: 'outdoor',
    budgetPerMeter: 3.00,
    specialConditions: ['Weather exposure', 'Long distance', 'High bandwidth']
  },
  {
    id: 'sc04',
    title: 'Manufacturing Floor WiFi',
    description: 'Provide wireless coverage in a 200m x 200m factory',
    requiredDistance: 150,
    requiredBandwidth: 600,
    environment: 'industrial',
    budgetPerMeter: 0,
    specialConditions: ['Heavy machinery interference', 'Metal structures', 'Mobile devices']
  },
  {
    id: 'sc05',
    title: 'Home Office Setup',
    description: 'Connect home office to router in residential setting',
    requiredDistance: 30,
    requiredBandwidth: 1000,
    environment: 'residential',
    budgetPerMeter: 0.30,
    specialConditions: ['Budget-conscious', 'Easy DIY installation']
  },
  {
    id: 'sc06',
    title: 'Conference Room Presentation',
    description: 'Wireless connectivity for presentations and video conferencing',
    requiredDistance: 20,
    requiredBandwidth: 3000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['High quality video', 'Low latency', 'Reliable connection']
  },
  {
    id: 'sc07',
    title: 'Remote Site Connection',
    description: 'Connect rural office with no fiber infrastructure available',
    requiredDistance: 50000,
    requiredBandwidth: 50,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['No wired infrastructure', 'Remote location']
  },
  {
    id: 'sc08',
    title: 'Security Camera Backhaul',
    description: 'Connect 20 PoE security cameras to network switch',
    requiredDistance: 90,
    requiredBandwidth: 100,
    environment: 'indoor',
    budgetPerMeter: 0.40,
    specialConditions: ['PoE required', 'Plenum-rated cables', '24/7 operation']
  },
  {
    id: 'sc09',
    title: 'Datacenter Cross-Connect',
    description: 'Connect equipment in separate racks 150m apart in datacenter',
    requiredDistance: 150,
    requiredBandwidth: 10000,
    environment: 'datacenter',
    budgetPerMeter: 2.50,
    specialConditions: ['Climate-controlled', 'High reliability required']
  },
  {
    id: 'sc10',
    title: 'Warehouse Inventory Scanners',
    description: 'Wireless connectivity for mobile inventory scanners',
    requiredDistance: 100,
    requiredBandwidth: 100,
    environment: 'industrial',
    budgetPerMeter: 0,
    specialConditions: ['Large metal shelving', 'Mobile devices', 'Basic data needs']
  },
  {
    id: 'sc11',
    title: 'Server Room Storage Link',
    description: 'Connect SAN storage to server rack at 40Gbps',
    requiredDistance: 8,
    requiredBandwidth: 40000,
    environment: 'datacenter',
    budgetPerMeter: 50.00,
    specialConditions: ['Ultra-low latency', 'High bandwidth', 'Short distance']
  },
  {
    id: 'sc12',
    title: 'University Campus WiFi',
    description: 'Provide wireless coverage across large lecture halls',
    requiredDistance: 50,
    requiredBandwidth: 5000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['High user density', 'Modern devices', 'Reliable coverage']
  },
  {
    id: 'sc13',
    title: 'Point-to-Point Building Link',
    description: 'Connect buildings 2km apart with fiber',
    requiredDistance: 2000,
    requiredBandwidth: 10000,
    environment: 'outdoor',
    budgetPerMeter: 2.50,
    specialConditions: ['Long distance', 'Weather resistance', 'High bandwidth']
  },
  {
    id: 'sc14',
    title: 'VoIP Phone Deployment',
    description: 'Connect 100 VoIP phones across office floors',
    requiredDistance: 85,
    requiredBandwidth: 100,
    environment: 'indoor',
    budgetPerMeter: 0.30,
    specialConditions: ['PoE required', 'Plenum-rated', 'Low bandwidth per device']
  },
  {
    id: 'sc15',
    title: 'Guest WiFi Network',
    description: 'Provide internet access to lobby and public areas',
    requiredDistance: 40,
    requiredBandwidth: 600,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['Public access', 'Moderate bandwidth', 'Easy connectivity']
  },
  {
    id: 'sc16',
    title: 'Industrial Control System',
    description: 'Connect PLCs and SCADA systems in manufacturing',
    requiredDistance: 95,
    requiredBandwidth: 100,
    environment: 'industrial',
    budgetPerMeter: 0.60,
    specialConditions: ['EMI protection', 'Harsh environment', 'Reliability critical']
  },
  {
    id: 'sc17',
    title: 'Smart Home Automation',
    description: 'Connect IoT devices throughout residence',
    requiredDistance: 25,
    requiredBandwidth: 50,
    environment: 'residential',
    budgetPerMeter: 0,
    specialConditions: ['Low power devices', 'Wide coverage', 'Budget-friendly']
  },
  {
    id: 'sc18',
    title: 'Datacenter Spine-Leaf Link',
    description: 'Connect leaf switch to spine at 100Gbps',
    requiredDistance: 100,
    requiredBandwidth: 100000,
    environment: 'datacenter',
    budgetPerMeter: 3.00,
    specialConditions: ['Ultra-high bandwidth', 'Low latency', 'Fiber required']
  },
  {
    id: 'sc19',
    title: 'Outdoor Security Cameras',
    description: 'Connect outdoor cameras around building perimeter',
    requiredDistance: 120,
    requiredBandwidth: 100,
    environment: 'outdoor',
    budgetPerMeter: 0.80,
    specialConditions: ['Weather exposure', 'PoE required', 'Extended distance']
  },
  {
    id: 'sc20',
    title: 'Trading Floor Network',
    description: 'Ultra-low latency connections for trading terminals',
    requiredDistance: 50,
    requiredBandwidth: 10000,
    environment: 'indoor',
    budgetPerMeter: 5.00,
    specialConditions: ['Microsecond latency', 'Maximum reliability', 'High bandwidth']
  },
  {
    id: 'sc21',
    title: 'Retail Store WiFi',
    description: 'Customer and POS wireless connectivity',
    requiredDistance: 60,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['Customer access', 'POS reliability', 'Medium density']
  },
  {
    id: 'sc22',
    title: 'Airport Terminal Network',
    description: 'Public WiFi across large terminal building',
    requiredDistance: 200,
    requiredBandwidth: 9000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['Very high density', 'Large area', 'Modern standard']
  },
  {
    id: 'sc23',
    title: 'Medical Imaging Network',
    description: 'Connect MRI/CT machines to PACS server',
    requiredDistance: 75,
    requiredBandwidth: 10000,
    environment: 'indoor',
    budgetPerMeter: 1.50,
    specialConditions: ['Large file transfers', 'Reliability critical', 'High bandwidth']
  },
  {
    id: 'sc24',
    title: 'Construction Site Temp Network',
    description: 'Temporary network for construction management',
    requiredDistance: 150,
    requiredBandwidth: 300,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Temporary setup', 'Harsh environment', 'Quick deployment']
  },
  {
    id: 'sc25',
    title: 'Fiber to the Desktop',
    description: 'High-bandwidth desktop connections for CAD workstations',
    requiredDistance: 70,
    requiredBandwidth: 10000,
    environment: 'indoor',
    budgetPerMeter: 1.80,
    specialConditions: ['Future-proof', 'High performance', 'Clean environment']
  },
  {
    id: 'sc26',
    title: 'Stadium WiFi Coverage',
    description: 'Wireless for 50,000 concurrent users',
    requiredDistance: 100,
    requiredBandwidth: 9000,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Extreme density', 'Large area', 'Outdoor environment']
  },
  {
    id: 'sc27',
    title: 'Branch Office Uplink',
    description: 'Connect small branch office to core network',
    requiredDistance: 85,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.40,
    specialConditions: ['Standard office', 'Cost-effective', 'Reliable']
  },
  {
    id: 'sc28',
    title: 'Data Center to Colo Link',
    description: 'Connect private datacenter to colocation facility 8km away',
    requiredDistance: 8000,
    requiredBandwidth: 10000,
    environment: 'outdoor',
    budgetPerMeter: 2.00,
    specialConditions: ['Very long distance', 'High bandwidth', 'Mission critical']
  },
  {
    id: 'sc29',
    title: 'Ship-to-Shore Connection',
    description: 'Connect vessel to port network while docked',
    requiredDistance: 200,
    requiredBandwidth: 1000,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Temporary connection', 'Weather exposure', 'Mobile platform']
  },
  {
    id: 'sc30',
    title: 'Classroom Interactive Displays',
    description: 'Connect smart boards and displays in classrooms',
    requiredDistance: 40,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.35,
    specialConditions: ['Educational setting', 'Reliable streaming', 'Moderate budget']
  },
  {
    id: 'sc31',
    title: 'Parking Garage Network',
    description: 'Connect payment kiosks and cameras in garage',
    requiredDistance: 110,
    requiredBandwidth: 100,
    environment: 'indoor',
    budgetPerMeter: 0.50,
    specialConditions: ['Extended distance', 'PoE devices', 'Concrete barriers']
  },
  {
    id: 'sc32',
    title: 'Laboratory Equipment Network',
    description: 'Connect sensitive lab equipment with EMI concerns',
    requiredDistance: 60,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 1.20,
    specialConditions: ['EMI immunity required', 'Precision equipment', 'Clean environment']
  },
  {
    id: 'sc33',
    title: 'Metro Fiber Ring',
    description: 'Connect multiple sites in metropolitan area fiber ring',
    requiredDistance: 15000,
    requiredBandwidth: 10000,
    environment: 'outdoor',
    budgetPerMeter: 1.80,
    specialConditions: ['Very long distance', 'Ring topology', 'Urban environment']
  },
  {
    id: 'sc34',
    title: 'Call Center Workstations',
    description: 'Connect 200 call center agent workstations',
    requiredDistance: 95,
    requiredBandwidth: 100,
    environment: 'indoor',
    budgetPerMeter: 0.25,
    specialConditions: ['High density', 'VoIP traffic', 'Cost-sensitive']
  },
  {
    id: 'sc35',
    title: 'Oil Rig Communications',
    description: 'Connect offshore platform to mainland',
    requiredDistance: 80000,
    requiredBandwidth: 100,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Extreme distance', 'Harsh environment', 'No cable option']
  },
  {
    id: 'sc36',
    title: 'Museum WiFi and Exhibits',
    description: 'Wireless for interactive exhibits and guest access',
    requiredDistance: 80,
    requiredBandwidth: 3000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['Aesthetic concerns', 'Reliable coverage', 'Interactive content']
  },
  {
    id: 'sc37',
    title: 'Server Cluster Interconnect',
    description: 'Low-latency connections between cluster nodes',
    requiredDistance: 3,
    requiredBandwidth: 25000,
    environment: 'datacenter',
    budgetPerMeter: 30.00,
    specialConditions: ['Ultra-short distance', 'Very high bandwidth', 'Lowest latency']
  },
  {
    id: 'sc38',
    title: 'Apartment Complex WiFi',
    description: 'MDU WiFi service for 100-unit building',
    requiredDistance: 30,
    requiredBandwidth: 3500,
    environment: 'residential',
    budgetPerMeter: 0,
    specialConditions: ['High density', 'Interference mitigation', 'Cost per unit']
  },
  {
    id: 'sc39',
    title: 'Agricultural IoT Sensors',
    description: 'Connect soil and weather sensors across farmland',
    requiredDistance: 500,
    requiredBandwidth: 10,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Very long distance', 'Low bandwidth', 'Weather exposure']
  },
  {
    id: 'sc40',
    title: 'Hotel Guest Network',
    description: 'Wired and wireless connectivity for guest rooms',
    requiredDistance: 70,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.40,
    specialConditions: ['Guest experience', 'Streaming content', 'Multiple devices']
  },
  {
    id: 'sc41',
    title: 'Broadcast Studio SDI',
    description: 'Connect video production equipment in broadcast facility',
    requiredDistance: 90,
    requiredBandwidth: 12000,
    environment: 'indoor',
    budgetPerMeter: 2.50,
    specialConditions: ['Uncompressed video', 'Ultra-reliable', 'EMI protection']
  },
  {
    id: 'sc42',
    title: 'Mining Operation Network',
    description: 'Underground network for mining operations',
    requiredDistance: 200,
    requiredBandwidth: 100,
    environment: 'industrial',
    budgetPerMeter: 1.00,
    specialConditions: ['Extreme environment', 'Dust and moisture', 'Rugged cables']
  },
  {
    id: 'sc43',
    title: 'Casino Floor Network',
    description: 'Connect gaming machines and surveillance',
    requiredDistance: 100,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.60,
    specialConditions: ['High reliability', '24/7 operation', 'Security critical']
  },
  {
    id: 'sc44',
    title: 'Theme Park Ride Control',
    description: 'Network for ride safety and control systems',
    requiredDistance: 150,
    requiredBandwidth: 100,
    environment: 'outdoor',
    budgetPerMeter: 1.50,
    specialConditions: ['Safety critical', 'Weather exposure', 'EMI immunity']
  },
  {
    id: 'sc45',
    title: 'Co-Working Space WiFi',
    description: 'High-performance WiFi for shared workspace',
    requiredDistance: 50,
    requiredBandwidth: 9000,
    environment: 'indoor',
    budgetPerMeter: 0,
    specialConditions: ['High user density', 'Professional users', 'Modern standard']
  },
  {
    id: 'sc46',
    title: 'Telecom Central Office',
    description: 'High-density interconnects in carrier CO',
    requiredDistance: 20,
    requiredBandwidth: 100000,
    environment: 'datacenter',
    budgetPerMeter: 4.00,
    specialConditions: ['Extreme bandwidth', 'Short distance', 'Carrier-grade']
  },
  {
    id: 'sc47',
    title: 'School Laptop Cart Charging',
    description: 'Network connectivity for charging carts',
    requiredDistance: 45,
    requiredBandwidth: 1000,
    environment: 'indoor',
    budgetPerMeter: 0.30,
    specialConditions: ['Educational budget', 'Reliable access', 'Easy maintenance']
  },
  {
    id: 'sc48',
    title: 'Emergency Services Network',
    description: 'Backup connectivity for 911 dispatch center',
    requiredDistance: 5000,
    requiredBandwidth: 1000,
    environment: 'outdoor',
    budgetPerMeter: 0,
    specialConditions: ['Mission critical', 'Redundancy required', 'Long distance']
  },
  {
    id: 'sc49',
    title: 'Drive-Through Order System',
    description: 'Connect order stations to kitchen displays',
    requiredDistance: 35,
    requiredBandwidth: 100,
    environment: 'outdoor',
    budgetPerMeter: 0.70,
    specialConditions: ['Weather exposure', 'Reliable operation', 'Short distance']
  },
  {
    id: 'sc50',
    title: 'Research Computing Cluster',
    description: 'Ultra-fast interconnect for HPC cluster',
    requiredDistance: 15,
    requiredBandwidth: 100000,
    environment: 'datacenter',
    budgetPerMeter: 10.00,
    specialConditions: ['Extreme performance', 'Low latency', 'Scientific computing']
  }
];

// Connector 3D models data
export const CONNECTORS: Connector3DModel[] = [
  {
    id: 'SC',
    name: 'SC (Subscriber Connector)',
    type: 'fiber',
    description: 'Square push-pull connector commonly used in enterprise networks',
    typicalUse: ['Datacenter connections', 'Enterprise fiber runs', 'Single-mode fiber'],
    keyFeatures: ['Push-pull coupling', 'Square shape', 'Easy to use', 'Reliable connection']
  },
  {
    id: 'LC',
    name: 'LC (Lucent Connector)',
    type: 'fiber',
    description: 'Small form factor connector with latch mechanism',
    typicalUse: ['High-density applications', 'SFP transceivers', 'Modern installations'],
    keyFeatures: ['Small footprint', 'Latch mechanism', 'High density', 'RJ45-like size']
  },
  {
    id: 'ST',
    name: 'ST (Straight Tip)',
    type: 'fiber',
    description: 'Bayonet-style connector with twist-lock mechanism',
    typicalUse: ['Legacy installations', 'Multimode fiber', 'Campus networks'],
    keyFeatures: ['Bayonet mount', 'Twist-lock', 'Round connector', 'Proven reliability']
  },
  {
    id: 'MPO',
    name: 'MPO (Multi-fiber Push On)',
    type: 'fiber',
    description: 'High-density multi-fiber connector (12 or 24 fibers)',
    typicalUse: ['Datacenter spine-leaf', 'High-density applications', '40G/100G links'],
    keyFeatures: ['Multiple fibers', 'High density', 'Push-pull', 'Ribbon cable']
  },
  {
    id: 'RJ11',
    name: 'RJ11',
    type: 'copper',
    description: 'Telephone connector with 6 positions, 2 or 4 conductors',
    pinCount: 6,
    pinLayout: {
      pins: [
        { number: 1, color: 'unused', function: 'Unused', position: { x: -2.5, y: 0, z: 0 } },
        { number: 2, color: 'unused', function: 'Unused', position: { x: -1.5, y: 0, z: 0 } },
        { number: 3, color: 'red', function: 'Tip (Ring)', position: { x: -0.5, y: 0, z: 0 } },
        { number: 4, color: 'green', function: 'Ring (Tip)', position: { x: 0.5, y: 0, z: 0 } },
        { number: 5, color: 'unused', function: 'Unused', position: { x: 1.5, y: 0, z: 0 } },
        { number: 6, color: 'unused', function: 'Unused', position: { x: 2.5, y: 0, z: 0 } }
      ]
    },
    typicalUse: ['Telephone systems', 'Analog modems', 'Fax machines'],
    keyFeatures: ['6P2C or 6P4C', 'Telephone standard', 'Small connector', 'Legacy systems']
  },
  {
    id: 'RJ45',
    name: 'RJ45',
    type: 'copper',
    description: 'Standard Ethernet connector with 8 positions, 8 conductors',
    pinCount: 8,
    pinLayout: T568B_LAYOUT,
    typicalUse: ['Ethernet networks', 'VoIP phones', 'PoE devices'],
    keyFeatures: ['8P8C', 'T568A/B wiring', 'Ethernet standard', 'Ubiquitous']
  },
  {
    id: 'F-type',
    name: 'F-type',
    type: 'coaxial',
    description: 'Screw-on coaxial connector for cable TV and internet',
    typicalUse: ['Cable TV', 'Cable modems', 'Satellite receivers'],
    keyFeatures: ['Screw-on', 'Threaded', '75-ohm impedance', 'Weather-resistant']
  },
  {
    id: 'BNC',
    name: 'BNC (Bayonet Neill-Concelman)',
    type: 'coaxial',
    description: 'Bayonet-mount coaxial connector for video and RF',
    typicalUse: ['Security cameras', 'Test equipment', 'RF applications'],
    keyFeatures: ['Bayonet mount', 'Quick connect', '50/75-ohm', 'Professional video']
  }
];

// Transceiver database
export const TRANSCEIVERS: Transceiver[] = [
  // 1G SFP Transceivers
  {
    id: 'sfp-1g-sx',
    name: 'SFP 1000BASE-SX',
    formFactor: 'SFP',
    protocol: 'Ethernet',
    speed: 1,
    connectorType: 'LC',
    wavelength: 850,
    maxDistance: 550,
    fiberType: 'multimode',
    typicalApplications: ['Campus networks', 'Building interconnects', 'Short-range datacenter'],
    powerConsumption: 1.0
  },
  {
    id: 'sfp-1g-lx',
    name: 'SFP 1000BASE-LX',
    formFactor: 'SFP',
    protocol: 'Ethernet',
    speed: 1,
    connectorType: 'LC',
    wavelength: 1310,
    maxDistance: 10000,
    fiberType: 'single-mode',
    typicalApplications: ['Long-range campus', 'Metro networks', 'Building-to-building'],
    powerConsumption: 1.0
  },
  {
    id: 'sfp-1g-t',
    name: 'SFP 1000BASE-T',
    formFactor: 'SFP',
    protocol: 'Ethernet',
    speed: 1,
    connectorType: 'RJ45',
    maxDistance: 100,
    typicalApplications: ['Copper uplinks', 'Legacy integration', 'Short-range connections'],
    powerConsumption: 1.5
  },
  // 10G SFP+ Transceivers
  {
    id: 'sfp-plus-10g-sr',
    name: 'SFP+ 10GBASE-SR',
    formFactor: 'SFP+',
    protocol: 'Ethernet',
    speed: 10,
    connectorType: 'LC',
    wavelength: 850,
    maxDistance: 400,
    fiberType: 'multimode',
    typicalApplications: ['Datacenter ToR', 'Server connections', 'Storage networks'],
    powerConsumption: 1.5
  },
  {
    id: 'sfp-plus-10g-lr',
    name: 'SFP+ 10GBASE-LR',
    formFactor: 'SFP+',
    protocol: 'Ethernet',
    speed: 10,
    connectorType: 'LC',
    wavelength: 1310,
    maxDistance: 10000,
    fiberType: 'single-mode',
    typicalApplications: ['Long-range datacenter', 'Campus backbone', 'Metro networks'],
    powerConsumption: 1.5
  },
  {
    id: 'sfp-plus-dac',
    name: 'SFP+ DAC (Direct Attach Copper)',
    formFactor: 'SFP+',
    protocol: 'Ethernet',
    speed: 10,
    connectorType: 'RJ45',
    maxDistance: 10,
    typicalApplications: ['Rack-to-rack', 'ToR switch uplinks', 'Short datacenter runs'],
    powerConsumption: 0.5
  },
  // 40G QSFP+ Transceivers
  {
    id: 'qsfp-plus-40g-sr4',
    name: 'QSFP+ 40GBASE-SR4',
    formFactor: 'QSFP+',
    protocol: 'Ethernet',
    speed: 40,
    connectorType: 'MPO',
    wavelength: 850,
    maxDistance: 150,
    fiberType: 'multimode',
    typicalApplications: ['Spine-leaf datacenter', 'High-density switching', 'Server aggregation'],
    powerConsumption: 3.5
  },
  {
    id: 'qsfp-plus-40g-lr4',
    name: 'QSFP+ 40GBASE-LR4',
    formFactor: 'QSFP+',
    protocol: 'Ethernet',
    speed: 40,
    connectorType: 'LC',
    wavelength: 1310,
    maxDistance: 10000,
    fiberType: 'single-mode',
    typicalApplications: ['Long-range datacenter', 'WAN links', 'Campus backbone'],
    powerConsumption: 3.5
  },
  // 100G QSFP28 Transceivers
  {
    id: 'qsfp28-100g-sr4',
    name: 'QSFP28 100GBASE-SR4',
    formFactor: 'QSFP28',
    protocol: 'Ethernet',
    speed: 100,
    connectorType: 'MPO',
    wavelength: 850,
    maxDistance: 100,
    fiberType: 'multimode',
    typicalApplications: ['Modern datacenter spine', 'Hyperscale switching', 'AI/ML clusters'],
    powerConsumption: 4.5
  },
  {
    id: 'qsfp28-100g-lr4',
    name: 'QSFP28 100GBASE-LR4',
    formFactor: 'QSFP28',
    protocol: 'Ethernet',
    speed: 100,
    connectorType: 'LC',
    wavelength: 1310,
    maxDistance: 10000,
    fiberType: 'single-mode',
    typicalApplications: ['Long-range datacenter', 'Metro networks', 'DCI links'],
    powerConsumption: 5.0
  },
  // Fibre Channel Transceivers
  {
    id: 'sfp-8g-fc',
    name: 'SFP+ 8G Fibre Channel',
    formFactor: 'SFP+',
    protocol: 'Fibre Channel',
    speed: 8,
    connectorType: 'LC',
    wavelength: 850,
    maxDistance: 150,
    fiberType: 'multimode',
    typicalApplications: ['SAN storage', 'Fibre Channel switches', 'Storage arrays'],
    powerConsumption: 1.5
  },
  {
    id: 'sfp-16g-fc',
    name: 'SFP+ 16G Fibre Channel',
    formFactor: 'SFP+',
    protocol: 'Fibre Channel',
    speed: 16,
    connectorType: 'LC',
    wavelength: 850,
    maxDistance: 100,
    fiberType: 'multimode',
    typicalApplications: ['High-performance SAN', 'Storage networks', 'Backup systems'],
    powerConsumption: 2.0
  },
  {
    id: 'qsfp-32g-fc',
    name: 'QSFP+ 32G Fibre Channel',
    formFactor: 'QSFP+',
    protocol: 'Fibre Channel',
    speed: 32,
    connectorType: 'LC',
    wavelength: 850,
    maxDistance: 100,
    fiberType: 'multimode',
    typicalApplications: ['Modern SAN infrastructure', 'NVMe over FC', 'High-speed storage'],
    powerConsumption: 3.5
  }
];

// Helper function to calculate media score
export function calculateMediaScore(
  media: MediaOption,
  scenario: ScenarioRequirement
): MediaScore {
  let score = 100;
  const reasoning: string[] = [];

  // Distance check
  const distanceMatch = media.maxDistance >= scenario.requiredDistance;
  if (!distanceMatch) {
    score = 0;
    reasoning.push(`Distance insufficient: ${media.maxDistance}m < ${scenario.requiredDistance}m required`);
  }

  // Bandwidth check
  const bandwidthMatch = media.bandwidth >= scenario.requiredBandwidth;
  if (!bandwidthMatch) {
    if (score === 100) {score = 40;}
    reasoning.push(`Bandwidth insufficient: ${media.bandwidth}Mbps < ${scenario.requiredBandwidth}Mbps required`);
  }

  // Environment match
  let environmentMatch = true;
  if (scenario.environment === 'industrial' && media.environmentalResistance === 'low') {
    if (score === 100) {score = 70;}
    environmentMatch = false;
    reasoning.push('Low environmental resistance for industrial environment');
  }
  if (scenario.environment === 'outdoor' && media.environmentalResistance === 'low') {
    if (score === 100) {score = 40;}
    environmentMatch = false;
    reasoning.push('Not suitable for outdoor environment');
  }

  // Budget check
  const budgetMatch = media.costPerMeter <= scenario.budgetPerMeter;
  if (!budgetMatch && score === 100) {
    score = 70;
    reasoning.push(`Over budget: $${media.costPerMeter}/m > $${scenario.budgetPerMeter}/m`);
  }

  // Optimal solution
  if (score === 100) {
    reasoning.push('Optimal solution: meets all requirements efficiently');
  }

  return {
    mediaId: media.id,
    score,
    reasoning: reasoning.join('. '),
    distanceMatch,
    bandwidthMatch,
    environmentMatch,
    budgetMatch
  };
}
