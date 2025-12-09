import { useState } from 'react';
import type { SimulatedDevice, NetworkConnection, SavedNetwork } from '../types';
import { createSavedNetwork } from '../utils/networkStorage';

export function useNetworkStorage(
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>,
  setConnections: React.Dispatch<React.SetStateAction<NetworkConnection[]>>,
  resetSimulation: () => void
) {
  const [savedNetworks, setSavedNetworks] = useState<SavedNetwork[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const saveNetworkDesign = (
    name: string,
    devices: SimulatedDevice[],
    connections: NetworkConnection[]
  ) => {
    const newSave = createSavedNetwork(name, devices, connections);
    setSavedNetworks([...savedNetworks, newSave]);
    setShowSaveDialog(false);
  };

  const loadNetworkDesign = (saveId: string) => {
    const saved = savedNetworks.find((s) => s.id === saveId);
    if (saved) {
      setDevices(JSON.parse(JSON.stringify(saved.devices)));
      setConnections(JSON.parse(JSON.stringify(saved.connections)));
      resetSimulation();
    }
  };

  const deleteNetworkDesign = (saveId: string) => {
    setSavedNetworks(savedNetworks.filter((s) => s.id !== saveId));
  };

  return {
    savedNetworks,
    showSaveDialog,
    setShowSaveDialog,
    saveNetworkDesign,
    loadNetworkDesign,
    deleteNetworkDesign,
  };
}
