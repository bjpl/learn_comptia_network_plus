/**
 * Signal analysis data for transmission media
 * Contains attenuation coefficients, standards, and signal characteristics
 */

export interface CableType {
  id: string;
  name: string;
  category: 'copper' | 'fiber';
  // Attenuation in dB per 100m at various frequencies (MHz for copper, wavelength for fiber)
  attenuation: {
    frequency: number; // MHz for copper, nm for fiber
    dbPer100m: number;
  }[];
  maxDistance: number; // meters
  bandwidth: number; // MHz or Gbps
  impedance?: number; // Ohms (copper only)
  crosstalkNEXT?: number; // dB at 100MHz
  crosstalkFEXT?: number; // dB at 100MHz
  emiSusceptibility: 'high' | 'medium' | 'low' | 'none';
  standard: string;
  color: string;
}

export const cableTypes: CableType[] = [
  {
    id: 'cat5e',
    name: 'Cat5e UTP',
    category: 'copper',
    attenuation: [
      { frequency: 1, dbPer100m: 2.0 },
      { frequency: 10, dbPer100m: 6.5 },
      { frequency: 100, dbPer100m: 22.0 },
    ],
    maxDistance: 100,
    bandwidth: 100,
    impedance: 100,
    crosstalkNEXT: 35.3,
    crosstalkFEXT: 25.0,
    emiSusceptibility: 'high',
    standard: 'TIA-568-B.2',
    color: '#3b82f6',
  },
  {
    id: 'cat6',
    name: 'Cat6 UTP',
    category: 'copper',
    attenuation: [
      { frequency: 1, dbPer100m: 2.0 },
      { frequency: 10, dbPer100m: 6.3 },
      { frequency: 100, dbPer100m: 21.3 },
      { frequency: 250, dbPer100m: 35.9 },
    ],
    maxDistance: 100,
    bandwidth: 250,
    impedance: 100,
    crosstalkNEXT: 44.3,
    crosstalkFEXT: 32.0,
    emiSusceptibility: 'high',
    standard: 'TIA-568-B.2-1',
    color: '#8b5cf6',
  },
  {
    id: 'cat6a',
    name: 'Cat6a UTP',
    category: 'copper',
    attenuation: [
      { frequency: 1, dbPer100m: 1.8 },
      { frequency: 10, dbPer100m: 5.8 },
      { frequency: 100, dbPer100m: 19.8 },
      { frequency: 250, dbPer100m: 33.0 },
      { frequency: 500, dbPer100m: 49.0 },
    ],
    maxDistance: 100,
    bandwidth: 500,
    impedance: 100,
    crosstalkNEXT: 50.3,
    crosstalkFEXT: 38.0,
    emiSusceptibility: 'medium',
    standard: 'TIA-568-B.2-10',
    color: '#ec4899',
  },
  {
    id: 'cat7',
    name: 'Cat7 S/FTP',
    category: 'copper',
    attenuation: [
      { frequency: 1, dbPer100m: 1.8 },
      { frequency: 10, dbPer100m: 5.6 },
      { frequency: 100, dbPer100m: 18.5 },
      { frequency: 250, dbPer100m: 30.0 },
      { frequency: 500, dbPer100m: 44.0 },
      { frequency: 600, dbPer100m: 48.5 },
    ],
    maxDistance: 100,
    bandwidth: 600,
    impedance: 100,
    crosstalkNEXT: 62.1,
    crosstalkFEXT: 45.0,
    emiSusceptibility: 'low',
    standard: 'ISO/IEC 11801',
    color: '#f59e0b',
  },
  {
    id: 'mmf-om3',
    name: 'MMF OM3 50/125',
    category: 'fiber',
    attenuation: [
      { frequency: 850, dbPer100m: 0.3 },
      { frequency: 1300, dbPer100m: 0.1 },
    ],
    maxDistance: 300000, // 300km for 1Gbps, 300m for 10Gbps
    bandwidth: 2000, // MHz·km
    emiSusceptibility: 'none',
    standard: 'TIA-492AAAC',
    color: '#10b981',
  },
  {
    id: 'mmf-om4',
    name: 'MMF OM4 50/125',
    category: 'fiber',
    attenuation: [
      { frequency: 850, dbPer100m: 0.3 },
      { frequency: 1300, dbPer100m: 0.1 },
    ],
    maxDistance: 550000, // Up to 550m for 10Gbps
    bandwidth: 4700, // MHz·km
    emiSusceptibility: 'none',
    standard: 'TIA-492AAAD',
    color: '#06b6d4',
  },
  {
    id: 'smf-os2',
    name: 'SMF OS2 9/125',
    category: 'fiber',
    attenuation: [
      { frequency: 1310, dbPer100m: 0.04 },
      { frequency: 1550, dbPer100m: 0.025 },
    ],
    maxDistance: 100000000, // Up to 100km+
    bandwidth: 100000, // Effectively unlimited
    emiSusceptibility: 'none',
    standard: 'ITU-T G.652',
    color: '#eab308',
  },
];

export interface InterferenceType {
  id: string;
  name: string;
  description: string;
  impact: number; // dB of signal degradation
  frequency: number; // MHz
  color: string;
}

