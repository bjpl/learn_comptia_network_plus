/**
 * CompTIA Network+ Learning Platform - Scoring Hook
 * React hook for managing assessment scoring and results
 */

import { useState, useCallback, useMemo } from 'react';
import type { AssessmentResult, ScoreBreakdown, Question } from '../types';
import {
  calculateScore,
  calculateDifficultyPoints,
  calculateTimeBonus,
  calculateStreakBonus,
  calculatePerformanceMetrics,
  getLetterGrade,
  calculateExamReadiness,
  generateScoreReport,
} from '../utils/scoring';

// ============================================================================
// Types
// ============================================================================

interface UseScoringOptions {
  questions: Question[];
  passingPercentage?: number;
  enableBonuses?: boolean;
  enablePenalties?: boolean;
}

interface UseScoringReturn {
  results: AssessmentResult[];
  scoreBreakdown: ScoreBreakdown | null;
  currentStreak: number;
  addResult: (result: AssessmentResult) => void;
  removeResult: (questionId: string) => void;
  clearResults: () => void;
  calculateFinalScore: () => ScoreBreakdown;
  getQuestionResult: (questionId: string) => AssessmentResult | undefined;
  isQuestionAnswered: (questionId: string) => boolean;
  getPerformanceMetrics: () => ReturnType<typeof calculatePerformanceMetrics>;
  getLetterGrade: () => string;
  getExamReadiness: () => number;
  generateReport: () => string;
  applyBonuses: boolean;
  setApplyBonuses: (apply: boolean) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing assessment scoring
 *
 * @param options - Scoring configuration
 * @returns Scoring state and utility functions
 *
 * @example
 * ```typescript
 * const {
 *   results,
 *   scoreBreakdown,
 *   addResult,
 *   calculateFinalScore
 * } = useScoring({
 *   questions: assessmentQuestions,
 *   passingPercentage: 70,
 *   enableBonuses: true
 * });
 *
 * // Add a result
 * addResult({
 *   questionId: 'q1',
 *   userAnswer: 'A',
 *   isCorrect: true,
 *   pointsEarned: 10,
 *   timeSpent: 25,
 *   timestamp: new Date()
 * });
 *
 * // Calculate final score
 * const finalScore = calculateFinalScore();
 * console.log(`Score: ${finalScore.percentage}%`);
 * ```
 */
export function useScoring(options: UseScoringOptions): UseScoringReturn {
  const { questions, passingPercentage = 70, enableBonuses = true } = options;

  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [applyBonuses, setApplyBonuses] = useState(enableBonuses);

  // Calculate score breakdown (memoized)
  const scoreBreakdown = useMemo(() => {
    if (results.length === 0) {
      return null;
    }
    return calculateScore(results, questions, passingPercentage);
  }, [results, questions, passingPercentage]);

  // Add a result
  const addResult = useCallback(
    (result: AssessmentResult) => {
      setResults((prev) => {
        // Remove existing result for this question if any
        const filtered = prev.filter((r) => r.questionId !== result.questionId);

        // Update streak
        if (result.isCorrect) {
          setCurrentStreak((s) => s + 1);
        } else {
          setCurrentStreak(0);
        }

        // Apply bonuses if enabled
        let finalResult = { ...result };
        if (applyBonuses) {
          const question = questions.find((q) => q.id === result.questionId);
          if (question && result.isCorrect) {
            // Apply difficulty multiplier
            const basePoints = question.points;
            const difficultyPoints = calculateDifficultyPoints(basePoints, question.difficulty);

            // Apply time bonus
            const timeBonus = calculateTimeBonus(result.timeSpent, difficultyPoints);

            // Apply streak bonus
            const streakMultiplier = calculateStreakBonus(currentStreak);

            // Calculate final points
            const totalPoints = Math.round((difficultyPoints + timeBonus) * streakMultiplier);

            finalResult = {
              ...result,
              pointsEarned: totalPoints,
            };
          }
        }

        return [...filtered, finalResult];
      });
    },
    [questions, currentStreak, applyBonuses]
  );

  // Remove a result
  const removeResult = useCallback((questionId: string) => {
    setResults((prev) => prev.filter((r) => r.questionId !== questionId));
  }, []);

  // Clear all results
  const clearResults = useCallback(() => {
    setResults([]);
    setCurrentStreak(0);
  }, []);

  // Calculate final score
  const calculateFinalScore = useCallback(() => {
    return calculateScore(results, questions, passingPercentage);
  }, [results, questions, passingPercentage]);

  // Get result for specific question
  const getQuestionResult = useCallback(
    (questionId: string) => {
      return results.find((r) => r.questionId === questionId);
    },
    [results]
  );

  // Check if question is answered
  const isQuestionAnswered = useCallback(
    (questionId: string) => {
      return results.some((r) => r.questionId === questionId);
    },
    [results]
  );

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return calculatePerformanceMetrics(results);
  }, [results]);

  // Get letter grade
  const getLetterGradeValue = useCallback(() => {
    if (!scoreBreakdown) {
      return 'N/A';
    }
    return getLetterGrade(scoreBreakdown.percentage);
  }, [scoreBreakdown]);

  // Get exam readiness
  const getExamReadinessValue = useCallback(() => {
    if (!scoreBreakdown) {
      return 0;
    }
    return calculateExamReadiness(scoreBreakdown.domainScores);
  }, [scoreBreakdown]);

  // Generate report
  const generateReportValue = useCallback(() => {
    return generateScoreReport(results, questions);
  }, [results, questions]);

  return {
    results,
    scoreBreakdown,
    currentStreak,
    addResult,
    removeResult,
    clearResults,
    calculateFinalScore,
    getQuestionResult,
    isQuestionAnswered,
    getPerformanceMetrics,
    getLetterGrade: getLetterGradeValue,
    getExamReadiness: getExamReadinessValue,
    generateReport: generateReportValue,
    applyBonuses,
    setApplyBonuses,
  };
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook for real-time score calculation
 *
 * @param results - Current results
 * @param questions - Questions array
 * @returns Real-time score percentage
 */
