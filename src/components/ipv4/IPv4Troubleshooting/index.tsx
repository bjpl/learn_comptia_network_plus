/**
 * CompTIA Network+ - Component 18: IPv4 Troubleshooting Scenarios
 * Interactive troubleshooting with network diagrams, diagnostic tools, and step-by-step solutions
 */

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import type { TroubleshootingScenario } from '../ipv4-types';
import { troubleshootingScenarios } from '../ipv4-data';
import { useTroubleshootingState } from './hooks';
import {
  ScenarioSelector,
  ProgressDisplay,
  NetworkDiagram,
  SymptomsDisplay,
  DiagnosticOutputs,
  ActionButtons,
  HintsDisplay,
  SolutionSteps,
  MethodologyReference,
  DiagnosticDialog,
} from './components';

const IPv4Troubleshooting: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TroubleshootingScenario>(
    troubleshootingScenarios[0]
  );

  const {
    state,
    setShowHints,
    setShowSolution,
    setShowDiagnosticDialog,
    handleStepComplete,
    handleReset,
    handleShowDiagnostic,
  } = useTroubleshootingState(selectedScenario);

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
        IPv4 Troubleshooting Scenarios
      </Typography>
      <Typography variant="body1" className="text-gray-700 dark:text-gray-300" paragraph>
        Diagnose and resolve IPv4 networking issues using systematic troubleshooting methods
      </Typography>

      <ScenarioSelector
        scenarios={troubleshootingScenarios}
        selectedScenario={selectedScenario}
        onScenarioChange={setSelectedScenario}
      />

      <ProgressDisplay
        score={state.score}
        completedSteps={state.completedSteps.size}
        totalSteps={selectedScenario.solution?.length || 0}
        startTime={state.startTime}
      />

      <NetworkDiagram devices={selectedScenario.devices} />

      <SymptomsDisplay
        symptoms={selectedScenario.symptoms}
        expectedBehavior={selectedScenario.expectedBehavior}
        actualBehavior={selectedScenario.actualBehavior}
      />

      <DiagnosticOutputs
        diagnostics={selectedScenario.diagnosticOutputs}
        onShowDiagnostic={handleShowDiagnostic}
      />

      <ActionButtons
        showHints={state.showHints}
        showSolution={state.showSolution}
        onToggleHints={() => setShowHints(!state.showHints)}
        onToggleSolution={() => setShowSolution(!state.showSolution)}
        onReset={handleReset}
      />

      {selectedScenario.hints && (
        <HintsDisplay hints={selectedScenario.hints} show={state.showHints} />
      )}

      {selectedScenario.solution && (
        <SolutionSteps
          steps={selectedScenario.solution}
          activeStep={state.activeStep}
          completedSteps={state.completedSteps}
          showSolution={state.showSolution}
          score={state.score}
          startTime={state.startTime}
          onStepComplete={handleStepComplete}
        />
      )}

      <MethodologyReference />

      <DiagnosticDialog
        open={state.showDiagnosticDialog}
        diagnostic={state.selectedDiagnostic}
        onClose={() => setShowDiagnosticDialog(false)}
      />
    </div>
  );
};

export default IPv4Troubleshooting;
