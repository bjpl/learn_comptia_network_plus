/**
 * CompTIA Network+ Learning Platform - Scoring Utilities
 * Comprehensive scoring algorithms for assessments and learning activities
 */

import type {
  AssessmentResult,
  ScoreBreakdown,
  DomainScore,
  Question,
} from '../types';

// ============================================================================
// Constants
// ============================================================================

/** Default passing percentage */
const DEFAULT_PASSING_PERCENTAGE = 70;

/** Point multipliers by difficulty */
const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0,
  expert: 2.5,
} as const;

/** Time bonus thresholds (seconds) */
const TIME_BONUS_THRESHOLDS = {
  fast: 30,      // < 30s: 10% bonus
  normal: 60,    // 30-60s: 5% bonus
  slow: 120,     // 60-120s: no bonus
};

// ============================================================================
// Core Scoring Functions
// ============================================================================

/**
 * Calculate total score from assessment results
 *
 * @param results - Array of assessment results
 * @param questions - Array of questions
 * @returns Score breakdown with detailed metrics
 *
 * @example
 * ```typescript
 * const results = [
 *   { questionId: '1', isCorrect: true, pointsEarned: 10, timeSpent: 25 },
 *   { questionId: '2', isCorrect: false, pointsEarned: 0, timeSpent: 45 }
 * ];
 * const score = calculateScore(results, questions);
 * console.log(score.percentage); // 50
 * ```
 */
export function calculateScore(
  results: AssessmentResult[],
  questions: Question[],
  passingPercentage: number = DEFAULT_PASSING_PERCENTAGE
): ScoreBreakdown {
  const totalQuestions = questions.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const incorrectAnswers = results.filter(r => !r.isCorrect && r.userAnswer !== null).length;
  const skippedQuestions = totalQuestions - results.length;

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const passed = percentage >= passingPercentage;

  const domainScores = calculateDomainScores(results, questions);

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions,
    totalPoints,
    earnedPoints,
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    passingScore: passingPercentage,
    passed,
    domainScores,
  };
}

/**
 * Calculate scores by domain
 *
 * @param results - Assessment results
 * @param questions - Questions array
 * @returns Array of domain-specific scores
 */
export function calculateDomainScores(
  results: AssessmentResult[],
  questions: Question[]
): DomainScore[] {
  const domainMap = new Map<string, {
    total: number;
    correct: number;
    questionIds: string[];
  }>();

  // Group questions by domain
  questions.forEach(q => {
    if (!domainMap.has(q.domain)) {
      domainMap.set(q.domain, {
        total: 0,
        correct: 0,
        questionIds: [],
      });
    }
    const domain = domainMap.get(q.domain)!;
    domain.total++;
    domain.questionIds.push(q.id);
  });

  // Count correct answers per domain
  results.forEach(r => {
    const question = questions.find(q => q.id === r.questionId);
    if (question && r.isCorrect) {
      const domain = domainMap.get(question.domain)!;
      domain.correct++;
    }
  });

  // Calculate percentages and identify weak areas
  return Array.from(domainMap.entries()).map(([domain, data]) => {
    const percentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    const weakAreas = percentage < 70
      ? identifyWeakAreas(domain, data.questionIds, results, questions)
      : [];

    return {
      domain,
      totalQuestions: data.total,
      correctAnswers: data.correct,
      percentage: Math.round(percentage * 10) / 10,
      weakAreas,
    };
  }).sort((a, b) => a.percentage - b.percentage); // Sort by weakest first
}

/**
 * Identify weak areas within a domain
 *
 * @param domain - Domain name
 * @param questionIds - Question IDs in domain
 * @param results - Assessment results
 * @param questions - Questions array
 * @returns Array of weak area descriptions
 */
