import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as progressService from '../services/progress-service';
import { parseApiError, logError } from '../utils/api/error-handler';
import { networkStatusManager } from '../utils/api/network-status';

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
  // State
  componentProgress: Record<string, ComponentProgress>;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;

  // Component progress actions
  updateComponentProgress: (
    componentId: string,
    progress: Partial<ComponentProgress>
  ) => Promise<void>;
  getComponentProgress: (componentId: string) => ComponentProgress | undefined;
  markComponentComplete: (componentId: string, score?: number) => Promise<void>;

  // Category progress
  getCategoryProgress: (categoryId: string) => CategoryProgress;

  // Overall progress
  getOverallProgress: () => {
    totalCompleted: number;
    totalComponents: number;
    percentage: number;
    averageScore: number;
  };

  // Sync actions
  syncProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;

  // Reset
  resetProgress: () => Promise<void>;
  resetComponentProgress: (componentId: string) => void;
  clearError: () => void;
}

const TOTAL_COMPONENTS = 23;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Initial state
      componentProgress: {},
      isSyncing: false,
      lastSyncedAt: null,
      error: null,

      /**
       * Update component progress with API sync
       */
      updateComponentProgress: async (componentId, progress) => {
        // Update local state immediately
        set((state) => {
          const existing = state.componentProgress[componentId];
          return {
            componentProgress: {
              ...state.componentProgress,
              [componentId]: {
                ...existing, // Preserve existing properties first
                ...progress, // Apply updates
                componentId, // Ensure these core fields are set
                completed: progress.completed ?? existing?.completed ?? false,
                timeSpent: progress.timeSpent ?? existing?.timeSpent ?? 0,
                attempts: progress.attempts ?? existing?.attempts ?? 0,
                lastVisited: new Date().toISOString(),
              },
            },
          };
        });

        // Sync with API
        try {
          if (networkStatusManager.getStatus()) {
            await progressService.updateComponentProgress(componentId, progress);
          } else {
            // Queue for later sync
            progressService.queueProgressUpdate(componentId, progress);
          }
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Update Progress');
          // Don't throw - keep local update even if sync fails
        }
      },

      /**
       * Get component progress
       */
      getComponentProgress: (componentId) => {
        const state = get();
        return state.componentProgress[componentId];
      },

      /**
       * Mark component complete with API sync
       */
      markComponentComplete: async (componentId, score) => {
        const state = get();
        const existing = state.componentProgress[componentId] || {
          componentId,
          completed: false,
          timeSpent: 0,
          attempts: 0,
          lastVisited: new Date().toISOString(),
        };

        const updated = {
          ...existing,
          completed: true,
          score,
          lastVisited: new Date().toISOString(),
          attempts: existing.attempts + 1,
        };

        // Update local state
        set({
          componentProgress: {
            ...state.componentProgress,
            [componentId]: updated,
          },
        });

        // Sync with API
        try {
          if (networkStatusManager.getStatus()) {
            await progressService.updateComponentProgress(componentId, updated);
          } else {
            progressService.queueProgressUpdate(componentId, updated);
          }
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Mark Complete');
        }
      },

      /**
       * Get category progress
       */
      getCategoryProgress: (categoryId) => {
        const state = get();
        return progressService.getCategoryProgress(state.componentProgress, categoryId);
      },

      /**
       * Get overall progress
       */
      getOverallProgress: () => {
        const state = get();
        return progressService.getOverallProgress(state.componentProgress, TOTAL_COMPONENTS);
      },

      /**
       * Sync progress with backend
       */
      syncProgress: async () => {
        set({ isSyncing: true, error: null });

        try {
          const state = get();
          const syncData = await progressService.syncProgress(state.componentProgress);

          // Resolve conflicts
          const { resolved, conflicts } = progressService.resolveConflicts(
            state.componentProgress,
            syncData.componentProgress
          );

          if (conflicts.length > 0) {
            console.warn(`Resolved ${conflicts.length} progress conflicts`);
          }

          set({
            componentProgress: resolved,
            lastSyncedAt: syncData.lastSyncedAt,
            isSyncing: false,
          });

          // Process any queued updates
          await progressService.processProgressQueue();
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Sync Progress');

          set({
            isSyncing: false,
            error: apiError.userMessage,
          });
        }
      },

      /**
       * Load progress from backend
       */
      loadProgress: async () => {
        set({ isSyncing: true, error: null });

        try {
          const progress = await progressService.getAllProgress();

          set({
            componentProgress: progress,
            lastSyncedAt: new Date().toISOString(),
            isSyncing: false,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Load Progress');

          set({
            isSyncing: false,
            error: apiError.userMessage,
          });
        }
      },

      /**
       * Reset all progress
       */
      resetProgress: async () => {
        set({ isSyncing: true, error: null });

        try {
          await progressService.resetProgress();

          set({
            componentProgress: {},
            isSyncing: false,
          });
        } catch (error) {
          const apiError = parseApiError(error);
          logError(apiError, 'Reset Progress');

          set({
            isSyncing: false,
            error: apiError.userMessage,
          });

          throw apiError;
        }
      },

      /**
       * Reset component progress
       */
      resetComponentProgress: (componentId) =>
        set((state) => {
          const { [componentId]: _, ...rest } = state.componentProgress;
          return { componentProgress: rest };
        }),

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'comptia-network-plus-progress',
      onRehydrateStorage: () => (state) => {
        // Sync progress after hydration if online
        if (state && networkStatusManager.getStatus()) {
          state.syncProgress();
        }
      },
    }
  )
);

// Setup network status listener for auto-sync
networkStatusManager.subscribe((isOnline) => {
  if (isOnline) {
    console.warn('Network restored - syncing progress...');
    useProgressStore.getState().syncProgress();
  }
});
