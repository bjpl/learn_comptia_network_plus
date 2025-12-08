/**
 * ConnectionManager component - displays service comparison and use case matcher
 */

import React from 'react';
import { SERVICE_COMPARISON, USE_CASE_MATCHES } from '../data/cloudServices';

interface ConnectionManagerProps {
  mode: 'comparison' | 'usecase';
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({ mode }) => {
  if (mode === 'comparison') {
    return (
      <div className="tab-content">
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>SaaS</th>
                <th>PaaS</th>
                <th>IaaS</th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_COMPARISON.map((row, idx) => (
                <tr key={idx}>
                  <td className="aspect-cell">
                    <strong>{row.aspect}</strong>
                  </td>
                  <td>{row.SaaS}</td>
                  <td>{row.PaaS}</td>
                  <td>{row.IaaS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="comparison-note">
          <p>Use this matrix to quickly identify which service model best fits your use case.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="usecase-grid">
        {USE_CASE_MATCHES.map((usecase, idx) => (
          <div key={idx} className="usecase-card">
            <h4>Scenario:</h4>
            <p className="scenario-text">{usecase.scenario}</p>
            <div className="usecase-info">
              <div className="usecase-item">
                <span className="label">Deployment:</span>
                <span className="value">{usecase.deployment}</span>
              </div>
              <div className="usecase-item">
                <span className="label">Service:</span>
                <span className="value">{usecase.service}</span>
              </div>
              <div className="usecase-item">
                <span className="label">Examples:</span>
                <span className="value">{usecase.examples}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
