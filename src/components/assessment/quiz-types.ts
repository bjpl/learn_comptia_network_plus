/**
 * Quiz Engine Type Definitions
 * Comprehensive types for the CompTIA Network+ quiz system
 */

export type QuestionType = 'multiple-choice' | 'multiple-select' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Domain = '1.0' | '2.0' | '3.0' | '4.0' | '5.0';
export type FeedbackMode = 'immediate' | 'review-at-end';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  domain: Domain;
  domainName: string;
  difficulty: Difficulty;
  question: string;
  options: QuestionOption[];
  explanation: string;
  examTip: string;
  tags: string[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  timeSpent: number; // seconds
  timestamp: Date;
}

export interface QuizConfig {
  numberOfQuestions: number;
  domains: Domain[];
  difficulties: Difficulty[];
  feedbackMode: FeedbackMode;
  timeLimit?: number; // minutes, optional
  randomize: boolean;
  retryIncorrectOnly: boolean;
}

export interface QuizState {
  quizId: string;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  questions: Question[];
  answers: UserAnswer[];
  config: QuizConfig;
  isPaused: boolean;
  isCompleted: boolean;
}

export interface QuizScore {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  percentage: number;
  passingScore: number; // 720 out of 900 for Network+
  passed: boolean;
  timeSpent: number; // seconds
  domainBreakdown: DomainScore[];
  difficultyBreakdown: DifficultyScore[];
}

export interface DomainScore {
  domain: Domain;
  domainName: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

export interface DifficultyScore {
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}

export interface QuizProgress {
  quizId: string;
  quizState: QuizState;
  lastUpdated: Date;
}

export interface QuizResult {
  quizId: string;
  completedAt: Date;
  score: QuizScore;
  config: QuizConfig;
  answers: UserAnswer[];
  questions: Question[];
}

export interface QuizFilters {
  domains: Domain[];
  difficulties: Difficulty[];
  numberOfQuestions: number;
  randomize: boolean;
}

export interface QuestionReview {
  question: Question;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  correctOptions: QuestionOption[];
  selectedOptions: QuestionOption[];
}
