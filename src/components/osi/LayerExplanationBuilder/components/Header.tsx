import React from 'react';
import type { LearningMode } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

interface HeaderProps {
  currentMode: LearningMode;
  setCurrentMode: (mode: LearningMode) => void;
  hintsUsed: number;
  score: number;
  onCalculateScore: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  setCurrentMode,
  hintsUsed,
  score,
  onCalculateScore,
}) => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 className="text-gray-900 dark:text-gray-100" style={{ marginBottom: '15px' }}>OSI Layer Explanation Builder</h2>
      <p className="text-gray-700 dark:text-gray-300" style={{ marginBottom: '20px' }}>
        Master the OSI model through interactive learning. Choose your preferred learning mode
        below.
      </p>

      {/* Mode Selection Tabs */}
      <div
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}
        role="tablist"
        aria-label="Learning modes"
      >
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level.level}
            onClick={() => setCurrentMode(level.level as LearningMode)}
            role="tab"
            aria-selected={currentMode === level.level}
            aria-controls={`mode-${level.level}-panel`}
            aria-label={`${level.name}: ${level.description}`}
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
        <div
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          style={{ padding: '10px 15px', borderRadius: '4px' }}
        >
          Hints Used: {hintsUsed}/3
        </div>
        <div
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          style={{ padding: '10px 15px', borderRadius: '4px' }}
        >
          Current Score: {score}%
        </div>
        <button
          onClick={onCalculateScore}
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
  );
};
