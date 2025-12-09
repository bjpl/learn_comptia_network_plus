/**
 * Styles for PortScanner component
 */

import React from 'react';

export const ScannerStyles: React.FC = () => {
  return (
    <style>{`
      .port-scanner {
        max-width: 1000px;
        margin: 0 auto;
        padding: 20px;
        font-family: 'Courier New', monospace;
      }

      .scanner-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .scanner-header h2 {
        color: #2c3e50;
        font-family: 'Segoe UI', sans-serif;
      }

      .subtitle {
        color: #7f8c8d;
        font-family: 'Segoe UI', sans-serif;
        font-style: italic;
      }

      .scanner-container {
        background: #1e1e1e;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        overflow: hidden;
      }

      .network-selector {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: #2d2d2d;
        border-bottom: 2px solid #3498db;
      }

      .network-selector label {
        color: #ecf0f1;
        font-weight: bold;
      }

      .network-selector select {
        flex: 1;
        padding: 8px 15px;
        background: #34495e;
        color: #ecf0f1;
        border: 2px solid #3498db;
        border-radius: 5px;
        font-family: inherit;
        font-size: 14px;
      }

      .difficulty-badge {
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 12px;
      }

      .difficulty-badge.easy {
        background: #2ecc71;
        color: white;
      }

      .difficulty-badge.medium {
        background: #f39c12;
        color: white;
      }

      .difficulty-badge.hard {
        background: #e74c3c;
        color: white;
      }

      .terminal {
        height: 500px;
        overflow-y: auto;
        padding: 20px;
        background: #1e1e1e;
        color: #00ff00;
        font-size: 14px;
        line-height: 1.6;
      }

      .terminal-line {
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .terminal-line.scanning {
        color: #3498db;
      }

      .spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .terminal::-webkit-scrollbar {
        width: 10px;
      }

      .terminal::-webkit-scrollbar-track {
        background: #2d2d2d;
      }

      .terminal::-webkit-scrollbar-thumb {
        background: #3498db;
        border-radius: 5px;
      }

      .command-input {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        background: #2d2d2d;
        border-top: 1px solid #34495e;
      }

      .prompt {
        color: #3498db;
        margin-right: 10px;
        font-weight: bold;
      }

      .command-input input {
        flex: 1;
        padding: 8px 15px;
        background: #34495e;
        color: #ecf0f1;
        border: 2px solid #3498db;
        border-radius: 5px;
        font-family: inherit;
        font-size: 14px;
      }

      .command-input input:focus {
        outline: none;
        border-color: #2ecc71;
      }

      .command-input input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .quick-actions {
        display: flex;
        gap: 10px;
        padding: 15px 20px;
        background: #2d2d2d;
        border-top: 1px solid #34495e;
      }

      .quick-actions button {
        flex: 1;
        padding: 10px 15px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }

      .quick-actions button:hover:not(:disabled) {
        background: #2980b9;
        transform: translateY(-2px);
      }

      .quick-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .score-display {
        padding: 20px;
        background: #2d2d2d;
        border-top: 2px solid #34495e;
      }

      .score-display h3 {
        color: #ecf0f1;
        font-family: 'Segoe UI', sans-serif;
        margin-bottom: 15px;
        text-align: center;
      }

      .score-bar {
        height: 30px;
        background: #34495e;
        border-radius: 15px;
        overflow: hidden;
        position: relative;
      }

      .score-fill {
        height: 100%;
        transition: width 0.5s ease;
        background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71);
      }

      .score-display.good .score-fill {
        background: linear-gradient(90deg, #2ecc71, #27ae60);
      }

      .score-display.fair .score-fill {
        background: linear-gradient(90deg, #f39c12, #e67e22);
      }

      .score-display.poor .score-fill {
        background: linear-gradient(90deg, #e74c3c, #c0392b);
      }

      @media (max-width: 768px) {
        .terminal {
          height: 400px;
          font-size: 12px;
        }

        .quick-actions {
          flex-wrap: wrap;
        }

        .quick-actions button {
          flex: 1 1 45%;
        }
      }
    `}</style>
  );
};
