/**
 * Type definitions for ScenarioSimulator
 */

import type { IntegratedScenario, ScenarioAttempt, UserAnswer } from '../../assessment-types';

export type QuestionType = 'multiple-choice' | 'simulation' | 'performance' | 'essay';
export type ExamMode = 'practice' | 'timed' | 'tutorial';

export interface ScoreAnalysis {
  totalScore: number;
  maxScore: number;
  percentage: number;
  byPhase: { phaseId: string; score: number; maxScore: number }[];
  byType: { type: QuestionType; score: number; maxScore: number }[];
  passStatus: 'pass' | 'fail' | 'pass-with-distinction';
}

export interface ScenarioSimulatorProps {
  scenarioId?: string;
  timeLimit?: number;
  examMode?: ExamMode;
  onComplete?: (attempt: ScenarioAttempt) => void;
  onAnalysis?: (analysis: ScoreAnalysis) => void;
}

export type { IntegratedScenario, ScenarioAttempt, UserAnswer };
