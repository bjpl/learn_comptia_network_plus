/**
 * Styles for comparison matrix tab
 */

export const comparisonStyles = `
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

  @media (max-width: 768px) {
    .comparison-cards {
      grid-template-columns: 1fr;
    }

    .score-row {
      grid-template-columns: 70px 1fr 30px;
    }
  }
`;
