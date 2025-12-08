/**
 * ServicePalette component - displays cloud terminology definitions
 */

import React from 'react';
import type { CloudTermCategory } from '../types';

interface ServicePaletteProps {
  cloudTerms: CloudTermCategory;
  selectedCategory: keyof CloudTermCategory;
  onCategoryChange: (category: keyof CloudTermCategory) => void;
}

export const ServicePalette: React.FC<ServicePaletteProps> = ({
  cloudTerms,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="tab-content">
      <div className="term-selector">
        {Object.keys(cloudTerms).map((category) => (
          <button
            key={category}
            className={`term-category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category as keyof CloudTermCategory)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="terminology-grid">
        {Object.entries(cloudTerms[selectedCategory]).map(([term, definition]) => (
          <div key={term} className="term-card">
            <h3>{term}</h3>
            <p>{definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
