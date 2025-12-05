/**
 * Styles for TopologyTransformer component
 * Extracted for better maintainability
 */

export const topologyTransformerStyles = `
  .topology-transformer {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .transformer-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  /* Tab Navigation */
  .tab-navigation {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.75rem 1.5rem;
    background: white;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 600;
    color: #6b7280;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .tab-btn:hover {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .tab-btn.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .tab-icon {
    font-size: 1.2rem;
  }

  .tab-intro {
    color: #6b7280;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .transformer-header h2 {
    font-size: 2rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .transformer-header p {
    color: #6b7280;
    font-size: 1rem;
  }

  .transformation-selection {
    margin-bottom: 2rem;
  }

  .transformation-selection h3 {
    margin-bottom: 1rem;
    color: #374151;
  }

  .scenario-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .scenario-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #d1d5db;
    background: white;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .scenario-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .scenario-btn.active {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }

  .scenario-btn .from,
  .scenario-btn .to {
    text-transform: capitalize;
  }

  .scenario-btn .arrow {
    font-weight: bold;
  }

  .transformation-info {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .transformation-info h3 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .transformation-info .description {
    color: #6b7280;
  }

  .animation-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .control-btn {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
  }

  .control-btn:hover {
    background: #2563eb;
  }

  .step-progress {
    margin-bottom: 2rem;
  }

  .progress-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    transition: width 0.5s ease;
  }

  .step-buttons {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
  }

  .step-btn {
    padding: 0.75rem 1rem;
    border: 2px solid #d1d5db;
    background: white;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 150px;
    transition: all 0.2s;
  }

  .step-btn:hover {
    border-color: #3b82f6;
  }

  .step-btn.active {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .step-btn.completed {
    background: #d1fae5;
    border-color: #10b981;
  }

  .step-number {
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 0.25rem;
  }

  .step-title {
    font-size: 0.875rem;
    color: #374151;
  }

  .visualization-area {
    margin-bottom: 2rem;
    padding: 2rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .side-by-side {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
  }

  .topology-view h4 {
    text-align: center;
    margin-bottom: 1rem;
    color: #374151;
  }

  .transformation-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .arrow-icon {
    font-size: 3rem;
    color: #3b82f6;
  }

  .step-indicator {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
  }

  .single-view {
    max-width: 800px;
    margin: 0 auto;
  }

  .current-step h4 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .step-description {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .topology-diagram {
    margin-bottom: 2rem;
  }

  .diagram-placeholder {
    height: 300px;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: relative;
    overflow: hidden;
  }

  .diagram-placeholder.animating::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(59, 130, 246, 0.1) 50%,
      transparent 70%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }
  }

  .topology-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    text-transform: capitalize;
    z-index: 1;
  }

  .topology-icon {
    font-size: 4rem;
    z-index: 1;
  }

  .step-changes {
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .step-changes h5 {
    color: #374151;
    margin-bottom: 1rem;
  }

  .changes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .change-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .change-item .label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .change-item .value {
    font-weight: 600;
    text-transform: capitalize;
  }

  .change-item .value.increase {
    color: #059669;
  }

  .change-item .value.decrease {
    color: #dc2626;
  }

  .change-item .value.maintain,
  .change-item .value.improve {
    color: #3b82f6;
  }

  .change-item .value.reduce {
    color: #f59e0b;
  }

  .detailed-analysis {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .detailed-analysis h3 {
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .analysis-section {
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .analysis-section h4 {
    color: #374151;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .analysis-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .analysis-item .label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
  }

  .analysis-item .value {
    font-size: 0.875rem;
    color: #374151;
  }

  .analysis-item.highlight {
    padding: 0.75rem;
    background: #eff6ff;
    border-left: 3px solid #3b82f6;
    border-radius: 0.25rem;
  }

  .analysis-item.highlight .value {
    font-weight: 600;
    color: #1e40af;
  }

  .benefits-considerations {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .benefits,
  .considerations {
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  .benefits {
    background: #d1fae5;
    border: 1px solid #10b981;
  }

  .considerations {
    background: #fef3c7;
    border: 1px solid #f59e0b;
  }

  .benefits h4 {
    color: #065f46;
    margin-bottom: 1rem;
  }

  .considerations h4 {
    color: #92400e;
    margin-bottom: 1rem;
  }

  .benefits ul,
  .considerations ul {
    list-style: none;
    padding: 0;
  }

  .benefits li,
  .considerations li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }

  .benefits .icon {
    color: #059669;
    font-weight: bold;
  }

  .considerations .icon {
    color: #f59e0b;
    font-weight: bold;
  }

  /* Comparison Matrix Tab */
  .comparison-matrix-tab {
    padding: 0;
  }

  .score-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .legend-item .color {
    width: 16px;
    height: 16px;
    border-radius: 0.25rem;
  }

  .legend-item .color.cost {
    background: #f59e0b;
  }

  .legend-item .color.redundancy {
    background: #ef4444;
  }

  .legend-item .color.scalability {
    background: #10b981;
  }

  .legend-item .color.complexity {
    background: #8b5cf6;
  }

  .comparison-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .comparison-card {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .comparison-card .topology-name {
    text-align: center;
    color: #1f2937;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .scores-section {
    margin-bottom: 1.5rem;
  }

  .score-row {
    display: grid;
    grid-template-columns: 80px 1fr 30px;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .score-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
  }

  .score-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .score-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .score-fill.cost {
    background: #f59e0b;
  }

  .score-fill.redundancy {
    background: #ef4444;
  }

  .score-fill.scalability {
    background: #10b981;
  }

  .score-fill.complexity {
    background: #8b5cf6;
  }

  .score-value {
    font-weight: 600;
    color: #374151;
    text-align: right;
    font-size: 0.875rem;
  }

  .pros-cons {
    margin-bottom: 1rem;
  }

  .pros-cons h5 {
    font-size: 0.875rem;
    color: #374151;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .pros-list,
  .cons-list {
    list-style: none;
    padding: 0;
  }

  .pros-list li,
  .cons-list li {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .pros-list li span,
  .cons-list li span {
    font-weight: 700;
    flex-shrink: 0;
  }

  .pros-list li span {
    color: #10b981;
  }

  .cons-list li span {
    color: #ef4444;
  }

  /* Exam Scenarios Tab */
  .exam-scenarios-tab {
    padding: 0;
  }

  .scenario-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .scenario-card {
    padding: 1.5rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .scenario-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
  }

  .scenario-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .scenario-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .scenario-header h4 {
    color: #1f2937;
    font-size: 0.95rem;
    margin: 0;
  }

  .scenario-id {
    font-size: 0.7rem;
    background: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .scenario-summary {
    font-size: 0.875rem;
    color: #3b82f6;
  }

  .scenario-details {
    padding: 2rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .scenario-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-section h3 {
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .detail-section .description {
    color: #6b7280;
    line-height: 1.6;
  }

  .requirements-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .subsection h4 {
    color: #374151;
    margin-bottom: 1rem;
  }

  .subsection ul {
    list-style: none;
    padding: 0;
  }

  .subsection li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .subsection .icon {
    flex-shrink: 0;
    font-weight: bold;
    color: #3b82f6;
  }

  .recommendation-box {
    padding: 1.5rem;
    background: #eff6ff;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
  }

  .recommendation-box h4 {
    color: #1e40af;
    margin-bottom: 1rem;
  }

  .topology-recommendation {
    display: flex;
    justify-content: center;
  }

  .topology-badge {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .exam-tip-box {
    padding: 1rem;
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    border-radius: 0.25rem;
  }

  .exam-tip-box h4 {
    color: #92400e;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .exam-tip-box p {
    color: #78350f;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }

  .quick-reference {
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .quick-reference h3 {
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  .reference-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 150px 1fr 150px 120px;
    gap: 1rem;
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .table-header {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
    position: sticky;
    top: 0;
  }

  .table-row:hover {
    background: #f9fafb;
  }

  .table-cell {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .table-cell code {
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
    color: #1f2937;
  }

  @media (max-width: 768px) {
    .side-by-side {
      grid-template-columns: 1fr;
    }

    .transformation-arrow {
      transform: rotate(90deg);
    }

    .benefits-considerations {
      grid-template-columns: 1fr;
    }

    .comparison-cards {
      grid-template-columns: 1fr;
    }

    .scenario-list {
      grid-template-columns: 1fr;
    }

    .requirements-section {
      grid-template-columns: 1fr;
    }

    .table-header,
    .table-row {
      grid-template-columns: 1fr;
    }

    .table-cell {
      padding: 0.5rem 0;
    }

    .score-row {
      grid-template-columns: 70px 1fr 30px;
    }
  }
`;
