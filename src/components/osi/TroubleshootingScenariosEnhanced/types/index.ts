/**
 * Type Definitions for Troubleshooting Scenarios Enhanced
 */

import type { OSILayerNumber } from '../../osi-types';

export type ViewMode = 'practice' | 'tools' | 'methodology' | 'analytics' | 'reference' | 'exam';

export interface ModeConfig {
  timeLimit: number | null;
  hintsEnabled: boolean;
  wizardEnabled: boolean;
  toolsEnabled: boolean;
  immediateFeedback: boolean;
}

export interface TroubleshootingScenariosEnhancedProps {
  onProgressUpdate?: (progress: { completed: number; total: number }) => void;
}

export interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

export interface LayerSelectionProps {
  selected: OSILayerNumber | null;
  onSelect: (layer: OSILayerNumber) => void;
}

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const STUDY_MODE: ModeConfig = {
  timeLimit: null,
  hintsEnabled: true,
  wizardEnabled: true,
  toolsEnabled: true,
  immediateFeedback: true,
};

export const EXAM_MODE: ModeConfig = {
  timeLimit: 240, // 4 minutes per scenario
  hintsEnabled: false,
  wizardEnabled: false,
  toolsEnabled: true,
  immediateFeedback: false,
};
