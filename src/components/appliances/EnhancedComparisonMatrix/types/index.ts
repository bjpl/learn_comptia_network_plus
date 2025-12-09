export type ViewMode = 'comparison' | 'feature-matrix' | 'decision-helper' | 'exam-questions';

export interface ViewModeOption {
  id: ViewMode;
  label: string;
  icon: string;
}

export interface DeviceCounts {
  [layer: number]: number;
}
