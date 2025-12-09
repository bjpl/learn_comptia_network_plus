/**
 * Drag and drop handlers
 */

import { useCallback, RefObject } from 'react';
import { useCloudDesignerStore } from '../../stores/cloudDesignerStore';
import type {
  ArchitectureComponent,
  ComponentLibraryItem,
  DeploymentZone,
  ServiceLayer,
  ConnectivityOption,
  VPCElement,
  Gateway,
  NFVComponent,
} from '../types';

export const useDragAndDrop = (
  canvasRef: RefObject<HTMLDivElement>,
  snapToGrid: (value: number) => number
) => {
  const design = useCloudDesignerStore((state) => state.design);
  const canvasState = useCloudDesignerStore((state) => state.canvasState);
  const setDesign = useCloudDesignerStore((state) => state.setDesign);
  const selectComponent = useCloudDesignerStore((state) => state.selectComponent);
  const setIsDraggingFromLibrary = useCloudDesignerStore((state) => state.setIsDraggingFromLibrary);

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
    [design, canvasState.zoom, snapToGrid, setDesign, selectComponent, setIsDraggingFromLibrary, canvasRef]
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
