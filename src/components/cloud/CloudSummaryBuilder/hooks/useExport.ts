/**
 * Custom hook for exporting cloud diagram data
 */

import type { CloudSummary, CloudScenario, ScoreBreakdown } from '../../cloud-types';

export interface ExportData {
  scenario: CloudScenario;
  userSummary: Partial<CloudSummary>;
  score: ScoreBreakdown | null;
  timestamp: string;
}

export const useExport = () => {
  const exportToJSON = (
    scenario: CloudScenario,
    userSummary: Partial<CloudSummary>,
    score: ScoreBreakdown | null
  ): string => {
    const data: ExportData = {
      scenario,
      userSummary,
      score,
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const downloadExport = (
    scenario: CloudScenario,
    userSummary: Partial<CloudSummary>,
    score: ScoreBreakdown | null
  ) => {
    const json = exportToJSON(scenario, userSummary, score);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloud-summary-${scenario.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    exportToJSON,
    downloadExport,
  };
};
