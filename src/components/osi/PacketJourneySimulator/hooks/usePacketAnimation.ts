import { useEffect, useRef, useCallback } from 'react';
import type { AnimationState, PacketState, OSILayerNumber } from '../types';
import { buildPacketHeaders } from '../utils/packetCalculations';
import type { ProtocolType, TCPFlagState } from '../types';

interface UsePacketAnimationProps {
  animationState: AnimationState;
  setAnimationState: React.Dispatch<React.SetStateAction<AnimationState>>;
  setPacketState: React.Dispatch<React.SetStateAction<PacketState>>;
  selectedProtocol: ProtocolType;
  tcpFlags: TCPFlagState;
  selectedMTU: number;
  onComplete?: () => void;
}

export const usePacketAnimation = ({
  animationState,
  setAnimationState,
  setPacketState,
  selectedProtocol,
  tcpFlags,
  selectedMTU,
  onComplete,
}: UsePacketAnimationProps) => {
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const stepAnimation = useCallback(() => {
    setAnimationState((prev) => {
      const { currentStep, protocol } = prev;

      if (currentStep < 7) {
        const currentLayer = (7 - currentStep) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'encapsulation',
          headers: buildPacketHeaders(
            currentLayer,
            'encapsulation',
            protocol,
            selectedProtocol,
            tcpFlags,
            selectedMTU
          ),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else if (currentStep < 14) {
        const currentLayer = (currentStep - 6) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'decapsulation',
          headers: buildPacketHeaders(
            currentLayer,
            'decapsulation',
            protocol,
            selectedProtocol,
            tcpFlags,
            selectedMTU
          ),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else {
        onComplete?.();
        return { ...prev, isPlaying: false, currentStep: 0 };
      }
    });
  }, [setPacketState, selectedProtocol, tcpFlags, selectedMTU, onComplete, setAnimationState]);

  useEffect(() => {
    if (animationState.isPlaying) {
      const interval = 1000 / animationState.speed;
      animationRef.current = setInterval(stepAnimation, interval);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [animationState.isPlaying, animationState.speed, stepAnimation]);

  const togglePlayPause = useCallback(() => {
    setAnimationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [setAnimationState]);

  const resetAnimation = useCallback(() => {
    setAnimationState((prev) => ({ ...prev, isPlaying: false, currentStep: 0 }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  }, [setAnimationState, setPacketState]);

  const changeSpeed = useCallback(
    (speed: 0.5 | 1 | 2) => {
      setAnimationState((prev) => ({ ...prev, speed }));
    },
    [setAnimationState]
  );

  return {
    togglePlayPause,
    resetAnimation,
    changeSpeed,
  };
};
