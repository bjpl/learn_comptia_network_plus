/**
 * Builder Canvas Component
 * Interactive canvas for topology creation
 */

import React, { useRef, useCallback } from 'react';
import type { BuilderDevice, BuilderConnection, ValidationIssue } from './types';
import { deviceSpecs } from './constants';

interface BuilderCanvasProps {
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  selectedDevice: string | null;
  dragging: string | null;
  connecting: string | null;
  validationIssues: ValidationIssue[];
  showCost: boolean;
  onMouseDown: (deviceId: string, e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onStartConnection: (deviceId: string) => void;
  onDeleteDevice: (deviceId: string) => void;
  onDeleteConnection: (connId: string) => void;
  onDevicePositionChange: (devices: BuilderDevice[]) => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = React.memo(
  ({
    devices,
    connections,
    selectedDevice,
    dragging,
    connecting,
    validationIssues,
    showCost,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onStartConnection,
    onDeleteDevice,
    onDeleteConnection,
  }) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={canvasRef}
        className="topology-canvas"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Draw connections */}
        <svg className="connections-layer">
          {connections.map((conn) => {
            const source = devices.find((d) => d.id === conn.sourceId);
            const target = devices.find((d) => d.id === conn.targetId);
            if (!source || !target) return null;

            const x1 = source.position.x + 40;
            const y1 = source.position.y + 40;
            const x2 = target.position.x + 40;
            const y2 = target.position.y + 40;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={`connection connection-${conn.type}`}
                  strokeWidth="2"
                  onClick={() => onDeleteConnection(conn.id)}
                  style={{ cursor: 'pointer' }}
                />
                {showCost && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2}
                    className="connection-label"
                    textAnchor="middle"
                  >
                    ${conn.cost}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw temporary connection line */}
          {connecting && (
            <line
              x1={(devices.find((d) => d.id === connecting)?.position.x ?? 0) + 40}
              y1={(devices.find((d) => d.id === connecting)?.position.y ?? 0) + 40}
              x2={(devices.find((d) => d.id === connecting)?.position.x ?? 0) + 40}
              y2={(devices.find((d) => d.id === connecting)?.position.y ?? 0) + 40}
              className="connection-temp"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Draw devices */}
        {devices.map((device) => {
          const hasIssue = validationIssues.some((i) => i.deviceId === device.id);
          return (
            <div
              key={device.id}
              className={`canvas-device ${selectedDevice === device.id ? 'selected' : ''} ${hasIssue ? 'has-issue' : ''}`}
              style={{
                left: device.position.x,
                top: device.position.y,
                cursor: dragging === device.id ? 'grabbing' : 'grab',
              }}
              onMouseDown={(e) => onMouseDown(device.id, e)}
            >
              <div className="device-icon-large">{deviceSpecs[device.type].icon}</div>
              <div className="device-info">
                <div className="device-name">{device.label}</div>
                {showCost && <div className="device-cost-badge">${device.cost}</div>}
              </div>
              <div className="device-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartConnection(device.id);
                  }}
                  className={`btn-connect ${connecting === device.id ? 'active' : ''}`}
                  title="Connect"
                >
                  🔗
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDevice(device.id);
                  }}
                  className="btn-delete"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {devices.length === 0 && (
          <div className="canvas-empty">
            <div className="empty-icon">🏗️</div>
            <h3>Start Building</h3>
            <p>Add devices from the palette to begin designing your network topology</p>
          </div>
        )}
      </div>
    );
  }
);

BuilderCanvas.displayName = 'BuilderCanvas';
