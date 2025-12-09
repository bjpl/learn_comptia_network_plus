import type { TroubleshootingScenario, ScenarioResponse } from '../types';

export const calculateScore = (
  scenario: TroubleshootingScenario,
  response: ScenarioResponse
): number => {
  let score = 0;

  // Layer identification (20%)
  if (response.selectedLayer === scenario.correctLayer) {
    score += 20;
  }

  // Explanation quality (50%)
  if (response.explanation.length >= 100) {
    const explanationLower = response.explanation.toLowerCase();
    const scenarioExplanationLower = scenario.explanation.toLowerCase();

    // Check for key concepts from correct explanation
    const keyWords = scenarioExplanationLower.split(' ').filter((word) => word.length > 5);
    const matchedWords = keyWords.filter((word) => explanationLower.includes(word));
    const conceptScore = (matchedWords.length / keyWords.length) * 50;

    score += Math.min(50, conceptScore);
  } else {
    // Partial credit for shorter explanations
    score += (response.explanation.length / 100) * 25;
  }

  // Solution appropriateness (30%)
  if (response.solution.length >= 50) {
    score += 30;
  } else {
    score += (response.solution.length / 50) * 30;
  }

  return Math.round(score);
};

export const calculateWordCount = (text: string): number => {
  return text.split(' ').filter((w) => w.length > 0).length;
};
