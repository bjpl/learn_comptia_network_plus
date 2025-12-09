import { useState, useCallback } from 'react';
import type { OSILayerNumber } from '../../osi-types';
import type { LearningMode } from '../types';

export const useLearningState = () => {
  const [expandedLayer, setExpandedLayer] = useState<OSILayerNumber | null>(null);
  const [currentMode, setCurrentMode] = useState<LearningMode>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [selectedExample, setSelectedExample] = useState<number>(0);

  const useHint = useCallback(() => {
    setHintsUsed((h) => Math.min(h + 1, 3));
  }, []);

  return {
    expandedLayer,
    setExpandedLayer,
    currentMode,
    setCurrentMode,
    hintsUsed,
    useHint,
    score,
    setScore,
    quizAnswers,
    setQuizAnswers,
    selectedExample,
    setSelectedExample,
  };
};
