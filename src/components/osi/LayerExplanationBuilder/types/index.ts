import type { OSILayerNumber } from '../../osi-types';

export interface LayerExplanationBuilderProps {
  onProgressUpdate?: (progress: number) => void;
}

export interface QuizQuestion {
  id: string;
  layer: OSILayerNumber;
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface RealWorldExample {
  title: string;
  layer: OSILayerNumber;
  scenario: string;
  protocols: string[];
}

export type LearningMode = 1 | 2 | 3 | 4 | 5;
