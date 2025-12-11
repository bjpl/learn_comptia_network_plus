/**
 * ModeToggle Component
 */

import React from 'react';

interface ModeToggleProps {
  isExamMode: boolean;
  onModeChange: (isExam: boolean) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ isExamMode, onModeChange }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <span className="text-gray-900 dark:text-gray-100" style={{ fontSize: '14px', fontWeight: 'bold' }}>Mode:</span>
      <button
        onClick={() => onModeChange(false)}
        className={isExamMode ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
        style={{
          padding: '8px 16px',
          backgroundColor: !isExamMode ? '#4CAF50' : undefined,
          color: !isExamMode ? '#fff' : undefined,
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        📚 Study Mode
      </button>
      <button
        onClick={() => onModeChange(true)}
        className={!isExamMode ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : ''}
        style={{
          padding: '8px 16px',
          backgroundColor: isExamMode ? '#f44336' : undefined,
          color: isExamMode ? '#fff' : undefined,
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🎯 Exam Mode
      </button>
    </div>
  );
};
