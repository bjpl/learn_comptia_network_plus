/**
 * SVG layer for rendering connections between components
 */

import React from 'react';
import type { Connection, ArchitectureComponent } from '../types';
import styles from '../CloudArchitectureDesigner.module.css';

interface ConnectionsLayerProps {
  connections: Connection[];
  components: ArchitectureComponent[];
  connectionState: {
    isConnecting: boolean;
    fromId: string | null;
    cursorX: number;
    cursorY: number;
  };
}

export const ConnectionsLayer = React.forwardRef<SVGSVGElement, ConnectionsLayerProps>(
  ({ connections, components, connectionState }, ref) => {
    return (
      <svg ref={ref} className={styles['connections-layer']}>
        {connections.map((conn) => {
          const from = components.find((c) => c.id === conn.from);
          const to = components.find((c) => c.id === conn.to);
          if (!from || !to) return null;

          const x1 = from.x + from.width / 2;
          const y1 = from.y + from.height / 2;
          const x2 = to.x + to.width / 2;
          const y2 = to.y + to.height / 2;
          const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          const offset = Math.min(dist * 0.4, 100);
          const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;

          return (
            <g key={conn.id}>
              <path
                d={path}
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <text
                x={(x1 + x2) / 2}
                y={(y1 + y2) / 2 - 10}
                fill="#374151"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {conn.label}
              </text>
            </g>
          );
        })}
        {connectionState.isConnecting && connectionState.fromId && (() => {
          const from = components.find((c) => c.id === connectionState.fromId);
          if (!from) return null;
          const x1 = from.x + from.width / 2;
          const y1 = from.y + from.height / 2;
          const dist = Math.sqrt((connectionState.cursorX - x1) ** 2 + (connectionState.cursorY - y1) ** 2);
          const offset = Math.min(dist * 0.4, 100);
          const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${connectionState.cursorX - offset} ${connectionState.cursorY}, ${connectionState.cursorX} ${connectionState.cursorY}`;
          return (
            <path
              d={path}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              opacity="0.6"
            />
          );
        })()}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    );
  }
);

ConnectionsLayer.displayName = 'ConnectionsLayer';
