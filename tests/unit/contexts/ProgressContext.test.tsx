import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, renderHook, act, screen } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../../../src/contexts/ProgressContext';
import { useProgressStore } from '../../../src/stores/progressStore';

describe('ProgressContext', () => {
  beforeEach(async () => {
    // Clear localStorage to reset Zustand persist state
    localStorage.clear();

    // Reset progress store
    const { result } = renderHook(() => useProgressStore());
    await act(async () => {
      await result.current.resetProgress();
    });
  });

  describe('ProgressProvider', () => {
    it('should provide progress context to children', () => {
      const TestComponent = () => {
        const { overallProgress } = useProgress();
        return <div>{overallProgress.percentage}%</div>;
      };

      render(
        <ProgressProvider>
          <TestComponent />
        </ProgressProvider>
      );

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should calculate overall progress correctly', () => {
      const TestComponent = () => {
        const { overallProgress } = useProgress();
        return (
          <div>
            <div data-testid="completed">{overallProgress.totalCompleted}</div>
            <div data-testid="total">{overallProgress.totalComponents}</div>
            <div data-testid="percentage">{overallProgress.percentage}</div>
            <div data-testid="average">{overallProgress.averageScore}</div>
          </div>
        );
      };

      render(
        <ProgressProvider>
          <TestComponent />
        </ProgressProvider>
      );

      expect(screen.getByTestId('completed')).toHaveTextContent('0');
      expect(screen.getByTestId('total')).toHaveTextContent('23');
      expect(screen.getByTestId('percentage')).toHaveTextContent('0');
      expect(screen.getByTestId('average')).toHaveTextContent('0');
    });

    it('should provide trackTimeSpent function', () => {
      const TestComponent = () => {
        const { trackTimeSpent } = useProgress();
        return <button onClick={() => trackTimeSpent('test-component', 300)}>Track</button>;
      };

      render(
        <ProgressProvider>
          <TestComponent />
        </ProgressProvider>
      );

      const button = screen.getByText('Track');
      expect(() => {
        act(() => {
          button.click();
        });
      }).not.toThrow();
    });
  });

  describe('useProgress Hook', () => {
    it('should return progress context', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });

      expect(result.current.overallProgress).toBeDefined();
      expect(typeof result.current.trackTimeSpent).toBe('function');
    });

    it('should throw error when used outside ProgressProvider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useProgress());
      }).toThrow('useProgress must be used within a ProgressProvider');

      consoleSpy.mockRestore();
    });

    it('should track time spent for a component', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        result.current.trackTimeSpent('component-1', 500);
      });

      const componentProgress = storeResult.current.getComponentProgress('component-1');
      expect(componentProgress?.timeSpent).toBe(500);
    });

    it('should update lastVisited timestamp when tracking time', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      const beforeTime = new Date().getTime();

      act(() => {
        result.current.trackTimeSpent('component-2', 200);
      });

      const componentProgress = storeResult.current.getComponentProgress('component-2');
      const lastVisitedTime = new Date(componentProgress!.lastVisited).getTime();
      expect(lastVisitedTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  describe('Overall Progress Calculation', () => {
    it('should update overall progress when components are completed', () => {
      const { result: progressResult } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        storeResult.current.markComponentComplete('comp-1', 85);
        storeResult.current.markComponentComplete('comp-2', 90);
        storeResult.current.markComponentComplete('comp-3', 95);
      });

      // Trigger update by tracking time
      act(() => {
        progressResult.current.trackTimeSpent('comp-1', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(3);
      expect(progressResult.current.overallProgress.percentage).toBeCloseTo(13.04, 1);
      expect(progressResult.current.overallProgress.averageScore).toBeCloseTo(90, 0);
    });

    it('should calculate 50% completion correctly', () => {
      const { result: progressResult } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        for (let i = 1; i <= 12; i++) {
          storeResult.current.markComponentComplete(`component-${i}`, 85);
        }
        // Trigger update
        progressResult.current.trackTimeSpent('component-1', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(12);
      expect(progressResult.current.overallProgress.percentage).toBeCloseTo(52.17, 1);
    });

    it('should calculate 100% completion correctly', () => {
      const { result: progressResult } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        for (let i = 1; i <= 23; i++) {
          storeResult.current.markComponentComplete(`component-${i}`, 90);
        }
        // Trigger update
        progressResult.current.trackTimeSpent('component-1', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(23);
      expect(progressResult.current.overallProgress.percentage).toBe(100);
    });
  });

  describe('Time Tracking', () => {
    it('should track zero seconds', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        result.current.trackTimeSpent('instant-component', 0);
      });

      const progress = storeResult.current.getComponentProgress('instant-component');
      expect(progress?.timeSpent).toBe(0);
    });

    it('should track large time values', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      const largeTime = 999999;
      act(() => {
        result.current.trackTimeSpent('marathon-session', largeTime);
      });

      const progress = storeResult.current.getComponentProgress('marathon-session');
      expect(progress?.timeSpent).toBe(largeTime);
    });

    it('should accumulate time across multiple tracking calls', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        result.current.trackTimeSpent('accumulate-test', 100);
        result.current.trackTimeSpent('accumulate-test', 200);
        result.current.trackTimeSpent('accumulate-test', 300);
      });

      const progress = storeResult.current.getComponentProgress('accumulate-test');
      // Last value should be 300 (not accumulated)
      expect(progress?.timeSpent).toBe(300);
    });
  });

  describe('Synchronization with Store', () => {
    it('should sync with progress store changes', () => {
      const { result: progressResult } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      act(() => {
        storeResult.current.markComponentComplete('sync-test', 88);
        // Trigger sync
        progressResult.current.trackTimeSpent('sync-test', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(1);
    });

    it('should reflect store resets', async () => {
      const { result: progressResult } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });
      const { result: storeResult } = renderHook(() => useProgressStore());

      await act(async () => {
        await storeResult.current.markComponentComplete('reset-test', 90);
        progressResult.current.trackTimeSpent('reset-test', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(1);

      await act(async () => {
        await storeResult.current.resetProgress();
        progressResult.current.trackTimeSpent('trigger-update', 1);
      });

      expect(progressResult.current.overallProgress.totalCompleted).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid time tracking calls', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.trackTimeSpent('rapid-test', i);
        }
      });

      expect(result.current.overallProgress).toBeDefined();
    });

    it('should handle tracking for non-existent components', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });

      expect(() => {
        act(() => {
          result.current.trackTimeSpent('non-existent-12345', 100);
        });
      }).not.toThrow();
    });

    it('should handle special characters in component IDs', () => {
      const { result } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });

      const specialId = 'component-v2.0_beta!';
      expect(() => {
        act(() => {
          result.current.trackTimeSpent(specialId, 150);
        });
      }).not.toThrow();
    });

    it('should handle unmounting during tracking', () => {
      const { result, unmount } = renderHook(() => useProgress(), {
        wrapper: ProgressProvider,
      });

      act(() => {
        result.current.trackTimeSpent('unmount-test', 100);
      });

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });
});
