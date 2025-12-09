import React from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../types';

interface ScenarioNavigationProps {
  scenarios: TroubleshootingScenario[];
  currentIndex: number;
  responses: Map<string, ScenarioResponse>;
  onNavigate: (index: number) => void;
}

export const ScenarioNavigation: React.FC<ScenarioNavigationProps> = ({
  scenarios,
  currentIndex,
  responses,
  onNavigate,
}) => {
  return (
    <div
      className="bg-white dark:bg-gray-800"
      style={{
        marginTop: '30px',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}
    >
      <h4 className="text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>
        Scenario Progress ({currentIndex + 1} of {scenarios.length})
      </h4>
      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
          gap: '8px',
          marginTop: '15px',
        }}
        aria-label="Scenario navigation grid"
      >
        {scenarios.map((scenario, index) => {
          const response = responses.get(scenario.id);
          const isCorrect = response?.selectedLayer === scenario.correctLayer;

          return (
            <button
              key={scenario.id}
              onClick={() => onNavigate(index)}
              style={{
                padding: '10px',
                backgroundColor: response
                  ? isCorrect
                    ? '#4CAF50'
                    : '#f44336'
                  : index === currentIndex
                    ? '#2196F3'
                    : '#f5f5f5',
                color: response || index === currentIndex ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: index === currentIndex ? 'bold' : 'normal',
              }}
              aria-label={`Scenario ${index + 1}: ${scenario.title}. ${response ? (isCorrect ? 'Correct' : 'Incorrect') : index === currentIndex ? 'Current' : 'Not attempted'}`}
              aria-current={index === currentIndex ? 'page' : undefined}
              title={scenario.title}
            >
              {index + 1}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
