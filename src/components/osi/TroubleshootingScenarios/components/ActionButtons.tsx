import React from 'react';

interface ActionButtonsProps {
  currentIndex: number;
  totalScenarios: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  currentIndex,
  totalScenarios,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const isFirstScenario = currentIndex === 0;
  const isLastScenario = currentIndex >= totalScenarios - 1;

  return (
    <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          onClick={onPrevious}
          disabled={isFirstScenario}
          style={{
            padding: '12px 24px',
            backgroundColor: isFirstScenario ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFirstScenario ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          disabled={isLastScenario}
          style={{
            padding: '12px 24px',
            backgroundColor: isLastScenario ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLastScenario ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          Next →
        </button>
      </div>

      <button
        onClick={onSubmit}
        style={{
          padding: '12px 32px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Submit Response
      </button>
    </div>
  );
};
