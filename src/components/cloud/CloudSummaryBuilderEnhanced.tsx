/**
 * Component 12: Cloud Concept Summary Card Builder (Enhanced)
 * CompTIA Network+ Learning Objective 1.2
 *
 * Exam-focused enhanced features:
 * - Key cloud terms and definitions
 * - Service comparison matrix
 * - Use case matcher
 * - Cost calculator basics
 * - 4 exam practice questions with instant feedback
 *
 * Optimized to 700 lines with compact design
 */

import React, { useState } from 'react';

// Cloud terminology
const CLOUD_TERMS = {
  'Deployment Models': {
    Public: 'Accessible to general public. Shared infrastructure, lower cost.',
    Private: 'Exclusively for one organization. Higher control and security.',
    Hybrid: 'Combination of public and private clouds with integrated connectivity.',
  },
  'Service Models': {
    SaaS: 'Software as a Service - ready-to-use applications (Office 365, Salesforce)',
    PaaS: 'Platform as a Service - development environment (Azure App Service, Heroku)',
    IaaS: 'Infrastructure as a Service - compute/storage/networking (EC2, Azure VMs)',
  },
  'Key Concepts': {
    Scalability: 'Ability to handle increased workload by adding resources',
    Elasticity: 'Automatic adjustment of resources based on real-time demand',
    Multitenancy: 'Multiple customers sharing same resources with logical separation',
    NFV: 'Network Function Virtualization - replace hardware appliances with virtual functions',
  },
};

// Service comparison data
const SERVICE_COMPARISON = [
  { aspect: 'Management', SaaS: 'Fully managed', PaaS: 'Code and data', IaaS: 'OS, runtime, data' },
  { aspect: 'Flexibility', SaaS: 'None', PaaS: 'High', IaaS: 'Maximum' },
  { aspect: 'Cost Model', SaaS: 'Per-user', PaaS: 'Pay-per-use', IaaS: 'Per-resource' },
  { aspect: 'Best For', SaaS: 'Business apps', PaaS: 'Web APIs', IaaS: 'Large infra' },
];

// Real-world use cases
const USE_CASES = [
  {
    scenario: 'Enterprise email system',
    deployment: 'Public',
    service: 'SaaS',
    example: 'Microsoft 365',
  },
  {
    scenario: 'Containerized microservices',
    deployment: 'Public',
    service: 'PaaS',
    example: 'Cloud Run',
  },
  { scenario: 'Legacy Windows app', deployment: 'Any', service: 'IaaS', example: 'EC2 instances' },
  {
    scenario: 'Healthcare with data residency',
    deployment: 'Hybrid',
    service: 'Any',
    example: 'On-prem + VPN',
  },
  {
    scenario: 'Startup rapid scaling',
    deployment: 'Public',
    service: 'PaaS',
    example: 'Auto-scaling groups',
  },
  {
    scenario: 'Multi-tenant SaaS',
    deployment: 'Public',
    service: 'PaaS+IaaS',
    example: 'Microservices',
  },
];

// Cost calculator profiles
const COST_PROFILES = {
  'Small website': { compute: 50, storage: 5, bandwidth: 10, total: 65 },
  'Medium app': { compute: 300, storage: 100, bandwidth: 50, total: 450 },
  Enterprise: { compute: 2000, storage: 1000, bandwidth: 500, total: 3500 },
};

// Exam questions
const EXAM_QUESTIONS = [
  {
    id: 'q1',
    question:
      'A company needs to deploy applications without managing servers. Which service model?',
    options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
    correct: 'PaaS',
    explanation:
      'PaaS provides platform without server management - deploy code and platform handles infrastructure.',
  },
  {
    id: 'q2',
    question: 'What is hybrid cloud best for?',
    options: [
      'Unlimited scalability',
      'Data residency requirements',
      'Cost reduction',
      'Simplified management',
    ],
    correct: 'Data residency requirements',
    explanation:
      'Hybrid clouds allow sensitive data on-premises (meeting regulations) while using public cloud for other workloads.',
  },
  {
    id: 'q3',
    question: 'Which allows automatic resource adjustment based on demand?',
    options: ['Scalability', 'Elasticity', 'Multitenancy', 'Virtualization'],
    correct: 'Elasticity',
    explanation:
      'Elasticity is automatic scaling based on real-time demand, while scalability is capacity to handle load.',
  },
  {
    id: 'q4',
    question: 'How is customer data isolated in multi-tenant clouds?',
    options: [
      'Separate servers',
      'Separate regions',
      'VPCs and security groups',
      'Only encryption',
    ],
    correct: 'VPCs and security groups',
    explanation:
      'Multi-tenant uses logical isolation (VPCs, network policies) to separate customer data in shared infrastructure.',
  },
];

type TabType = 'terms' | 'comparison' | 'usecase' | 'cost' | 'exam';

