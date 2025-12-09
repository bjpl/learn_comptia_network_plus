/**
 * Styles for Cloud Summary Builder Enhanced
 */

import React from 'react';

export const CloudSummaryStyles: React.FC = () => {
  return (
    <style>{`
      .cloud-enhanced-builder {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
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

      .tab-nav {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        border-bottom: 2px solid #e5e7eb;
        overflow-x: auto;
      }

      .tab-btn {
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
        .tab-btn {
          color: #e5e7eb;
        }
      }

      .tab-btn.active {
        color: #3b82f6;
        border-bottom-color: #3b82f6;
      }

      .tab-content-wrapper {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 30px;
      }

      .tab-section h3 {
        color: #111827;
        margin-bottom: 20px;
      }

      @media (prefers-color-scheme: dark) {
        .tab-section h3 {
          color: #f9fafb;
        }
      }

      /* Terminology */
      .category-btns {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        flex-wrap: wrap;
      }

      .cat-btn {
        padding: 10px 16px;
        background: #f3f4f6;
        border: 2px solid #d1d5db;
        border-radius: 6px;
        color: #374151;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cat-btn.active {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
      }

      .term-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .term-box {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 18px;
        transition: all 0.2s;
      }

      .term-box:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .term-box h4 {
        color: #111827;
        margin-bottom: 10px;
        font-size: 15px;
      }

      @media (prefers-color-scheme: dark) {
        .term-box h4 {
          color: #f9fafb;
        }
      }

      .term-box p {
        color: #374151;
        line-height: 1.5;
        font-size: 14px;
      }

      @media (prefers-color-scheme: dark) {
        .term-box p {
          color: #d1d5db;
        }
      }

      /* Comparison */
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .comparison-table th {
        background: #3b82f6;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
      }

      .comparison-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
        color: #374151;
      }

      .comparison-table .aspect {
        background: #f9fafb;
        font-weight: 600;
        width: 20%;
      }

      /* Use Cases */
      .usecase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .usecase-box {
        border: 2px solid #dbeafe;
        border-radius: 8px;
        padding: 18px;
        transition: all 0.2s;
      }

      .usecase-box:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }

      .scenario {
        color: #1f2937;
        margin-bottom: 15px;
        font-style: italic;
        padding-bottom: 15px;
        border-bottom: 1px solid #e5e7eb;
      }

      @media (prefers-color-scheme: dark) {
        .scenario {
          color: #e5e7eb;
        }
      }

      .usecase-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .usecase-details div {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .label {
        font-weight: 600;
        color: #111827;
        font-size: 12px;
        text-transform: uppercase;
      }

      @media (prefers-color-scheme: dark) {
        .label {
          color: #f3f4f6;
        }
      }

      .value {
        color: #3b82f6;
        font-weight: 600;
      }

      /* Cost */
      .profile-selector {
        display: flex;
        gap: 10px;
        margin-bottom: 25px;
        flex-wrap: wrap;
      }

      .profile-btn {
        padding: 10px 16px;
        background: #f3f4f6;
        border: 2px solid #d1d5db;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }

      .profile-btn.active {
        background: #10b981;
        border-color: #10b981;
        color: white;
      }

      .cost-breakdown {
        background: #f9fafb;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        max-width: 500px;
      }

      .cost-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
        color: #374151;
      }

      .cost-row.total {
        border: none;
        font-weight: 600;
        font-size: 16px;
        padding-top: 15px;
        margin-top: 10px;
        border-top: 2px solid #d1d5db;
      }

      .cost-row.total span:last-child {
        color: #10b981;
        font-size: 18px;
      }

      /* Exam */
      .exam-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .exam-box {
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        transition: all 0.2s;
      }

      .exam-box.correct {
        border-color: #10b981;
        background: #f0fdf4;
      }

      .exam-box.incorrect {
        border-color: #ef4444;
        background: #fef2f2;
      }

      .exam-box h4 {
        color: #111827;
        margin-bottom: 15px;
        font-size: 15px;
        line-height: 1.6;
      }

      @media (prefers-color-scheme: dark) {
        .exam-box h4 {
          color: #f9fafb;
        }
      }

      .options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
      }

      .option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .option:hover {
        background: #f3f4f6;
      }

      .option input {
        cursor: pointer;
        width: 18px;
        height: 18px;
      }

      .option span {
        color: #374151;
      }

      .feedback {
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
      }

      .feedback.success {
        background: #d1fae5;
        color: #065f46;
        border-left: 4px solid #10b981;
      }

      .feedback.error {
        background: #fee2e2;
        color: #7f1d1d;
        border-left: 4px solid #ef4444;
      }

      .feedback strong {
        display: block;
        margin-bottom: 5px;
      }

      .info-box {
        background: #f0f9ff;
        border-left: 4px solid #3b82f6;
        padding: 15px;
        border-radius: 4px;
        color: #1e40af;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .term-grid,
        .usecase-grid {
          grid-template-columns: 1fr;
        }

        .comparison-table {
          font-size: 13px;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 8px;
        }

        .tab-nav {
          flex-wrap: wrap;
        }
      }
    `}</style>
  );
};
