/**
 * Canvas interaction handlers (drag, resize, pan, connections)
 */

import { useCallback, RefObject } from 'react';
import { useCloudDesignerStore } from '../../stores/cloudDesignerStore';
import type { ArchitectureComponent } from '../types';

export const useCanvasInteractions = (
  canvasRef: RefObject<HTMLDivElement>,
  snapToGrid: (value: number) => number
) => {
  const design = useCloudDesignerStore((state) => state.design);
  const canvasState = useCloudDesignerStore((state) => state.canvasState);
  const selectedComponent = useCloudDesignerStore((state) => state.selectedComponent);
  const dragState = useCloudDesignerStore((state) => state.dragState);
  const resizeState = useCloudDesignerStore((state) => state.resizeState);
  const connectionState = useCloudDesignerStore((state) => state.connectionState);
  const canvasPan = useCloudDesignerStore((state) => state.canvasPan);

  const selectComponent = useCloudDesignerStore((state) => state.selectComponent);
  const setDesign = useCloudDesignerStore((state) => state.setDesign);
  const setDragState = useCloudDesignerStore((state) => state.setDragState);
  const setResizeState = useCloudDesignerStore((state) => state.setResizeState);
  const setConnectionState = useCloudDesignerStore((state) => state.setConnectionState);
  const setCanvasPan = useCloudDesignerStore((state) => state.setCanvasPan);
  const setCanvasState = useCloudDesignerStore((state) => state.setCanvasState);

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
      canvasState, snapToGrid, setDesign, selectComponent, setConnectionState, setCanvasState, setCanvasPan, canvasRef
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
    [setCanvasPan, selectComponent, canvasRef]
  );

  return {
    handleComponentMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleResizeMouseDown,
    handleCanvasMouseDown,
  };
};
