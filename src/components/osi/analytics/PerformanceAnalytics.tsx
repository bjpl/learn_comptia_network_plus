/**
 * Performance Analytics Dashboard for Troubleshooting Scenarios
 * Tracks student performance, identifies weak areas, predicts exam readiness
 */

import React, { useMemo } from 'react';
import type { OSILayerNumber, TroubleshootingScenario, ScenarioResponse } from '../osi-types';
import { LAYER_NAMES, LAYER_COLORS } from '../osi-data';

export interface LayerStats {
  layer: OSILayerNumber;
  scenariosAttempted: number;
  scenariosCorrect: number;
  accuracyRate: number;
  averageScore: number;
}

export interface AnalyticsData {
  responses: Map<string, ScenarioResponse>;
  scenarios: TroubleshootingScenario[];
  hintsUsed: Set<string>;
  commandsExecuted: number;
  timeSpent: number;
}

interface PerformanceAnalyticsProps {
  data: AnalyticsData;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ data }) => {
  const analytics = useMemo(() => calculateAnalytics(data), [data]);

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Performance Analytics</h2>

      {/* Overall Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '30px',
        }}
      >
        <StatCard
          title="Exam Readiness"
          value={`${analytics.examReadinessScore}%`}
          subtitle={getReadinessText(analytics.examReadinessScore)}
          color={getReadinessColor(analytics.examReadinessScore)}
          icon="🎯"
        />
        <StatCard
          title="Overall Accuracy"
          value={`${analytics.overallAccuracy.toFixed(1)}%`}
          subtitle={`${analytics.correctCount}/${analytics.attemptedCount} correct`}
          color="#4CAF50"
          icon="✓"
        />
        <StatCard
          title="Average Score"
          value={`${analytics.averageScore.toFixed(0)}/100`}
          subtitle="across all scenarios"
          color="#2196F3"
          icon="📊"
        />
        <StatCard
          title="Time per Scenario"
          value={formatTime(analytics.avgTimePerScenario)}
          subtitle={analytics.avgTimePerScenario < 240 ? 'Exam pace ✓' : 'Practice more speed'}
          color="#FF9800"
          icon="⏱️"
        />
      </div>

      {/* Layer Performance Breakdown */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Performance by OSI Layer</h3>
        <div style={{ marginTop: '20px' }}>
          {Object.entries(analytics.layerPerformance)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([layer, stats]) => (
              <LayerPerformanceBar
                key={layer}
                layer={Number(layer) as OSILayerNumber}
                stats={stats}
              />
            ))}
        </div>

        {/* Weak Areas Alert */}
        {analytics.weakLayers.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              borderRadius: '4px',
            }}
          >
            <h4 style={{ margin: '0 0 12px 0' }} className="text-yellow-700 dark:text-yellow-400">⚠️ Focus Areas</h4>
            <div style={{ fontSize: '14px' }} className="text-yellow-700 dark:text-yellow-400">
              You should practice more scenarios for:
              {analytics.weakLayers.map((layer) => (
                <div key={layer} style={{ marginTop: '8px', fontWeight: 'bold' }}>
                  • Layer {layer} ({LAYER_NAMES[layer]}) -
                  {analytics.layerPerformance[layer]?.accuracyRate.toFixed(0) ?? 0}% accuracy
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Difficulty Performance */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Performance by Difficulty</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
            const stats = analytics.difficultyPerformance[difficulty];
            return (
              <div
                key={difficulty}
                style={{
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    color:
                      difficulty === 'easy'
                        ? '#4CAF50'
                        : difficulty === 'medium'
                          ? '#FF9800'
                          : '#f44336',
                    marginBottom: '8px',
                  }}
                >
                  {difficulty}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {stats.attempted > 0 ? ((stats.correct / stats.attempted) * 100).toFixed(0) : 0}%
                </div>
                <div style={{ fontSize: '14px' }} className="text-gray-600 dark:text-gray-400">
                  {stats.correct}/{stats.attempted} correct
                </div>
                <div style={{ fontSize: '13px', marginTop: '4px' }} className="text-gray-500 dark:text-gray-500">
                  Avg: {stats.avgScore.toFixed(0)}/100
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Recommendations */}
      <div
        style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #2196F3',
        }}
      >
        <h3 style={{ marginTop: 0 }} className="text-blue-600 dark:text-blue-400">📚 Study Recommendations</h3>
        <div style={{ fontSize: '15px', lineHeight: '1.8' }}>{getRecommendations(analytics)}</div>
      </div>
    </div>
  );
};

