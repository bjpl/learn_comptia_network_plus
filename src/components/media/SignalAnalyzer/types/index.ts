import type { CableType } from '../../signal-data';

export interface SignalAnalyzerState {
  selectedCable: CableType;
  distance: number;
  frequency: number;
  interferenceLevel: number;
  showEyeDiagram: boolean;
  compareMode: boolean;
  selectedCompareCable: CableType;
}

export interface SignalMetrics {
  attenuation: number;
  crosstalkNEXT: number;
  crosstalkFEXT: number;
  snr: number;
  receivedSignal: number;
}

export interface ComparisonMetrics {
  attenuation: number;
  snr: number;
  receivedSignal: number;
}

export interface EyeDiagramMetrics {
  eyeHeight: number;
  eyeWidth: number;
  jitter: number;
  quality: 'excellent' | 'good' | 'marginal' | 'poor';
}

export interface CanvasRefs {
  signalCanvasRef: React.RefObject<HTMLCanvasElement>;
  eyeDiagramCanvasRef: React.RefObject<HTMLCanvasElement>;
  bandwidthCanvasRef: React.RefObject<HTMLCanvasElement>;
}
