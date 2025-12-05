/**
 * Type definitions for PortProtocolTrainer component
 */

export interface PortCard {
  id: string;
  port: number;
  protocol: string;
  service: string;
  description: string;
  tcpUdp: string;
  security: string;
  mnemonic: string;
  category: 'well-known' | 'registered' | 'dynamic';
  examCritical: boolean;
}

export interface CardProgress {
  cardId: string;
  box: number; // Leitner box 0-4 (0=new, 4=mastered)
  lastReviewed: number;
  nextReview: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
}

export interface QuizQuestion {
  id: string;
  type: 'port-to-protocol' | 'protocol-to-port' | 'security' | 'tcp-udp' | 'use-case';
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  portNumber?: number;
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
  selectedAnswer: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface TrainingStats {
  totalCards: number;
  masteredCards: number;
  studyStreak: number;
  lastStudyDate: string;
  totalReviews: number;
  accuracy: number;
  level: number;
  xp: number;
  achievements: Achievement[];
  quizScores: number[];
}

export type TrainingMode = 'flashcards' | 'quiz' | 'memory-palace' | 'analytics';