export const CloudSummaryBuilderEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('terms');
  const [selectedTermCategory, setSelectedTermCategory] =
    useState<keyof typeof CLOUD_TERMS>('Deployment Models');
  const [costProfile, setCostProfile] = useState<keyof typeof COST_PROFILES>('Medium app');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (qId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [qId]: answer });
  };

  const isCorrect = (qId: string): boolean | null => {
    const ans = userAnswers[qId];
    if (!ans) {
      return null;
    }
    const q = EXAM_QUESTIONS.find((x) => x.id === qId);
    return q ? ans === q.correct : null;
  };

  return (
    <div className="cloud-enhanced-builder">
      <div className="header">
        <h2>Cloud Concepts Masterclass</h2>
        <p>Terminology, comparisons, use cases, costs, and exam practice</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        {(['terms', 'comparison', 'usecase', 'cost', 'exam'] as const).map((t) => (
          <button
            key={t}
            className={`tab-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t === 'terms'
              ? 'Terminology'
              : t === 'comparison'
                ? 'Comparison'
                : t === 'usecase'
                  ? 'Use Cases'
                  : t === 'cost'
                    ? 'Cost'
                    : 'Exam'}
          </button>
        ))}
      </div>

      <div className="tab-content-wrapper">
        {/* Terminology */}
        {activeTab === 'terms' && (
          <div className="tab-section">
            <div className="category-btns">
              {Object.keys(CLOUD_TERMS).map((cat) => (
                <button
                  key={cat}
                  className={`cat-btn ${selectedTermCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedTermCategory(cat as keyof typeof CLOUD_TERMS)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="term-grid">
              {Object.entries(CLOUD_TERMS[selectedTermCategory]).map(([term, def]) => (
                <div key={term} className="term-box">
                  <h4>{term}</h4>
                  <p>{def}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Comparison */}
        {activeTab === 'comparison' && (
          <div className="tab-section">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>SaaS</th>
                  <th>PaaS</th>
                  <th>IaaS</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_COMPARISON.map((row, i) => (
                  <tr key={i}>
                    <td className="aspect">{row.aspect}</td>
                    <td>{row.SaaS}</td>
                    <td>{row.PaaS}</td>
                    <td>{row.IaaS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="info-box">
              Use this matrix to identify which service model fits your use case.
            </div>
          </div>
        )}

        {/* Use Cases */}
        {activeTab === 'usecase' && (
          <div className="tab-section">
            <div className="usecase-grid">
              {USE_CASES.map((uc, i) => (
                <div key={i} className="usecase-box">
                  <p className="scenario">{uc.scenario}</p>
                  <div className="usecase-details">
                    <div>
                      <span className="label">Deployment:</span>{' '}
                      <span className="value">{uc.deployment}</span>
                    </div>
                    <div>
                      <span className="label">Service:</span>{' '}
                      <span className="value">{uc.service}</span>
                    </div>
                    <div>
                      <span className="label">Example:</span>{' '}
                      <span className="value">{uc.example}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cost Calculator */}
        {activeTab === 'cost' && (
          <div className="tab-section">
            <h3>Cloud Cost Estimation</h3>
            <div className="profile-selector">
              {Object.keys(COST_PROFILES).map((prof) => (
                <button
                  key={prof}
                  className={`profile-btn ${costProfile === prof ? 'active' : ''}`}
                  onClick={() => setCostProfile(prof as keyof typeof COST_PROFILES)}
                >
                  {prof}
                </button>
              ))}
            </div>
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Compute:</span>
                <span>${COST_PROFILES[costProfile].compute}/mo</span>
              </div>
              <div className="cost-row">
                <span>Storage:</span>
                <span>${COST_PROFILES[costProfile].storage}/mo</span>
              </div>
              <div className="cost-row">
                <span>Bandwidth:</span>
                <span>${COST_PROFILES[costProfile].bandwidth}/mo</span>
              </div>
              <div className="cost-row total">
                <span>Total:</span>
                <span>${COST_PROFILES[costProfile].total}/mo</span>
              </div>
            </div>
            <div className="info-box">
              Estimates vary by provider, region, and usage. Check AWS/Azure/GCP calculators for
              details.
            </div>
          </div>
        )}

        {/* Exam */}
        {activeTab === 'exam' && (
          <div className="tab-section">
            <h3>Exam Practice Questions</h3>
            <div className="exam-list">
              {EXAM_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className={`exam-box ${isCorrect(q.id) === true ? 'correct' : isCorrect(q.id) === false ? 'incorrect' : ''}`}
                >
                  <h4>{q.question}</h4>
                  <div className="options">
                    {q.options.map((opt) => (
                      <label key={opt} className="option">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={userAnswers[q.id] === opt}
                          onChange={() => handleAnswer(q.id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {userAnswers[q.id] && (
                    <div className={`feedback ${isCorrect(q.id) ? 'success' : 'error'}`}>
                      <strong>{isCorrect(q.id) ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default CloudSummaryBuilderEnhanced;
