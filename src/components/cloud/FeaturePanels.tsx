/**
 * FeaturePanels - Educational panels for Cloud Architecture concepts
 * CompTIA Network+ Learning Objective 1.2
 */

import React from 'react';

// ============================================================================
// STATIC DATA
// ============================================================================

const serviceModelComparison = {
  SaaS: {
    name: 'Software as a Service',
    examples: ['Salesforce', 'Office 365', 'Slack', 'Google Workspace'],
    management: 'Fully Managed by Vendor',
    responsibility: ['User data', 'Configuration'],
    scalability: 'Automatic',
    cost: 'Per-user subscription',
    pros: ['Low maintenance', 'Easy collaboration', 'Automatic updates'],
    cons: ['Less customization', 'Vendor lock-in', 'Limited control'],
  },
  PaaS: {
    name: 'Platform as a Service',
    examples: ['AWS Lambda', 'Azure App Service', 'Heroku', 'Firebase'],
    management: 'Managed Runtime/Middleware',
    responsibility: ['Application', 'Data', 'Runtime config'],
    scalability: 'Automatic with auto-scaling',
    cost: 'Per resource usage',
    pros: ['Rapid development', 'Built-in services', 'Automatic scaling'],
    cons: ['Platform constraints', 'Vendor APIs', 'Potential costs'],
  },
  IaaS: {
    name: 'Infrastructure as a Service',
    examples: ['AWS EC2', 'Azure VMs', 'GCP Compute Engine', 'DigitalOcean'],
    management: 'Compute/Storage/Network',
    responsibility: ['OS', 'Middleware', 'Applications', 'Data'],
    scalability: 'Manual or auto-scaling setup',
    cost: 'Per instance/storage/data transfer',
    pros: ['Maximum flexibility', 'No CapEx', 'Complete control'],
    cons: ['Management overhead', 'Security responsibility', 'Complexity'],
  },
};

const connectivityOptions = [
  {
    name: 'VPN (Virtual Private Network)',
    icon: '🔐',
    bandwidth: '50-500 Mbps',
    latency: '20-100 ms',
    cost: '$',
    encryption: 'IPSec/TLS',
    bestFor: 'Remote offices, low bandwidth requirements',
    security: 'Encrypted over internet',
  },
  {
    name: 'Direct Connect',
    icon: '⚡',
    bandwidth: '1-100 Gbps',
    latency: '< 10 ms',
    cost: '$$$',
    encryption: 'Optional (dedicated line)',
    bestFor: 'High bandwidth, mission-critical, low latency',
    security: 'Dedicated private connection',
  },
  {
    name: 'Internet Gateway',
    icon: '🌐',
    bandwidth: 'Best effort',
    latency: '50-200 ms',
    cost: '$',
    encryption: 'TLS/HTTPS',
    bestFor: 'Public web services, internet access',
    security: 'Application-level encryption',
  },
];

const deploymentModels = {
  Public: {
    description: 'Multi-tenant cloud infrastructure operated by third-party',
    providers: ['AWS', 'Azure', 'GCP', 'Oracle Cloud'],
    advantages: ['Cost effective', 'Scalable', 'Global presence', 'Managed services'],
    challenges: ['Security concerns', 'Compliance', 'Multi-tenancy', 'Limited customization'],
    useCases: ['Web applications', 'SaaS delivery', 'Big data analytics'],
  },
  Private: {
    description: 'Dedicated cloud infrastructure for single organization',
    providers: ['On-premises', 'Hosted private clouds', 'Dedicated hosting'],
    advantages: ['Data control', 'Custom configuration', 'Compliance', 'Security'],
    challenges: ['High CapEx', 'Skilled staff required', 'Limited scalability'],
    useCases: ['Banking/Finance', 'Healthcare', 'Government'],
  },
  Hybrid: {
    description: 'Combination of public and private cloud resources',
    providers: ['VMware Cloud', 'Azure Stack', 'AWS Outposts'],
    advantages: ['Flexibility', 'Cost optimization', 'Compliance', 'Scalability'],
    challenges: ['Complexity', 'Management overhead', 'Inter-cloud connectivity'],
    useCases: ['Burst capacity', 'Data sovereignty', 'Legacy + cloud'],
  },
};

