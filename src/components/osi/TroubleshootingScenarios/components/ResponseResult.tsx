import React from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../types';
import { LAYER_NAMES } from '../../osi-data';

interface ResponseResultProps {
  scenario: TroubleshootingScenario;
  response: ScenarioResponse;
}

export const ResponseResult: React.FC<ResponseResultProps> = ({ scenario, response }) => {
  const isCorrect = response.selectedLayer === scenario.correctLayer;

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
        borderRadius: '8px',
        border: `2px solid ${isCorrect ? '#4CAF50' : '#f44336'}`,
      }}
    >
      <h4 className="text-gray-900 dark:text-gray-100" style={{ marginTop: 0 }}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </h4>
      <p className="text-gray-900 dark:text-gray-100">
        <strong>Correct Layer:</strong> Layer {scenario.correctLayer} (
        {LAYER_NAMES[scenario.correctLayer]})
      </p>
      <p className="text-gray-900 dark:text-gray-100">
        <strong>Explanation:</strong> {scenario.explanation}
      </p>
      <p className="text-gray-900 dark:text-gray-100" style={{ marginBottom: 0 }}>
        <strong>Your Score:</strong> {response.score || 0}/100
      </p>
    </div>
  );
};
