import React from 'react';
import { Box } from '@mui/material';
import { useTransformationState } from './hooks/useTransformationState';
import {
  MigrationHeader,
  ScenarioSelection,
  ViewNavigation,
  OverviewView,
  StrategyView,
  PhasesView,
  CostsView,
  RisksView,
  TimelineView,
  EducationalFooter,
} from './components';
import type { CloudMigrationSimulatorProps } from './types';
import '../CloudMigrationSimulator.css';

const CloudMigrationSimulator: React.FC<CloudMigrationSimulatorProps> = ({ className = '' }) => {
  const {
    selectedScenario,
    setSelectedScenario,
    selectedStrategy,
    setSelectedStrategy,
    activePhase,
    setActivePhase,
    customCostModel,
    checkedItems,
    view,
    setView,
    scenario,
    strategy,
    overallProgress,
    handleToggleChecklistItem,
    handleCostUpdate,
    onPremTotal,
    cloudTotal,
    savings,
  } = useTransformationState();

  return (
    // @ts-expect-error - Complex MUI className union type
    <Box className={`cloud-migration-simulator ${className}`}>
      <MigrationHeader />

      <ScenarioSelection
        selectedScenario={selectedScenario}
        onScenarioChange={setSelectedScenario}
        selectedStrategy={selectedStrategy}
        onStrategyChange={setSelectedStrategy}
      />

      <ViewNavigation currentView={view} onViewChange={setView} />

      <Box className="migration-content">
        {view === 'overview' && (
          <OverviewView
            scenario={scenario}
            strategy={strategy}
            overallProgress={overallProgress}
            savings={savings}
            onPremTotal={onPremTotal}
            checkedItems={checkedItems}
          />
        )}
        {view === 'strategy' && (
          <StrategyView
            selectedStrategy={selectedStrategy}
            onStrategySelect={setSelectedStrategy}
          />
        )}
        {view === 'phases' && (
          <PhasesView
            scenario={scenario}
            activePhase={activePhase}
            onPhaseChange={setActivePhase}
            checkedItems={checkedItems}
            onToggleItem={handleToggleChecklistItem}
            overallProgress={overallProgress}
          />
        )}
        {view === 'costs' && (
          <CostsView
            customCostModel={customCostModel}
            onCostUpdate={handleCostUpdate}
            onPremTotal={onPremTotal}
            cloudTotal={cloudTotal}
            savings={savings}
          />
        )}
        {view === 'risks' && <RisksView scenario={scenario} />}
        {view === 'timeline' && (
          <TimelineView
            scenario={scenario}
            checkedItems={checkedItems}
            overallProgress={overallProgress}
          />
        )}
      </Box>

      <EducationalFooter />
    </Box>
  );
};

export default CloudMigrationSimulator;
