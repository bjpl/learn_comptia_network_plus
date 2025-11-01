/**
 * Component 8: Cloud Architecture Designer
 * CompTIA Network+ Learning Objective 1.2
 *
 * Drag-and-drop canvas for designing cloud architectures
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
      `}</style>
    </div>
  );
};

export default CloudArchitectureDesigner;
