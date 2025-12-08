import { useState, useCallback } from 'react';
import type {
  AnimationState,
  PacketState,
  TCPFlagState,
  ProtocolType,
  TCPScenario,
  OSILayerNumber,
} from '../types';

export const useJourneyState = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('HTTP');
  const [selectedMTU, setSelectedMTU] = useState(1500);
  const [tcpScenario, setTcpScenario] = useState<TCPScenario>('handshake');
  const [tcpFlags, setTcpFlags] = useState<TCPFlagState>({
    SYN: false,
    ACK: false,
    FIN: false,
    RST: false,
    PSH: false,
    URG: false,
  });

  const [animationState, setAnimationState] = useState<AnimationState>({
    isPlaying: false,
    speed: 1,
    currentStep: 0,
    protocol: 'TCP',
  });

  const [packetState, setPacketState] = useState<PacketState>({
    currentLayer: 7,
    direction: 'encapsulation',
    headers: [],
    payload: 'Hello, Network!',
  });

  const [inspectedLayer, setInspectedLayer] = useState<OSILayerNumber | null>(null);

  const toggleTCPFlag = useCallback((flag: keyof TCPFlagState) => {
    setTcpFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  const loadTCPScenario = useCallback((scenario: 'handshake' | 'termination') => {
    setTcpScenario(scenario);
    if (scenario === 'handshake') {
      setTcpFlags({ SYN: true, ACK: false, FIN: false, RST: false, PSH: false, URG: false });
    } else {
      setTcpFlags({ SYN: false, ACK: true, FIN: true, RST: false, PSH: false, URG: false });
    }
  }, []);

  const changeProtocol = useCallback((protocol: 'TCP' | 'UDP') => {
    setAnimationState((prev) => ({ ...prev, protocol, currentStep: 0, isPlaying: false }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  }, []);

  return {
    selectedProtocol,
    setSelectedProtocol,
    selectedMTU,
    setSelectedMTU,
    tcpScenario,
    setTcpScenario,
    tcpFlags,
    setTcpFlags,
    animationState,
    setAnimationState,
    packetState,
    setPacketState,
    inspectedLayer,
    setInspectedLayer,
    toggleTCPFlag,
    loadTCPScenario,
    changeProtocol,
  };
};
