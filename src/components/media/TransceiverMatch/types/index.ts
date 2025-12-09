import type { Transceiver, TransceiverFormFactor, TransceiverProtocol } from '../../media-types';

export interface UseCaseCard {
  id: string;
  description: string;
  requirements: {
    speed: number;
    distance: number;
    protocol: TransceiverProtocol;
    formFactor?: TransceiverFormFactor;
  };
}

export interface TransceiverSpec {
  formFactor: string;
  fullName: string;
  speed: string;
  channels: number;
  size: string;
  introduced: number;
  useCase: string;
  keyFeature: string;
}

export interface WDMType {
  name: string;
  fullName: string;
  channels: string;
  wavelengthRange: string;
  spacing: string;
  useCase: string;
  capacity: string;
}

export interface TroubleshootingTip {
  symptom: string;
  causes: string[];
  solutions: string[];
}

export type { Transceiver, TransceiverFormFactor, TransceiverProtocol };
