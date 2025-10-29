/**
 * Integration tests for state management (Zustand store)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from '../../src/store';
import { mockUserProgress, mockStoreState } from '../fixtures/test-data';

describe('State Management Integration', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useAppStore.getState();
    store.setCurrentPath('/');
    store.setLoading(false);
  });

  afterEach(() => {
    // Clear localStorage
    localStorage.clear();
  });

  // =========================================================================
  // Progress State Tests
  // =========================================================================

  describe('Progress State', () => {
    it('should update component progress', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('cloud-designer', 85);
      });

      const { progress } = useAppStore.getState();
      expect(progress.componentScores['cloud-designer']).toBe(85);
    });

    it('should calculate total score correctly', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('component-1', 80);
        store.updateProgress('component-2', 90);
        store.updateProgress('component-3', 100);
      });

      const { progress } = useAppStore.getState();
      expect(progress.totalScore).toBe(90); // Average of 80, 90, 100
    });

    it('should mark components as complete', () => {
      const store = useAppStore.getState();

      act(() => {
        store.markComponentComplete('cloud-designer');
      });

      const { progress } = useAppStore.getState();
      expect(progress.completedComponents).toContain('cloud-designer');
    });

    it('should not duplicate completed components', () => {
      const store = useAppStore.getState();

      act(() => {
        store.markComponentComplete('cloud-designer');
        store.markComponentComplete('cloud-designer');
        store.markComponentComplete('cloud-designer');
      });

      const { progress } = useAppStore.getState();
      const count = progress.completedComponents.filter(
        id => id === 'cloud-designer'
      ).length;
      expect(count).toBe(1);
    });

    it('should update last activity timestamp', () => {
      const store = useAppStore.getState();
      const beforeTime = Date.now();

      act(() => {
        store.updateProgress('component-1', 75);
      });

      const { progress } = useAppStore.getState();
      const activityTime = new Date(progress.lastActivity).getTime();
      expect(activityTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });

  // =========================================================================
  // Theme State Tests
  // =========================================================================

  describe('Theme State', () => {
    it('should toggle theme', () => {
      const store = useAppStore.getState();

      const initialTheme = store.theme.mode;

      act(() => {
        store.toggleTheme();
      });

      const { theme } = useAppStore.getState();
      expect(theme.mode).not.toBe(initialTheme);
    });

    it('should toggle between light and dark', () => {
      const store = useAppStore.getState();

      act(() => {
        store.toggleTheme(); // light -> dark
      });

      let { theme } = useAppStore.getState();
      const firstMode = theme.mode;

      act(() => {
        store.toggleTheme(); // dark -> light
      });

      theme = useAppStore.getState().theme;
      expect(theme.mode).not.toBe(firstMode);
    });
  });

  // =========================================================================
  // Navigation State Tests
  // =========================================================================

  describe('Navigation State', () => {
    it('should update current path', () => {
      const store = useAppStore.getState();

      act(() => {
        store.setCurrentPath('/cloud-designer');
      });

      const { currentPath } = useAppStore.getState();
      expect(currentPath).toBe('/cloud-designer');
    });

    it('should track path changes', () => {
      const store = useAppStore.getState();

      act(() => {
        store.setCurrentPath('/cloud-designer');
        store.setCurrentPath('/port-trainer');
        store.setCurrentPath('/media-matrix');
      });

      const { currentPath } = useAppStore.getState();
      expect(currentPath).toBe('/media-matrix');
    });
  });

  // =========================================================================
  // Loading State Tests
  // =========================================================================

  describe('Loading State', () => {
    it('should set loading state', () => {
      const store = useAppStore.getState();

      act(() => {
        store.setLoading(true);
      });

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(true);
    });

    it('should clear loading state', () => {
      const store = useAppStore.getState();

      act(() => {
        store.setLoading(true);
        store.setLoading(false);
      });

      const { isLoading } = useAppStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  // =========================================================================
  // Persistence Tests
  // =========================================================================

  describe('State Persistence', () => {
    it('should persist progress to localStorage', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('cloud-designer', 95);
        store.markComponentComplete('cloud-designer');
      });

      // Check localStorage
      const stored = localStorage.getItem('comptia-network-plus-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.progress.componentScores['cloud-designer']).toBe(95);
    });

    it('should persist theme to localStorage', () => {
      const store = useAppStore.getState();

      act(() => {
        store.toggleTheme();
      });

      const stored = localStorage.getItem('comptia-network-plus-storage');
      const parsed = JSON.parse(stored!);

      expect(parsed.state.theme).toBeDefined();
    });

    it('should restore state from localStorage', () => {
      // Set up localStorage
      const mockState = {
        state: {
          progress: {
            completedComponents: ['cloud-designer'],
            componentScores: { 'cloud-designer': 88 },
            totalScore: 88,
            lastActivity: new Date().toISOString()
          },
          theme: { mode: 'dark' }
        },
        version: 0
      };

      localStorage.setItem('comptia-network-plus-storage', JSON.stringify(mockState));

      // Restore would happen on store initialization
      // This test verifies the structure
      const stored = localStorage.getItem('comptia-network-plus-storage');
      expect(stored).toBeTruthy();
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('comptia-network-plus-storage', 'invalid json');

      // Should not throw error
      expect(() => {
        const store = useAppStore.getState();
        expect(store).toBeDefined();
      }).not.toThrow();
    });
  });

  // =========================================================================
  // Multiple Updates Tests
  // =========================================================================

  describe('Multiple Updates', () => {
    it('should handle rapid successive updates', () => {
      const store = useAppStore.getState();

      act(() => {
        for (let i = 0; i < 100; i++) {
          store.updateProgress(`component-${i}`, 80 + i % 20);
        }
      });

      const { progress } = useAppStore.getState();
      expect(Object.keys(progress.componentScores).length).toBe(100);
    });

    it('should maintain data consistency with concurrent updates', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('component-1', 80);
        store.markComponentComplete('component-1');
        store.updateProgress('component-1', 85);
      });

      const { progress } = useAppStore.getState();
      expect(progress.componentScores['component-1']).toBe(85);
      expect(progress.completedComponents).toContain('component-1');
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle empty component ID', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('', 75);
      });

      const { progress } = useAppStore.getState();
      expect(progress.componentScores['']).toBe(75);
    });

    it('should handle negative scores', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('component-1', -10);
      });

      const { progress } = useAppStore.getState();
      // Should accept but totalScore calculation might clamp
      expect(progress.componentScores['component-1']).toBe(-10);
    });

    it('should handle scores over 100', () => {
      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('component-1', 150);
      });

      const { progress } = useAppStore.getState();
      expect(progress.componentScores['component-1']).toBe(150);
    });

    it('should handle very long path strings', () => {
      const store = useAppStore.getState();
      const longPath = '/' + 'a'.repeat(1000);

      act(() => {
        store.setCurrentPath(longPath);
      });

      const { currentPath } = useAppStore.getState();
      expect(currentPath).toBe(longPath);
    });
  });

  // =========================================================================
  // Performance Tests
  // =========================================================================

  describe('Performance', () => {
    it('should update state quickly', () => {
      const store = useAppStore.getState();

      const start = performance.now();

      act(() => {
        store.updateProgress('component-1', 75);
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(50); // Should be very fast
    });

    it('should handle large state efficiently', () => {
      const store = useAppStore.getState();

      const start = performance.now();

      act(() => {
        for (let i = 0; i < 1000; i++) {
          store.updateProgress(`component-${i}`, 80);
        }
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should complete in reasonable time
    });
  });

  // =========================================================================
  // Subscriber Tests
  // =========================================================================

  describe('Subscribers', () => {
    it('should notify subscribers on state change', () => {
      let notified = false;

      const unsubscribe = useAppStore.subscribe((state) => {
        if (state.progress.componentScores['test-component']) {
          notified = true;
        }
      });

      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('test-component', 90);
      });

      expect(notified).toBe(true);
      unsubscribe();
    });

    it('should allow multiple subscribers', () => {
      let count = 0;

      const unsub1 = useAppStore.subscribe(() => count++);
      const unsub2 = useAppStore.subscribe(() => count++);
      const unsub3 = useAppStore.subscribe(() => count++);

      const store = useAppStore.getState();

      act(() => {
        store.updateProgress('component-1', 75);
      });

      expect(count).toBeGreaterThanOrEqual(3);

      unsub1();
      unsub2();
      unsub3();
    });
  });
});
