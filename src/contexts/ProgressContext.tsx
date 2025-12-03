/**
 * Progress Context Provider
 * DEPRECATED: This is now a thin wrapper around progressStore for backward compatibility.
 * New code should use `useProgressStore` from '../stores/progressStore' directly.
 *
 * This context delegates all operations to the Zustand progressStore, ensuring
 * a single source of truth for progress state.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useProgressStore } from '../stores/progressStore';

interface ProgressContextValue {
  overallProgress: {
    totalCompleted: number;
    totalComponents: number;
    percentage: number;
    averageScore: number;
  };
  trackTimeSpent: (componentId: string, seconds: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

/**
 * ProgressProvider - Wraps the Zustand progressStore for backward compatibility
 */
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getOverallProgress = useProgressStore((state) => state.getOverallProgress);
  const updateComponentProgress = useProgressStore((state) => state.updateComponentProgress);
  const componentProgress = useProgressStore((state) => state.componentProgress);

  const [overallProgress, setOverallProgress] = useState(getOverallProgress());

  useEffect(() => {
    // Update overall progress when component progress changes
    setOverallProgress(getOverallProgress());
  }, [getOverallProgress, componentProgress]);

  const trackTimeSpent = useCallback((componentId: string, seconds: number) => {
    updateComponentProgress(componentId, {
      timeSpent: seconds,
      lastVisited: new Date().toISOString(),
    });
  }, [updateComponentProgress]);

  const value = useMemo(() => ({
    overallProgress,
    trackTimeSpent,
  }), [overallProgress, trackTimeSpent]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * Hook to use progress
 * Works both with ProgressProvider (context) or standalone (direct Zustand store).
 * For new code, consider using `useProgressStore` from '../stores/progressStore' directly.
 */
export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  const store = useProgressStore();

  // If context is available, use it (component wrapped in ProgressProvider)
  if (context !== undefined) {
    return context;
  }

  // Otherwise, use Zustand store directly (works without provider)
  // This ensures tests work without wrapping components in ProgressProvider
  return {
    overallProgress: store.getOverallProgress(),
    trackTimeSpent: (componentId: string, seconds: number) => {
      store.updateComponentProgress(componentId, {
        timeSpent: seconds,
        lastVisited: new Date().toISOString(),
      });
    },
  };
};
