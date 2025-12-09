/**
 * Quiz score calculation utilities
 */

import type { QuizState, QuizScore, Domain, Difficulty } from '../../quiz-types';

export const calculateScore = (quizState: QuizState | null, timeElapsed: number): QuizScore => {
  if (!quizState) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedQuestions: 0,
      percentage: 0,
      passingScore: 720,
      passed: false,
      timeSpent: 0,
      domainBreakdown: [],
      difficultyBreakdown: [],
    };
  }

  const correctAnswers = quizState.answers.filter((a) => a.isCorrect).length;
  const incorrectAnswers = quizState.answers.filter((a) => !a.isCorrect).length;
  const percentage = (correctAnswers / quizState.questions.length) * 100;
  const scaledScore = (percentage / 100) * 900;

  // Domain breakdown
  const domainScores = new Map();
  quizState.questions.forEach((q, index) => {
    if (!domainScores.has(q.domain)) {
      domainScores.set(q.domain, { total: 0, correct: 0, domainName: q.domainName });
    }
    const stats = domainScores.get(q.domain);
    stats.total++;
    if (quizState.answers[index]?.isCorrect) {
      stats.correct++;
    }
  });

  const domainBreakdown = Array.from(domainScores.entries()).map(
    ([domain, stats]: [string, { total: number; correct: number; domainName: string }]) => ({
      domain: domain as Domain,
      domainName: stats.domainName,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      percentage: (stats.correct / stats.total) * 100,
    })
  );

  // Difficulty breakdown
  const difficultyScores = new Map();
  quizState.questions.forEach((q, index) => {
    if (!difficultyScores.has(q.difficulty)) {
      difficultyScores.set(q.difficulty, { total: 0, correct: 0 });
    }
    const stats = difficultyScores.get(q.difficulty);
    stats.total++;
    if (quizState.answers[index]?.isCorrect) {
      stats.correct++;
    }
  });

  const difficultyBreakdown = Array.from(difficultyScores.entries()).map(
    ([difficulty, stats]: [string, { total: number; correct: number }]) => ({
      difficulty: difficulty as Difficulty,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      percentage: (stats.correct / stats.total) * 100,
    })
  );

  return {
    totalQuestions: quizState.questions.length,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions: 0,
    percentage,
    passingScore: 720,
    passed: scaledScore >= 720,
    timeSpent: timeElapsed,
    domainBreakdown,
    difficultyBreakdown,
  };
};
