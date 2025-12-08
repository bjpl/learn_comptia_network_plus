/**
 * Custom hook for spaced repetition logic
 */

import { useState, useEffect, useCallback } from 'react';
import type { CardProgress, PortCard, TrainingStats, Achievement } from '../types';
import { EXAM_CRITICAL_PORTS, ACHIEVEMENTS } from '../data';
import { calculateNextReview, getDueCards, calculateLevel, calculateXPForReview } from '../utils';

export const useSpacedRepetition = () => {
  const [progress, setProgress] = useState<Map<string, CardProgress>>(new Map());
  const [stats, setStats] = useState<TrainingStats>({
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
  });

  const [dueCards, setDueCards] = useState<PortCard[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('portTrainerProgress');
    const savedStats = localStorage.getItem('portTrainerStats');

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const progressMap = new Map<string, CardProgress>(Object.entries(parsed));
      setProgress(progressMap);
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const initialDueCards = getDueCards(new Map());
    setDueCards(initialDueCards);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (progress.size > 0) {
      const progressObj = Object.fromEntries(progress);
      localStorage.setItem('portTrainerProgress', JSON.stringify(progressObj));
    }
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('portTrainerStats', JSON.stringify(stats));
  }, [stats]);

  const reviewCard = useCallback(
    (card: PortCard, correct: boolean) => {
      const currentProg = progress.get(card.id) || {
        cardId: card.id,
        box: 0,
        lastReviewed: 0,
        nextReview: 0,
        correctCount: 0,
        incorrectCount: 0,
        accuracy: 0,
      };

      const newBox = correct ? Math.min(currentProg.box + 1, 4) : Math.max(currentProg.box - 1, 0);

      const correctCount = currentProg.correctCount + (correct ? 1 : 0);
      const incorrectCount = currentProg.incorrectCount + (correct ? 0 : 1);
      const totalAttempts = correctCount + incorrectCount;
      const accuracy = (correctCount / totalAttempts) * 100;

      const newProgress: CardProgress = {
        cardId: card.id,
        box: newBox,
        lastReviewed: Date.now(),
        nextReview: calculateNextReview(newBox),
        correctCount,
        incorrectCount,
        accuracy,
      };

      const newProgressMap = new Map(progress);
      newProgressMap.set(card.id, newProgress);
      setProgress(newProgressMap);

      // Update stats
      const xpGained = calculateXPForReview(correct, currentProg.box);
      const newXP = stats.xp + xpGained;
      const newLevel = calculateLevel(newXP);

      const masteredCards = Array.from(newProgressMap.values()).filter((p) => p.box === 4).length;

      // Check for achievements
      const newAchievements = [...stats.achievements];
      if (stats.totalReviews === 0) {
        const achievement = newAchievements.find((a) => a.id === 'first-card');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }
      if (stats.totalReviews + 1 >= 10) {
        const achievement = newAchievements.find((a) => a.id === 'ten-cards');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }
      if (masteredCards >= 10) {
        const achievement = newAchievements.find((a) => a.id === 'master-ten');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }

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

        if (newStreak >= 7) {
          const achievement = newAchievements.find((a) => a.id === 'week-streak');
          if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
          }
        }
      }

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

      // Update due cards
      const newDueCards = getDueCards(newProgressMap);
      setDueCards(newDueCards);
    },
    [progress, stats]
  );

  const addQuizScore = useCallback(
    (score: number, completionTime: number) => {
      const newAchievements = [...stats.achievements];

      if (score === 100) {
        const achievement = newAchievements.find((a) => a.id === 'perfect-quiz');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
        }
      }

      if (completionTime < 120000) {
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
    },
    [stats]
  );

  return {
    progress,
    stats,
    dueCards,
    reviewCard,
    addQuizScore,
  };
};
