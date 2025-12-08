/**
 * Backwards compatibility export for PortProtocolTrainer
 * This file maintains the original import path while using the decomposed component
 */

export { PortProtocolTrainer, default } from './PortProtocolTrainer/index';

// Re-export types for backwards compatibility
export type {
  PortCard,
  CardProgress,
  QuizQuestion,
  QuizResult,
  Achievement,
  TrainingStats,
  TrainingMode,
} from './PortProtocolTrainer/types';
