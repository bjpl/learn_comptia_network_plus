import React from 'react';

interface VisualizationCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  title: string;
  description: string;
  width?: number;
  height?: number;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  canvasRef,
  title,
  description,
  width = 600,
  height = 400,
}) => {
  return (
    <div className="rounded-lg border border-blue-500/30 bg-slate-800 p-4 shadow-xl">
      <canvas ref={canvasRef} width={width} height={height} className="w-full" />
      <div className="mt-4 text-sm text-gray-300">
        <p className="mb-2">
          <strong className="text-blue-300">{title}:</strong> {description}
        </p>
      </div>
    </div>
  );
};
