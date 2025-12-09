import React from 'react';
import { calculateWordCount } from '../utils/scoreCalculator';

interface TextInputSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
  minWords: number;
  scoreWeight: string;
  inputId: string;
}

export const TextInputSection: React.FC<TextInputSectionProps> = ({
  title,
  value,
  onChange,
  placeholder,
  rows,
  minWords,
  scoreWeight,
  inputId,
}) => {
  const wordCount = calculateWordCount(value);
  const meetsRequirement = wordCount >= minWords;

  return (
    <div className="text-input-section" style={{ marginBottom: '25px' }}>
      <label
        htmlFor={inputId}
        className="text-gray-900 dark:text-gray-100"
        style={{
          display: 'block',
          fontWeight: 'bold',
          marginBottom: '10px',
          fontSize: '16px',
        }}
      >
        {title} ({scoreWeight} of score, minimum {minWords} words):
      </label>
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
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
        className="text-gray-900 dark:text-gray-100"
        style={{ marginTop: '5px', fontSize: '12px' }}
      >
        Word count: {wordCount} / {minWords}
        {meetsRequirement && (
          <span className="text-green-600 dark:text-green-400" style={{ marginLeft: '10px' }}>
            ✓ Meets requirement
          </span>
        )}
      </div>
    </div>
  );
};
