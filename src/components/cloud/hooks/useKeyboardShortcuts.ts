/**
 * Custom hook for keyboard shortcuts in Cloud Architecture Designer
 * Handles all keyboard interactions including navigation, editing, and component management
 */

import { useEffect } from 'react';
import type { ArchitectureComponent, ArchitectureDesign } from '../cloud-types';

export interface KeyboardShortcutsConfig {
  selectedComponent: ArchitectureComponent | null;
  design: ArchitectureDesign;
  hoveredComponent: string | null;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSelect: (component: ArchitectureComponent | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onCancelConnection: () => void;
  snapToGrid: (value: number) => number;
}

/**
 * Hook that manages keyboard shortcuts for the architecture designer
 *
 * Supported shortcuts:
 * - Ctrl+Z: Undo last action
 * - Ctrl+Shift+Z / Ctrl+Y: Redo last undone action
 * - Delete: Delete selected component
 * - Escape: Cancel connection mode or deselect component
 * - Ctrl+D: Duplicate selected component
 * - Arrow Keys: Move selected component (Shift for larger steps)
 * - Tab / Shift+Tab: Cycle through components
 * - Space: Toggle selection on hovered component
 * - Enter: Log component properties (placeholder for properties panel)
 *
 * @param config - Configuration object with all required handlers and state
 */
export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig): void => {
  const {
    selectedComponent,
    design,
    hoveredComponent,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSelect,
    onMove,
    onCancelConnection,
    snapToGrid,
  } = config;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (without Shift)
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        onRedo();
        return;
      }

      // Delete: Delete key (only if component is selected)
      if (e.key === 'Delete' && selectedComponent) {
        e.preventDefault();
        onDelete(selectedComponent.id);
        return;
      }

      // Escape: Cancel connection mode or deselect component
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancelConnection();
        onSelect(null);
        return;
      }

      // Duplicate: Ctrl+D (only if component is selected)
      if (e.ctrlKey && e.key === 'd' && selectedComponent) {
        e.preventDefault();
        onDuplicate(selectedComponent.id);
        return;
      }

      // Arrow keys: Move selected component
      if (e.key.startsWith('Arrow') && selectedComponent) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 5;
        let newX = selectedComponent.x;
        let newY = selectedComponent.y;

        switch (e.key) {
          case 'ArrowLeft':
            newX -= step;
            break;
          case 'ArrowRight':
            newX += step;
            break;
          case 'ArrowUp':
            newY -= step;
            break;
          case 'ArrowDown':
            newY += step;
            break;
        }

        onMove(selectedComponent.id, snapToGrid(newX), snapToGrid(newY));
        return;
      }

      // Tab: Cycle through components (Shift+Tab for reverse)
      if (e.key === 'Tab' && design.components.length > 0) {
        e.preventDefault();
        const currentIndex = selectedComponent
          ? design.components.findIndex((c) => c.id === selectedComponent.id)
          : -1;
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + design.components.length) % design.components.length
          : (currentIndex + 1) % design.components.length;
        onSelect(design.components[nextIndex]);
        return;
      }

      // Space: Toggle selection on hovered component
      if (e.key === ' ' && hoveredComponent) {
        e.preventDefault();
        const component = design.components.find((c) => c.id === hoveredComponent);
        if (component) {
          // Toggle selection: deselect if already selected, select otherwise
          const isCurrentlySelected = selectedComponent?.id === hoveredComponent;
          onSelect(isCurrentlySelected ? null : component);
        }
        return;
      }

      // Enter: Show component properties (placeholder for properties panel)
      if (e.key === 'Enter' && selectedComponent) {
        e.preventDefault();
        // Future: Could open a properties panel modal showing component details
        // Component: {id, type, subtype, name, position, dimensions, properties, connections}
        return;
      }
    };

    // Register keyboard event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    selectedComponent,
    design,
    hoveredComponent,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSelect,
    onMove,
    onCancelConnection,
    snapToGrid,
  ]);
};

export default useKeyboardShortcuts;
