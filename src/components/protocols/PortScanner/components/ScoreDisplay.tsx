/**
 * Score display component
 */

import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  if (score <= 0) return null;

  const scoreClass = score >= 75 ? 'good' : score >= 50 ? 'fair' : 'poor';

  return (
    <div className={`score-display ${scoreClass}`}>
      <h3>Current Score: {score.toFixed(1)}%</h3>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};
