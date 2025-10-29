import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress } from '../types';

interface Theme {
  mode: 'light' | 'dark';
}

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
        userId: 'default-user',
        componentsCompleted: [],
        domainsCompleted: [],
        totalTimeSpent: 0,
        lastAccessed: new Date(),
        overallProgress: 0,
        domainProgress: new Map(),
        achievements: [],
        streak: 0
      },

      // Progress actions
      updateProgress: (_componentId: string, _score: number) =>
        set((state) => ({
          progress: {
            ...state.progress,
            lastAccessed: new Date(),
          },
        })),

      markComponentComplete: (componentId: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            componentsCompleted: [...new Set([...state.progress.componentsCompleted, componentId])],
            lastAccessed: new Date(),
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
