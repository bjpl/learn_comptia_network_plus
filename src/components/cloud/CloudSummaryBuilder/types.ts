/**
 * Type definitions for CloudSummaryBuilder component
 */

export interface CloudTerm {
  [key: string]: string;
}

export interface CloudTermCategory {
  [category: string]: CloudTerm;
}

export interface ServiceComparisonRow {
  aspect: string;
  SaaS: string;
  PaaS: string;
  IaaS: string;
}

export interface UseCaseMatch {
  scenario: string;
  deployment: string;
  service: string;
  examples: string;
}

export interface CostProfile {
  compute: number;
  storage: number;
  bandwidth: number;
  monthly: string;
}

export interface CostCalculatorInputs {
  [profileName: string]: CostProfile;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export type TabType = 'builder' | 'terms' | 'comparison' | 'usecase' | 'cost' | 'exam';

export interface UserAnswers {
  [questionId: string]: string;
}

export interface BuilderState {
  wordCount: number;
  showIdealSolution: boolean;
  activeTab: TabType;
  selectedTermCategory: keyof CloudTermCategory;
  userAnswers: UserAnswers;
  costProfile: keyof CostCalculatorInputs;
}
