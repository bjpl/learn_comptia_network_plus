/**
 * Enhanced Troubleshooting Scenarios Component
 * Comprehensive troubleshooting training with tools, methodology, and analytics
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { TroubleshootingScenario, ScenarioResponse, OSILayerNumber } from './osi-types';
import { TROUBLESHOOTING_SCENARIOS, LAYER_COLORS, LAYER_NAMES } from './osi-data';
import { TerminalSimulator } from './tools/TerminalSimulator';
import { MethodologyWizard, type MethodologyStep } from './methodology/MethodologyWizard';
import { PerformanceAnalytics, type AnalyticsData } from './analytics/PerformanceAnalytics';
import { SymptomLayerMapping } from './reference/SymptomLayerMapping';

interface TroubleshootingScenariosEnhancedProps {
  onProgressUpdate?: (correct: number, total: number) => void;
}

type ViewMode = 'practice' | 'tools' | 'methodology' | 'analytics' | 'reference' | 'exam';

interface ModeConfig {
  timeLimit: number | null;
  hintsEnabled: boolean;
  wizardEnabled: boolean;
  toolsEnabled: boolean;
  immediateFeedback: boolean;
}

const STUDY_MODE: ModeConfig = {
  timeLimit: null,
  hintsEnabled: true,
  wizardEnabled: true,
  toolsEnabled: true,
  immediateFeedback: true,
};

const EXAM_MODE: ModeConfig = {
  timeLimit: 240, // 4 minutes per scenario
  hintsEnabled: false,
  wizardEnabled: false,
  toolsEnabled: true,
  immediateFeedback: false,
};

export const TroubleshootingScenariosEnhanced: React.FC<TroubleshootingScenariosEnhancedProps> = ({
  onProgressUpdate,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('practice');
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
  const [commandsExecuted, setCommandsExecuted] = useState<number>(0);
  const [sessionStartTime] = useState<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const modeConfig = isExamMode ? EXAM_MODE : STUDY_MODE;

  // Timer for exam mode
  useEffect(() => {
    if (isExamMode && modeConfig.timeLimit) {
      setTimeRemaining(modeConfig.timeLimit);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            // Auto-submit on timeout
            if (prev === 0) {
              handleTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isExamMode, currentScenarioIndex, modeConfig.timeLimit, handleTimeUp]);

  // Track session time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

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
        const keyWords = scenarioExplanationLower.split(' ').filter((word) => word.length > 5);
        const matchedWords = keyWords.filter((word) => explanationLower.includes(word));
        const conceptScore = (matchedWords.length / keyWords.length) * 50;
        score += Math.min(50, conceptScore);
      } else {
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

    const correctCount =
      Array.from(responses.values()).filter(
        (r) =>
          TROUBLESHOOTING_SCENARIOS.find((s) => s.id === r.scenarioId)?.correctLayer ===
          r.selectedLayer
      ).length + (fullResponse.selectedLayer === currentScenario.correctLayer ? 1 : 0);

    onProgressUpdate?.(correctCount, responses.size + 1);

    // Move to next scenario if not at end
    if (currentScenarioIndex < filteredScenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setCurrentResponse({ selectedLayer: null, explanation: '', solution: '' });
      setShowHints(false);
      if (isExamMode) {
        setTimeRemaining(modeConfig.timeLimit);
      }
    }
  }, [
    currentResponse,
    currentScenario,
    currentScenarioIndex,
    filteredScenarios.length,
    calculateScore,
    responses,
    onProgressUpdate,
    isExamMode,
    modeConfig.timeLimit,
  ]);

  const handleTimeUp = useCallback(() => {
    // Auto-submit with current answers
    if (currentResponse.selectedLayer && currentResponse.explanation && currentResponse.solution) {
      submitResponse();
    } else {
      alert('Time up! Moving to next scenario.');
      goToScenario(currentScenarioIndex + 1);
    }
  }, [currentResponse, submitResponse, goToScenario, currentScenarioIndex]);

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
        if (isExamMode) {
          setTimeRemaining(modeConfig.timeLimit);
        }
      }
    },
    [filteredScenarios, responses, isExamMode, modeConfig.timeLimit]
  );

  const handleMethodologyComplete = (steps: MethodologyStep[]) => {
    // Extract insights from methodology wizard
    const step2Theory = steps[1].userInput; // Theory
    const step3Testing = steps[2].userInput; // Testing

    setCurrentResponse((prev) => ({
      ...prev,
      explanation: prev.explanation || step2Theory + '\n\n' + step3Testing,
    }));

    setViewMode('practice');
  };

  const analyticsData: AnalyticsData = {
    responses,
    scenarios: TROUBLESHOOTING_SCENARIOS,
    hintsUsed: usedHints,
    commandsExecuted,
    timeSpent,
  };

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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Header with Mode Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>OSI Troubleshooting Training</h2>

          {/* Study Mode vs Exam Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Mode:</span>
            <button
              onClick={() => setIsExamMode(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: !isExamMode ? '#4CAF50' : '#f5f5f5',
                color: !isExamMode ? '#fff' : '#666',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              📚 Study Mode
            </button>
            <button
              onClick={() => setIsExamMode(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: isExamMode ? '#f44336' : '#f5f5f5',
                color: isExamMode ? '#fff' : '#666',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🎯 Exam Mode
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '2px solid #e0e0e0',
          }}
        >
          {[
            { key: 'practice' as ViewMode, label: '📝 Practice', icon: '' },
            { key: 'tools' as ViewMode, label: '🔧 Tools', icon: '' },
            {
              key: 'methodology' as ViewMode,
              label: '📋 Methodology',
              icon: '',
              disabled: !modeConfig.wizardEnabled,
            },
            { key: 'analytics' as ViewMode, label: '📊 Analytics', icon: '' },
            { key: 'reference' as ViewMode, label: '📚 Reference', icon: '' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => !tab.disabled && setViewMode(tab.key)}
              disabled={tab.disabled}
              style={{
                padding: '12px 24px',
                backgroundColor: viewMode === tab.key ? '#2196F3' : 'transparent',
                color: viewMode === tab.key ? '#fff' : tab.disabled ? '#ccc' : '#666',
                border: 'none',
                borderBottom: viewMode === tab.key ? 'none' : '2px solid transparent',
                borderRadius: '8px 8px 0 0',
                fontWeight: viewMode === tab.key ? 'bold' : 'normal',
                fontSize: '14px',
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Practice View */}
        {viewMode === 'practice' && (
          <div>
            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              <StatCard
                title="Attempted"
                value={`${stats.attempted}/${TROUBLESHOOTING_SCENARIOS.length}`}
                color="#2196F3"
              />
              <StatCard title="Correct" value={stats.correct.toString()} color="#4CAF50" />
              <StatCard
                title="Avg Score"
                value={`${Math.round(stats.avgScore)}%`}
                color="#FF9800"
              />
              {isExamMode && timeRemaining !== null && (
                <StatCard
                  title="Time Remaining"
                  value={formatTime(timeRemaining)}
                  color={timeRemaining < 60 ? '#f44336' : '#2196F3'}
                />
              )}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <FilterSelect
                label="Difficulty"
                value={filterDifficulty}
                onChange={(v) => {
                  setFilterDifficulty(v);
                  setCurrentScenarioIndex(0);
                }}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'easy', label: 'Easy' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'hard', label: 'Hard' },
                ]}
              />
              <FilterSelect
                label="Category"
                value={filterCategory}
                onChange={(v) => {
                  setFilterCategory(v);
                  setCurrentScenarioIndex(0);
                }}
                options={categories.map((cat) => ({
                  value: cat,
                  label: cat === 'all' ? 'All Categories' : cat,
                }))}
              />
            </div>

            {/* Scenario Card */}
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: '2px solid #e0e0e0',
              }}
            >
              <ScenarioHeader scenario={currentScenario} />

              {/* Response Section */}
              <div style={{ marginTop: '30px' }}>
                <LayerSelection
                  selected={currentResponse.selectedLayer ?? null}
                  onSelect={(layer) =>
                    setCurrentResponse((prev) => ({ ...prev, selectedLayer: layer }))
                  }
                />

                <ExplanationInput
                  value={currentResponse.explanation || ''}
                  onChange={(value) =>
                    setCurrentResponse((prev) => ({ ...prev, explanation: value }))
                  }
                />

                <SolutionInput
                  value={currentResponse.solution || ''}
                  onChange={(value) => setCurrentResponse((prev) => ({ ...prev, solution: value }))}
                />

                {/* Hints */}
                {modeConfig.hintsEnabled && (
                  <HintsSection
                    scenario={currentScenario}
                    showHints={showHints}
                    used={usedHints.has(currentScenario.id)}
                    onShowHints={useHint}
                  />
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      onClick={() => goToScenario(currentScenarioIndex - 1)}
                      disabled={currentScenarioIndex === 0}
                      style={navButtonStyle(currentScenarioIndex === 0)}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => goToScenario(currentScenarioIndex + 1)}
                      disabled={currentScenarioIndex >= filteredScenarios.length - 1}
                      style={navButtonStyle(currentScenarioIndex >= filteredScenarios.length - 1)}
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

              {/* Show result if answered and immediate feedback enabled */}
              {responses.has(currentScenario.id) && modeConfig.immediateFeedback && (
                <ResultFeedback
                  response={responses.get(currentScenario.id)!}
                  scenario={currentScenario}
                />
              )}
            </div>

            {/* Scenario Navigation Grid */}
            <ScenarioNavigationGrid
              scenarios={filteredScenarios}
              responses={responses}
              currentIndex={currentScenarioIndex}
              onSelect={goToScenario}
            />
          </div>
        )}

        {/* Tools View */}
        {viewMode === 'tools' && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              height: '600px',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Network Diagnostic Tools</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Practice using network troubleshooting tools with the current scenario:
              <strong> {currentScenario.title}</strong>
            </p>
            <TerminalSimulator
              scenario={currentScenario}
              onCommandExecuted={() => setCommandsExecuted((prev) => prev + 1)}
            />
          </div>
        )}

        {/* Methodology View */}
        {viewMode === 'methodology' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', height: '700px' }}>
            <MethodologyWizard
              scenario={currentScenario}
              onComplete={handleMethodologyComplete}
              onCancel={() => setViewMode('practice')}
            />
          </div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && <PerformanceAnalytics data={analyticsData} />}

        {/* Reference View */}
        {viewMode === 'reference' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
            <SymptomLayerMapping />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: `${color}20`,
        borderRadius: '8px',
        textAlign: 'center',
        border: `2px solid ${color}40`,
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{title}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label style={{ marginRight: '8px', fontWeight: 'bold' }}>{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ScenarioHeader({ scenario }: { scenario: TroubleshootingScenario }) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h3 style={{ margin: 0 }}>{scenario.title}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span
            style={{
              padding: '4px 12px',
              backgroundColor:
                scenario.difficulty === 'easy'
                  ? '#4CAF50'
                  : scenario.difficulty === 'medium'
                    ? '#FF9800'
                    : '#f44336',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {scenario.difficulty.toUpperCase()}
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
            {scenario.category}
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
        {scenario.description}
      </div>
    </div>
  );
}

function LayerSelection({
  selected,
  onSelect,
}: {
  selected: OSILayerNumber | null;
  onSelect: (layer: OSILayerNumber) => void;
}) {
  return (
    <div style={{ marginBottom: '25px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>
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
            onClick={() => onSelect(layer as OSILayerNumber)}
            style={{
              padding: '15px',
              backgroundColor:
                selected === layer ? LAYER_COLORS[layer as OSILayerNumber] : '#f5f5f5',
              border: `2px solid ${selected === layer ? '#000' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: selected === layer ? 'bold' : 'normal',
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
  );
}

function ExplanationInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const wordCount = value.split(' ').filter((w) => w.length > 0).length;

  return (
    <div style={{ marginBottom: '25px' }}>
      <label
        style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}
      >
        2. Explain Your Reasoning (50% of score, minimum 100 words):
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Explain why this problem occurs at the layer you selected..."
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
      <div
        style={{ marginTop: '5px', fontSize: '12px', color: wordCount >= 100 ? '#4CAF50' : '#666' }}
      >
        Word count: {wordCount} / 100
        {wordCount >= 100 && <span style={{ marginLeft: '10px' }}>✓ Meets requirement</span>}
      </div>
    </div>
  );
}

function SolutionInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const wordCount = value.split(' ').filter((w) => w.length > 0).length;

  return (
    <div style={{ marginBottom: '25px' }}>
      <label
        style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}
      >
        3. Suggest a Layer-Appropriate Solution (30% of score, minimum 50 words):
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      <div
        style={{ marginTop: '5px', fontSize: '12px', color: wordCount >= 50 ? '#4CAF50' : '#666' }}
      >
        Word count: {wordCount} / 50
        {wordCount >= 50 && <span style={{ marginLeft: '10px' }}>✓ Meets requirement</span>}
      </div>
    </div>
  );
}

function HintsSection({
  scenario,
  showHints,
  used,
  onShowHints,
}: {
  scenario: TroubleshootingScenario;
  showHints: boolean;
  used: boolean;
  onShowHints: () => void;
}) {
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
}

function ResultFeedback({
  response,
  scenario,
}: {
  response: ScenarioResponse;
  scenario: TroubleshootingScenario;
}) {
  const isCorrect = response.selectedLayer === scenario.correctLayer;

  return (
    <div
      style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: isCorrect ? '#e8f5e9' : '#ffebee',
        borderRadius: '8px',
        border: `2px solid ${isCorrect ? '#4CAF50' : '#f44336'}`,
      }}
    >
      <h4 style={{ marginTop: 0 }}>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h4>
      <p>
        <strong>Correct Layer:</strong> Layer {scenario.correctLayer} (
        {LAYER_NAMES[scenario.correctLayer]})
      </p>
      <p>
        <strong>Explanation:</strong> {scenario.explanation}
      </p>
      <p style={{ marginBottom: 0 }}>
        <strong>Your Score:</strong> {response.score}/100
      </p>
    </div>
  );
}

function ScenarioNavigationGrid({
  scenarios,
  responses,
  currentIndex,
  onSelect,
}: {
  scenarios: TroubleshootingScenario[];
  responses: Map<string, ScenarioResponse>;
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
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
        Scenario Progress ({currentIndex + 1} of {scenarios.length})
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
          gap: '8px',
          marginTop: '15px',
        }}
      >
        {scenarios.map((scenario, index) => {
          const response = responses.get(scenario.id);
          const isCorrect = response?.selectedLayer === scenario.correctLayer;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(index)}
              style={{
                padding: '10px',
                backgroundColor: response
                  ? isCorrect
                    ? '#4CAF50'
                    : '#f44336'
                  : index === currentIndex
                    ? '#2196F3'
                    : '#f5f5f5',
                color: response || index === currentIndex ? 'white' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: index === currentIndex ? 'bold' : 'normal',
              }}
              title={scenario.title}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function navButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '12px 24px',
    backgroundColor: disabled ? '#ccc' : '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default TroubleshootingScenariosEnhanced;
