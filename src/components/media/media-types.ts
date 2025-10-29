/**
 * Type definitions for transmission media components
 */

export type MediaType = 'wireless' | 'copper' | 'fiber' | 'coaxial';

export type WirelessStandard = '802.11a' | '802.11b' | '802.11g' | '802.11n' | '802.11ac' | '802.11ax' | '4G' | '5G' | 'Satellite';

export type CopperStandard = '10BASE-T' | '100BASE-TX' | '1000BASE-T' | '2.5GBASE-T' | '5GBASE-T' | '10GBASE-T';

export type FiberType = 'single-mode' | 'multimode';

export type FiberStandard = '100BASE-FX' | '1000BASE-SX' | '1000BASE-LX' | '10GBASE-SR' | '10GBASE-LR' | '40GBASE-SR4' | '100GBASE-SR4';

export type CableCharacteristic = 'plenum' | 'non-plenum' | 'shielded' | 'unshielded';

export type ConnectorType =
  // Fiber connectors
  | 'SC' | 'LC' | 'ST' | 'MPO'
  // Copper connectors
  | 'RJ11' | 'RJ45'
  // Coaxial connectors
  | 'F-type' | 'BNC';

export type TransceiverFormFactor = 'SFP' | 'SFP+' | 'QSFP' | 'QSFP+' | 'QSFP28';

export type TransceiverProtocol = 'Ethernet' | 'Fibre Channel';

export interface MediaOption {
  id: string;
  type: MediaType;
  name: string;
  standard?: string;
  maxDistance: number; // in meters
  bandwidth: number; // in Mbps
  costPerMeter: number; // in USD
  environmentalResistance: 'low' | 'medium' | 'high';
  installationComplexity: 'easy' | 'moderate' | 'difficult';
  interferenceSusceptibility: 'none' | 'low' | 'medium' | 'high';
  characteristics?: CableCharacteristic[];
}

export interface ScenarioRequirement {
  id: string;
  title: string;
  description: string;
  requiredDistance: number; // in meters
  requiredBandwidth: number; // in Mbps
  environment: 'indoor' | 'outdoor' | 'industrial' | 'datacenter' | 'residential';
  budgetPerMeter: number; // in USD
  specialConditions?: string[];
}

export interface MediaScore {
  mediaId: string;
  score: number; // 0, 40, 70, or 100
  reasoning: string;
  distanceMatch: boolean;
  bandwidthMatch: boolean;
  environmentMatch: boolean;
  budgetMatch: boolean;
}

export interface Connector3DModel {
  id: ConnectorType;
  name: string;
  type: 'fiber' | 'copper' | 'coaxial';
  modelPath?: string; // Path to 3D model file
  description: string;
  pinCount?: number;
  pinLayout?: PinLayout;
  typicalUse: string[];
  keyFeatures: string[];
}

export interface PinLayout {
  pins: Pin[];
  standard?: 'T568A' | 'T568B';
}

export interface Pin {
  number: number;
  color: string;
  function: string;
  position: { x: number; y: number; z: number };
}

export interface Transceiver {
  id: string;
  name: string;
  formFactor: TransceiverFormFactor;
  protocol: TransceiverProtocol;
  speed: number; // in Gbps
  connectorType: ConnectorType;
  wavelength?: number; // in nm
  maxDistance: number; // in meters
  fiberType?: FiberType;
  typicalApplications: string[];
  powerConsumption: number; // in watts
}

export interface TransceiverMatchPair {
  transceiver: Transceiver;
  correctUseCase: string;
  incorrectUseCases: string[];
}

export type ViewMode = 'normal' | 'xray' | 'comparison';

export interface ConnectorComparison {
  connector1: ConnectorType;
  connector2: ConnectorType;
}

export interface MediaAssessment {
  scenarioId: string;
  selectedMediaId: string;
  score: number;
  timestamp: number;
}