function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: `2px solid ${color}20`,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          fontSize: '32px',
          opacity: 0.3,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: '14px', marginBottom: '8px' }} className="text-gray-600 dark:text-gray-400">{title}</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', color, marginBottom: '4px' }}>
        {value}
      </div>
      {subtitle && <div style={{ fontSize: '13px' }} className="text-gray-500 dark:text-gray-500">{subtitle}</div>}
    </div>
  );
}

function LayerPerformanceBar({ layer, stats }: { layer: OSILayerNumber; stats: LayerStats }) {
  const accuracyPercent = stats.accuracyRate;
  const color = LAYER_COLORS[layer];

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '14px',
        }}
      >
        <span style={{ fontWeight: 'bold' }}>
          Layer {layer} - {LAYER_NAMES[layer]}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          {stats.scenariosCorrect}/{stats.scenariosAttempted} ({accuracyPercent.toFixed(0)}%)
        </span>
      </div>
      <div
        style={{
          height: '24px',
          backgroundColor: '#e0e0e0',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${accuracyPercent}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.5s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '8px',
          }}
        >
          {accuracyPercent > 15 && (
            <span style={{ fontSize: '12px', fontWeight: 'bold' }} className="text-white">
              {accuracyPercent.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          marginTop: '4px',
          fontSize: '12px',
        }}
        className="text-gray-500 dark:text-gray-500"
      >
        Avg Score: {stats.averageScore.toFixed(0)}/100
      </div>
    </div>
  );
}

function calculateAnalytics(data: AnalyticsData) {
  const { responses, scenarios, hintsUsed } = data;

  const attemptedCount = responses.size;
  const correctCount = Array.from(responses.values()).filter((r) => {
    const scenario = scenarios.find((s) => s.id === r.scenarioId);
    return scenario?.correctLayer === r.selectedLayer;
  }).length;

  const overallAccuracy = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
  const averageScore =
    attemptedCount > 0
      ? Array.from(responses.values()).reduce((sum, r) => sum + (r.score || 0), 0) / attemptedCount
      : 0;

  // Layer performance
  const layerPerformance: Record<OSILayerNumber, LayerStats> = {} as Record<
    OSILayerNumber,
    LayerStats
  >;

  [1, 2, 3, 4, 5, 6, 7].forEach((layer) => {
    const layerScenarios = Array.from(responses.entries()).filter(([id]) => {
      const scenario = scenarios.find((s) => s.id === id);
      return scenario?.correctLayer === layer;
    });

    const attempted = layerScenarios.length;
    const correct = layerScenarios.filter(([id, response]) => {
      const scenario = scenarios.find((s) => s.id === id);
      return scenario?.correctLayer === response.selectedLayer;
    }).length;

    const avgScore =
      attempted > 0
        ? layerScenarios.reduce((sum, [, response]) => sum + (response.score || 0), 0) / attempted
        : 0;

    layerPerformance[layer as OSILayerNumber] = {
      layer: layer as OSILayerNumber,
      scenariosAttempted: attempted,
      scenariosCorrect: correct,
      accuracyRate: attempted > 0 ? (correct / attempted) * 100 : 0,
      averageScore: avgScore,
    };
  });

  // Difficulty performance
  const difficultyPerformance = {
    easy: { attempted: 0, correct: 0, avgScore: 0 },
    medium: { attempted: 0, correct: 0, avgScore: 0 },
    hard: { attempted: 0, correct: 0, avgScore: 0 },
  };

  (['easy', 'medium', 'hard'] as const).forEach((difficulty) => {
    const diffScenarios = Array.from(responses.entries()).filter(([id]) => {
      const scenario = scenarios.find((s) => s.id === id);
      return scenario?.difficulty === difficulty;
    });

    const attempted = diffScenarios.length;
    const correct = diffScenarios.filter(([id, response]) => {
      const scenario = scenarios.find((s) => s.id === id);
      return scenario?.correctLayer === response.selectedLayer;
    }).length;

    const avgScore =
      attempted > 0
        ? diffScenarios.reduce((sum, [, response]) => sum + (response.score || 0), 0) / attempted
        : 0;

    difficultyPerformance[difficulty] = { attempted, correct, avgScore };
  });

  // Identify weak layers (< 70% accuracy)
  const weakLayers = Object.values(layerPerformance)
    .filter((stats) => stats.scenariosAttempted >= 2 && stats.accuracyRate < 70)
    .map((stats) => stats.layer)
    .sort((a, b) => {
      const aAcc = layerPerformance[a]?.accuracyRate ?? 0;
      const bAcc = layerPerformance[b]?.accuracyRate ?? 0;
      return aAcc - bAcc;
    });

  // Calculate exam readiness score
  const examReadinessScore = calculateExamReadiness({
    overallAccuracy,
    averageScore,
    hardDifficultyAccuracy:
      difficultyPerformance.hard.attempted > 0
        ? (difficultyPerformance.hard.correct / difficultyPerformance.hard.attempted) * 100
        : 0,
    scenariosCompleted: attemptedCount,
    hintsUsedPercent: (hintsUsed.size / Math.max(attemptedCount, 1)) * 100,
  });

  return {
    attemptedCount,
    correctCount,
    overallAccuracy,
    averageScore,
    avgTimePerScenario: data.timeSpent / Math.max(attemptedCount, 1),
    layerPerformance,
    difficultyPerformance,
    weakLayers,
    examReadinessScore,
  };
}

