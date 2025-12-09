export interface CloudMigrationSimulatorProps {
  className?: string;
}

export type ViewType = 'overview' | 'strategy' | 'phases' | 'costs' | 'risks' | 'timeline';

export interface ChecklistItems {
  [key: string]: boolean;
}

export interface TimelineDataItem {
  phase: any;
  startWeek: number;
  endWeek: number;
  progress: number;
}

export interface ExtendedRisk {
  id: string;
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  phase: string;
  severity: number;
}