function identifyWeakAreas(
  _domain: string,
  questionIds: string[],
  results: AssessmentResult[],
  questions: Question[]
): string[] {
  const objectiveMap = new Map<string, { correct: number; total: number }>();

  questionIds.forEach(qId => {
    const question = questions.find(q => q.id === qId);
    const result = results.find(r => r.questionId === qId);

    if (question) {
      if (!objectiveMap.has(question.objective)) {
        objectiveMap.set(question.objective, { correct: 0, total: 0 });
      }
      const obj = objectiveMap.get(question.objective)!;
      obj.total++;
      if (result?.isCorrect) {
        obj.correct++;
      }
    }
  });

  // Return objectives with < 60% accuracy
  return Array.from(objectiveMap.entries())
    .filter(([_, data]) => (data.correct / data.total) < 0.6)
    .map(([objective]) => objective);
}

// ============================================================================
// Advanced Scoring Functions
// ============================================================================

/**
 * Calculate score with difficulty multiplier
 *
 * @param basePoints - Base points for the question
 * @param difficulty - Question difficulty level
 * @returns Adjusted points
 *
 * @example
 * ```typescript
 * const points = calculateDifficultyPoints(10, 'advanced'); // 20
 * ```
 */
export function calculateDifficultyPoints(
  basePoints: number,
  difficulty: keyof typeof DIFFICULTY_MULTIPLIERS
): number {
  return Math.round(basePoints * DIFFICULTY_MULTIPLIERS[difficulty]);
}

/**
 * Calculate time bonus for fast responses
 *
 * @param timeSpent - Time spent in seconds
 * @param basePoints - Base points earned
 * @returns Bonus points
 *
 * @example
 * ```typescript
 * const bonus = calculateTimeBonus(25, 10); // 1 (10% bonus)
 * ```
 */
export function calculateTimeBonus(timeSpent: number, basePoints: number): number {
  if (timeSpent < TIME_BONUS_THRESHOLDS.fast) {
    return Math.round(basePoints * 0.1); // 10% bonus
  } else if (timeSpent < TIME_BONUS_THRESHOLDS.normal) {
    return Math.round(basePoints * 0.05); // 5% bonus
  }
  return 0;
}

/**
 * Calculate streak bonus for consecutive correct answers
 *
 * @param streakCount - Number of consecutive correct answers
 * @returns Multiplier (1.0 = no bonus)
 *
 * @example
 * ```typescript
 * const multiplier = calculateStreakBonus(5); // 1.15 (15% bonus)
 * ```
 */
export function calculateStreakBonus(streakCount: number): number {
  if (streakCount >= 10) {return 1.25;} // 25% bonus
  if (streakCount >= 5) {return 1.15;}  // 15% bonus
  if (streakCount >= 3) {return 1.05;}  // 5% bonus
  return 1.0;
}

/**
 * Calculate penalty for incorrect answers (optional)
 *
 * @param incorrectCount - Number of incorrect answers
 * @param totalPoints - Total points earned
 * @returns Penalty amount
 */
export function calculatePenalty(incorrectCount: number, totalPoints: number): number {
  const penaltyRate = 0.02; // 2% per incorrect answer
  return Math.round(totalPoints * penaltyRate * incorrectCount);
}

// ============================================================================
// Scoring Analysis Functions
// ============================================================================

/**
 * Calculate performance metrics
 *
 * @param results - Assessment results
 * @returns Performance metrics object
 */
