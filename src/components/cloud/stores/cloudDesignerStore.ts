/**
 * Zustand Store for Cloud Architecture Designer
 * Replaces 17 useState hooks with centralized state management
 *
 * State Management:
 * - Design state (components, connections, metadata)
 * - Canvas state (zoom, pan, grid)
 * - Interaction states (drag, resize, connection)
 * - History (undo/redo)
 * - UI state (panels, selection, hover)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  ArchitectureComponent,
  Connection,
  ArchitectureDesign,
  ValidationResult,
  CanvasState,
  ComponentType,
} from '../cloud-types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type DragState = {
  isDragging: boolean;
  componentId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

export type ResizeState = {
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

export type ConnectionState = {
  isConnecting: boolean;
  fromId: string | null;
  cursorX: number;
  cursorY: number;
};

export type HistoryState = {
  past: ArchitectureDesign[];
  present: ArchitectureDesign;
  future: ArchitectureDesign[];
};

export type CanvasPanState = {
  isPanning: boolean;
  startX: number;
  startY: number;
};

// ============================================================================
// STORE INTERFACE
// ============================================================================

export interface CloudDesignerStore {
  // ========================================
  // STATE
  // ========================================

  // Design State
  design: ArchitectureDesign;

  // Canvas State
  canvasState: CanvasState;

  // Interaction States
  dragState: DragState;
  resizeState: ResizeState;
  connectionState: ConnectionState;
  canvasPan: CanvasPanState;

  // History State (Undo/Redo)
  history: HistoryState;

  // UI State
  selectedComponent: ArchitectureComponent | null;
  hoveredComponent: string | null;
  validation: ValidationResult | null;
  showLibrary: boolean;
  activeCategory: ComponentType;
  showServiceComparison: boolean;
  showSecurityPanel: boolean;
  showElasticityVisualization: boolean;
  isDraggingFromLibrary: boolean;

  // ========================================
  // DESIGN ACTIONS
  // ========================================

  setDesign: (design: ArchitectureDesign) => void;
  updateDesign: (updater: (draft: ArchitectureDesign) => void) => void;

  addComponent: (component: ArchitectureComponent) => void;
  updateComponent: (id: string, updates: Partial<ArchitectureComponent>) => void;
  removeComponent: (id: string) => void;

  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;

  setDesignMetadata: (metadata: Partial<ArchitectureDesign['metadata']>) => void;

  // ========================================
  // CANVAS ACTIONS
  // ========================================

  setCanvasState: (state: Partial<CanvasState>) => void;
  updateCanvasState: (updater: (draft: CanvasState) => void) => void;

  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  resetCanvas: () => void;

  // ========================================
  // INTERACTION ACTIONS
  // ========================================

  // Drag Actions
  setDragState: (state: Partial<DragState>) => void;
  startDrag: (componentId: string, startX: number, startY: number) => void;
  updateDrag: (offsetX: number, offsetY: number) => void;
  endDrag: () => void;

  // Resize Actions
  setResizeState: (state: Partial<ResizeState>) => void;
  startResize: (
    componentId: string,
    handle: ResizeState['handle'],
    startX: number,
    startY: number,
    startWidth: number,
    startHeight: number,
    startComponentX: number,
    startComponentY: number
  ) => void;
  updateResize: (currentX: number, currentY: number) => void;
  endResize: () => void;

  // Connection Actions
  setConnectionState: (state: Partial<ConnectionState>) => void;
  startConnection: (fromId: string) => void;
  updateConnection: (cursorX: number, cursorY: number) => void;
  endConnection: (toId?: string) => void;

  // Canvas Pan Actions
  setCanvasPan: (state: Partial<CanvasPanState>) => void;
  startPan: (startX: number, startY: number) => void;
  endPan: () => void;

  // ========================================
  // HISTORY ACTIONS (UNDO/REDO)
  // ========================================

  pushHistory: (design: ArchitectureDesign) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // ========================================
  // UI ACTIONS
  // ========================================

  selectComponent: (component: ArchitectureComponent | null) => void;
  hoverComponent: (componentId: string | null) => void;
  setValidation: (validation: ValidationResult | null) => void;

  toggleLibrary: () => void;
  setShowLibrary: (show: boolean) => void;
  setActiveCategory: (category: ComponentType) => void;

  toggleServiceComparison: () => void;
  setShowServiceComparison: (show: boolean) => void;

  toggleSecurityPanel: () => void;
  setShowSecurityPanel: (show: boolean) => void;

  toggleElasticityVisualization: () => void;
  setShowElasticityVisualization: (show: boolean) => void;

  setIsDraggingFromLibrary: (isDragging: boolean) => void;

  // ========================================
  // UTILITY ACTIONS
  // ========================================

  resetAllState: () => void;
  loadDesign: (design: ArchitectureDesign) => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialDesign = (): ArchitectureDesign => ({
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

const initialDesign = createInitialDesign();

const initialState = {
  // Design State
  design: initialDesign,

  // Canvas State
  canvasState: {
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    isConnecting: false,
    gridSize: 20,
    snapToGrid: true,
  } as CanvasState,

  // Interaction States
  dragState: {
    isDragging: false,
    componentId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  } as DragState,

  resizeState: {
    isResizing: false,
    componentId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startComponentX: 0,
    startComponentY: 0,
  } as ResizeState,

  connectionState: {
    isConnecting: false,
    fromId: null,
    cursorX: 0,
    cursorY: 0,
  } as ConnectionState,

  canvasPan: {
    isPanning: false,
    startX: 0,
    startY: 0,
  } as CanvasPanState,

  // History State
  history: {
    past: [],
    present: initialDesign,
    future: [],
  } as HistoryState,

  // UI State
  selectedComponent: null as ArchitectureComponent | null,
  hoveredComponent: null as string | null,
  validation: null as ValidationResult | null,
  showLibrary: true,
  activeCategory: 'deployment-zone' as ComponentType,
  showServiceComparison: false,
  showSecurityPanel: false,
  showElasticityVisualization: false,
  isDraggingFromLibrary: false,
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useCloudDesignerStore = create<CloudDesignerStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // ========================================
        // DESIGN ACTIONS
        // ========================================

        setDesign: (design) => {
          set((state) => {
            state.design = design;
            state.design.metadata.modified = new Date();
          });
        },

        updateDesign: (updater) => {
          set((state) => {
            updater(state.design);
            state.design.metadata.modified = new Date();
          });
        },

        addComponent: (component) => {
          set((state) => {
            state.design.components.push(component);
            state.design.metadata.modified = new Date();
          });
          get().pushHistory(get().design);
        },

        updateComponent: (id, updates) => {
          set((state) => {
            const component = state.design.components.find(
              (c: ArchitectureComponent) => c.id === id
            );
            if (component) {
              Object.assign(component, updates);
              state.design.metadata.modified = new Date();
            }
          });
          get().pushHistory(get().design);
        },

        removeComponent: (id) => {
          set((state) => {
            state.design.components = state.design.components.filter(
              (c: ArchitectureComponent) => c.id !== id
            );
            state.design.connections = state.design.connections.filter(
              (conn: Connection) => conn.from !== id && conn.to !== id
            );
            state.design.metadata.modified = new Date();

            // Clear selection if removed component was selected
            if (state.selectedComponent?.id === id) {
              state.selectedComponent = null;
            }
          });
          get().pushHistory(get().design);
        },

        addConnection: (connection) => {
          set((state) => {
            state.design.connections.push(connection);
            state.design.metadata.modified = new Date();
          });
          get().pushHistory(get().design);
        },

        removeConnection: (id) => {
          set((state) => {
            state.design.connections = state.design.connections.filter(
              (c: Connection) => c.id !== id
            );
            state.design.metadata.modified = new Date();
          });
          get().pushHistory(get().design);
        },

        setDesignMetadata: (metadata) => {
          set((state) => {
            Object.assign(state.design.metadata, metadata);
            state.design.metadata.modified = new Date();
          });
        },

        // ========================================
        // CANVAS ACTIONS
        // ========================================

        setCanvasState: (newState) => {
          set((state) => {
            Object.assign(state.canvasState, newState);
          });
        },

        updateCanvasState: (updater) => {
          set((state) => {
            updater(state.canvasState);
          });
        },

        setZoom: (zoom) => {
          set((state) => {
            state.canvasState.zoom = Math.max(0.1, Math.min(3, zoom));
          });
        },

        setPan: (panX, panY) => {
          set((state) => {
            state.canvasState.panX = panX;
            state.canvasState.panY = panY;
          });
        },

        toggleSnapToGrid: () => {
          set((state) => {
            state.canvasState.snapToGrid = !state.canvasState.snapToGrid;
          });
        },

        setGridSize: (size) => {
          set((state) => {
            state.canvasState.gridSize = Math.max(10, Math.min(50, size));
          });
        },

        resetCanvas: () => {
          set((state) => {
            state.canvasState.zoom = 1;
            state.canvasState.panX = 0;
            state.canvasState.panY = 0;
          });
        },

        // ========================================
        // INTERACTION ACTIONS
        // ========================================

        // Drag Actions
        setDragState: (newState) => {
          set((state) => {
            Object.assign(state.dragState, newState);
          });
        },

        startDrag: (componentId, startX, startY) => {
          set((state) => {
            state.dragState = {
              isDragging: true,
              componentId,
              startX,
              startY,
              offsetX: 0,
              offsetY: 0,
            };
            state.canvasState.isDragging = true;
          });
        },

        updateDrag: (offsetX, offsetY) => {
          set((state) => {
            if (state.dragState.isDragging) {
              state.dragState.offsetX = offsetX;
              state.dragState.offsetY = offsetY;
            }
          });
        },

        endDrag: () => {
          set((state) => {
            state.dragState = {
              isDragging: false,
              componentId: null,
              startX: 0,
              startY: 0,
              offsetX: 0,
              offsetY: 0,
            };
            state.canvasState.isDragging = false;
          });
          get().pushHistory(get().design);
        },

        // Resize Actions
        setResizeState: (newState) => {
          set((state) => {
            Object.assign(state.resizeState, newState);
          });
        },

        startResize: (
          componentId,
          handle,
          startX,
          startY,
          startWidth,
          startHeight,
          startComponentX,
          startComponentY
        ) => {
          set((state) => {
            state.resizeState = {
              isResizing: true,
              componentId,
              handle,
              startX,
              startY,
              startWidth,
              startHeight,
              startComponentX,
              startComponentY,
            };
          });
        },

        updateResize: (currentX, currentY) => {
          const { resizeState } = get();
          if (!resizeState.isResizing || !resizeState.componentId) return;

          const deltaX = currentX - resizeState.startX;
          const deltaY = currentY - resizeState.startY;

          let newWidth = resizeState.startWidth;
          let newHeight = resizeState.startHeight;
          let newX = resizeState.startComponentX;
          let newY = resizeState.startComponentY;

          // Calculate new dimensions based on handle
          switch (resizeState.handle) {
            case 'se':
              newWidth = resizeState.startWidth + deltaX;
              newHeight = resizeState.startHeight + deltaY;
              break;
            case 'ne':
              newWidth = resizeState.startWidth + deltaX;
              newHeight = resizeState.startHeight - deltaY;
              newY = resizeState.startComponentY + deltaY;
              break;
            case 'sw':
              newWidth = resizeState.startWidth - deltaX;
              newHeight = resizeState.startHeight + deltaY;
              newX = resizeState.startComponentX + deltaX;
              break;
            case 'nw':
              newWidth = resizeState.startWidth - deltaX;
              newHeight = resizeState.startHeight - deltaY;
              newX = resizeState.startComponentX + deltaX;
              newY = resizeState.startComponentY + deltaY;
              break;
          }

          // Apply minimum size constraints
          newWidth = Math.max(80, newWidth);
          newHeight = Math.max(60, newHeight);

          // Update component
          get().updateComponent(resizeState.componentId, {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          });
        },

        endResize: () => {
          set((state) => {
            state.resizeState = {
              isResizing: false,
              componentId: null,
              handle: null,
              startX: 0,
              startY: 0,
              startWidth: 0,
              startHeight: 0,
              startComponentX: 0,
              startComponentY: 0,
            };
          });
          get().pushHistory(get().design);
        },

        // Connection Actions
        setConnectionState: (newState) => {
          set((state) => {
            Object.assign(state.connectionState, newState);
          });
        },

        startConnection: (fromId) => {
          set((state) => {
            state.connectionState = {
              isConnecting: true,
              fromId,
              cursorX: 0,
              cursorY: 0,
            };
            state.canvasState.isConnecting = true;
          });
        },

        updateConnection: (cursorX, cursorY) => {
          set((state) => {
            if (state.connectionState.isConnecting) {
              state.connectionState.cursorX = cursorX;
              state.connectionState.cursorY = cursorY;
            }
          });
        },

        endConnection: (toId) => {
          const { connectionState } = get();

          if (toId && connectionState.fromId && toId !== connectionState.fromId) {
            // Create new connection
            const newConnection: Connection = {
              id: 'conn-' + Date.now(),
              from: connectionState.fromId,
              to: toId,
              type: 'network',
              label: 'TCP/IP | 1 Gbps',
            };

            get().addConnection(newConnection);
          }

          set((state) => {
            state.connectionState = {
              isConnecting: false,
              fromId: null,
              cursorX: 0,
              cursorY: 0,
            };
            state.canvasState.isConnecting = false;
          });
        },

        // Canvas Pan Actions
        setCanvasPan: (newState) => {
          set((state) => {
            Object.assign(state.canvasPan, newState);
          });
        },

        startPan: (startX, startY) => {
          set((state) => {
            state.canvasPan = {
              isPanning: true,
              startX,
              startY,
            };
          });
        },

        endPan: () => {
          set((state) => {
            state.canvasPan = {
              isPanning: false,
              startX: 0,
              startY: 0,
            };
          });
        },

        // ========================================
        // HISTORY ACTIONS (UNDO/REDO)
        // ========================================

        pushHistory: (design) => {
          set((state) => {
            // Avoid duplicate history entries
            const lastDesign = state.history.past[state.history.past.length - 1];
            if (lastDesign && JSON.stringify(lastDesign) === JSON.stringify(design)) {
              return;
            }

            // Limit history to 50 entries
            const newPast = [...state.history.past, state.history.present].slice(-50);

            state.history = {
              past: newPast,
              present: design,
              future: [], // Clear future on new action
            };
          });
        },

        undo: () => {
          const { history } = get();
          if (history.past.length === 0) return;

          set((state) => {
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);

            state.history = {
              past: newPast,
              present: previous,
              future: [state.history.present, ...state.history.future],
            };

            state.design = previous;
          });
        },

        redo: () => {
          const { history } = get();
          if (history.future.length === 0) return;

          set((state) => {
            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);

            state.history = {
              past: [...state.history.past, state.history.present],
              present: next,
              future: newFuture,
            };

            state.design = next;
          });
        },

        canUndo: () => {
          return get().history.past.length > 0;
        },

        canRedo: () => {
          return get().history.future.length > 0;
        },

        clearHistory: () => {
          set((state) => {
            state.history = {
              past: [],
              present: state.design,
              future: [],
            };
          });
        },

        // ========================================
        // UI ACTIONS
        // ========================================

        selectComponent: (component) => {
          set((state) => {
            state.selectedComponent = component;
          });
        },

        hoverComponent: (componentId) => {
          set((state) => {
            state.hoveredComponent = componentId;
          });
        },

        setValidation: (validation) => {
          set((state) => {
            state.validation = validation;
          });
        },

        toggleLibrary: () => {
          set((state) => {
            state.showLibrary = !state.showLibrary;
          });
        },

        setShowLibrary: (show) => {
          set((state) => {
            state.showLibrary = show;
          });
        },

        setActiveCategory: (category) => {
          set((state) => {
            state.activeCategory = category;
          });
        },

        toggleServiceComparison: () => {
          set((state) => {
            state.showServiceComparison = !state.showServiceComparison;
          });
        },

        setShowServiceComparison: (show) => {
          set((state) => {
            state.showServiceComparison = show;
          });
        },

        toggleSecurityPanel: () => {
          set((state) => {
            state.showSecurityPanel = !state.showSecurityPanel;
          });
        },

        setShowSecurityPanel: (show) => {
          set((state) => {
            state.showSecurityPanel = show;
          });
        },

        toggleElasticityVisualization: () => {
          set((state) => {
            state.showElasticityVisualization = !state.showElasticityVisualization;
          });
        },

        setShowElasticityVisualization: (show) => {
          set((state) => {
            state.showElasticityVisualization = show;
          });
        },

        setIsDraggingFromLibrary: (isDragging) => {
          set((state) => {
            state.isDraggingFromLibrary = isDragging;
          });
        },

        // ========================================
        // UTILITY ACTIONS
        // ========================================

        resetAllState: () => {
          const newDesign = createInitialDesign();
          set({
            ...initialState,
            design: newDesign,
            history: {
              past: [],
              present: newDesign,
              future: [],
            },
          });
        },

        loadDesign: (design) => {
          set((state) => {
            state.design = design;
            state.history = {
              past: [],
              present: design,
              future: [],
            };
            state.selectedComponent = null;
            state.validation = null;
          });
        },
      })),
      {
        name: 'cloud-designer-storage',
        partialize: (state) => ({
          // Only persist design and canvas state
          design: state.design,
          canvasState: state.canvasState,
          showLibrary: state.showLibrary,
          activeCategory: state.activeCategory,
        }),
      }
    ),
    {
      name: 'CloudDesignerStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ============================================================================
// SELECTOR HOOKS (For optimized re-renders)
// ============================================================================

// Design Selectors
export const useDesign = () => useCloudDesignerStore((state) => state.design);
export const useComponents = () => useCloudDesignerStore((state) => state.design.components);
export const useConnections = () => useCloudDesignerStore((state) => state.design.connections);

// Canvas Selectors
export const useCanvasState = () => useCloudDesignerStore((state) => state.canvasState);
export const useZoom = () => useCloudDesignerStore((state) => state.canvasState.zoom);
export const usePan = () => useCloudDesignerStore((state) => ({
  panX: state.canvasState.panX,
  panY: state.canvasState.panY,
}));

// Interaction Selectors
export const useDragState = () => useCloudDesignerStore((state) => state.dragState);
export const useResizeState = () => useCloudDesignerStore((state) => state.resizeState);
export const useConnectionState = () => useCloudDesignerStore((state) => state.connectionState);

// UI Selectors
export const useSelectedComponent = () => useCloudDesignerStore((state) => state.selectedComponent);
export const useHoveredComponent = () => useCloudDesignerStore((state) => state.hoveredComponent);
export const useValidation = () => useCloudDesignerStore((state) => state.validation);

// History Selectors
export const useCanUndo = () => useCloudDesignerStore((state) => state.canUndo());
export const useCanRedo = () => useCloudDesignerStore((state) => state.canRedo());

// ============================================================================
// ACTION HOOKS (For direct access to actions)
// ============================================================================

export const useDesignActions = () => useCloudDesignerStore((state) => ({
  setDesign: state.setDesign,
  updateDesign: state.updateDesign,
  addComponent: state.addComponent,
  updateComponent: state.updateComponent,
  removeComponent: state.removeComponent,
  addConnection: state.addConnection,
  removeConnection: state.removeConnection,
}));

export const useCanvasActions = () => useCloudDesignerStore((state) => ({
  setZoom: state.setZoom,
  setPan: state.setPan,
  toggleSnapToGrid: state.toggleSnapToGrid,
  setGridSize: state.setGridSize,
  resetCanvas: state.resetCanvas,
}));

export const useInteractionActions = () => useCloudDesignerStore((state) => ({
  startDrag: state.startDrag,
  updateDrag: state.updateDrag,
  endDrag: state.endDrag,
  startResize: state.startResize,
  updateResize: state.updateResize,
  endResize: state.endResize,
  startConnection: state.startConnection,
  updateConnection: state.updateConnection,
  endConnection: state.endConnection,
}));

export const useHistoryActions = () => useCloudDesignerStore((state) => ({
  undo: state.undo,
  redo: state.redo,
  pushHistory: state.pushHistory,
  clearHistory: state.clearHistory,
}));

export const useUIActions = () => useCloudDesignerStore((state) => ({
  selectComponent: state.selectComponent,
  hoverComponent: state.hoverComponent,
  setValidation: state.setValidation,
  toggleLibrary: state.toggleLibrary,
  toggleServiceComparison: state.toggleServiceComparison,
  toggleSecurityPanel: state.toggleSecurityPanel,
  toggleElasticityVisualization: state.toggleElasticityVisualization,
}));
