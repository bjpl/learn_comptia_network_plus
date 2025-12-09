import type { OSILayerNumber, TroubleshootingScenario, ScenarioResponse } from '../../osi-types';

export interface TroubleshootingScenariosProps {
  onProgressUpdate?: (correct: number, total: number) => void;
}

export interface TroubleshootingState {
  currentScenarioIndex: number;
  responses: Map<string, ScenarioResponse>;
  currentResponse: Partial<ScenarioResponse>;
  showHints: boolean;
  usedHints: Set<string>;
  filterDifficulty: string;
  filterCategory: string;
}

export interface TroubleshootingStats {
  attempted: number;
  correct: number;
  avgScore: number;
}

export type { OSILayerNumber, TroubleshootingScenario, ScenarioResponse };
