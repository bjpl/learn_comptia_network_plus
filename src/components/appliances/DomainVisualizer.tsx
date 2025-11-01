import React from 'react';
import type { ComparisonDevice } from './appliances-types';

interface DomainVisualizerProps {
  device: ComparisonDevice;
}

const DomainVisualizer: React.FC<DomainVisualizerProps> = ({ device }) => {
  const renderCollisionDomains = () => {
    const portCount = device.specs.portCount || 0;

    if (device.collisionDomains === 'single') {
      return (
        <div className="rounded-lg border-2 border-red-500 bg-red-50 p-4 dark:bg-red-900">
          <div className="mb-2 text-center font-semibold text-red-900 dark:text-red-100">
            Single Collision Domain (All Ports Share)
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(portCount, 16) }).map((_, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded bg-red-200 text-xs font-semibold text-red-900 dark:bg-red-700 dark:text-red-100"
              >
                {i + 1}
              </div>
            ))}
            {portCount > 16 && (
              <div className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-red-900 dark:text-red-100">
                ...
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-red-800 dark:text-red-200">
            All ports compete for bandwidth - collisions occur
          </div>
        </div>
      );
    }

    if (device.collisionDomains === 'per-port') {
      return (
        <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 dark:bg-green-900">
          <div className="mb-2 text-center font-semibold text-green-900 dark:text-green-100">
            {portCount} Collision Domains (One Per Port)
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(portCount, 16) }).map((_, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded border-2 border-green-600 bg-green-100 text-xs font-semibold text-green-900 dark:border-green-500 dark:bg-green-700 dark:text-green-100"
              >
                {i + 1}
              </div>
            ))}
            {portCount > 16 && (
              <div className="flex h-8 w-8 items-center justify-center text-xs font-semibold text-green-900 dark:text-green-100">
                +{portCount - 16}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-green-800 dark:text-green-200">
            Each port is isolated - no collisions, full-duplex
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
        <div className="text-center text-sm text-gray-600">
          No collision domains (operates above Layer 2)
        </div>
      </div>
    );
  };

  const renderBroadcastDomains = () => {
    const portCount = device.specs.portCount || 0;

    if (device.broadcastDomains === 'single') {
      return (
        <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4 dark:bg-blue-900">
          <div className="mb-2 text-center font-semibold text-blue-900 dark:text-blue-100">
            Single Broadcast Domain
          </div>
          <div className="rounded border-2 border-dashed border-blue-400 bg-blue-100 p-3 dark:border-blue-600 dark:bg-blue-800">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: Math.min(portCount, 16) }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded bg-blue-200 text-xs text-blue-900 dark:bg-blue-700 dark:text-blue-100"
                >
                  {i + 1}
                </div>
              ))}
              {portCount > 16 && (
                <div className="flex h-6 w-6 items-center justify-center text-xs text-blue-900 dark:text-blue-100">
                  ...
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-800 dark:text-blue-200">
            Broadcasts sent to all ports (can be segmented with VLANs)
          </div>
        </div>
      );
    }

    if (device.broadcastDomains === 'per-port') {
      return (
        <div className="rounded-lg border-2 border-purple-500 bg-purple-50 p-4 dark:bg-purple-900">
          <div className="mb-2 text-center font-semibold text-purple-900 dark:text-purple-100">
            {portCount} Broadcast Domains (Separated by Routing)
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(portCount, 8) }).map((_, i) => (
              <div
                key={i}
                className="rounded border-2 border-purple-600 bg-purple-100 p-2 text-center dark:border-purple-500 dark:bg-purple-800"
              >
                <div className="text-xs font-semibold text-purple-900 dark:text-purple-100">
                  Port {i + 1}
                </div>
                <div className="mt-1 text-[10px] text-purple-700 dark:text-purple-300">
                  Separate Network
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-purple-800 dark:text-purple-200">
            Each interface connects to different network - broadcasts isolated
          </div>
        </div>
      );
    }

    if (device.broadcastDomains === 'per-vlan') {
      return (
        <div className="rounded-lg border-2 border-indigo-500 bg-indigo-50 p-4 dark:bg-indigo-900">
          <div className="mb-2 text-center font-semibold text-indigo-900 dark:text-indigo-100">
            Multiple Broadcast Domains (VLANs)
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded border-2 border-indigo-600 bg-indigo-100 p-3 dark:border-indigo-500 dark:bg-indigo-800">
              <div className="mb-1 text-xs font-semibold text-indigo-900 dark:text-indigo-100">
                VLAN 10
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                ))}
              </div>
            </div>
            <div className="rounded border-2 border-indigo-600 bg-indigo-100 p-3 dark:border-indigo-500 dark:bg-indigo-800">
              <div className="mb-1 text-xs font-semibold text-indigo-900 dark:text-indigo-100">
                VLAN 20
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                ))}
              </div>
            </div>
            <div className="rounded border-2 border-indigo-600 bg-indigo-100 p-3 dark:border-indigo-500 dark:bg-indigo-800">
              <div className="mb-1 text-xs font-semibold text-indigo-900 dark:text-indigo-100">
                VLAN 30
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-4 rounded bg-indigo-200 dark:bg-indigo-700" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-800 dark:text-indigo-200">
            VLANs create logical broadcast domain separation
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
        <div className="text-center text-sm text-gray-600">
          No broadcast domain impact (application layer device)
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Collision Domains
        </h4>
        {renderCollisionDomains()}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Broadcast Domains
        </h4>
        {renderBroadcastDomains()}
      </div>

      {device.domainNotes && (
        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900">
          <div className="text-xs font-semibold text-yellow-900 dark:text-yellow-200">
            Exam Note:
          </div>
          <div className="mt-1 text-sm text-yellow-800 dark:text-yellow-300">
            {device.domainNotes}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Quick Reference:
        </div>
        <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold text-red-700 dark:text-red-400">Collision Domain:</span>{' '}
            Network segment where packets can collide
          </div>
          <div>
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              Broadcast Domain:
            </span>{' '}
            Network segment where broadcasts propagate
          </div>
          <div className="mt-2 border-t pt-2">
            <strong>Hub:</strong> 1 collision domain (all ports), 1 broadcast domain
          </div>
          <div>
            <strong>Switch:</strong> Collision domain per port, 1 broadcast domain (or per VLAN)
          </div>
          <div>
            <strong>Router:</strong> Collision domain per port, broadcast domain per port
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainVisualizer;
