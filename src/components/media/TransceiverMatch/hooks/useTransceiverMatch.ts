import { useState, useMemo } from 'react';
import type { Transceiver, UseCaseCard } from '../types';
import { findCorrectMatches, calculateScore } from '../utils/matching';

export const useTransceiverMatch = (useCases: UseCaseCard[], transceivers: Transceiver[]) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedTransceiver, setDraggedTransceiver] = useState<Transceiver | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const correctMatches = useMemo(() => {
    return findCorrectMatches(useCases, transceivers);
  }, [useCases, transceivers]);

  const handleDragStart = (transceiver: Transceiver) => {
    setDraggedTransceiver(transceiver);
  };

  const handleDrop = (useCaseId: string) => {
    if (draggedTransceiver) {
      setMatches((prev) => ({
        ...prev,
        [useCaseId]: draggedTransceiver.id,
      }));
      setDraggedTransceiver(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveMatch = (useCaseId: string) => {
    setMatches((prev) => {
      const newMatches = { ...prev };
      delete newMatches[useCaseId];
      return newMatches;
    });
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore(matches, correctMatches, useCases.length);
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const handleReset = () => {
    setMatches({});
    setSubmitted(false);
    setScore(0);
  };

  const completedMatches = Object.keys(matches).length;
  const progressPercentage = (completedMatches / useCases.length) * 100;

  return {
    matches,
    draggedTransceiver,
    submitted,
    score,
    correctMatches,
    completedMatches,
    progressPercentage,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleRemoveMatch,
    handleSubmit,
    handleReset,
  };
};
