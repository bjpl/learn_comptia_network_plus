/**
 * PracticeView Component
 */

import React from 'react';
import type { TroubleshootingScenario, ScenarioResponse } from '../../osi-types';
import type { ModeConfig } from '../types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';
import { StatCard } from './StatCard';
import { FilterSelect } from './FilterSelect';
import { ScenarioHeader } from './ScenarioHeader';
import { LayerSelection } from './LayerSelection';
import { ExplanationInput } from './ExplanationInput';
import { SolutionInput } from './SolutionInput';
import { HintsSection } from './HintsSection';
import { ResultFeedback } from './ResultFeedback';
import { ScenarioNavigationGrid } from './ScenarioNavigationGrid';
import { formatTime, navButtonStyle } from '../utils/formatters';

interface PracticeViewProps {
  currentScenario: TroubleshootingScenario;
  currentScenarioIndex: number;
  filteredScenarios: TroubleshootingScenario[];
  currentResponse: Partial<ScenarioResponse>;
  responses: Map<string, ScenarioResponse>;
  showHints: boolean;
  usedHints: Set<string>;
  filterDifficulty: string;
  filterCategory: string;
  isExamMode: boolean;
  timeRemaining: number | null;
  modeConfig: ModeConfig;
  stats: { attempted: number; correct: number; avgScore: number };
  categories: string[];
  onCurrentResponseChange: (response: Partial<ScenarioResponse>) => void;
  onFilterDifficultyChange: (value: string) => void;
  onFilterCategoryChange: (value: string) => void;
  onUseHint: () => void;
  onGoToScenario: (index: number) => void;
  onSubmitResponse: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  currentScenario,
  currentScenarioIndex,
  filteredScenarios,
  currentResponse,
  responses,
  showHints,
  usedHints,
  filterDifficulty,
  filterCategory,
  isExamMode,
  timeRemaining,
  modeConfig,
  stats,
  categories,
  onCurrentResponseChange,
  onFilterDifficultyChange,
  onFilterCategoryChange,
  onUseHint,
  onGoToScenario,
  onSubmitResponse,
}) => {
  return (
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
        <StatCard title="Avg Score" value={`${Math.round(stats.avgScore)}%`} color="#FF9800" />
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
          onChange={onFilterDifficultyChange}
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
          onChange={onFilterCategoryChange}
          options={categories.map((cat) => ({
            value: cat,
            label: cat === 'all' ? 'All Categories' : cat,
          }))}
        />
      </div>

      {/* Scenario Card */}
      <div
        className="bg-white dark:bg-gray-800"
        style={{
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
              onCurrentResponseChange({ ...currentResponse, selectedLayer: layer })
            }
          />

          <ExplanationInput
            value={currentResponse.explanation || ''}
            onChange={(value) =>
              onCurrentResponseChange({ ...currentResponse, explanation: value })
            }
          />

          <SolutionInput
            value={currentResponse.solution || ''}
            onChange={(value) => onCurrentResponseChange({ ...currentResponse, solution: value })}
          />

          {/* Hints */}
          {modeConfig.hintsEnabled && (
            <HintsSection
              scenario={currentScenario}
              showHints={showHints}
              used={usedHints.has(currentScenario.id)}
              onShowHints={onUseHint}
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
                onClick={() => onGoToScenario(currentScenarioIndex - 1)}
                disabled={currentScenarioIndex === 0}
                style={navButtonStyle(currentScenarioIndex === 0)}
              >
                ← Previous
              </button>
              <button
                onClick={() => onGoToScenario(currentScenarioIndex + 1)}
                disabled={currentScenarioIndex >= filteredScenarios.length - 1}
                style={navButtonStyle(currentScenarioIndex >= filteredScenarios.length - 1)}
              >
                Next →
              </button>
            </div>

            <button
              onClick={onSubmitResponse}
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
        onSelect={onGoToScenario}
      />
    </div>
  );
};
