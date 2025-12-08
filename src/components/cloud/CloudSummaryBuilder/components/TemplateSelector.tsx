/**
 * TemplateSelector component - handles scenario selection
 */

import React from 'react';
import type { CloudScenario } from '../../cloud-types';

interface TemplateSelectorProps {
  scenarios: CloudScenario[];
  selectedScenario: CloudScenario;
  onScenarioChange: (scenarioId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  scenarios,
  selectedScenario,
  onScenarioChange,
}) => {
  return (
    <div className="scenario-selector">
      <label htmlFor="scenario-select">Select Scenario:</label>
      <select
        id="scenario-select"
        value={selectedScenario.id}
        onChange={(e) => onScenarioChange(e.target.value)}
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.title} ({scenario.provider})
          </option>
        ))}
      </select>
    </div>
  );
};
