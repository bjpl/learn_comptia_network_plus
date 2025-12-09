import { useCallback } from 'react';
import type { SimulatedDevice } from '../types';

export function useKeyboardNavigation(
  selectedDevice: string | null,
  devices: SimulatedDevice[],
  setSelectedDevice: React.Dispatch<React.SetStateAction<string | null>>,
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>,
  openDeviceConfig: (deviceId: string) => void,
  removeDevice: (deviceId: string) => void
) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedDevice) {
        // Tab to cycle through devices
        if (e.key === 'Tab' && devices.length > 0) {
          e.preventDefault();
          const currentIndex = devices.findIndex((d) => d.id === selectedDevice);
          const nextIndex = (currentIndex + 1) % devices.length;
          setSelectedDevice(devices[nextIndex].id);
        }
        return;
      }

      const selectedDev = devices.find((d) => d.id === selectedDevice);
      if (!selectedDev) {
        return;
      }

      // Arrow keys to move selected device
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let newX = selectedDev.position.x;
        let newY = selectedDev.position.y;

        if (e.key === 'ArrowLeft') {
          newX -= step;
        } else if (e.key === 'ArrowRight') {
          newX += step;
        } else if (e.key === 'ArrowUp') {
          newY -= step;
        } else if (e.key === 'ArrowDown') {
          newY += step;
        }

        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === selectedDevice
              ? {
                  ...device,
                  position: {
                    x: Math.max(0, Math.min(newX, 720)),
                    y: Math.max(0, Math.min(newY, 420)),
                  },
                }
              : device
          )
        );
      }

      // Tab to cycle through devices
      if (e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = devices.findIndex((d) => d.id === selectedDevice);
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + devices.length) % devices.length
          : (currentIndex + 1) % devices.length;
        setSelectedDevice(devices[nextIndex].id);
      }

      // Enter to configure device
      if (e.key === 'Enter') {
        e.preventDefault();
        openDeviceConfig(selectedDevice);
      }

      // Delete to remove device
      if (e.key === 'Delete') {
        e.preventDefault();
        removeDevice(selectedDevice);
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedDevice(null);
      }
    },
    [selectedDevice, devices, setSelectedDevice, setDevices, openDeviceConfig, removeDevice]
  );

  return { handleKeyDown };
}
