/**
 * CompTIA Network+ Learning Platform - Progress Tracking Hook
 * React hook for managing and tracking user learning progress
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, Achievement } from '../types';
import { StorageKey } from '../types';

// ============================================================================
// Types
// ============================================================================

interface UseProgressOptions {
  userId: string;
  autoSave?: boolean;
  saveInterval?: number; // milliseconds
}

interface UseProgressReturn {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  markComponentComplete: (componentId: string) => void;
  markDomainComplete: (domainId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  addTimeSpent: (seconds: number) => void;
  getComponentProgress: (componentId: string) => boolean;
  getDomainProgress: (domainId: string) => number;
  save: () => void;
  load: () => void;
  reset: () => void;
}

// ============================================================================
// Default Progress Data
// ============================================================================

const createDefaultProgress = (userId: string): UserProgress => ({
  userId,
  componentsCompleted: [],
  domainsCompleted: [],
  totalTimeSpent: 0,
  lastAccessed: new Date(),
  overallProgress: 0,
  domainProgress: new Map(),
  achievements: [],
  streak: 0,
});

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for tracking and managing user learning progress
 *
 * @param options - Configuration options
 * @returns Progress state and management functions
 *
 * @example
 * ```typescript
 * const {
 *   progress,
 *   markComponentComplete,
 *   markDomainComplete,
 *   addAchievement
 * } = useProgress({ userId: 'user123', autoSave: true });
 *
 * // Mark a component as complete
 * markComponentComplete('flashcards-1');
 *
 * // Check if component is complete
 * const isComplete = progress.componentsCompleted.includes('flashcards-1');
 * ```
 */
