/**
 * Centralized styles for CloudSummaryBuilder component
 */

export const styles = `
  .cloud-summary-builder {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
  }

  .header h2 {
    color: #111827;
    margin-bottom: 10px;
  }

  @media (prefers-color-scheme: dark) {
    .header h2 {
      color: #f9fafb;
    }
  }

  .header p {
    color: #374151;
  }

  @media (prefers-color-scheme: dark) {
    .header p {
      color: #d1d5db;
    }
  }

  .scenario-selector {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .scenario-selector select {
    flex: 1;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .scenario-panel, .summary-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    max-height: 800px;
    overflow-y: auto;
  }

  .scenario-panel h3 {
    color: #111827;
    margin-bottom: 10px;
  }

  @media (prefers-color-scheme: dark) {
    .scenario-panel h3 {
      color: #f9fafb;
    }
  }

  .scenario-metadata {
    margin-bottom: 15px;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    background: #3b82f6;
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .scenario-description p {
    margin-bottom: 15px;
    line-height: 1.6;
    color: #374151;
  }

  .scenario-requirements {
    margin-top: 20px;
    padding: 15px;
    background: #f9fafb;
    border-radius: 6px;
  }

  .scenario-requirements h4 {
    margin-bottom: 10px;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .scenario-requirements h4 {
      color: #f9fafb;
    }
  }

  .scenario-requirements ul {
    list-style: none;
    padding: 0;
  }

  .scenario-requirements li {
    padding: 6px 0;
    color: #111827;
    position: relative;
    padding-left: 20px;
  }

  @media (prefers-color-scheme: dark) {
    .scenario-requirements li {
      color: #f3f4f6;
    }
  }

  .scenario-requirements li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: bold;
  }

  .word-counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f3f4f6;
    border-radius: 6px;
    margin-bottom: 20px;
  }

  .count {
    font-size: 18px;
    font-weight: 600;
  }

  .count.good { color: #10b981; }
  .count.warning { color: #f59e0b; }
  .count.error { color: #ef4444; }

  .target {
    font-size: 14px;
    color: #374151;
  }

  @media (prefers-color-scheme: dark) {
    .target {
      color: #d1d5db;
    }
  }

  .summary-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    font-size: 14px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .checkbox-group {
    display: flex;
    gap: 20px;
    margin-bottom: 8px;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: normal;
    margin-bottom: 0;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .btn-primary, .btn-secondary {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-secondary {
    background: #e5e7eb;
    color: #374151;
  }

  .btn-secondary:hover {
    background: #d1d5db;
  }

  .score-panel {
    margin-top: 20px;
    padding: 20px;
    background: #f0f9ff;
    border: 2px solid #3b82f6;
    border-radius: 8px;
  }

  .score-panel h3 {
    color: #1e40af;
    margin-bottom: 15px;
    text-align: center;
  }

  .score-breakdown {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: white;
    border-radius: 4px;
  }

  .score-value {
    font-weight: 600;
    color: #3b82f6;
  }

  .feedback h4 {
    margin-bottom: 10px;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .feedback h4 {
      color: #f9fafb;
    }
  }

  .feedback ul {
    list-style: none;
    padding: 0;
  }

  .feedback li {
    padding: 6px 0;
    color: #111827;
    position: relative;
    padding-left: 20px;
  }

  @media (prefers-color-scheme: dark) {
    .feedback li {
      color: #f3f4f6;
    }
  }

  .feedback li:first-child {
    font-weight: 600;
    color: #1f2937;
  }

  .feedback li:first-child:before {
    content: "→";
    position: absolute;
    left: 0;
  }

  .feedback li:not(:first-child):before {
    content: "•";
    position: absolute;
    left: 0;
  }

  .ideal-solution {
    margin-top: 20px;
    padding: 20px;
    background: #f0fdf4;
    border: 2px solid #10b981;
    border-radius: 8px;
  }

  .ideal-solution h3 {
    color: #065f46;
    margin-bottom: 15px;
  }

  .solution-content p {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #374151;
  }

  .solution-content strong {
    color: #065f46;
  }

  .tab-navigation {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    border-bottom: 2px solid #e5e7eb;
    overflow-x: auto;
  }

  .tab-button {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: #1f2937;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  @media (prefers-color-scheme: dark) {
    .tab-button {
      color: #e5e7eb;
    }
  }

  .tab-button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .tab-button:hover {
    color: #3b82f6;
  }

  .tab-content {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 30px;
    margin-top: 20px;
  }

  .term-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    flex-wrap: wrap;
  }

  .term-category-btn {
    padding: 10px 18px;
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    color: #374151;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .term-category-btn.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .terminology-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .term-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.2s;
  }

  .term-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .term-card h3 {
    color: #111827;
    margin-bottom: 12px;
    font-size: 16px;
  }

  @media (prefers-color-scheme: dark) {
    .term-card h3 {
      color: #f9fafb;
    }
  }

  .term-card p {
    color: #374151;
    line-height: 1.6;
    font-size: 14px;
  }

  @media (prefers-color-scheme: dark) {
    .term-card p {
      color: #d1d5db;
    }
  }

  .comparison-table {
    overflow-x: auto;
    margin-bottom: 20px;
  }

  .comparison-table table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  .comparison-table th {
    background: #3b82f6;
    color: white;
    padding: 15px;
    text-align: left;
    font-weight: 600;
  }

  .comparison-table td {
    padding: 15px;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }

  .comparison-table .aspect-cell {
    background: #f9fafb;
    font-weight: 600;
    width: 20%;
  }

  .comparison-note {
    background: #f0f9ff;
    border-left: 4px solid #3b82f6;
    padding: 15px;
    border-radius: 4px;
    color: #1e40af;
  }

  .usecase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .usecase-card {
    background: white;
    border: 2px solid #dbeafe;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.2s;
  }

  .usecase-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .usecase-card h4 {
    color: #111827;
    margin-bottom: 10px;
    font-size: 14px;
  }

  @media (prefers-color-scheme: dark) {
    .usecase-card h4 {
      color: #f9fafb;
    }
  }

  .scenario-text {
    color: #1f2937;
    margin-bottom: 15px;
    font-style: italic;
    padding-bottom: 15px;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .scenario-text {
      color: #e5e7eb;
    }
  }

  .usecase-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .usecase-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .usecase-item .label {
    font-weight: 600;
    color: #111827;
    font-size: 12px;
    text-transform: uppercase;
  }

  @media (prefers-color-scheme: dark) {
    .usecase-item .label {
      color: #f3f4f6;
    }
  }

  .usecase-item .value {
    color: #3b82f6;
    font-weight: 600;
  }

  .cost-calculator {
    max-width: 600px;
    margin: 0 auto;
  }

  .cost-calculator h3 {
    color: #111827;
    margin-bottom: 25px;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    .cost-calculator h3 {
      color: #f9fafb;
    }
  }

  .cost-profile-selector {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
  }

  .cost-profile-selector label {
    font-weight: 600;
    color: #374151;
    margin-bottom: 5px;
  }

  .cost-profile-selector .profile-btn {
    padding: 12px;
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .cost-profile-selector .profile-btn.active {
    background: #10b981;
    border-color: #10b981;
    color: white;
  }

  .cost-breakdown {
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .cost-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }

  .cost-item.total {
    border: none;
    font-weight: 600;
    font-size: 16px;
    color: #1f2937;
    padding-top: 15px;
    margin-top: 10px;
    border-top: 2px solid #d1d5db;
  }

  .cost-label {
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .cost-label {
      color: #f3f4f6;
    }
  }

  .cost-value {
    font-weight: 600;
    color: #10b981;
  }

  .cost-item.total .cost-value {
    color: #1f2937;
    font-size: 18px;
  }

  .cost-note {
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 15px;
    border-radius: 4px;
    color: #92400e;
    font-size: 13px;
  }

  .cost-note p {
    margin: 0;
    line-height: 1.6;
  }

  .exam-practice h3 {
    color: #111827;
    margin-bottom: 25px;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    .exam-practice h3 {
      color: #f9fafb;
    }
  }

  .exam-questions {
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .exam-question {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    transition: all 0.2s;
  }

  .exam-question.correct {
    border-color: #10b981;
    background: #f0fdf4;
  }

  .exam-question.incorrect {
    border-color: #ef4444;
    background: #fef2f2;
  }

  .exam-question h4 {
    color: #111827;
    margin-bottom: 15px;
    font-size: 15px;
    line-height: 1.6;
  }

  @media (prefers-color-scheme: dark) {
    .exam-question h4 {
      color: #f9fafb;
    }
  }

  .exam-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .exam-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .exam-option:hover {
    background: #f3f4f6;
  }

  .exam-option input[type='radio'] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .exam-option span {
    color: #374151;
    font-weight: 500;
  }

  .exam-feedback {
    padding: 12px;
    border-radius: 6px;
    margin-top: 10px;
  }

  .exam-feedback.success {
    background: #d1fae5;
    color: #065f46;
    border-left: 4px solid #10b981;
  }

  .exam-feedback.error {
    background: #fee2e2;
    color: #7f1d1d;
    border-left: 4px solid #ef4444;
  }

  .exam-feedback p {
    margin: 0;
    line-height: 1.6;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .tab-navigation {
      flex-wrap: wrap;
    }

    .terminology-grid {
      grid-template-columns: 1fr;
    }

    .usecase-grid {
      grid-template-columns: 1fr;
    }

    .comparison-table {
      font-size: 13px;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 10px 8px;
    }

    .cost-profile-selector .profile-btn {
      padding: 10px;
      font-size: 13px;
    }
  }
`;
