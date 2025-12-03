/**
 * CloudArchitectureDesigner - Main orchestrator component
 * CompTIA Network+ Learning Objective 1.2
 *
 * This component coordinates:
 * - Canvas interactions (drag, resize, connections)
 * - Component library and properties panels
 * - Validation and educational feature panels
 * - Zustand state management
 *
 * Extracted components:
 * - ComponentLibraryPanel: Drag-to-canvas component selection
 * - PropertiesPanel: Selected component property editor
 * - ValidationPanel: Architecture validation results
 * - FeaturePanels: Educational panels (Service Models, Security, Elasticity)
 * - DesignerToolbar: Toolbar with zoom/undo/redo controls
 *
 * Custom hooks:
 * - useKeyboardShortcuts: Keyboard navigation and actions
 * - useComponentDrag: Component drag operations
 * - useComponentResize: Component resize operations
 * - useConnectionDrawing: Connection line drawing
 */

import React, { useRef, useCallback } from 'react';
import { useCloudDesignerStore } from './stores/cloudDesignerStore';
import { ComponentLibraryPanel } from './ComponentLibraryPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { ValidationPanel } from './ValidationPanel';
import {
  ServiceComparisonPanel,
  SecurityPanel,
  ElasticityPanel,
} from './FeaturePanels';
import { componentLibrary, validationRules } from './cloud-data';
import type {
  ArchitectureComponent,
  Connection,
  ValidationResult,
  ComponentLibraryItem,
  DeploymentZone,
  ServiceLayer,
  ConnectivityOption,
  VPCElement,
  Gateway,
  NFVComponent,
  ValidationError,
  ValidationWarning,
} from './cloud-types';
import styles from './CloudArchitectureDesigner.module.css';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CloudArchitectureDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Zustand store selectors
  const design = useCloudDesignerStore((state) => state.design);
  const canvasState = useCloudDesignerStore((state) => state.canvasState);
  const selectedComponent = useCloudDesignerStore((state) => state.selectedComponent);
  const hoveredComponent = useCloudDesignerStore((state) => state.hoveredComponent);
  const validation = useCloudDesignerStore((state) => state.validation);
  const showLibrary = useCloudDesignerStore((state) => state.showLibrary);
  const showServiceComparison = useCloudDesignerStore((state) => state.showServiceComparison);
  const showSecurityPanel = useCloudDesignerStore((state) => state.showSecurityPanel);
  const showElasticityVisualization = useCloudDesignerStore((state) => state.showElasticityVisualization);
  const isDraggingFromLibrary = useCloudDesignerStore((state) => state.isDraggingFromLibrary);
  const dragState = useCloudDesignerStore((state) => state.dragState);
  const resizeState = useCloudDesignerStore((state) => state.resizeState);
  const connectionState = useCloudDesignerStore((state) => state.connectionState);
  const history = useCloudDesignerStore((state) => state.history);
  const canvasPan = useCloudDesignerStore((state) => state.canvasPan);

  // Store actions
  const setDesign = useCloudDesignerStore((state) => state.setDesign);
  const selectComponent = useCloudDesignerStore((state) => state.selectComponent);
  const setShowLibrary = useCloudDesignerStore((state) => state.setShowLibrary);
  const setIsDraggingFromLibrary = useCloudDesignerStore((state) => state.setIsDraggingFromLibrary);
  const setCanvasState = useCloudDesignerStore((state) => state.setCanvasState);
  const setValidation = useCloudDesignerStore((state) => state.setValidation);
  const toggleServiceComparison = useCloudDesignerStore((state) => state.toggleServiceComparison);
  const toggleSecurityPanel = useCloudDesignerStore((state) => state.toggleSecurityPanel);
  const toggleElasticityVisualization = useCloudDesignerStore((state) => state.toggleElasticityVisualization);
  const setDragState = useCloudDesignerStore((state) => state.setDragState);
  const setResizeState = useCloudDesignerStore((state) => state.setResizeState);
  const setConnectionState = useCloudDesignerStore((state) => state.setConnectionState);
  const setCanvasPan = useCloudDesignerStore((state) => state.setCanvasPan);
  const hoverComponent = useCloudDesignerStore((state) => state.hoverComponent);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const snapToGrid = useCallback(
    (value: number): number => {
      if (!canvasState.snapToGrid) return value;
      return Math.round(value / canvasState.gridSize) * canvasState.gridSize;
    },
    [canvasState.snapToGrid, canvasState.gridSize]
  );

  // ============================================================================
  // HISTORY HANDLERS
  // ============================================================================

  const handleUndo = useCallback(() => {
    if (history.past.length > 0) {
      const previous = history.past[history.past.length - 1];
      setDesign(previous);
    }
  }, [history.past, setDesign]);

  const handleRedo = useCallback(() => {
    if (history.future.length > 0) {
      const next = history.future[0];
      setDesign(next);
    }
  }, [history.future, setDesign]);

  // ============================================================================
  // COMPONENT HANDLERS
  // ============================================================================

  const handleComponentDelete = useCallback(
    (componentId: string) => {
      setDesign({
        ...design,
        components: design.components.filter((c) => c.id !== componentId),
        connections: design.connections.filter(
          (c) => c.from !== componentId && c.to !== componentId
        ),
        metadata: { ...design.metadata, modified: new Date() },
      });
      selectComponent(null);
    },
    [design, setDesign, selectComponent]
  );

  const handleDuplicateComponent = useCallback(
    (componentId: string) => {
      const component = design.components.find((c) => c.id === componentId);
      if (!component) return;

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
      selectComponent(newComponent);
    },
    [design, setDesign, selectComponent]
  );

  const handlePropertyChange = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!selectedComponent) return;

      const updatedComponents = design.components.map((c) =>
        c.id === selectedComponent.id
          ? { ...c, properties: { ...c.properties, [key]: value } }
          : c
      );

      setDesign({
        ...design,
        components: updatedComponents,
        metadata: { ...design.metadata, modified: new Date() },
      });

      selectComponent({
        ...selectedComponent,
        properties: { ...selectedComponent.properties, [key]: value },
      });
    },
    [selectedComponent, design, setDesign, selectComponent]
  );

  const handleNameChange = useCallback(
    (name: string) => {
      if (!selectedComponent) return;

      const updatedComponents = design.components.map((c) =>
        c.id === selectedComponent.id ? { ...c, name } : c
      );

      setDesign({ ...design, components: updatedComponents });
      selectComponent({ ...selectedComponent, name });
    },
    [selectedComponent, design, setDesign, selectComponent]
  );

  const handleCreateConnection = useCallback(
    (fromId: string, toId: string) => {
      const from = design.components.find((c) => c.id === fromId);
      const to = design.components.find((c) => c.id === toId);
      if (!from || !to) return;

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
    },
    [design, setDesign]
  );

  // ============================================================================
  // DRAG & DROP HANDLERS
  // ============================================================================

  const handleDragStart = useCallback(
    (e: React.DragEvent, libraryItem: ComponentLibraryItem) => {
      e.dataTransfer.setData('application/json', JSON.stringify(libraryItem));
      e.dataTransfer.effectAllowed = 'copy';
      setIsDraggingFromLibrary(true);
    },
    [setIsDraggingFromLibrary]
  );

  const handleDragEnd = useCallback(() => {
    setIsDraggingFromLibrary(false);
  }, [setIsDraggingFromLibrary]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingFromLibrary(false);

      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      const libraryItem = JSON.parse(data) as ComponentLibraryItem;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

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
      selectComponent(newComponent);
    },
    [design, canvasState.zoom, snapToGrid, setDesign, selectComponent, setIsDraggingFromLibrary]
  );

  // ============================================================================
  // CANVAS INTERACTION HANDLERS
  // ============================================================================

  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, component: ArchitectureComponent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.delete-btn') || target.closest('.resize-handle')) return;

      e.stopPropagation();
      selectComponent(component);

      setDragState({
        isDragging: true,
        componentId: component.id,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: component.x,
        offsetY: component.y,
      });
    },
    [selectComponent, setDragState]
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Handle component dragging
      if (dragState.isDragging && dragState.componentId) {
        const deltaX = (e.clientX - dragState.startX) / canvasState.zoom;
        const deltaY = (e.clientY - dragState.startY) / canvasState.zoom;

        let newX = snapToGrid(dragState.offsetX + deltaX);
        let newY = snapToGrid(dragState.offsetY + deltaY);
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
          selectComponent({ ...selectedComponent, x: newX, y: newY });
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
          selectComponent({ ...selectedComponent, width: newWidth, height: newHeight, x: newX, y: newY });
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
        setCanvasState({ ...canvasState, panX: canvasState.panX + deltaX, panY: canvasState.panY + deltaY });
        setCanvasPan({ ...canvasPan, startX: e.clientX, startY: e.clientY });
      }
    },
    [
      dragState, resizeState, connectionState, canvasPan, design, selectedComponent,
      canvasState, snapToGrid, setDesign, selectComponent, setConnectionState, setCanvasState, setCanvasPan
    ]
  );

  const handleCanvasMouseUp = useCallback(() => {
    setDragState({ isDragging: false, componentId: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
    setResizeState({
      isResizing: false, componentId: null, handle: null, startX: 0, startY: 0,
      startWidth: 0, startHeight: 0, startComponentX: 0, startComponentY: 0,
    });
    setCanvasPan({ isPanning: false, startX: 0, startY: 0 });
  }, [setDragState, setResizeState, setCanvasPan]);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, component: ArchitectureComponent, handle: 'se' | 'ne' | 'sw' | 'nw') => {
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
    },
    [setResizeState]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === canvasRef.current || target.classList.contains('connections-layer')) {
        setCanvasPan({ isPanning: true, startX: e.clientX, startY: e.clientY });
        selectComponent(null);
      }
    },
    [setCanvasPan, selectComponent]
  );

  const handleConnectionModeToggle = useCallback(
    (componentId: string) => {
      if (connectionState.isConnecting && connectionState.fromId === componentId) {
        setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
      } else if (connectionState.isConnecting && connectionState.fromId) {
        handleCreateConnection(connectionState.fromId, componentId);
        setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
      } else {
        const component = design.components.find((c) => c.id === componentId);
        if (!component) return;
        setConnectionState({
          isConnecting: true,
          fromId: componentId,
          cursorX: component.x + component.width / 2,
          cursorY: component.y + component.height / 2,
        });
      }
    },
    [connectionState, design.components, handleCreateConnection, setConnectionState]
  );

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateArchitecture = useCallback(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    Object.values(validationRules).forEach((rule) => {
      const result = rule.check(design.components);
      if (!result.valid) {
        const errorMessage =
          typeof result === 'object' && 'message' in result && typeof result.message === 'string'
            ? result.message
            : 'Validation failed';
        errors.push({ message: errorMessage, severity: 'error', suggestion: 'Review architecture requirements' });
      }
    });

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

    const maxScore = 100;
    const score = Math.max(0, maxScore - errors.length * 15 - warnings.length * 5);

    const validationResult: ValidationResult = { valid: errors.length === 0, errors, warnings, score };
    setValidation(validationResult);
    setDesign({ ...design, validation: validationResult });
  }, [design, setValidation, setDesign]);

  // ============================================================================
  // EXPORT
  // ============================================================================

  const handleExport = useCallback(() => {
    const exportData = JSON.stringify(design, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [design]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={styles['cloud-architecture-designer']}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles['title-section']}>
          <div className={styles['title-wrapper']}>
            <h2>Cloud Architecture Designer</h2>
            <p className={styles.subtitle}>Design and validate cloud infrastructure architectures</p>
          </div>
          <div className={styles['design-name-wrapper']}>
            <input
              type="text"
              className={styles['design-name']}
              value={design.name}
              onChange={(e) => setDesign({ ...design, name: e.target.value })}
              placeholder="Architecture name"
            />
            <div className={styles.metadata}>
              <span>{design.components.length} component{design.components.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{design.connections.length} connection{design.connections.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div className={styles.toolbar}>
          <div className={styles['button-group']}>
            <button className={`${styles['toolbar-btn']} ${showLibrary ? styles.active : ''}`} onClick={() => setShowLibrary(!showLibrary)}>
              <span>📚</span> {showLibrary ? 'Hide' : 'Show'} Library
            </button>
            <button className={`${styles['toolbar-btn']} ${styles.secondary} ${showServiceComparison ? styles.active : ''}`} onClick={() => toggleServiceComparison()}>
              <span>☁️</span> Service Models
            </button>
            <button className={`${styles['toolbar-btn']} ${styles.secondary} ${showSecurityPanel ? styles.active : ''}`} onClick={() => toggleSecurityPanel()}>
              <span>🔒</span> Security
            </button>
            <button className={`${styles['toolbar-btn']} ${styles.secondary} ${showElasticityVisualization ? styles.active : ''}`} onClick={() => toggleElasticityVisualization()}>
              <span>⚡</span> Elasticity
            </button>
          </div>
          <div className={`${styles['button-group']} ${styles.actions}`}>
            <button className={`${styles['toolbar-btn']} ${styles.accent}`} onClick={validateArchitecture}>
              <span>✓</span> Validate
            </button>
            <button className={`${styles['toolbar-btn']} ${styles.secondary}`} onClick={handleExport}>
              <span>↓</span> Export
            </button>
          </div>
          <label className={styles['snap-toggle']}>
            <input type="checkbox" checked={canvasState.snapToGrid} onChange={(e) => setCanvasState({ ...canvasState, snapToGrid: e.target.checked })} />
            <span>Snap to Grid</span>
          </label>
        </div>
      </div>

      {/* Workspace */}
      <div className={styles.workspace}>
        {showLibrary && (
          <ComponentLibraryPanel onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
        )}

        <div className={styles['canvas-container']}>
          <div className={styles['canvas-controls']}>
            <div className={styles['zoom-controls']}>
              <button onClick={() => setCanvasState({ ...canvasState, zoom: Math.min(2, canvasState.zoom + 0.1) })}>+</button>
              <span>{Math.round(canvasState.zoom * 100)}%</span>
              <button onClick={() => setCanvasState({ ...canvasState, zoom: Math.max(0.5, canvasState.zoom - 0.1) })}>-</button>
            </div>
            <div className={styles['history-controls']}>
              <button onClick={handleUndo} disabled={history.past.length === 0}>↶</button>
              <button onClick={handleRedo} disabled={history.future.length === 0}>↷</button>
            </div>
          </div>

          <div
            ref={canvasRef}
            className={`${styles.canvas} ${isDraggingFromLibrary ? styles['drop-zone-active'] : ''} ${canvasPan.isPanning ? styles.panning : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onWheel={(e) => {
              if (e.ctrlKey) {
                e.preventDefault();
                const newZoom = Math.max(0.5, Math.min(2, canvasState.zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
                setCanvasState({ ...canvasState, zoom: newZoom });
              }
            }}
            style={{ transform: `scale(${canvasState.zoom})`, backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px` }}
          >
            {/* Connections SVG */}
            <svg ref={svgRef} className={styles['connections-layer']}>
              {design.connections.map((conn) => {
                const from = design.components.find((c) => c.id === conn.from);
                const to = design.components.find((c) => c.id === conn.to);
                if (!from || !to) return null;

                const x1 = from.x + from.width / 2, y1 = from.y + from.height / 2;
                const x2 = to.x + to.width / 2, y2 = to.y + to.height / 2;
                const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                const offset = Math.min(dist * 0.4, 100);
                const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;

                return (
                  <g key={conn.id}>
                    <path d={path} stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                    <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} fill="#374151" fontSize="11" fontWeight="600" textAnchor="middle">{conn.label}</text>
                  </g>
                );
              })}
              {connectionState.isConnecting && connectionState.fromId && (() => {
                const from = design.components.find((c) => c.id === connectionState.fromId);
                if (!from) return null;
                const x1 = from.x + from.width / 2, y1 = from.y + from.height / 2;
                const dist = Math.sqrt((connectionState.cursorX - x1) ** 2 + (connectionState.cursorY - y1) ** 2);
                const offset = Math.min(dist * 0.4, 100);
                const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${connectionState.cursorX - offset} ${connectionState.cursorY}, ${connectionState.cursorX} ${connectionState.cursorY}`;
                return <path d={path} stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.6" />;
              })()}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                </marker>
              </defs>
            </svg>

            {/* Components */}
            {design.components.map((component) => (
              <div
                key={component.id}
                className={`${styles['canvas-component']} ${selectedComponent?.id === component.id ? styles.selected : ''} ${hoveredComponent === component.id ? styles.hovered : ''}`}
                style={{ left: component.x, top: component.y, width: component.width, height: component.height, backgroundColor: component.color + '20', borderColor: component.color }}
                onClick={(e) => { e.stopPropagation(); selectComponent(component); }}
                onMouseDown={(e) => handleComponentMouseDown(e, component)}
                onMouseEnter={() => hoverComponent(component.id)}
                onMouseLeave={() => hoverComponent(null)}
              >
                <div className={styles['component-header']} style={{ backgroundColor: component.color }}>
                  <span>{component.icon}</span>
                  <span>{component.name}</span>
                  <div className={styles['component-actions']}>
                    <button onClick={(e) => { e.stopPropagation(); handleConnectionModeToggle(component.id); }}>🔗</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDuplicateComponent(component.id); }}>⧉</button>
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleComponentDelete(component.id); }}>×</button>
                  </div>
                </div>
                <div className={styles['component-body']}>
                  <div className={styles['component-type']}>{component.subtype}</div>
                </div>
                {selectedComponent?.id === component.id && (
                  <>
                    <div className={`${styles['resize-handle']} ${styles['handle-nw']}`} onMouseDown={(e) => handleResizeMouseDown(e, component, 'nw')} />
                    <div className={`${styles['resize-handle']} ${styles['handle-ne']}`} onMouseDown={(e) => handleResizeMouseDown(e, component, 'ne')} />
                    <div className={`${styles['resize-handle']} ${styles['handle-sw']}`} onMouseDown={(e) => handleResizeMouseDown(e, component, 'sw')} />
                    <div className={`${styles['resize-handle']} ${styles['handle-se']}`} onMouseDown={(e) => handleResizeMouseDown(e, component, 'se')} />
                    <div className={styles['size-indicator']}>{Math.round(component.width)} × {Math.round(component.height)}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panels */}
        {selectedComponent && (
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onPropertyChange={handlePropertyChange}
            onNameChange={handleNameChange}
            onCreateConnection={handleCreateConnection}
            availableTargets={design.components.filter((c) => c.id !== selectedComponent.id)}
          />
        )}
        {showServiceComparison && <ServiceComparisonPanel onClose={() => toggleServiceComparison()} />}
        {showSecurityPanel && <SecurityPanel onClose={() => toggleSecurityPanel()} />}
        {showElasticityVisualization && <ElasticityPanel onClose={() => toggleElasticityVisualization()} />}
      </div>

      {validation && <ValidationPanel validation={validation} />}
    </div>
  );
};

export default CloudArchitectureDesigner;
