import React from 'react';
import type { OSILayer, OSILayerNumber } from '../../osi-types';
import { LayerCard } from './LayerCard';

interface LayerBuilderProps {
  layers: OSILayer[];
  expandedLayer: OSILayerNumber | null;
  setExpandedLayer: (layer: OSILayerNumber | null) => void;
  updateLayer: (layerNumber: OSILayerNumber, updates: Partial<OSILayer>) => void;
  toggleProtocol: (layerNumber: OSILayerNumber, protocolName: string) => void;
  hintsUsed: number;
  onUseHint: () => void;
}

export const LayerBuilder: React.FC<LayerBuilderProps> = ({
  layers,
  expandedLayer,
  setExpandedLayer,
  updateLayer,
  toggleProtocol,
  hintsUsed,
  onUseHint,
}) => {
  return (
    <div className="layers-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {layers.map((layer) => (
        <LayerCard
          key={layer.number}
          layer={layer}
          isExpanded={expandedLayer === layer.number}
          onToggleExpand={() => setExpandedLayer(expandedLayer === layer.number ? null : layer.number)}
          onUpdate={updateLayer}
          onToggleProtocol={toggleProtocol}
        />
      ))}

      {/* Hint Section */}
      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
        }}
      >
        <h3>Hints Available: {3 - hintsUsed} remaining</h3>
        <p className="text-yellow-900 dark:text-yellow-300" style={{ fontSize: '14px' }}>
          Each hint used deducts 10% from your final score. Use hints wisely!
        </p>
        {hintsUsed < 3 && (
          <button
            onClick={onUseHint}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Use Hint
          </button>
        )}
      </div>
    </div>
  );
};
