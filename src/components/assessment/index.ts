/**
 * Assessment Components Barrel Export
 * Components 22-24: Scenario Simulator, Progress Dashboard, and Quiz Engine
 */

// Component 22: Integrated Scenario Simulator
export { ScenarioSimulator, IntegratedSimulator } from './ScenarioSimulator';

// Component 23: Progress Tracking Dashboard
export { ProgressDashboard } from './ProgressDashboard';

// Component 24: Quiz Engine
export { QuizEngine } from './QuizEngine';

// Types and data
export * from './assessment-types';
export * from './assessment-data';
export type {
  Question,
  QuestionOption,
  QuizConfig,
  QuizState,
  QuizScore,
  DomainScore,
  DifficultyScore,
  QuizProgress,
  QuizResult,
  QuizFilters,
  QuestionReview,
  QuestionType,
  Difficulty,
  Domain,
  FeedbackMode,
} from './quiz-types';
export type { UserAnswer as QuizUserAnswer } from './quiz-types';
export {
  quizQuestions,
  getQuestionsByDomain,
  getQuestionsByDifficulty,
  getRandomQuestions,
  domainInfo,
} from './quiz-data';
