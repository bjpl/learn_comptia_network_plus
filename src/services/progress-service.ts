/**
 * Progress Service
 * Handles progress tracking and synchronization with backend
 */

import { apiClient } from './api-client';
import { API_ENDPOINTS, shouldUseMockAPI } from '../config/api-config';
import { mockApiDelay } from '../utils/auth';

export interface ComponentProgress {
  componentId: string;
  completed: boolean;
  score?: number;
  timeSpent: number;
  lastVisited: string;
  attempts: number;
}

export interface CategoryProgress {
  categoryId: string;
  componentsCompleted: number;
  totalComponents: number;
  averageScore: number;
  totalTimeSpent: number;
}

export interface ProgressSyncData {
  componentProgress: Record<string, ComponentProgress>;
  lastSyncedAt: string;
  version: number;
}

export interface ProgressConflict {
  local: ComponentProgress;
  remote: ComponentProgress;
  resolution: 'local' | 'remote' | 'merge';
}

/**
 * Get all progress
 */
export const getAllProgress = async (): Promise<Record<string, ComponentProgress>> => {
  if (shouldUseMockAPI()) {
    return mockGetAllProgress();
  }

  const response = await apiClient.get<{ progress: Record<string, ComponentProgress> }>(
    API_ENDPOINTS.PROGRESS.GET_ALL
  );

  return response.data.progress;
};

interface StoredProgressData {
  state?: {
    componentProgress?: Record<string, ComponentProgress>;
  };
}

/**
 * Mock get all progress
 */
const mockGetAllProgress = async (): Promise<Record<string, ComponentProgress>> => {
  await mockApiDelay(400);

  const progressStr = localStorage.getItem('comptia-network-plus-progress');
  if (!progressStr) {
    return {};
  }

  try {
    const data = JSON.parse(progressStr) as StoredProgressData;
    return data.state?.componentProgress || {};
  } catch {
    return {};
  }
};

/**
 * Get component progress
 */
export const getComponentProgress = async (
  componentId: string
): Promise<ComponentProgress | null> => {
  if (shouldUseMockAPI()) {
    return mockGetComponentProgress(componentId);
  }

  const response = await apiClient.get<{ progress: ComponentProgress }>(
    API_ENDPOINTS.PROGRESS.GET_COMPONENT(componentId)
  );

  return response.data.progress;
};

/**
 * Mock get component progress
 */
const mockGetComponentProgress = async (componentId: string): Promise<ComponentProgress | null> => {
  await mockApiDelay(200);

  const allProgress = await mockGetAllProgress();
  return allProgress[componentId] || null;
};

/**
 * Update component progress
 */
export const updateComponentProgress = async (
  componentId: string,
  progress: Partial<ComponentProgress>
): Promise<ComponentProgress> => {
  if (shouldUseMockAPI()) {
    return mockUpdateComponentProgress(componentId, progress);
  }

  const response = await apiClient.put<{ progress: ComponentProgress }>(
    API_ENDPOINTS.PROGRESS.UPDATE_COMPONENT(componentId),
    progress
  );

  return response.data.progress;
};

/**
 * Mock update component progress
 */
const mockUpdateComponentProgress = async (
  componentId: string,
  progress: Partial<ComponentProgress>
): Promise<ComponentProgress> => {
  await mockApiDelay(300);

  const progressStr = localStorage.getItem('comptia-network-plus-progress');
  const data: StoredProgressData = progressStr
    ? (JSON.parse(progressStr) as StoredProgressData)
    : { state: { componentProgress: {} } };

  if (!data.state) {
    data.state = { componentProgress: {} };
  }
  if (!data.state.componentProgress) {
    data.state.componentProgress = {};
  }

  const existing: ComponentProgress = data.state.componentProgress[componentId] || {
    componentId,
    completed: false,
    timeSpent: 0,
    attempts: 0,
    lastVisited: new Date().toISOString(),
  };

  const updated: ComponentProgress = {
    ...existing,
    ...progress,
    lastVisited: new Date().toISOString(),
  };

  data.state.componentProgress[componentId] = updated;
  localStorage.setItem('comptia-network-plus-progress', JSON.stringify(data));

  return updated;
};

/**
 * Sync progress with backend
 */
export const syncProgress = async (
  localProgress: Record<string, ComponentProgress>
): Promise<ProgressSyncData> => {
  if (shouldUseMockAPI()) {
    return mockSyncProgress(localProgress);
  }

  const response = await apiClient.post<ProgressSyncData>(API_ENDPOINTS.PROGRESS.SYNC, {
    progress: localProgress,
  });

  return response.data;
};

/**
 * Mock sync progress
 */
const mockSyncProgress = async (
  localProgress: Record<string, ComponentProgress>
): Promise<ProgressSyncData> => {
  await mockApiDelay(600);

  // Simulate sync by storing in localStorage
  const syncData: ProgressSyncData = {
    componentProgress: localProgress,
    lastSyncedAt: new Date().toISOString(),
    version: Date.now(),
  };

  localStorage.setItem('progress_sync', JSON.stringify(syncData));

  return syncData;
};

