import type { ScenarioResponse, TroubleshootingStats } from '../types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';

export const calculateStats = (responses: Map<string, ScenarioResponse>): TroubleshootingStats => {
  const attempted = responses.size;
  const correct = Array.from(responses.values()).filter(
    (r) =>
      TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
      r.selectedLayer
  ).length;
  const avgScore =
    attempted > 0
      ? Array.from(responses.values()).reduce((sum, r) => sum + (r.score || 0), 0) / attempted
      : 0;

  return { attempted, correct, avgScore };
};
