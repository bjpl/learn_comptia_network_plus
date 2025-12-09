/**
 * SolutionInput Component
 */

import React from 'react';
import type { TextInputProps } from '../types';

export const SolutionInput: React.FC<TextInputProps> = ({ value, onChange }) => {
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
        className={
          wordCount >= 50
            ? 'text-green-600 dark:text-green-400'
            : 'text-gray-700 dark:text-gray-300'
        }
        style={{ marginTop: '5px', fontSize: '12px' }}
      >
        Word count: {wordCount} / 50
        {wordCount >= 50 && <span style={{ marginLeft: '10px' }}>✓ Meets requirement</span>}
      </div>
    </div>
  );
};
