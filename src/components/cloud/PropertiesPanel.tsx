/**
 * PropertiesPanel - Component property editor for Cloud Architecture Designer
 */

import React from 'react';
import { componentLibrary } from './cloud-data';
import type { ArchitectureComponent } from './cloud-types';

interface PropertiesPanelProps {
  selectedComponent: ArchitectureComponent;
  onPropertyChange: (key: string, value: string | number | boolean) => void;
  onNameChange: (name: string) => void;
  onCreateConnection: (fromId: string, toId: string) => void;
  availableTargets: ArchitectureComponent[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  onPropertyChange,
  onNameChange,
  onCreateConnection,
  availableTargets,
}) => {
  const libraryItem = componentLibrary.find(
    (item) => item.type === selectedComponent.type && item.subtype === selectedComponent.subtype
  );

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <div className="property-item">
        <label htmlFor="component-name">Name:</label>
        <input
          id="component-name"
          type="text"
          value={selectedComponent.name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      {libraryItem?.properties.map((prop) => (
        <div key={prop.key} className="property-item">
          <label>{prop.label}:</label>
          {prop.type === 'select' ? (
            <select
              value={String(selectedComponent.properties[prop.key] || '')}
              onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            >
              <option value="">Select...</option>
              {prop.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : prop.type === 'boolean' ? (
            <input
              type="checkbox"
              checked={Boolean(selectedComponent.properties[prop.key])}
              onChange={(e) => onPropertyChange(prop.key, e.target.checked)}
            />
          ) : prop.type === 'number' ? (
            <input
              type="number"
              value={Number(selectedComponent.properties[prop.key] || 0)}
              onChange={(e) => onPropertyChange(prop.key, parseInt(e.target.value))}
            />
          ) : (
            <input
              type="text"
              value={String(selectedComponent.properties[prop.key] || '')}
              onChange={(e) => onPropertyChange(prop.key, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="connection-section">
        <h4>Create Connection</h4>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onCreateConnection(selectedComponent.id, e.target.value);
              e.target.value = '';
            }
          }}
        >
          <option value="">Connect to...</option>
          {availableTargets.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PropertiesPanel;
