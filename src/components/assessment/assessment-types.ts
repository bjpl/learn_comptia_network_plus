/**
 * Assessment Component Types
 * Comprehensive type definitions for integrated assessment and progress tracking
 */

export interface LearningObjective {
  id: string;
  code: string; // e.g., "1.0", "1.1"
  title: string;
  category: 'fundamentals' | 'infrastructure' | 'operations' | 'security' | 'troubleshooting';
}

export interface AssessmentPoint {
  loId: string;
  loCode: string;
  description: string;
  maxScore: number;
  criteria: string[];
}

export interface ScenarioPhase {
  id: string;
  title: string;
  description: string;
  assessmentPoints: AssessmentPoint[];
  hints?: string[];
  requiredForNext: boolean;
}

export interface IntegratedScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number; // minutes
  learningObjectives: string[]; // LO codes
  phases: ScenarioPhase[];
  context: {
    company: string;
    locations: number;
    users: number;
    requirements: string[];
    constraints: string[];
  };
  totalPoints: number;
}

export interface UserAnswer {
  phaseId: string;
  assessmentPointId: string;
  answer: string;
  score?: number;
  feedback?: string;
}

export interface ScenarioAttempt {
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  currentPhase: number;
  answers: UserAnswer[];
  totalScore: number;
  maxScore: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface LOProgress {
  loCode: string;
  completionPercentage: number;
  masteryLevel: 'novice' | 'competent' | 'proficient' | 'expert';
  timeSpent: number; // minutes
  attemptsCount: number;
  averageScore: number;
  lastPracticed?: Date;
  commonMistakes: string[];
  suggestedActivities: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number; // 0-100
}

export interface PerformanceTrend {
  date: Date;
  loCode: string;
  score: number;
  activity: string;
}

export interface StudyPlan {
  weekNumber: number;
  focus: string[];
  activities: {
    loCode: string;
    component: string;
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  goals: string[];
}

export interface ExamReadiness {
  overallScore: number; // 0-100
  domainScores: {
    [domain: string]: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendedStudyTime: number; // hours
  readyForExam: boolean;
  confidence: 'low' | 'medium' | 'high';
}

export interface ProgressData {
  userId: string;
  loProgress: LOProgress[];
  badges: Badge[];
  performanceTrends: PerformanceTrend[];
  scenarioAttempts: ScenarioAttempt[];
  totalTimeSpent: number; // minutes
  studyStreak: number; // days
  lastActivity: Date;
  examReadiness: ExamReadiness;
  studyPlan: StudyPlan[];
}

export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  domains?: string[];
  masteryLevels?: ('novice' | 'competent' | 'proficient' | 'expert')[];
  showOnlyIncomplete?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}