/**
 * Resolve progress conflicts
 */
export const resolveConflicts = (
  local: Record<string, ComponentProgress>,
  remote: Record<string, ComponentProgress>
): {
  resolved: Record<string, ComponentProgress>;
  conflicts: ProgressConflict[];
} => {
  const resolved: Record<string, ComponentProgress> = {};
  const conflicts: ProgressConflict[] = [];

  // Get all unique component IDs
  const allIds = new Set([...Object.keys(local), ...Object.keys(remote)]);

  allIds.forEach((componentId) => {
    const localProgress = local[componentId];
    const remoteProgress = remote[componentId];

    // Only in local
    if (localProgress && !remoteProgress) {
      resolved[componentId] = localProgress;
      return;
    }

    // Only in remote
    if (!localProgress && remoteProgress) {
      resolved[componentId] = remoteProgress;
      return;
    }

    // In both - resolve conflict
    if (localProgress && remoteProgress) {
      const localTime = new Date(localProgress.lastVisited).getTime();
      const remoteTime = new Date(remoteProgress.lastVisited).getTime();

      // Use most recent
      if (localTime > remoteTime) {
        resolved[componentId] = localProgress;
        conflicts.push({
          local: localProgress,
          remote: remoteProgress,
          resolution: 'local',
        });
      } else if (remoteTime > localTime) {
        resolved[componentId] = remoteProgress;
        conflicts.push({
          local: localProgress,
          remote: remoteProgress,
          resolution: 'remote',
        });
      } else {
        // Same timestamp - merge
        resolved[componentId] = {
          ...remoteProgress,
          ...localProgress,
          score: Math.max(localProgress.score || 0, remoteProgress.score || 0),
          timeSpent: Math.max(localProgress.timeSpent, remoteProgress.timeSpent),
          attempts: Math.max(localProgress.attempts, remoteProgress.attempts),
          completed: localProgress.completed || remoteProgress.completed,
        };
        conflicts.push({
          local: localProgress,
          remote: remoteProgress,
          resolution: 'merge',
        });
      }
    }
  });

  return { resolved, conflicts };
};

interface QueuedProgressUpdate {
  componentId: string;
  progress: Partial<ComponentProgress>;
  timestamp: string;
}

/**
 * Queue progress update for offline sync
 */
export const queueProgressUpdate = (
  componentId: string,
  progress: Partial<ComponentProgress>
): void => {
  const queueStr = localStorage.getItem('progress_queue');
  const queue: QueuedProgressUpdate[] = queueStr
    ? (JSON.parse(queueStr) as QueuedProgressUpdate[])
    : [];

  queue.push({
    componentId,
    progress,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem('progress_queue', JSON.stringify(queue));
};

/**
 * Process queued progress updates
 */
export const processProgressQueue = async (): Promise<void> => {
  const queueStr = localStorage.getItem('progress_queue');
  if (!queueStr) {
    return;
  }

  const queue = JSON.parse(queueStr) as QueuedProgressUpdate[];
  if (queue.length === 0) {
    return;
  }

  console.warn(`Processing ${queue.length} queued progress updates...`);

  for (const item of queue) {
    try {
      await updateComponentProgress(item.componentId, item.progress);
    } catch (error) {
      console.error('Failed to process queued progress update:', error);
      // Keep in queue to retry later
      return;
    }
  }

  // Clear queue on success
  localStorage.removeItem('progress_queue');
  console.warn('Progress queue processed successfully');
};

/**
 * Reset all progress
 */
export const resetProgress = async (): Promise<void> => {
  if (shouldUseMockAPI()) {
    await mockResetProgress();
    return;
  }

  await apiClient.post(API_ENDPOINTS.PROGRESS.RESET);
};

/**
 * Mock reset progress
 */
const mockResetProgress = async (): Promise<void> => {
  await mockApiDelay(400);

  const progressStr = localStorage.getItem('comptia-network-plus-progress');
  if (progressStr) {
    const data = JSON.parse(progressStr) as StoredProgressData;
    if (data.state) {
      data.state.componentProgress = {};
      localStorage.setItem('comptia-network-plus-progress', JSON.stringify(data));
    }
  }
};

/**
 * Get category progress
 */
export const getCategoryProgress = (
  allProgress: Record<string, ComponentProgress>,
  categoryId: string
): CategoryProgress => {
  const categoryComponents = Object.values(allProgress).filter((p) =>
    p.componentId.startsWith(categoryId)
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
};

/**
 * Get overall progress
 */
export const getOverallProgress = (
  allProgress: Record<string, ComponentProgress>,
  totalComponents: number = 23
): {
  totalCompleted: number;
  totalComponents: number;
  percentage: number;
  averageScore: number;
} => {
  const allProgressArray = Object.values(allProgress);
  const completed = allProgressArray.filter((p) => p.completed).length;
  const scores = allProgressArray.filter((p) => p.score !== undefined).map((p) => p.score!);
  const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return {
    totalCompleted: completed,
    totalComponents,
    percentage: (completed / totalComponents) * 100,
    averageScore,
  };
};
