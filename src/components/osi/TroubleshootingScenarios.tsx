import React, { useState, useCallback, useMemo } from 'react';
import type { TroubleshootingScenario, ScenarioResponse, OSILayerNumber } from './osi-types';
import { TROUBLESHOOTING_SCENARIOS, LAYER_COLORS, LAYER_NAMES } from './osi-data';

interface TroubleshootingScenariosProps {
  onProgressUpdate?: (correct: number, total: number) => void;
}

export const TroubleshootingScenarios: React.FC<TroubleshootingScenariosProps> = ({
  onProgressUpdate,
}) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [responses, setResponses] = useState<Map<string, ScenarioResponse>>(new Map());
  const [currentResponse, setCurrentResponse] = useState<Partial<ScenarioResponse>>({
    selectedLayer: null,
    explanation: '',
    solution: '',
  });
  const [showHints, setShowHints] = useState<boolean>(false);
  const [usedHints, setUsedHints] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const currentScenario = useMemo(() => {
    const filtered = TROUBLESHOOTING_SCENARIOS.filter((scenario) => {
      const difficultyMatch =
        filterDifficulty === 'all' || scenario.difficulty === filterDifficulty;
      const categoryMatch = filterCategory === 'all' || scenario.category === filterCategory;
      return difficultyMatch && categoryMatch;
    });
    return filtered[currentScenarioIndex] || TROUBLESHOOTING_SCENARIOS[0];
  }, [currentScenarioIndex, filterDifficulty, filterCategory]);

  const filteredScenarios = useMemo(() => {
    return TROUBLESHOOTING_SCENARIOS.filter((scenario) => {
      const difficultyMatch =
        filterDifficulty === 'all' || scenario.difficulty === filterDifficulty;
      const categoryMatch = filterCategory === 'all' || scenario.category === filterCategory;
      return difficultyMatch && categoryMatch;
    });
  }, [filterDifficulty, filterCategory]);

  const calculateScore = useCallback(
    (scenario: TroubleshootingScenario, response: ScenarioResponse): number => {
      let score = 0;

      // Layer identification (20%)
      if (response.selectedLayer === scenario.correctLayer) {
        score += 20;
      }

      // Explanation quality (50%)
      if (response.explanation.length >= 100) {
        const explanationLower = response.explanation.toLowerCase();
        const scenarioExplanationLower = scenario.explanation.toLowerCase();

        // Check for key concepts from correct explanation
        const keyWords = scenarioExplanationLower.split(' ').filter((word) => word.length > 5);
        const matchedWords = keyWords.filter((word) => explanationLower.includes(word));
        const conceptScore = (matchedWords.length / keyWords.length) * 50;

        score += Math.min(50, conceptScore);
      } else {
        // Partial credit for shorter explanations
        score += (response.explanation.length / 100) * 25;
      }

      // Solution appropriateness (30%)
      if (response.solution.length >= 50) {
        score += 30;
      } else {
        score += (response.solution.length / 50) * 30;
      }

      return Math.round(score);
    },
    []
  );

  const submitResponse = useCallback(() => {
    if (
      !currentResponse.selectedLayer ||
      !currentResponse.explanation ||
      !currentResponse.solution
    ) {
      alert('Please complete all fields before submitting.');
      return;
    }

    const fullResponse: ScenarioResponse = {
      scenarioId: currentScenario.id,
      selectedLayer: currentResponse.selectedLayer,
      explanation: currentResponse.explanation,
      solution: currentResponse.solution,
      score: 0,
    };

    fullResponse.score = calculateScore(currentScenario, fullResponse);

    setResponses((prev) => new Map(prev).set(currentScenario.id, fullResponse));

    // Update progress
    const correctCount =
      Array.from(responses.values()).filter(
        (r) =>
          TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
          r.selectedLayer
      ).length + (fullResponse.selectedLayer === currentScenario.correctLayer ? 1 : 0);

    onProgressUpdate?.(correctCount, responses.size + 1);

    // Move to next scenario
    if (currentScenarioIndex < filteredScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
      setShowHints(false);
    }
  }, [
    currentResponse,
    currentScenario,
    currentScenarioIndex,
    filteredScenarios.length,
    calculateScore,
    responses,
    onProgressUpdate,
  ]);

  const useHint = useCallback(() => {
    setUsedHints((prev) => new Set(prev).add(currentScenario.id));
    setShowHints(true);
  }, [currentScenario.id]);

  const goToScenario = useCallback(
    (index: number) => {
      if (index >= 0 && index < filteredScenarios.length) {
        setCurrentScenarioIndex(index);
        const existingResponse = responses.get(filteredScenarios[index].id);
        if (existingResponse) {
          setCurrentResponse(existingResponse);
        } else {
          setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
        }
        setShowHints(false);
      }
    },
    [filteredScenarios, responses]
  );

  const stats = useMemo(() => {
    const attempted = responses.size;
    const correct = Array.from(responses.values()).filter(
      (r) =>
        TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
        r.selectedLayer
    ).length;
    const avgScore =
      attempted > 0
        ? Array.from(responses.values()).reduce((sum, r) => sum + (r.score || 0), 0) / attempted
        : 0;

    return { attempted, correct, avgScore };
  }, [responses]);

  const categories = useMemo(() => {
    return ['all', ...new Set(TROUBLESHOOTING_SCENARIOS.map((s) => s.category))];
  }, []);

  return (
    <div
      className="troubleshooting-scenarios"
      style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}
    >
      <div className="header" style={{ marginBottom: '30px' }}>
        <h2>OSI Troubleshooting Scenario Bank</h2>

        <div
          className="stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              padding: '15px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {stats.attempted}/{TROUBLESHOOTING_SCENARIOS.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Scenarios Attempted</div>
          </div>

          <div
            style={{
              padding: '15px',
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.correct}</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Correct Layer IDs</div>
          </div>

          <div
            style={{
              padding: '15px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {Math.round(stats.avgScore)}%
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Average Score</div>
          </div>
        </div>

        <div
          className="filters"
          style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}
        >
          <div>
            <label htmlFor="difficulty-filter" style={{ marginRight: '8px', fontWeight: 'bold' }}>
              Difficulty:
            </label>
            <select
              id="difficulty-filter"
              value={filterDifficulty}
              onChange={(e) => {
                setFilterDifficulty(e.target.value);
                setCurrentScenarioIndex(0);
              }}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="category-filter" style={{ marginRight: '8px', fontWeight: 'bold' }}>
              Category:
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentScenarioIndex(0);
              }}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className="scenario-card"
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '2px solid #e0e0e0',
        }}
      >
        <div className="scenario-header" style={{ marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h3 style={{ margin: 0 }}>{currentScenario.title}</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span
                style={{
                  padding: '4px 12px',
                  backgroundColor:
                    currentScenario.difficulty === 'easy'
                      ? '#4CAF50'
                      : currentScenario.difficulty === 'medium'
                        ? '#FF9800'
                        : '#f44336',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {currentScenario.difficulty.toUpperCase()}
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              >
                {currentScenario.category}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            {currentScenario.description}
          </div>
        </div>

        <div className="response-section" style={{ marginTop: '30px' }}>
          {/* Layer Selection */}
          <div className="layer-selection" style={{ marginBottom: '25px' }}>
            <div
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '10px',
                fontSize: '16px',
              }}
            >
              1. Identify the OSI Layer (20% of score):
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '10px',
              }}
            >
              {[7, 6, 5, 4, 3, 2, 1].map((layer) => (
                <button
                  key={layer}
                  onClick={() =>
                    setCurrentResponse((prev) => ({
                      ...prev,
                      selectedLayer: layer as OSILayerNumber,
                    }))
                  }
                  style={{
                    padding: '15px',
                    backgroundColor:
                      currentResponse.selectedLayer === layer ? LAYER_COLORS[layer] : '#f5f5f5',
                    border: `2px solid ${currentResponse.selectedLayer === layer ? '#000' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: currentResponse.selectedLayer === layer ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '18px' }}>Layer {layer}</div>
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>
                    {LAYER_NAMES[layer as OSILayerNumber]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="explanation-section" style={{ marginBottom: '25px' }}>
            <label
              htmlFor="explanation-text"
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '10px',
                fontSize: '16px',
              }}
            >
              2. Explain Your Reasoning (50% of score, minimum 100 words):
            </label>
            <textarea
              id="explanation-text"
              value={currentResponse.explanation}
              onChange={(e) =>
                setCurrentResponse((prev) => ({ ...prev, explanation: e.target.value }))
              }
              placeholder="Explain why this problem occurs at the layer you selected. Include technical details and reasoning..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
              Word count:{' '}
              {currentResponse.explanation?.split(' ').filter((w) => w.length > 0).length || 0} /
              100
              {(currentResponse.explanation?.split(' ').filter((w) => w.length > 0).length || 0) >=
                100 && (
                <span style={{ color: '#4CAF50', marginLeft: '10px' }}>✓ Meets requirement</span>
              )}
            </div>
          </div>

          {/* Solution */}
          <div className="solution-section" style={{ marginBottom: '25px' }}>
            <label
              htmlFor="solution-text"
              style={{
                display: 'block',
                fontWeight: 'bold',
                marginBottom: '10px',
                fontSize: '16px',
              }}
            >
              3. Suggest a Layer-Appropriate Solution (30% of score, minimum 50 words):
            </label>
            <textarea
              id="solution-text"
              value={currentResponse.solution}
              onChange={(e) =>
                setCurrentResponse((prev) => ({ ...prev, solution: e.target.value }))
              }
              placeholder="Provide a solution appropriate for this OSI layer..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
            <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
              Word count:{' '}
              {currentResponse.solution?.split(' ').filter((w) => w.length > 0).length || 0} / 50
              {(currentResponse.solution?.split(' ').filter((w) => w.length > 0).length || 0) >=
                50 && (
                <span style={{ color: '#4CAF50', marginLeft: '10px' }}>✓ Meets requirement</span>
              )}
            </div>
          </div>

          {/* Hints Section */}
          <div
            className="hints-section"
            style={{
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffc107',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>
                Hints Available: {usedHints.has(currentScenario.id) ? 'Used' : 'Not Used'}
              </h4>
              {!showHints && !usedHints.has(currentScenario.id) && (
                <button
                  onClick={useHint}
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
                {currentScenario.hints.map((hint, index) => (
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => goToScenario(currentScenarioIndex - 1)}
                disabled={currentScenarioIndex === 0}
                style={{
                  padding: '12px 24px',
                  backgroundColor: currentScenarioIndex === 0 ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentScenarioIndex === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ← Previous
              </button>

              <button
                onClick={() => goToScenario(currentScenarioIndex + 1)}
                disabled={currentScenarioIndex >= filteredScenarios.length - 1}
                style={{
                  padding: '12px 24px',
                  backgroundColor:
                    currentScenarioIndex >= filteredScenarios.length - 1 ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor:
                    currentScenarioIndex >= filteredScenarios.length - 1
                      ? 'not-allowed'
                      : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Next →
              </button>
            </div>

            <button
              onClick={submitResponse}
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
        </div>

        {/* Show result if already answered */}
        {responses.has(currentScenario.id) && (
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor:
                responses.get(currentScenario.id)?.selectedLayer === currentScenario.correctLayer
                  ? '#e8f5e9'
                  : '#ffebee',
              borderRadius: '8px',
              border: `2px solid ${responses.get(currentScenario.id)?.selectedLayer === currentScenario.correctLayer ? '#4CAF50' : '#f44336'}`,
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              {responses.get(currentScenario.id)?.selectedLayer === currentScenario.correctLayer
                ? '✓ Correct!'
                : '✗ Incorrect'}
            </h4>
            <p>
              <strong>Correct Layer:</strong> Layer {currentScenario.correctLayer} (
              {LAYER_NAMES[currentScenario.correctLayer]})
            </p>
            <p>
              <strong>Explanation:</strong> {currentScenario.explanation}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Your Score:</strong> {responses.get(currentScenario.id)?.score || 0}/100
            </p>
          </div>
        )}
      </div>

      {/* Scenario Navigation */}
      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h4 style={{ marginTop: 0 }}>
          Scenario Progress ({currentScenarioIndex + 1} of {filteredScenarios.length})
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
            gap: '8px',
            marginTop: '15px',
          }}
        >
          {filteredScenarios.map((scenario, index) => {
            const response = responses.get(scenario.id);
            const isCorrect = response?.selectedLayer === scenario.correctLayer;

            return (
              <button
                key={scenario.id}
                onClick={() => goToScenario(index)}
                style={{
                  padding: '10px',
                  backgroundColor: response
                    ? isCorrect
                      ? '#4CAF50'
                      : '#f44336'
                    : index === currentScenarioIndex
                      ? '#2196F3'
                      : '#f5f5f5',
                  color: response || index === currentScenarioIndex ? 'white' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: index === currentScenarioIndex ? 'bold' : 'normal',
                }}
                title={scenario.title}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
