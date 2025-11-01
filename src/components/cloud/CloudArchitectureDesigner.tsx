/**
 * Component 5: Cloud Architecture Designer (Enhanced)
 * CompTIA Network+ Learning Objective 1.2
 *
 * Interactive cloud architecture design tool with:
 * - Service Model Comparison (IaaS/PaaS/SaaS)
 * - Deployment Model Builder
 * - Cloud Connectivity Options
 * - Multi-tenancy & Elasticity Visualization
 * - Cloud Security Basics
 */

import React, { useState, useRef } from 'react';
import { componentLibrary, validationRules } from './cloud-data';
import type {
  ArchitectureComponent,
  Connection,
  ArchitectureDesign,
  ValidationResult,
  CanvasState,
  ComponentLibraryItem,
  ComponentType,
  DeploymentZone,
  ServiceLayer,
  ConnectivityOption,
  VPCElement,
  Gateway,
  NFVComponent,
  ValidationError,
  ValidationWarning,
} from './cloud-types';

export const CloudArchitectureDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [design, setDesign] = useState<ArchitectureDesign>({
    id: 'design-' + Date.now(),
    name: 'New Cloud Architecture',
    description: '',
    components: [],
    connections: [],
    metadata: {
      created: new Date(),
      modified: new Date(),
      author: 'Student',
    },
  });

  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    isConnecting: false,
    gridSize: 20,
    snapToGrid: true,
  });

  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ComponentType>('deployment-zone');
  const [showServiceComparison, setShowServiceComparison] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showElasticityVisualization, setShowElasticityVisualization] = useState(false);

  const snapToGrid = (value: number): number => {
    if (!canvasState.snapToGrid) {
      return value;
    }
    return Math.round(value / canvasState.gridSize) * canvasState.gridSize;
  };

  const handleDragStart = (e: React.DragEvent, libraryItem: ComponentLibraryItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(libraryItem));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const data = e.dataTransfer.getData('application/json');
    if (!data) {
      return;
    }

    const libraryItem = JSON.parse(data) as ComponentLibraryItem;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = snapToGrid((e.clientX - rect.left - canvasState.panX) / canvasState.zoom);
    const y = snapToGrid((e.clientY - rect.top - canvasState.panY) / canvasState.zoom);

    const newComponent: ArchitectureComponent = {
      id: `component-${Date.now()}`,
      type: libraryItem.type,
      subtype: libraryItem.subtype as
        | DeploymentZone
        | ServiceLayer
        | ConnectivityOption
        | VPCElement
        | Gateway
        | NFVComponent,
      name: `${libraryItem.name} ${design.components.length + 1}`,
      x,
      y,
      width: libraryItem.defaultWidth,
      height: libraryItem.defaultHeight,
      color: libraryItem.color,
      icon: libraryItem.icon,
      properties: libraryItem.properties.reduce<Record<string, string | number | boolean>>(
        (acc, prop) => {
          acc[prop.key] = (prop.default as string | number | boolean | undefined) || '';
          return acc;
        },
        {}
      ),
      connections: [],
    };

    setDesign({
      ...design,
      components: [...design.components, newComponent],
      metadata: { ...design.metadata, modified: new Date() },
    });
  };

  const handleComponentClick = (component: ArchitectureComponent) => {
    setSelectedComponent(component);
  };

  const handleComponentDelete = (componentId: string) => {
    setDesign({
      ...design,
      components: design.components.filter((c) => c.id !== componentId),
      connections: design.connections.filter((c) => c.from !== componentId && c.to !== componentId),
      metadata: { ...design.metadata, modified: new Date() },
    });
    setSelectedComponent(null);
  };

  const handlePropertyChange = (key: string, value: string | number | boolean) => {
    if (!selectedComponent) {
      return;
    }

    const updatedComponents = design.components.map((c) =>
      c.id === selectedComponent.id ? { ...c, properties: { ...c.properties, [key]: value } } : c
    );

    setDesign({
      ...design,
      components: updatedComponents,
      metadata: { ...design.metadata, modified: new Date() },
    });

    setSelectedComponent({
      ...selectedComponent,
      properties: { ...selectedComponent.properties, [key]: value },
    });
  };

  const handleCreateConnection = (fromId: string, toId: string) => {
    const from = design.components.find((c) => c.id === fromId);
    const to = design.components.find((c) => c.id === toId);

    if (!from || !to) {
      return;
    }

    const libraryItem = componentLibrary.find(
      (item) => item.type === from.type && item.subtype === from.subtype
    );

    if (libraryItem && !libraryItem.allowedConnections.includes(to.type)) {
      alert(`Cannot connect ${from.subtype} to ${to.subtype}`);
      return;
    }

    const newConnection: Connection = {
      id: `connection-${Date.now()}`,
      from: fromId,
      to: toId,
      type: 'network',
      label: `${from.name} → ${to.name}`,
    };

    setDesign({
      ...design,
      connections: [...design.connections, newConnection],
      metadata: { ...design.metadata, modified: new Date() },
    });
  };

  const validateArchitecture = () => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Run validation rules
    Object.values(validationRules).forEach((rule) => {
      const result = rule.check(design.components);
      if (!result.valid) {
        const errorMessage =
          typeof result === 'object' && 'message' in result && typeof result.message === 'string'
            ? result.message
            : 'Validation failed';
        errors.push({
          message: errorMessage,
          severity: 'error',
          suggestion: 'Review architecture requirements',
        });
      }
    });

    // Check for isolated components
    design.components.forEach((component) => {
      const hasConnections = design.connections.some(
        (conn) => conn.from === component.id || conn.to === component.id
      );
      if (!hasConnections && component.type !== 'deployment-zone') {
        warnings.push({
          componentId: component.id,
          message: `${component.name} is not connected to any other components`,
          type: 'best-practice',
        });
      }
    });

    // Calculate score
    const maxScore = 100;
    const errorPenalty = errors.length * 15;
    const warningPenalty = warnings.length * 5;
    const score = Math.max(0, maxScore - errorPenalty - warningPenalty);

    const validationResult: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      score,
    };

    setValidation(validationResult);
    setDesign({ ...design, validation: validationResult });
  };

  const handleExport = () => {
    const exportData = JSON.stringify(design, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategorizedLibrary = () => {
    return componentLibrary.filter((item) => item.type === activeCategory);
  };

  // Service Model Comparison Data
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

  // Cloud Connectivity Options
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

  // Deployment Model Details
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

  // Cloud Security Concepts
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

  // Multi-tenancy Visualization
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

  return (
    <div className="cloud-architecture-designer">
      <div className="header">
        <div className="title-section">
          <h2>Cloud Architecture Designer</h2>
          <input
            type="text"
            className="design-name"
            value={design.name}
            onChange={(e) => setDesign({ ...design, name: e.target.value })}
            placeholder="Architecture name"
          />
        </div>
        <div className="toolbar">
          <button onClick={() => setShowLibrary(!showLibrary)}>
            {showLibrary ? 'Hide' : 'Show'} Library
          </button>
          <button
            onClick={() => setShowServiceComparison(!showServiceComparison)}
            title="Compare SaaS, PaaS, IaaS"
          >
            Service Models
          </button>
          <button
            onClick={() => setShowSecurityPanel(!showSecurityPanel)}
            title="Cloud security concepts"
          >
            Security
          </button>
          <button
            onClick={() => setShowElasticityVisualization(!showElasticityVisualization)}
            title="Elasticity & multi-tenancy"
          >
            Elasticity
          </button>
          <button onClick={validateArchitecture}>Validate</button>
          <button onClick={handleExport}>Export</button>
          <label>
            <input
              type="checkbox"
              checked={canvasState.snapToGrid}
              onChange={(e) => setCanvasState({ ...canvasState, snapToGrid: e.target.checked })}
            />
            Snap to Grid
          </label>
        </div>
      </div>

      <div className="workspace">
        {showLibrary && (
          <div className="component-library">
            <h3>Component Library</h3>
            <div className="category-tabs">
              <button
                className={activeCategory === 'deployment-zone' ? 'active' : ''}
                onClick={() => setActiveCategory('deployment-zone')}
              >
                Deployment
              </button>
              <button
                className={activeCategory === 'service-layer' ? 'active' : ''}
                onClick={() => setActiveCategory('service-layer')}
              >
                Services
              </button>
              <button
                className={activeCategory === 'connectivity' ? 'active' : ''}
                onClick={() => setActiveCategory('connectivity')}
              >
                Connectivity
              </button>
              <button
                className={activeCategory === 'vpc-element' ? 'active' : ''}
                onClick={() => setActiveCategory('vpc-element')}
              >
                VPC
              </button>
              <button
                className={activeCategory === 'gateway' ? 'active' : ''}
                onClick={() => setActiveCategory('gateway')}
              >
                Gateways
              </button>
              <button
                className={activeCategory === 'nfv-component' ? 'active' : ''}
                onClick={() => setActiveCategory('nfv-component')}
              >
                NFV
              </button>
            </div>
            <div className="library-items">
              {getCategorizedLibrary().map((item, idx) => (
                <div
                  key={idx}
                  className="library-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  style={{ borderColor: item.color }}
                >
                  <div className="item-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-description">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="canvas-container">
          <div
            ref={canvasRef}
            className="canvas"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              transform: `scale(${canvasState.zoom})`,
              backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
            }}
          >
            {/* Render connections */}
            <svg className="connections-layer">
              {design.connections.map((conn) => {
                const from = design.components.find((c) => c.id === conn.from);
                const to = design.components.find((c) => c.id === conn.to);
                if (!from || !to) {
                  return null;
                }

                const x1 = from.x + from.width / 2;
                const y1 = from.y + from.height / 2;
                const x2 = to.x + to.width / 2;
                const y2 = to.y + to.height / 2;

                return (
                  <g key={conn.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2}
                      fill="#1f2937"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {conn.label}
                    </text>
                  </g>
                );
              })}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                </marker>
              </defs>
            </svg>

            {/* Render components */}
            {design.components.map((component) => (
              <div
                key={component.id}
                className={`canvas-component ${selectedComponent?.id === component.id ? 'selected' : ''}`}
                style={{
                  left: component.x,
                  top: component.y,
                  width: component.width,
                  height: component.height,
                  backgroundColor: component.color + '20',
                  borderColor: component.color,
                }}
                onClick={() => handleComponentClick(component)}
              >
                <div className="component-header" style={{ backgroundColor: component.color }}>
                  <span className="component-icon">{component.icon}</span>
                  <span className="component-name">{component.name}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentDelete(component.id);
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="component-body">
                  <div className="component-type">{component.subtype}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedComponent && (
          <div className="properties-panel">
            <h3>Properties</h3>
            <div className="property-item">
              <label htmlFor="component-name">Name:</label>
              <input
                id="component-name"
                type="text"
                value={selectedComponent.name}
                onChange={(e) => {
                  const updatedComponents = design.components.map((c) =>
                    c.id === selectedComponent.id ? { ...c, name: e.target.value } : c
                  );
                  setDesign({ ...design, components: updatedComponents });
                  setSelectedComponent({ ...selectedComponent, name: e.target.value });
                }}
              />
            </div>

            {componentLibrary
              .find(
                (item) =>
                  item.type === selectedComponent.type && item.subtype === selectedComponent.subtype
              )
              ?.properties.map((prop) => (
                <div key={prop.key} className="property-item">
                  <label>{prop.label}:</label>
                  {prop.type === 'select' ? (
                    <select
                      value={String(selectedComponent.properties[prop.key] || '')}
                      onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                    >
                      <option value="">Select...</option>
                      {prop.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : prop.type === 'boolean' ? (
                    <input
                      type="checkbox"
                      checked={Boolean(selectedComponent.properties[prop.key])}
                      onChange={(e) => handlePropertyChange(prop.key, e.target.checked)}
                    />
                  ) : prop.type === 'number' ? (
                    <input
                      type="number"
                      value={Number(selectedComponent.properties[prop.key] || 0)}
                      onChange={(e) => handlePropertyChange(prop.key, parseInt(e.target.value))}
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(selectedComponent.properties[prop.key] || '')}
                      onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
                    />
                  )}
                </div>
              ))}

            <div className="connection-section">
              <h4>Create Connection</h4>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleCreateConnection(selectedComponent.id, e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Connect to...</option>
                {design.components
                  .filter((c) => c.id !== selectedComponent.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {showServiceComparison && (
          <div className="feature-panel service-comparison-panel">
            <div className="panel-header">
              <h3>Service Models Comparison</h3>
              <button onClick={() => setShowServiceComparison(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="comparison-matrix">
              {Object.entries(serviceModelComparison).map(([model, data]) => (
                <div key={model} className="comparison-card">
                  <h4>{data.name}</h4>
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
                      {data.responsibility.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
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
                      {data.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="comparison-row">
                    <strong>Cons:</strong>
                    <ul className="cons-list">
                      {data.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="connectivity-grid">
              <h4 style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                Cloud Connectivity Options
              </h4>
              {connectivityOptions.map((option) => (
                <div key={option.name} className="connectivity-card">
                  <div className="connectivity-icon">{option.icon}</div>
                  <h5>{option.name}</h5>
                  <div className="connectivity-details">
                    <div>Bandwidth: {option.bandwidth}</div>
                    <div>Latency: {option.latency}</div>
                    <div>Cost: {option.cost}</div>
                    <div>Encryption: {option.encryption}</div>
                    <div>Best For: {option.bestFor}</div>
                    <div>Security: {option.security}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSecurityPanel && (
          <div className="feature-panel security-panel">
            <div className="panel-header">
              <h3>Cloud Security Basics</h3>
              <button onClick={() => setShowSecurityPanel(false)} className="close-btn">
                ×
              </button>
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
                      <ul>
                        {details.advantages.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
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
                      <ul>
                        {concept.bestPractices.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showElasticityVisualization && (
          <div className="feature-panel elasticity-panel">
            <div className="panel-header">
              <h3>Multi-tenancy & Elasticity</h3>
              <button onClick={() => setShowElasticityVisualization(false)} className="close-btn">
                ×
              </button>
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
        )}
      </div>

      {validation && (
        <div className="validation-panel">
          <h3>Validation Results</h3>
          <div className={`score ${validation.valid ? 'valid' : 'invalid'}`}>
            Score: {validation.score}%
          </div>

          {validation.errors.length > 0 && (
            <div className="errors">
              <h4>Errors:</h4>
              <ul>
                {validation.errors.map((error, idx) => (
                  <li key={idx} className="error">
                    {error.message}
                    <span className="suggestion">{error.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="warnings">
              <h4>Warnings:</h4>
              <ul>
                {validation.warnings.map((warning, idx) => (
                  <li key={idx} className="warning">
                    {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.valid && (
            <div className="success-message">
              All validation checks passed! Your architecture follows best practices.
            </div>
          )}
        </div>
      )}

      <style>{`
        .cloud-architecture-designer {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f9fafb;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .title-section h2 {
          margin: 0 0 10px 0;
          color: #1f2937;
        }

        .design-name {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
          width: 300px;
        }

        .toolbar {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .toolbar button {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .toolbar button:hover {
          background: #2563eb;
        }

        .toolbar label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #374151;
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .component-library {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          overflow-y: auto;
        }

        .component-library h3 {
          padding: 15px;
          margin: 0;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
        }

        .category-tabs button {
          padding: 6px 12px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
        }

        .category-tabs button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .library-items {
          padding: 10px;
        }

        .library-item {
          display: flex;
          gap: 10px;
          padding: 12px;
          margin-bottom: 10px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: grab;
          transition: all 0.2s;
        }

        .library-item:hover {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .library-item:active {
          cursor: grabbing;
        }

        .item-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .item-description {
          font-size: 11px;
          color: #6b7280;
          line-height: 1.3;
        }

        .canvas-container {
          flex: 1;
          overflow: auto;
          position: relative;
        }

        .canvas {
          min-width: 2000px;
          min-height: 1500px;
          position: relative;
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-color: white;
        }

        .connections-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .canvas-component {
          position: absolute;
          border: 2px solid;
          border-radius: 8px;
          cursor: pointer;
          transition: box-shadow 0.2s;
        }

        .canvas-component:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .canvas-component.selected {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }

        .component-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: white;
          font-weight: 600;
          border-radius: 6px 6px 0 0;
        }

        .component-icon {
          font-size: 18px;
        }

        .component-name {
          flex: 1;
          font-size: 13px;
        }

        .delete-btn {
          background: rgba(255,255,255,0.3);
          border: none;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }

        .delete-btn:hover {
          background: rgba(255,255,255,0.5);
        }

        .component-body {
          padding: 12px;
        }

        .component-type {
          font-size: 12px;
          color: #4b5563;
          font-weight: 500;
        }

        .properties-panel {
          width: 300px;
          background: white;
          border-left: 1px solid #e5e7eb;
          overflow-y: auto;
          padding: 20px;
        }

        .properties-panel h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
        }

        .property-item {
          margin-bottom: 15px;
        }

        .property-item label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .property-item input,
        .property-item select {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
        }

        .connection-section {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .connection-section h4 {
          margin: 0 0 10px 0;
          color: #1f2937;
          font-size: 14px;
        }

        .connection-section select {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
        }

        .validation-panel {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 2px solid #e5e7eb;
          padding: 20px;
          max-height: 300px;
          overflow-y: auto;
        }

        .validation-panel h3 {
          margin: 0 0 15px 0;
          color: #1f2937;
        }

        .score {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 15px;
        }

        .score.valid {
          background: #d1fae5;
          color: #065f46;
        }

        .score.invalid {
          background: #fee2e2;
          color: #991b1b;
        }

        .errors h4, .warnings h4 {
          margin: 15px 0 10px 0;
          color: #1f2937;
        }

        .errors ul, .warnings ul {
          list-style: none;
          padding: 0;
        }

        .errors li, .warnings li {
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 6px;
        }

        .error {
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #dc2626;
        }

        .warning {
          background: #fef3c7;
          color: #92400e;
          border-left: 4px solid #f59e0b;
        }

        .suggestion {
          display: block;
          font-size: 12px;
          margin-top: 4px;
          font-style: italic;
        }

        .success-message {
          padding: 12px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        }

        /* Feature Panels */
        .feature-panel {
          position: fixed;
          right: 0;
          top: 60px;
          width: 500px;
          max-height: calc(100vh - 120px);
          background: white;
          border-left: 1px solid #e5e7eb;
          overflow-y: auto;
          padding: 20px;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          z-index: 100;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 10px;
        }

        .panel-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .close-btn:hover {
          color: #1f2937;
        }

        /* Service Comparison Panel */
        .comparison-matrix {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .comparison-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          background: #f9fafb;
        }

        .comparison-card h4 {
          margin: 0 0 12px 0;
          color: #1f2937;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 8px;
        }

        .comparison-row {
          margin-bottom: 10px;
        }

        .comparison-row strong {
          display: block;
          color: #374151;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .responsibility-list, .pros-list, .cons-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .responsibility-list li, .pros-list li, .cons-list li {
          padding: 4px 0 4px 20px;
          position: relative;
          color: #4b5563;
          font-size: 13px;
        }

        .responsibility-list li:before, .pros-list li:before, .cons-list li:before {
          content: '•';
          position: absolute;
          left: 8px;
        }

        .connectivity-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .connectivity-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          text-align: center;
          background: #f9fafb;
        }

        .connectivity-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .connectivity-card h5 {
          margin: 8px 0;
          color: #1f2937;
          font-size: 13px;
        }

        .connectivity-details {
          font-size: 11px;
          color: #6b7280;
          text-align: left;
        }

        .connectivity-details div {
          padding: 4px 0;
        }

        /* Security Panel */
        .deployment-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .deployment-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          background: #f9fafb;
        }

        .deployment-card h5 {
          margin: 0 0 8px 0;
          color: #1f2937;
          border-bottom: 2px solid #10b981;
          padding-bottom: 6px;
        }

        .description {
          color: #6b7280;
          font-size: 13px;
          margin: 8px 0;
        }

        .detail-section {
          margin: 8px 0;
        }

        .detail-section strong {
          display: block;
          color: #374151;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .detail-section ul {
          list-style: none;
          padding: 0;
          margin: 4px 0 0 0;
          font-size: 12px;
        }

        .detail-section li {
          padding: 3px 0 3px 16px;
          position: relative;
          color: #4b5563;
        }

        .detail-section li:before {
          content: '→';
          position: absolute;
          left: 0;
        }

        .detail-section p {
          color: #4b5563;
          font-size: 12px;
          margin: 4px 0 0 0;
        }

        .security-concepts {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .security-card {
          display: flex;
          gap: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          background: #f9fafb;
        }

        .security-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .security-content {
          flex: 1;
        }

        .security-content h5 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 13px;
        }

        .security-row {
          margin-bottom: 8px;
        }

        .security-row strong {
          display: block;
          color: #374151;
          margin-bottom: 3px;
          font-size: 12px;
        }

        .security-row p {
          color: #4b5563;
          font-size: 11px;
          margin: 0;
        }

        .security-row ul {
          list-style: none;
          padding: 0;
          margin: 3px 0 0 0;
          font-size: 11px;
        }

        .security-row li {
          padding: 2px 0 2px 14px;
          position: relative;
          color: #4b5563;
        }

        .security-row li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
        }

        /* Elasticity Panel */
        .pattern-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pattern-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          background: #f9fafb;
        }

        .pattern-card h5 {
          margin: 0 0 6px 0;
          color: #1f2937;
          font-size: 13px;
        }

        .pattern-description {
          color: #6b7280;
          font-size: 12px;
          margin: 6px 0;
        }

        .pattern-detail {
          margin: 6px 0;
          font-size: 11px;
        }

        .pattern-detail strong {
          color: #374151;
          display: block;
          margin-bottom: 2px;
        }

        .pattern-detail p {
          margin: 0;
          color: #4b5563;
        }

        .efficiency-high {
          color: #10b981;
          font-weight: 600;
        }

        .efficiency-medium {
          color: #f59e0b;
          font-weight: 600;
        }

        .efficiency-low {
          color: #ef4444;
          font-weight: 600;
        }

        .risk-very-low {
          color: #10b981;
          font-weight: 600;
        }

        .risk-low {
          color: #3b82f6;
          font-weight: 600;
        }

        .risk-medium {
          color: #f59e0b;
          font-weight: 600;
        }

        .info-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .elasticity-card {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .elasticity-card h5 {
          margin: 0 0 6px 0;
          color: #1f2937;
          font-size: 13px;
        }

        .elasticity-card p {
          color: #6b7280;
          font-size: 12px;
          margin: 6px 0;
        }

        .elasticity-card strong {
          color: #374151;
          display: block;
          margin-top: 6px;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
};

export default CloudArchitectureDesigner;
