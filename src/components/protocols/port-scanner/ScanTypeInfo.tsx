/**
 * Scan Type Information Component
 * Display educational information about the selected scan type
 */

import React from 'react';
import type { ScanType } from './types';
import { SCAN_EXPLANATIONS } from './constants';

interface ScanTypeInfoProps {
  scanType: ScanType;
}

export const ScanTypeInfo: React.FC<ScanTypeInfoProps> = React.memo(({ scanType }) => {
  const info = SCAN_EXPLANATIONS[scanType];

  return (
    <div className="scan-type-info">
      <h3>{info.name}</h3>
      <div className={`stealth-indicator ${info.stealth ? 'stealth' : 'normal'}`}>
        {info.stealth ? '🕵️ STEALTH SCAN' : '👁️ NON-STEALTH SCAN'}
      </div>
      <p className="description">{info.description}</p>

      <div className="info-section">
        <h4>How It Works:</h4>
        <ol>
          {info.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="info-section">
        <h4>Detection Risk: {info.detection}</h4>
        <h4>Use Cases:</h4>
        <ul>
          {info.useCases.map((useCase, idx) => (
            <li key={idx}>{useCase}</li>
          ))}
        </ul>
      </div>

      <div className="pros-cons">
        <div className="pros">
          <h4>✅ Advantages:</h4>
          <ul>
            {info.pros.map((pro, idx) => (
              <li key={idx}>{pro}</li>
            ))}
          </ul>
        </div>
        <div className="cons">
          <h4>❌ Disadvantages:</h4>
          <ul>
            {info.cons.map((con, idx) => (
              <li key={idx}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

ScanTypeInfo.displayName = 'ScanTypeInfo';
