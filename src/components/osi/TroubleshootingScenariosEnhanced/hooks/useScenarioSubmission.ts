/**
 * Custom hook for handling scenario submission
 */

import { useCallback } from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../../osi-types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';
import { calculateScore } from '../utils/scoreCalculator';

export function useScenarioSubmission(
  currentResponse: Partial<ScenarioResponse>,
  currentScenario: TroubleshootingScenario,
  currentScenarioIndex: number,
  filteredScenarios: TroubleshootingScenario[],
  responses: Map<string, ScenarioResponse>,
  setResponses: React.Dispatch<React.SetStateAction<Map<string, ScenarioResponse>>>,
  setCurrentScenarioIndex: React.Dispatch<React.SetStateAction<number>>,
  setCurrentResponse: React.Dispatch<React.SetStateAction<Partial<ScenarioResponse>>>,
  setShowHints: React.Dispatch<React.SetStateAction<boolean>>,
  isExamMode: boolean,
  timeLimit: number | null,
  setTimeRemaining: React.Dispatch<React.SetStateAction<number | null>>,
  onProgressUpdate?: (progress: { completed: number; total: number }) => void
) {
  const submitResponse = useCallback(() => {
    if (
      !currentResponse.selectedLayer ||
      !currentResponse.explanation ||
      !currentResponse.solution
    ) {
      alert('Please complete all fields before submitting.');
      return;
    }

    const fullResponse: ScenarioResponse = {
      scenarioId: currentScenario.id,
      selectedLayer: currentResponse.selectedLayer,
      explanation: currentResponse.explanation,
      solution: currentResponse.solution,
      score: 0,
    };

    fullResponse.score = calculateScore(currentScenario, fullResponse);
    setResponses((prev) => new Map(prev).set(currentScenario.id, fullResponse));

    const correctCount =
      Array.from(responses.values()).filter(
        (r) =>
          TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
          r.selectedLayer
      ).length + (fullResponse.selectedLayer === currentScenario.correctLayer ? 1 : 0);

    onProgressUpdate?.({ completed: correctCount, total: responses.size + 1 });

    // Move to next scenario if not at end
    if (currentScenarioIndex < filteredScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
      setShowHints(false);
      if (isExamMode && timeLimit) {
        setTimeRemaining(timeLimit);
      }
    }
  }, [
    currentResponse,
    currentScenario,
    currentScenarioIndex,
    filteredScenarios.length,
    responses,
    onProgressUpdate,
    isExamMode,
    timeLimit,
    setResponses,
    setCurrentScenarioIndex,
    setCurrentResponse,
    setShowHints,
    setTimeRemaining,
  ]);

  return { submitResponse };
}
