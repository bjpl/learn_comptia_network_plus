/**
 * Custom hook for managing scenario state
 */

import { useState, useCallback, useMemo } from 'react';
import type { ScenarioResponse } from '../../osi-types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';

export function useScenarioState(
  filterDifficulty: string,
  filterCategory: string,
  _onProgressUpdate?: (progress: { completed: number; total: number }) => void
) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Map<string, ScenarioResponse>>(new Map());
  const [currentResponse, setCurrentResponse] = useState<Partial<ScenarioResponse>>({
    selectedLayer: null,
    explanation: '',
    solution: '',
  });
  const [showHints, setShowHints] = useState<boolean>(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());

  const filteredScenarios = useMemo(() => {
    return TROUBLESHOOTING_SCENARIOS.filter((scenario) => {
      const difficultyMatch =
        filterDifficulty === 'all' || scenario.difficulty === filterDifficulty;
      const categoryMatch = filterCategory === 'all' || scenario.category === filterCategory;
      return difficultyMatch && categoryMatch;
    });
  }, [filterDifficulty, filterCategory]);

  const currentScenario = useMemo(() => {
    return filteredScenarios[currentScenarioIndex] || TROUBLESHOOTING_SCENARIOS[0];
  }, [currentScenarioIndex, filteredScenarios]);

  const goToScenario = useCallback(
    (index: number, _timeLimit?: number | null) => {
      if (index >= 0 && index < filteredScenarios.length) {
        setCurrentScenarioIndex(index);
        const existingResponse = responses.get(filteredScenarios[index].id);
        if (existingResponse) {
          setCurrentResponse(existingResponse);
        } else {
          setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
        }
        setShowHints(false);
      }
    },
    [filteredScenarios, responses]
  );

  const useHint = useCallback(() => {
    setUsedHints((prev) => new Set(prev).add(currentScenario.id));
    setShowHints(true);
  }, [currentScenario.id]);

  const stats = useMemo(() => {
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
  }, [responses]);

  return {
    currentScenarioIndex,
    setCurrentScenarioIndex,
    responses,
    setResponses,
    currentResponse,
    setCurrentResponse,
    showHints,
    setShowHints,
    usedHints,
    currentScenario,
    filteredScenarios,
    goToScenario,
    useHint,
    stats,
  };
}
