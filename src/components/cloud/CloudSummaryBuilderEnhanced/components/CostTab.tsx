/**
 * Cost Calculator Tab Component
 */

import React from 'react';
import type { CostProfiles } from '../types';
import { COST_PROFILES } from '../constants';

interface CostTabProps {
  costProfile: keyof CostProfiles;
  onProfileChange: (profile: keyof CostProfiles) => void;
}

export const CostTab: React.FC<CostTabProps> = ({ costProfile, onProfileChange }) => {
  return (
    <div className="tab-section">
      <h3>Cloud Cost Estimation</h3>
      <div className="profile-selector">
        {Object.keys(COST_PROFILES).map((prof) => (
          <button
            key={prof}
            className={`profile-btn ${costProfile === prof ? 'active' : ''}`}
            onClick={() => onProfileChange(prof as keyof CostProfiles)}
          >
            {prof}
          </button>
        ))}
      </div>
      <div className="cost-breakdown">
        <div className="cost-row">
          <span>Compute:</span>
          <span>${COST_PROFILES[costProfile].compute}/mo</span>
        </div>
        <div className="cost-row">
          <span>Storage:</span>
          <span>${COST_PROFILES[costProfile].storage}/mo</span>
        </div>
        <div className="cost-row">
          <span>Bandwidth:</span>
          <span>${COST_PROFILES[costProfile].bandwidth}/mo</span>
        </div>
        <div className="cost-row total">
          <span>Total:</span>
          <span>${COST_PROFILES[costProfile].total}/mo</span>
        </div>
      </div>
      <div className="info-box">
        Estimates vary by provider, region, and usage. Check AWS/Azure/GCP calculators for details.
      </div>
    </div>
  );
};
