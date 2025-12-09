import { useEffect } from 'react';
import type { CableType } from '../../signal-data';
import { calculateAttenuation } from '../../signal-data';
import {
  clearCanvas,
  drawDashedLine,
  drawMarker,
  drawLabel,
  getDistanceGridConfig,
} from '../utils/canvasHelpers';
import { INITIAL_SIGNAL_STRENGTH } from '../utils/signalCalculations';

export function useSignalVisualization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  selectedCable: CableType,
  distance: number,
  frequency: number,
  interferenceLevel: number,
  compareMode: boolean,
  selectedCompareCable: CableType,
  receivedSignal: number
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    clearCanvas(ctx, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Horizontal grid lines (dB levels)
    for (let db = -100; db <= 0; db += 10) {
      const y = ((db + 100) / 100) * (height - 40) + 20;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${db} dB`, 45, y + 3);
    }

    // Vertical grid lines (distance)
    const { maxValue: maxDist, step } = getDistanceGridConfig(selectedCable.category);
    for (let d = 0; d <= maxDist; d += step) {
      const x = (d / maxDist) * (width - 70) + 50;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d}m`, x, height - 5);
    }

    // Draw signal degradation curve
    ctx.strokeStyle = selectedCable.color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let d = 0; d <= maxDist; d += 1) {
      const x = (d / maxDist) * (width - 70) + 50;
      const atten = calculateAttenuation(selectedCable, frequency, d);
      const signal = INITIAL_SIGNAL_STRENGTH - atten;
      const y = ((signal + 100) / 100) * (height - 40) + 20;

      if (d === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw comparison cable if enabled
    if (compareMode) {
      ctx.strokeStyle = selectedCompareCable.color;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      for (let d = 0; d <= maxDist; d += 1) {
        const x = (d / maxDist) * (width - 70) + 50;
        const atten = calculateAttenuation(selectedCompareCable, frequency, d);
        const signal = INITIAL_SIGNAL_STRENGTH - atten;
        const y = ((signal + 100) / 100) * (height - 40) + 20;

        if (d === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw current position marker
    const currentX = (distance / maxDist) * (width - 70) + 50;
    const currentY = ((receivedSignal + 100) / 100) * (height - 40) + 20;
    drawMarker(ctx, currentX, currentY, selectedCable.color);

    // Draw interference level
    if (interferenceLevel > 0) {
      const noiseY = ((-interferenceLevel + 100) / 100) * (height - 40) + 20;
      drawDashedLine(ctx, 50, noiseY, width - 20, noiseY, '#ef4444', 2, [3, 3]);

      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Noise Floor', width - 130, noiseY - 5);
    }

    // Draw title
    drawLabel(ctx, 'Signal Strength Over Distance', width / 2, 15, {
      bold: true,
      align: 'center',
    });
  }, [
    canvasRef,
    selectedCable,
    distance,
    frequency,
    interferenceLevel,
    compareMode,
    selectedCompareCable,
    receivedSignal,
  ]);
}
