import { useEffect } from 'react';
import { clearCanvas, drawLabel } from '../utils/canvasHelpers';
import type { EyeDiagramMetrics } from '../types';

export function useEyeDiagram(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  eyeMetrics: EyeDiagramMetrics,
  showEyeDiagram: boolean
): void {
  useEffect(() => {
    if (!showEyeDiagram) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    clearCanvas(ctx, width, height);

    // Draw grid - center lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Calculate eye opening
    const eyeHeightPx = (eyeMetrics.eyeHeight / 100) * (height * 0.6);
    const eyeWidthPx = (eyeMetrics.eyeWidth / 100) * (width * 0.6);
    const jitterPx = eyeMetrics.jitter * 2;

    // Draw multiple signal traces to create eye pattern
    const numTraces = 20;
    const alpha = Math.min(0.3, 0.8 / numTraces);

    for (let i = 0; i < numTraces; i++) {
      const phase = (i / numTraces) * Math.PI * 2;
      const jitterOffset = Math.sin(phase) * jitterPx;

      // Rising edge
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const x1 = width / 2 - eyeWidthPx / 2 + jitterOffset;
      const x2 = width / 2 + jitterOffset;
      const y1 = height / 2 + eyeHeightPx / 2;
      const y2 = height / 2 - eyeHeightPx / 2;

      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(x1 + (x2 - x1) * 0.5, y1, x2, y2);
      ctx.stroke();

      // Falling edge
      const x3 = width / 2 + jitterOffset;
      const x4 = width / 2 + eyeWidthPx / 2 + jitterOffset;

      ctx.moveTo(x3, y2);
      ctx.quadraticCurveTo(x3 + (x4 - x3) * 0.5, y2, x4, y1);
      ctx.stroke();
    }

    // Draw eye opening measurement lines
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Height measurement
    ctx.beginPath();
    ctx.moveTo(width - 30, height / 2 - eyeHeightPx / 2);
    ctx.lineTo(width - 30, height / 2 + eyeHeightPx / 2);
    ctx.stroke();

    // Width measurement
    ctx.beginPath();
    ctx.moveTo(width / 2 - eyeWidthPx / 2, 20);
    ctx.lineTo(width / 2 + eyeWidthPx / 2, 20);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw labels
    drawLabel(ctx, 'Eye Diagram', width / 2, 15, { bold: true });

    ctx.font = '10px monospace';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'right';
    ctx.fillText(`Height: ${eyeMetrics.eyeHeight.toFixed(1)}%`, width - 35, height / 2);
    ctx.fillText(`Width: ${eyeMetrics.eyeWidth.toFixed(1)}%`, width / 2, 35);

    // Quality indicator
    const qualityColor = {
      excellent: '#22c55e',
      good: '#3b82f6',
      marginal: '#f59e0b',
      poor: '#ef4444',
    }[eyeMetrics.quality];

    ctx.fillStyle = qualityColor;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Quality: ${eyeMetrics.quality.toUpperCase()}`, 10, height - 10);
  }, [canvasRef, eyeMetrics, showEyeDiagram]);
}
