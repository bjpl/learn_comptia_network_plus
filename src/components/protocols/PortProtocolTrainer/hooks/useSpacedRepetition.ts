/**
 * Hook for managing spaced repetition (Leitner system) logic
 */

import { useState, useEffect, useMemo } from 'react';
import type { CardProgress, PortCard } from '../types';
import { calculateNextReview, getDueCards } from '../utils/calculations';
import { EXAM_CRITICAL_PORTS } from '../data/examCriticalPorts';

export const useSpacedRepetition = () => {
  const [progress, setProgress] = useState<Map<string, CardProgress>>(new Map());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dueCards, setDueCards] = useState<PortCard[]>([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('portTrainerProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const progressMap = new Map<string, CardProgress>(Object.entries(parsed));
      setProgress(progressMap);
      setDueCards(getDueCards(progressMap));
    } else {
      // Initialize due cards for new users
      const initialDueCards = getDueCards(new Map());
      setDueCards(initialDueCards);
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (progress.size > 0) {
      const progressObj = Object.fromEntries(progress);
      localStorage.setItem('portTrainerProgress', JSON.stringify(progressObj));
    }
  }, [progress]);

  // Get current card
  const currentCard = useMemo(() => {
    if (dueCards.length > 0) {
      return dueCards[currentCardIndex % dueCards.length];
    }
    return null;
  }, [dueCards, currentCardIndex]);

  // Get current card's progress
  const currentProgress = useMemo(() => {
    if (currentCard) {
      return progress.get(currentCard.id);
    }
    return undefined;
  }, [currentCard, progress]);

  /**
   * Handle card review with correct/incorrect rating
   */
  const handleCardReview = (correct: boolean): CardProgress | null => {
    if (!currentCard) {
      return null;
    }

    const currentProg = progress.get(currentCard.id) || {
      cardId: currentCard.id,
      box: 0,
      lastReviewed: 0,
      nextReview: 0,
      correctCount: 0,
      incorrectCount: 0,
      accuracy: 0,
    };

    // Update Leitner box
    const newBox = correct ? Math.min(currentProg.box + 1, 4) : Math.max(currentProg.box - 1, 0);

    // Update statistics
    const correctCount = currentProg.correctCount + (correct ? 1 : 0);
    const incorrectCount = currentProg.incorrectCount + (correct ? 0 : 1);
    const totalAttempts = correctCount + incorrectCount;
    const accuracy = (correctCount / totalAttempts) * 100;

    const newProgress: CardProgress = {
      cardId: currentCard.id,
      box: newBox,
      lastReviewed: Date.now(),
      nextReview: calculateNextReview(newBox),
      correctCount,
      incorrectCount,
      accuracy,
    };

    // Update progress map
    const newProgressMap = new Map(progress);
    newProgressMap.set(currentCard.id, newProgress);
    setProgress(newProgressMap);

    // Update due cards and move to next
    setShowAnswer(false);
    const newDueCards = getDueCards(newProgressMap);
    setDueCards(newDueCards);

    if (newDueCards.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % newDueCards.length);
    }

    return newProgress;
  };

  /**
   * Reset all progress (for testing or starting over)
   */
  const resetProgress = () => {
    setProgress(new Map());
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setDueCards(EXAM_CRITICAL_PORTS);
    localStorage.removeItem('portTrainerProgress');
  };

  return {
    progress,
    currentCard,
    currentProgress,
    currentCardIndex,
    dueCards,
    showAnswer,
    setShowAnswer,
    handleCardReview,
    resetProgress,
  };
};