export function calculatePerformanceMetrics(results: AssessmentResult[]): {
  avgTimePerQuestion: number;
  fastestResponse: number;
  slowestResponse: number;
  consistency: number; // 0-1, higher is more consistent
  accuracy: number; // 0-1
} {
  if (results.length === 0) {
    return {
      avgTimePerQuestion: 0,
      fastestResponse: 0,
      slowestResponse: 0,
      consistency: 0,
      accuracy: 0,
    };
  }

  const times = results.map(r => r.timeSpent);
  const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
  const fastestResponse = Math.min(...times);
  const slowestResponse = Math.max(...times);

  // Calculate consistency (standard deviation)
  const variance = times.reduce((sum, t) => sum + Math.pow(t - avgTime, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);
  const consistency = Math.max(0, 1 - (stdDev / avgTime)); // Normalized 0-1

  const accuracy = results.filter(r => r.isCorrect).length / results.length;

  return {
    avgTimePerQuestion: Math.round(avgTime * 10) / 10,
    fastestResponse,
    slowestResponse,
    consistency: Math.round(consistency * 100) / 100,
    accuracy: Math.round(accuracy * 100) / 100,
  };
}

/**
 * Generate performance grade (A+ to F)
 *
 * @param percentage - Score percentage
 * @returns Letter grade
 *
 * @example
 * ```typescript
 * const grade = getLetterGrade(95); // "A+"
 * ```
 */
export function getLetterGrade(percentage: number): string {
  if (percentage >= 97) {return 'A+';}
  if (percentage >= 93) {return 'A';}
  if (percentage >= 90) {return 'A-';}
  if (percentage >= 87) {return 'B+';}
  if (percentage >= 83) {return 'B';}
  if (percentage >= 80) {return 'B-';}
  if (percentage >= 77) {return 'C+';}
  if (percentage >= 73) {return 'C';}
  if (percentage >= 70) {return 'C-';}
  if (percentage >= 67) {return 'D+';}
  if (percentage >= 63) {return 'D';}
  if (percentage >= 60) {return 'D-';}
  return 'F';
}

/**
 * Calculate CompTIA Network+ exam readiness score
 *
 * @param domainScores - Scores by domain
 * @returns Readiness percentage (0-100)
 */
export function calculateExamReadiness(domainScores: DomainScore[]): number {
  if (domainScores.length === 0) {return 0;}

  // CompTIA requires proficiency across all domains
  const minDomainScore = Math.min(...domainScores.map(d => d.percentage));
  const avgDomainScore = domainScores.reduce((sum, d) => sum + d.percentage, 0) / domainScores.length;

  // Readiness is weighted: 60% average, 40% weakest domain
  const readiness = (avgDomainScore * 0.6) + (minDomainScore * 0.4);

  return Math.round(readiness * 10) / 10;
}

// ============================================================================
// Export Utilities
// ============================================================================

/**
 * Generate a detailed score report
 *
 * @param results - Assessment results
 * @param questions - Questions array
 * @returns Formatted score report string
 */
export function generateScoreReport(
  results: AssessmentResult[],
  questions: Question[]
): string {
  const score = calculateScore(results, questions);
  const metrics = calculatePerformanceMetrics(results);
  const grade = getLetterGrade(score.percentage);
  const readiness = calculateExamReadiness(score.domainScores);

  return `
📊 ASSESSMENT REPORT
${'='.repeat(50)}

Overall Performance: ${grade} (${score.percentage}%)
Status: ${score.passed ? '✅ PASSED' : '❌ FAILED'}

Questions:
  • Total: ${score.totalQuestions}
  • Correct: ${score.correctAnswers}
  • Incorrect: ${score.incorrectAnswers}
  • Skipped: ${score.skippedQuestions}

Points:
  • Earned: ${score.earnedPoints} / ${score.totalPoints}
  • Passing Score: ${score.passingScore}%

Performance Metrics:
  • Avg Time: ${metrics.avgTimePerQuestion}s per question
  • Fastest: ${metrics.fastestResponse}s
  • Slowest: ${metrics.slowestResponse}s
  • Consistency: ${(metrics.consistency * 100).toFixed(0)}%
  • Accuracy: ${(metrics.accuracy * 100).toFixed(0)}%

Exam Readiness: ${readiness}%

Domain Performance:
${score.domainScores.map(d => `
  ${d.domain}: ${d.percentage}% (${d.correctAnswers}/${d.totalQuestions})
  ${d.weakAreas.length > 0 ? `  ⚠️ Weak Areas: ${d.weakAreas.join(', ')}` : '  ✅ Strong'}
`).join('\n')}

${'='.repeat(50)}
  `.trim();
}

export default {
  calculateScore,
  calculateDomainScores,
  calculateDifficultyPoints,
  calculateTimeBonus,
  calculateStreakBonus,
  calculatePenalty,
  calculatePerformanceMetrics,
  getLetterGrade,
  calculateExamReadiness,
  generateScoreReport,
};
