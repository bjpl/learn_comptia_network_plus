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

import React, { useState, useRef, useCallback, useEffect } from 'react';
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

type DragState = {
  isDragging: boolean;
  componentId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

type ResizeState = {
  isResizing: boolean;
  componentId: string | null;
  handle: 'se' | 'ne' | 'sw' | 'nw' | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startComponentX: number;
  startComponentY: number;
};

type ConnectionState = {
  isConnecting: boolean;
  fromId: string | null;
  cursorX: number;
  cursorY: number;
};

type HistoryState = {
  past: ArchitectureDesign[];
  present: ArchitectureDesign;
  future: ArchitectureDesign[];
};

export const CloudArchitectureDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
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
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ComponentType>('deployment-zone');
  const [showServiceComparison, setShowServiceComparison] = useState(false);
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showElasticityVisualization, setShowElasticityVisualization] = useState(false);
  const [isDraggingFromLibrary, setIsDraggingFromLibrary] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    componentId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    componentId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startComponentX: 0,
    startComponentY: 0,
  });
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    fromId: null,
    cursorX: 0,
    cursorY: 0,
  });
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: design,
    future: [],
  });
  const [canvasPan, setCanvasPan] = useState({ isPanning: false, startX: 0, startY: 0 });

  // Sync history with design changes
  useEffect(() => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: design,
      future: [],
    }));
  }, [design]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
      // Delete: Delete key
      if (e.key === 'Delete' && selectedComponent) {
        e.preventDefault();
        handleComponentDelete(selectedComponent.id);
      }
      // Escape: Cancel connection mode
      if (e.key === 'Escape') {
        setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
      }
      // Duplicate: Ctrl+D
      if (e.ctrlKey && e.key === 'd' && selectedComponent) {
        e.preventDefault();
        handleDuplicateComponent(selectedComponent.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, history]);

  const snapToGrid = (value: number): number => {
    if (!canvasState.snapToGrid) {
      return value;
    }
    return Math.round(value / canvasState.gridSize) * canvasState.gridSize;
  };

  const handleUndo = () => {
    if (history.past.length > 0) {
      const previous = history.past[history.past.length - 1];
      const newPast = history.past.slice(0, -1);
      setHistory({
        past: newPast,
        present: previous,
        future: [history.present, ...history.future],
      });
      setDesign(previous);
    }
  };

  const handleRedo = () => {
    if (history.future.length > 0) {
      const next = history.future[0];
      const newFuture = history.future.slice(1);
      setHistory({
        past: [...history.past, history.present],
        present: next,
        future: newFuture,
      });
      setDesign(next);
    }
  };

  const handleZoomToFit = () => {
    if (design.components.length === 0) {
      return;
    }

    const minX = Math.min(...design.components.map((c) => c.x));
    const minY = Math.min(...design.components.map((c) => c.y));
    const maxX = Math.max(...design.components.map((c) => c.x + c.width));
    const maxY = Math.max(...design.components.map((c) => c.y + c.height));

    const width = maxX - minX;
    const height = maxY - minY;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const zoomX = (rect.width * 0.8) / width;
    const zoomY = (rect.height * 0.8) / height;
    const newZoom = Math.min(zoomX, zoomY, 2);

    setCanvasState({ ...canvasState, zoom: newZoom });
  };

  const handleCenterView = () => {
    setCanvasState({ ...canvasState, panX: 0, panY: 0 });
  };

  const handleDuplicateComponent = (componentId: string) => {
    const component = design.components.find((c) => c.id === componentId);
    if (!component) {
      return;
    }

    const newComponent: ArchitectureComponent = {
      ...component,
      id: `component-${Date.now()}`,
      name: `${component.name} (Copy)`,
      x: component.x + 20,
      y: component.y + 20,
    };

    setDesign({
      ...design,
      components: [...design.components, newComponent],
      metadata: { ...design.metadata, modified: new Date() },
    });
    setSelectedComponent(newComponent);
  };

  const handleDragStart = (e: React.DragEvent, libraryItem: ComponentLibraryItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(libraryItem));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDraggingFromLibrary(true);
  };

  const handleDragEnd = () => {
    setIsDraggingFromLibrary(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFromLibrary(false);

    const data = e.dataTransfer.getData('application/json');
    if (!data) {
      return;
    }

    const libraryItem = JSON.parse(data) as ComponentLibraryItem;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = snapToGrid((e.clientX - rect.left) / canvasState.zoom);
    const y = snapToGrid((e.clientY - rect.top) / canvasState.zoom);

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
    setSelectedComponent(newComponent);
  };

  // Component dragging handlers
  const handleComponentMouseDown = (e: React.MouseEvent, component: ArchitectureComponent) => {
    // Don't start drag if clicking on delete button or resize handle
    const target = e.target as HTMLElement;
    if (target.closest('.delete-btn') || target.closest('.resize-handle')) {
      return;
    }

    e.stopPropagation();
    setSelectedComponent(component);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setDragState({
      isDragging: true,
      componentId: component.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: component.x,
      offsetY: component.y,
    });
  };

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      // Handle component dragging
      if (dragState.isDragging && dragState.componentId) {
        const deltaX = (e.clientX - dragState.startX) / canvasState.zoom;
        const deltaY = (e.clientY - dragState.startY) / canvasState.zoom;

        let newX = dragState.offsetX + deltaX;
        let newY = dragState.offsetY + deltaY;

        // Snap to grid
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);

        // Keep within canvas bounds
        newX = Math.max(0, Math.min(newX, 2000 - 100));
        newY = Math.max(0, Math.min(newY, 1500 - 100));

        const updatedComponents = design.components.map((c) =>
          c.id === dragState.componentId ? { ...c, x: newX, y: newY } : c
        );

        setDesign({
          ...design,
          components: updatedComponents,
          metadata: { ...design.metadata, modified: new Date() },
        });

        if (selectedComponent?.id === dragState.componentId) {
          setSelectedComponent({ ...selectedComponent, x: newX, y: newY });
        }
      }

      // Handle component resizing
      if (resizeState.isResizing && resizeState.componentId && resizeState.handle) {
        const deltaX = (e.clientX - resizeState.startX) / canvasState.zoom;
        const deltaY = (e.clientY - resizeState.startY) / canvasState.zoom;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startComponentX;
        let newY = resizeState.startComponentY;

        if (resizeState.handle === 'se') {
          newWidth = Math.max(80, resizeState.startWidth + deltaX);
          newHeight = Math.max(60, resizeState.startHeight + deltaY);
        } else if (resizeState.handle === 'ne') {
          newWidth = Math.max(80, resizeState.startWidth + deltaX);
          newHeight = Math.max(60, resizeState.startHeight - deltaY);
          newY = resizeState.startComponentY + deltaY;
        } else if (resizeState.handle === 'sw') {
          newWidth = Math.max(80, resizeState.startWidth - deltaX);
          newHeight = Math.max(60, resizeState.startHeight + deltaY);
          newX = resizeState.startComponentX + deltaX;
        } else if (resizeState.handle === 'nw') {
          newWidth = Math.max(80, resizeState.startWidth - deltaX);
          newHeight = Math.max(60, resizeState.startHeight - deltaY);
          newX = resizeState.startComponentX + deltaX;
          newY = resizeState.startComponentY + deltaY;
        }

        // Snap to grid
        newWidth = snapToGrid(newWidth);
        newHeight = snapToGrid(newHeight);
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);

        const updatedComponents = design.components.map((c) =>
          c.id === resizeState.componentId
            ? { ...c, width: newWidth, height: newHeight, x: newX, y: newY }
            : c
        );

        setDesign({
          ...design,
          components: updatedComponents,
          metadata: { ...design.metadata, modified: new Date() },
        });

        if (selectedComponent?.id === resizeState.componentId) {
          setSelectedComponent({
            ...selectedComponent,
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY,
          });
        }
      }

      // Handle connection preview
      if (connectionState.isConnecting) {
        const x = (e.clientX - rect.left) / canvasState.zoom;
        const y = (e.clientY - rect.top) / canvasState.zoom;
        setConnectionState({ ...connectionState, cursorX: x, cursorY: y });
      }

      // Handle canvas panning
      if (canvasPan.isPanning) {
        const deltaX = e.clientX - canvasPan.startX;
        const deltaY = e.clientY - canvasPan.startY;

        setCanvasState({
          ...canvasState,
          panX: canvasState.panX + deltaX,
          panY: canvasState.panY + deltaY,
        });

        setCanvasPan({ ...canvasPan, startX: e.clientX, startY: e.clientY });
      }
    },
    [dragState, resizeState, connectionState, canvasPan, design, selectedComponent, canvasState]
  );

  const handleCanvasMouseUp = () => {
    setDragState({
      isDragging: false,
      componentId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    });
    setResizeState({
      isResizing: false,
      componentId: null,
      handle: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      startComponentX: 0,
      startComponentY: 0,
    });
    setCanvasPan({ isPanning: false, startX: 0, startY: 0 });
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    component: ArchitectureComponent,
    handle: 'se' | 'ne' | 'sw' | 'nw'
  ) => {
    e.stopPropagation();
    setResizeState({
      isResizing: true,
      componentId: component.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: component.width,
      startHeight: component.height,
      startComponentX: component.x,
      startComponentY: component.y,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start panning if clicking on canvas background
    const target = e.target as HTMLElement;
    if (target === canvasRef.current || target.classList.contains('connections-layer')) {
      setCanvasPan({
        isPanning: true,
        startX: e.clientX,
        startY: e.clientY,
      });
      setSelectedComponent(null);
    }
  };

  const handleConnectionModeToggle = (componentId: string) => {
    if (connectionState.isConnecting && connectionState.fromId === componentId) {
      // Cancel connection mode
      setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
    } else if (connectionState.isConnecting && connectionState.fromId) {
      // Complete connection
      handleCreateConnection(connectionState.fromId, componentId);
      setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
    } else {
      // Start connection mode
      const component = design.components.find((c) => c.id === componentId);
      if (!component) {
        return;
      }
      setConnectionState({
        isConnecting: true,
        fromId: componentId,
        cursorX: component.x + component.width / 2,
        cursorY: component.y + component.height / 2,
      });
    }
  };

  const handleComponentClick = (e: React.MouseEvent, component: ArchitectureComponent) => {
    e.stopPropagation();
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
          <div className="title-wrapper">
            <h2>Cloud Architecture Designer</h2>
            <p className="subtitle">Design and validate cloud infrastructure architectures</p>
          </div>
          <div className="design-name-wrapper">
            <input
              type="text"
              className="design-name"
              value={design.name}
              onChange={(e) => setDesign({ ...design, name: e.target.value })}
              placeholder="Architecture name"
            />
            <div className="metadata">
              <span className="metadata-item">
                {design.components.length} component{design.components.length !== 1 ? 's' : ''}
              </span>
              <span className="metadata-divider">•</span>
              <span className="metadata-item">
                {design.connections.length} connection{design.connections.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        <div className="toolbar">
          <div className="button-group">
            <button
              className={`toolbar-btn ${showLibrary ? 'active' : ''}`}
              onClick={() => setShowLibrary(!showLibrary)}
            >
              <span className="btn-icon">📚</span>
              <span className="btn-text">{showLibrary ? 'Hide' : 'Show'} Library</span>
              {showLibrary && <span className="active-badge">•</span>}
            </button>
            <button
              className={`toolbar-btn secondary ${showServiceComparison ? 'active' : ''}`}
              onClick={() => setShowServiceComparison(!showServiceComparison)}
              title="Compare SaaS, PaaS, IaaS"
            >
              <span className="btn-icon">☁️</span>
              <span className="btn-text">Service Models</span>
              {showServiceComparison && <span className="active-badge">•</span>}
            </button>
            <button
              className={`toolbar-btn secondary ${showSecurityPanel ? 'active' : ''}`}
              onClick={() => setShowSecurityPanel(!showSecurityPanel)}
              title="Cloud security concepts"
            >
              <span className="btn-icon">🔒</span>
              <span className="btn-text">Security</span>
              {showSecurityPanel && <span className="active-badge">•</span>}
            </button>
            <button
              className={`toolbar-btn secondary ${showElasticityVisualization ? 'active' : ''}`}
              onClick={() => setShowElasticityVisualization(!showElasticityVisualization)}
              title="Elasticity & multi-tenancy"
            >
              <span className="btn-icon">⚡</span>
              <span className="btn-text">Elasticity</span>
              {showElasticityVisualization && <span className="active-badge">•</span>}
            </button>
          </div>
          <div className="button-group actions">
            <button className="toolbar-btn accent" onClick={validateArchitecture}>
              <span className="btn-icon">✓</span>
              <span className="btn-text">Validate</span>
            </button>
            <button className="toolbar-btn secondary" onClick={handleExport}>
              <span className="btn-icon">↓</span>
              <span className="btn-text">Export</span>
            </button>
          </div>
          <label className="snap-toggle">
            <input
              type="checkbox"
              checked={canvasState.snapToGrid}
              onChange={(e) => setCanvasState({ ...canvasState, snapToGrid: e.target.checked })}
            />
            <span className="toggle-label">Snap to Grid</span>
          </label>
        </div>
      </div>

      <div className="workspace">
        {showLibrary && (
          <div className="component-library">
            <div className="library-header">
              <h3>Component Library</h3>
              <p className="library-subtitle">Drag components onto the canvas</p>
            </div>
            <div className="category-tabs">
              <button
                className={`category-tab ${activeCategory === 'deployment-zone' ? 'active' : ''}`}
                onClick={() => setActiveCategory('deployment-zone')}
              >
                <span className="tab-icon">🏢</span>
                <span className="tab-label">Deployment</span>
              </button>
              <button
                className={`category-tab ${activeCategory === 'service-layer' ? 'active' : ''}`}
                onClick={() => setActiveCategory('service-layer')}
              >
                <span className="tab-icon">⚙️</span>
                <span className="tab-label">Services</span>
              </button>
              <button
                className={`category-tab ${activeCategory === 'connectivity' ? 'active' : ''}`}
                onClick={() => setActiveCategory('connectivity')}
              >
                <span className="tab-icon">🔗</span>
                <span className="tab-label">Connect</span>
              </button>
              <button
                className={`category-tab ${activeCategory === 'vpc-element' ? 'active' : ''}`}
                onClick={() => setActiveCategory('vpc-element')}
              >
                <span className="tab-icon">🌐</span>
                <span className="tab-label">VPC</span>
              </button>
              <button
                className={`category-tab ${activeCategory === 'gateway' ? 'active' : ''}`}
                onClick={() => setActiveCategory('gateway')}
              >
                <span className="tab-icon">🚪</span>
                <span className="tab-label">Gateways</span>
              </button>
              <button
                className={`category-tab ${activeCategory === 'nfv-component' ? 'active' : ''}`}
                onClick={() => setActiveCategory('nfv-component')}
              >
                <span className="tab-icon">🔧</span>
                <span className="tab-label">NFV</span>
              </button>
            </div>
            <div className="library-items">
              {getCategorizedLibrary().map((item, idx) => (
                <div
                  key={idx}
                  className="library-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  style={{ borderLeftColor: item.color }}
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
          <div className="canvas-controls">
            <div className="zoom-controls">
              <button
                className="control-btn"
                onClick={() =>
                  setCanvasState({ ...canvasState, zoom: Math.min(2, canvasState.zoom + 0.1) })
                }
                title="Zoom In (Ctrl + Mouse Wheel)"
              >
                <span className="control-icon">+</span>
              </button>
              <span className="zoom-level">{Math.round(canvasState.zoom * 100)}%</span>
              <button
                className="control-btn"
                onClick={() =>
                  setCanvasState({ ...canvasState, zoom: Math.max(0.5, canvasState.zoom - 0.1) })
                }
                title="Zoom Out (Ctrl + Mouse Wheel)"
              >
                <span className="control-icon">-</span>
              </button>
            </div>
            <div className="view-controls">
              <button className="control-btn" onClick={handleZoomToFit} title="Zoom to Fit">
                <span className="control-icon">⊡</span>
              </button>
              <button className="control-btn" onClick={handleCenterView} title="Center View">
                <span className="control-icon">⊙</span>
              </button>
            </div>
            <div className="history-controls">
              <button
                className="control-btn"
                onClick={handleUndo}
                disabled={history.past.length === 0}
                title="Undo (Ctrl+Z)"
              >
                <span className="control-icon">↶</span>
              </button>
              <button
                className="control-btn"
                onClick={handleRedo}
                disabled={history.future.length === 0}
                title="Redo (Ctrl+Y)"
              >
                <span className="control-icon">↷</span>
              </button>
            </div>
          </div>
          <div
            ref={canvasRef}
            className={`canvas ${isDraggingFromLibrary ? 'drop-zone-active' : ''} ${
              canvasPan.isPanning ? 'panning' : ''
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onWheel={(e) => {
              if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                const newZoom = Math.max(0.5, Math.min(2, canvasState.zoom + delta));
                setCanvasState({ ...canvasState, zoom: newZoom });
              }
            }}
            style={{
              transform: `scale(${canvasState.zoom})`,
              backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
              cursor: canvasPan.isPanning ? 'grabbing' : dragState.isDragging ? 'move' : 'default',
            }}
          >
            {/* Render connections */}
            <svg ref={svgRef} className="connections-layer">
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

                // Calculate bezier control points for smooth curves
                const dx = x2 - x1;
                const dy = y2 - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const controlOffset = Math.min(distance * 0.4, 100);

                const cx1 = x1 + controlOffset;
                const cy1 = y1;
                const cx2 = x2 - controlOffset;
                const cy2 = y2;

                const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

                return (
                  <g key={conn.id} className="connection">
                    <path
                      d={path}
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      className="connection-line"
                    />
                    <path
                      d={path}
                      stroke="transparent"
                      strokeWidth="12"
                      fill="none"
                      className="connection-hit-area"
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 10}
                      fill="#374151"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                      className="connection-label"
                    >
                      {conn.label}
                    </text>
                  </g>
                );
              })}

              {/* Connection preview while connecting */}
              {connectionState.isConnecting && connectionState.fromId && (
                <g className="connection-preview">
                  {(() => {
                    const from = design.components.find((c) => c.id === connectionState.fromId);
                    if (!from) {
                      return null;
                    }

                    const x1 = from.x + from.width / 2;
                    const y1 = from.y + from.height / 2;
                    const x2 = connectionState.cursorX;
                    const y2 = connectionState.cursorY;

                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const controlOffset = Math.min(distance * 0.4, 100);

                    const cx1 = x1 + controlOffset;
                    const cy1 = y1;
                    const cx2 = x2 - controlOffset;
                    const cy2 = y2;

                    const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

                    return (
                      <path
                        d={path}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        fill="none"
                        opacity="0.6"
                      />
                    );
                  })()}
                </g>
              )}

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
                className={`canvas-component ${selectedComponent?.id === component.id ? 'selected' : ''} ${
                  hoveredComponent === component.id ? 'hovered' : ''
                } ${dragState.isDragging && dragState.componentId === component.id ? 'dragging' : ''}`}
                style={{
                  left: component.x,
                  top: component.y,
                  width: component.width,
                  height: component.height,
                  backgroundColor: component.color + '20',
                  borderColor: component.color,
                }}
                onClick={(e) => handleComponentClick(e, component)}
                onMouseDown={(e) => handleComponentMouseDown(e, component)}
                onMouseEnter={() => setHoveredComponent(component.id)}
                onMouseLeave={() => setHoveredComponent(null)}
              >
                <div className="component-header" style={{ backgroundColor: component.color }}>
                  <span className="component-icon">{component.icon}</span>
                  <span className="component-name">{component.name}</span>
                  <div className="component-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectionModeToggle(component.id);
                      }}
                      title="Create Connection"
                    >
                      🔗
                    </button>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateComponent(component.id);
                      }}
                      title="Duplicate (Ctrl+D)"
                    >
                      ⧉
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComponentDelete(component.id);
                      }}
                      title="Delete (Del)"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="component-body">
                  <div className="component-type">{component.subtype}</div>

                  {/* Connection ports - visible on hover */}
                  {(hoveredComponent === component.id || connectionState.isConnecting) && (
                    <>
                      <div className="connection-port port-top" title="Connection point" />
                      <div className="connection-port port-right" title="Connection point" />
                      <div className="connection-port port-bottom" title="Connection point" />
                      <div className="connection-port port-left" title="Connection point" />
                    </>
                  )}
                </div>

                {/* Resize handles - visible only on selected component */}
                {selectedComponent?.id === component.id && (
                  <>
                    <div
                      className="resize-handle handle-nw"
                      onMouseDown={(e) => handleResizeMouseDown(e, component, 'nw')}
                      title="Resize"
                    />
                    <div
                      className="resize-handle handle-ne"
                      onMouseDown={(e) => handleResizeMouseDown(e, component, 'ne')}
                      title="Resize"
                    />
                    <div
                      className="resize-handle handle-sw"
                      onMouseDown={(e) => handleResizeMouseDown(e, component, 'sw')}
                      title="Resize"
                    />
                    <div
                      className="resize-handle handle-se"
                      onMouseDown={(e) => handleResizeMouseDown(e, component, 'se')}
                      title="Resize"
                    />

                    {/* Size indicator */}
                    <div className="size-indicator">
                      {Math.round(component.width)} × {Math.round(component.height)}
                    </div>
                  </>
                )}
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
          background: linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          background: white;
          border-bottom: 2px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .title-section {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .title-wrapper h2 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 24px;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          color: #1f2937;
          font-size: 14px;
          font-weight: 400;
        }

        @media (prefers-color-scheme: dark) {
          .subtitle {
            color: #e5e7eb;
          }
        }

        .design-name-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .design-name {
          padding: 10px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          width: 320px;
          background: white;
          transition: all 0.2s;
        }

        .design-name:hover {
          border-color: #d1d5db;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .design-name:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .metadata {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 12px;
          color: #1f2937;
        }

        @media (prefers-color-scheme: dark) {
          .metadata {
            color: #e5e7eb;
          }
        }

        .metadata-item {
          font-weight: 500;
        }

        .metadata-divider {
          color: #d1d5db;
        }

        .toolbar {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .button-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .button-group.actions {
          border-left: 1px solid #e5e7eb;
          padding-left: 16px;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          position: relative;
        }

        .toolbar-btn:hover {
          background: #2563eb;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .toolbar-btn:active {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .toolbar-btn.secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .toolbar-btn.secondary:hover {
          background: #e5e7eb;
        }

        .toolbar-btn.accent {
          background: #10b981;
        }

        .toolbar-btn.accent:hover {
          background: #059669;
        }

        .toolbar-btn.active {
          background: #2563eb;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .toolbar-btn.secondary.active {
          background: #3b82f6;
          color: white;
        }

        .btn-icon {
          font-size: 16px;
          line-height: 1;
        }

        .btn-text {
          line-height: 1;
        }

        .active-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 8px;
          height: 8px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .snap-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #374151;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .snap-toggle:hover {
          background: #f3f4f6;
        }

        .snap-toggle input[type="checkbox"] {
          cursor: pointer;
        }

        .toggle-label {
          font-weight: 500;
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .component-library {
          width: 300px;
          background: white;
          border-right: 2px solid #e5e7eb;
          overflow-y: auto;
          box-shadow: 2px 0 8px rgba(0,0,0,0.05);
        }

        .library-header {
          padding: 20px;
          border-bottom: 2px solid #f3f4f6;
          background: linear-gradient(to bottom, white 0%, #f9fafb 100%);
        }

        .library-header h3 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
        }

        .library-subtitle {
          margin: 0;
          color: #1f2937;
          font-size: 13px;
        }

        @media (prefers-color-scheme: dark) {
          .library-subtitle {
            color: #e5e7eb;
          }
        }

        .category-tabs {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 16px;
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .category-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 8px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          color: #1f2937;
          transition: all 0.2s;
        }

        @media (prefers-color-scheme: dark) {
          .category-tab {
            color: #e5e7eb;
          }
        }

        .category-tab:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .category-tab.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
        }

        .tab-icon {
          font-size: 18px;
          line-height: 1;
        }

        .tab-label {
          line-height: 1;
        }

        .library-items {
          padding: 16px;
        }

        .library-item {
          display: flex;
          gap: 12px;
          padding: 14px;
          margin-bottom: 12px;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-left: 4px solid #e5e7eb;
          border-radius: 8px;
          cursor: grab;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .library-item:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: translateX(4px);
        }

        .library-item:active {
          cursor: grabbing;
          transform: scale(0.98);
          opacity: 0.8;
        }

        .item-icon {
          font-size: 28px;
          flex-shrink: 0;
          line-height: 1;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .item-description {
          font-size: 11px;
          color: #1f2937;
          line-height: 1.4;
        }

        @media (prefers-color-scheme: dark) {
          .item-description {
            color: #e5e7eb;
          }
        }

        .canvas-container {
          flex: 1;
          overflow: auto;
          position: relative;
          background: #f9fafb;
        }

        .canvas-controls {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          gap: 12px;
          z-index: 50;
        }

        .zoom-controls,
        .view-controls,
        .history-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          padding: 8px 12px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          border: 1px solid #e5e7eb;
        }

        .control-btn {
          width: 36px;
          height: 36px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .control-btn:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .control-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .control-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .control-icon {
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
        }

        .zoom-level {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          min-width: 55px;
          text-align: center;
          user-select: none;
        }

        .canvas {
          min-width: 2000px;
          min-height: 1500px;
          position: relative;
          background-image:
            linear-gradient(to right, #e5e7eb60 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb60 1px, transparent 1px);
          background-color: white;
          transition: background 0.2s;
        }

        .canvas.drop-zone-active {
          background-color: #eff6ff;
          background-image:
            linear-gradient(to right, #3b82f640 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f640 1px, transparent 1px);
        }

        .canvas.panning {
          cursor: grabbing !important;
        }

        .connections-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .connection-line {
          transition: stroke-width 0.15s;
        }

        .connection:hover .connection-line {
          stroke-width: 4;
          filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
        }

        .connection-label {
          opacity: 0;
          transition: opacity 0.15s;
        }

        .connection:hover .connection-label {
          opacity: 1;
        }

        .canvas-component {
          position: absolute;
          border: 3px solid;
          border-radius: 12px;
          cursor: move;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.08);
          user-select: none;
        }

        .canvas-component:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          transform: translateY(-2px);
          z-index: 10;
        }

        .canvas-component.selected {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 8px 20px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
          z-index: 20;
          border-width: 4px;
        }

        .canvas-component.dragging {
          opacity: 0.8;
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
          transform: rotate(2deg) scale(1.02);
          z-index: 30;
        }

        .component-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          color: white;
          font-weight: 700;
          border-radius: 9px 9px 0 0;
          background: linear-gradient(135deg, currentColor 0%, currentColor 100%);
        }

        .component-icon {
          font-size: 22px;
          line-height: 1;
        }

        .component-name {
          flex: 1;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .component-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .canvas-component:hover .component-actions,
        .canvas-component.selected .component-actions {
          opacity: 1;
        }

        .action-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: rgba(255,255,255,0.35);
          transform: scale(1.08);
        }

        .delete-btn {
          background: rgba(239,68,68,0.9);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          background: rgba(220,38,38,1);
          transform: scale(1.08);
        }

        .component-body {
          padding: 14px;
          position: relative;
        }

        .component-type {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Resize Handles */
        .resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.15s;
          z-index: 10;
        }

        .resize-handle:hover {
          background: #2563eb;
          transform: scale(1.3);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }

        .handle-nw {
          top: -6px;
          left: -6px;
          cursor: nw-resize;
        }

        .handle-ne {
          top: -6px;
          right: -6px;
          cursor: ne-resize;
        }

        .handle-sw {
          bottom: -6px;
          left: -6px;
          cursor: sw-resize;
        }

        .handle-se {
          bottom: -6px;
          right: -6px;
          cursor: se-resize;
        }

        /* Size Indicator */
        .size-indicator {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          pointer-events: none;
          animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Connection Ports */
        .connection-port {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
          transition: all 0.15s;
          cursor: crosshair;
          animation: pulsePort 2s infinite;
        }

        @keyframes pulsePort {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        .connection-port:hover {
          background: #059669;
          transform: translate(-50%, -50%) scale(1.4) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.6);
        }

        .port-top {
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .port-right {
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
        }

        .port-bottom {
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
        }

        .port-left {
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
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
          top: 80px;
          width: 550px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 16px rgba(0,0,0,0.12);
          z-index: 100;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
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
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 3px solid #3b82f6;
        }

        .panel-header h3 {
          margin: 0;
          color: #111827;
          font-size: 20px;
          font-weight: 700;
        }

        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 32px;
          height: 32px;
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

        /* Service Comparison Panel */
        .service-summary-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .summary-card {
          padding: 16px;
          border-radius: 10px;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .summary-card.iaas-card {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .summary-card.paas-card {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
        }

        .summary-card.saas-card {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .summary-icon {
          font-size: 36px;
          margin-bottom: 8px;
        }

        .summary-card h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 700;
        }

        .summary-card p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .comparison-matrix {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .comparison-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .comparison-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        .comparison-card.iaas {
          border-left: 6px solid #3b82f6;
        }

        .comparison-card.paas {
          border-left: 6px solid #8b5cf6;
        }

        .comparison-card.saas {
          border-left: 6px solid #10b981;
        }

        .comparison-card h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .model-icon {
          font-size: 24px;
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

        .connectivity-section {
          margin-top: 32px;
        }

        .section-title {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .connectivity-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .connectivity-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .connectivity-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
          transform: translateY(-3px);
        }

        .connectivity-icon {
          font-size: 42px;
          margin-bottom: 12px;
          display: block;
          text-align: center;
        }

        .connectivity-card h5 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
          text-align: center;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .connectivity-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          padding: 6px 0;
        }

        .detail-row.best-for,
        .detail-row.security {
          flex-direction: column;
          padding-top: 8px;
          border-top: 1px solid #f3f4f6;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 700;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 12px;
          color: #111827;
          font-weight: 500;
          text-align: right;
        }

        .detail-row.best-for .detail-value,
        .detail-row.security .detail-value {
          text-align: left;
          margin-top: 4px;
        }

        /* Security Panel */
        .deployment-models h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .deployment-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .deployment-card {
          border: 2px solid #e5e7eb;
          border-left: 6px solid #10b981;
          border-radius: 10px;
          padding: 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .deployment-card:hover {
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.15);
          transform: translateY(-2px);
        }

        .deployment-card h5 {
          margin: 0 0 12px 0;
          color: #111827;
          font-size: 16px;
          font-weight: 700;
          padding-bottom: 10px;
          border-bottom: 2px solid #f3f4f6;
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
          gap: 16px;
        }

        .security-concepts h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .security-card {
          display: flex;
          gap: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 18px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .security-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
          border-color: #3b82f6;
        }

        .security-icon {
          font-size: 32px;
          flex-shrink: 0;
          line-height: 1;
        }

        .security-content {
          flex: 1;
        }

        .security-content h5 {
          margin: 0 0 10px 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
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
        .multitenancy-section h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .pattern-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 18px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .pattern-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        .pattern-card h5 {
          margin: 0 0 10px 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
          padding-bottom: 8px;
          border-bottom: 2px solid #f3f4f6;
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

        .elasticity-info h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .elasticity-card {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 18px;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s;
        }

        .elasticity-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 8px 16px rgba(139, 92, 246, 0.15);
          transform: translateY(-3px);
        }

        .elasticity-card h5 {
          margin: 0 0 10px 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
          padding-bottom: 8px;
          border-bottom: 2px solid #f3f4f6;
        }

        .elasticity-card p {
          color: #6b7280;
          font-size: 13px;
          margin: 8px 0;
          line-height: 1.5;
        }

        .elasticity-card strong {
          color: #374151;
          display: block;
          margin-top: 12px;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default CloudArchitectureDesigner;
