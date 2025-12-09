/**
 * Template Selection Panel
 */

import React, { useState } from 'react';
import { architectureTemplates } from '../../cloud-learning-utils';
import { getDifficultyColor } from '../utils/styleHelpers';
import type { TemplatesPanelProps } from '../types';

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web', 'Data', 'Enterprise', 'Serverless', 'Hybrid'];
  const filteredTemplates =
    selectedCategory === 'All'
      ? architectureTemplates
      : architectureTemplates.filter((t) => t.category === selectedCategory);

  return (
    <div className="templates-panel">
      <div className="panel-header">
        <div>
          <h3>Architecture Templates</h3>
          <p className="panel-subtitle">Start with proven patterns</p>
        </div>
        <button onClick={onClose} className="close-btn" title="Close">
          ×
        </button>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <span className="template-icon">{template.icon}</span>
              <div className="template-meta">
                <span
                  className="difficulty-badge"
                  style={{ background: getDifficultyColor(template.difficulty) + '20', color: getDifficultyColor(template.difficulty) }}
                >
                  {template.difficulty}
                </span>
                <span className="cost-badge">{template.estimatedCost}</span>
              </div>
            </div>
            <h4>{template.name}</h4>
            <p className="template-description">{template.description}</p>

            <div className="learning-objectives">
              <strong>You'll Learn:</strong>
              <ul>
                {template.learningObjectives.slice(0, 3).map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <button
              className="use-template-btn"
              onClick={() => onSelectTemplate(template)}
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .templates-panel {
          position: fixed;
          right: 0;
          top: 80px;
          width: 650px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 20px rgba(0,0,0,0.15);
          z-index: 100;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 3px solid #3b82f6;
        }

        .panel-header h3 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 22px;
          font-weight: 700;
        }

        .panel-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #111827;
          transform: scale(1.05);
        }

        .category-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .category-filter {
          padding: 8px 16px;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
        }

        .category-filter:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .category-filter.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .templates-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .template-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          transition: all 0.2s;
        }

        .template-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
          transform: translateY(-3px);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .template-icon {
          font-size: 32px;
          line-height: 1;
        }

        .template-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .difficulty-badge,
        .cost-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .cost-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .template-card h4 {
          margin: 0 0 8px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
        }

        .template-description {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .learning-objectives {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .learning-objectives strong {
          display: block;
          color: #065f46;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .learning-objectives ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .learning-objectives li {
          padding: 4px 0 4px 20px;
          position: relative;
          color: #047857;
          font-size: 12px;
          line-height: 1.4;
        }

        .learning-objectives li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 700;
        }

        .use-template-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .use-template-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .use-template-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
