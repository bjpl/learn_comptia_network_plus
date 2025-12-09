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
      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Mode:</span>
      <button
        onClick={() => onModeChange(false)}
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
        onClick={() => onModeChange(true)}
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
  );
};