export const interferenceTypes: InterferenceType[] = [
  {
    id: 'emi-motor',
    name: 'Motor EMI',
    description: 'Electromagnetic interference from electric motors',
    impact: 15,
    frequency: 60,
    color: '#ef4444',
  },
  {
    id: 'rfi-radio',
    name: 'Radio RFI',
    description: 'Radio frequency interference from broadcast signals',
    impact: 8,
    frequency: 100,
    color: '#f97316',
  },
  {
    id: 'fluorescent',
    name: 'Fluorescent Lights',
    description: 'EMI from fluorescent lighting ballasts',
    impact: 5,
    frequency: 40,
    color: '#fbbf24',
  },
  {
    id: 'crosstalk',
    name: 'Cable Crosstalk',
    description: 'Signal coupling between adjacent pairs',
    impact: 10,
    frequency: 100,
    color: '#a855f7',
  },
];

/**
 * Calculate attenuation for a given cable type at a specific frequency and distance
 */
export function calculateAttenuation(
  cable: CableType,
  frequency: number,
  distance: number
): number {
  // Find the closest frequency data points
  const sorted = [...cable.attenuation].sort((a, b) => a.frequency - b.frequency);

  if (frequency <= sorted[0].frequency) {
    return (sorted[0].dbPer100m * distance) / 100;
  }

  if (frequency >= sorted[sorted.length - 1].frequency) {
    return (sorted[sorted.length - 1].dbPer100m * distance) / 100;
  }

  // Linear interpolation between two points
  for (let i = 0; i < sorted.length - 1; i++) {
    if (frequency >= sorted[i].frequency && frequency <= sorted[i + 1].frequency) {
      const f1 = sorted[i].frequency;
      const f2 = sorted[i + 1].frequency;
      const db1 = sorted[i].dbPer100m;
      const db2 = sorted[i + 1].dbPer100m;

      const ratio = (frequency - f1) / (f2 - f1);
      const dbPer100m = db1 + ratio * (db2 - db1);

      return (dbPer100m * distance) / 100;
    }
  }

  return 0;
}

/**
 * Calculate crosstalk (NEXT or FEXT) at a given distance
 */
export function calculateCrosstalk(
  cable: CableType,
  distance: number,
  type: 'NEXT' | 'FEXT'
): number {
  if (!cable.crosstalkNEXT) {
    return 0;
  }

  const baseValue =
    type === 'NEXT' ? cable.crosstalkNEXT : cable.crosstalkFEXT || cable.crosstalkNEXT - 10;

  // Crosstalk increases with distance (logarithmically)
  const distanceFactor = Math.log10(distance / 100 + 1) * 3;

  return Math.max(0, baseValue - distanceFactor);
}

/**
 * Calculate SNR (Signal-to-Noise Ratio)
 */
export function calculateSNR(
  signalStrength: number,
  attenuation: number,
  interferenceLevel: number
): number {
  const receivedSignal = signalStrength - attenuation;
  const noise = interferenceLevel;

  return receivedSignal - noise;
}

/**
 * Calculate eye diagram quality metrics
 */
export function calculateEyeDiagramMetrics(
  snr: number,
  attenuation: number
): {
  eyeHeight: number;
  eyeWidth: number;
  jitter: number;
  quality: 'excellent' | 'good' | 'marginal' | 'poor';
} {
  // Eye height is related to SNR (percentage of ideal)
  const eyeHeight = Math.min(100, Math.max(0, 50 + snr * 2));

  // Eye width is related to attenuation (percentage of bit period)
  const eyeWidth = Math.min(100, Math.max(0, 100 - attenuation));

  // Jitter increases with poor signal quality
  const jitter = Math.max(0, 10 - snr / 2);

  let quality: 'excellent' | 'good' | 'marginal' | 'poor';
  if (snr > 20 && eyeHeight > 80) {
    quality = 'excellent';
  } else if (snr > 15 && eyeHeight > 60) {
    quality = 'good';
  } else if (snr > 10 && eyeHeight > 40) {
    quality = 'marginal';
  } else {
    quality = 'poor';
  }

  return { eyeHeight, eyeWidth, jitter, quality };
}

/**
 * TIA/EIA Standards reference
 */
export const standards = {
  'TIA-568-B.2': {
    name: 'Category 5e',
    bandwidth: '100 MHz',
    maxDistance: '100m',
    applications: ['1000BASE-T', '100BASE-TX'],
  },
  'TIA-568-B.2-1': {
    name: 'Category 6',
    bandwidth: '250 MHz',
    maxDistance: '100m (55m for 10GBASE-T)',
    applications: ['10GBASE-T (55m)', '1000BASE-T'],
  },
  'TIA-568-B.2-10': {
    name: 'Category 6a',
    bandwidth: '500 MHz',
    maxDistance: '100m',
    applications: ['10GBASE-T', '1000BASE-T'],
  },
  'ISO/IEC 11801': {
    name: 'Category 7',
    bandwidth: '600 MHz',
    maxDistance: '100m',
    applications: ['10GBASE-T', '1000BASE-T'],
  },
  'TIA-492AAAC': {
    name: 'OM3 Multimode Fiber',
    bandwidth: '2000 MHz·km',
    maxDistance: '300m at 10Gbps',
    applications: ['10GBASE-SR', '1000BASE-SX'],
  },
  'TIA-492AAAD': {
    name: 'OM4 Multimode Fiber',
    bandwidth: '4700 MHz·km',
    maxDistance: '550m at 10Gbps',
    applications: ['10GBASE-SR', '40GBASE-SR4'],
  },
  'ITU-T G.652': {
    name: 'OS2 Single Mode Fiber',
    bandwidth: 'Unlimited',
    maxDistance: '100km+',
    applications: ['10GBASE-LR', '100GBASE-LR4'],
  },
};
