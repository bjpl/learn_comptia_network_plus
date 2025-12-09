/**
 * Network selector component
 */

import React from 'react';
import type { VirtualNetwork } from '../../protocols-types';

interface NetworkSelectorProps {
  selectedNetwork: VirtualNetwork;
  networks: VirtualNetwork[];
  onNetworkChange: (network: VirtualNetwork) => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  networks,
  onNetworkChange,
}) => {
  return (
    <div className="network-selector">
      <label htmlFor="network-selector">Target Network:</label>
      <select
        id="network-selector"
        value={selectedNetwork.id}
        onChange={(e) => {
          const network = networks.find((n) => n.id === e.target.value);
          if (network) {
            onNetworkChange(network);
          }
        }}
      >
        {networks.map((net) => (
          <option key={net.id} value={net.id}>
            {net.name} ({net.difficulty})
          </option>
        ))}
      </select>

      <div className={`difficulty-badge ${selectedNetwork.difficulty}`}>
        {selectedNetwork.difficulty.toUpperCase()}
      </div>
    </div>
  );
};
