/**
 * ThreeTierModel Component
 * Three-Tier Hierarchical Model explorer
 */

import React, { useState } from 'react';
import { threeTierModel } from '../../topologies-data';

export const ThreeTierModel: React.FC = () => {
  const [showThreeTier, setShowThreeTier] = useState(false);

  return (
    <div className="three-tier-explorer">
      <button className="toggle-btn" onClick={() => setShowThreeTier(!showThreeTier)}>
        {showThreeTier ? 'Hide' : 'Show'} Three-Tier Model Details
      </button>

      {showThreeTier && (
        <div className="three-tier-details">
          <h3>Three-Tier Hierarchical Model</h3>

          {/* Core Layer */}
          <div className="layer-section core">
            <h4>{threeTierModel.layers.core.name}</h4>
            <div className="layer-content">
              <div className="subsection">
                <h5>Functions</h5>
                <ul>
                  {threeTierModel.layers.core.functions.map((func, idx) => (
                    <li key={idx}>{func}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Requirements</h5>
                <ul>
                  {threeTierModel.layers.core.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Typical Devices</h5>
                <ul>
                  {threeTierModel.layers.core.devices.map((device, idx) => (
                    <li key={idx}>{device}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Distribution Layer */}
          <div className="layer-section distribution">
            <h4>{threeTierModel.layers.distribution.name}</h4>
            <div className="layer-content">
              <div className="subsection">
                <h5>Responsibilities</h5>
                <ul>
                  {threeTierModel.layers.distribution.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Features</h5>
                <ul>
                  {threeTierModel.layers.distribution.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Typical Devices</h5>
                <ul>
                  {threeTierModel.layers.distribution.devices.map((device, idx) => (
                    <li key={idx}>{device}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Access Layer */}
          <div className="layer-section access">
            <h4>{threeTierModel.layers.access.name}</h4>
            <div className="layer-content">
              <div className="subsection">
                <h5>Characteristics</h5>
                <ul>
                  {threeTierModel.layers.access.characteristics.map((char, idx) => (
                    <li key={idx}>{char}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Functions</h5>
                <ul>
                  {threeTierModel.layers.access.functions.map((func, idx) => (
                    <li key={idx}>{func}</li>
                  ))}
                </ul>
              </div>
              <div className="subsection">
                <h5>Typical Devices</h5>
                <ul>
                  {threeTierModel.layers.access.devices.map((device, idx) => (
                    <li key={idx}>{device}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Collapsed Core */}
          <div className="collapsed-core-section">
            <h4>Collapsed Core Variation</h4>
            <p className="description">{threeTierModel.collapsedCore.description}</p>

            <div className="subsection">
              <h5>When to Use</h5>
              <ul>
                {threeTierModel.collapsedCore.whenToUse.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="benefits-limitations">
              <div className="benefits">
                <h5>Benefits</h5>
                <ul>
                  {threeTierModel.collapsedCore.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="limitations">
                <h5>Limitations</h5>
                <ul>
                  {threeTierModel.collapsedCore.limitations.map((limit, idx) => (
                    <li key={idx}>{limit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
