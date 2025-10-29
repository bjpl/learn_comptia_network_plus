import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, Theme } from '../types';

interface AppState {
  // Progress tracking
  progress: UserProgress;
  updateProgress: (componentId: string, score: number) => void;
  markComponentComplete: (componentId: string) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Navigation
  currentPath: string;
  setCurrentPath: (path: string) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial progress state
      progress: {
        completedComponents: [],
        componentScores: {},
        totalScore: 0,
        lastActivity: new Date(),
      },

      // Progress actions
      updateProgress: (componentId: string, score: number) =>
        set((state) => {
          const newScores = { ...state.progress.componentScores, [componentId]: score };
          const totalScore = Object.values(newScores).reduce((sum: number, s: number) => sum + s, 0) / Object.keys(newScores).length;

          return {
            progress: {
              ...state.progress,
              componentScores: newScores,
              totalScore,
              lastActivity: new Date(),
            },
          };
        }),

      markComponentComplete: (componentId: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            componentsCompleted: [...new Set([...state.progress.componentsCompleted, componentId])],
            lastActivity: new Date(),
          },
        })),

      // Theme state and actions
      theme: { mode: 'light' },
      toggleTheme: () =>
        set((state) => ({
          theme: { mode: state.theme.mode === 'light' ? 'dark' : 'light' },
        })),

      // Navigation state and actions
      currentPath: '/',
      setCurrentPath: (path: string) => set({ currentPath: path }),

      // Loading state
      isLoading: false,
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'comptia-network-plus-storage',
      partialize: (state) => ({
        progress: state.progress,
        theme: state.theme,
      }),
    }
  )
);
