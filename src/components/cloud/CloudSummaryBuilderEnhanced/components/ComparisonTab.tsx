/**
 * Service Comparison Tab Component
 */

import React from 'react';
import { SERVICE_COMPARISON } from '../constants';

export const ComparisonTab: React.FC = () => {
  return (
    <div className="tab-section">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Aspect</th>
            <th>SaaS</th>
            <th>PaaS</th>
            <th>IaaS</th>
          </tr>
        </thead>
        <tbody>
          {SERVICE_COMPARISON.map((row, i) => (
            <tr key={i}>
              <td className="aspect">{row.aspect}</td>
              <td>{row.SaaS}</td>
              <td>{row.PaaS}</td>
              <td>{row.IaaS}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="info-box">
        Use this matrix to identify which service model fits your use case.
      </div>
    </div>
  );
};
