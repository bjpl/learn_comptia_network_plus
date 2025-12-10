/**
 * Type definitions for QuizEngine component
 */

import type { Domain, Difficulty, FeedbackMode } from '../../quiz-types';

export interface QuizEngineProps {
  initialConfig?: Partial<QuizConfig>;
}

export interface QuizConfig {
  numberOfQuestions: number;
  domains: Domain[];
  difficulties: Difficulty[];
  feedbackMode: FeedbackMode;
  randomize: boolean;
  retryIncorrectOnly: boolean;
}

export type ScreenType = 'setup' | 'quiz' | 'results';

export const DEFAULT_CONFIG: QuizConfig = {
  numberOfQuestions: 20,
  domains: ['1.0', '2.0', '3.0', '4.0', '5.0'],
  difficulties: ['easy', 'medium', 'hard'],
  feedbackMode: 'review-at-end',
  randomize: true,
  retryIncorrectOnly: false,
};
