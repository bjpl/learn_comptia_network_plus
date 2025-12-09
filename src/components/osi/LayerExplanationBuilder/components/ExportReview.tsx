import React from 'react';
import type { OSILayer } from '../../osi-types';
import { LAYER_COLORS } from '../../osi-data';

interface ExportReviewProps {
  layers: OSILayer[];
  onExport: () => void;
  onPreview: () => void;
}

export const ExportReview: React.FC<ExportReviewProps> = ({ layers, onExport, onPreview }) => {
  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Export Study Notes</h3>
      <div
        style={{
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f1f8f4',
        }}
      >
        <p className="text-green-900 dark:text-green-300" style={{ marginBottom: '15px' }}>
          Generate downloadable study notes containing all your layer definitions, protocols, PDUs,
          and notes.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onExport}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Download as TXT
          </button>
          <button
            onClick={onPreview}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Preview Notes
          </button>
        </div>
      </div>

      {/* Learning Summary */}
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ marginBottom: '15px' }}>Your Progress Summary</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          {layers.map((layer) => (
            <div
              key={layer.number}
              style={{
                border: `2px solid ${LAYER_COLORS[layer.number]}`,
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: `${LAYER_COLORS[layer.number]}20`,
              }}
            >
              <div className="text-gray-800 dark:text-gray-200" style={{ fontWeight: 'bold' }}>
                Layer {layer.number}: {layer.name}
              </div>
              <div
                className="text-gray-800 dark:text-gray-200"
                style={{ fontSize: '12px', marginTop: '8px' }}
              >
                Status:{' '}
                {layer.status === 'complete'
                  ? 'Complete ✓'
                  : layer.status === 'partial'
                    ? 'Partial ◐'
                    : 'Empty ○'}
              </div>
              {layer.primaryFunction && (
                <div
                  className="text-gray-800 dark:text-gray-200"
                  style={{ fontSize: '12px', marginTop: '4px' }}
                >
                  Function: {layer.primaryFunction.substring(0, 30)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
