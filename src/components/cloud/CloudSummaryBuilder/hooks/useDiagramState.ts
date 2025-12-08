/**
 * Custom hook for managing diagram state in CloudSummaryBuilder
 */

import { useState, useEffect } from 'react';
import type { CloudScenario, CloudSummary, ScoreBreakdown } from '../../cloud-types';
import { calculateWordCount, calculateScore } from '../utils/diagramCalculations';

export const useDiagramState = (initialScenario: CloudScenario) => {
  const [selectedScenario, setSelectedScenario] = useState<CloudScenario>(initialScenario);
  const [userSummary, setUserSummary] = useState<Partial<CloudSummary>>({
    vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
    cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
    scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
    serviceExamples: [],
    multitenancyConsiderations: [],
  });
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showIdealSolution, setShowIdealSolution] = useState(false);

  // Calculate word count for all text fields
  useEffect(() => {
    const count = calculateWordCount(userSummary);
    setWordCount(count);
  }, [userSummary]);

  const handleSubmit = () => {
    const calculatedScore = calculateScore(userSummary, selectedScenario, wordCount);
    setScore(calculatedScore);
  };

  const handleReset = () => {
    setUserSummary({
      vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
      cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
      scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
      serviceExamples: [],
      multitenancyConsiderations: [],
    });
    setScore(null);
    setShowIdealSolution(false);
  };

  const handleScenarioChange = (scenarioId: string, allScenarios: CloudScenario[]) => {
    const scenario = allScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      handleReset();
    }
  };

  return {
    selectedScenario,
    setSelectedScenario,
    userSummary,
    setUserSummary,
    score,
    wordCount,
    showIdealSolution,
    setShowIdealSolution,
    handleSubmit,
    handleReset,
    handleScenarioChange,
  };
};
