/**
 * Hook for managing training statistics and achievements
 */

import { useState, useEffect } from 'react';
import type { TrainingStats, CardProgress, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { EXAM_CRITICAL_PORTS } from '../data/examCriticalPorts';
import { calculateLevel, calculateXPForReview } from '../utils/calculations';

const INITIAL_STATS: TrainingStats = {
  totalCards: EXAM_CRITICAL_PORTS.length,
  masteredCards: 0,
  studyStreak: 0,
  lastStudyDate: '',
  totalReviews: 0,
  accuracy: 0,
  level: 1,
  xp: 0,
  achievements: ACHIEVEMENTS,
  quizScores: [],
};

export const useTrainingStats = () => {
  const [stats, setStats] = useState<TrainingStats>(INITIAL_STATS);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('portTrainerStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('portTrainerStats', JSON.stringify(stats));
  }, [stats]);

  /**
   * Update stats after a card review
   */
  const updateStatsAfterReview = (
    correct: boolean,
    previousBox: number,
    progressMap: Map<string, CardProgress>
  ) => {
    const xpGained = calculateXPForReview(correct, previousBox);
    const newXP = stats.xp + xpGained;
    const newLevel = calculateLevel(newXP);
    const masteredCards = Array.from(progressMap.values()).filter((p) => p.box === 4).length;

    // Update study streak
    const today = new Date().toDateString();
    const lastStudy = stats.lastStudyDate;
    let newStreak = stats.studyStreak;

    if (lastStudy !== today) {
      const lastDate = new Date(lastStudy);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    // Check for achievements
    const newAchievements = checkAchievements(stats, masteredCards, newStreak);

    setStats({
      ...stats,
      masteredCards,
      studyStreak: newStreak,
      lastStudyDate: today,
      totalReviews: stats.totalReviews + 1,
      level: newLevel,
      xp: newXP,
      achievements: newAchievements,
    });
  };

  /**
   * Update stats after completing a quiz
   */
  const updateStatsAfterQuiz = (score: number, totalTime: number) => {
    const newAchievements = [...stats.achievements];

    // Check perfect score achievement
    if (score === 100) {
      const achievement = newAchievements.find((a) => a.id === 'perfect-quiz');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    // Check speed demon achievement (under 2 minutes)
    if (totalTime < 120000) {
      const achievement = newAchievements.find((a) => a.id === 'speed-demon');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    setStats({
      ...stats,
      quizScores: [...stats.quizScores, score],
      achievements: newAchievements,
    });
  };

  /**
   * Check and unlock achievements based on current stats
   */
  const checkAchievements = (
    currentStats: TrainingStats,
    masteredCards: number,
    studyStreak: number
  ): Achievement[] => {
    const newAchievements = [...currentStats.achievements];

    // First card
    if (currentStats.totalReviews === 0) {
      const achievement = newAchievements.find((a) => a.id === 'first-card');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    // 10 cards reviewed
    if (currentStats.totalReviews + 1 >= 10) {
      const achievement = newAchievements.find((a) => a.id === 'ten-cards');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    // 10 cards mastered
    if (masteredCards >= 10) {
      const achievement = newAchievements.find((a) => a.id === 'master-ten');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    // 7 day streak
    if (studyStreak >= 7) {
      const achievement = newAchievements.find((a) => a.id === 'week-streak');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
      }
    }

    return newAchievements;
  };

  /**
   * Reset all stats (for testing or starting over)
   */
  const resetStats = () => {
    setStats(INITIAL_STATS);
    localStorage.removeItem('portTrainerStats');
  };

  return {
    stats,
    updateStatsAfterReview,
    updateStatsAfterQuiz,
    resetStats,
  };
};
