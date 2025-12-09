/**
 * Canvas zoom and history controls
 */

import React from 'react';
import styles from '../CloudArchitectureDesigner.module.css';

interface CanvasControlsProps {
  zoom: number;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
}) => {
  return (
    <div className={styles['canvas-controls']}>
      <div className={styles['zoom-controls']}>
        <button onClick={onZoomIn}>+</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomOut}>-</button>
      </div>
      <div className={styles['history-controls']}>
        <button onClick={onUndo} disabled={!canUndo}>↶</button>
        <button onClick={onRedo} disabled={!canRedo}>↷</button>
      </div>
    </div>
  );
};