const securityConcepts = [
  {
    area: 'Identity & Access Management (IAM)',
    icon: '🔑',
    concepts: ['Multi-factor authentication', 'RBAC', 'Service accounts', 'API keys'],
    bestPractices: [
      'Principle of least privilege',
      'Regular access reviews',
      'Centralized identity management',
      'Conditional access policies',
    ],
  },
  {
    area: 'Encryption',
    icon: '🔒',
    concepts: ['Encryption at rest', 'Encryption in transit', 'Key management', 'TLS/SSL'],
    bestPractices: [
      'Always encrypt sensitive data',
      'Use strong encryption algorithms',
      'Separate key management',
      'Certificate pinning for APIs',
    ],
  },
  {
    area: 'Network Security',
    icon: '🛡️',
    concepts: ['Security groups', 'NACLs', 'WAF', 'Virtual firewalls'],
    bestPractices: [
      'Network segmentation',
      'Defense in depth',
      'DDoS protection',
      'Traffic inspection',
    ],
  },
  {
    area: 'Compliance & Governance',
    icon: '📋',
    concepts: ['HIPAA', 'PCI-DSS', 'GDPR', 'FedRAMP'],
    bestPractices: [
      'Audit logging',
      'Data residency controls',
      'Compliance monitoring',
      'Regular assessments',
    ],
  },
];

const multitenancyPatterns = [
  {
    name: 'Shared Instance',
    description: 'All customers share same application instance',
    isolation: 'Logical (database rows, application logic)',
    dataComplexity: 'Moderate',
    costEfficiency: 'High',
    securityRisk: 'Medium',
  },
  {
    name: 'Dedicated Instance',
    description: 'Each customer has dedicated application instance',
    isolation: 'Instance-level',
    dataComplexity: 'Low',
    costEfficiency: 'Medium',
    securityRisk: 'Low',
  },
  {
    name: 'Separate Database',
    description: 'Each customer has separate database',
    isolation: 'Database-level',
    dataComplexity: 'Low',
    costEfficiency: 'Low',
    securityRisk: 'Very Low',
  },
];

// ============================================================================
// SERVICE COMPARISON PANEL
// ============================================================================

interface ServiceComparisonPanelProps {
  onClose: () => void;
}

