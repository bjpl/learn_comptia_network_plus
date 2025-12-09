/**
 * Custom hook for managing transformation state
 */

import { useState, useEffect } from 'react';
import { transformationScenarios } from '../../topologies-data';
import type { TopologyTransformation } from '../../topologies-types';

export const useTransformationState = () => {
  const [selectedTransformation, setSelectedTransformation] = useState<TopologyTransformation>(
    transformationScenarios[0]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
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

  const handleTransformationChange = (transformation: TopologyTransformation) => {
    setSelectedTransformation(transformation);
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

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

  const currentStepData = selectedTransformation.steps[currentStep];

  return {
    selectedTransformation,
    currentStep,
    isAnimating,
    showComparison,
    autoPlay,
    currentStepData,
    setShowComparison,
    handleTransformationChange,
    handleStepChange,
    handlePlayPause,
    handleReset,
  };
};
