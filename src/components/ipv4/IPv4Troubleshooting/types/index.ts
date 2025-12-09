/**
 * Type definitions for IPv4Troubleshooting component
 */

export interface TroubleshootingState {
  activeStep: number;
  showHints: boolean;
  showSolution: boolean;
  userDiagnosis: string;
  completedSteps: Set<number>;
  score: number;
  startTime: number | null;
  showDiagnosticDialog: boolean;
  selectedDiagnostic: import('../../ipv4-types').DiagnosticOutput | null;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type DifficultyColor = 'success' | 'warning' | 'error' | 'default';
export type ProblemTypeColor = 'error' | 'warning' | 'info' | 'success' | 'default';
export type DeviceType = 'host' | 'server' | 'router' | 'switch';
export type DeviceStatus = 'online' | 'error' | 'offline';
