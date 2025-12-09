/**
 * Type definitions for Cloud Summary Builder Enhanced
 */

export type TabType = 'terms' | 'comparison' | 'usecase' | 'cost' | 'exam';

export interface CloudTerm {
  [key: string]: string;
}

export interface CloudTerms {
  'Deployment Models': CloudTerm;
  'Service Models': CloudTerm;
  'Key Concepts': CloudTerm;
}

export interface ServiceComparisonRow {
  aspect: string;
  SaaS: string;
  PaaS: string;
  IaaS: string;
}

export interface UseCase {
  scenario: string;
  deployment: string;
  service: string;
  example: string;
}

export interface CostProfile {
  compute: number;
  storage: number;
  bandwidth: number;
  total: number;
}

export interface CostProfiles {
  'Small website': CostProfile;
  'Medium app': CostProfile;
  Enterprise: CostProfile;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface CloudSummaryState {
  activeTab: TabType;
  selectedTermCategory: keyof CloudTerms;
  costProfile: keyof CostProfiles;
  userAnswers: Record<string, string>;
}
