/**
 * HintsSection Component
 */

import React from 'react';
import type { TroubleshootingScenario } from '../../osi-types';

interface HintsSectionProps {
  scenario: TroubleshootingScenario;
  showHints: boolean;
  used: boolean;
  onShowHints: () => void;
}

export const HintsSection: React.FC<HintsSectionProps> = ({
  scenario,
  showHints,
  used,
  onShowHints,
}) => {
  return (
    <div
      style={{
        marginBottom: '25px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffc107',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Hints Available: {used ? 'Used' : 'Not Used'}</h4>
        {!showHints && !used && (
          <button
            onClick={onShowHints}
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
              style={{
                padding: '10px',
                backgroundColor: '#fff',
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
