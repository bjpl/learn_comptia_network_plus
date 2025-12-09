import React from 'react';
import type { TroubleshootingScenario } from '../types';

interface ScenarioHeaderProps {
  scenario: TroubleshootingScenario;
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({ scenario }) => {
  return (
    <div className="scenario-header" style={{ marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h3 className="text-gray-900 dark:text-gray-100" style={{ margin: 0 }}>
          {scenario.title}
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span
            style={{
              padding: '4px 12px',
              backgroundColor:
                scenario.difficulty === 'easy'
                  ? '#4CAF50'
                  : scenario.difficulty === 'medium'
                    ? '#FF9800'
                    : '#f44336',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {scenario.difficulty.toUpperCase()}
          </span>
          <span
            style={{
              padding: '4px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          >
            {scenario.category}
          </span>
        </div>
      </div>

      <div
        className="bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        style={{
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        {scenario.description}
      </div>
    </div>
  );
};
