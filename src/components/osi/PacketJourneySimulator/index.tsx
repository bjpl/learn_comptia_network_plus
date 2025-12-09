import React, { useState } from 'react';
import type { OSILayerNumber } from '../osi-types';
import type { PacketJourneySimulatorProps } from './types';
import { usePacketAnimation } from './hooks/usePacketAnimation';
import {
  AnimationControls,
  StatusDisplay,
  DevicePanel,
  PacketVisualization,
  InspectionPanel,
  LayerLegend,
} from './components';

export const PacketJourneySimulator: React.FC<PacketJourneySimulatorProps> = ({ onComplete }) => {
  const [inspectedLayer, setInspectedLayer] = useState<OSILayerNumber | null>(null);

  const {
    animationState,
    packetState,
    togglePlayPause,
    resetAnimation,
    changeSpeed,
    changeProtocol,
  } = usePacketAnimation({ onComplete });

  return (
    <div
      className="packet-journey-simulator"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
      <div className="header" style={{ marginBottom: '20px' }}>
        <h2>Packet Journey Simulator</h2>
        <AnimationControls
          animationState={animationState}
          onTogglePlayPause={togglePlayPause}
          onReset={resetAnimation}
          onChangeSpeed={changeSpeed}
          onChangeProtocol={changeProtocol}
        />
        <StatusDisplay animationState={animationState} packetState={packetState} />
      </div>

      <div
        className="visualization-panels"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '20px',
          marginTop: '30px',
        }}
      >
        <DevicePanel type="source" packetState={packetState} />
        <PacketVisualization
          packetState={packetState}
          animationState={animationState}
          inspectedLayer={inspectedLayer}
          onLayerClick={setInspectedLayer}
        />
        <DevicePanel type="destination" packetState={packetState} />
      </div>

      {inspectedLayer !== null && (
        <InspectionPanel
          inspectedLayer={inspectedLayer}
          packetState={packetState}
          onClose={() => setInspectedLayer(null)}
        />
      )}

      <LayerLegend />
    </div>
  );
};

export default PacketJourneySimulator;
