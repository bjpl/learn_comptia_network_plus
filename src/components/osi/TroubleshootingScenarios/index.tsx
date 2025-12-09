import React, { useMemo } from 'react';
import type { TroubleshootingScenariosProps } from './types';
import { useTroubleshootingState } from './hooks/useTroubleshootingState';
import { calculateStats } from './utils/statsCalculator';
import { getCategories } from './utils/scenarioFilters';
import {
  StatsCards,
  Filters,
  ScenarioHeader,
  LayerSelection,
  TextInputSection,
  HintsSection,
  ActionButtons,
  ResponseResult,
  ScenarioNavigation,
} from './components';

export const TroubleshootingScenarios: React.FC<TroubleshootingScenariosProps> = ({
  onProgressUpdate,
}) => {
  const {
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
  } = useTroubleshootingState(onProgressUpdate);

  const stats = useMemo(() => calculateStats(responses), [responses]);
  const categories = useMemo(() => getCategories(), []);

  return (
    <div
      className="troubleshooting-scenarios"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}
    >
      <div className="header" style={{ marginBottom: '30px' }}>
        <h2 className="text-gray-900 dark:text-gray-100">OSI Troubleshooting Scenario Bank</h2>

        <StatsCards stats={stats} />

        <Filters
          filterDifficulty={filterDifficulty}
          filterCategory={filterCategory}
          categories={categories}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div
        className="scenario-card bg-white dark:bg-gray-800"
        style={{
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #e0e0e0',
        }}
      >
        <ScenarioHeader scenario={currentScenario} />

        <div className="response-section" style={{ marginTop: '30px' }}>
          <LayerSelection
            selectedLayer={currentResponse.selectedLayer ?? null}
            onLayerSelect={updateSelectedLayer}
          />

          <TextInputSection
            title="2. Explain Your Reasoning"
            value={currentResponse.explanation || ''}
            onChange={updateExplanation}
            placeholder="Explain why this problem occurs at the layer you selected. Include technical details and reasoning..."
            rows={6}
            minWords={100}
            scoreWeight="50%"
            inputId="explanation-text"
          />

          <TextInputSection
            title="3. Suggest a Layer-Appropriate Solution"
            value={currentResponse.solution || ''}
            onChange={updateSolution}
            placeholder="Provide a solution appropriate for this OSI layer..."
            rows={4}
            minWords={50}
            scoreWeight="30%"
            inputId="solution-text"
          />

          <HintsSection
            scenario={currentScenario}
            showHints={showHints}
            usedHints={usedHints}
            onUseHint={useHint}
          />

          <ActionButtons
            currentIndex={currentScenarioIndex}
            totalScenarios={filteredScenarios.length}
            onPrevious={() => goToScenario(currentScenarioIndex - 1)}
            onNext={() => goToScenario(currentScenarioIndex + 1)}
            onSubmit={submitResponse}
          />
        </div>

        {responses.has(currentScenario.id) && (
          <ResponseResult
            scenario={currentScenario}
            response={responses.get(currentScenario.id)!}
          />
        )}
      </div>

      <ScenarioNavigation
        scenarios={filteredScenarios}
        currentIndex={currentScenarioIndex}
        responses={responses}
        onNavigate={goToScenario}
      />
    </div>
  );
};

export default TroubleshootingScenarios;
