/**
 * Component manipulation handlers
 */

import { useCallback } from 'react';
import { useCloudDesignerStore } from '../../stores/cloudDesignerStore';
import type { ArchitectureComponent, Connection } from '../types';
import { componentLibrary } from '../../cloud-data';

export const useComponentHandlers = () => {
  const design = useCloudDesignerStore((state) => state.design);
  const selectedComponent = useCloudDesignerStore((state) => state.selectedComponent);
  const setDesign = useCloudDesignerStore((state) => state.setDesign);
  const selectComponent = useCloudDesignerStore((state) => state.selectComponent);

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

  return {
    handleComponentDelete,
    handleDuplicateComponent,
    handlePropertyChange,
    handleNameChange,
    handleCreateConnection,
  };
};
