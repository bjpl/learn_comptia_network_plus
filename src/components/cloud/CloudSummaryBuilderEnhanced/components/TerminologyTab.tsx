/**
 * Terminology Tab Component
 */

import React from 'react';
import type { CloudTerms } from '../types';
import { CLOUD_TERMS } from '../constants';

interface TerminologyTabProps {
  selectedCategory: keyof CloudTerms;
  onCategoryChange: (category: keyof CloudTerms) => void;
}

export const TerminologyTab: React.FC<TerminologyTabProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="tab-section">
      <div className="category-btns">
        {Object.keys(CLOUD_TERMS).map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat as keyof CloudTerms)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="term-grid">
        {Object.entries(CLOUD_TERMS[selectedCategory]).map(([term, def]) => (
          <div key={term} className="term-box">
            <h4>{term}</h4>
            <p>{def}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
