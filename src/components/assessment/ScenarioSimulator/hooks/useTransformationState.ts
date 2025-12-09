/**
 * State management hook for ScenarioSimulator
 */

import { useState, useEffect, useCallback } from 'react';
import { integratedScenarios } from '../../assessment-data';
import type {
  IntegratedScenario,
  ScenarioAttempt,
  UserAnswer,
  ScoreAnalysis,
  ExamMode,
} from '../types';
import { calculateScoreAnalysis } from '../utils/scoreAnalysis';

interface UseTransformationStateParams {
  scenarioId?: string;
  timeLimit?: number;
  examMode: ExamMode;
  onComplete?: (attempt: ScenarioAttempt) => void;
  onAnalysis?: (analysis: ScoreAnalysis) => void;
}

export const useTransformationState = ({
  scenarioId,
  timeLimit,
  examMode,
  onComplete,
  onAnalysis,
}: UseTransformationStateParams) => {
  const [selectedScenario, setSelectedScenario] = useState<IntegratedScenario | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [startTime] = useState(new Date());
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
  const [scored, setScored] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoreAnalysis, setScoreAnalysis] = useState<ScoreAnalysis | null>(null);

  const handleComplete = useCallback(() => {
    if (!selectedScenario) {
      return;
    }

    const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
    const analysis = calculateScoreAnalysis(answers, selectedScenario);

    setScoreAnalysis(analysis);
    setShowResults(true);
    onAnalysis?.(analysis);

    const attempt: ScenarioAttempt = {
      scenarioId: selectedScenario.id,
      startTime,
      endTime: new Date(),
      currentPhase: currentPhaseIndex,
      answers,
      totalScore,
      maxScore: selectedScenario.totalPoints,
      status: 'completed',
    };

    onComplete?.(attempt);
  }, [
    selectedScenario,
    answers,
    currentPhaseIndex,
    startTime,
    onComplete,
    onAnalysis,
  ]);

  useEffect(() => {
    if (scenarioId) {
      const scenario = integratedScenarios.find((s) => s.id === scenarioId);
      if (scenario) {
        setSelectedScenario(scenario);
      }
    }
  }, [scenarioId]);

  // Timer for timed exam mode
  useEffect(() => {
    let timer: number | undefined;

    if (examMode === 'timed' && examStarted && timeRemaining > 0) {
      timer = window.setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
    } else if (timeRemaining === 0 && examStarted && examMode === 'timed') {
      handleComplete();
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [timeRemaining, examStarted, examMode, handleComplete]);

  const handleAnswerChange = (assessmentPointId: string, value: string): void => {
    setCurrentAnswers((prev) => ({
      ...prev,
      [assessmentPointId]: value,
    }));
  };

  const resetState = useCallback(() => {
    setCurrentPhaseIndex(0);
    setAnswers([]);
    setCurrentAnswers({});
    setScored(false);
    setShowResults(false);
    setScoreAnalysis(null);
    setExamStarted(false);
    setTimeRemaining(timeLimit || 0);
  }, [timeLimit]);

  return {
    selectedScenario,
    setSelectedScenario,
    currentPhaseIndex,
    setCurrentPhaseIndex,
    answers,
    setAnswers,
    showHints,
    setShowHints,
    currentAnswers,
    setCurrentAnswers,
    scored,
    setScored,
    timeRemaining,
    setTimeRemaining,
    examStarted,
    setExamStarted,
    showResults,
    setShowResults,
    scoreAnalysis,
    setScoreAnalysis,
    handleComplete,
    handleAnswerChange,
    resetState,
  };
};
