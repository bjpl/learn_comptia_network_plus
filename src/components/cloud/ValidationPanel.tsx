/**
 * ValidationPanel - Architecture validation results display
 */

import React from 'react';
import type { ValidationResult } from './cloud-types';

interface ValidationPanelProps {
  validation: ValidationResult;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation }) => {
  return (
    <div className="validation-panel">
      <h3>Validation Results</h3>
      <div className={`score ${validation.valid ? 'valid' : 'invalid'}`}>
        Score: {validation.score}%
      </div>

      {validation.errors.length > 0 && (
        <div className="errors">
          <h4>Errors:</h4>
          <ul>
            {validation.errors.map((error, idx) => (
              <li key={idx} className="error">
                {error.message}
                <span className="suggestion">{error.suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="warnings">
          <h4>Warnings:</h4>
          <ul>
            {validation.warnings.map((warning, idx) => (
              <li key={idx} className="warning">
                {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.valid && (
        <div className="success-message">
          All validation checks passed! Your architecture follows best practices.
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
