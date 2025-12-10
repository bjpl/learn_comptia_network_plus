export type OSILayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type AnimationSpeed = 0.5 | 1 | 2;
export type Protocol = 'TCP' | 'UDP';
export type ViewMode = 'journey' | 'headers' | 'hexdump' | 'scenarios' | 'tcp-flags' | 'mtu';
export type ProtocolType =
  | 'HTTP'
  | 'HTTPS'
  | 'DNS'
  | 'DHCP'
  | 'FTP'
  | 'SMTP'
  | 'SSH'
  | 'TCP'
  | 'UDP'
  | 'ICMP'
  | 'ARP';
export type TCPScenario = 'handshake' | 'termination' | 'custom';

export interface TCPFlagState {
  SYN: boolean;
  ACK: boolean;
  FIN: boolean;
  RST: boolean;
  PSH: boolean;
  URG: boolean;
}

export interface AnimationState {
  isPlaying: boolean;
  speed: 0.5 | 1 | 2;
  currentStep: number;
  protocol: 'TCP' | 'UDP';
}

export interface PacketState {
  currentLayer: OSILayerNumber;
  direction: 'encapsulation' | 'decapsulation';
  headers: HeaderInfo[];
  payload: string;
}

export interface HeaderInfo {
  layer: OSILayerNumber;
  layerName: string;
  data: Record<string, string | number>;
  color: string;
}

export interface FragmentationInfo {
  needsFragmentation: boolean;
  fragmentCount: number;
  totalPacketSize: number;
  totalFrameSize: number;
  mtu: number;
}

export interface PacketJourneySimulatorProps {
  onComplete?: () => void;
}
