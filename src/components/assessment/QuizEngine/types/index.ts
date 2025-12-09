/**
 * Type definitions for QuizEngine component
 */

export interface QuizEngineProps {
  initialConfig?: Partial<QuizConfig>;
}

export interface QuizConfig {
  numberOfQuestions: number;
  domains: string[];
  difficulties: string[];
  feedbackMode: 'immediate' | 'review-at-end';
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
