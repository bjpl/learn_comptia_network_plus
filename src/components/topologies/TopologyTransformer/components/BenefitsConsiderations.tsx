/**
 * Benefits and considerations display component
 */

import React from 'react';

interface BenefitsConsiderationsProps {
  benefits: string[];
  considerations: string[];
}

export const BenefitsConsiderations: React.FC<BenefitsConsiderationsProps> = ({
  benefits,
  considerations,
}) => {
  return (
    <div className="benefits-considerations">
      <div className="benefits">
        <h4>Benefits</h4>
        <ul>
          {benefits.map((benefit, idx) => (
            <li key={idx}>
              <span className="icon">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="considerations">
        <h4>Considerations</h4>
        <ul>
          {considerations.map((consideration, idx) => (
            <li key={idx}>
              <span className="icon">⚠</span>
              {consideration}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
