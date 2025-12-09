/**
 * Score calculation and analysis utilities
 */

import type { AssessmentPoint } from '../../assessment-types';
import type { IntegratedScenario, UserAnswer, ScoreAnalysis, QuestionType } from '../types';

export const calculateScoreAnalysis = (
  allAnswers: UserAnswer[],
  scenario: IntegratedScenario
): ScoreAnalysis => {
  const byPhase = scenario.phases.map((phase) => ({
    phaseId: phase.id,
    score: allAnswers
      .filter((a) => a.phaseId === phase.id)
      .reduce((sum, a) => sum + (a.score || 0), 0),
    maxScore: phase.assessmentPoints.reduce((sum, ap) => sum + ap.maxScore, 0),
  }));

  const byType = [
    { type: 'multiple-choice' as const, score: 0, maxScore: 0 },
    { type: 'simulation' as const, score: 0, maxScore: 0 },
    { type: 'performance' as const, score: 0, maxScore: 0 },
    { type: 'essay' as const, score: 0, maxScore: 0 },
  ];

  const totalScore = allAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
  const maxScore = scenario.totalPoints;
  const percentage = (totalScore / maxScore) * 100;

  const passStatus =
    percentage >= 80 ? 'pass-with-distinction' : percentage >= 70 ? 'pass' : 'fail';

  return { totalScore, maxScore, percentage, byPhase, byType, passStatus };
};

export const scoreAnswer = (
  assessmentPoint: AssessmentPoint,
  answer: string
): { score: number; feedback: string } => {
  const answerLower = answer.toLowerCase();
  const criteriaCount = assessmentPoint.criteria.length;
  let matchedCriteria = 0;
  const matchedPoints: string[] = [];

  assessmentPoint.criteria.forEach((criterion) => {
    const keywords = criterion
      .toLowerCase()
      .split(' ')
      .filter((w) => w.length > 3);
    const matches = keywords.filter((kw) => answerLower.includes(kw));
    if (matches.length >= Math.max(1, keywords.length * 0.3)) {
      matchedCriteria++;
      matchedPoints.push(criterion);
    }
  });

  const score = Math.round((matchedCriteria / criteriaCount) * assessmentPoint.maxScore);

  let feedback = `Score: ${score}/${assessmentPoint.maxScore}\n\n`;
  if (matchedPoints.length > 0) {
    feedback += `✓ Addressed points:\n${matchedPoints.map((p) => `  • ${p}`).join('\n')}\n\n`;
  }

  const missedPoints = assessmentPoint.criteria.filter((c) => !matchedPoints.includes(c));
  if (missedPoints.length > 0) {
    feedback += `✗ Consider adding:\n${missedPoints.map((p) => `  • ${p}`).join('\n')}`;
  }

  return { score, feedback };
};
