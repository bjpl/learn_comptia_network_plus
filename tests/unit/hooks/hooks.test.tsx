/**
 * CompTIA Network+ Learning Platform - Custom Hooks Test Suite
 * Comprehensive tests for useAuth, useProgress, useTimer, and useScoring
 * Test coverage: 0% -> Target: 90%+
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

// Hooks under test
import { useProgress, useSessionTime, useStreakCheck, useAchievementNotifications } from '../../../src/hooks/useProgress';
import { useTimer, useInterval, useDebounce, useThrottle, useCountdownWithCallbacks, useTimedChallenge } from '../../../src/hooks/useTimer';
import { useScoring, useRealtimeScore, useAnswerStreak, useDomainProgress, useTimeTracking, useScorePrediction } from '../../../src/hooks/useScoring';

// Types
import type { UserProgress, Achievement, Question, AssessmentResult, DifficultyLevel } from '../../../src/types';
import { StorageKey } from '../../../src/types';

// ============================================================================
// Test Data Fixtures
// ============================================================================

const mockUserId = 'test-user-123';

const createMockAchievement = (id: string = 'ach-1'): Achievement => ({
  id,
  name: 'Test Achievement',
  description: 'Test achievement description',
  icon: '🏆',
  earnedDate: new Date('2025-01-01'),
  category: 'completion',
});

const createMockQuestion = (id: string = 'q1', difficulty: DifficultyLevel = 'intermediate'): Question => ({
  id,
  type: 'multiple-choice',
  domain: 'networking-concepts',
  objective: '1.1',
  difficulty,
  question: 'Test question?',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 'A',
  explanation: 'Test explanation',
  points: 10,
});

const createMockResult = (questionId: string = 'q1', isCorrect: boolean = true): AssessmentResult => ({
  questionId,
  userAnswer: 'A',
  isCorrect,
  pointsEarned: isCorrect ? 10 : 0,
  timeSpent: 30,
  timestamp: new Date(),
});

// ============================================================================
// Mock Setup
// ============================================================================

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();

  // Reset all mocks
  vi.clearAllMocks();

  // Mock timers
  vi.useFakeTimers();
});

afterEach(() => {
  // Restore real timers
  vi.useRealTimers();

  // Clean up localStorage
  localStorage.clear();
});

// ============================================================================
// useProgress Tests
// ============================================================================

describe('useProgress', () => {
  describe('Initial State', () => {
    it('should initialize with default progress for new user', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId }));

      expect(result.current.progress).toMatchObject({
        userId: mockUserId,
        componentsCompleted: [],
        domainsCompleted: [],
        totalTimeSpent: 0,
        overallProgress: 0,
        achievements: [],
        streak: 0,
      });
      expect(result.current.progress.domainProgress).toBeInstanceOf(Map);
    });

    it('should load saved progress from localStorage', () => {
      const savedProgress: UserProgress = {
        userId: mockUserId,
        componentsCompleted: ['comp-1', 'comp-2'],
        domainsCompleted: ['domain-1'],
        totalTimeSpent: 300,
        lastAccessed: new Date('2025-01-01'),
        overallProgress: 50,
        domainProgress: new Map([['domain-1', 100]]),
        achievements: [createMockAchievement()],
        streak: 5,
      };

      const serialized = {
        ...savedProgress,
        domainProgress: Object.fromEntries(savedProgress.domainProgress),
        lastAccessed: savedProgress.lastAccessed.toISOString(),
        achievements: savedProgress.achievements.map(a => ({
          ...a,
          earnedDate: a.earnedDate.toISOString(),
        })),
      };

      localStorage.setItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`, JSON.stringify(serialized));

      const { result } = renderHook(() => useProgress({ userId: mockUserId }));

      expect(result.current.progress.componentsCompleted).toEqual(['comp-1', 'comp-2']);
      expect(result.current.progress.domainsCompleted).toEqual(['domain-1']);
      expect(result.current.progress.overallProgress).toBe(50);
      expect(result.current.progress.streak).toBe(5);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`, 'invalid-json{');

      const { result } = renderHook(() => useProgress({ userId: mockUserId }));

      // Should fall back to default progress
      expect(result.current.progress.componentsCompleted).toEqual([]);
    });

    it('should handle missing required fields in saved data', () => {
      const incomplete = {
        userId: mockUserId,
        // Missing required fields
      };

      localStorage.setItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`, JSON.stringify(incomplete));

      const { result } = renderHook(() => useProgress({ userId: mockUserId }));

      // Should fall back to default progress
      expect(result.current.progress).toMatchObject({
        userId: mockUserId,
        componentsCompleted: [],
      });
    });
  });

  describe('State Transitions', () => {
    it('should mark component as complete', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markComponentComplete('flashcard-1');
      });

      expect(result.current.progress.componentsCompleted).toContain('flashcard-1');
      expect(result.current.progress.overallProgress).toBeGreaterThan(0);
    });

    it('should not duplicate completed components', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markComponentComplete('flashcard-1');
        result.current.markComponentComplete('flashcard-1');
      });

      expect(result.current.progress.componentsCompleted).toEqual(['flashcard-1']);
    });

    it('should mark domain as complete', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markDomainComplete('networking-concepts');
      });

      expect(result.current.progress.domainsCompleted).toContain('networking-concepts');
    });

    it('should add achievement without duplicates', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));
      const achievement = createMockAchievement('ach-1');

      act(() => {
        result.current.addAchievement(achievement);
        result.current.addAchievement(achievement); // Try to add again
      });

      expect(result.current.progress.achievements).toHaveLength(1);
      expect(result.current.progress.achievements[0].id).toBe('ach-1');
    });

    it('should increment and reset streak', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.incrementStreak();
        result.current.incrementStreak();
        result.current.incrementStreak();
      });

      expect(result.current.progress.streak).toBe(3);

      act(() => {
        result.current.resetStreak();
      });

      expect(result.current.progress.streak).toBe(0);
    });

    it('should add time spent', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.addTimeSpent(60);
        result.current.addTimeSpent(120);
      });

      expect(result.current.progress.totalTimeSpent).toBe(180);
    });

    it('should update progress with partial data', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.updateProgress({ streak: 10, totalTimeSpent: 500 });
      });

      expect(result.current.progress.streak).toBe(10);
      expect(result.current.progress.totalTimeSpent).toBe(500);
    });

    it('should update lastAccessed on state changes', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));
      const initialDate = result.current.progress.lastAccessed;

      vi.advanceTimersByTime(1000);

      act(() => {
        result.current.markComponentComplete('test');
      });

      expect(result.current.progress.lastAccessed.getTime()).toBeGreaterThan(initialDate.getTime());
    });
  });

  describe('Auto-save', () => {
    it('should auto-save progress at intervals', () => {
      const { result } = renderHook(() =>
        useProgress({ userId: mockUserId, autoSave: true, saveInterval: 1000 })
      );

      act(() => {
        result.current.markComponentComplete('test-component');
      });

      // Advance time to trigger auto-save
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      const saved = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`);
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.componentsCompleted).toContain('test-component');
    });

    it('should not auto-save when disabled', () => {
      const { result } = renderHook(() =>
        useProgress({ userId: mockUserId, autoSave: false })
      );

      act(() => {
        result.current.markComponentComplete('test-component');
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      const saved = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`);
      expect(saved).toBeFalsy();
    });

    it('should save on unmount when autoSave is enabled', () => {
      const { result, unmount } = renderHook(() =>
        useProgress({ userId: mockUserId, autoSave: true })
      );

      act(() => {
        result.current.markComponentComplete('test-component');
      });

      unmount();

      const saved = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`);
      expect(saved).toBeTruthy();
    });

    it('should use custom save interval', () => {
      renderHook(() =>
        useProgress({ userId: mockUserId, autoSave: true, saveInterval: 5000 })
      );

      // Should not save before interval
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`)).toBeFalsy();

      // Should save after interval
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`)).toBeTruthy();
    });
  });

  describe('Manual Operations', () => {
    it('should manually save progress', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markComponentComplete('test');
        result.current.save();
      });

      const saved = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`);
      expect(saved).toBeTruthy();
    });

    it('should manually load progress', () => {
      const savedProgress: UserProgress = {
        userId: mockUserId,
        componentsCompleted: ['loaded-component'],
        domainsCompleted: [],
        totalTimeSpent: 0,
        lastAccessed: new Date(),
        overallProgress: 0,
        domainProgress: new Map(),
        achievements: [],
        streak: 0,
      };

      const serialized = {
        ...savedProgress,
        domainProgress: {},
        lastAccessed: savedProgress.lastAccessed.toISOString(),
        achievements: [],
      };

      localStorage.setItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`, JSON.stringify(serialized));

      const { result } = renderHook(() => useProgress({ userId: 'different-user', autoSave: false }));

      expect(result.current.progress.componentsCompleted).not.toContain('loaded-component');

      act(() => {
        result.current.load();
      });

      // Should not load if userId doesn't match
      expect(result.current.progress.componentsCompleted).not.toContain('loaded-component');
    });

    it('should reset progress', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markComponentComplete('test');
        result.current.incrementStreak();
        result.current.addTimeSpent(300);
      });

      expect(result.current.progress.componentsCompleted).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.progress.componentsCompleted).toEqual([]);
      expect(result.current.progress.streak).toBe(0);
      expect(result.current.progress.totalTimeSpent).toBe(0);
    });
  });

  describe('Query Methods', () => {
    it('should check component completion status', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.markComponentComplete('completed-comp');
      });

      expect(result.current.getComponentProgress('completed-comp')).toBe(true);
      expect(result.current.getComponentProgress('incomplete-comp')).toBe(false);
    });

    it('should get domain progress', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.updateProgress({
          domainProgress: new Map([
            ['domain-1', 75],
            ['domain-2', 50],
          ]),
        });
      });

      expect(result.current.getDomainProgress('domain-1')).toBe(75);
      expect(result.current.getDomainProgress('domain-2')).toBe(50);
      expect(result.current.getDomainProgress('unknown')).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid component completions', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.markComponentComplete(`component-${i}`);
        }
      });

      expect(result.current.progress.componentsCompleted).toHaveLength(100);
    });

    it('should handle negative time values gracefully', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      act(() => {
        result.current.addTimeSpent(-100);
      });

      expect(result.current.progress.totalTimeSpent).toBe(-100);
    });

    it('should handle unmount during async save', () => {
      const { result, unmount } = renderHook(() =>
        useProgress({ userId: mockUserId, autoSave: true })
      );

      act(() => {
        result.current.markComponentComplete('test');
      });

      // Unmount immediately without waiting for save interval
      unmount();

      // Should have saved on unmount
      const saved = localStorage.getItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`);
      expect(saved).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded', () => {
      const { result } = renderHook(() => useProgress({ userId: mockUserId, autoSave: false }));

      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => {
        act(() => {
          result.current.save();
        });
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem(`${StorageKey.USER_PROGRESS}_${mockUserId}`, '{invalid json}');

      expect(() => {
        renderHook(() => useProgress({ userId: mockUserId }));
      }).not.toThrow();
    });
  });
});

// ============================================================================
// useSessionTime Tests
// ============================================================================

describe('useSessionTime', () => {
  it('should start at 0 and increment every second', () => {
    const { result } = renderHook(() => useSessionTime());

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(6);
  });

  it('should clean up interval on unmount', () => {
    const { unmount } = renderHook(() => useSessionTime());
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

// ============================================================================
// useStreakCheck Tests
// ============================================================================

describe('useStreakCheck', () => {
  it('should maintain streak for same-day access', () => {
    const today = new Date();
    const { result } = renderHook(() => useStreakCheck(today));

    expect(result.current.shouldMaintain).toBe(true);
    expect(result.current.daysSinceLastAccess).toBe(0);
  });

  it('should maintain streak for 1-day gap', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { result } = renderHook(() => useStreakCheck(yesterday));

    expect(result.current.shouldMaintain).toBe(true);
    expect(result.current.daysSinceLastAccess).toBe(1);
  });

  it('should break streak for 2+ day gap', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const { result } = renderHook(() => useStreakCheck(twoDaysAgo));

    expect(result.current.shouldMaintain).toBe(false);
    expect(result.current.daysSinceLastAccess).toBe(2);
  });

  it('should update when lastAccessed changes', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { result, rerender } = renderHook(
      ({ date }) => useStreakCheck(date),
      { initialProps: { date: yesterday } }
    );

    expect(result.current.daysSinceLastAccess).toBe(1);

    const today = new Date();
    rerender({ date: today });

    expect(result.current.daysSinceLastAccess).toBe(0);
  });
});

// ============================================================================
// useAchievementNotifications Tests
// ============================================================================

describe('useAchievementNotifications', () => {
  it('should call callback when new achievement is added', () => {
    const onNewAchievement = vi.fn();
    const achievement1 = createMockAchievement('ach-1');
    const achievement2 = createMockAchievement('ach-2');

    const { rerender } = renderHook(
      ({ achievements }) => useAchievementNotifications(achievements, onNewAchievement),
      { initialProps: { achievements: [achievement1] } }
    );

    expect(onNewAchievement).not.toHaveBeenCalled();

    rerender({ achievements: [achievement1, achievement2] });

    expect(onNewAchievement).toHaveBeenCalledWith(achievement2);
    expect(onNewAchievement).toHaveBeenCalledTimes(1);
  });

  it('should not call callback when achievements decrease', () => {
    const onNewAchievement = vi.fn();
    const achievement1 = createMockAchievement('ach-1');
    const achievement2 = createMockAchievement('ach-2');

    const { rerender } = renderHook(
      ({ achievements }) => useAchievementNotifications(achievements, onNewAchievement),
      { initialProps: { achievements: [achievement1, achievement2] } }
    );

    rerender({ achievements: [achievement1] });

    expect(onNewAchievement).not.toHaveBeenCalled();
  });

  it('should work without callback', () => {
    const achievement = createMockAchievement();

    expect(() => {
      renderHook(({ achievements }) => useAchievementNotifications(achievements), {
        initialProps: { achievements: [achievement] },
      });
    }).not.toThrow();
  });
});

// ============================================================================
// useTimer Tests
// ============================================================================

describe('useTimer', () => {
  describe('Initial State', () => {
    it('should initialize as stopwatch (no duration)', () => {
      const { result } = renderHook(() => useTimer());

      expect(result.current.elapsed).toBe(0);
      expect(result.current.remaining).toBeUndefined();
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });

    it('should initialize as countdown with duration', () => {
      const { result } = renderHook(() => useTimer({ duration: 60 }));

      expect(result.current.elapsed).toBe(0);
      expect(result.current.remaining).toBe(60);
      expect(result.current.isRunning).toBe(false);
    });

    it('should auto-start when configured', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      expect(result.current.isRunning).toBe(true);
    });
  });

  describe('Timer Control', () => {
    it('should start timer', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
      expect(result.current.isPaused).toBe(false);
    });

    it('should pause timer', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
      expect(result.current.isRunning).toBe(true);
    });

    it('should resume timer', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      act(() => {
        result.current.pause();
        vi.advanceTimersByTime(1000);
        result.current.resume();
      });

      expect(result.current.isPaused).toBe(false);
      expect(result.current.isRunning).toBe(true);
    });

    it('should stop timer', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isPaused).toBe(false);
    });

    it('should reset timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 60, autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.elapsed).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsed).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isComplete).toBe(false);
    });
  });

  describe('Countdown Timer', () => {
    it('should count down from duration', () => {
      const { result } = renderHook(() => useTimer({ duration: 10, autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsed).toBeGreaterThanOrEqual(3);
      expect(result.current.remaining).toBeLessThanOrEqual(7);
    });

    it('should complete when time runs out', () => {
      const onComplete = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ duration: 5, autoStart: true, onComplete })
      );

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(result.current.isComplete).toBe(true);
      expect(result.current.isRunning).toBe(false);
      expect(onComplete).toHaveBeenCalled();
    });

    it('should not go negative on remaining time', () => {
      const { result } = renderHook(() => useTimer({ duration: 5, autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.remaining).toBe(0);
    });

    it('should call onTick callback', () => {
      const onTick = vi.fn();
      renderHook(() => useTimer({ duration: 60, autoStart: true, onTick }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalled();
      expect(onTick.mock.calls[0][0]).toMatchObject({
        isRunning: true,
        isPaused: false,
        isComplete: false,
      });
    });

    it('should add time to countdown', () => {
      const { result } = renderHook(() => useTimer({ duration: 60, autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      const remainingBefore = result.current.remaining!;

      act(() => {
        result.current.addTime(30);
      });

      expect(result.current.remaining).toBeGreaterThan(remainingBefore);
    });

    it('should not add time to stopwatch', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      const elapsedBefore = result.current.elapsed;

      act(() => {
        result.current.addTime(30);
      });

      // Should have no effect on stopwatch
      expect(result.current.remaining).toBeUndefined();
    });
  });

  describe('Time Formatting', () => {
    it('should format time as mm:ss', () => {
      const { result } = renderHook(() => useTimer({ duration: 125 }));

      expect(result.current.formatTime()).toBe('02:05');
    });

    it('should format time as hh:mm:ss', () => {
      const { result } = renderHook(() => useTimer({ duration: 3665 }));

      expect(result.current.formatTime('hh:mm:ss')).toBe('01:01:05');
    });

    it('should format time as milliseconds', () => {
      const { result } = renderHook(() => useTimer({ duration: 5 }));

      expect(result.current.formatTime('ms')).toBe('5000ms');
    });

    it('should pad single digits with zero', () => {
      const { result } = renderHook(() => useTimer({ duration: 9 }));

      expect(result.current.formatTime()).toBe('00:09');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid start/stop calls', () => {
      const { result } = renderHook(() => useTimer());

      expect(() => {
        act(() => {
          result.current.start();
          result.current.stop();
          result.current.start();
          result.current.stop();
        });
      }).not.toThrow();
    });

    it('should handle pause when not running', () => {
      const { result } = renderHook(() => useTimer());

      expect(() => {
        act(() => {
          result.current.pause();
        });
      }).not.toThrow();
    });

    it('should handle resume when not paused', () => {
      const { result } = renderHook(() => useTimer({ autoStart: true }));

      expect(() => {
        act(() => {
          result.current.resume();
        });
      }).not.toThrow();
    });

    it('should reset and restart when starting completed timer', () => {
      const { result } = renderHook(() => useTimer({ duration: 1, autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isComplete).toBe(true);

      act(() => {
        result.current.start();
      });

      expect(result.current.isComplete).toBe(false);
      expect(result.current.elapsed).toBe(0);
      expect(result.current.isRunning).toBe(true);
    });

    it('should clean up interval on unmount', () => {
      const { unmount } = renderHook(() => useTimer({ autoStart: true }));
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// useInterval Tests
// ============================================================================

describe('useInterval', () => {
  it('should call callback at interval', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('should pause when delay is null', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
      initialProps: { delay: 1000 as number | null },
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ delay: null });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should not have been called again
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should update callback without restarting interval', () => {
    let count = 0;
    const callback1 = vi.fn(() => count++);
    const callback2 = vi.fn(() => (count += 10));

    const { rerender } = renderHook(({ cb }) => useInterval(cb, 1000), {
      initialProps: { cb: callback1 },
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(count).toBe(1);

    rerender({ cb: callback2 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(count).toBe(11); // 1 + 10
  });
});

// ============================================================================
// useDebounce Tests
// ============================================================================

describe('useDebounce', () => {
  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'changed' });
    expect(result.current).toBe('initial'); // Not updated yet

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('changed');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be 'a' because timer kept resetting
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now it should be 'c'
    expect(result.current).toBe('c');
  });
});

// ============================================================================
// useThrottle Tests
// ============================================================================

describe('useThrottle', () => {
  it('should throttle value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 1000), {
      initialProps: { value: 1 },
    });

    expect(result.current).toBe(1);

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });

    // Should still be 1 (throttled)
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should update to latest value
    expect(result.current).toBe(4);
  });
});

// ============================================================================
// useCountdownWithCallbacks Tests
// ============================================================================

describe('useCountdownWithCallbacks', () => {
  it('should trigger callbacks at specific times', () => {
    const callback30 = vi.fn();
    const callback10 = vi.fn();
    const callback0 = vi.fn();

    const { result } = renderHook(() =>
      useCountdownWithCallbacks(60, {
        30: callback30,
        10: callback10,
        0: callback0,
      })
    );

    act(() => {
      result.current.start();
    });

    // Advance to 30 seconds remaining
    act(() => {
      vi.advanceTimersByTime(31000);
    });

    expect(callback30).toHaveBeenCalledTimes(1);
    expect(callback10).not.toHaveBeenCalled();

    // Advance to 10 seconds remaining
    act(() => {
      vi.advanceTimersByTime(21000);
    });

    expect(callback10).toHaveBeenCalledTimes(1);

    // Advance to completion
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(callback0).toHaveBeenCalledTimes(1);
  });

  it('should not trigger same callback twice', () => {
    const callback10 = vi.fn();

    const { result } = renderHook(() =>
      useCountdownWithCallbacks(60, { 10: callback10 })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(51000); // 9 seconds remaining
    });

    expect(callback10).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should still only be called once
    expect(callback10).toHaveBeenCalledTimes(1);
  });

  it('should reset callbacks on timer reset', () => {
    const callback10 = vi.fn();

    const { result } = renderHook(() =>
      useCountdownWithCallbacks(60, { 10: callback10 })
    );

    act(() => {
      result.current.start();
      vi.advanceTimersByTime(51000);
    });

    expect(callback10).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.reset();
      result.current.start();
      vi.advanceTimersByTime(51000);
    });

    // Should be called again after reset
    expect(callback10).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// useTimedChallenge Tests
// ============================================================================

describe('useTimedChallenge', () => {
  it('should calculate time warnings correctly', () => {
    const { result } = renderHook(() => useTimedChallenge(60));

    act(() => {
      result.current.timer.start();
    });

    expect(result.current.isTimeWarning).toBe(false);
    expect(result.current.isCritical).toBe(false);

    // Advance to 20% remaining (12 seconds)
    act(() => {
      vi.advanceTimersByTime(49000);
    });

    expect(result.current.isTimeWarning).toBe(true);
    expect(result.current.isCritical).toBe(false);

    // Advance to 5% remaining (3 seconds)
    act(() => {
      vi.advanceTimersByTime(9000);
    });

    expect(result.current.isCritical).toBe(true);
  });

  it('should calculate percent remaining', () => {
    const { result } = renderHook(() => useTimedChallenge(100));

    act(() => {
      result.current.timer.start();
    });

    expect(result.current.percentRemaining).toBe(100);

    act(() => {
      vi.advanceTimersByTime(50000);
    });

    expect(result.current.percentRemaining).toBeGreaterThanOrEqual(49);
    expect(result.current.percentRemaining).toBeLessThanOrEqual(51);
  });

  it('should call onComplete callback', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTimedChallenge(1, onComplete));

    act(() => {
      result.current.timer.start();
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalled();
  });
});

// ============================================================================
// useScoring Tests
// ============================================================================

describe('useScoring', () => {
  const mockQuestions = [
    createMockQuestion('q1', 'beginner'),
    createMockQuestion('q2', 'intermediate'),
    createMockQuestion('q3', 'advanced'),
  ];

  describe('Initial State', () => {
    it('should initialize with empty results', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      expect(result.current.results).toEqual([]);
      expect(result.current.scoreBreakdown).toBeNull();
      expect(result.current.currentStreak).toBe(0);
    });

    it('should respect enableBonuses option', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions, enableBonuses: false })
      );

      expect(result.current.applyBonuses).toBe(false);
    });
  });

  describe('Adding Results', () => {
    it('should add result and update streak on correct answer', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.currentStreak).toBe(1);
    });

    it('should reset streak on incorrect answer', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
        result.current.addResult(createMockResult('q3', false));
      });

      expect(result.current.currentStreak).toBe(0);
    });

    it('should replace existing result for same question', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', false));
        result.current.addResult(createMockResult('q1', true));
      });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].isCorrect).toBe(true);
    });

    it('should apply bonuses when enabled', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions, enableBonuses: true })
      );

      act(() => {
        result.current.addResult({
          ...createMockResult('q1', true),
          timeSpent: 10, // Fast answer
        });
      });

      // Points should be modified by bonuses
      const addedResult = result.current.results[0];
      expect(addedResult.pointsEarned).toBeGreaterThanOrEqual(10);
    });

    it('should not apply bonuses when disabled', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions, enableBonuses: false })
      );

      act(() => {
        result.current.setApplyBonuses(false);
        result.current.addResult({
          ...createMockResult('q1', true),
          pointsEarned: 10,
        });
      });

      expect(result.current.results[0].pointsEarned).toBe(10);
    });
  });

  describe('Removing and Clearing Results', () => {
    it('should remove specific result', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
      });

      expect(result.current.results).toHaveLength(2);

      act(() => {
        result.current.removeResult('q1');
      });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].questionId).toBe('q2');
    });

    it('should clear all results', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
      });

      act(() => {
        result.current.clearResults();
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.currentStreak).toBe(0);
      expect(result.current.scoreBreakdown).toBeNull();
    });
  });

  describe('Score Calculation', () => {
    it('should calculate final score', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions, passingPercentage: 70 })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
        result.current.addResult(createMockResult('q3', false));
      });

      const score = result.current.calculateFinalScore();

      expect(score.totalQuestions).toBe(3);
      expect(score.correctAnswers).toBe(2);
      expect(score.incorrectAnswers).toBe(1);
      expect(score.percentage).toBeCloseTo(66.67, 0);
    });

    it('should update scoreBreakdown automatically', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      expect(result.current.scoreBreakdown).toBeNull();

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      expect(result.current.scoreBreakdown).not.toBeNull();
      expect(result.current.scoreBreakdown?.totalQuestions).toBe(3);
    });
  });

  describe('Query Methods', () => {
    it('should get question result', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      const questionResult = result.current.getQuestionResult('q1');
      expect(questionResult).toBeDefined();
      expect(questionResult?.questionId).toBe('q1');

      const notFound = result.current.getQuestionResult('q99');
      expect(notFound).toBeUndefined();
    });

    it('should check if question is answered', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      expect(result.current.isQuestionAnswered('q1')).toBe(false);

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      expect(result.current.isQuestionAnswered('q1')).toBe(true);
    });

    it('should get performance metrics', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
      });

      const metrics = result.current.getPerformanceMetrics();
      expect(metrics).toBeDefined();
    });

    it('should get letter grade', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      expect(result.current.getLetterGrade()).toBe('N/A');

      act(() => {
        result.current.addResult(createMockResult('q1', true));
        result.current.addResult(createMockResult('q2', true));
        result.current.addResult(createMockResult('q3', true));
      });

      const grade = result.current.getLetterGrade();
      expect(grade).toBeTruthy();
      expect(typeof grade).toBe('string');
    });

    it('should get exam readiness', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      expect(result.current.getExamReadiness()).toBe(0);

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      const readiness = result.current.getExamReadiness();
      expect(typeof readiness).toBe('number');
    });

    it('should generate report', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions })
      );

      act(() => {
        result.current.addResult(createMockResult('q1', true));
      });

      const report = result.current.generateReport();
      expect(typeof report).toBe('string');
      expect(report.length).toBeGreaterThan(0);
    });
  });

  describe('Bonus Toggle', () => {
    it('should toggle bonus application', () => {
      const { result } = renderHook(() =>
        useScoring({ questions: mockQuestions, enableBonuses: true })
      );

      expect(result.current.applyBonuses).toBe(true);

      act(() => {
        result.current.setApplyBonuses(false);
      });

      expect(result.current.applyBonuses).toBe(false);
    });
  });
});

// ============================================================================
// useRealtimeScore Tests
// ============================================================================

describe('useRealtimeScore', () => {
  it('should calculate real-time score percentage', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', true),
      createMockResult('q3', false),
      createMockResult('q4', true),
    ];

    const { result } = renderHook(() => useRealtimeScore(results));

    expect(result.current).toBe(75); // 3/4 = 75%
  });

  it('should return 0 for empty results', () => {
    const { result } = renderHook(() => useRealtimeScore([]));

    expect(result.current).toBe(0);
  });

  it('should update when results change', () => {
    const { result, rerender } = renderHook(
      ({ results }) => useRealtimeScore(results),
      { initialProps: { results: [createMockResult('q1', true)] } }
    );

    expect(result.current).toBe(100);

    rerender({
      results: [createMockResult('q1', true), createMockResult('q2', false)],
    });

    expect(result.current).toBe(50);
  });
});

// ============================================================================
// useAnswerStreak Tests
// ============================================================================

describe('useAnswerStreak', () => {
  it('should track current streak from most recent answers', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', false),
      createMockResult('q3', true),
      createMockResult('q4', true),
      createMockResult('q5', true),
    ];

    const { result } = renderHook(() => useAnswerStreak(results));

    expect(result.current.current).toBe(3); // Last 3 correct
  });

  it('should track maximum streak', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', true),
      createMockResult('q3', true),
      createMockResult('q4', true),
      createMockResult('q5', false),
      createMockResult('q6', true),
      createMockResult('q7', true),
    ];

    const { result } = renderHook(() => useAnswerStreak(results));

    expect(result.current.current).toBe(2); // Current streak
    expect(result.current.max).toBe(4); // Maximum was 4
  });

  it('should handle all incorrect answers', () => {
    const results = [
      createMockResult('q1', false),
      createMockResult('q2', false),
    ];

    const { result } = renderHook(() => useAnswerStreak(results));

    expect(result.current.current).toBe(0);
    expect(result.current.max).toBe(0);
  });

  it('should handle empty results', () => {
    const { result } = renderHook(() => useAnswerStreak([]));

    expect(result.current.current).toBe(0);
    expect(result.current.max).toBe(0);
  });
});

// ============================================================================
// useDomainProgress Tests
// ============================================================================

describe('useDomainProgress', () => {
  const questions = [
    createMockQuestion('q1', 'beginner'),
    createMockQuestion('q2', 'intermediate'),
    createMockQuestion('q3', 'advanced'),
  ];

  it('should calculate domain-specific progress', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', true),
    ];

    const { result } = renderHook(() =>
      useDomainProgress(results, questions, 'networking-concepts')
    );

    expect(result.current).toBeGreaterThan(0);
  });

  it('should return 0 for domain with no questions', () => {
    const { result } = renderHook(() =>
      useDomainProgress([], questions, 'non-existent-domain')
    );

    expect(result.current).toBe(0);
  });

  it('should return 0 for empty results', () => {
    const { result } = renderHook(() =>
      useDomainProgress([], questions, 'networking-concepts')
    );

    expect(result.current).toBe(0);
  });
});

// ============================================================================
// useTimeTracking Tests
// ============================================================================

describe('useTimeTracking', () => {
  it('should calculate time statistics', () => {
    const results = [
      createMockResult('q1', true), // 30s
      { ...createMockResult('q2', true), timeSpent: 45 },
      { ...createMockResult('q3', true), timeSpent: 60 },
    ];

    const { result } = renderHook(() => useTimeTracking(results));

    expect(result.current.totalTime).toBe(135);
    expect(result.current.avgTime).toBe(45);
    expect(result.current.fastestTime).toBe(30);
    expect(result.current.slowestTime).toBe(60);
  });

  it('should return zeros for empty results', () => {
    const { result } = renderHook(() => useTimeTracking([]));

    expect(result.current).toEqual({
      totalTime: 0,
      avgTime: 0,
      fastestTime: 0,
      slowestTime: 0,
    });
  });
});

// ============================================================================
// useScorePrediction Tests
// ============================================================================

describe('useScorePrediction', () => {
  it('should predict best and worst case scenarios', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', true),
      createMockResult('q3', false),
    ];

    const { result } = renderHook(() => useScorePrediction(results, 10));

    expect(result.current.current).toBeCloseTo(66.67, 0);
    expect(result.current.bestCase).toBe(90); // 2 + 7 remaining = 9/10
    expect(result.current.worstCase).toBe(20); // Just the 2 correct
  });

  it('should handle no results', () => {
    const { result } = renderHook(() => useScorePrediction([], 10));

    expect(result.current.current).toBe(0);
    expect(result.current.bestCase).toBe(100);
    expect(result.current.worstCase).toBe(0);
  });

  it('should handle all questions answered', () => {
    const results = [
      createMockResult('q1', true),
      createMockResult('q2', true),
      createMockResult('q3', false),
    ];

    const { result } = renderHook(() => useScorePrediction(results, 3));

    expect(result.current.current).toBeCloseTo(66.67, 0);
    expect(result.current.bestCase).toBeCloseTo(66.67, 0);
    expect(result.current.worstCase).toBeCloseTo(66.67, 0);
  });
});
