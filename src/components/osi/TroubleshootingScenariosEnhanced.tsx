/**
 * Enhanced Troubleshooting Scenarios Component
 * Main entry point - delegates to modular sub-components
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { MethodologyStep } from './methodology/MethodologyWizard';
import type { AnalyticsData } from './analytics/PerformanceAnalytics';
import { TROUBLESHOOTING_SCENARIOS } from './osi-data';
import { TerminalSimulator } from './tools/TerminalSimulator';
import { MethodologyWizard } from './methodology/MethodologyWizard';
import { PerformanceAnalytics } from './analytics/PerformanceAnalytics';
import { SymptomLayerMapping } from './reference/SymptomLayerMapping';
import {
  ModeToggle,
  NavigationTabs,
  PracticeView,
} from './TroubleshootingScenariosEnhanced/components';
import { useScenarioState } from './TroubleshootingScenariosEnhanced/hooks/useScenarioState';
import { useTimer, useSessionTimer } from './TroubleshootingScenariosEnhanced/hooks/useTimer';
import { useScenarioSubmission } from './TroubleshootingScenariosEnhanced/hooks/useScenarioSubmission';
import type {
  ViewMode,
  TroubleshootingScenariosEnhancedProps,
} from './TroubleshootingScenariosEnhanced/types';
import { STUDY_MODE, EXAM_MODE } from './TroubleshootingScenariosEnhanced/types';

export const TroubleshootingScenariosEnhanced: React.FC<TroubleshootingScenariosEnhancedProps> = ({
  onProgressUpdate,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [commandsExecuted, setCommandsExecuted] = useState<number>(0);
  const [isExamMode, setIsExamMode] = useState<boolean>(false);

  const modeConfig = isExamMode ? EXAM_MODE : STUDY_MODE;
  const { timeSpent } = useSessionTimer();

  const {
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
  } = useScenarioState(filterDifficulty, filterCategory, onProgressUpdate);

  const handleTimeUp = useCallback(() => {
    if (currentResponse.selectedLayer && currentResponse.explanation && currentResponse.solution) {
      submitResponse();
    } else {
      alert('Time up! Moving to next scenario.');
      goToScenario(currentScenarioIndex + 1, modeConfig.timeLimit);
    }
  }, [currentResponse, goToScenario, currentScenarioIndex, modeConfig.timeLimit]);

  const { timeRemaining, setTimeRemaining } = useTimer(
    isExamMode,
    modeConfig.timeLimit,
    currentScenarioIndex,
    handleTimeUp
  );

  const { submitResponse } = useScenarioSubmission(
    currentResponse,
    currentScenario,
    currentScenarioIndex,
    filteredScenarios,
    responses,
    setResponses,
    setCurrentScenarioIndex,
    setCurrentResponse,
    setShowHints,
    isExamMode,
    modeConfig.timeLimit,
    setTimeRemaining,
    onProgressUpdate
  );

  const handleMethodologyComplete = (steps: MethodologyStep[]) => {
    const step2Theory = steps[1].userInput;
    const step3Testing = steps[2].userInput;

    setCurrentResponse((prev) => ({
      ...prev,
      explanation: prev.explanation || step2Theory + '\n\n' + step3Testing,
    }));

    setViewMode('practice');
  };

  const analyticsData: AnalyticsData = {
    responses,
    scenarios: TROUBLESHOOTING_SCENARIOS,
    hintsUsed: usedHints,
    commandsExecuted,
    timeSpent,
  };

  const categories = useMemo(() => {
    return ['all', ...new Set(TROUBLESHOOTING_SCENARIOS.map((s) => s.category))];
  }, []);

  const handleFilterDifficultyChange = useCallback((value: string) => {
    setFilterDifficulty(value);
    setCurrentScenarioIndex(0);
  }, [setCurrentScenarioIndex]);

  const handleFilterCategoryChange = useCallback((value: string) => {
    setFilterCategory(value);
    setCurrentScenarioIndex(0);
  }, [setCurrentScenarioIndex]);

  const handleGoToScenario = useCallback(
    (index: number) => {
      goToScenario(index, modeConfig.timeLimit);
    },
    [goToScenario, modeConfig.timeLimit]
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Header with Mode Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>OSI Troubleshooting Training</h2>
          <ModeToggle isExamMode={isExamMode} onModeChange={setIsExamMode} />
        </div>

        <NavigationTabs viewMode={viewMode} modeConfig={modeConfig} onViewModeChange={setViewMode} />
      </div>

      {/* Main Content Area */}
      <div>
        {viewMode === 'practice' && (
          <PracticeView
            currentScenario={currentScenario}
            currentScenarioIndex={currentScenarioIndex}
            filteredScenarios={filteredScenarios}
            currentResponse={currentResponse}
            responses={responses}
            showHints={showHints}
            usedHints={usedHints}
            filterDifficulty={filterDifficulty}
            filterCategory={filterCategory}
            isExamMode={isExamMode}
            timeRemaining={timeRemaining}
            modeConfig={modeConfig}
            stats={stats}
            categories={categories}
            onCurrentResponseChange={setCurrentResponse}
            onFilterDifficultyChange={handleFilterDifficultyChange}
            onFilterCategoryChange={handleFilterCategoryChange}
            onUseHint={useHint}
            onGoToScenario={handleGoToScenario}
            onSubmitResponse={submitResponse}
          />
        )}

        {viewMode === 'tools' && (
          <div
            className="bg-white dark:bg-gray-800"
            style={{ borderRadius: '12px', padding: '20px', height: '600px' }}
          >
            <h3 style={{ marginTop: 0 }}>Network Diagnostic Tools</h3>
            <p className="text-gray-700 dark:text-gray-300" style={{ marginBottom: '20px' }}>
              Practice using network troubleshooting tools with the current scenario:
              <strong> {currentScenario.title}</strong>
            </p>
            <TerminalSimulator
              scenario={currentScenario}
              onCommandExecuted={() => setCommandsExecuted((prev) => prev + 1)}
            />
          </div>
        )}

        {viewMode === 'methodology' && (
          <div
            className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            style={{ borderRadius: '12px', height: '700px' }}
          >
            <MethodologyWizard
              scenario={currentScenario}
              onComplete={handleMethodologyComplete}
              onCancel={() => setViewMode('practice')}
            />
          </div>
        )}

        {viewMode === 'analytics' && <PerformanceAnalytics data={analyticsData} />}

        {viewMode === 'reference' && (
          <div
            className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            style={{ borderRadius: '12px', padding: '20px' }}
          >
            <SymptomLayerMapping />
          </div>
        )}
      </div>
    </div>
  );
};

export default TroubleshootingScenariosEnhanced;
