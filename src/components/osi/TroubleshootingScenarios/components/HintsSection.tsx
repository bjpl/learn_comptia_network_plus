import React from 'react';
import type { TroubleshootingScenario } from '../types';

interface HintsSectionProps {
  scenario: TroubleshootingScenario;
  showHints: boolean;
  usedHints: Set<string>;
  onUseHint: () => void;
}

export const HintsSection: React.FC<HintsSectionProps> = ({
  scenario,
  showHints,
  usedHints,
  onUseHint,
}) => {
  return (
    <div
      className="hints-section bg-yellow-50 dark:bg-yellow-950"
      style={{
        marginBottom: '25px',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ffc107',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 className="text-gray-900 dark:text-gray-100" style={{ margin: 0 }}>
          Hints Available: {usedHints.has(scenario.id) ? 'Used' : 'Not Used'}
        </h4>
        {!showHints && !usedHints.has(scenario.id) && (
          <button
            onClick={onUseHint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            💡 Show Hints
          </button>
        )}
      </div>

      {showHints && (
        <div style={{ marginTop: '15px' }}>
          {scenario.hints.map((hint, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800"
              style={{
                padding: '10px',
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '14px',
              }}
            >
              <strong>Hint {index + 1}:</strong> {hint}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