export function useRealtimeScore(results: AssessmentResult[]): number {
  return useMemo(() => {
    if (results.length === 0) {
      return 0;
    }
    const correct = results.filter((r) => r.isCorrect).length;
    return Math.round((correct / results.length) * 100);
  }, [results]);
}

/**
 * Hook for tracking answer streak
 *
 * @param results - Current results
 * @returns Current correct answer streak
 */
export function useAnswerStreak(results: AssessmentResult[]): {
  current: number;
  max: number;
} {
  return useMemo(() => {
    let current = 0;
    let max = 0;
    let temp = 0;

    // Calculate from end (most recent)
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].isCorrect) {
        temp++;
        if (i === results.length - 1) {
          current = temp;
        }
        max = Math.max(max, temp);
      } else {
        temp = 0;
      }
    }

    return { current, max };
  }, [results]);
}

/**
 * Hook for domain-specific progress
 *
 * @param results - Current results
 * @param questions - Questions array
 * @param domain - Domain to track
 * @returns Domain progress percentage
 */
export function useDomainProgress(
  results: AssessmentResult[],
  questions: Question[],
  domain: string
): number {
  return useMemo(() => {
    const domainQuestions = questions.filter((q) => q.domain === domain);
    if (domainQuestions.length === 0) {
      return 0;
    }

    const domainResults = results.filter((r) => domainQuestions.some((q) => q.id === r.questionId));

    const correct = domainResults.filter((r) => r.isCorrect).length;
    return Math.round((correct / domainQuestions.length) * 100);
  }, [results, questions, domain]);
}

/**
 * Hook for time tracking
 *
 * @param results - Current results
 * @returns Time statistics
 */
export function useTimeTracking(results: AssessmentResult[]): {
  totalTime: number;
  avgTime: number;
  fastestTime: number;
  slowestTime: number;
} {
  return useMemo(() => {
    if (results.length === 0) {
      return {
        totalTime: 0,
        avgTime: 0,
        fastestTime: 0,
        slowestTime: 0,
      };
    }

    const times = results.map((r) => r.timeSpent);
    const totalTime = times.reduce((sum, t) => sum + t, 0);
    const avgTime = totalTime / times.length;
    const fastestTime = Math.min(...times);
    const slowestTime = Math.max(...times);

    return {
      totalTime: Math.round(totalTime),
      avgTime: Math.round(avgTime),
      fastestTime,
      slowestTime,
    };
  }, [results]);
}

/**
 * Hook for score prediction
 *
 * @param results - Current results
 * @param totalQuestions - Total number of questions
 * @returns Predicted final score if all remaining questions are correct/incorrect
 */
export function useScorePrediction(
  results: AssessmentResult[],
  totalQuestions: number
): {
  bestCase: number;
  worstCase: number;
  current: number;
} {
  return useMemo(() => {
    const answered = results.length;
    const correct = results.filter((r) => r.isCorrect).length;
    const remaining = totalQuestions - answered;

    const current = answered > 0 ? (correct / answered) * 100 : 0;
    const bestCase = ((correct + remaining) / totalQuestions) * 100;
    const worstCase = (correct / totalQuestions) * 100;

    return {
      bestCase: Math.round(bestCase),
      worstCase: Math.round(worstCase),
      current: Math.round(current),
    };
  }, [results, totalQuestions]);
}

export default useScoring;
