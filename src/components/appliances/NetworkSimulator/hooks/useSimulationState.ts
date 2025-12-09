import { useState, useEffect } from 'react';
import type {
  SimulationState,
  SimulatedDevice,
  NetworkConnection,
  TrafficFlow,
  SimulationAlert,
} from '../types';
import { findPath } from '../utils/pathfinding';

export function useSimulationState(
  devices: SimulatedDevice[],
  connections: NetworkConnection[],
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>
) {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    time: 0,
    trafficFlows: [],
    alerts: [],
  });

  const toggleSimulation = () => {
    setSimulationState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const resetSimulation = () => {
    setSimulationState({
      isRunning: false,
      time: 0,
      trafficFlows: [],
      alerts: [],
    });

    setDevices((prevDevices) =>
      prevDevices.map((device) => ({
        ...device,
        currentLoad: 0,
        status: 'active',
      }))
    );
  };

  useEffect(() => {
    if (!simulationState.isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setSimulationState((prev) => {
        const newTime = prev.time + 1;
        const newFlows: TrafficFlow[] = [];
        const newAlerts: SimulationAlert[] = [...prev.alerts];

        // Generate random traffic
        if (devices.length > 1 && Math.random() > 0.5) {
          const sourceDevice = devices[Math.floor(Math.random() * devices.length)];
          const targetDevice = devices.filter((d) => d.id !== sourceDevice.id)[
            Math.floor(Math.random() * (devices.length - 1))
          ];

          if (targetDevice) {
            const flowPath = findPath(sourceDevice.id, targetDevice.id, connections, devices);

            if (flowPath.length > 0) {
              newFlows.push({
                id: `flow-${Date.now()}`,
                sourceDeviceId: sourceDevice.id,
                targetDeviceId: targetDevice.id,
                connectionIds: flowPath,
                protocol: ['HTTP', 'SSH', 'FTP', 'DNS'][Math.floor(Math.random() * 4)],
                bandwidth: Math.random() * 100,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                animated: true,
              });
            }
          }
        }

        // Update device loads
        setDevices((prevDevices) =>
          prevDevices.map((device) => {
            const deviceFlows = newFlows.filter(
              (flow) => flow.sourceDeviceId === device.id || flow.targetDeviceId === device.id
            );

            const load = Math.min(
              100,
              (device.currentLoad || 0) +
                deviceFlows.reduce((sum, flow) => sum + flow.bandwidth / 10, 0)
            );

            let status: SimulatedDevice['status'] = 'active';
            if (load > 90) {
              status = 'error';
              newAlerts.push({
                id: `alert-${Date.now()}`,
                severity: 'critical',
                message: `${device.name} is overloaded (${load.toFixed(0)}%)`,
                deviceId: device.id,
                timestamp: newTime,
              });
            } else if (load > 70) {
              status = 'warning';
            }

            return {
              ...device,
              currentLoad: load * 0.95, // Decay load over time
              status,
            };
          })
        );

        // Keep only recent alerts
        const recentAlerts = newAlerts.filter((alert) => newTime - alert.timestamp < 10);

        return {
          ...prev,
          time: newTime,
          trafficFlows: newFlows,
          alerts: recentAlerts.slice(-5),
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [simulationState.isRunning, devices, connections, setDevices]);

  return {
    simulationState,
    toggleSimulation,
    resetSimulation,
  };
}
