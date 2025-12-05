/**
 * Custom hook for managing transformation animation state
 */

import { useState, useEffect } from 'react';
import type { TopologyTransformation } from '../../topologies-types';

export const useTransformAnimation = (selectedTransformation: TopologyTransformation) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isAnimating) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= selectedTransformation.steps.length - 1) {
            setAutoPlay(false);
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isAnimating, selectedTransformation]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsAnimating(true);
  };

  const handlePlayPause = () => {
    if (isAnimating && autoPlay) {
      setAutoPlay(false);
    } else {
      setIsAnimating(true);
      setAutoPlay(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

  return {
    currentStep,
    setCurrentStep,
    isAnimating,
    setIsAnimating,
    autoPlay,
    setAutoPlay,
    handleStepChange,
    handlePlayPause,
    handleReset,
  };
};
