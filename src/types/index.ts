/**
 * CompTIA Network+ Learning Platform - TypeScript Type Definitions
 * Shared type definitions for the entire application
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Assessment question types
 */
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'drag-and-drop'
  | 'simulation'
  | 'performance-based'
  | 'fill-in-blank'
  | 'hotspot';

/**
 * Learning component types
 */
export type ComponentType =
  | 'flashcard'
  | 'simulator'
  | 'diagram'
  | 'quiz'
  | 'lab'
  | 'video'
  | 'reading';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Network protocols
 */
export type NetworkProtocol =
  | 'TCP'
  | 'UDP'
  | 'ICMP'
  | 'HTTP'
  | 'HTTPS'
  | 'FTP'
  | 'SMTP'
  | 'DNS'
  | 'DHCP'
  | 'SSH'
  | 'SNMP';

// ============================================================================
// Assessment Types
// ============================================================================

/**
 * Assessment question interface
 */
export interface Question {
  id: string;
  type: QuestionType;
  domain: string;
  objective: string;
  difficulty: DifficultyLevel;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  timeLimit?: number; // seconds
  hints?: string[];
  references?: string[];
}

/**
 * Assessment result
 */
export interface AssessmentResult {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // seconds
  timestamp: Date;
}

/**
 * Score breakdown
 */
export interface ScoreBreakdown {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  domainScores: DomainScore[];
}

/**
 * Domain-specific score
 */
export interface DomainScore {
  domain: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  weakAreas: string[];
}

// ============================================================================
// Networking Types
// ============================================================================

/**
 * IP address information
 */
export interface IPAddress {
  address: string;
  version: 4 | 6;
  binary: string;
  decimal: number[];
  isValid: boolean;
  isPrivate: boolean;
  isLoopback: boolean;
  isMulticast: boolean;
  class?: 'A' | 'B' | 'C' | 'D' | 'E';
}

/**
 * Subnet information
 */
export interface SubnetInfo {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  cidr: number;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  binary: {
    network: string;
    mask: string;
  };
}

/**
 * VLSM calculation result
 */
export interface VLSMResult {
  subnets: SubnetInfo[];
  wastedAddresses: number;
  efficiency: number; // percentage
}

/**
 * Port information
 */
export interface PortInfo {
  number: number;
  protocol: NetworkProtocol;
  service: string;
  isWellKnown: boolean;
  isRegistered: boolean;
  isDynamic: boolean;
}

// ============================================================================
// Progress Tracking Types
// ============================================================================

/**
 * User progress data
 */
export interface UserProgress {
  userId: string;
  componentsCompleted: string[];
  domainsCompleted: string[];
  totalTimeSpent: number; // seconds
  lastAccessed: Date;
  overallProgress: number; // percentage
  domainProgress: Map<string, number>;
  achievements: Achievement[];
  streak: number; // consecutive days
}

/**
 * Achievement badge
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: Date;
  category: 'completion' | 'mastery' | 'streak' | 'speed' | 'perfect';
}

/**
 * Learning session
 */
export interface LearningSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  componentsVisited: string[];
  questionsAnswered: number;
  correctAnswers: number;
  avgResponseTime: number;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number; // milliseconds
  delay?: number;
  easing?: EasingFunction;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Easing function type
 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

/**
 * Particle effect configuration
 */
export interface ParticleConfig {
  count: number;
  color: string | string[];
  size: { min: number; max: number };
  velocity: { min: number; max: number };
  lifetime: number; // milliseconds
  gravity?: number;
  friction?: number;
}

/**
 * Network packet animation
 */
export interface PacketAnimation {
  id: string;
  source: { x: number; y: number };
  destination: { x: number; y: number };
  protocol: NetworkProtocol;
  data: string;
  progress: number; // 0-1
  status: 'pending' | 'in-transit' | 'delivered' | 'failed';
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
}

/**
 * Input constraints
 */
export interface ValidationConstraints {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

// ============================================================================
// Timer Types
// ============================================================================

/**
 * Timer state
 */
export interface TimerState {
  elapsed: number; // seconds
  remaining?: number; // seconds
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
}

/**
 * Timer configuration
 */
export interface TimerConfig {
  duration?: number; // seconds (undefined for stopwatch)
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (state: TimerState) => void;
  warningThreshold?: number; // seconds remaining
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

/**
 * Interactive component props
 */
export interface InteractiveComponentProps extends BaseComponentProps {
  onComplete?: (result: any) => void;
  onProgress?: (progress: number) => void;
  disabled?: boolean;
}

/**
 * Scorable component props
 */
export interface ScorableComponentProps extends InteractiveComponentProps {
  questions: Question[];
  timeLimit?: number;
  showFeedback?: boolean;
  allowReview?: boolean;
}

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Local storage keys
 */
export enum StorageKey {
  USER_PROGRESS = 'network_plus_user_progress',
  SESSION_DATA = 'network_plus_session',
  PREFERENCES = 'network_plus_preferences',
  ACHIEVEMENTS = 'network_plus_achievements',
  BOOKMARKS = 'network_plus_bookmarks',
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  showHints: boolean;
  difficulty: DifficultyLevel;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Network calculation error
 */
export class NetworkCalculationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_CALC_ERROR', details);
    this.name = 'NetworkCalculationError';
  }
}

// ============================================================================
// Component & Navigation Types
// ============================================================================

/**
 * Learning component metadata
 */
export interface Component {
  id: string;
  title: string;
  description: string;
  type: ComponentType;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  objectives: string[];
  domains: string[];
}

/**
 * Navigation item
 */
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  requiredProgress?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract keys of a certain type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Make certain properties required
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Async function type
 */
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

/**
 * Callback function type
 */
export type Callback<T = void> = (...args: any[]) => T;
