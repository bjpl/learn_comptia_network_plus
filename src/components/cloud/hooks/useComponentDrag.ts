/**
 * Custom hook for managing component dragging in the Cloud Architecture Designer
 * Handles drag state, mouse events, and component position updates
 */

import { useState, useCallback } from 'react';
import type { ArchitectureComponent, ArchitectureDesign } from '../cloud-types';

type DragState = {
  isDragging: boolean;
  componentId: string | null;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

interface UseComponentDragParams {
  design: ArchitectureDesign;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  snapToGrid: (value: number) => number;
  onUpdateDesign: (design: ArchitectureDesign) => void;
  onSelectComponent: (component: ArchitectureComponent | null) => void;
  selectedComponent: ArchitectureComponent | null;
}

interface UseComponentDragReturn {
  dragState: DragState;
  handleComponentMouseDown: (e: React.MouseEvent, component: ArchitectureComponent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
}

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1500;
const MIN_COMPONENT_SIZE = 100;

export const useComponentDrag = ({
  design,
  canvasRef,
  zoom,
  snapToGrid,
  onUpdateDesign,
  onSelectComponent,
  selectedComponent,
}: UseComponentDragParams): UseComponentDragReturn => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    componentId: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, component: ArchitectureComponent) => {
      // Don't start drag if clicking on delete button or resize handle
      const target = e.target as HTMLElement;
      if (target.closest('.delete-btn') || target.closest('.resize-handle')) {
        return;
      }

      e.stopPropagation();
      onSelectComponent(component);

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
    },
    [canvasRef, onSelectComponent]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      // Handle component dragging
      if (dragState.isDragging && dragState.componentId) {
        const deltaX = (e.clientX - dragState.startX) / zoom;
        const deltaY = (e.clientY - dragState.startY) / zoom;

        let newX = dragState.offsetX + deltaX;
        let newY = dragState.offsetY + deltaY;

        // Snap to grid
        newX = snapToGrid(newX);
        newY = snapToGrid(newY);

        // Keep within canvas bounds
        newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - MIN_COMPONENT_SIZE));
        newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - MIN_COMPONENT_SIZE));

        const updatedComponents = design.components.map((c) =>
          c.id === dragState.componentId ? { ...c, x: newX, y: newY } : c
        );

        onUpdateDesign({
          ...design,
          components: updatedComponents,
          metadata: { ...design.metadata, modified: new Date() },
        });

        if (selectedComponent?.id === dragState.componentId) {
          onSelectComponent({ ...selectedComponent, x: newX, y: newY });
        }
      }
    },
    [
      canvasRef,
      dragState,
      zoom,
      snapToGrid,
      design,
      onUpdateDesign,
      selectedComponent,
      onSelectComponent,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      componentId: null,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  return {
    dragState,
    handleComponentMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
