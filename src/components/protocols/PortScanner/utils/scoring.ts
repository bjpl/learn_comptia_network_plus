/**
 * Scoring and assessment utilities
 */

export const calculateScore = (
  totalServices: number,
  criticalServices: number,
  remediatedServices: number
): { baseScore: number; criticalPenalty: number; finalScore: number } => {
  const baseScore = (remediatedServices / totalServices) * 100;
  const criticalPenalty = criticalServices * 10;
  const finalScore = Math.max(0, Math.min(100, baseScore - criticalPenalty));

  return { baseScore, criticalPenalty, finalScore };
};

export const getScoreMessage = (score: number): string => {
  if (score >= 90) return '🏆 EXCELLENT! Outstanding security awareness!';
  if (score >= 75) return '✓ GOOD! Solid understanding of security principles';
  if (score >= 60) return '⚡ FAIR! Review critical vulnerabilities';
  return '⚠️  NEEDS IMPROVEMENT! Focus on high-risk services';
};

export const formatScoreOutput = (
  totalServices: number,
  criticalServices: number,
  remediatedServices: number,
  baseScore: number,
  criticalPenalty: number,
  finalScore: number
): string[] => [
  '',
  '═══════════════ ASSESSMENT SCORE ═══════════════',
  '',
  `Services Scanned:      ${totalServices}`,
  `Critical Risks Found:  ${criticalServices}`,
  `Services Remediated:   ${remediatedServices}`,
  '',
  `Base Score:            ${baseScore.toFixed(1)}%`,
  `Critical Penalty:      -${criticalPenalty}%`,
  '',
  `═══════════════════════════════════════════════`,
  `FINAL SCORE:           ${finalScore.toFixed(1)}%`,
  `═══════════════════════════════════════════════`,
  '',
  getScoreMessage(finalScore),
  '',
];
