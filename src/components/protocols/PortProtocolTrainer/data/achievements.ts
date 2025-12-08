/**
 * Achievements definitions for gamification
 */

import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-card',
    name: 'First Steps',
    description: 'Review your first flashcard',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'ten-cards',
    name: 'Getting Started',
    description: 'Review 10 cards',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'master-ten',
    name: 'Expert Level',
    description: 'Master 10 cards (box 4)',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'perfect-quiz',
    name: 'Perfect Score',
    description: 'Score 100% on a quiz',
    icon: '💯',
    unlocked: false,
  },
  {
    id: 'week-streak',
    name: 'Dedicated Learner',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'all-secure',
    name: 'Security Expert',
    description: 'Master all secure protocol ports',
    icon: '🔒',
    unlocked: false,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 2 minutes',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'master-all',
    name: 'Port Master',
    description: 'Master all exam-critical ports',
    icon: '👑',
    unlocked: false,
  },
];
