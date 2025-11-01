/**
 * TypeScript type definitions for OSI Model components
 */

export type OSILayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type CompletionStatus = 'empty' | 'partial' | 'complete';

export interface OSILayer {
  number: OSILayerNumber;
  name: string;
  status: CompletionStatus;
  primaryFunction: string;
  selectedProtocols: string[];
  pdu: string;
  interactionExplanation: string;
}

export interface LayerFunction {
  id: string;
  label: string;
  correct: boolean;
}

export interface Protocol {
  name: string;
  layer: OSILayerNumber;
  description: string;
  port?: number | string; // Port number or range
  transport?: 'TCP' | 'UDP' | 'Both';
  examImportance?: 'critical' | 'high' | 'medium' | 'low';
}

export interface PDU {
  layer: OSILayerNumber;
  name: string;
  description: string;
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

export interface TroubleshootingScenario {
  id: string;
  title: string;
  description: string;
  correctLayer: OSILayerNumber;
  explanation: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface ScenarioResponse {
  scenarioId: string;
  selectedLayer: OSILayerNumber | null;
  explanation: string;
  solution: string;
  score?: number;
}

export interface ProgressData {
  layersCompleted: number[];
  scenariosAttempted: number;
  scenariosCorrect: number;
  totalTimeSpent: number;
  hintsUsed: number;
}

export interface DifficultyLevel {
  level: number;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AnimationState {
  isPlaying: boolean;
  speed: 0.5 | 1 | 2;
  currentStep: number;
  protocol: 'TCP' | 'UDP';
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'source' | 'destination' | 'transit';
  position: { x: number; y: number };
}
