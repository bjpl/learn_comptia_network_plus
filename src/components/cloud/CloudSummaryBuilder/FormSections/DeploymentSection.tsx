/**
 * Deployment model form section for CloudSummaryBuilder
 */

import React from 'react';

interface DeploymentSectionProps {
  deploymentModel?: string;
  deploymentJustification?: string;
  onDeploymentModelChange: (value: string) => void;
  onDeploymentJustificationChange: (value: string) => void;
}

export const DeploymentSection: React.FC<DeploymentSectionProps> = ({
  deploymentModel,
  deploymentJustification,
  onDeploymentModelChange,
  onDeploymentJustificationChange,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="deployment-model">Deployment Model *</label>
      <select
        id="deployment-model"
        value={deploymentModel || ''}
        onChange={(e) => onDeploymentModelChange(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="Public">Public</option>
        <option value="Private">Private</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      <input
        type="text"
        placeholder="Justification (concise)"
        value={deploymentJustification || ''}
        onChange={(e) => onDeploymentJustificationChange(e.target.value)}
      />
    </div>
  );
};
