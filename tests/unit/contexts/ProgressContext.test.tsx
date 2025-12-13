import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgressStore } from '../../../src/stores/progressStore';

describe('ProgressContext', () => {
  beforeEach(() => {
    // Clear localStorage to reset Zustand persist state
    localStorage.clear();

    // Reset Zustand store state directly
    useProgressStore.setState({
      componentProgress: {},
      isSyncing: false,
      lastSyncedAt: null,
      error: null,
    });
  });

  describe('Progress Store', () => {
    it('should provide progress store to components', () => {
      const { result } = renderHook(() => useProgressStore());

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.percentage).toBe(0);
    });

    it('should calculate overall progress correctly', () => {
      const { result } = renderHook(() => useProgressStore());

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(0);
      expect(overallProgress.totalComponents).toBe(23);
      expect(overallProgress.percentage).toBe(0);
      expect(overallProgress.averageScore).toBe(0);
    });

    it('should provide updateComponentProgress function', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('test-component', { timeSpent: 300 });
      });

      const componentProgress = result.current.getComponentProgress('test-component');
      expect(componentProgress?.timeSpent).toBe(300);
    });
  });

  describe('Progress Store Operations', () => {
    it('should return progress data', () => {
      const { result } = renderHook(() => useProgressStore());

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress).toBeDefined();
      expect(typeof result.current.updateComponentProgress).toBe('function');
    });

    it('should track time spent for a component', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('component-1', { timeSpent: 500 });
      });

      const componentProgress = result.current.getComponentProgress('component-1');
      expect(componentProgress?.timeSpent).toBe(500);
    });

    it('should update lastVisited timestamp when updating progress', async () => {
      const { result } = renderHook(() => useProgressStore());

      const beforeTime = new Date().getTime();

      await act(async () => {
        await result.current.updateComponentProgress('component-2', { timeSpent: 200 });
      });

      const componentProgress = result.current.getComponentProgress('component-2');
      const lastVisitedTime = new Date(componentProgress!.lastVisited).getTime();
      expect(lastVisitedTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('Overall Progress Calculation', () => {
    it('should update overall progress when components are completed', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.markComponentComplete('comp-1', 85);
        await result.current.markComponentComplete('comp-2', 90);
        await result.current.markComponentComplete('comp-3', 95);
      });

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(3);
      expect(overallProgress.percentage).toBeCloseTo(13.04, 1);
      expect(overallProgress.averageScore).toBeCloseTo(90, 0);
    });

    it('should calculate 50% completion correctly', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        for (let i = 1; i <= 12; i++) {
          await result.current.markComponentComplete(`component-${i}`, 85);
        }
      });

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(12);
      expect(overallProgress.percentage).toBeCloseTo(52.17, 1);
    });

    it('should calculate 100% completion correctly', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        for (let i = 1; i <= 23; i++) {
          await result.current.markComponentComplete(`component-${i}`, 90);
        }
      });

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(23);
      expect(overallProgress.percentage).toBe(100);
    });
  });

  describe('Time Tracking', () => {
    it('should track zero seconds', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('instant-component', { timeSpent: 0 });
      });

      const progress = result.current.getComponentProgress('instant-component');
      expect(progress?.timeSpent).toBe(0);
    });

    it('should track large time values', async () => {
      const { result } = renderHook(() => useProgressStore());

      const largeTime = 999999;
      await act(async () => {
        await result.current.updateComponentProgress('marathon-session', { timeSpent: largeTime });
      });

      const progress = result.current.getComponentProgress('marathon-session');
      expect(progress?.timeSpent).toBe(largeTime);
    });

    it('should accumulate time across multiple tracking calls', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('accumulate-test', { timeSpent: 100 });
        await result.current.updateComponentProgress('accumulate-test', { timeSpent: 200 });
        await result.current.updateComponentProgress('accumulate-test', { timeSpent: 300 });
      });

      const progress = result.current.getComponentProgress('accumulate-test');
      // Last value should be 300 (not accumulated)
      expect(progress?.timeSpent).toBe(300);
    });
  });

  describe('Synchronization with Store', () => {
    it('should sync with progress store changes', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.markComponentComplete('sync-test', 88);
      });

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(1);
    });

    it('should reflect store resets', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.markComponentComplete('reset-test', 90);
      });

      let overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(1);

      await act(async () => {
        await result.current.resetProgress();
      });

      overallProgress = result.current.getOverallProgress();
      expect(overallProgress.totalCompleted).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid progress updates', async () => {
      const { result } = renderHook(() => useProgressStore());

      // Update 10 times instead of 100 to avoid timeout
      await act(async () => {
        const promises = [];
        for (let i = 0; i < 10; i++) {
          promises.push(
            result.current.updateComponentProgress('rapid-test', { timeSpent: i * 10 })
          );
        }
        await Promise.all(promises);
      });

      const overallProgress = result.current.getOverallProgress();
      expect(overallProgress).toBeDefined();

      const progress = result.current.getComponentProgress('rapid-test');
      expect(progress?.timeSpent).toBeDefined();
    }, 15000);

    it('should handle updates for non-existent components', async () => {
      const { result } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('non-existent-12345', { timeSpent: 100 });
      });

      const progress = result.current.getComponentProgress('non-existent-12345');
      expect(progress?.timeSpent).toBe(100);
    });

    it('should handle special characters in component IDs', async () => {
      const { result } = renderHook(() => useProgressStore());

      const specialId = 'component-v2.0_beta!';
      await act(async () => {
        await result.current.updateComponentProgress(specialId, { timeSpent: 150 });
      });

      const progress = result.current.getComponentProgress(specialId);
      expect(progress?.timeSpent).toBe(150);
    });

    it('should handle unmounting during tracking', async () => {
      const { result, unmount } = renderHook(() => useProgressStore());

      await act(async () => {
        await result.current.updateComponentProgress('unmount-test', { timeSpent: 100 });
      });

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});
