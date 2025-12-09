/**
 * Custom hook for managing troubleshooting state
 */

import { useState, useEffect } from 'react';
import type { TroubleshootingScenario, DiagnosticOutput } from '../../ipv4-types';
import type { TroubleshootingState } from '../types';
import { calculateScore } from '../utils';

export const useTroubleshootingState = (selectedScenario: TroubleshootingScenario) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userDiagnosis, setUserDiagnosis] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showDiagnosticDialog, setShowDiagnosticDialog] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticOutput | null>(null);

  // Reset when scenario changes
  useEffect(() => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setScore(0);
    setShowHints(false);
    setShowSolution(false);
    setUserDiagnosis('');
    setStartTime(Date.now());
  }, [selectedScenario]);

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);

    const newScore = calculateScore(
      newCompleted,
      selectedScenario.solution?.length || 0,
      showHints
    );
    setScore(newScore);

    if (stepIndex < (selectedScenario.solution?.length || 0) - 1) {
      setActiveStep(stepIndex + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setScore(0);
    setShowHints(false);
    setShowSolution(false);
    setUserDiagnosis('');
    setStartTime(Date.now());
  };

  const handleShowDiagnostic = (diagnostic: DiagnosticOutput) => {
    setSelectedDiagnostic(diagnostic);
    setShowDiagnosticDialog(true);
  };

  const state: TroubleshootingState = {
    activeStep,
    showHints,
    showSolution,
    userDiagnosis,
    completedSteps,
    score,
    startTime,
    showDiagnosticDialog,
    selectedDiagnostic,
  };

  return {
    state,
    setShowHints,
    setShowSolution,
    setUserDiagnosis,
    setShowDiagnosticDialog,
    handleStepComplete,
    handleReset,
    handleShowDiagnostic,
  };
};
