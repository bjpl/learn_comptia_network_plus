import React, { useMemo } from 'react';
import { LAYER_COLORS } from '../../osi-data';
import { REAL_WORLD_EXAMPLES } from '../constants';

interface RealWorldExamplesProps {
  selectedExample: number;
  setSelectedExample: (index: number) => void;
}

export const RealWorldExamples: React.FC<RealWorldExamplesProps> = ({
  selectedExample,
  setSelectedExample,
}) => {
  const currentExample = useMemo(() => REAL_WORLD_EXAMPLES[selectedExample], [selectedExample]);

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Real-World Networking Scenarios</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        {REAL_WORLD_EXAMPLES.map((example, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedExample(idx)}
            className={selectedExample !== idx ? 'text-gray-800 dark:text-gray-200' : ''}
            style={{
              padding: '12px',
              backgroundColor: selectedExample === idx ? LAYER_COLORS[example.layer] : '#f0f0f0',
              color: selectedExample === idx ? 'white' : undefined,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            {example.title}
          </button>
        ))}
      </div>
      {currentExample && (
        <div
          style={{
            border: `3px solid ${LAYER_COLORS[currentExample.layer]}`,
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: `${LAYER_COLORS[currentExample.layer]}10`,
          }}
        >
          <h4 className="text-gray-800 dark:text-gray-200" style={{ marginBottom: '10px' }}>
            Layer {currentExample.layer}: {currentExample.title}
          </h4>
          <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>{currentExample.scenario}</p>
          <div style={{ marginTop: '15px' }}>
            <strong>Key Protocols:</strong>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {currentExample.protocols.map((protocol) => (
                <span
                  key={protocol}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: LAYER_COLORS[currentExample.layer],
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
