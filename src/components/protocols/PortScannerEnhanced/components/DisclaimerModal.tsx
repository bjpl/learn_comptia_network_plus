/**
 * Disclaimer modal component
 */

import React from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="disclaimer-modal">
      <div className="disclaimer-content">
        <h2>⚠️ EDUCATIONAL USE ONLY</h2>
        <div className="disclaimer-text">
          <p>
            <strong>IMPORTANT LEGAL NOTICE:</strong>
          </p>
          <p>This is a SIMULATED port scanner for EDUCATIONAL purposes only.</p>
          <p>Unauthorized port scanning is ILLEGAL and may violate:</p>
          <ul>
            <li>Computer Fraud and Abuse Act (CFAA)</li>
            <li>Your organization&apos;s acceptable use policy</li>
            <li>International cybersecurity laws</li>
          </ul>
          <p>
            <strong>Only scan networks you OWN or have WRITTEN PERMISSION to test.</strong>
          </p>
          <p>This simulator teaches Network+ concepts without performing real scans.</p>
        </div>
        <button onClick={onAccept} className="accept-button">
          I Understand - Continue to Educational Simulator
        </button>
      </div>
    </div>
  );
};
