import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ComponentProgress {
  componentId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  lastVisited: string;
  attempts: number;
}

interface CategoryProgress {
  categoryId: string;
  componentsCompleted: number;
  totalComponents: number;
  averageScore: number;
  totalTimeSpent: number;
}

interface ProgressState {
  // Component progress
  componentProgress: Record<string, ComponentProgress>;
  updateComponentProgress: (componentId: string, progress: Partial<ComponentProgress>) => void;
  getComponentProgress: (componentId: string) => ComponentProgress | undefined;
  markComponentComplete: (componentId: string, score?: number) => void;

  // Category progress
  getCategoryProgress: (categoryId: string) => CategoryProgress;

  // Overall progress
  getOverallProgress: () => {
    totalCompleted: number;
    totalComponents: number;
    percentage: number;
    averageScore: number;
  };

  // Reset
  resetProgress: () => void;
  resetComponentProgress: (componentId: string) => void;
}

const TOTAL_COMPONENTS = 23;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      componentProgress: {},

      updateComponentProgress: (componentId, progress) =>
        set((state) => ({
          componentProgress: {
            ...state.componentProgress,
            [componentId]: {
              ...state.componentProgress[componentId],
              componentId,
              completed: false,
              timeSpent: 0,
              attempts: 0,
              lastVisited: new Date().toISOString(),
              ...progress,
            },
          },
        })),

      getComponentProgress: (componentId) => {
        const state = get();
        return state.componentProgress[componentId];
      },

      markComponentComplete: (componentId, score) =>
        set((state) => {
          const existing = state.componentProgress[componentId] || {
            componentId,
            completed: false,
            timeSpent: 0,
            attempts: 0,
            lastVisited: new Date().toISOString(),
          };

          return {
            componentProgress: {
              ...state.componentProgress,
              [componentId]: {
                ...existing,
                completed: true,
                score,
                lastVisited: new Date().toISOString(),
                attempts: existing.attempts + 1,
              },
            },
          };
        }),

      getCategoryProgress: (categoryId) => {
        const state = get();
        const categoryComponents = Object.values(state.componentProgress).filter(
          (p) => p.componentId.startsWith(categoryId)
        );

        const completed = categoryComponents.filter((p) => p.completed).length;
        const totalTimeSpent = categoryComponents.reduce((sum, p) => sum + p.timeSpent, 0);
        const scores = categoryComponents.filter((p) => p.score !== undefined).map((p) => p.score!);
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        return {
          categoryId,
          componentsCompleted: completed,
          totalComponents: categoryComponents.length,
          averageScore,
          totalTimeSpent,
        };
      },

      getOverallProgress: () => {
        const state = get();
        const allProgress = Object.values(state.componentProgress);
        const completed = allProgress.filter((p) => p.completed).length;
        const scores = allProgress.filter((p) => p.score !== undefined).map((p) => p.score!);
        const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

        return {
          totalCompleted: completed,
          totalComponents: TOTAL_COMPONENTS,
          percentage: (completed / TOTAL_COMPONENTS) * 100,
          averageScore,
        };
      },

      resetProgress: () => set({ componentProgress: {} }),

      resetComponentProgress: (componentId) =>
        set((state) => {
          const { [componentId]: _, ...rest } = state.componentProgress;
          return { componentProgress: rest };
        }),
    }),
    {
      name: 'comptia-network-plus-progress',
    }
  )
);
