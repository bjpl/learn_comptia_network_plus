import React, { useState, useMemo } from 'react';
import type { ViewMode, PacketJourneySimulatorProps } from './types';
import { useJourneyState } from './hooks/useJourneyState';
import { usePacketAnimation } from './hooks/usePacketAnimation';
import { calculateFragmentation } from './utils/packetCalculations';
import { AnimationControls } from './components/AnimationControls';
import { JourneyVisualization } from './components/JourneyVisualization';
import { LayerDetails } from './components/LayerDetails';
import { PacketBuilder } from './components/PacketBuilder';
import { EncapsulationView } from './components/EncapsulationView';
import { TCPFlagsView } from './components/TCPFlagsView';
import { MTUView } from './components/MTUView';
import { HexDumpView } from './components/HexDumpView';
import { LayerLegend } from './components/LayerLegend';
import { ENCAPSULATION_EXAMPLE } from '../osi-data';

export const PacketJourneySimulator: React.FC<PacketJourneySimulatorProps> = ({ onComplete }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('journey');

  const {
    selectedProtocol,
    setSelectedProtocol,
    selectedMTU,
    setSelectedMTU,
    tcpScenario,
    setTcpScenario,
    tcpFlags,
    animationState,
    setAnimationState,
    packetState,
    setPacketState,
    inspectedLayer,
    setInspectedLayer,
    toggleTCPFlag,
    loadTCPScenario,
    changeProtocol,
  } = useJourneyState();

  const { togglePlayPause, resetAnimation, changeSpeed } = usePacketAnimation({
    animationState,
    setAnimationState,
    setPacketState,
    selectedProtocol,
    tcpFlags,
    selectedMTU,
    onComplete,
  });

  const fragmentationInfo = useMemo(() => {
    const payloadSize = ENCAPSULATION_EXAMPLE.originalData.length;
    return calculateFragmentation(payloadSize, selectedMTU);
  }, [selectedMTU]);

  return (
    <div
      className="packet-journey-simulator-enhanced"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}
    >
      <AnimationControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedProtocol={selectedProtocol}
        setSelectedProtocol={setSelectedProtocol}
        animationState={animationState}
        togglePlayPause={togglePlayPause}
        resetAnimation={resetAnimation}
        changeSpeed={changeSpeed}
        changeProtocol={changeProtocol}
        currentLayer={packetState.currentLayer}
        direction={packetState.direction}
        currentStep={animationState.currentStep}
      />

      {viewMode === 'journey' && (
        <JourneyVisualization
          packetState={packetState}
          inspectedLayer={inspectedLayer}
          setInspectedLayer={setInspectedLayer}
          isPlaying={animationState.isPlaying}
        />
      )}

      {viewMode === 'headers' && <PacketBuilder packetState={packetState} />}

      {viewMode === 'hexdump' && <HexDumpView />}

      {viewMode === 'tcp-flags' && (
        <TCPFlagsView
          tcpFlags={tcpFlags}
          tcpScenario={tcpScenario}
          toggleTCPFlag={toggleTCPFlag}
          loadTCPScenario={loadTCPScenario}
          setTcpScenario={setTcpScenario}
        />
      )}

      {viewMode === 'mtu' && (
        <MTUView
          selectedMTU={selectedMTU}
          setSelectedMTU={setSelectedMTU}
          fragmentationInfo={fragmentationInfo}
        />
      )}

      {viewMode === 'scenarios' && <EncapsulationView />}

      {inspectedLayer !== null && viewMode === 'journey' && (
        <LayerDetails
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
