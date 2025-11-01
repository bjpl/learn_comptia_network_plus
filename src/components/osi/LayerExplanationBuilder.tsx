import React, { useState, useCallback } from 'react';
import type { OSILayer, OSILayerNumber, CompletionStatus, DifficultyLevel } from './osi-types';
import { LAYER_FUNCTIONS, PROTOCOLS, PDUS, LAYER_COLORS, LAYER_NAMES } from './osi-data';

interface LayerExplanationBuilderProps {
  onProgressUpdate?: (progress: number) => void;
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Order Layers',
    description: 'Place layers in order with names visible',
    enabled: true,
  },
  {
    level: 2,
    name: 'Numbers Only',
    description: 'Place layers with only numbers shown',
    enabled: false,
  },
  {
    level: 3,
    name: 'Match Protocols',
    description: 'Match protocols to correct layers',
    enabled: false,
  },
  {
    level: 4,
    name: 'Troubleshooting',
    description: 'Match troubleshooting scenarios to layers',
    enabled: false,
  },
  {
    level: 5,
    name: 'Speed Challenge',
    description: 'Complete full stack explanation in under 30 seconds',
    enabled: false,
  },
];

const initialLayers: OSILayer[] = [7, 6, 5, 4, 3, 2, 1].map((num) => ({
  number: num as OSILayerNumber,
  name: LAYER_NAMES[num as OSILayerNumber],
  status: 'empty' as CompletionStatus,
  primaryFunction: '',
  selectedProtocols: [],
  pdu: '',
  interactionExplanation: '',
}));

