import { useEffect } from 'react';
import type { CableType } from '../../signal-data';
import {
  clearCanvas,
  drawLabel,
  drawDashedLine,
  getDistanceGridConfig,
  getFrequencyGridConfig,
} from '../utils/canvasHelpers';

export function useBandwidthVisualization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  selectedCable: CableType,
  distance: number,
  frequency: number
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

    // Horizontal grid (frequency/bandwidth)
    const { maxValue: maxFreq, step: freqStep, unit: freqUnit } = getFrequencyGridConfig(
      selectedCable.category
    );

    for (let f = 0; f <= maxFreq; f += freqStep) {
      const y = height - 20 - (f / maxFreq) * (height - 40);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${f} ${freqUnit}`, 45, y + 3);
    }

    // Vertical grid (distance)
    const { maxValue: maxDist, step: distStep } = getDistanceGridConfig(selectedCable.category);

    for (let d = 0; d <= maxDist; d += distStep) {
      const x = 50 + (d / maxDist) * (width - 70);
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${d}m`, x, height - 5);
    }

    // Draw frequency response curves
    selectedCable.attenuation.forEach((point, idx) => {
      const y = height - 20 - (point.frequency / maxFreq) * (height - 40);
      const x = 50 + (distance / maxDist) * (width - 70);

      ctx.fillStyle = selectedCable.color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (idx < selectedCable.attenuation.length - 1) {
        const nextPoint = selectedCable.attenuation[idx + 1];
        const y2 = height - 20 - (nextPoint.frequency / maxFreq) * (height - 40);

        ctx.strokeStyle = selectedCable.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }
    });

    // Current frequency marker
    const currentFreqY = height - 20 - (frequency / maxFreq) * (height - 40);
    drawDashedLine(ctx, 50, currentFreqY, width - 20, currentFreqY, '#fbbf24');

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Current: ${frequency} ${freqUnit}`, width - 150, currentFreqY - 5);

    // Title
    drawLabel(ctx, 'Frequency Response', width / 2, 15, { bold: true });
  }, [canvasRef, selectedCable, distance, frequency]);
}
