/**
 * Styles for TopologyAnalyzerEnhanced component
 * Modular extraction for better maintainability
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

  /* Level Badges */
  .level-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .level-badge.very-high {
    background: #d1fae5;
    color: #065f46;
  }

  .level-badge.high {
    background: #dbeafe;
    color: #1e40af;
  }

  .level-badge.medium {
    background: #fed7aa;
    color: #92400e;
  }

  .level-badge.low {
    background: #fee2e2;
    color: #991b1b;
  }

  /* SPOF Indicator */
  .spof-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .spof-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .spof-yes {
    color: #dc2626;
    font-weight: 600;
  }

  .spof-no {
    color: #059669;
    font-weight: 600;
  }

  .metric-description {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.5rem;
    line-height: 1.5;
  }

  .metric-value-enhanced {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .tolerance-level-enhanced {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  /* Scalability Section */
  .scalability-info-enhanced {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .scalability-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  .scalability-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    transition: width 0.5s ease;
    position: relative;
    overflow: hidden;
  }

  .bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shine 2s infinite;
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .bar-fill.high {
    background: linear-gradient(90deg, #10b981, #059669);
  }

  .bar-fill.medium {
    background: linear-gradient(90deg, #f59e0b, #d97706);
  }

  .bar-fill.low {
    background: linear-gradient(90deg, #ef4444, #dc2626);
  }

  /* Limitations Box */
  .limitations-box {
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.5rem;
    border-left: 4px solid #f59e0b;
    margin-top: 1rem;
  }

  .limitations-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0 0;
  }

  .limitations-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #78350f;
  }

  .limit-icon {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  /* Cost Section */
  .cost-levels-enhanced {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .cost-badge {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .cost-label {
    font-size: 0.75rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .cost-value {
    font-size: 0.95rem;
    font-weight: 700;
  }

  .cost-value.low {
    color: #059669;
  }

  .cost-value.medium {
    color: #d97706;
  }

  .cost-value.high {
    color: #dc2626;
  }

  .cost-value.very-high {
    color: #991b1b;
  }

  /* Cost Breakdown */
  .cost-breakdown-enhanced {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .breakdown-item-enhanced {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .breakdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .breakdown-label {
    font-size: 0.875rem;
    color: #6b7280;
    text-transform: capitalize;
    font-weight: 500;
  }

  .breakdown-percentage {
    font-size: 0.875rem;
    font-weight: 700;
    color: #1f2937;
  }

  .bar-container-enhanced {
    height: 8px;
    background: #f3f4f6;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-enhanced {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .bar-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: bar-shine 2s ease-in-out infinite;
  }

  @keyframes bar-shine {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  /* Traffic Flow */
  .traffic-split-enhanced {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .traffic-item-enhanced {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid;
    transition: all 0.3s ease;
  }

  .traffic-item-enhanced:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .traffic-item-enhanced.north-south {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
  }

  .traffic-item-enhanced.east-west {
    background: #d1fae5;
    border-color: #10b981;
    color: #065f46;
  }

  .traffic-icon {
    font-size: 1.25rem;
  }

  .traffic-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .traffic-value {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .traffic-bar {
    height: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .traffic-fill {
    height: 100%;
    background: currentColor;
    transition: width 0.5s ease;
  }

  /* Bottlenecks */
  .bottlenecks-enhanced {
    padding: 1rem;
    background: #fef2f2;
    border-radius: 0.5rem;
    border-left: 4px solid #ef4444;
    margin-top: 1rem;
  }

  .bottleneck-header {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 0.5rem;
  }

  .bottleneck-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bottleneck-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #7f1d1d;
  }

  .bottleneck-icon {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  /* Use Cases */
  .use-cases-enhanced {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .use-case-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .use-case-item:hover {
    background: #eff6ff;
    transform: translateX(4px);
  }

  .use-case-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .use-case-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.5;
  }

  /* Card Actions */
  .card-actions {
    padding: 1.5rem 2rem;
    border-top: 1px solid #f3f4f6;
    display: flex;
    gap: 1rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  .action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-icon-small {
    font-size: 1rem;
  }

  /* Enhanced Comparison Table */
  .radar-comparison-enhanced {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 3rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .comparison-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .comparison-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .comparison-table-wrapper {
    overflow-x: auto;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .comparison-table-enhanced {
    width: 100%;
    border-collapse: collapse;
  }

  .metric-header-cell,
  .topology-header-cell {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
    color: #374151;
  }

  .topology-header-cell {
    text-align: center;
  }

  .metric-name-cell,
  .score-cell {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }

  .metric-name-cell {
    font-weight: 500;
    color: #6b7280;
    text-transform: capitalize;
  }

  .score-bar-container {
    height: 32px;
    background: #f3f4f6;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .score-fill-enhanced {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #059669);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.75rem;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .score-fill-enhanced::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: score-shine 2s infinite;
  }

  @keyframes score-shine {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .score-text {
    font-weight: 700;
    color: white;
    font-size: 0.875rem;
    position: relative;
    z-index: 1;
  }

  /* Enhanced Tooltip */
  .tooltip-overlay {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    animation: tooltip-fade-in 0.2s ease;
  }

  @keyframes tooltip-fade-in {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .tooltip-content {
    background: #1f2937;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    max-width: 300px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .tooltip-text {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .tooltip-exam-tip {
    padding: 0.75rem;
    background: rgba(254, 243, 199, 0.2);
    border-radius: 0.375rem;
    border-left: 3px solid #fbbf24;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .exam-tip-icon {
    flex-shrink: 0;
  }

  .exam-tip-text {
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: #fde68a;
  }

  .tooltip-arrow {
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 12px;
    height: 12px;
    background: #1f2937;
    transform: rotate(45deg);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .analyzer-header {
      flex-direction: column;
      gap: 1.5rem;
    }

    .comparison-grid {
      grid-template-columns: 1fr;
    }

    .topology-buttons {
      grid-template-columns: 1fr;
    }

    .scalability-stats {
      grid-template-columns: 1fr;
    }

    .cost-levels-enhanced {
      grid-template-columns: 1fr;
    }

    .traffic-split-enhanced {
      grid-template-columns: 1fr;
    }
  }

  /* Accessibility Enhancements */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Focus States for Keyboard Navigation */
  .topology-btn:focus-visible,
  .slider:focus-visible,
  .action-btn:focus-visible,
  .info-icon:focus-visible {
    outline: 3px solid #667eea;
    outline-offset: 2px;
  }
`;
