/**
 * ScenarioNavigationGrid Component
 */

import React from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../../osi-types';

interface ScenarioNavigationGridProps {
  scenarios: TroubleshootingScenario[];
  responses: Map<string, ScenarioResponse>;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const ScenarioNavigationGrid: React.FC<ScenarioNavigationGridProps> = ({
  scenarios,
  responses,
  currentIndex,
  onSelect,
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
      <h4 style={{ marginTop: 0 }}>
        Scenario Progress ({currentIndex + 1} of {scenarios.length})
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
          gap: '8px',
          marginTop: '15px',
        }}
      >
        {scenarios.map((scenario, index) => {
          const response = responses.get(scenario.id);
          const isCorrect = response?.selectedLayer === scenario.correctLayer;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(index)}
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
              title={scenario.title}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
