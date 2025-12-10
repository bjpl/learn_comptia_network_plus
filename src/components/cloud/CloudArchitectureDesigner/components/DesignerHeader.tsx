/**
 * Designer header component with title, controls, and toolbar
 */

import React from 'react';
import styles from '../../CloudArchitectureDesigner.module.css';

interface DesignerHeaderProps {
  designName: string;
  componentCount: number;
  connectionCount: number;
  showLibrary: boolean;
  showServiceComparison: boolean;
  showSecurityPanel: boolean;
  showElasticityVisualization: boolean;
  snapToGrid: boolean;
  onDesignNameChange: (name: string) => void;
  onToggleLibrary: () => void;
  onToggleServiceComparison: () => void;
  onToggleSecurityPanel: () => void;
  onToggleElasticity: () => void;
  onValidate: () => void;
  onExport: () => void;
  onToggleSnapToGrid: (enabled: boolean) => void;
}

export const DesignerHeader: React.FC<DesignerHeaderProps> = ({
  designName,
  componentCount,
  connectionCount,
  showLibrary,
  showServiceComparison,
  showSecurityPanel,
  showElasticityVisualization,
  snapToGrid,
  onDesignNameChange,
  onToggleLibrary,
  onToggleServiceComparison,
  onToggleSecurityPanel,
  onToggleElasticity,
  onValidate,
  onExport,
  onToggleSnapToGrid,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles['title-section']}>
        <div className={styles['title-wrapper']}>
          <h2>Cloud Architecture Designer</h2>
          <p className={styles.subtitle}>Design and validate cloud infrastructure architectures</p>
        </div>
        <div className={styles['design-name-wrapper']}>
          <input
            type="text"
            className={styles['design-name']}
            value={designName}
            onChange={(e) => onDesignNameChange(e.target.value)}
            placeholder="Architecture name"
          />
          <div className={styles.metadata}>
            <span>
              {componentCount} component{componentCount !== 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span>
              {connectionCount} connection{connectionCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles['button-group']}>
          <button
            className={`${styles['toolbar-btn']} ${showLibrary ? styles.active : ''}`}
            onClick={onToggleLibrary}
          >
            <span>📚</span> {showLibrary ? 'Hide' : 'Show'} Library
          </button>
          <button
            className={`${styles['toolbar-btn']} ${styles.secondary} ${showServiceComparison ? styles.active : ''}`}
            onClick={onToggleServiceComparison}
          >
            <span>☁️</span> Service Models
          </button>
          <button
            className={`${styles['toolbar-btn']} ${styles.secondary} ${showSecurityPanel ? styles.active : ''}`}
            onClick={onToggleSecurityPanel}
          >
            <span>🔒</span> Security
          </button>
          <button
            className={`${styles['toolbar-btn']} ${styles.secondary} ${showElasticityVisualization ? styles.active : ''}`}
            onClick={onToggleElasticity}
          >
            <span>⚡</span> Elasticity
          </button>
        </div>
        <div className={`${styles['button-group']} ${styles.actions}`}>
          <button className={`${styles['toolbar-btn']} ${styles.accent}`} onClick={onValidate}>
            <span>✓</span> Validate
          </button>
          <button className={`${styles['toolbar-btn']} ${styles.secondary}`} onClick={onExport}>
            <span>↓</span> Export
          </button>
        </div>
        <label className={styles['snap-toggle']}>
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => onToggleSnapToGrid(e.target.checked)}
          />
          <span>Snap to Grid</span>
        </label>
      </div>
    </div>
  );
};
