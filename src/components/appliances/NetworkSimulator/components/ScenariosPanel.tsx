import React from 'react';

interface Scenario {
  id: string;
  name: string;
  description: string;
  expectedIssue: string;
  hint: string;
}

interface ScenariosPanelProps {
  showScenarios: boolean;
  setShowScenarios: (show: boolean) => void;
  scenarios: Scenario[];
  loadScenario: (scenarioId: string) => void;
}

export const ScenariosPanel: React.FC<ScenariosPanelProps> = ({
  showScenarios,
  setShowScenarios,
  scenarios,
  loadScenario,
}) => {
  if (!showScenarios) return null;

  return (
    <div className="mb-4 rounded border border-purple-300 bg-purple-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Network Troubleshooting Scenarios</h3>
        <button
          onClick={() => setShowScenarios(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <div className="space-y-2">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="rounded bg-white p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{scenario.name}</p>
                <p className="text-sm text-gray-600">{scenario.description}</p>
                <p className="mt-1 text-xs text-blue-600">Issue: {scenario.expectedIssue}</p>
                <p className="text-xs text-green-600">Hint: {scenario.hint}</p>
              </div>
              <button
                onClick={() => loadScenario(scenario.id)}
                className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
              >
                Load
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
