export interface PacketJourneySimulatorProps {
  onComplete?: () => void;
}

export type AnimationSpeed = 0.5 | 1 | 2;
export type Protocol = 'TCP' | 'UDP';