export const LayerExplanationBuilder: React.FC<LayerExplanationBuilderProps> = ({
  onProgressUpdate,
}) => {
  const [layers, setLayers] = useState<OSILayer[]>(initialLayers);
  const [expandedLayer, setExpandedLayer] = useState<OSILayerNumber | null>(null);
  const [currentLevel] = useState<number>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const calculateLayerCompletion = useCallback((layer: OSILayer): CompletionStatus => {
    let completedFields = 0;
    const totalFields = 4;

    if (layer.primaryFunction) {
      completedFields++;
    }
    if (layer.selectedProtocols.length >= 2) {
      completedFields++;
    }
    if (layer.pdu) {
      completedFields++;
    }
    if (layer.interactionExplanation.split(' ').length >= 20) {
      completedFields++;
    }

    if (completedFields === 0) {
      return 'empty';
    }
    if (completedFields === totalFields) {
      return 'complete';
    }
    return 'partial';
  }, []);

  const updateLayer = useCallback(
    (layerNumber: OSILayerNumber, updates: Partial<OSILayer>) => {
      setLayers((prev) => {
        const newLayers = prev.map((layer) => {
          if (layer.number === layerNumber) {
            const updatedLayer = { ...layer, ...updates };
            updatedLayer.status = calculateLayerCompletion(updatedLayer);
            return updatedLayer;
          }
          return layer;
        });

        // Calculate overall progress
        const completedCount = newLayers.filter((l) => l.status === 'complete').length;
        const progress = (completedCount / 7) * 100;
        onProgressUpdate?.(progress);

        return newLayers;
      });
    },
    [calculateLayerCompletion, onProgressUpdate]
  );

  const toggleProtocol = useCallback(
    (layerNumber: OSILayerNumber, protocolName: string) => {
      const layer = layers.find((l) => l.number === layerNumber);
      if (!layer) {
        return;
      }

      const isSelected = layer.selectedProtocols.includes(protocolName);
      const newProtocols = isSelected
        ? layer.selectedProtocols.filter((p) => p !== protocolName)
        : [...layer.selectedProtocols, protocolName];

      updateLayer(layerNumber, { selectedProtocols: newProtocols });
    },
    [layers, updateLayer]
  );

  const calculateScore = useCallback(() => {
    let totalScore = 0;
    let maxScore = 0;

    layers.forEach((layer) => {
      // Primary function (25%)
      const correctFunction = LAYER_FUNCTIONS[layer.number].find(
        (f) => f.correct && f.id === layer.primaryFunction
      );
      if (correctFunction) {
        totalScore += 25;
      }
      maxScore += 25;

      // Protocols (25%)
      const correctProtocols = PROTOCOLS.filter((p) => p.layer === layer.number).map((p) => p.name);
      const correctSelected = layer.selectedProtocols.filter((p) =>
        correctProtocols.includes(p)
      ).length;
      const incorrectSelected = layer.selectedProtocols.filter(
        (p) => !correctProtocols.includes(p)
      ).length;
      const protocolScore = Math.max(0, correctSelected * 10 - incorrectSelected * 5);
      totalScore += Math.min(25, protocolScore);
      maxScore += 25;

      // PDU (10%)
      const correctPDU = PDUS.find((p) => p.layer === layer.number);
      if (correctPDU && layer.pdu.toLowerCase() === correctPDU.name.toLowerCase()) {
        totalScore += 10;
      }
      maxScore += 10;

      // Explanation (40%)
      const wordCount = layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length;
      if (wordCount >= 150) {
        // Basic quality checks
        const hasUpperLayer =
          layer.number < 7 &&
          layer.interactionExplanation.toLowerCase().includes('layer ' + (layer.number + 1));
        const hasLowerLayer =
          layer.number > 1 &&
          layer.interactionExplanation.toLowerCase().includes('layer ' + (layer.number - 1));
        const qualityScore = (hasUpperLayer ? 20 : 0) + (hasLowerLayer ? 20 : 0);
        totalScore += qualityScore;
      }
      maxScore += 40;
    });

    // Apply hint penalty
    const hintPenalty = hintsUsed * 0.1;
    const finalScore = Math.max(0, (totalScore / maxScore) * 100 * (1 - hintPenalty));
    setScore(Math.round(finalScore));
  }, [layers, hintsUsed]);

  const getStatusIcon = (status: CompletionStatus): string => {
    switch (status) {
      case 'complete':
        return '✓';
      case 'partial':
        return '◐';
      case 'empty':
        return '○';
    }
  };

  const getLayerProtocols = (layerNumber: OSILayerNumber) => {
    return PROTOCOLS.filter((p) => p.layer === layerNumber);
  };

  const getDecoyProtocols = (layerNumber: OSILayerNumber) => {
    return PROTOCOLS.filter((p) => p.layer !== layerNumber).slice(0, 10);
  };

  return (
    <div
      className="layer-explanation-builder"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}
    >
      <div className="header" style={{ marginBottom: '30px' }}>
        <h2>OSI Layer Explanation Builder</h2>
        <div className="stats" style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          <div>
            Level: {currentLevel} - {DIFFICULTY_LEVELS[currentLevel - 1]?.name}
          </div>
          <div>Hints Used: {hintsUsed}/3</div>
          <div>Score: {score}%</div>
          <button
            onClick={calculateScore}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Calculate Score
          </button>
        </div>
      </div>

      <div
        className="layers-container"
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {layers.map((layer) => (
          <div
            key={layer.number}
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
              onClick={() => setExpandedLayer(expandedLayer === layer.number ? null : layer.number)}
              style={{
                padding: '15px',
                backgroundColor: LAYER_COLORS[layer.number],
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              <span>
                Layer {layer.number}: {layer.name}
              </span>
              <span style={{ fontSize: '20px' }}>
                {getStatusIcon(layer.status)} {expandedLayer === layer.number ? '▼' : '▶'}
              </span>
            </div>

            {expandedLayer === layer.number && (
              <div
                className="layer-content"
                style={{ padding: '20px', backgroundColor: '#f9f9f9' }}
              >
                {/* Primary Function Selector */}
                <div className="section" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Primary Function:
                  </label>
                  <select
                    value={layer.primaryFunction}
                    onChange={(e) => updateLayer(layer.number, { primaryFunction: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
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
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Protocols (select 2-3 correct ones):
                  </label>
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
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px',
                            backgroundColor: layer.selectedProtocols.includes(protocol.name)
                              ? '#e3f2fd'
                              : 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: '1px solid #ddd',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={layer.selectedProtocols.includes(protocol.name)}
                            onChange={() => toggleProtocol(layer.number, protocol.name)}
                          />
                          <span>{protocol.name}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {/* PDU Input */}
                <div className="section" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Protocol Data Unit (PDU):
                  </label>
                  <input
                    type="text"
                    value={layer.pdu}
                    onChange={(e) => updateLayer(layer.number, { pdu: e.target.value })}
                    placeholder="Enter the PDU name (e.g., Packet, Frame, Segment, Bits, Data)"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  />
                </div>

                {/* Layer Interaction Explanation */}
                <div className="section">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    Layer Interaction Explanation (minimum 150 words):
                  </label>
                  <textarea
                    value={layer.interactionExplanation}
                    onChange={(e) =>
                      updateLayer(layer.number, { interactionExplanation: e.target.value })
                    }
                    placeholder="Explain how this layer interacts with the layers above and below it..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    Word count:{' '}
                    {layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length} /
                    150
                    {layer.interactionExplanation.split(' ').filter((w) => w.length > 0).length >=
                      150 && (
                      <span style={{ color: '#4CAF50', marginLeft: '10px' }}>
                        ✓ Meets requirement
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="hint-section"
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
        }}
      >
        <h3>Hints Available: {3 - hintsUsed} remaining</h3>
        <p style={{ fontSize: '14px', color: '#856404' }}>
          Each hint used deducts 10% from your final score. Use hints wisely!
        </p>
        {hintsUsed < 3 && (
          <button
            onClick={() => setHintsUsed((h) => h + 1)}
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
