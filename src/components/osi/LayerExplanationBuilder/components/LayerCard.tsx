import React from 'react';
import type { OSILayer, OSILayerNumber } from '../../osi-types';
import { LAYER_COLORS, LAYER_FUNCTIONS } from '../../osi-data';
import { getStatusIcon, getLayerProtocols, getDecoyProtocols } from '../utils';

interface LayerCardProps {
  layer: OSILayer;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (layerNumber: OSILayerNumber, updates: Partial<OSILayer>) => void;
  onToggleProtocol: (layerNumber: OSILayerNumber, protocolName: string) => void;
}

export const LayerCard: React.FC<LayerCardProps> = ({
  layer,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onToggleProtocol,
}) => {
  return (
    <div
      className="layer-section"
      style={{
        border: `2px solid ${LAYER_COLORS[layer.number]}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
      }}
    >
      <div
        className="layer-header"
        onClick={onToggleExpand}
        style={{
          padding: '15px',
          backgroundColor: LAYER_COLORS[layer.number],
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        <span>
          Layer {layer.number}: {layer.name}
        </span>
        <span style={{ fontSize: '20px' }}>
          {getStatusIcon(layer.status)} {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="layer-content bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" style={{ padding: '20px' }}>
          {/* Primary Function Selector */}
          <div className="section" style={{ marginBottom: '20px' }}>
            <label
              htmlFor={`primary-function-${layer.number}`}
              className="text-gray-900 dark:text-gray-100"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
            >
              Primary Function:
            </label>
            <select
              id={`primary-function-${layer.number}`}
              value={layer.primaryFunction}
              onChange={(e) => onUpdate(layer.number, { primaryFunction: e.target.value })}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            >
              <option value="">Select a function...</option>
              {LAYER_FUNCTIONS[layer.number].map((func) => (
                <option key={func.id} value={func.id}>
                  {func.label}
                </option>
              ))}
            </select>
          </div>

          {/* Protocol Checkbox Grid */}
          <div className="section" style={{ marginBottom: '20px' }}>
            <div className="text-gray-900 dark:text-gray-100" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
              Protocols (select 2-3 correct ones):
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px',
              }}
            >
              {[...getLayerProtocols(layer.number), ...getDecoyProtocols(layer.number)]
                .sort(() => Math.random() - 0.5)
                .map((protocol) => (
                  <label
                    key={protocol.name}
                    className={`${
                      layer.selectedProtocols.includes(protocol.name)
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    } text-gray-900 dark:text-gray-100`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={layer.selectedProtocols.includes(protocol.name)}
                      onChange={() => onToggleProtocol(layer.number, protocol.name)}
                    />
                    <span>{protocol.name}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* PDU Input */}
          <div className="section" style={{ marginBottom: '20px' }}>
            <label
              htmlFor={`pdu-${layer.number}`}
              className="text-gray-900 dark:text-gray-100"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
            >
              Protocol Data Unit (PDU):
            </label>
            <input
              id={`pdu-${layer.number}`}
              type="text"
              value={layer.pdu}
              onChange={(e) => onUpdate(layer.number, { pdu: e.target.value })}
              placeholder="Enter the PDU name (e.g., Packet, Frame, Segment, Bits, Data)"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            />
          </div>

          {/* Layer Interaction Explanation */}
          <div className="section">
            <label
              htmlFor={`interaction-${layer.number}`}
              className="text-gray-900 dark:text-gray-100"
              style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
            >
              Layer Interaction Explanation (minimum 150 words):
            </label>
            <textarea
              id={`interaction-${layer.number}`}
              value={layer.interactionExplanation}
              onChange={(e) => onUpdate(layer.number, { interactionExplanation: e.target.value })}
              placeholder="Explain how this layer interacts with the layers above and below it..."
              rows={6}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                borderRadius: '4px',
                borderWidth: '1px',
                borderStyle: 'solid',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div
              className="text-gray-800 dark:text-gray-200"
              style={{ marginTop: '5px', fontSize: '12px' }}
            >
              Word count:{' '}
              {layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length} / 150
              {layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length >= 150 && (
                <span className="text-green-600 dark:text-green-400" style={{ marginLeft: '10px' }}>
                  ✓ Meets requirement
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
