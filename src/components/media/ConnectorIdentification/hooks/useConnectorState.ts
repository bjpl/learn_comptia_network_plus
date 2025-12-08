/**
 * Hook for managing connector identification state
 */

import { useState, useMemo } from 'react';
import type { ConnectorType } from '../../media-types';
import type { ConnectorState, WiringState, TerminationState, ScenarioState } from '../types';
import { generateQuestions } from '../data/connectorDatabase';

export function useConnectorState() {
  // Quiz state
  const [activeTab, setActiveTab] = useState('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ConnectorType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Generate questions once
  const questions = useMemo(() => generateQuestions(), []);

  const quizState: ConnectorState = {
    activeTab,
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    answeredQuestions,
  };

  // Quiz actions
  const handleAnswerSelect = (answer: ConnectorType) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setShowResult(true);
    if (selectedAnswer === questions[currentQuestionIndex].connectorId) {
      setScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  };

  return {
    activeTab,
    setActiveTab,
    questions,
    quizState,
    handleAnswerSelect,
    handleSubmit,
    handleNext,
    handlePrevious,
    handleRestartQuiz,
  };
}

export function useWiringState() {
  const [wiringStandard, setWiringStandard] = useState<'T568A' | 'T568B'>('T568B');
  const [draggedWires, setDraggedWires] = useState<import('../../media-types').Pin[]>([]);
  const [wiringComplete, setWiringComplete] = useState(false);
  const [wiringAttempts, setWiringAttempts] = useState(0);

  const state: WiringState = {
    wiringStandard,
    draggedWires,
    wiringComplete,
    wiringAttempts,
  };

  return {
    state,
    setWiringStandard,
    setDraggedWires,
    setWiringComplete,
    setWiringAttempts,
  };
}

export function useTerminationState() {
  const [terminationStep, setTerminationStep] = useState(0);
  const [terminationComplete, setTerminationComplete] = useState(false);

  const state: TerminationState = {
    terminationStep,
    terminationComplete,
  };

  return {
    state,
    setTerminationStep,
    setTerminationComplete,
  };
}

export function useScenarioState() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedConnectorCase, setSelectedConnectorCase] = useState<ConnectorType | null>(null);
  const [scenarioResult, setScenarioResult] = useState<boolean | null>(null);
  const [scenarioScore, setScenarioScore] = useState(0);

  const state: ScenarioState = {
    currentScenario,
    selectedConnectorCase,
    scenarioResult,
    scenarioScore,
  };

  return {
    state,
    setCurrentScenario,
    setSelectedConnectorCase,
    setScenarioResult,
    setScenarioScore,
  };
}
