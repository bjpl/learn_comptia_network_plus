import { calculatePhaseProgress } from '../../../../data/migration-data';
import type { ChecklistItems, TimelineDataItem } from '../types';

export const calculateTimelineData = (
  scenario: any,
  checkedItems: ChecklistItems
): TimelineDataItem[] => {
  let cumulativeWeeks = 0;
  return scenario.phases.map((phase: any) => {
    const start = cumulativeWeeks;
    cumulativeWeeks += phase.duration;
    return {
      phase,
      startWeek: start,
      endWeek: cumulativeWeeks,
      progress: calculatePhaseProgress({
        ...phase,
        checklist: phase.checklist.map((item: any) => ({
          ...item,
          completed: !!checkedItems[item.id],
        })),
      }),
    };
  });
};

export const getAllRisks = (scenario: any) => {
  const { calculateRiskSeverity } = require('../../../../data/migration-data');

  return scenario.phases.flatMap((phase: any) =>
    phase.risks.map((risk: any) => ({
      ...risk,
      phase: phase.name,
      severity: calculateRiskSeverity(risk.probability, risk.impact),
    }))
  );
};

export const getSortedRisks = (scenario: any) => {
  const allRisks = getAllRisks(scenario);
  return [...allRisks].sort((a, b) => b.severity - a.severity);
};

export const calculateSavingsPercent = (savings: number, onPremTotal: number): number => {
  return onPremTotal > 0 ? Math.round((savings / onPremTotal) * 100) : 0;
};

export const getCostPercentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};
