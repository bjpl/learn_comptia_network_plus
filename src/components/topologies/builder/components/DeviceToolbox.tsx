/**
 * Device Toolbox Component
 * Device palette with drag-and-drop support
 */

import React from 'react';
import type { DeviceType } from '../types';
import { deviceSpecs, connectionCosts } from '../constants';

interface DeviceToolboxProps {
  onAddDevice: (type: DeviceType) => void;
  showCost: boolean;
  showValidation: boolean;
  showHints: boolean;
  onToggleCost: (show: boolean) => void;
  onToggleValidation: (show: boolean) => void;
  onToggleHints: (show: boolean) => void;
}

export const DeviceToolbox: React.FC<DeviceToolboxProps> = React.memo(
  ({
    onAddDevice,
    showCost,
    showValidation,
    showHints,
    onToggleCost,
    onToggleValidation,
    onToggleHints,
  }) => {
    return (
      <div className="device-palette">
        <h3>Devices</h3>
        <div className="palette-grid">
          {(Object.keys(deviceSpecs) as DeviceType[]).map((type) => (
            <button
              key={type}
              onClick={() => onAddDevice(type)}
              className="palette-item"
              title={`${deviceSpecs[type].label} - $${deviceSpecs[type].cost}`}
            >
              <span className="device-icon">{deviceSpecs[type].icon}</span>
              <span className="device-label">{deviceSpecs[type].label}</span>
              <span className="device-cost">${deviceSpecs[type].cost}</span>
            </button>
          ))}
        </div>

        <h3 style={{ marginTop: '2rem' }}>Connection</h3>
        <div className="connection-types">
          <div className="connection-type">
            <strong>Ethernet:</strong> ${connectionCosts.ethernet}/m
          </div>
          <div className="connection-type">
            <strong>Fiber:</strong> ${connectionCosts.fiber}/m
          </div>
          <div className="connection-type">
            <strong>Wireless:</strong> ${connectionCosts.wireless}/setup
          </div>
        </div>

        <div className="palette-options">
          <label>
            <input type="checkbox" checked={showCost} onChange={(e) => onToggleCost(e.target.checked)} />
            Show Costs
          </label>
          <label>
            <input
              type="checkbox"
              checked={showValidation}
              onChange={(e) => onToggleValidation(e.target.checked)}
            />
            Show Validation
          </label>
          <label>
            <input
              type="checkbox"
              checked={showHints}
              onChange={(e) => onToggleHints(e.target.checked)}
            />
            Show Hints
          </label>
        </div>
      </div>
    );
  }
);

DeviceToolbox.displayName = 'DeviceToolbox';
