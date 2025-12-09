/**
 * Enhanced styles for TopologyAnalyzerEnhanced component
 * Extracted from inline styles to separate file
 */

export const analyzerStyles = `
  /* Base Styles with Modern Design System */
  .topology-analyzer-enhanced {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  /* Header Enhancement */
  .analyzer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.5rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 1rem;
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .analyzer-header:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }

  .header-content {
    flex: 1;
  }

  .header-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
  }

  .header-subtitle {
    font-size: 1rem;
    opacity: 0.95;
    line-height: 1.6;
    margin: 0;
  }

  .header-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .badge-icon {
    font-size: 1.5rem;
  }

  .badge-text {
    font-size: 0.875rem;
    font-weight: 600;
  }

  /* Card System with Shadows */
  .topology-selection-card,
  .node-count-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;
  }

  .topology-selection-card:hover,
  .node-count-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .info-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    font-size: 1rem;
    transition: transform 0.2s ease;
  }

  .info-icon:hover {
    transform: scale(1.2);
  }

  /* Enhanced Topology Buttons */
  .topology-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .topology-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border: 2px solid #e5e7eb;
    background: white;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    color: #374151;
    position: relative;
    overflow: hidden;
  }

  .topology-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  .topology-btn > * {
    position: relative;
    z-index: 1;
  }

  .topology-btn:hover:not(:disabled) {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .topology-btn.active {
    border-color: #667eea;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .topology-btn.active::before {
    opacity: 1;
  }

  .topology-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-icon {
    font-size: 1.25rem;
  }

  .btn-text {
    font-size: 0.95rem;
  }

  .btn-check {
    font-size: 1rem;
    animation: checkmark-pop 0.3s ease;
  }

  @keyframes checkmark-pop {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Enhanced Slider */
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .slider-label {
    font-weight: 600;
    color: #374151;
    font-size: 1rem;
  }

  .slider-value {
    color: #667eea;
    font-size: 1.25rem;
  }

  .slider {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #e5e7eb 0%, #667eea 100%);
    outline: none;
    -webkit-appearance: none;
    transition: background 0.3s ease;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
  }

  .slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .slider::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
  }

  .slider-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  /* Enhanced Comparison Grid */
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .topology-card-enhanced {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .topology-card-enhanced:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .card-header-gradient {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title-main {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .card-icon {
    font-size: 2rem;
    opacity: 0.8;
  }

  .card-description {
    padding: 1.5rem 2rem;
    color: #6b7280;
    line-height: 1.6;
    border-bottom: 1px solid #f3f4f6;
    margin: 0;
  }

  /* Enhanced Metric Sections */
  .metric-section-enhanced {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.2s ease;
  }

  .metric-section-enhanced:hover {
    background: #f9fafb;
  }

  .metric-section-enhanced:last-child {
    border-bottom: none;
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
  }

  .exam-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: #fef3c7;
    color: #92400e;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: help;
    transition: all 0.2s ease;
  }

  .exam-badge:hover {
    background: #fcd34d;
    transform: scale(1.05);
  }

  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-indicator.very-high {
    background: #10b981;
  }

  .status-indicator.high {
    background: #3b82f6;
  }

  .status-indicator.medium {
    background: #f59e0b;
  }

  .status-indicator.low {
    background: #ef4444;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Formula Box */
  .formula-box {
    padding: 1rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    border-left: 4px solid #667eea;
  }

  .formula-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .formula-code {
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    font-size: 0.95rem;
    color: #1f2937;
    background: transparent;
    padding: 0;
  }

  .calculation-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #eff6ff;
    border-radius: 0.5rem;
    border: 1px solid #dbeafe;
  }

  .result-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .result-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: #3b82f6;
  }

  /* Continued in next part... */
`;
