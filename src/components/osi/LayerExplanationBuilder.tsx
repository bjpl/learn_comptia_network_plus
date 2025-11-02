import React, { useState, useCallback, useMemo } from 'react';
import type { OSILayer, OSILayerNumber, CompletionStatus, DifficultyLevel } from './osi-types';
import { LAYER_FUNCTIONS, PROTOCOLS, PDUS, LAYER_COLORS, LAYER_NAMES } from './osi-data';

interface LayerExplanationBuilderProps {
  onProgressUpdate?: (progress: number) => void;
}

interface QuizQuestion {
  id: string;
  layer: OSILayerNumber;
  question: string;
  correctAnswer: string;
  options: string[];
}

interface RealWorldExample {
  title: string;
  layer: OSILayerNumber;
  scenario: string;
  protocols: string[];
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Layer Builder',
    description: 'Interactive layer-by-layer builder with guidance',
    enabled: true,
  },
  {
    level: 2,
    name: 'Protocol Master',
    description: 'Advanced protocol and layer matching',
    enabled: true,
  },
  {
    level: 3,
    name: 'Real-World Examples',
    description: 'Learn with practical networking scenarios',
    enabled: true,
  },
  {
    level: 4,
    name: 'Quiz Mode',
    description: 'Test your layer knowledge with questions',
    enabled: true,
  },
  {
    level: 5,
    name: 'Export & Review',
    description: 'Generate study notes and review materials',
    enabled: true,
  },
];

