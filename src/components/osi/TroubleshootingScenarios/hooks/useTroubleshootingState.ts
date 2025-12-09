import { useState, useCallback, useMemo } from 'react';
import type { ScenarioResponse, OSILayerNumber } from '../types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';
import { calculateScore } from '../utils/scoreCalculator';
import { getFilteredScenarios } from '../utils/scenarioFilters';

export const useTroubleshootingState = (onProgressUpdate?: (correct: number, total: number) => void) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Map<string, ScenarioResponse>>(new Map());
  const [currentResponse, setCurrentResponse] = useState<Partial<ScenarioResponse>>({
    selectedLayer: null,
    explanation: '',
    solution: '',
  });
  const [showHints, setShowHints] = useState<boolean>(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredScenarios = useMemo(
    () => getFilteredScenarios(filterDifficulty, filterCategory),
    [filterDifficulty, filterCategory]
  );

  const currentScenario = useMemo(() => {
    return filteredScenarios[currentScenarioIndex] || TROUBLESHOOTING_SCENARIOS[0];
  }, [currentScenarioIndex, filteredScenarios]);

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

    // Update progress
    const correctCount =
      Array.from(responses.values()).filter(
        (r) =>
          TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
          r.selectedLayer
      ).length + (fullResponse.selectedLayer === currentScenario.correctLayer ? 1 : 0);

    onProgressUpdate?.(correctCount, responses.size + 1);

    // Move to next scenario
    if (currentScenarioIndex < filteredScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
      setShowHints(false);
    }
  }, [
    currentResponse,
    currentScenario,
    currentScenarioIndex,
    filteredScenarios.length,
    responses,
    onProgressUpdate,
  ]);

  const useHint = useCallback(() => {
    setUsedHints((prev) => new Set(prev).add(currentScenario.id));
    setShowHints(true);
  }, [currentScenario.id]);

  const goToScenario = useCallback(
    (index: number) => {
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

  const updateSelectedLayer = useCallback((layer: OSILayerNumber) => {
    setCurrentResponse((prev) => ({ ...prev, selectedLayer: layer }));
  }, []);

  const updateExplanation = useCallback((explanation: string) => {
    setCurrentResponse((prev) => ({ ...prev, explanation }));
  }, []);

  const updateSolution = useCallback((solution: string) => {
    setCurrentResponse((prev) => ({ ...prev, solution }));
  }, []);

  const handleFilterChange = useCallback((type: 'difficulty' | 'category', value: string) => {
    if (type === 'difficulty') {
      setFilterDifficulty(value);
    } else {
      setFilterCategory(value);
    }
    setCurrentScenarioIndex(0);
  }, []);

  return {
    currentScenarioIndex,
    currentScenario,
    filteredScenarios,
    responses,
    currentResponse,
    showHints,
    usedHints,
    filterDifficulty,
    filterCategory,
    submitResponse,
    useHint,
    goToScenario,
    updateSelectedLayer,
    updateExplanation,
    updateSolution,
    handleFilterChange,
  };
};
