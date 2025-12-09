import type { ComparisonDevice } from '../../appliances-types';

export interface DecisionTreeProps {
  onRecommendation?: (deviceIds: string[]) => void;
}

export interface ComparisonData {
  devices: ComparisonDevice[];
  comparison: string;
}

export interface ExamScenario {
  title: string;
  description: string;
  answer: string;
  reasoning: string;
}

export interface QuestionViewProps {
  currentNode: {
    text: string;
  };
  onAnswer: (answer: 'yes' | 'no') => void;
}

export interface RecommendationViewProps {
  currentNode: {
    text: string;
    rationale?: string;
  };
  devices: ComparisonDevice[];
  onCompare: () => void;
  onExamScenario: () => void;
}

export interface DeviceCardProps {
  device: ComparisonDevice;
}

export interface ComparisonViewProps {
  data: ComparisonData;
  onClose: () => void;
}

export interface ExamScenarioViewProps {
  scenario: ExamScenario;
  onClose: () => void;
  onNext: () => void;
}