const REAL_WORLD_EXAMPLES: RealWorldExample[] = [
  {
    title: 'Web Browsing',
    layer: 7,
    scenario: 'User accesses HTTPS website. Browser uses HTTP/HTTPS to request web pages.',
    protocols: ['HTTP', 'HTTPS', 'DNS'],
  },
  {
    title: 'Email Transfer',
    layer: 7,
    scenario: 'Sending email through mail client. Uses SMTP for sending, POP3/IMAP for receiving.',
    protocols: ['SMTP', 'POP3', 'IMAP', 'DNS'],
  },
  {
    title: 'Data Encryption',
    layer: 6,
    scenario: 'Banking transaction. Data encrypted with TLS/SSL. Character encoding to UTF-8.',
    protocols: ['TLS/SSL', 'SSH'],
  },
  {
    title: 'Video Call',
    layer: 5,
    scenario: 'SIP establishes session. Maintains connection. Coordinates media negotiation.',
    protocols: ['SIP', 'H.323'],
  },
  {
    title: 'File Download',
    layer: 4,
    scenario: 'TCP 3-way handshake. Segments large files. Reassembles at destination.',
    protocols: ['TCP', 'UDP'],
  },
  {
    title: 'Routing',
    layer: 3,
    scenario:
      'Router receives packet. Examines IP header. Forwards to next hop based on routing table.',
    protocols: ['IP', 'ICMP', 'OSPF', 'BGP'],
  },
  {
    title: 'Switch Operation',
    layer: 2,
    scenario:
      'Switch learns MAC addresses. Forwards frames based on MAC table. Prevents loops via STP.',
    protocols: ['Ethernet', 'VLAN', 'STP'],
  },
  {
    title: 'Cable Transmission',
    layer: 1,
    scenario:
      'Data converted to electrical signals. Transmitted over twisted pair or fiber. Received and decoded.',
    protocols: ['Ethernet', '10BaseT', 'Fiber Optic'],
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    layer: 7,
    question: 'Which of these is an application layer protocol?',
    correctAnswer: 'HTTP',
    options: ['HTTP', 'IP', 'Ethernet', 'TCP'],
  },
  {
    id: 'q2',
    layer: 4,
    question: 'Which transport protocol provides reliable delivery?',
    correctAnswer: 'TCP',
    options: ['TCP', 'IP', 'ICMP', 'ARP'],
  },
  {
    id: 'q3',
    layer: 3,
    question: 'Which protocol is used for IP address resolution?',
    correctAnswer: 'ARP',
    options: ['ARP', 'DNS', 'DHCP', 'IGMP'],
  },
  {
    id: 'q4',
    layer: 2,
    question: 'What is the PDU at the Data Link layer called?',
    correctAnswer: 'Frame',
    options: ['Frame', 'Packet', 'Segment', 'Bit'],
  },
  {
    id: 'q5',
    layer: 1,
    question: 'Layer 1 deals with what type of signals?',
    correctAnswer: 'Electrical/Optical',
    options: ['Electrical/Optical', 'IP Addresses', 'MAC Addresses', 'Applications'],
  },
  {
    id: 'q6',
    layer: 6,
    question: 'Which is a function of the Presentation layer?',
    correctAnswer: 'Data encryption',
    options: ['Data encryption', 'IP addressing', 'Routing', 'Frame creation'],
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
  const [currentMode, setCurrentMode] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [selectedExample, setSelectedExample] = useState<number>(0);

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

  const calculateQuizScore = useCallback(() => {
    let correctAnswers = 0;
    QUIZ_QUESTIONS.forEach((question) => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / QUIZ_QUESTIONS.length) * 100);
  }, [quizAnswers]);

  const generateStudyNotes = useCallback(() => {
    const notes: string[] = [
      '=== OSI MODEL STUDY NOTES ===\n',
      new Date().toLocaleDateString(),
      '\n---\n',
    ];

    layers.forEach((layer) => {
      notes.push(`LAYER ${layer.number}: ${layer.name}`);
      notes.push(`Status: ${layer.status}`);
      if (layer.primaryFunction) {
        notes.push(`Primary Function: ${layer.primaryFunction}`);
      }
      if (layer.selectedProtocols.length > 0) {
        notes.push(`Protocols: ${layer.selectedProtocols.join(', ')}`);
      }
      if (layer.pdu) {
        notes.push(`PDU: ${layer.pdu}`);
      }
      if (layer.interactionExplanation) {
        notes.push(`Notes: ${layer.interactionExplanation}`);
      }
      notes.push('---\n');
    });

    notes.push(`\nScore: ${score}%`);
    notes.push(`Hints Used: ${hintsUsed}`);

    return notes.join('\n');
  }, [layers, score, hintsUsed]);

  const exportAsText = useCallback(() => {
    const notes = generateStudyNotes();
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(notes)}`);
    element.setAttribute('download', 'OSI_Layer_Study_Notes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [generateStudyNotes]);

  const currentExample = useMemo(() => REAL_WORLD_EXAMPLES[selectedExample], [selectedExample]);

  return (
    <div
      className="layer-explanation-builder"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
      {/* Enhanced Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>OSI Layer Explanation Builder</h2>
        <p className="text-gray-700 dark:text-gray-300" style={{ marginBottom: '20px' }}>
          Master the OSI model through interactive learning. Choose your preferred learning mode
          below.
        </p>

        {/* Mode Selection Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.level}
              onClick={() => setCurrentMode(level.level as 1 | 2 | 3 | 4 | 5)}
              style={{
                padding: '10px 20px',
                backgroundColor: currentMode === level.level ? '#2196F3' : '#e0e0e0',
                color: currentMode === level.level ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currentMode === level.level ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
              }}
              title={level.description}
            >
              {level.level}. {level.name}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            Hints Used: {hintsUsed}/3
          </div>
          <div style={{ padding: '10px 15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            Current Score: {score}%
          </div>
          <button
            onClick={calculateScore}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Calculate Score
          </button>
        </div>
      </div>

      {/* Mode 1: Layer Builder */}
      {currentMode === 1 && (
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
                onClick={() =>
                  setExpandedLayer(expandedLayer === layer.number ? null : layer.number)
                }
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
                    <label
                      htmlFor={`primary-function-${layer.number}`}
                      style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
                    >
                      Primary Function:
                    </label>
                    <select
                      id={`primary-function-${layer.number}`}
                      value={layer.primaryFunction}
                      onChange={(e) =>
                        updateLayer(layer.number, { primaryFunction: e.target.value })
                      }
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
                    <div style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
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
                    <label
                      htmlFor={`pdu-${layer.number}`}
                      style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
                    >
                      Protocol Data Unit (PDU):
                    </label>
                    <input
                      id={`pdu-${layer.number}`}
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
                    <label
                      htmlFor={`interaction-${layer.number}`}
                      style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}
                    >
                      Layer Interaction Explanation (minimum 150 words):
                    </label>
                    <textarea
                      id={`interaction-${layer.number}`}
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
                    <div
                      className="text-gray-800 dark:text-gray-200"
                      style={{ marginTop: '5px', fontSize: '12px' }}
                    >
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
      )}

      {/* Mode 2: Protocol Master */}
      {currentMode === 2 && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Match Protocols to Layers</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
              const layer = layerNum as OSILayerNumber;
              return (
                <div
                  key={layer}
                  style={{
                    border: `2px solid ${LAYER_COLORS[layer]}`,
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: `${LAYER_COLORS[layer]}15`,
                  }}
                >
                  <h4 style={{ color: LAYER_COLORS[layer], marginBottom: '10px' }}>
                    Layer {layer}: {LAYER_NAMES[layer]}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getLayerProtocols(layer).map((protocol) => (
                      <span
                        key={protocol.name}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: LAYER_COLORS[layer],
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {protocol.name}
                        {protocol.port && ` :${protocol.port}`}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 3: Real-World Examples */}
      {currentMode === 3 && (
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
                style={{
                  padding: '12px',
                  backgroundColor:
                    selectedExample === idx ? LAYER_COLORS[example.layer] : '#f0f0f0',
                  color: selectedExample === idx ? 'white' : '#333',
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
              <h4 style={{ color: LAYER_COLORS[currentExample.layer], marginBottom: '10px' }}>
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
      )}

      {/* Mode 4: Quiz Mode */}
      {currentMode === 4 && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Test Your Layer Knowledge</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {QUIZ_QUESTIONS.map((question) => (
              <div
                key={question.id}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#fafafa',
                }}
              >
                <p style={{ fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                  {question.question}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: option })}
                      style={{
                        padding: '10px',
                        backgroundColor:
                          quizAnswers[question.id] === option ? '#4CAF50' : '#e0e0e0',
                        color: quizAnswers[question.id] === option ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: quizAnswers[question.id] === option ? 'bold' : 'normal',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => setScore(calculateQuizScore())}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                marginTop: '20px',
              }}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* Mode 5: Export & Review */}
      {currentMode === 5 && (
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
              Generate downloadable study notes containing all your layer definitions, protocols,
              PDUs, and notes.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={exportAsText}
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
                onClick={() => {
                  const notes = generateStudyNotes();
                  alert('Preview:\n\n' + notes.substring(0, 500) + '...');
                }}
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
                  <div style={{ fontWeight: 'bold', color: LAYER_COLORS[layer.number] }}>
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
      )}
    </div>
  );
};

export default LayerExplanationBuilder;
