/**
 * User explanation textarea component
 */

import React from 'react';
import type { TrafficType } from '../../protocols-types';

interface ExplanationSectionProps {
  selectedType: TrafficType;
  userExplanation: string;
  onExplanationChange: (value: string) => void;
}

export const ExplanationSection: React.FC<ExplanationSectionProps> = ({
  selectedType,
  userExplanation,
  onExplanationChange,
}) => {
  const wordCount = userExplanation
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return (
    <div className="explanation-section">
      <h3>Explain in Your Own Words:</h3>
      <textarea
        value={userExplanation}
        onChange={(e) => onExplanationChange(e.target.value)}
        placeholder={`Explain how ${selectedType.name} works and when you would use it...`}
        rows={5}
      />
      <div className="word-count">Words: {wordCount}</div>
    </div>
  );
};
