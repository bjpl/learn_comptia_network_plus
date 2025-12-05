/**
 * Progress tracking component for PortProtocolTrainer
 */

import React from 'react';
import type { TrainingStats } from './types';

interface ProgressTrackerProps {
  stats: TrainingStats;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stats }) => {
  return (
    <div className="trainer-stats-bar">
      <div className="stat-item">
        <span className="stat-label">Level {stats.level}</span>
        <div className="xp-bar">
          <div
            className="xp-fill"
            style={{
              width: `${((stats.xp % 100) / 100) * 100}%`,
            }}
          />
        </div>
        <span className="stat-value">{stats.xp % 100}/100 XP</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Streak</span>
        <span className="stat-value">{stats.studyStreak} 🔥</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Mastered</span>
        <span className="stat-value">
          {stats.masteredCards}/{stats.totalCards}
        </span>
      </div>
    </div>
  );
};
