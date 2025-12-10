/**
 * Individual component rendered on canvas
 */

import React from 'react';
import type { ArchitectureComponent } from '../types';
import styles from '../../CloudArchitectureDesigner.module.css';

interface CanvasComponentProps {
  component: ArchitectureComponent;
  isSelected: boolean;
  isHovered: boolean;
  onMouseDown: (e: React.MouseEvent, component: ArchitectureComponent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSelect: (component: ArchitectureComponent) => void;
  onConnectionToggle: (componentId: string) => void;
  onDuplicate: (componentId: string) => void;
  onDelete: (componentId: string) => void;
  onResizeMouseDown: (
    e: React.MouseEvent,
    component: ArchitectureComponent,
    handle: 'se' | 'ne' | 'sw' | 'nw'
  ) => void;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  isHovered,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  onConnectionToggle,
  onDuplicate,
  onDelete,
  onResizeMouseDown,
}) => {
  return (
    <div
      className={`${styles['canvas-component']} ${isSelected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        height: component.height,
        backgroundColor: component.color + '20',
        borderColor: component.color,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component);
      }}
      onMouseDown={(e) => onMouseDown(e, component)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles['component-header']} style={{ backgroundColor: component.color }}>
        <span>{component.icon}</span>
        <span>{component.name}</span>
        <div className={styles['component-actions']}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConnectionToggle(component.id);
            }}
          >
            🔗
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(component.id);
            }}
          >
            ⧉
          </button>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div className={styles['component-body']}>
        <div className={styles['component-type']}>{component.subtype}</div>
      </div>
      {isSelected && (
        <>
          <div
            className={`${styles['resize-handle']} ${styles['handle-nw']}`}
            onMouseDown={(e) => onResizeMouseDown(e, component, 'nw')}
          />
          <div
            className={`${styles['resize-handle']} ${styles['handle-ne']}`}
            onMouseDown={(e) => onResizeMouseDown(e, component, 'ne')}
          />
          <div
            className={`${styles['resize-handle']} ${styles['handle-sw']}`}
            onMouseDown={(e) => onResizeMouseDown(e, component, 'sw')}
          />
          <div
            className={`${styles['resize-handle']} ${styles['handle-se']}`}
            onMouseDown={(e) => onResizeMouseDown(e, component, 'se')}
          />
          <div className={styles['size-indicator']}>
            {Math.round(component.width)} × {Math.round(component.height)}
          </div>
        </>
      )}
    </div>
  );
};
