export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(0, 0, width, height);
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  type: 'horizontal' | 'vertical' | 'both' = 'both'
): void {
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;

  if (type === 'horizontal' || type === 'both') {
    // Draw horizontal grid lines
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
  }

  if (type === 'vertical' || type === 'both') {
    // This is handled per-visualization due to different scales
  }
}

export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options?: {
    color?: string;
    font?: string;
    align?: CanvasTextAlign;
    bold?: boolean;
  }
): void {
  ctx.fillStyle = options?.color || '#f3f4f6';
  ctx.font = options?.font || (options?.bold ? 'bold 12px sans-serif' : '12px sans-serif');
  ctx.textAlign = options?.align || 'center';
  ctx.fillText(text, x, y);
}

export function drawDashedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  lineWidth = 2,
  dash: number[] = [5, 5]
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function drawMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  radius = 6
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export interface GridConfig {
  maxValue: number;
  step: number;
  unit: string;
}

export function getDistanceGridConfig(category: 'copper' | 'fiber'): GridConfig {
  return {
    maxValue: category === 'copper' ? 100 : 1000,
    step: category === 'copper' ? 20 : 200,
    unit: 'm',
  };
}

export function getFrequencyGridConfig(category: 'copper' | 'fiber'): GridConfig {
  return {
    maxValue: category === 'copper' ? 600 : 2000,
    step: category === 'copper' ? 100 : 500,
    unit: category === 'copper' ? 'MHz' : 'nm',
  };
}
