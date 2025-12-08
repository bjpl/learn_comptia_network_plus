/**
 * Type definitions for protocol and port components
 * Comprehensive types for PortProtocolTrainer and PortScanner
 */

// Import types for use in this file
import type {
  ProtocolType as ProtocolTypeImport,
  SecurityLevel as SecurityLevelImport,
  ScanResult as ScanResultImport,
} from '../components/protocols/protocols-types';

import type {
  PortCard as PortCardImport,
  CardProgress as CardProgressImport,
  Achievement as AchievementImport,
  TrainingMode as TrainingModeImport,
} from '../components/protocols/PortProtocolTrainer/types';

// Re-export existing protocol types
export type {
  ProtocolType,
  SecurityLevel,
  ProtocolPort,
  Protocol,
  IPProtocol,
  TrafficType,
  ScanResult,
  VirtualNetwork,
  FlashCard,
  TrafficAnimationState,
  ScannerState,
} from '../components/protocols/protocols-types';

// Re-export PortProtocolTrainer types
export type {
  PortCard,
  CardProgress,
  QuizQuestion,
  QuizResult,
  Achievement,
  TrainingStats,
  TrainingMode,
} from '../components/protocols/PortProtocolTrainer/types';

// Type aliases for internal use
type ProtocolType = ProtocolTypeImport;
type SecurityLevel = SecurityLevelImport;
type ScanResult = ScanResultImport;
type PortCard = PortCardImport;
type CardProgress = CardProgressImport;
type Achievement = AchievementImport;
type TrainingMode = TrainingModeImport;

/**
 * Port definition for protocol learning
 */
export interface PortDefinition {
  port: number;
  protocol: ProtocolType;
  service: string;
  description: string;
  security: SecurityLevel;
  category: 'well-known' | 'registered' | 'dynamic';
  examCritical: boolean;
  alternatives?: number[]; // alternative ports for same service
  relatedPorts?: number[]; // related services
}

/**
 * Protocol information with detailed specifications
 */
export interface ProtocolInfo {
  name: string;
  fullName: string;
  type: ProtocolType;
  ports: number[];
  layer: 2 | 3 | 4 | 7; // OSI layer
  rfc?: string[];
  description: string;
  useCase: string;
  advantages: string[];
  disadvantages: string[];
  security: {
    level: SecurityLevel;
    vulnerabilities: string[];
    bestPractices: string[];
    encryptedAlternative?: string;
  };
  performance: {
    overhead: 'low' | 'medium' | 'high';
    latency: 'low' | 'medium' | 'high';
    throughput: 'low' | 'medium' | 'high';
  };
}

/**
 * Port scan configuration
 */
export interface PortScanConfig {
  targetHost: string;
  portRange: {
    start: number;
    end: number;
  };
  scanType: 'tcp' | 'udp' | 'both';
  timeout: number; // milliseconds
  maxConcurrent: number;
  detectVersion: boolean;
  detectOS: boolean;
}

/**
 * Extended scan result with vulnerability info
 */
export interface ExtendedScanResult extends ScanResult {
  banner?: string;
  osFingerprint?: string;
  vulnerabilities: VulnerabilityInfo[];
  lastSeen: Date;
  responseTime: number; // milliseconds
}

/**
 * Vulnerability information
 */
export interface VulnerabilityInfo {
  id: string; // CVE ID
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvssScore: number;
  published: Date;
  references: string[];
  mitigation: string;
}

/**
 * Training session data
 */
export interface TrainingSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  mode: TrainingMode;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number; // milliseconds
  progress: CardProgress[];
  achievements: Achievement[];
  score: number;
}

/**
 * Spaced repetition configuration (Leitner system)
 */
export interface SpacedRepetitionConfig {
  boxes: number; // typically 5 boxes (0-4)
  intervals: number[]; // review intervals in days [1, 3, 7, 14, 30]
  promotionThreshold: number; // correct answers needed to advance
  demotionOnError: boolean;
  graduationBox: number; // box number considered "mastered"
}

/**
 * Learning analytics
 */
export interface LearningAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  totalSessions: number;
  totalTime: number; // minutes
  cardsStudied: number;
  masteredCards: number;
  accuracy: number; // percentage
  improvementRate: number; // percentage per week
  weakAreas: WeakArea[];
  strengths: string[];
  recommendations: string[];
}

/**
 * Weak area identification
 */
export interface WeakArea {
  category: string;
  accuracy: number;
  attempts: number;
  cards: PortCard[];
  suggestedFocus: string;
}

/**
 * Mnemonic device for memorization
 */
export interface MnemonicDevice {
  portNumber: number;
  protocol: string;
  mnemonic: string;
  type: 'acronym' | 'rhyme' | 'story' | 'visual' | 'association';
  description: string;
  effectiveness: number; // 0-100
  userRating?: number;
}

/**
 * Quiz generation options
 */
export interface QuizGenerationOptions {
  questionCount: number;
  questionTypes: Array<'port-to-protocol' | 'protocol-to-port' | 'security' | 'tcp-udp' | 'use-case'>;
  difficulty: 'easy' | 'medium' | 'hard';
  focusAreas?: string[];
  excludeMastered: boolean;
  includeExamCritical: boolean;
}

/**
 * Network protocol comparison
 */
export interface ProtocolComparison {
  protocols: string[];
  dimensions: ComparisonDimension[];
  winner: {
    overall: string;
    byDimension: Record<string, string>;
  };
  useCaseRecommendations: UseCaseRecommendation[];
}

/**
 * Comparison dimension
 */
export interface ComparisonDimension {
  name: string;
  values: Record<string, number>; // protocol name -> score
  weight: number;
  description: string;
}

/**
 * Use case recommendation
 */
export interface UseCaseRecommendation {
  useCase: string;
  recommended: string;
  reasoning: string;
  alternatives: string[];
}

/**
 * Port scanner progress
 */
export interface ScanProgress {
  totalPorts: number;
  scannedPorts: number;
  openPorts: number;
  closedPorts: number;
  filteredPorts: number;
  currentPort: number;
  estimatedTimeRemaining: number; // seconds
  scanRate: number; // ports per second
}
