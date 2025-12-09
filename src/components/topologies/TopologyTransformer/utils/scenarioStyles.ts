/**
 * Styles for exam scenarios tab
 */

export const scenarioStyles = `
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
  }
`;
