/**
 * Cost Estimation Panel
 */

import React from 'react';
import { estimateArchitectureCost } from '../../cloud-learning-utils';
import type { CostPanelProps } from '../types';

export const CostEstimationPanel: React.FC<CostPanelProps> = ({ design, onClose }) => {
  const estimate = estimateArchitectureCost(design);

  return (
    <div className="cost-panel">
      <div className="panel-header">
        <div>
          <h3>Cost Estimation</h3>
          <p className="panel-subtitle">Monthly cost projection</p>
        </div>
        <button onClick={onClose} className="close-btn" title="Close">
          ×
        </button>
      </div>

      <div className="cost-summary">
        <div className="cost-range">
          <div className="cost-label">Estimated Monthly Cost</div>
          <div className="cost-value">
            ${estimate.monthlyMin.toLocaleString()} - ${estimate.monthlyMax.toLocaleString()}
          </div>
          <div className="cost-note">
            Actual costs vary by usage, region, and service tier
          </div>
        </div>
      </div>

      <div className="cost-breakdown-section">
        <h4>Cost Breakdown</h4>
        <div className="breakdown-table">
          {estimate.breakdown.map((item, idx) => (
            <div key={idx} className="breakdown-row">
              <div className="breakdown-component">{item.component}</div>
              <div className="breakdown-cost">{item.cost}</div>
              <div className="breakdown-factor">{item.factor}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cost-recommendations">
        <h4>💰 Cost Optimization Tips</h4>
        <ul>
          {estimate.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <style>{`
        .cost-panel {
          position: fixed;
          right: 0;
          top: 80px;
          width: 550px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 20px rgba(0,0,0,0.15);
          z-index: 100;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 3px solid #3b82f6;
        }

        .panel-header h3 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 22px;
          font-weight: 700;
        }

        .panel-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #111827;
          transform: scale(1.05);
        }

        .cost-summary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          color: white;
        }

        .cost-range {
          text-align: center;
        }

        .cost-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .cost-value {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cost-note {
          font-size: 12px;
          opacity: 0.8;
        }

        .cost-breakdown-section h4,
        .cost-recommendations h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 16px;
          font-weight: 700;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }

        .breakdown-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .breakdown-row {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
        }

        .breakdown-component {
          font-weight: 700;
          color: #111827;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .breakdown-cost {
          color: #3b82f6;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .breakdown-factor {
          color: #6b7280;
          font-size: 11px;
        }

        .cost-recommendations {
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 16px;
        }

        .cost-recommendations ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .cost-recommendations li {
          padding: 8px 0 8px 24px;
          position: relative;
          color: #78350f;
          font-size: 13px;
          line-height: 1.5;
        }

        .cost-recommendations li:before {
          content: '💡';
          position: absolute;
          left: 0;
        }
      `}</style>
    </div>
  );
};