export function useProgress(options: UseProgressOptions): UseProgressReturn {
  const { userId, autoSave = true, saveInterval = 30000 } = options;

  // Initialize state with default or loaded data
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = loadProgressFromStorage(userId);
    return saved || createDefaultProgress(userId);
  });

  // Auto-save effect
  useEffect(() => {
    if (!autoSave) {
      return;
    }

    const intervalId = setInterval(() => {
      saveProgressToStorage(progress);
    }, saveInterval);

    return () => clearInterval(intervalId);
  }, [progress, autoSave, saveInterval]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (autoSave) {
        saveProgressToStorage(progress);
      }
    };
  }, [progress, autoSave]);

  // Update progress
  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress((prev) => ({
      ...prev,
      ...updates,
      lastAccessed: new Date(),
    }));
  }, []);

  // Mark component as complete
  const markComponentComplete = useCallback((componentId: string) => {
    setProgress((prev) => {
      if (prev.componentsCompleted.includes(componentId)) {
        return prev; // Already complete
      }

      const newCompleted = [...prev.componentsCompleted, componentId];
      const overallProgress = calculateOverallProgress(newCompleted);

      return {
        ...prev,
        componentsCompleted: newCompleted,
        overallProgress,
        lastAccessed: new Date(),
      };
    });
  }, []);

  // Mark domain as complete
  const markDomainComplete = useCallback((domainId: string) => {
    setProgress((prev) => {
      if (prev.domainsCompleted.includes(domainId)) {
        return prev; // Already complete
      }

      const newDomainsCompleted = [...prev.domainsCompleted, domainId];

      return {
        ...prev,
        domainsCompleted: newDomainsCompleted,
        lastAccessed: new Date(),
      };
    });
  }, []);

  // Add achievement
  const addAchievement = useCallback((achievement: Achievement) => {
    setProgress((prev) => {
      // Check if achievement already exists
      if (prev.achievements.some((a) => a.id === achievement.id)) {
        return prev;
      }

      return {
        ...prev,
        achievements: [...prev.achievements, achievement],
        lastAccessed: new Date(),
      };
    });
  }, []);

  // Increment streak
  const incrementStreak = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      lastAccessed: new Date(),
    }));
  }, []);

  // Reset streak
  const resetStreak = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      streak: 0,
      lastAccessed: new Date(),
    }));
  }, []);

  // Add time spent
  const addTimeSpent = useCallback((seconds: number) => {
    setProgress((prev) => ({
      ...prev,
      totalTimeSpent: prev.totalTimeSpent + seconds,
      lastAccessed: new Date(),
    }));
  }, []);

  // Get component progress
  const getComponentProgress = useCallback(
    (componentId: string): boolean => {
      return progress.componentsCompleted.includes(componentId);
    },
    [progress.componentsCompleted]
  );

  // Get domain progress
  const getDomainProgress = useCallback(
    (domainId: string): number => {
      return progress.domainProgress.get(domainId) || 0;
    },
    [progress.domainProgress]
  );

  // Manual save
  const save = useCallback(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  // Manual load
  const load = useCallback(() => {
    const loaded = loadProgressFromStorage(userId);
    if (loaded) {
      setProgress(loaded);
    }
  }, [userId]);

  // Reset progress
  const reset = useCallback(() => {
    const defaultProgress = createDefaultProgress(userId);
    setProgress(defaultProgress);
    saveProgressToStorage(defaultProgress);
  }, [userId]);

  return {
    progress,
    updateProgress,
    markComponentComplete,
    markDomainComplete,
    addAchievement,
    incrementStreak,
    resetStreak,
    addTimeSpent,
    getComponentProgress,
    getDomainProgress,
    save,
    load,
    reset,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate overall progress percentage
 * Assumes 23 total components for CompTIA Network+
 */
function calculateOverallProgress(completedComponents: string[]): number {
  const TOTAL_COMPONENTS = 23;
  return Math.round((completedComponents.length / TOTAL_COMPONENTS) * 100);
}

/**
 * Save progress to localStorage
 */
function saveProgressToStorage(progress: UserProgress): void {
  try {
    // Convert Map to object for JSON serialization
    const serializable = {
      ...progress,
      domainProgress: Object.fromEntries(progress.domainProgress),
      lastAccessed: progress.lastAccessed.toISOString(),
      achievements: progress.achievements.map((a) => ({
        ...a,
        earnedDate: a.earnedDate.toISOString(),
      })),
    };

    localStorage.setItem(
      `${StorageKey.USER_PROGRESS}_${progress.userId}`,
      JSON.stringify(serializable)
    );
  } catch (error) {
    console.error('Failed to save progress to storage:', error);
  }
}

/**
 * Type guard to validate progress data structure
 */
function isValidProgressData(data: unknown): data is {
  userId: string;
  componentsCompleted: string[];
  domainsCompleted: string[];
  totalTimeSpent: number;
  lastAccessed: string;
  overallProgress: number;
  domainProgress: Record<string, number>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
    category: string;
  }>;
  streak: number;
} {
  if (!data || typeof data !== 'object') {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.userId === 'string' &&
    Array.isArray(obj.componentsCompleted) &&
    Array.isArray(obj.domainsCompleted) &&
    typeof obj.totalTimeSpent === 'number' &&
    typeof obj.lastAccessed === 'string' &&
    typeof obj.overallProgress === 'number' &&
    typeof obj.domainProgress === 'object' &&
    Array.isArray(obj.achievements) &&
    typeof obj.streak === 'number'
  );
}

/**
 * Load progress from localStorage
 */
function loadProgressFromStorage(userId: string): UserProgress | null {
  try {
    const stored = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${userId}`);
    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    // Type guard to validate parsed data
    if (!isValidProgressData(parsed)) {
      console.warn('Invalid progress data in storage');
      return null;
    }

    // Convert back to proper types
    return {
      ...parsed,
      domainProgress: new Map(Object.entries(parsed.domainProgress)),
      lastAccessed: new Date(parsed.lastAccessed),
      achievements: parsed.achievements.map((a) => ({
        ...a,
        earnedDate: new Date(a.earnedDate),
        category: a.category as 'completion' | 'mastery' | 'streak' | 'speed' | 'perfect',
      })),
    };
  } catch (error) {
    console.error('Failed to load progress from storage:', error);
    return null;
  }
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook for tracking session time
 *
 * @returns Current session time in seconds
 *
 * @example
 * ```typescript
 * const sessionTime = useSessionTime();
 * console.log(`Session: ${sessionTime}s`);
 * ```
 */
export function useSessionTime(): number {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return sessionTime;
}

/**
 * Hook for checking streak maintenance
 *
 * @param lastAccessed - Last access date
 * @returns Whether streak should be maintained
 */
export function useStreakCheck(lastAccessed: Date): {
  shouldMaintain: boolean;
  daysSinceLastAccess: number;
} {
  const [result, setResult] = useState({
    shouldMaintain: true,
    daysSinceLastAccess: 0,
  });

  useEffect(() => {
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      shouldMaintain: daysDiff <= 1, // Allow 1 day gap
      daysSinceLastAccess: daysDiff,
    });
  }, [lastAccessed]);

  return result;
}

/**
 * Hook for achievement notifications
 *
 * @param achievements - Array of achievements
 * @param onNewAchievement - Callback when new achievement is added
 */
export function useAchievementNotifications(
  achievements: Achievement[],
  onNewAchievement?: (achievement: Achievement) => void
): void {
  const [lastCount, setLastCount] = useState(achievements.length);

  useEffect(() => {
    if (achievements.length > lastCount && onNewAchievement) {
      const newAchievement = achievements[achievements.length - 1];
      onNewAchievement(newAchievement);
    }
    setLastCount(achievements.length);
  }, [achievements, lastCount, onNewAchievement]);
}

export default useProgress;
