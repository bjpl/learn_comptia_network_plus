/**
 * FilterSelect Component
 */

import React from 'react';
import type { FilterSelectProps } from '../types';

export const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label style={{ marginRight: '8px', fontWeight: 'bold' }}>{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
