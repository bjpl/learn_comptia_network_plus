/**
 * Use Case Tab Component
 */

import React from 'react';
import { USE_CASES } from '../constants';

export const UseCaseTab: React.FC = () => {
  return (
    <div className="tab-section">
      <div className="usecase-grid">
        {USE_CASES.map((uc, i) => (
          <div key={i} className="usecase-box">
            <p className="scenario">{uc.scenario}</p>
            <div className="usecase-details">
              <div>
                <span className="label">Deployment:</span>{' '}
                <span className="value">{uc.deployment}</span>
              </div>
              <div>
                <span className="label">Service:</span> <span className="value">{uc.service}</span>
              </div>
              <div>
                <span className="label">Example:</span> <span className="value">{uc.example}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
