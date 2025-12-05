/**
 * Custom hook for IPv6 Planner state management
 * Consolidates all state and handlers for the IPv6 Planner component
 */

import { useState, useCallback } from 'react';
import type {
  IPv6MigrationScenario,
  MigrationMethod,
  MigrationPlan,
} from '../modern-types';
import type { SubnettingResult } from '../utils/ipv6Calculations';

export type IPv6Tab = 'migration' | 'fundamentals' | 'subnetting' | 'practice';

export interface UseIPv6StateReturn {
  // Tab state
  activeTab: IPv6Tab;
  setActiveTab: (tab: IPv6Tab) => void;

  // Migration state
  selectedScenario: IPv6MigrationScenario | null;
  setSelectedScenario: (scenario: IPv6MigrationScenario | null) => void;
  selectedMethod: MigrationMethod;
  setSelectedMethod: (method: MigrationMethod) => void;
  migrationPlan: MigrationPlan | null;
  setMigrationPlan: (plan: MigrationPlan | null) => void;
  activePhase: number;
  setActivePhase: (phase: number) => void;

  // Subnetting state
  subnettingInput: string;
  setSubnettingInput: (input: string) => void;
  subnettingResult: SubnettingResult | null;
  setSubnettingResult: (result: SubnettingResult | null) => void;

  // Quiz state
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  answers: number[];
  setAnswers: (answers: number[]) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;

  // Quiz handlers
  handleAnswerSelect: (optionIndex: number) => void;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  resetQuiz: () => void;
  calculateScore: (totalQuestions: number) => number;
}

export function useIPv6State(): UseIPv6StateReturn {
  // Tab state
  const [activeTab, setActiveTab] = useState<IPv6Tab>('migration');

  // Migration state
  const [selectedScenario, setSelectedScenario] = useState<IPv6MigrationScenario | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MigrationMethod>('dual-stack');
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(null);
  const [activePhase, setActivePhase] = useState<number>(0);

  // Subnetting state
  const [subnettingInput, setSubnettingInput] = useState<string>('2001:db8::/32');
  const [subnettingResult, setSubnettingResult] = useState<SubnettingResult | null>(null);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Quiz handlers
  const handleAnswerSelect = useCallback((optionIndex: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = optionIndex;
      return newAnswers;
    });
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestion((prev) => prev + 1);
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  }, []);

  const calculateScore = useCallback((totalQuestions: number): number => {
    return Math.round((answers.filter((_, idx) => answers[idx] !== undefined).length / totalQuestions) * 100);
  }, [answers]);

  return {
    activeTab,
    setActiveTab,
    selectedScenario,
    setSelectedScenario,
    selectedMethod,
    setSelectedMethod,
    migrationPlan,
    setMigrationPlan,
    activePhase,
    setActivePhase,
    subnettingInput,
    setSubnettingInput,
    subnettingResult,
    setSubnettingResult,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
    showResults,
    setShowResults,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    resetQuiz,
    calculateScore,
  };
}
