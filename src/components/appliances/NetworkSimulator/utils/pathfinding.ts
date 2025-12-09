import type { NetworkConnection, SimulatedDevice } from '../types';

/**
 * Find path between devices using BFS algorithm
 */
export function findPath(
  sourceId: string,
  targetId: string,
  connections: NetworkConnection[],
  _devices: SimulatedDevice[]
): string[] {
  const queue: Array<{ deviceId: string; path: string[] }> = [{ deviceId: sourceId, path: [] }];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.deviceId === targetId) {
      return current.path;
    }

    const neighborConnections = connections.filter(
      (conn) => conn.sourceId === current.deviceId || conn.targetId === current.deviceId
    );

    for (const conn of neighborConnections) {
      const nextDeviceId = conn.sourceId === current.deviceId ? conn.targetId : conn.sourceId;

      if (!visited.has(nextDeviceId)) {
        visited.add(nextDeviceId);
        queue.push({
          deviceId: nextDeviceId,
          path: [...current.path, conn.id],
        });
      }
    }
  }

  return [];
}
