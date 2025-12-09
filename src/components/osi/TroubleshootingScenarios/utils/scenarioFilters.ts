import type { TroubleshootingScenario } from '../types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';

export const getFilteredScenarios = (
  filterDifficulty: string,
  filterCategory: string
): TroubleshootingScenario[] => {
  return TROUBLESHOOTING_SCENARIOS.filter((scenario) => {
    const difficultyMatch = filterDifficulty === 'all' || scenario.difficulty === filterDifficulty;
    const categoryMatch = filterCategory === 'all' || scenario.category === filterCategory;
    return difficultyMatch && categoryMatch;
  });
};

export const getCategories = (): string[] => {
  return ['all', ...new Set(TROUBLESHOOTING_SCENARIOS.map((s) => s.category))];
};
