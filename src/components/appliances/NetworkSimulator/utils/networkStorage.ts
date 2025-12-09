import type { SimulatedDevice, NetworkConnection, SavedNetwork } from '../types';

export function saveNetworkToFile(
  devices: SimulatedDevice[],
  connections: NetworkConnection[]
): void {
  const data = {
    devices,
    connections,
    timestamp: new Date().toISOString(),
  };

  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
  );
  element.setAttribute('download', `network-design-${Date.now()}.json`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function createSavedNetwork(
  name: string,
  devices: SimulatedDevice[],
  connections: NetworkConnection[]
): SavedNetwork {
  return {
    id: `save-${Date.now()}`,
    name,
    timestamp: Date.now(),
    devices: JSON.parse(JSON.stringify(devices)),
    connections: JSON.parse(JSON.stringify(connections)),
  };
}
