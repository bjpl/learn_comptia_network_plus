/**
 * ResultFeedback Component
 */

import React from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../../osi-types';
import { LAYER_NAMES } from '../../osi-data';

interface ResultFeedbackProps {
  response: ScenarioResponse;
  scenario: TroubleshootingScenario;
}

export const ResultFeedback: React.FC<ResultFeedbackProps> = ({ response, scenario }) => {
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
      <h4 style={{ marginTop: 0 }}>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
      <p>
        <strong>Correct Layer:</strong> Layer {scenario.correctLayer} (
        {LAYER_NAMES[scenario.correctLayer]})
      </p>
      <p>
        <strong>Explanation:</strong> {scenario.explanation}
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>Your Score:</strong> {response.score}/100
      </p>
    </div>
  );
};