export const ServiceComparisonPanel: React.FC<ServiceComparisonPanelProps> = ({ onClose }) => (
  <div className="feature-panel service-comparison-panel">
    <div className="panel-header">
      <h3>Service Models Comparison</h3>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
    <div className="service-summary-cards">
      <div className="summary-card iaas-card">
        <div className="summary-icon">🏗️</div>
        <h4>IaaS</h4>
        <p>Maximum Control</p>
      </div>
      <div className="summary-card paas-card">
        <div className="summary-icon">⚙️</div>
        <h4>PaaS</h4>
        <p>Rapid Development</p>
      </div>
      <div className="summary-card saas-card">
        <div className="summary-icon">📱</div>
        <h4>SaaS</h4>
        <p>Ready to Use</p>
      </div>
    </div>
    <div className="comparison-matrix">
      {Object.entries(serviceModelComparison).map(([model, data]) => {
        const cardClass = model === 'IaaS' ? 'iaas' : model === 'PaaS' ? 'paas' : 'saas';
        return (
          <div key={model} className={`comparison-card ${cardClass}`}>
            <h4>
              <span className="model-icon">
                {model === 'IaaS' ? '🏗️' : model === 'PaaS' ? '⚙️' : '📱'}
              </span>
              {data.name}
            </h4>
            <div className="comparison-row">
              <strong>Examples:</strong>
              <span>{data.examples.join(', ')}</span>
            </div>
            <div className="comparison-row">
              <strong>Management:</strong>
              <span>{data.management}</span>
            </div>
            <div className="comparison-row">
              <strong>Your Responsibility:</strong>
              <ul className="responsibility-list">
                {data.responsibility.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div className="comparison-row">
              <strong>Scalability:</strong>
              <span>{data.scalability}</span>
            </div>
            <div className="comparison-row">
              <strong>Cost Model:</strong>
              <span>{data.cost}</span>
            </div>
            <div className="comparison-row">
              <strong>Pros:</strong>
              <ul className="pros-list">
                {data.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="comparison-row">
              <strong>Cons:</strong>
              <ul className="cons-list">
                {data.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
    <div className="connectivity-section">
      <h4 className="section-title">Cloud Connectivity Options</h4>
      <div className="connectivity-grid">
        {connectivityOptions.map((option) => (
          <div key={option.name} className="connectivity-card">
            <div className="connectivity-icon">{option.icon}</div>
            <h5>{option.name}</h5>
            <div className="connectivity-details">
              <div className="detail-row">
                <span className="detail-label">Bandwidth:</span>
                <span className="detail-value">{option.bandwidth}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Latency:</span>
                <span className="detail-value">{option.latency}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Cost:</span>
                <span className="detail-value">{option.cost}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Encryption:</span>
                <span className="detail-value">{option.encryption}</span>
              </div>
              <div className="detail-row best-for">
                <span className="detail-label">Best For:</span>
                <span className="detail-value">{option.bestFor}</span>
              </div>
              <div className="detail-row security">
                <span className="detail-label">Security:</span>
                <span className="detail-value">{option.security}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// SECURITY PANEL
// ============================================================================

interface SecurityPanelProps {
  onClose: () => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ onClose }) => (
  <div className="feature-panel security-panel">
    <div className="panel-header">
      <h3>Cloud Security Basics</h3>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
    <div className="deployment-models">
      <h4>Deployment Models</h4>
      <div className="deployment-grid">
        {Object.entries(deploymentModels).map(([model, details]) => (
          <div key={model} className="deployment-card">
            <h5>{model}</h5>
            <p className="description">{details.description}</p>
            <div className="detail-section">
              <strong>Providers:</strong>
              <p>{details.providers.join(', ')}</p>
            </div>
            <div className="detail-section">
              <strong>Advantages:</strong>
              <ul>{details.advantages.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
            <div className="detail-section">
              <strong>Use Cases:</strong>
              <p>{details.useCases.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="security-concepts">
      <h4 style={{ marginTop: '20px' }}>Security Concepts</h4>
      {securityConcepts.map((concept) => (
        <div key={concept.area} className="security-card">
          <div className="security-icon">{concept.icon}</div>
          <div className="security-content">
            <h5>{concept.area}</h5>
            <div className="security-row">
              <strong>Key Concepts:</strong>
              <p>{concept.concepts.join(', ')}</p>
            </div>
            <div className="security-row">
              <strong>Best Practices:</strong>
              <ul>{concept.bestPractices.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// ELASTICITY PANEL
// ============================================================================

interface ElasticityPanelProps {
  onClose: () => void;
}

export const ElasticityPanel: React.FC<ElasticityPanelProps> = ({ onClose }) => (
  <div className="feature-panel elasticity-panel">
    <div className="panel-header">
      <h3>Multi-tenancy & Elasticity</h3>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
    <div className="multitenancy-section">
      <h4>Multi-tenancy Patterns</h4>
      <div className="pattern-grid">
        {multitenancyPatterns.map((pattern) => (
          <div key={pattern.name} className="pattern-card">
            <h5>{pattern.name}</h5>
            <p className="pattern-description">{pattern.description}</p>
            <div className="pattern-detail">
              <strong>Isolation:</strong>
              <p>{pattern.isolation}</p>
            </div>
            <div className="pattern-detail">
              <strong>Data Complexity:</strong>
              <p>{pattern.dataComplexity}</p>
            </div>
            <div className="pattern-detail">
              <strong>Cost Efficiency:</strong>
              <p className={`efficiency-${pattern.costEfficiency.toLowerCase()}`}>
                {pattern.costEfficiency}
              </p>
            </div>
            <div className="pattern-detail">
              <strong>Security Risk:</strong>
              <p className={`risk-${pattern.securityRisk.toLowerCase().replace(' ', '-')}`}>
                {pattern.securityRisk}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="elasticity-info">
      <h4 style={{ marginTop: '20px' }}>Elasticity Concepts</h4>
      <div className="info-cards">
        <div className="elasticity-card">
          <h5>Vertical Scaling</h5>
          <p>Increasing resources (CPU, RAM) on existing instances</p>
          <strong>Best For:</strong> Database servers, memory-intensive applications
        </div>
        <div className="elasticity-card">
          <h5>Horizontal Scaling</h5>
          <p>Adding more instances to distribute load</p>
          <strong>Best For:</strong> Stateless applications, web servers
        </div>
        <div className="elasticity-card">
          <h5>Auto-Scaling</h5>
          <p>Automatic adjustment based on metrics (CPU, memory, requests)</p>
          <strong>Best For:</strong> Variable workloads, burst scenarios
        </div>
        <div className="elasticity-card">
          <h5>Serverless</h5>
          <p>Pay-per-use functions without server management</p>
          <strong>Best For:</strong> Event-driven workloads, microservices
        </div>
      </div>
    </div>
  </div>
);

export default { ServiceComparisonPanel, SecurityPanel, ElasticityPanel };
