/**
 * Hook for tracking identification progress metrics
 */

import { useMemo } from 'react';
import type { ConnectorState, ScenarioState } from '../types';
import { USE_CASE_SCENARIOS } from '../constants';

export function useIdentificationProgress(
  quizState: ConnectorState,
  scenarioState: ScenarioState,
  totalQuestions: number
) {
  const progressMetrics = useMemo(() => {
    const { score, answeredQuestions } = quizState;
    const { scenarioScore } = scenarioState;

    const quizProgress = (answeredQuestions.size / totalQuestions) * 100;
    const quizPercentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const isQuizComplete = answeredQuestions.size === totalQuestions;

    const scenarioPercentage =
      USE_CASE_SCENARIOS.length > 0
        ? (scenarioScore / USE_CASE_SCENARIOS.length) * 100
        : 0;

    const overallProgress =
      ((score + scenarioScore) / (totalQuestions + USE_CASE_SCENARIOS.length)) * 100;

    return {
      quizProgress,
      quizPercentage,
      isQuizComplete,
      scenarioPercentage,
      overallProgress: Math.round(overallProgress),
    };
  }, [quizState, scenarioState, totalQuestions]);

  return progressMetrics;
}
