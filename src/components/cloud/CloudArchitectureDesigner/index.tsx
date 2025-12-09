/**
 * CloudArchitectureDesigner - Main orchestrator component
 * CompTIA Network+ Learning Objective 1.2
 *
 * Decomposed architecture:
 * - types/: Type definitions
 * - utils/: Utility functions (validation, export, grid snapping)
 * - hooks/: Custom hooks (history, components, drag/drop, canvas interactions)
 * - components/: Sub-components (header, controls, connections, canvas component)
 */

import React, { useRef, useCallback, useMemo } from 'react';
import { useCloudDesignerStore } from '../stores/cloudDesignerStore';
import { ComponentLibraryPanel } from '../ComponentLibraryPanel';
import { PropertiesPanel } from '../PropertiesPanel';
import { ValidationPanel } from '../ValidationPanel';
import { ServiceComparisonPanel, SecurityPanel, ElasticityPanel } from '../FeaturePanels';
import { createSnapToGrid, validateArchitecture, exportDesignAsJSON } from './utils';
import {
  useHistoryHandlers,
  useComponentHandlers,
  useDragAndDrop,
  useCanvasInteractions,
  useConnectionHandlers,
} from './hooks';
import {
  DesignerHeader,
  CanvasControls,
  ConnectionsLayer,
  CanvasComponent,
} from './components';
import styles from './CloudArchitectureDesigner.module.css';

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
  const connectionState = useCloudDesignerStore((state) => state.connectionState);
  const canvasPan = useCloudDesignerStore((state) => state.canvasPan);

  // Store actions
  const setDesign = useCloudDesignerStore((state) => state.setDesign);
  const selectComponent = useCloudDesignerStore((state) => state.selectComponent);
  const setShowLibrary = useCloudDesignerStore((state) => state.setShowLibrary);
  const setCanvasState = useCloudDesignerStore((state) => state.setCanvasState);
  const setValidation = useCloudDesignerStore((state) => state.setValidation);
  const toggleServiceComparison = useCloudDesignerStore((state) => state.toggleServiceComparison);
  const toggleSecurityPanel = useCloudDesignerStore((state) => state.toggleSecurityPanel);
  const toggleElasticityVisualization = useCloudDesignerStore((state) => state.toggleElasticityVisualization);
  const hoverComponent = useCloudDesignerStore((state) => state.hoverComponent);

  // Utility function
  const snapToGrid = useMemo(
    () => createSnapToGrid(canvasState.snapToGrid, canvasState.gridSize),
    [canvasState.snapToGrid, canvasState.gridSize]
  );

  // Custom hooks
  const { handleUndo, handleRedo, canUndo, canRedo } = useHistoryHandlers();
  const {
    handleComponentDelete,
    handleDuplicateComponent,
    handlePropertyChange,
    handleNameChange,
    handleCreateConnection,
  } = useComponentHandlers();
  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragAndDrop(canvasRef, snapToGrid);
  const {
    handleComponentMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleResizeMouseDown,
    handleCanvasMouseDown,
  } = useCanvasInteractions(canvasRef, snapToGrid);
  const { handleConnectionModeToggle } = useConnectionHandlers(handleCreateConnection);

  // Validation handler
  const handleValidate = useCallback(() => {
    const validationResult = validateArchitecture(design.components, design.connections);
    setValidation(validationResult);
    setDesign({ ...design, validation: validationResult });
  }, [design, setValidation, setDesign]);

  // Export handler
  const handleExport = useCallback(() => {
    exportDesignAsJSON(design);
  }, [design]);

  return (
    <div className={styles['cloud-architecture-designer']}>
      <DesignerHeader
        designName={design.name}
        componentCount={design.components.length}
        connectionCount={design.connections.length}
        showLibrary={showLibrary}
        showServiceComparison={showServiceComparison}
        showSecurityPanel={showSecurityPanel}
        showElasticityVisualization={showElasticityVisualization}
        snapToGrid={canvasState.snapToGrid}
        onDesignNameChange={(name) => setDesign({ ...design, name })}
        onToggleLibrary={() => setShowLibrary(!showLibrary)}
        onToggleServiceComparison={toggleServiceComparison}
        onToggleSecurityPanel={toggleSecurityPanel}
        onToggleElasticity={toggleElasticityVisualization}
        onValidate={handleValidate}
        onExport={handleExport}
        onToggleSnapToGrid={(enabled) => setCanvasState({ ...canvasState, snapToGrid: enabled })}
      />

      <div className={styles.workspace}>
        {showLibrary && <ComponentLibraryPanel onDragStart={handleDragStart} onDragEnd={handleDragEnd} />}

        <div className={styles['canvas-container']}>
          <CanvasControls
            zoom={canvasState.zoom}
            canUndo={canUndo}
            canRedo={canRedo}
            onZoomIn={() => setCanvasState({ ...canvasState, zoom: Math.min(2, canvasState.zoom + 0.1) })}
            onZoomOut={() => setCanvasState({ ...canvasState, zoom: Math.max(0.5, canvasState.zoom - 0.1) })}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />

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
            style={{
              transform: `scale(${canvasState.zoom})`,
              backgroundSize: `${canvasState.gridSize}px ${canvasState.gridSize}px`,
            }}
          >
            <ConnectionsLayer
              ref={svgRef}
              connections={design.connections}
              components={design.components}
              connectionState={connectionState}
            />

            {design.components.map((component) => (
              <CanvasComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent?.id === component.id}
                isHovered={hoveredComponent === component.id}
                onMouseDown={handleComponentMouseDown}
                onMouseEnter={() => hoverComponent(component.id)}
                onMouseLeave={() => hoverComponent(null)}
                onSelect={selectComponent}
                onConnectionToggle={handleConnectionModeToggle}
                onDuplicate={handleDuplicateComponent}
                onDelete={handleComponentDelete}
                onResizeMouseDown={handleResizeMouseDown}
              />
            ))}
          </div>
        </div>

        {selectedComponent && (
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onPropertyChange={handlePropertyChange}
            onNameChange={handleNameChange}
            onCreateConnection={handleCreateConnection}
            availableTargets={design.components.filter((c) => c.id !== selectedComponent.id)}
          />
        )}
        {showServiceComparison && <ServiceComparisonPanel onClose={toggleServiceComparison} />}
        {showSecurityPanel && <SecurityPanel onClose={toggleSecurityPanel} />}
        {showElasticityVisualization && <ElasticityPanel onClose={toggleElasticityVisualization} />}
      </div>

      {validation && <ValidationPanel validation={validation} />}
    </div>
  );
};

export default CloudArchitectureDesigner;
