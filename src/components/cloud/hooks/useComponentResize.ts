/**
 * Custom hook for handling component resize operations in the Cloud Architecture Designer
 * Manages resize state and provides handlers for all four corner resize handles
 */

import { useState, useCallback } from 'react';
import type { ArchitectureDesign, ArchitectureComponent } from '../cloud-types';

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

interface UseComponentResizeParams {
  design: ArchitectureDesign;
  zoom: number;
  snapToGrid: (value: number) => number;
  onUpdateDesign: (design: ArchitectureDesign) => void;
  onSelectComponent: (component: ArchitectureComponent | null) => void;
  selectedComponent: ArchitectureComponent | null;
}

interface UseComponentResizeReturn {
  resizeState: ResizeState;
  handleResizeMouseDown: (
    e: React.MouseEvent,
    componentId: string,
    handle: 'se' | 'ne' | 'sw' | 'nw'
  ) => void;
  handleResizeMouseMove: (e: React.MouseEvent) => void;
  handleResizeMouseUp: () => void;
}

const MIN_WIDTH = 80;
const MIN_HEIGHT = 60;

/**
 * Hook for managing component resize operations
 * Supports resizing from all four corners (SE, NE, SW, NW) with grid snapping
 */
export function useComponentResize({
  design,
  zoom,
  snapToGrid,
  onUpdateDesign,
  onSelectComponent,
  selectedComponent,
}: UseComponentResizeParams): UseComponentResizeReturn {
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

  /**
   * Initiates resize operation when user clicks on a resize handle
   */
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string, handle: 'se' | 'ne' | 'sw' | 'nw') => {
      e.stopPropagation();

      const component = design.components.find((c) => c.id === componentId);
      if (!component) return;

      setResizeState({
        isResizing: true,
        componentId,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: component.width,
        startHeight: component.height,
        startComponentX: component.x,
        startComponentY: component.y,
      });
    },
    [design.components]
  );

  /**
   * Handles mouse move during resize operation
   * Calculates new dimensions based on handle position and applies constraints
   */
  const handleResizeMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!resizeState.isResizing || !resizeState.componentId || !resizeState.handle) {
        return;
      }

      const deltaX = (e.clientX - resizeState.startX) / zoom;
      const deltaY = (e.clientY - resizeState.startY) / zoom;

      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;
      let newX = resizeState.startComponentX;
      let newY = resizeState.startComponentY;

      // Calculate new dimensions based on resize handle
      switch (resizeState.handle) {
        case 'se':
          // Southeast: increase width and height
          newWidth = Math.max(MIN_WIDTH, resizeState.startWidth + deltaX);
          newHeight = Math.max(MIN_HEIGHT, resizeState.startHeight + deltaY);
          break;

        case 'ne':
          // Northeast: increase width, decrease height, adjust Y
          newWidth = Math.max(MIN_WIDTH, resizeState.startWidth + deltaX);
          newHeight = Math.max(MIN_HEIGHT, resizeState.startHeight - deltaY);
          newY = resizeState.startComponentY + deltaY;
          break;

        case 'sw':
          // Southwest: decrease width, adjust X, increase height
          newWidth = Math.max(MIN_WIDTH, resizeState.startWidth - deltaX);
          newHeight = Math.max(MIN_HEIGHT, resizeState.startHeight + deltaY);
          newX = resizeState.startComponentX + deltaX;
          break;

        case 'nw':
          // Northwest: decrease width and height, adjust X and Y
          newWidth = Math.max(MIN_WIDTH, resizeState.startWidth - deltaX);
          newHeight = Math.max(MIN_HEIGHT, resizeState.startHeight - deltaY);
          newX = resizeState.startComponentX + deltaX;
          newY = resizeState.startComponentY + deltaY;
          break;
      }

      // Apply grid snapping
      newWidth = snapToGrid(newWidth);
      newHeight = snapToGrid(newHeight);
      newX = snapToGrid(newX);
      newY = snapToGrid(newY);

      // Update component in design
      const updatedComponents = design.components.map((c) =>
        c.id === resizeState.componentId
          ? { ...c, width: newWidth, height: newHeight, x: newX, y: newY }
          : c
      );

      onUpdateDesign({
        ...design,
        components: updatedComponents,
        metadata: { ...design.metadata, modified: new Date() },
      });

      // Update selected component if it's the one being resized
      if (selectedComponent?.id === resizeState.componentId) {
        onSelectComponent({
          ...selectedComponent,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    },
    [resizeState, zoom, snapToGrid, design, selectedComponent, onUpdateDesign, onSelectComponent]
  );

  /**
   * Completes resize operation and resets state
   */
  const handleResizeMouseUp = useCallback(() => {
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
  }, []);

  return {
    resizeState,
    handleResizeMouseDown,
    handleResizeMouseMove,
    handleResizeMouseUp,
  };
}
