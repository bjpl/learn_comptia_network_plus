/**
 * Help Icon for Library Items
 */

import React from 'react';
import { cloudTooltips } from '../../cloud-learning-utils';
import type { HelpIconProps } from '../types';

export const HelpIcon: React.FC<HelpIconProps> = ({ subtype, onShowTooltip }) => {
  const tooltip = cloudTooltips[subtype];

  if (!tooltip) {
    return null;
  }

  return (
    <button
      className="help-icon-btn"
      onClick={(e) => {
        e.stopPropagation();
        onShowTooltip(tooltip, e);
      }}
      title="Learn more"
    >
      ?
      <style>{`
        .help-icon-btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }

        .help-icon-btn:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </button>
  );
};
