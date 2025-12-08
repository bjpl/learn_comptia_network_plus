/**
 * Property Panel Component
 * Shows properties of selected device
 */

import React from 'react';
import type { BuilderDevice } from '../types';
import { deviceSpecs } from '../constants';

interface PropertyPanelProps {
  selectedDevice: BuilderDevice | null;
  onUpdateLabel?: (deviceId: string, label: string) => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedDevice,
  onUpdateLabel
}) => {
  if (!selectedDevice) {
    return null;
  }

  const spec = deviceSpecs[selectedDevice.type];

  return (
    <div className="property-panel">
      <h3>Device Properties</h3>
      <div className="property-group">
        <label>Type</label>
        <div className="property-value">
          <span className="device-icon">{spec.icon}</span>
          {spec.label}
        </div>
      </div>
      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={selectedDevice.label}
          onChange={(e) => onUpdateLabel?.(selectedDevice.id, e.target.value)}
          className="property-input"
        />
      </div>
      <div className="property-group">
        <label>Cost</label>
        <div className="property-value">${selectedDevice.cost}</div>
      </div>
      <div className="property-group">
        <label>Position</label>
        <div className="property-value">
          X: {Math.round(selectedDevice.position.x)}, Y: {Math.round(selectedDevice.position.y)}
        </div>
      </div>
    </div>
  );
};

PropertyPanel.displayName = 'PropertyPanel';
