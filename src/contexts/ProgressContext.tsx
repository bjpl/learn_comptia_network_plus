import React, { createContext, useContext, useEffect, useState } from 'react';
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

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getOverallProgress = useProgressStore((state) => state.getOverallProgress);
  const updateComponentProgress = useProgressStore((state) => state.updateComponentProgress);

  const [overallProgress, setOverallProgress] = useState(getOverallProgress());

  useEffect(() => {
    // Update overall progress when component progress changes
    setOverallProgress(getOverallProgress());
  }, [getOverallProgress]);

  const trackTimeSpent = (componentId: string, seconds: number) => {
    updateComponentProgress(componentId, {
      timeSpent: seconds,
      lastVisited: new Date().toISOString(),
    });
    setOverallProgress(getOverallProgress());
  };

  return (
    <ProgressContext.Provider value={{ overallProgress, trackTimeSpent }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
