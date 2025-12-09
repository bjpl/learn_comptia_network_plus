/**
 * Canvas drawing utility functions
 */

import type { Node } from '../types';

export const drawNetworkConnections = (
  ctx: CanvasRenderingContext2D,
  nodes: Node[]
): void => {
  ctx.strokeStyle = '#dfe6e9';
  ctx.lineWidth = 2;
  nodes.forEach((node, i) => {
    nodes.forEach((otherNode, j) => {
      if (i < j) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(otherNode.x, otherNode.y);
        ctx.stroke();
      }
    });
  });
};

export const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: Node,
  isSource: boolean,
  isDestination: boolean
): void => {
  // Node circle
  ctx.fillStyle = isSource ? '#e74c3c' : isDestination ? '#2ecc71' : '#3498db';
  ctx.beginPath();
  ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
  ctx.fill();

  // Node border
  ctx.strokeStyle = isSource || isDestination ? '#f39c12' : '#2c3e50';
  ctx.lineWidth = isSource || isDestination ? 4 : 2;
  ctx.stroke();

  // Node label
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.id.toString(), node.x, node.y);

  // Role label
  if (isSource || isDestination) {
    ctx.fillStyle = '#2c3e50';
    ctx.font = '11px Arial';
    ctx.fillText(isSource ? 'Source' : 'Dest', node.x, node.y + 40);
  }
};

export const drawPacket = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
): void => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
};