function calculateExamReadiness(factors: {
  overallAccuracy: number;
  averageScore: number;
  hardDifficultyAccuracy: number;
  scenariosCompleted: number;
  hintsUsedPercent: number;
}): number {
  let score = 0;

  // Overall accuracy (30 points)
  score += (factors.overallAccuracy / 100) * 30;

  // Average score (25 points)
  score += (factors.averageScore / 100) * 25;

  // Hard scenario performance (25 points)
  score += (factors.hardDifficultyAccuracy / 100) * 25;

  // Scenarios completed (10 points)
  score += Math.min((factors.scenariosCompleted / 50) * 10, 10);

  // Hint usage penalty (10 points bonus for low usage)
  score += Math.max(10 - factors.hintsUsedPercent / 10, 0);

  return Math.min(Math.round(score), 100);
}

function getReadinessColor(score: number): string {
  if (score >= 85) {
    return '#4CAF50';
  }
  if (score >= 70) {
    return '#FF9800';
  }
  return '#f44336';
}

function getReadinessText(score: number): string {
  if (score >= 85) {
    return 'Excellent - Ready!';
  }
  if (score >= 70) {
    return 'Good - Almost ready';
  }
  if (score >= 50) {
    return 'Practice more';
  }
  return 'Keep studying';
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRecommendations(analytics: ReturnType<typeof calculateAnalytics>): React.ReactNode[] {
  const recommendations: React.ReactNode[] = [];

  // Based on exam readiness
  if (analytics.examReadinessScore < 70) {
    recommendations.push(
      <div key="readiness">
        • Your exam readiness is {analytics.examReadinessScore}%. Aim for 70%+ before taking the
        exam.
      </div>
    );
  } else if (analytics.examReadinessScore >= 85) {
    recommendations.push(
      <div key="ready" style={{ fontWeight: 'bold' }} className="text-green-600 dark:text-green-400">
        ✓ You're ready for the CompTIA Network+ exam! Your performance is excellent.
      </div>
    );
  }

  // Based on weak layers
  if (analytics.weakLayers.length > 0) {
    recommendations.push(
      <div key="weak-layers">
        • Focus on weak layers: {analytics.weakLayers.map((l) => `Layer ${l}`).join(', ')}
      </div>
    );
  }

  // Based on hard scenarios
  if (analytics.difficultyPerformance.hard.attempted < 10) {
    recommendations.push(
      <div key="hard-scenarios">
        • Complete more hard scenarios ({analytics.difficultyPerformance.hard.attempted}/50
        attempted)
      </div>
    );
  } else if (analytics.difficultyPerformance.hard.attempted >= 10) {
    const hardAccuracy =
      (analytics.difficultyPerformance.hard.correct /
        analytics.difficultyPerformance.hard.attempted) *
      100;
    if (hardAccuracy < 70) {
      recommendations.push(
        <div key="hard-accuracy">
          • Your hard scenario accuracy is {hardAccuracy.toFixed(0)}%. Practice until you reach
          70%+.
        </div>
      );
    }
  }

  // Based on overall completion
  if (analytics.attemptedCount < 30) {
    recommendations.push(
      <div key="completion">
        • Complete more scenarios ({analytics.attemptedCount}/50 attempted). Try to finish all 50.
      </div>
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      <div key="great" className="text-green-600 dark:text-green-400">
        ✓ Great work! Keep practicing to maintain your skills.
      </div>
    );
  }

  return recommendations;
}

export default PerformanceAnalytics;
