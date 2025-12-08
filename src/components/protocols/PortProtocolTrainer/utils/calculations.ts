/**
 * Utility calculations for spaced repetition and gamification
 */

import type { CardProgress, PortCard } from '../types';
import { EXAM_CRITICAL_PORTS } from '../data/examCriticalPorts';

/**
 * Calculate next review time based on Leitner box number
 */
export const calculateNextReview = (box: number): number => {
  const intervals = [0, 1, 3, 7, 14]; // days
  const days = intervals[Math.min(box, 4)];
  return Date.now() + days * 24 * 60 * 60 * 1000;
};

/**
 * Get cards that are due for review based on spaced repetition schedule
 */
export const getDueCards = (progress: Map<string, CardProgress>): PortCard[] => {
  const now = Date.now();
  return EXAM_CRITICAL_PORTS.filter((card) => {
    const cardProgress = progress.get(card.id);
    if (!cardProgress) {
      return true;
    } // New cards
    return cardProgress.nextReview <= now;
  }).sort((a, b) => {
    const progressA = progress.get(a.id);
    const progressB = progress.get(b.id);
    const boxA = progressA?.box || 0;
    const boxB = progressB?.box || 0;
    return boxA - boxB; // Lower boxes first
  });
};

/**
 * Calculate user level based on total XP
 */
export const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * Calculate XP gained for a card review
 */
export const calculateXPForReview = (correct: boolean, box: number): number => {
  const baseXP = 10;
  const multiplier = correct ? box + 1 : 0.5;
  return Math.floor(baseXP * multiplier);
};
