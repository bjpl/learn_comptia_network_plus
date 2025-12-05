/**
 * Custom hook for connector identification progress tracking
 * Manages quiz state, scoring, and progress
 */

import { useState, useCallback, useMemo } from 'react';
import type { ConnectorType } from '../media-types';

export interface ConnectorQuestion {
  connectorId: ConnectorType;
  options: ConnectorType[];
}

export interface UseIdentificationProgressReturn {
  // Quiz state
  currentQuestionIndex: number;
  selectedAnswer: ConnectorType | null;
  showResult: boolean;
  score: number;
  answeredQuestions: Set<number>;

  // Computed
  progressPercentage: number;
  isComplete: boolean;

  // Handlers
  handleAnswerSelect: (answer: ConnectorType) => void;
  handleSubmit: (correctAnswer: ConnectorType) => void;
  handleNext: (totalQuestions: number) => void;
  handlePrevious: () => void;
  handleRestartQuiz: () => void;
}

export function useIdentificationProgress(totalQuestions: number): UseIdentificationProgressReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<ConnectorType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const progressPercentage = useMemo(
    () => (answeredQuestions.size / totalQuestions) * 100,
    [answeredQuestions.size, totalQuestions]
  );

  const isComplete = useMemo(
    () => answeredQuestions.size === totalQuestions,
    [answeredQuestions.size, totalQuestions]
  );

  const handleAnswerSelect = useCallback((answer: ConnectorType) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  }, [showResult]);

  const handleSubmit = useCallback((correctAnswer: ConnectorType) => {
    if (!selectedAnswer) return;

    setShowResult(true);
    if (selectedAnswer === correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
  }, [selectedAnswer, currentQuestionIndex]);

  const handleNext = useCallback((total: number) => {
    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestionIndex]);

  const handleRestartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Set());
  }, []);

  return {
    currentQuestionIndex,
    selectedAnswer,
    showResult,
    score,
    answeredQuestions,
    progressPercentage,
    isComplete,
    handleAnswerSelect,
    handleSubmit,
    handleNext,
    handlePrevious,
    handleRestartQuiz,
  };
}
