/**
 * Common type definitions shared across multiple components
 * Utility types for progress tracking, validation, and state management
 */

// Re-export quiz types
export type {
  QuestionType,
  Difficulty,
  Domain,
  FeedbackMode,
  QuestionOption,
  Question,
  UserAnswer,
  QuizConfig,
  QuizState,
  QuizScore,
  DomainScore,
  DifficultyScore,
  QuizProgress,
  QuizResult,
  QuizFilters,
  QuestionReview,
} from '../components/assessment/quiz-types';

/**
 * Progress data for tracking user advancement
 */
export interface ProgressData {
  userId: string;
  componentId: string;
  componentType: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  progress: number; // 0-100 percentage
  score?: number;
  timeSpent: number; // seconds
  lastAccessed: Date;
  attempts: number;
  metadata?: Record<string, unknown>;
}

/**
 * Learning objective tracking
 */
export interface LearningObjectiveProgress {
  objectiveId: string;
  domain: string;
  description: string;
  componentsTotal: number;
  componentsCompleted: number;
  completionPercentage: number;
  masteryLevel: 'none' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastPracticed: Date;
}

/**
 * Study session data
 */
export interface StudySession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  componentsStudied: string[];
  questionsAnswered: number;
  correctAnswers: number;
  score: number;
  focusAreas: string[];
  notes?: string;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  accuracy: number; // percentage
  speed: number; // average time per question in seconds
  consistency: number; // variance in performance (0-100)
  improvement: number; // percentage improvement over time
  weakAreas: string[];
  strongAreas: string[];
  recommendedFocus: string[];
}

/**
 * Validation result for forms and inputs
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
  info?: ValidationInfo[];
}

/**
 * Validation error
 */
export interface ValidationError {
  field?: string;
  message: string;
  code: string;
  severity: 'error' | 'critical';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field?: string;
  message: string;
  code: string;
  suggestion?: string;
}

/**
 * Validation info
 */
export interface ValidationInfo {
  field?: string;
  message: string;
  code: string;
}

/**
 * Form field state
 */
export interface FieldState<T = string> {
  value: T;
  touched: boolean;
  dirty: boolean;
  error?: string;
  warning?: string;
  validating: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig<T = string> {
  field: T;
  direction: 'asc' | 'desc';
}

/**
 * Filter configuration
 */
export interface FilterConfig<T = string> {
  field: T;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: unknown;
}

/**
 * Search configuration
 */
export interface SearchConfig {
  query: string;
  fields: string[];
  caseSensitive: boolean;
  fuzzy: boolean;
  maxResults?: number;
}

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number; // 0-100
  message?: string;
  startTime?: Date;
}

/**
 * Error state
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorCode?: string;
  message?: string;
  timestamp?: Date;
  recoverable: boolean;
  retry?: () => void;
}

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // milliseconds
  action?: {
    label: string;
    handler: () => void;
  };
  timestamp: Date;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  title: string;
  content?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closable: boolean;
  onClose?: () => void;
}

/**
 * Keyboard shortcut
 */
export interface KeyboardShortcut {
  id: string;
  key: string;
  modifiers?: Array<'ctrl' | 'shift' | 'alt' | 'meta'>;
  description: string;
  handler: (event: KeyboardEvent) => void;
  enabled: boolean;
  global?: boolean;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  spacing: 'compact' | 'normal' | 'comfortable';
  borderRadius: number;
  animationsEnabled: boolean;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigationOnly: boolean;
  focusIndicatorEnhanced: boolean;
  textToSpeech: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

/**
 * Extended user preferences with all settings
 */
export interface ExtendedUserPreferences {
  theme: ThemeConfig;
  accessibility: AccessibilitySettings;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  learning: LearningPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  enabled: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'realtime' | 'daily' | 'weekly';
  categories: {
    progress: boolean;
    achievements: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  shareProgress: boolean;
  publicProfile: boolean;
  analyticsOptIn: boolean;
  thirdPartySharing: boolean;
}

/**
 * Learning preferences
 */
export interface LearningPreferences {
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  pace: 'slow' | 'moderate' | 'fast';
  focusAreas: string[];
  studyReminders: boolean;
  dailyGoal: number; // minutes
  preferredStudyTime: string;
}

/**
 * Cache entry
 */
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: Date;
  expiresAt?: Date;
  size?: number; // bytes
  hits: number;
}

/**
 * API response wrapper
 */
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    timestamp: Date;
    requestId: string;
    duration: number; // milliseconds
  };
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
  retryableErrors: string[];
}

/**
 * Debounce configuration
 */
export interface DebounceConfig {
  delayMs: number;
  maxWaitMs?: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Throttle configuration
 */
export interface ThrottleConfig {
  limitMs: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Feature flag
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  conditions?: FeatureFlagCondition[];
}

/**
 * Feature flag condition
 */
export interface FeatureFlagCondition {
  type: 'user' | 'group' | 'environment' | 'date' | 'custom';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
  value: unknown;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  eventName: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'html';
  fileName: string;
  includeMetadata: boolean;
  compression?: 'none' | 'gzip' | 'zip';
  fields?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Import result
 */
export interface ImportResult {
  success: boolean;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
  warnings: Array<{
    row: number;
    message: string;
  }>;
  duration: number; // milliseconds
}
