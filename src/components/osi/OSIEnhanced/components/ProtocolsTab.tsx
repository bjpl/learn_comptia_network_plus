/**
 * Protocols & Ports tab component
 */

import React from 'react';
import type { OSILayerNumber } from '../../osi-types';
import { PROTOCOLS, LAYER_COLORS, LAYER_NAMES } from '../../osi-data';

interface ProtocolsTabProps {
  showPortNumbers: boolean;
  onTogglePortNumbers: (checked: boolean) => void;
}

export const ProtocolsTab: React.FC<ProtocolsTabProps> = ({
  showPortNumbers,
  onTogglePortNumbers,
}) => {
  return (
    <div
      className="space-y-6"
      role="tabpanel"
      id="protocols-panel"
      aria-labelledby="protocols-tab"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Protocols & Port Numbers
        </h2>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showPortNumbers}
            onChange={(e) => onTogglePortNumbers(e.target.checked)}
            className="h-4 w-4 rounded text-blue-600"
            aria-label="Show or hide port numbers"
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">Show Port Numbers</span>
        </label>
      </div>

      {[7, 6, 5, 4, 3, 2, 1].map((layerNum) => {
        const layer = layerNum as OSILayerNumber;
        const protocols = PROTOCOLS.filter((p) => p.layer === layer);

        return (
          <div key={layer} className="space-y-3">
            <h3
              className="flex items-center gap-3 text-lg font-bold"
              style={{ color: LAYER_COLORS[layer] }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded font-bold text-white"
                style={{ backgroundColor: LAYER_COLORS[layer] }}
              >
                {layer}
              </div>
              {LAYER_NAMES[layer]} Layer
              <span className="text-sm text-gray-800 dark:text-gray-200">
                ({protocols.length} protocols)
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {protocols.map((protocol) => (
                <div
                  key={protocol.name}
                  className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                        {protocol.name}
                      </div>
                      {showPortNumbers && protocol.port && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            :{protocol.port}
                          </span>
                          {protocol.transport && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                              {protocol.transport}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                        {protocol.description}
                      </p>
                    </div>
                    {protocol.examImportance && (
                      <span
                        className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${protocol.examImportance === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''} ${protocol.examImportance === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : ''} ${protocol.examImportance === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''} ${protocol.examImportance === 'low' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' : ''} `}
                      >
                        {protocol.examImportance}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
