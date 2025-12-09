import { useState, useCallback, useRef } from 'react';
import type { SimulatedDevice } from '../types';

export function useDeviceDragging(
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>,
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | null>>,
  connecting: string | null
) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleMouseDown = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connecting) {
      return;
    }

    setDragging(deviceId);
    setSelectedDevice(deviceId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === dragging
            ? {
                ...device,
                position: {
                  x: Math.max(0, Math.min(x, rect.width - 80)),
                  y: Math.max(0, Math.min(y, rect.height - 80)),
                },
              }
            : device
        )
      );
    },
    [dragging, setDevices]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  return {
    canvasRef,
    dragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
