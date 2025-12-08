/**
 * Type definitions for ConnectorIdentification component
 */

import type { ConnectorType, Pin } from '../media-types';

export interface ConnectorQuestion {
  connectorId: ConnectorType;
  options: ConnectorType[];
}

export interface WiringChallenge {
  standard: 'T568A' | 'T568B';
  currentOrder: Pin[];
  correctOrder: Pin[];
}

export interface TerminationStep {
  id: number;
  title: string;
  description: string;
  tip: string;
  commonMistakes: string[];
}

export interface UseCaseScenario {
  id: string;
  scenario: string;
  correctConnector: ConnectorType;
  incorrectConnectors: ConnectorType[];
  explanation: string;
}

export interface ConnectorState {
  activeTab: string;
  currentQuestionIndex: number;
  selectedAnswer: ConnectorType | null;
  showResult: boolean;
  score: number;
  answeredQuestions: Set<number>;
}

export interface WiringState {
  wiringStandard: 'T568A' | 'T568B';
  draggedWires: Pin[];
  wiringComplete: boolean;
  wiringAttempts: number;
}

export interface TerminationState {
  terminationStep: number;
  terminationComplete: boolean;
}

export interface ScenarioState {
  currentScenario: number;
  selectedConnectorCase: ConnectorType | null;
  scenarioResult: boolean | null;
  scenarioScore: number;
}
