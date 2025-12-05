/**
 * Analytics view component for PortProtocolTrainer
 */

import React from 'react';
import type { TrainingStats, CardProgress } from './types';
import { EXAM_CRITICAL_PORTS } from './data';

interface AnalyticsViewProps {
  stats: TrainingStats;
  progress: Map<string, CardProgress>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, progress }) => {
  const boxDistribution = [0, 1, 2, 3, 4].map(
    (box) => Array.from(progress.values()).filter((p) => p.box === box).length
  );

  const averageQuizScore =
    stats.quizScores.length > 0
      ? stats.quizScores.reduce((a, b) => a + b, 0) / stats.quizScores.length
      : 0;

  return (
    <div className="analytics-mode">
      <h2>📊 Performance Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Level</div>
          <div className="stat-value">{stats.level}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">XP</div>
          <div className="stat-value">{stats.xp}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Study Streak</div>
          <div className="stat-value">{stats.studyStreak} days</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Reviews</div>
          <div className="stat-value">{stats.totalReviews}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mastered Cards</div>
          <div className="stat-value">
            {stats.masteredCards}/{stats.totalCards}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Quiz Score</div>
          <div className="stat-value">{averageQuizScore.toFixed(0)}%</div>
        </div>
      </div>

      <div className="leitner-distribution">
        <h3>Spaced Repetition Progress</h3>
        <div className="leitner-boxes">
          {boxDistribution.map((count, box) => (
            <div key={box} className="leitner-box-stat">
              <div className="box-label">Box {box + 1}</div>
              <div className="box-count">{count} cards</div>
              <div
                className="box-bar"
                style={{ width: `${(count / EXAM_CRITICAL_PORTS.length) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="achievements-section">
        <h3>🏆 Achievements</h3>
        <div className="achievements-grid">
          {stats.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-desc">{achievement.description}</div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="unlock-date">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
