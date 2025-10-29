import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../../../src/stores/progressStore';
import { act, renderHook } from '@testing-library/react';

describe('progressStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useProgressStore());
    act(() => {
      result.current.resetProgress();
    });
  });

  describe('Component Progress', () => {
    it('should initialize with empty component progress', () => {
      const { result } = renderHook(() => useProgressStore());
      expect(result.current.componentProgress).toEqual({});
    });

    it('should update component progress', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.updateComponentProgress('osi-layer-builder', {
          timeSpent: 300,
          attempts: 1,
        });
      });

      const progress = result.current.getComponentProgress('osi-layer-builder');
      expect(progress).toBeDefined();
      expect(progress?.timeSpent).toBe(300);
      expect(progress?.attempts).toBe(1);
      expect(progress?.completed).toBe(false);
    });

    it('should mark component as complete', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('cloud-architecture', 95);
      });

      const progress = result.current.getComponentProgress('cloud-architecture');
      expect(progress?.completed).toBe(true);
      expect(progress?.score).toBe(95);
      expect(progress?.attempts).toBe(1);
    });

    it('should increment attempts when marking complete multiple times', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('ports-trainer', 80);
        result.current.markComponentComplete('ports-trainer', 90);
        result.current.markComponentComplete('ports-trainer', 95);
      });

      const progress = result.current.getComponentProgress('ports-trainer');
      expect(progress?.attempts).toBe(3);
      expect(progress?.score).toBe(95);
    });

    it('should return undefined for non-existent component', () => {
      const { result } = renderHook(() => useProgressStore());
      const progress = result.current.getComponentProgress('non-existent');
      expect(progress).toBeUndefined();
    });

    it('should track time spent across multiple sessions', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.updateComponentProgress('topology-analyzer', { timeSpent: 100 });
        result.current.updateComponentProgress('topology-analyzer', { timeSpent: 150 });
      });

      const progress = result.current.getComponentProgress('topology-analyzer');
      expect(progress?.timeSpent).toBe(150);
    });

    it('should update lastVisited timestamp', () => {
      const { result } = renderHook(() => useProgressStore());
      const beforeTime = new Date().toISOString();

      act(() => {
        result.current.updateComponentProgress('ipv4-troubleshooter', { timeSpent: 50 });
      });

      const progress = result.current.getComponentProgress('ipv4-troubleshooter');
      expect(progress?.lastVisited).toBeDefined();
      expect(new Date(progress!.lastVisited).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeTime).getTime()
      );
    });
  });

  describe('Category Progress', () => {
    it('should calculate category progress with no components', () => {
      const { result } = renderHook(() => useProgressStore());
      const categoryProgress = result.current.getCategoryProgress('osi');

      expect(categoryProgress.componentsCompleted).toBe(0);
      expect(categoryProgress.totalComponents).toBe(0);
      expect(categoryProgress.averageScore).toBe(0);
      expect(categoryProgress.totalTimeSpent).toBe(0);
    });

    it('should calculate category progress with completed components', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('cloud-summary', 85);
        result.current.markComponentComplete('cloud-architecture', 90);
        result.current.updateComponentProgress('cloud-summary', { timeSpent: 200 });
        result.current.updateComponentProgress('cloud-architecture', { timeSpent: 300 });
      });

      const categoryProgress = result.current.getCategoryProgress('cloud');
      expect(categoryProgress.componentsCompleted).toBe(2);
      expect(categoryProgress.totalComponents).toBe(2);
      expect(categoryProgress.averageScore).toBe(87.5);
      expect(categoryProgress.totalTimeSpent).toBe(500);
    });

    it('should calculate average score correctly', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('ports-trainer', 70);
        result.current.markComponentComplete('ports-scanner', 80);
        result.current.markComponentComplete('ports-demo', 90);
      });

      const categoryProgress = result.current.getCategoryProgress('ports');
      expect(categoryProgress.averageScore).toBe(80);
    });

    it('should handle mixed completed and incomplete components', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('ipv4-subnet', 95);
        result.current.updateComponentProgress('ipv4-troubleshooter', {
          timeSpent: 100,
          completed: false
        });
      });

      const categoryProgress = result.current.getCategoryProgress('ipv4');
      expect(categoryProgress.componentsCompleted).toBe(1);
      expect(categoryProgress.totalComponents).toBe(2);
    });
  });

  describe('Overall Progress', () => {
    it('should calculate overall progress with no completion', () => {
      const { result } = renderHook(() => useProgressStore());
      const overall = result.current.getOverallProgress();

      expect(overall.totalCompleted).toBe(0);
      expect(overall.totalComponents).toBe(23);
      expect(overall.percentage).toBe(0);
      expect(overall.averageScore).toBe(0);
    });

    it('should calculate overall progress with some completions', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('component-1', 80);
        result.current.markComponentComplete('component-2', 90);
        result.current.markComponentComplete('component-3', 85);
      });

      const overall = result.current.getOverallProgress();
      expect(overall.totalCompleted).toBe(3);
      expect(overall.percentage).toBeCloseTo(13.04, 1);
      expect(overall.averageScore).toBeCloseTo(85, 0);
    });

    it('should calculate 100% completion correctly', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        for (let i = 1; i <= 23; i++) {
          result.current.markComponentComplete(`component-${i}`, 90);
        }
      });

      const overall = result.current.getOverallProgress();
      expect(overall.totalCompleted).toBe(23);
      expect(overall.percentage).toBe(100);
    });

    it('should ignore incomplete components in score calculation', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('comp-1', 100);
        result.current.updateComponentProgress('comp-2', {
          timeSpent: 50,
          completed: false
        });
      });

      const overall = result.current.getOverallProgress();
      expect(overall.averageScore).toBe(100);
    });
  });

  describe('Reset Functions', () => {
    it('should reset all progress', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('test-1', 80);
        result.current.markComponentComplete('test-2', 90);
        result.current.resetProgress();
      });

      expect(result.current.componentProgress).toEqual({});
      const overall = result.current.getOverallProgress();
      expect(overall.totalCompleted).toBe(0);
    });

    it('should reset specific component progress', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('keep-this', 85);
        result.current.markComponentComplete('delete-this', 90);
        result.current.resetComponentProgress('delete-this');
      });

      expect(result.current.getComponentProgress('keep-this')).toBeDefined();
      expect(result.current.getComponentProgress('delete-this')).toBeUndefined();
    });

    it('should handle resetting non-existent component', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.resetComponentProgress('non-existent');
      });

      expect(result.current.componentProgress).toEqual({});
    });
  });

  describe('Persistence', () => {
    it('should persist component progress across store instances', () => {
      const { result: result1 } = renderHook(() => useProgressStore());
      act(() => {
        result1.current.markComponentComplete('persistent-test', 88);
      });

      const { result: result2 } = renderHook(() => useProgressStore());
      const progress = result2.current.getComponentProgress('persistent-test');
      expect(progress?.completed).toBe(true);
      expect(progress?.score).toBe(88);
    });
  });

  describe('Edge Cases', () => {
    it('should handle score of 0', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('zero-score', 0);
      });

      const progress = result.current.getComponentProgress('zero-score');
      expect(progress?.score).toBe(0);
      expect(progress?.completed).toBe(true);
    });

    it('should handle perfect score of 100', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.markComponentComplete('perfect-score', 100);
      });

      const progress = result.current.getComponentProgress('perfect-score');
      expect(progress?.score).toBe(100);
    });

    it('should handle zero time spent', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.updateComponentProgress('instant-complete', { timeSpent: 0 });
      });

      const progress = result.current.getComponentProgress('instant-complete');
      expect(progress?.timeSpent).toBe(0);
    });

    it('should handle very large time spent values', () => {
      const { result } = renderHook(() => useProgressStore());
      const largeTime = 999999;
      act(() => {
        result.current.updateComponentProgress('marathon-session', { timeSpent: largeTime });
      });

      const progress = result.current.getComponentProgress('marathon-session');
      expect(progress?.timeSpent).toBe(largeTime);
    });

    it('should handle component IDs with special characters', () => {
      const { result } = renderHook(() => useProgressStore());
      const specialId = 'test-component_v2.0';
      act(() => {
        result.current.markComponentComplete(specialId, 85);
      });

      const progress = result.current.getComponentProgress(specialId);
      expect(progress?.completed).toBe(true);
    });

    it('should handle rapid sequential updates', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.updateComponentProgress('rapid-test', { timeSpent: 10 });
        result.current.updateComponentProgress('rapid-test', { timeSpent: 20 });
        result.current.updateComponentProgress('rapid-test', { timeSpent: 30 });
        result.current.updateComponentProgress('rapid-test', { timeSpent: 40 });
      });

      const progress = result.current.getComponentProgress('rapid-test');
      expect(progress?.timeSpent).toBe(40);
    });
  });
});
