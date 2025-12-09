import { useState, useEffect, useCallback, useRef } from 'react';
import type { PacketState, AnimationState, OSILayerNumber } from '../../osi-types';
import type { AnimationSpeed, Protocol } from '../types';
import { buildPacketHeaders } from '../utils/packetBuilder';

interface UsePacketAnimationProps {
  onComplete?: () => void;
}

export const usePacketAnimation = ({ onComplete }: UsePacketAnimationProps) => {
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

  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const stepAnimation = useCallback(() => {
    setAnimationState((prev) => {
      const { currentStep, protocol } = prev;

      // Encapsulation: 7 -> 1 (7 steps)
      // Decapsulation: 1 -> 7 (7 steps)
      // Total: 14 steps

      if (currentStep < 7) {
        // Encapsulation phase
        const currentLayer = (7 - currentStep) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'encapsulation',
          headers: buildPacketHeaders(currentLayer, 'encapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else if (currentStep < 14) {
        // Decapsulation phase
        const currentLayer = (currentStep - 6) as OSILayerNumber;
        setPacketState({
          currentLayer,
          direction: 'decapsulation',
          headers: buildPacketHeaders(currentLayer, 'decapsulation', protocol),
          payload: 'Hello, Network!',
        });

        return { ...prev, currentStep: currentStep + 1 };
      } else {
        // Animation complete
        onComplete?.();
        return { ...prev, isPlaying: false, currentStep: 0 };
      }
    });
  }, [onComplete]);

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
  }, []);

  const resetAnimation = useCallback(() => {
    setAnimationState((prev) => ({ ...prev, isPlaying: false, currentStep: 0 }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  }, []);

  const changeSpeed = useCallback((speed: AnimationSpeed) => {
    setAnimationState((prev) => ({ ...prev, speed }));
  }, []);

  const changeProtocol = useCallback((protocol: Protocol) => {
    setAnimationState((prev) => ({ ...prev, protocol, currentStep: 0, isPlaying: false }));
    setPacketState({
      currentLayer: 7,
      direction: 'encapsulation',
      headers: [],
      payload: 'Hello, Network!',
    });
  }, []);

  return {
    animationState,
    packetState,
    togglePlayPause,
    resetAnimation,
    changeSpeed,
    changeProtocol,
  };
};
