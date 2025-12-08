/**
 * Styles for Port Scanner Enhanced component
 */

export const styles = `
  .port-scanner-enhanced {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e0e0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    padding: 20px;
  }

  .disclaimer-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .disclaimer-content {
    background: #1e1e1e;
    padding: 40px;
    border-radius: 15px;
    max-width: 600px;
    border: 3px solid #e74c3c;
  }

  .disclaimer-content h2 {
    color: #e74c3c;
    text-align: center;
    margin-bottom: 20px;
  }

  .disclaimer-text {
    line-height: 1.8;
  }

  .disclaimer-text ul {
    margin: 15px 0;
    padding-left: 25px;
  }

  .accept-button {
    width: 100%;
    padding: 15px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 20px;
  }

  .accept-button:hover {
    background: #229954;
  }

  .scanner-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .scanner-header h1 {
    color: #00d9ff;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #95a5a6;
    font-style: italic;
  }

  .scanner-layout {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .left-panel, .right-panel {
    background: #1e1e1e;
    border-radius: 10px;
    padding: 20px;
  }

  .scan-controls {
    margin-bottom: 30px;
  }

  .scan-type-selector {
    margin: 15px 0;
  }

  .scan-type-selector label {
    display: block;
    margin-bottom: 8px;
    color: #00d9ff;
    font-weight: bold;
  }

  .scan-type-selector select {
    width: 100%;
    padding: 10px;
    background: #2d2d2d;
    color: #e0e0e0;
    border: 2px solid #00d9ff;
    border-radius: 5px;
    font-size: 14px;
  }

  .scan-button {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .scan-button:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .scan-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .scan-type-info {
    background: #2d2d2d;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .scan-type-info h3 {
    color: #00d9ff;
    margin-bottom: 10px;
  }

  .stealth-indicator {
    display: inline-block;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .stealth-indicator.stealth {
    background: #27ae60;
  }

  .stealth-indicator.normal {
    background: #e74c3c;
  }

  .info-section {
    margin: 15px 0;
  }

  .info-section h4 {
    color: #00d9ff;
    margin-bottom: 8px;
  }

  .info-section ol, .info-section ul {
    padding-left: 20px;
  }

  .info-section li {
    margin: 5px 0;
    line-height: 1.6;
  }

  .pros-cons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 15px;
  }

  .pros, .cons {
    background: #1a1a1a;
    padding: 15px;
    border-radius: 5px;
  }

  .defense-config {
    background: #2d2d2d;
    padding: 20px;
    border-radius: 8px;
  }

  .defense-config h3 {
    color: #e74c3c;
    margin-bottom: 15px;
  }

  .defense-toggles {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .defense-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .defense-toggle input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .firewall-rules {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 2px solid #3d3d3d;
  }

  .firewall-rule {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 10px 0;
    padding: 10px;
    background: #1a1a1a;
    border-radius: 5px;
  }

  .firewall-rule select {
    padding: 5px 10px;
    background: #2d2d2d;
    color: #e0e0e0;
    border: 1px solid #00d9ff;
    border-radius: 3px;
  }

  .terminal {
    background: #0a0a0a;
    color: #00ff00;
    font-family: 'Courier New', monospace;
    padding: 20px;
    border-radius: 8px;
    height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    font-size: 13px;
    line-height: 1.5;
  }

  .terminal-line {
    white-space: pre-wrap;
  }

  .terminal::-webkit-scrollbar {
    width: 10px;
  }

  .terminal::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  .terminal::-webkit-scrollbar-thumb {
    background: #00d9ff;
    border-radius: 5px;
  }

  .results-panel {
    margin-top: 20px;
  }

  .results-panel h3 {
    color: #00d9ff;
    margin-bottom: 15px;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
  }

  .result-card {
    background: #2d2d2d;
    padding: 15px;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s;
    position: relative;
  }

  .result-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 217, 255, 0.3);
  }

  .result-card.selected {
    border-color: #00d9ff;
  }

  .result-card.state-open {
    background: rgba(39, 174, 96, 0.2);
  }

  .result-card.state-closed {
    background: rgba(231, 76, 60, 0.2);
  }

  .result-card.state-filtered {
    background: rgba(241, 196, 15, 0.2);
  }

  .result-port {
    font-size: 24px;
    font-weight: bold;
    color: #00d9ff;
  }

  .result-service {
    font-size: 12px;
    color: #95a5a6;
    margin: 5px 0;
  }

  .result-state {
    font-size: 11px;
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 3px;
    display: inline-block;
  }

  .result-state.state-open {
    background: #27ae60;
  }

  .result-state.state-closed {
    background: #e74c3c;
  }

  .result-state.state-filtered {
    background: #f39c12;
  }

  .result-state.state-unfiltered {
    background: #3498db;
  }

  .detected-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 16px;
  }

  .packet-details {
    background: #2d2d2d;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .packet-exchange h4 {
    color: #00d9ff;
    margin-bottom: 20px;
  }

  .exchange-timeline {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .exchange-step {
    display: flex;
    gap: 15px;
    padding: 15px;
    background: #1a1a1a;
    border-radius: 8px;
    border-left: 4px solid #3498db;
  }

  .exchange-step.scanner {
    border-left-color: #00d9ff;
  }

  .exchange-step.target {
    border-left-color: #9b59b6;
  }

  .exchange-step.detected {
    background: rgba(231, 76, 60, 0.1);
  }

  .step-number {
    background: #3498db;
    color: white;
    padding: 5px 10px;
    border-radius: 50%;
    font-weight: bold;
    height: fit-content;
  }

  .step-content {
    flex: 1;
  }

  .step-source {
    font-weight: bold;
    color: #00d9ff;
    margin-bottom: 5px;
  }

  .flags {
    color: #f39c12;
    font-size: 12px;
  }

  .step-type {
    color: #27ae60;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .step-description {
    color: #bdc3c7;
    font-size: 14px;
  }

  .detection-badge {
    display: inline-block;
    background: #e74c3c;
    color: white;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 11px;
    margin-top: 5px;
  }

  .exchange-summary {
    margin-top: 20px;
    padding: 15px;
    background: #1a1a1a;
    border-radius: 8px;
  }

  .exchange-summary h5 {
    color: #00d9ff;
  }

  .banner-info {
    margin-top: 10px;
    padding: 10px;
    background: #2d2d2d;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    color: #00ff00;
  }

  .exam-tips {
    background: #2d2d2d;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .exam-tips h3 {
    color: #f39c12;
    margin-bottom: 15px;
  }

  .exam-tips ul {
    padding-left: 20px;
  }

  .exam-tips li {
    margin: 10px 0;
    line-height: 1.6;
  }

  .exam-tips strong {
    color: #00d9ff;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (max-width: 1200px) {
    .scanner-layout {
      grid-template-columns: 1fr;
    }

    .pros-cons {
      grid-template-columns: 1fr;
    }
  }
`;
